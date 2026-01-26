"""Run management routes - create, generate, schedule, list runs.

All routes are scoped to an organization for multi-tenant isolation.
"""

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.api.deps import CurrentUser, CurrentUserDep, DbSession, get_current_user_with_org
from backend.app.core.config import settings
from backend.app.models import Run, RunStatus, Artifact, ArtifactKind
from backend.app.models.run import sanitize_run_id
from backend.app.schemas.run import RunCreate, RunResponse, RunSummary, RunDetailResponse, ArtifactInfo

logger = logging.getLogger(__name__)
router = APIRouter(tags=["runs"])


async def verify_org_access(
    current_user: CurrentUserDep,
    org_id: UUID,
) -> CurrentUser:
    """Verify user has access to the specified org."""
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    return current_user


@router.post("/orgs/{org_id}/runs", response_model=RunResponse, status_code=status.HTTP_201_CREATED)
async def create_run(
    org_id: UUID,
    request: RunCreate,
    current_user: CurrentUserDep,
    db: DbSession,
) -> RunResponse:
    """Create a new scheduling run.
    
    Args:
        org_id: Organization ID (from path)
        request: Run creation parameters (name, seed)
        current_user: Authenticated user
        db: Database session
        
    Returns:
        Created run details
        
    Raises:
        HTTPException: 403 if user doesn't have org access
        HTTPException: 400 if run name is invalid
    """
    # Verify org access
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    # Sanitize run name
    try:
        run_id = sanitize_run_id(request.run_name)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    
    # Create run record
    run = Run(
        org_id=org_id,
        created_by_user_id=current_user.user.id,
        run_name=request.run_name,
        run_id=run_id,
        seed=request.seed,
        status=RunStatus.CREATED.value,
    )
    
    db.add(run)
    await db.commit()
    await db.refresh(run)
    
    # Create run directory
    run_dir = settings.get_runs_path(str(org_id), run_id)
    run_dir.mkdir(parents=True, exist_ok=True)
    
    logger.info(f"Created run {run.id} for org {org_id} by user {current_user.user.id}")
    
    return RunResponse.model_validate(run)


@router.get("/orgs/{org_id}/runs", response_model=list[RunSummary])
async def list_runs(
    org_id: UUID,
    current_user: CurrentUserDep,
    db: DbSession,
    limit: int = 50,
    offset: int = 0,
) -> list[RunSummary]:
    """List runs for an organization.
    
    Supports pagination via limit/offset.
    """
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    result = await db.execute(
        select(Run)
        .where(Run.org_id == org_id)
        .order_by(Run.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    runs = result.scalars().all()
    
    return [RunSummary.model_validate(r) for r in runs]


@router.get("/orgs/{org_id}/runs/{run_id}", response_model=RunDetailResponse)
async def get_run(
    org_id: UUID,
    run_id: str,
    current_user: CurrentUserDep,
    db: DbSession,
) -> RunDetailResponse:
    """Get run details with artifacts."""
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    result = await db.execute(
        select(Run)
        .where(Run.org_id == org_id, Run.run_id == run_id)
    )
    run = result.scalar_one_or_none()
    
    if run is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Run not found",
        )
    
    # Get artifacts
    artifact_result = await db.execute(
        select(Artifact).where(Artifact.run_id == run.id)
    )
    artifacts = artifact_result.scalars().all()
    
    return RunDetailResponse(
        run=RunResponse.model_validate(run),
        artifacts=[ArtifactInfo.model_validate(a) for a in artifacts],
    )


@router.post("/orgs/{org_id}/runs/{run_id}/generate", response_model=RunResponse)
async def generate_data(
    org_id: UUID,
    run_id: str,
    current_user: CurrentUserDep,
    db: DbSession,
) -> RunResponse:
    """Generate synthetic data for a run.
    
    Calls the data generator and writes CSVs to the run directory.
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
    
    if run.status not in [RunStatus.CREATED.value, RunStatus.FAILED.value]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot generate data for run in status: {run.status}",
        )
    
    # Update status
    run.status = RunStatus.GENERATING.value
    await db.commit()
    
    try:
        # Import and run data generator
        from data_generator.generator import generate_data as gen_data
        
        run_dir = settings.get_runs_path(str(org_id), run_id)
        data_dir = run_dir / "data"
        data_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate data synchronously (in production, use background task)
        gen_data(str(data_dir), seed=run.seed)
        
        # Update status
        run.status = RunStatus.GENERATED.value
        await db.commit()
        await db.refresh(run)
        
        logger.info(f"Generated data for run {run.id}")
        
    except Exception as e:
        logger.error(f"Data generation failed for run {run.id}: {e}")
        run.status = RunStatus.FAILED.value
        run.error_message = str(e)[:1000]
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Data generation failed: {str(e)}",
        )
    
    return RunResponse.model_validate(run)


@router.post("/orgs/{org_id}/runs/{run_id}/schedule", response_model=RunResponse)
async def schedule_run(
    org_id: UUID,
    run_id: str,
    current_user: CurrentUserDep,
    db: DbSession,
) -> RunResponse:
    """Run baseline and optimized schedulers, save artifacts.
    
    Produces:
    - schedule_baseline.json
    - schedule_optimized.json
    - kpi_baseline.json
    - kpi_optimized.json
    - scenario_meta.json
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
    
    if run.status != RunStatus.GENERATED.value:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Run must be in 'generated' status to schedule. Current: {run.status}",
        )
    
    # Update status
    run.status = RunStatus.SCHEDULING.value
    await db.commit()
    
    try:
        from pathlib import Path
        from scheduler.data_loader import DataLoader
        from scheduler.job_shop_solver import JobShopSolver
        from scheduler.baseline_scheduler import BaselineScheduler
        from scheduler.kpi import compute_kpis
        
        run_dir = settings.get_runs_path(str(org_id), run_id)
        data_dir = run_dir / "data"
        
        # Load data
        loader = DataLoader(data_dir)
        loader.load_all()
        
        # Run baseline scheduler
        baseline = BaselineScheduler(loader)
        baseline_schedule = baseline.schedule_edd()
        baseline_kpis = compute_kpis(baseline_schedule, loader, "M03")
        
        # Run optimized scheduler
        solver = JobShopSolver(loader)
        solver.build_model()
        solved = solver.solve()
        
        if solved:
            optimized_schedule = solver.schedule
            optimized_kpis = compute_kpis(optimized_schedule, loader, "M03")
            solver_status = solver.get_status_string()
        else:
            optimized_schedule = []
            optimized_kpis = {}
            solver_status = "FAILED"
        
        # Build scenario meta
        scenario_meta = {
            "run_id": run_id,
            "seed": run.seed,
            "num_operations": len(loader.order_ops),
            "num_orders": len(loader.orders),
            "num_machines": len(loader.machines),
            "horizon_end_min": loader.get_horizon_end_min(),
            "t0": loader.t0.isoformat() if loader.t0 else None,
            "orders": loader.orders.to_dict("records"),
            "machines": loader.machines.to_dict("records"),
        }
        
        # Write artifacts
        artifacts_to_write = [
            ("scenario_meta.json", ArtifactKind.SCENARIO_META, scenario_meta),
            ("schedule_baseline.json", ArtifactKind.SCHEDULE_BASELINE, {"schedule": baseline_schedule, "makespan": baseline.get_makespan()}),
            ("schedule_optimized.json", ArtifactKind.SCHEDULE_OPTIMIZED, {"schedule": optimized_schedule, "makespan": solver.get_makespan() if solved else 0, "solver_status": solver_status}),
            ("kpi_baseline.json", ArtifactKind.KPI_BASELINE, baseline_kpis),
            ("kpi_optimized.json", ArtifactKind.KPI_OPTIMIZED, optimized_kpis),
        ]
        
        for filename, kind, data in artifacts_to_write:
            filepath = run_dir / filename
            with open(filepath, "w") as f:
                json.dump(data, f, indent=2, default=str)
            
            # Record artifact in DB
            artifact = Artifact(
                run_id=run.id,
                kind=kind.value,
                path=str(filepath.relative_to(settings.runs_dir)),
                size_bytes=filepath.stat().st_size,
            )
            db.add(artifact)
        
        # Update status
        run.status = RunStatus.COMPLETED.value
        await db.commit()
        await db.refresh(run)
        
        logger.info(f"Scheduling completed for run {run.id}")
        
    except Exception as e:
        logger.error(f"Scheduling failed for run {run.id}: {e}", exc_info=True)
        run.status = RunStatus.FAILED.value
        run.error_message = str(e)[:1000]
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Scheduling failed: {str(e)}",
        )
    
    return RunResponse.model_validate(run)
