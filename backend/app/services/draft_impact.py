"""Draft impact report service.

Handles saving and retrieving wizard step data.
"""

import logging
from typing import Any, Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models import DraftImpactReport, Run

logger = logging.getLogger(__name__)


async def save_draft(
    db: AsyncSession,
    org_id: UUID,
    run_id: UUID,
    user_id: Optional[UUID],
    step: int,
    data: dict[str, Any],
    is_complete: bool = False,
) -> DraftImpactReport:
    """Save or update a draft impact report.
    
    Creates new draft if none exists, otherwise updates the existing one.
    
    Args:
        db: Database session
        org_id: Organization ID
        run_id: Run UUID (not run_id string)
        user_id: User creating/updating the draft
        step: Current wizard step
        data: Form data to save
        is_complete: Whether to mark draft as finalized
        
    Returns:
        Updated/created DraftImpactReport
    """
    # Check if draft exists
    result = await db.execute(
        select(DraftImpactReport).where(
            DraftImpactReport.org_id == org_id,
            DraftImpactReport.run_id == run_id,
        )
    )
    draft = result.scalar_one_or_none()
    
    if draft:
        # Update existing draft
        draft.step = step
        draft.data = data
        draft.is_complete = is_complete
        logger.info(f"Updated draft for run {run_id} at step {step}")
    else:
        # Create new draft
        draft = DraftImpactReport(
            org_id=org_id,
            run_id=run_id,
            created_by_user_id=user_id,
            step=step,
            data=data,
            is_complete=is_complete,
        )
        db.add(draft)
        logger.info(f"Created new draft for run {run_id} at step {step}")
    
    await db.commit()
    await db.refresh(draft)
    
    return draft


async def get_draft(
    db: AsyncSession,
    org_id: UUID,
    run_id: UUID,
) -> Optional[DraftImpactReport]:
    """Get the draft impact report for a run.
    
    Args:
        db: Database session
        org_id: Organization ID
        run_id: Run UUID
        
    Returns:
        DraftImpactReport if exists, None otherwise
    """
    result = await db.execute(
        select(DraftImpactReport).where(
            DraftImpactReport.org_id == org_id,
            DraftImpactReport.run_id == run_id,
        )
    )
    return result.scalar_one_or_none()


async def delete_draft(
    db: AsyncSession,
    org_id: UUID,
    run_id: UUID,
) -> bool:
    """Delete a draft impact report.
    
    Args:
        db: Database session
        org_id: Organization ID
        run_id: Run UUID
        
    Returns:
        True if deleted, False if not found
    """
    result = await db.execute(
        select(DraftImpactReport).where(
            DraftImpactReport.org_id == org_id,
            DraftImpactReport.run_id == run_id,
        )
    )
    draft = result.scalar_one_or_none()
    
    if draft:
        await db.delete(draft)
        await db.commit()
        logger.info(f"Deleted draft for run {run_id}")
        return True
    
    return False
