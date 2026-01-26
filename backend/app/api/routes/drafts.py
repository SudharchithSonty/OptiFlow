"""Draft Impact Report routes."""

import logging
from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from backend.app.api.deps import CurrentUserDep, DbSession
from backend.app.models import Run
from backend.app.schemas.draft_impact import DraftImpactCreate, DraftImpactResponse
from backend.app.services.draft_impact import save_draft, get_draft

logger = logging.getLogger(__name__)
router = APIRouter(tags=["drafts"])


@router.post(
    "/orgs/{org_id}/runs/{run_id}/draft-impact",
    response_model=DraftImpactResponse,
)
async def save_draft_impact(
    org_id: UUID,
    run_id: str,
    request: DraftImpactCreate,
    current_user: CurrentUserDep,
    db: DbSession,
) -> DraftImpactResponse:
    """Save draft impact report at current wizard step.
    
    Allows users to save progress and resume later.
    Only one draft per run is allowed (upserts).
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
    
    # Save draft
    draft = await save_draft(
        db=db,
        org_id=org_id,
        run_id=run.id,
        user_id=current_user.user.id,
        step=request.step,
        data=request.data,
        is_complete=request.is_complete,
    )
    
    return DraftImpactResponse.model_validate(draft)


@router.get(
    "/orgs/{org_id}/runs/{run_id}/draft-impact",
    response_model=DraftImpactResponse,
)
async def get_draft_impact(
    org_id: UUID,
    run_id: str,
    current_user: CurrentUserDep,
    db: DbSession,
) -> DraftImpactResponse:
    """Get saved draft impact report for a run."""
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
    
    # Get draft
    draft = await get_draft(db=db, org_id=org_id, run_id=run.id)
    
    if draft is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No draft found for this run",
        )
    
    return DraftImpactResponse.model_validate(draft)
