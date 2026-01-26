"""Reschedule routes - create child runs from parent runs."""

import logging
from uuid import UUID

from fastapi import APIRouter, HTTPException, status

from backend.app.api.deps import CurrentUserDep, DbSession
from backend.app.schemas.run import RescheduleRequest, RunResponse
from backend.app.services.reschedule import create_reschedule_run, get_run_lineage

logger = logging.getLogger(__name__)
router = APIRouter(tags=["reschedule"])


@router.post(
    "/orgs/{org_id}/runs/{run_id}/reschedule",
    response_model=RunResponse,
    status_code=status.HTTP_201_CREATED,
)
async def reschedule_run(
    org_id: UUID,
    run_id: str,
    request: RescheduleRequest,
    current_user: CurrentUserDep,
    db: DbSession,
) -> RunResponse:
    """Create a reschedule run from a parent run.
    
    Creates a new run linked to the parent with copied data.
    The new run can then be modified and rescheduled.
    """
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    try:
        child = await create_reschedule_run(
            db=db,
            org_id=org_id,
            parent_run_id=run_id,
            user_id=current_user.user.id,
            run_name=request.run_name,
            reschedule_mode=request.reschedule_mode,
            reschedule_from_ts=request.reschedule_from_ts,
            copy_seed=request.copy_seed,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    
    return RunResponse.model_validate(child)


@router.get(
    "/orgs/{org_id}/runs/{run_id}/lineage",
)
async def get_lineage(
    org_id: UUID,
    run_id: str,
    current_user: CurrentUserDep,
    db: DbSession,
) -> dict:
    """Get lineage information for a run.
    
    Returns parent and children information for the run.
    """
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    try:
        lineage = await get_run_lineage(db=db, org_id=org_id, run_id=run_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    
    return lineage
