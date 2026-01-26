"""Publish and active schedule routes.

Handles publishing runs as the active schedule and fetching active schedules.
Also provides shift-brief generation for external scheduler calls.
"""

import logging
from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from backend.app.api.deps import CurrentUserDep, DbSession
from backend.app.models import (
    Run, RunStatus, Event, Org, Artifact, ArtifactKind,
    AgentJob, AgentJobType, AgentJobTrigger, AgentJobStatus,
)
from backend.app.core.config import settings
from backend.app.schemas.agent_job import PublishResponse, ActiveScheduleResponse
from backend.app.schemas.run import RunResponse, RunDetailResponse, ArtifactInfo

logger = logging.getLogger(__name__)
router = APIRouter(tags=["publish"])


@router.post(
    "/orgs/{org_id}/runs/{run_id}/publish",
    response_model=PublishResponse,
)
async def publish_run(
    org_id: UUID,
    run_id: str,
    current_user: CurrentUserDep,
    db: DbSession,
) -> PublishResponse:
    """Publish a run as the active schedule for the organization.
    
    Updates org.active_run_id to point to this run.
    Records a publish event on the run.
    """
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    # Get the run
    run_result = await db.execute(
        select(Run).where(Run.org_id == org_id, Run.run_id == run_id)
    )
    run = run_result.scalar_one_or_none()
    
    if run is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Run not found: {run_id}",
        )
    
    if run.status != RunStatus.COMPLETED.value:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only completed runs can be published. Current status: {run.status}",
        )
    
    # Get the org
    org_result = await db.execute(
        select(Org).where(Org.id == org_id)
    )
    org = org_result.scalar_one_or_none()
    
    if org is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )
    
    # Update org's active run
    previous_active = org.active_run_id
    org.active_run_id = run.id
    
    # Record a publish event
    event = Event(
        org_id=org_id,
        run_id=run.id,
        created_by_user_id=current_user.user.id,
        event_type="publish",  # New event type for publish
        title=f"Run published as active schedule",
        description=f"User {current_user.user.email} published run {run_id} as the active schedule",
        payload={
            "previous_active_run_id": str(previous_active) if previous_active else None,
        },
    )
    db.add(event)
    
    await db.commit()
    
    logger.info(f"Published run {run_id} as active schedule for org {org_id}")
    
    return PublishResponse(
        org_id=org_id,
        run_id=run.id,
        run_name=run.run_name,
        published_at=datetime.utcnow(),
        message=f"Run '{run.run_name}' is now the active schedule",
    )


@router.get(
    "/orgs/{org_id}/runs/active",
    response_model=ActiveScheduleResponse,
)
async def get_active_schedule(
    org_id: UUID,
    current_user: CurrentUserDep,
    db: DbSession,
) -> ActiveScheduleResponse:
    """Get the active schedule for an organization.
    
    Returns the currently published run.
    """
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    # Get the org with active run
    org_result = await db.execute(
        select(Org).where(Org.id == org_id)
    )
    org = org_result.scalar_one_or_none()
    
    if org is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )
    
    if org.active_run_id is None:
        return ActiveScheduleResponse(
            org_id=org_id,
            has_active_schedule=False,
        )
    
    # Get the active run
    run_result = await db.execute(
        select(Run).where(Run.id == org.active_run_id)
    )
    run = run_result.scalar_one_or_none()
    
    if run is None:
        # Active run was deleted, clear the reference
        org.active_run_id = None
        await db.commit()
        
        return ActiveScheduleResponse(
            org_id=org_id,
            has_active_schedule=False,
        )
    
    return ActiveScheduleResponse(
        org_id=org_id,
        has_active_schedule=True,
        run_id=run.run_id,
        run_name=run.run_name,
        run_status=run.status,
        published_at=run.updated_at,  # Approximation
    )


@router.get(
    "/orgs/{org_id}/runs/active/detail",
    response_model=RunDetailResponse,
)
async def get_active_schedule_detail(
    org_id: UUID,
    current_user: CurrentUserDep,
    db: DbSession,
) -> RunDetailResponse:
    """Get detailed information about the active schedule.
    
    Returns the run with its artifacts.
    """
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    # Get the org
    org_result = await db.execute(
        select(Org).where(Org.id == org_id)
    )
    org = org_result.scalar_one_or_none()
    
    if org is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )
    
    if org.active_run_id is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active schedule set for this organization",
        )
    
    # Get the active run
    run_result = await db.execute(
        select(Run).where(Run.id == org.active_run_id)
    )
    run = run_result.scalar_one_or_none()
    
    if run is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Active run not found",
        )
    
    # Get artifacts
    artifacts_result = await db.execute(
        select(Artifact).where(Artifact.run_id == run.id)
    )
    artifacts = artifacts_result.scalars().all()
    
    return RunDetailResponse(
        run=RunResponse.model_validate(run),
        artifacts=[ArtifactInfo.model_validate(a) for a in artifacts],
    )


@router.post(
    "/orgs/{org_id}/runs/active/shift-brief",
)
async def generate_shift_brief(
    org_id: UUID,
    current_user: CurrentUserDep,
    db: DbSession,
    shift_start: datetime = None,
    shift_end: datetime = None,
) -> dict:
    """Generate a shift brief for the active schedule.
    
    Called by external scheduler at shift start (e.g., daily at 7 AM).
    Generates a shift-oriented planner brief with today's priorities.
    
    Args:
        org_id: Organization ID
        shift_start: Optional shift start time (defaults to now)
        shift_end: Optional shift end time (defaults to 8 hours from start)
    """
    import time
    from agent.service import AgentService
    
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    # Get the org
    org_result = await db.execute(
        select(Org).where(Org.id == org_id)
    )
    org = org_result.scalar_one_or_none()
    
    if org is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )
    
    if org.active_run_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active schedule set - cannot generate shift brief",
        )
    
    # Get the active run
    run_result = await db.execute(
        select(Run).where(Run.id == org.active_run_id)
    )
    run = run_result.scalar_one_or_none()
    
    if run is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Active run not found",
        )
    
    if run.status != RunStatus.COMPLETED.value:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Active run must be completed. Current status: {run.status}",
        )
    
    start_time = time.time()
    
    # Create agent job record for metrics tracking
    agent_job = AgentJob(
        org_id=org_id,
        run_id=run.id,
        created_by_user_id=current_user.user.id,
        job_type=AgentJobType.SHIFT_BRIEF.value,
        trigger_source=AgentJobTrigger.EXTERNAL_SCHEDULER.value,
        status=AgentJobStatus.QUEUED.value,
    )
    db.add(agent_job)
    await db.commit()
    await db.refresh(agent_job)
    
    try:
        agent_job.mark_running()
        await db.commit()
        
        # Generate brief using existing agent service
        run_dir = settings.get_runs_path(str(org_id), run.run_id)
        agent = AgentService(run_dir, org_id=str(org_id))
        
        result = agent.generate_brief()
        
        # Add shift context to brief
        if shift_start is None:
            shift_start = datetime.utcnow()
        if shift_end is None:
            from datetime import timedelta
            shift_end = shift_start + timedelta(hours=8)
        
        brief = result.get("brief", {})
        brief["shift_context"] = {
            "shift_start": shift_start.isoformat(),
            "shift_end": shift_end.isoformat(),
            "generated_for": "shift_start",
        }
        
        # Record artifacts
        for kind, filename in [
            (ArtifactKind.AGENT_BRIEF_JSON, "agent_brief.json"),
            (ArtifactKind.AGENT_BRIEF_MD, "agent_brief.md"),
        ]:
            filepath = run_dir / filename
            if filepath.exists():
                artifact = Artifact(
                    run_id=run.id,
                    kind=kind.value,
                    path=str(filepath.relative_to(settings.runs_dir)),
                    size_bytes=filepath.stat().st_size,
                )
                db.add(artifact)
        
        # Mark agent job as complete
        duration_ms = int((time.time() - start_time) * 1000)
        metrics = {
            "validation_pass": True,
            "fallback_used": result.get("mode") == "rules_fallback",
            "model_used": result.get("mode"),
        }
        
        if result.get("mode") == "rules_fallback":
            agent_job.mark_fallback_used(duration_ms, metrics)
        else:
            agent_job.mark_succeeded(duration_ms, metrics)
        
        agent_job.artifact_paths = {
            "brief_json": str(run_dir / "agent_brief.json"),
            "brief_md": str(run_dir / "agent_brief.md"),
        }
        
        await db.commit()
        
        logger.info(
            f"Generated shift brief for org {org_id}, run {run.run_id}, "
            f"job {agent_job.id}"
        )
        
        return {
            "agent_job_id": str(agent_job.id),
            "run_id": run.run_id,
            "brief": brief,
            "generated_at": datetime.utcnow().isoformat(),
            "mode": result.get("mode"),
            "generation_time_ms": duration_ms,
            "shift_start": shift_start.isoformat(),
            "shift_end": shift_end.isoformat(),
        }
        
    except Exception as e:
        logger.error(f"Shift brief generation failed: {e}", exc_info=True)
        
        duration_ms = int((time.time() - start_time) * 1000)
        agent_job.mark_failed(str(e)[:2000], duration_ms)
        await db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Shift brief generation failed: {str(e)}",
        )
