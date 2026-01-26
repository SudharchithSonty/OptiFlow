"""Compare routes - compare parent vs child runs."""

import json
import logging
from pathlib import Path
from uuid import UUID

from fastapi import APIRouter, HTTPException, status, Query
from sqlalchemy import select

from backend.app.api.deps import CurrentUserDep, DbSession
from backend.app.core.config import settings
from backend.app.models import Run
from backend.app.schemas.run import RunResponse, RunCompareResponse

logger = logging.getLogger(__name__)
router = APIRouter(tags=["compare"])


def load_kpis(run_dir: Path, kind: str) -> dict:
    """Load KPI file from run directory."""
    kpi_file = run_dir / f"kpi_{kind}.json"
    if kpi_file.exists():
        with open(kpi_file) as f:
            return json.load(f)
    return {}


def compute_kpi_deltas(parent_kpis: dict, child_kpis: dict) -> list[dict]:
    """Compute differences between parent and child KPIs."""
    deltas = []
    
    all_metrics = set(parent_kpis.keys()) | set(child_kpis.keys())
    
    for metric in all_metrics:
        parent_val = parent_kpis.get(metric, 0)
        child_val = child_kpis.get(metric, 0)
        
        # Skip non-numeric values
        if not isinstance(parent_val, (int, float)) or not isinstance(child_val, (int, float)):
            continue
        
        delta = child_val - parent_val
        
        # Determine if improvement (depends on metric)
        lower_is_better = metric.lower() in ["makespan", "setup_time", "tardiness"]
        is_improvement = (delta < 0) if lower_is_better else (delta > 0)
        
        pct_change = 0
        if parent_val != 0:
            pct_change = (delta / abs(parent_val)) * 100
        
        deltas.append({
            "metric": metric,
            "parent_value": parent_val,
            "child_value": child_val,
            "delta": delta,
            "pct_change": round(pct_change, 2),
            "is_improvement": is_improvement,
        })
    
    return deltas


@router.get(
    "/orgs/{org_id}/runs/compare",
    response_model=RunCompareResponse,
)
async def compare_runs(
    org_id: UUID,
    parent_run_id: str = Query(..., description="Parent run ID"),
    child_run_id: str = Query(..., description="Child run ID"),
    current_user: CurrentUserDep = None,
    db: DbSession = None,
) -> RunCompareResponse:
    """Compare two runs (typically parent and child).
    
    Returns KPI deltas and schedule changes between the runs.
    """
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    # Get parent run
    parent_result = await db.execute(
        select(Run).where(Run.org_id == org_id, Run.run_id == parent_run_id)
    )
    parent = parent_result.scalar_one_or_none()
    
    if parent is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Parent run not found: {parent_run_id}",
        )
    
    # Get child run
    child_result = await db.execute(
        select(Run).where(Run.org_id == org_id, Run.run_id == child_run_id)
    )
    child = child_result.scalar_one_or_none()
    
    if child is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Child run not found: {child_run_id}",
        )
    
    # Verify lineage (optional but recommended)
    if child.parent_run_id and child.parent_run_id != parent.id:
        logger.warning(f"Comparing runs without direct lineage: {parent_run_id} -> {child_run_id}")
    
    # Load KPIs
    parent_dir = settings.get_runs_path(str(org_id), parent_run_id)
    child_dir = settings.get_runs_path(str(org_id), child_run_id)
    
    parent_kpis = load_kpis(parent_dir, "optimized")
    child_kpis = load_kpis(child_dir, "optimized")
    
    # Compute deltas
    kpi_deltas = compute_kpi_deltas(parent_kpis, child_kpis)
    
    # Basic schedule changes summary
    schedule_changes = {
        "parent_status": parent.status,
        "child_status": child.status,
        "parent_completed": parent.status == "completed",
        "child_completed": child.status == "completed",
    }
    
    return RunCompareResponse(
        parent_run=RunResponse.model_validate(parent),
        child_run=RunResponse.model_validate(child),
        kpi_deltas=kpi_deltas,
        schedule_changes=schedule_changes,
    )
