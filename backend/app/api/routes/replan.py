"""Replan routes - trigger AI-powered rescheduling from events.

Provides endpoints for:
- Triggering replan from a specific event
- Triggering replan from the latest unprocessed event
- Listing agent jobs
- Rating agent job outputs
"""

import logging
from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from backend.app.api.deps import CurrentUserDep, DbSession
from backend.app.models import Run, Event, AgentJob, AgentJobStatus
from backend.app.schemas.agent_job import (
    ReplanRequest,
    ReplanResponse,
    AgentJobResponse,
    AgentJobSummary,
    AgentJobRatingUpdate,
)
from backend.app.services.replan import (
    create_replan_from_event,
    create_replan_from_latest_event,
    ReplanError,
)

logger = logging.getLogger(__name__)
router = APIRouter(tags=["replan"])


@router.post(
    "/orgs/{org_id}/runs/{run_id}/events/{event_id}/replan",
    response_model=ReplanResponse,
    status_code=status.HTTP_201_CREATED,
)
async def trigger_replan_from_event(
    org_id: UUID,
    run_id: str,
    event_id: UUID,
    request: ReplanRequest,
    current_user: CurrentUserDep,
    db: DbSession,
) -> ReplanResponse:
    """Trigger a replan from a specific event.
    
    Creates an agent job, generates a proposal, validates it,
    creates a child run, schedules it, and computes impact.
    
    Called by external scheduler or planner UI.
    """
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    try:
        result = await create_replan_from_event(
            db=db,
            org_id=org_id,
            parent_run_id=run_id,
            event_id=event_id,
            user_id=current_user.user.id,
            trigger_source="planner_click",
            run_name=request.run_name,
        )
        
        return ReplanResponse(
            agent_job_id=result["agent_job_id"],
            child_run_id=result.get("child_run_id"),
            status=result["status"],
            validation_errors=result.get("validation_errors"),
            error_message=result.get("error_message"),
        )
        
    except ReplanError as e:
        # Return structured error with agent job ID if available
        return ReplanResponse(
            agent_job_id=e.agent_job_id,
            child_run_id=None,
            status=AgentJobStatus.FAILED.value,
            validation_errors=e.errors if e.errors else None,
            error_message=e.message,
        )
    except Exception as e:
        logger.error(f"Replan failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Replan failed: {str(e)}",
        )


@router.post(
    "/orgs/{org_id}/runs/{run_id}/replan/latest",
    response_model=ReplanResponse,
    status_code=status.HTTP_201_CREATED,
)
async def trigger_replan_from_latest_event(
    org_id: UUID,
    run_id: str,
    request: ReplanRequest,
    current_user: CurrentUserDep,
    db: DbSession,
) -> ReplanResponse:
    """Trigger a replan from the latest unprocessed disruption event.
    
    Finds the most recent disruption event that hasn't been processed
    and triggers a replan from it.
    """
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    try:
        result = await create_replan_from_latest_event(
            db=db,
            org_id=org_id,
            parent_run_id=run_id,
            user_id=current_user.user.id,
        )
        
        return ReplanResponse(
            agent_job_id=result["agent_job_id"],
            child_run_id=result.get("child_run_id"),
            status=result["status"],
        )
        
    except ReplanError as e:
        if "No unprocessed" in e.message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=e.message,
            )
        
        return ReplanResponse(
            agent_job_id=e.agent_job_id,
            child_run_id=None,
            status=AgentJobStatus.FAILED.value,
            validation_errors=e.errors if e.errors else None,
            error_message=e.message,
        )
    except Exception as e:
        logger.error(f"Replan failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Replan failed: {str(e)}",
        )


@router.get(
    "/orgs/{org_id}/agent-jobs",
    response_model=list[AgentJobSummary],
)
async def list_agent_jobs(
    org_id: UUID,
    current_user: CurrentUserDep,
    db: DbSession,
    job_type: str = None,
    status: str = None,
    limit: int = 50,
    offset: int = 0,
) -> list[AgentJobSummary]:
    """List agent jobs for an organization.
    
    Supports filtering by job_type and status.
    """
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    query = select(AgentJob).where(AgentJob.org_id == org_id)
    
    if job_type:
        query = query.where(AgentJob.job_type == job_type)
    if status:
        query = query.where(AgentJob.status == status)
    
    query = query.order_by(AgentJob.created_at.desc()).limit(limit).offset(offset)
    
    result = await db.execute(query)
    jobs = result.scalars().all()
    
    return [AgentJobSummary.model_validate(j) for j in jobs]


@router.get(
    "/orgs/{org_id}/agent-jobs/{job_id}",
    response_model=AgentJobResponse,
)
async def get_agent_job(
    org_id: UUID,
    job_id: UUID,
    current_user: CurrentUserDep,
    db: DbSession,
) -> AgentJobResponse:
    """Get details of a specific agent job."""
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    result = await db.execute(
        select(AgentJob).where(
            AgentJob.id == job_id,
            AgentJob.org_id == org_id,
        )
    )
    job = result.scalar_one_or_none()
    
    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent job not found: {job_id}",
        )
    
    return AgentJobResponse.model_validate(job)


@router.post(
    "/orgs/{org_id}/agent-jobs/{job_id}/rate",
    response_model=AgentJobResponse,
)
async def rate_agent_job(
    org_id: UUID,
    job_id: UUID,
    request: AgentJobRatingUpdate,
    current_user: CurrentUserDep,
    db: DbSession,
) -> AgentJobResponse:
    """Rate an agent job output (e.g., setup guidance clarity).
    
    Used to track AI success metrics.
    """
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    result = await db.execute(
        select(AgentJob).where(
            AgentJob.id == job_id,
            AgentJob.org_id == org_id,
        )
    )
    job = result.scalar_one_or_none()
    
    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent job not found: {job_id}",
        )
    
    job.user_rating = request.rating
    job.rating_comment = request.comment
    
    await db.commit()
    await db.refresh(job)
    
    logger.info(f"Rated agent job {job_id}: {request.rating}/5")
    
    return AgentJobResponse.model_validate(job)
