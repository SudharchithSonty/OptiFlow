"""Replan service - end-to-end reschedule from disruption events.

Orchestrates the full replan flow:
1. Create agent job record
2. Generate proposal using RescheduleAgentService
3. Validate proposal
4. Create child run
5. Apply constraints and run scheduler
6. Compute impact summary
7. Update agent job with results
"""

import json
import logging
import time
from datetime import datetime
from pathlib import Path
from typing import Any, Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import settings
from backend.app.models import (
    Run,
    RunStatus,
    RunTrigger,
    Event,
    Artifact,
    ArtifactKind,
    AgentJob,
    AgentJobType,
    AgentJobTrigger,
    AgentJobStatus,
)
from backend.app.models.run import sanitize_run_id
from backend.app.services.scheduling import (
    run_schedulers,
    write_schedule_artifacts,
    compute_impact_summary,
    SchedulingError,
)

logger = logging.getLogger(__name__)


class ReplanError(Exception):
    """Raised when replan fails."""
    
    def __init__(
        self, 
        message: str, 
        errors: Optional[list[str]] = None,
        agent_job_id: Optional[UUID] = None,
    ):
        self.message = message
        self.errors = errors or []
        self.agent_job_id = agent_job_id
        super().__init__(message)


async def create_replan_from_event(
    db: AsyncSession,
    org_id: UUID,
    parent_run_id: str,
    event_id: UUID,
    user_id: Optional[UUID] = None,
    trigger_source: str = AgentJobTrigger.EVENT_LOGGED.value,
    run_name: Optional[str] = None,
) -> dict[str, Any]:
    """Create a replan (child run) from a disruption event.
    
    Args:
        db: Database session
        org_id: Organization ID
        parent_run_id: Parent run's run_id (string)
        event_id: Event that triggered this replan
        user_id: Optional user who triggered (if planner_click)
        trigger_source: What triggered this replan
        run_name: Optional name for child run
        
    Returns:
        Dict with agent_job_id, child_run_id, status, and any errors
        
    Raises:
        ReplanError: If replan fails
    """
    start_time = time.time()
    
    # Get parent run
    parent_result = await db.execute(
        select(Run).where(Run.org_id == org_id, Run.run_id == parent_run_id)
    )
    parent_run = parent_result.scalar_one_or_none()
    
    if parent_run is None:
        raise ReplanError(f"Parent run not found: {parent_run_id}")
    
    if parent_run.status != RunStatus.COMPLETED.value:
        raise ReplanError(
            f"Parent run must be completed. Current status: {parent_run.status}"
        )
    
    # Get event
    event_result = await db.execute(
        select(Event).where(Event.id == event_id, Event.org_id == org_id)
    )
    event = event_result.scalar_one_or_none()
    
    if event is None:
        raise ReplanError(f"Event not found: {event_id}")
    
    # Create agent job record
    agent_job = AgentJob(
        org_id=org_id,
        run_id=parent_run.id,
        input_event_id=event_id,
        created_by_user_id=user_id,
        job_type=AgentJobType.DISRUPTION_REPLAN.value,
        trigger_source=trigger_source,
        status=AgentJobStatus.QUEUED.value,
    )
    db.add(agent_job)
    await db.commit()
    await db.refresh(agent_job)
    
    logger.info(f"Created agent job {agent_job.id} for replan")
    
    try:
        # Mark job as running
        agent_job.mark_running()
        await db.commit()
        
        # Import agent service (import here to avoid circular imports)
        from agent.reschedule_service import (
            RescheduleAgentService,
            build_constraint_overrides,
        )
        
        # Generate proposal
        parent_run_dir = settings.get_runs_path(str(org_id), parent_run_id)
        agent = RescheduleAgentService(parent_run_dir, org_id=str(org_id))
        
        proposal_result = agent.generate_proposal(
            event_type=event.event_type,
            event_payload=event.payload or {},
            event_title=event.title,
        )
        
        proposal = proposal_result["proposal"]
        mode = proposal_result["mode"]
        validation_passed = proposal_result["validation_passed"]
        errors = proposal_result["errors"]
        
        if not validation_passed:
            # Mark as validation failed
            duration_ms = int((time.time() - start_time) * 1000)
            agent_job.mark_validation_failed(errors, duration_ms)
            await db.commit()
            
            return {
                "agent_job_id": agent_job.id,
                "child_run_id": None,
                "status": AgentJobStatus.VALIDATION_FAILED.value,
                "validation_errors": errors,
            }
        
        # Generate child run name
        if not run_name:
            timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
            run_name = f"{parent_run.run_name}_replan_{timestamp}"
        
        child_run_id_str = sanitize_run_id(run_name)
        
        # Create child run
        child_run = Run(
            org_id=org_id,
            created_by_user_id=user_id,
            parent_run_id=parent_run.id,
            trigger=RunTrigger.RESCHEDULE.value,
            reschedule_mode=proposal.reschedule_mode,
            reschedule_from_ts=proposal.reschedule_from_ts,
            run_name=run_name,
            run_id=child_run_id_str,
            seed=parent_run.seed,
            status=RunStatus.CREATED.value,
        )
        db.add(child_run)
        await db.commit()
        await db.refresh(child_run)
        
        # Update agent job with child run
        agent_job.child_run_id = child_run.id
        await db.commit()
        
        # Set up child run directory
        child_run_dir = settings.get_runs_path(str(org_id), child_run_id_str)
        child_run_dir.mkdir(parents=True, exist_ok=True)
        
        # Copy data from parent
        import shutil
        parent_data_dir = parent_run_dir / "data"
        child_data_dir = child_run_dir / "data"
        
        if parent_data_dir.exists():
            shutil.copytree(parent_data_dir, child_data_dir, dirs_exist_ok=True)
        
        # Save proposal artifact
        agent.save_proposal_artifact(
            child_run_dir,
            proposal,
            mode,
            proposal_result["generation_time_ms"],
        )
        
        # Build constraint overrides from proposal
        constraint_overrides = build_constraint_overrides(proposal)
        
        # Update child run status
        child_run.status = RunStatus.SCHEDULING.value
        await db.commit()
        
        # Run schedulers
        try:
            schedule_results = run_schedulers(
                child_run_dir,
                seed=child_run.seed,
                constraint_overrides=constraint_overrides,
            )
        except SchedulingError as e:
            child_run.status = RunStatus.FAILED.value
            child_run.error_message = str(e)[:1000]
            
            duration_ms = int((time.time() - start_time) * 1000)
            agent_job.mark_failed(str(e), duration_ms)
            await db.commit()
            
            raise ReplanError(
                f"Scheduling failed: {e}",
                agent_job_id=agent_job.id,
            )
        
        # Write schedule artifacts
        schedule_results["scenario_meta"]["run_id"] = child_run_id_str
        written_artifacts = write_schedule_artifacts(
            child_run_dir,
            child_run_id_str,
            schedule_results,
        )
        
        # Record artifacts in DB
        artifact_paths = {}
        for filename, kind in written_artifacts:
            filepath = child_run_dir / filename
            artifact = Artifact(
                run_id=child_run.id,
                kind=kind,
                path=str(filepath.relative_to(settings.runs_dir)),
                size_bytes=filepath.stat().st_size,
            )
            db.add(artifact)
            artifact_paths[kind] = str(filepath)
        
        # Compute impact summary
        parent_kpis = agent._load_artifact("kpi_optimized.json") or {}
        parent_schedule_data = agent._load_artifact("schedule_optimized.json") or {}
        parent_schedule = parent_schedule_data.get("schedule", [])
        
        impact_summary = compute_impact_summary(
            parent_kpis,
            schedule_results["optimized_kpis"],
            parent_schedule,
            schedule_results["optimized_schedule"],
        )
        
        # Save impact summary artifact
        impact_path = child_run_dir / "impact_summary.json"
        with open(impact_path, "w") as f:
            json.dump({
                "parent_run_id": parent_run_id,
                "child_run_id": child_run_id_str,
                **impact_summary,
            }, f, indent=2)
        
        artifact = Artifact(
            run_id=child_run.id,
            kind="impact_summary",
            path=str(impact_path.relative_to(settings.runs_dir)),
            size_bytes=impact_path.stat().st_size,
        )
        db.add(artifact)
        artifact_paths["impact_summary"] = str(impact_path)
        
        # Mark child run as completed
        child_run.status = RunStatus.COMPLETED.value
        
        # Mark agent job as succeeded
        duration_ms = int((time.time() - start_time) * 1000)
        metrics = {
            "validation_pass": True,
            "fallback_used": mode == "rules_fallback",
            "model_used": mode,
            "late_orders_count": len(impact_summary.get("late_orders", [])),
            "orders_improved_count": len(impact_summary.get("orders_improved", [])),
        }
        
        if mode == "rules_fallback":
            agent_job.mark_fallback_used(duration_ms, metrics)
        else:
            agent_job.mark_succeeded(duration_ms, metrics)
        
        agent_job.artifact_paths = artifact_paths
        
        await db.commit()
        
        logger.info(
            f"Replan completed: job={agent_job.id}, child_run={child_run.id}, "
            f"duration={duration_ms}ms"
        )
        
        return {
            "agent_job_id": agent_job.id,
            "child_run_id": child_run.id,
            "child_run_id_str": child_run_id_str,
            "status": agent_job.status,
            "mode": mode,
            "duration_ms": duration_ms,
            "impact_summary": impact_summary,
        }
        
    except ReplanError:
        raise
    except Exception as e:
        logger.error(f"Replan failed: {e}", exc_info=True)
        
        duration_ms = int((time.time() - start_time) * 1000)
        agent_job.mark_failed(str(e)[:2000], duration_ms)
        await db.commit()
        
        raise ReplanError(
            f"Replan failed: {e}",
            agent_job_id=agent_job.id,
        )


async def create_replan_from_latest_event(
    db: AsyncSession,
    org_id: UUID,
    parent_run_id: str,
    user_id: Optional[UUID] = None,
    event_types: Optional[list[str]] = None,
) -> dict[str, Any]:
    """Create a replan from the latest unprocessed disruption event.
    
    Args:
        db: Database session
        org_id: Organization ID
        parent_run_id: Parent run's run_id
        user_id: Optional user ID
        event_types: Optional filter for event types (defaults to disruptions)
        
    Returns:
        Replan result dict
        
    Raises:
        ReplanError: If no suitable event found or replan fails
    """
    # Get parent run
    parent_result = await db.execute(
        select(Run).where(Run.org_id == org_id, Run.run_id == parent_run_id)
    )
    parent_run = parent_result.scalar_one_or_none()
    
    if parent_run is None:
        raise ReplanError(f"Parent run not found: {parent_run_id}")
    
    # Default to disruption event types
    if event_types is None:
        event_types = [
            "disruption",
            "machine_down",
            "priority_change",
            "quality_issue",
            "order_added",
        ]
    
    # Find latest event that hasn't been processed
    # (not already linked to an agent job)
    processed_event_ids_query = (
        select(AgentJob.input_event_id)
        .where(
            AgentJob.org_id == org_id,
            AgentJob.input_event_id.isnot(None),
        )
    )
    
    event_query = (
        select(Event)
        .where(
            Event.run_id == parent_run.id,
            Event.event_type.in_(event_types),
            Event.id.notin_(processed_event_ids_query),
        )
        .order_by(Event.event_ts.desc())
        .limit(1)
    )
    
    event_result = await db.execute(event_query)
    event = event_result.scalar_one_or_none()
    
    if event is None:
        raise ReplanError("No unprocessed disruption events found")
    
    return await create_replan_from_event(
        db=db,
        org_id=org_id,
        parent_run_id=parent_run_id,
        event_id=event.id,
        user_id=user_id,
        trigger_source=AgentJobTrigger.PLANNER_CLICK.value,
    )
