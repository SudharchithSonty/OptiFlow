"""Reschedule service.

Handles creating child runs from parent runs with lineage tracking.
"""

import logging
import shutil
from datetime import datetime
from pathlib import Path
from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import settings
from backend.app.models import Run, RunStatus, RunTrigger, RescheduleMode
from backend.app.models.run import sanitize_run_id

logger = logging.getLogger(__name__)


async def create_reschedule_run(
    db: AsyncSession,
    org_id: UUID,
    parent_run_id: str,  # run_id (sanitized name)
    user_id: UUID,
    run_name: Optional[str] = None,
    reschedule_mode: str = RescheduleMode.FROM_NOW.value,
    reschedule_from_ts: Optional[datetime] = None,
    copy_seed: bool = True,
) -> Run:
    """Create a new run as a child of an existing (parent) run.
    
    Args:
        db: Database session
        org_id: Organization ID
        parent_run_id: Parent run's run_id (sanitized name)
        user_id: Creating user ID
        run_name: Optional name for child run (auto-generated if not provided)
        reschedule_mode: Mode for reschedule (from_now, from_timestamp, full)
        reschedule_from_ts: Timestamp for from_timestamp mode
        copy_seed: Whether to copy seed from parent
        
    Returns:
        Created Run object
        
    Raises:
        ValueError: If parent run not found or validation fails
    """
    # Get parent run
    result = await db.execute(
        select(Run).where(
            Run.org_id == org_id,
            Run.run_id == parent_run_id,
        )
    )
    parent = result.scalar_one_or_none()
    
    if parent is None:
        raise ValueError(f"Parent run not found: {parent_run_id}")
    
    if parent.status != RunStatus.COMPLETED.value:
        raise ValueError(f"Parent run must be completed. Current status: {parent.status}")
    
    # Generate child run name if not provided
    if not run_name:
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        run_name = f"{parent.run_name}_resched_{timestamp}"
    
    # Sanitize run name
    child_run_id = sanitize_run_id(run_name)
    
    # Determine seed
    seed = parent.seed if copy_seed else 42
    
    # Create child run
    child = Run(
        org_id=org_id,
        created_by_user_id=user_id,
        parent_run_id=parent.id,
        trigger=RunTrigger.RESCHEDULE.value,
        reschedule_mode=reschedule_mode,
        reschedule_from_ts=reschedule_from_ts,
        run_name=run_name,
        run_id=child_run_id,
        seed=seed,
        status=RunStatus.CREATED.value,
    )
    
    db.add(child)
    await db.commit()
    await db.refresh(child)
    
    # Create child run directory
    child_dir = settings.get_runs_path(str(org_id), child_run_id)
    child_dir.mkdir(parents=True, exist_ok=True)
    
    # Copy data directory from parent
    parent_dir = settings.get_runs_path(str(org_id), parent_run_id)
    parent_data_dir = parent_dir / "data"
    
    if parent_data_dir.exists():
        child_data_dir = child_dir / "data"
        shutil.copytree(parent_data_dir, child_data_dir, dirs_exist_ok=True)
        logger.info(f"Copied data from parent {parent_run_id} to child {child_run_id}")
    
    logger.info(f"Created reschedule run {child.id} from parent {parent.id}")
    
    return child


async def get_run_lineage(
    db: AsyncSession,
    org_id: UUID,
    run_id: str,
) -> dict:
    """Get lineage information for a run.
    
    Args:
        db: Database session
        org_id: Organization ID
        run_id: Run's run_id
        
    Returns:
        Dict with parent and children info
    """
    result = await db.execute(
        select(Run).where(Run.org_id == org_id, Run.run_id == run_id)
    )
    run = result.scalar_one_or_none()
    
    if run is None:
        raise ValueError(f"Run not found: {run_id}")
    
    lineage = {
        "run_id": run_id,
        "parent": None,
        "children": [],
    }
    
    # Get parent
    if run.parent_run_id:
        parent_result = await db.execute(
            select(Run).where(Run.id == run.parent_run_id)
        )
        parent = parent_result.scalar_one_or_none()
        if parent:
            lineage["parent"] = {
                "id": str(parent.id),
                "run_id": parent.run_id,
                "run_name": parent.run_name,
                "status": parent.status,
            }
    
    # Get children
    children_result = await db.execute(
        select(Run).where(Run.parent_run_id == run.id)
    )
    children = children_result.scalars().all()
    
    for child in children:
        lineage["children"].append({
            "id": str(child.id),
            "run_id": child.run_id,
            "run_name": child.run_name,
            "status": child.status,
            "trigger": child.trigger,
            "created_at": child.created_at.isoformat(),
        })
    
    return lineage
