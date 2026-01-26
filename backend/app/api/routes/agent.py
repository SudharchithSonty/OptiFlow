"""Agent routes - brief generation, why questions, and setup guidance.

Provides AI-powered analysis of scheduling results.
"""

import logging
import time
from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, status, Query
from sqlalchemy import select

from agent.service import AgentService
from agent.setup_guidance_service import SetupGuidanceService
from backend.app.api.deps import CurrentUserDep, DbSession
from backend.app.core.config import settings
from backend.app.models import (
    Run, RunStatus, Artifact, ArtifactKind,
    AgentJob, AgentJobType, AgentJobTrigger, AgentJobStatus,
)

logger = logging.getLogger(__name__)
router = APIRouter(tags=["agent"])


@router.post("/orgs/{org_id}/runs/{run_id}/agent/brief")
async def generate_brief(
    org_id: UUID,
    run_id: str,
    current_user: CurrentUserDep,
    db: DbSession,
) -> dict:
    """Generate an AI planner brief for a completed run.
    
    Uses Claude if available, otherwise falls back to rules-based generation.
    
    Args:
        org_id: Organization ID
        run_id: Run identifier
        current_user: Authenticated user
        db: Database session
        
    Returns:
        Brief content with mode and timing information
    """
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    # Get run
    result = await db.execute(
        select(Run).where(Run.org_id == org_id, Run.run_id == run_id)
    )
    run = result.scalar_one_or_none()
    
    if run is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Run not found",
        )
    
    if run.status != RunStatus.COMPLETED.value:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Run must be completed to generate brief. Current status: {run.status}",
        )
    
    # Generate brief (with KB integration)
    run_dir = settings.get_runs_path(str(org_id), run_id)
    agent = AgentService(run_dir, org_id=str(org_id))
    
    try:
        result = agent.generate_brief()
    except Exception as e:
        logger.error(f"Brief generation failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Brief generation failed: {str(e)}",
        )
    
    # Record artifacts
    for kind, filename in [
        (ArtifactKind.AGENT_BRIEF_JSON, "agent_brief.json"),
        (ArtifactKind.AGENT_BRIEF_MD, "agent_brief.md"),
        (ArtifactKind.AGENT_TRACE, "agent_trace.json"),
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
    
    await db.commit()
    
    # Include validation errors if any (for transparency)
    response = {
        "run_id": run_id,
        "brief": result["brief"],
        "generated_at": datetime.utcnow().isoformat(),
        "mode": result["mode"],
        "claude_model": result.get("claude_model"),
        "generation_time_ms": result["generation_time_ms"],
    }
    
    # Include validation errors for debugging/audit
    if result.get("errors"):
        response["validation_errors"] = result["errors"]
        response["validation_passed"] = False
    else:
        response["validation_passed"] = True
    
    return response


@router.post("/orgs/{org_id}/runs/{run_id}/agent/why")
async def answer_why_question(
    org_id: UUID,
    run_id: str,
    question: str,
    current_user: CurrentUserDep,
    db: DbSession,
    context: str = None,
) -> dict:
    """Answer a 'why' question about a scheduling decision.
    
    Args:
        org_id: Organization ID
        run_id: Run identifier
        question: The question to answer (min 10 chars)
        current_user: Authenticated user
        db: Database session
        context: Optional additional context
        
    Returns:
        Answer with evidence and sources
    """
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    if len(question) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question must be at least 10 characters",
        )
    
    # Get run
    result = await db.execute(
        select(Run).where(Run.org_id == org_id, Run.run_id == run_id)
    )
    run = result.scalar_one_or_none()
    
    if run is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Run not found",
        )
    
    if run.status != RunStatus.COMPLETED.value:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Run must be completed for questions. Current status: {run.status}",
        )
    
    # Answer question (with KB integration)
    run_dir = settings.get_runs_path(str(org_id), run_id)
    agent = AgentService(run_dir, org_id=str(org_id))
    
    try:
        answer = agent.answer_why(question, context)
    except Exception as e:
        logger.error(f"Why question failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to answer question: {str(e)}",
        )
    
    return answer


@router.post("/orgs/{org_id}/runs/{run_id}/agent/setup-guidance")
async def generate_setup_guidance(
    org_id: UUID,
    run_id: str,
    current_user: CurrentUserDep,
    db: DbSession,
    shift_start: Optional[datetime] = Query(None, description="Shift start time"),
    shift_end: Optional[datetime] = Query(None, description="Shift end time"),
    machines: Optional[str] = Query(None, description="Comma-separated machine IDs"),
) -> dict:
    """Generate setup guidance for a completed run.
    
    Produces per-machine checklists for changeovers and first-piece checks.
    Uses Claude if available, otherwise falls back to rules-based generation.
    
    Args:
        org_id: Organization ID
        run_id: Run identifier
        current_user: Authenticated user
        db: Database session
        shift_start: Optional shift start time filter
        shift_end: Optional shift end time filter
        machines: Optional comma-separated machine IDs to include
        
    Returns:
        Setup guidance with mode and timing information
    """
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    # Get run
    result = await db.execute(
        select(Run).where(Run.org_id == org_id, Run.run_id == run_id)
    )
    run = result.scalar_one_or_none()
    
    if run is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Run not found",
        )
    
    if run.status != RunStatus.COMPLETED.value:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Run must be completed to generate guidance. Current status: {run.status}",
        )
    
    start_time = time.time()
    
    # Create agent job for metrics tracking
    agent_job = AgentJob(
        org_id=org_id,
        run_id=run.id,
        created_by_user_id=current_user.user.id,
        job_type=AgentJobType.SETUP_GUIDANCE.value,
        trigger_source=AgentJobTrigger.PLANNER_CLICK.value,
        status=AgentJobStatus.QUEUED.value,
    )
    db.add(agent_job)
    await db.commit()
    await db.refresh(agent_job)
    
    try:
        agent_job.mark_running()
        await db.commit()
        
        # Parse machine list
        machine_list = None
        if machines:
            machine_list = [m.strip() for m in machines.split(",") if m.strip()]
        
        # Generate guidance
        run_dir = settings.get_runs_path(str(org_id), run_id)
        service = SetupGuidanceService(run_dir, org_id=str(org_id))
        
        result = service.generate_guidance(
            shift_start=shift_start,
            shift_end=shift_end,
            machines=machine_list,
        )
        
        guidance = result["guidance"]
        mode = result["mode"]
        
        if not result["validation_passed"]:
            # Validation failed
            duration_ms = int((time.time() - start_time) * 1000)
            agent_job.mark_validation_failed(result["errors"], duration_ms)
            await db.commit()
            
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Setup guidance validation failed: {result['errors']}",
            )
        
        # Save artifacts
        service.save_guidance_artifacts(
            guidance,
            mode,
            result["generation_time_ms"],
        )
        
        # Record artifacts in DB
        for filename, kind in [
            ("setup_guidance.json", "setup_guidance_json"),
            ("setup_guidance.md", "setup_guidance_md"),
        ]:
            filepath = run_dir / filename
            if filepath.exists():
                artifact = Artifact(
                    run_id=run.id,
                    kind=kind,
                    path=str(filepath.relative_to(settings.runs_dir)),
                    size_bytes=filepath.stat().st_size,
                )
                db.add(artifact)
        
        # Mark job as complete
        duration_ms = int((time.time() - start_time) * 1000)
        metrics = {
            "validation_pass": True,
            "fallback_used": mode == "rules_fallback",
            "model_used": mode,
            "machines_count": len(guidance.machines),
        }
        
        if mode == "rules_fallback":
            agent_job.mark_fallback_used(duration_ms, metrics)
        else:
            agent_job.mark_succeeded(duration_ms, metrics)
        
        agent_job.artifact_paths = {
            "guidance_json": str(run_dir / "setup_guidance.json"),
            "guidance_md": str(run_dir / "setup_guidance.md"),
        }
        
        await db.commit()
        
        # Convert guidance to response dict
        guidance_dict = {
            "run_id": guidance.run_id,
            "generated_at": guidance.generated_at.isoformat(),
            "shift_start": guidance.shift_start.isoformat() if guidance.shift_start else None,
            "shift_end": guidance.shift_end.isoformat() if guidance.shift_end else None,
            "safety_header": guidance.safety_header,
            "machines": [
                {
                    "machine_id": mg.machine_id,
                    "from_family": mg.from_family,
                    "to_family": mg.to_family,
                    "estimated_setup_minutes": mg.estimated_setup_minutes,
                    "checklist": [
                        {
                            "step_number": item.step_number,
                            "category": item.category,
                            "instruction": item.instruction,
                            "is_safety_critical": item.is_safety_critical,
                            "source": item.source,
                        }
                        for item in mg.checklist
                    ],
                    "first_piece_checks": [
                        {
                            "step_number": item.step_number,
                            "category": item.category,
                            "instruction": item.instruction,
                        }
                        for item in mg.first_piece_checks
                    ],
                }
                for mg in guidance.machines
            ],
            "limitations": guidance.limitations,
        }
        
        return {
            "agent_job_id": str(agent_job.id),
            "run_id": run_id,
            "guidance": guidance_dict,
            "generated_at": datetime.utcnow().isoformat(),
            "mode": mode,
            "generation_time_ms": result["generation_time_ms"],
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Setup guidance generation failed: {e}", exc_info=True)
        
        duration_ms = int((time.time() - start_time) * 1000)
        agent_job.mark_failed(str(e)[:2000], duration_ms)
        await db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Setup guidance generation failed: {str(e)}",
        )
