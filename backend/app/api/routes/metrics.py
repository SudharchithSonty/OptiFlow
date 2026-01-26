"""Metrics routes - weekly KPI aggregation."""

import logging
from datetime import date, datetime, timedelta
from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select, func

from backend.app.api.deps import CurrentUserDep, DbSession
from backend.app.models import SetupActual, QualityCheck
from backend.app.schemas.metrics import (
    WeeklyMetricsResponse,
    SetupMetrics,
    QualityMetrics,
)

logger = logging.getLogger(__name__)
router = APIRouter(tags=["metrics"])


@router.get(
    "/orgs/{org_id}/metrics/weekly",
    response_model=WeeklyMetricsResponse,
)
async def get_weekly_metrics(
    org_id: UUID,
    start_date: date,
    current_user: CurrentUserDep,
    db: DbSession,
    end_date: date = None,
) -> WeeklyMetricsResponse:
    """Get aggregated metrics for a week.
    
    Aggregates setup actuals and quality checks for the specified period.
    """
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    # Default end date to start + 7 days
    if end_date is None:
        end_date = start_date + timedelta(days=7)
    
    start_dt = datetime.combine(start_date, datetime.min.time())
    end_dt = datetime.combine(end_date, datetime.max.time())
    
    # Aggregate setup actuals
    setup_result = await db.execute(
        select(
            func.count(SetupActual.id).label("total"),
            func.sum(SetupActual.actual_minutes).label("actual_sum"),
            func.sum(SetupActual.planned_minutes).label("planned_sum"),
        )
        .where(SetupActual.org_id == org_id)
        .where(SetupActual.setup_ts >= start_dt)
        .where(SetupActual.setup_ts <= end_dt)
    )
    setup_row = setup_result.one()
    
    total_setups = setup_row.total or 0
    total_actual = float(setup_row.actual_sum or 0)
    total_planned = float(setup_row.planned_sum or 0)
    avg_variance = (total_actual - total_planned) / total_setups if total_setups > 0 else 0
    
    # Find worst variance family pair
    worst_pair = None
    if total_setups > 0:
        variance_result = await db.execute(
            select(
                SetupActual.from_family,
                SetupActual.to_family,
                (func.avg(SetupActual.actual_minutes) - func.avg(SetupActual.planned_minutes)).label("variance"),
            )
            .where(SetupActual.org_id == org_id)
            .where(SetupActual.setup_ts >= start_dt)
            .where(SetupActual.setup_ts <= end_dt)
            .where(SetupActual.planned_minutes.isnot(None))
            .group_by(SetupActual.from_family, SetupActual.to_family)
            .order_by(func.abs(func.avg(SetupActual.actual_minutes) - func.avg(SetupActual.planned_minutes)).desc())
            .limit(1)
        )
        worst_row = variance_result.first()
        if worst_row:
            worst_pair = f"{worst_row.from_family} -> {worst_row.to_family}"
    
    setup_metrics = SetupMetrics(
        total_setups=total_setups,
        total_actual_minutes=total_actual,
        total_planned_minutes=total_planned,
        avg_variance_minutes=round(avg_variance, 2),
        worst_variance_family_pair=worst_pair,
    )
    
    # Aggregate quality checks
    quality_result = await db.execute(
        select(
            func.count(QualityCheck.id).label("total"),
            func.sum(func.cast(QualityCheck.result == "pass", db.bind.dialect.type_descriptor(type(1)))).label("pass_count"),
            func.sum(func.cast(QualityCheck.result == "fail", db.bind.dialect.type_descriptor(type(1)))).label("fail_count"),
            func.sum(func.cast(QualityCheck.result == "rework", db.bind.dialect.type_descriptor(type(1)))).label("rework_count"),
            func.sum(QualityCheck.defect_count).label("defects"),
        )
        .where(QualityCheck.org_id == org_id)
        .where(QualityCheck.check_ts >= start_dt)
        .where(QualityCheck.check_ts <= end_dt)
    )
    quality_row = quality_result.one()
    
    total_checks = quality_row.total or 0
    pass_count = int(quality_row.pass_count or 0)
    fail_count = int(quality_row.fail_count or 0)
    rework_count = int(quality_row.rework_count or 0)
    total_defects = int(quality_row.defects or 0)
    pass_rate = (pass_count / total_checks * 100) if total_checks > 0 else 0
    
    # Find top defect type
    top_defect = None
    if total_defects > 0:
        defect_result = await db.execute(
            select(
                QualityCheck.defect_type,
                func.sum(QualityCheck.defect_count).label("count"),
            )
            .where(QualityCheck.org_id == org_id)
            .where(QualityCheck.check_ts >= start_dt)
            .where(QualityCheck.check_ts <= end_dt)
            .where(QualityCheck.defect_type.isnot(None))
            .group_by(QualityCheck.defect_type)
            .order_by(func.sum(QualityCheck.defect_count).desc())
            .limit(1)
        )
        defect_row = defect_result.first()
        if defect_row:
            top_defect = defect_row.defect_type
    
    quality_metrics = QualityMetrics(
        total_checks=total_checks,
        pass_count=pass_count,
        fail_count=fail_count,
        rework_count=rework_count,
        pass_rate_pct=round(pass_rate, 2),
        total_defects=total_defects,
        top_defect_type=top_defect,
    )
    
    return WeeklyMetricsResponse(
        org_id=org_id,
        start_date=start_date,
        end_date=end_date,
        setup_metrics=setup_metrics,
        quality_metrics=quality_metrics,
        generated_at=datetime.utcnow(),
    )
