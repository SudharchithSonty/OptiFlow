"""AI metrics routes - track AI agent performance.

Provides endpoints for querying AI success metrics:
- Validation pass rate
- Fallback rate
- Replan speed
- Setup clarity rating
"""

import logging
from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, status, Query
from sqlalchemy import select, func, and_, case
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.api.deps import CurrentUserDep, DbSession
from backend.app.models import AgentJob, AgentJobStatus, AgentJobType

logger = logging.getLogger(__name__)
router = APIRouter(tags=["ai-metrics"])


@router.get("/orgs/{org_id}/metrics/ai")
async def get_ai_metrics(
    org_id: UUID,
    current_user: CurrentUserDep,
    db: DbSession,
    start_date: Optional[datetime] = Query(
        None, 
        description="Start date for metrics (defaults to 30 days ago)"
    ),
    end_date: Optional[datetime] = Query(
        None,
        description="End date for metrics (defaults to now)"
    ),
    job_type: Optional[str] = Query(
        None,
        description="Filter by job type (disruption_replan, shift_brief, setup_guidance)"
    ),
) -> dict:
    """Get AI success metrics for an organization.
    
    Returns:
        - validation_pass_rate: % of jobs that passed validation
        - fallback_rate: % of jobs that used fallback
        - avg_replan_speed_ms: Average replan duration in milliseconds
        - avg_setup_clarity_rating: Average user rating for setup guidance
        - total_jobs: Total number of agent jobs
        - breakdown_by_type: Metrics broken down by job type
    """
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    # Default date range: last 30 days
    if end_date is None:
        end_date = datetime.utcnow()
    if start_date is None:
        start_date = end_date - timedelta(days=30)
    
    # Build base query
    filters = [
        AgentJob.org_id == org_id,
        AgentJob.created_at >= start_date,
        AgentJob.created_at <= end_date,
    ]
    
    if job_type:
        filters.append(AgentJob.job_type == job_type)
    
    # Get aggregate metrics
    metrics_query = select(
        func.count(AgentJob.id).label("total_jobs"),
        func.count(case(
            (AgentJob.validation_pass.is_(True), 1),
        )).label("completed_jobs"),
        func.count(case(
            (AgentJob.validation_pass.is_(False), 1),
        )).label("validation_failed_jobs"),
        func.count(case(
            (AgentJob.fallback_used.is_(True), 1),
        )).label("fallback_jobs"),
        func.count(case(
            (AgentJob.status == AgentJobStatus.FAILED.value, 1),
        )).label("failed_jobs"),
        func.avg(AgentJob.duration_ms).label("avg_duration_ms"),
        func.avg(AgentJob.user_rating).label("avg_rating"),
        func.count(case(
            (AgentJob.user_rating.isnot(None), 1),
        )).label("rated_jobs"),
    ).where(and_(*filters))
    
    result = await db.execute(metrics_query)
    row = result.one()
    
    total_jobs = row.total_jobs or 0
    completed_jobs = row.completed_jobs or 0
    validation_failed = row.validation_failed_jobs or 0
    fallback_jobs = row.fallback_jobs or 0
    failed_jobs = row.failed_jobs or 0
    avg_duration = row.avg_duration_ms or 0
    avg_rating = row.avg_rating
    rated_jobs = row.rated_jobs or 0
    
    # Calculate rates
    if total_jobs > 0:
        # Validation pass rate = (succeeded + fallback) / (succeeded + fallback + validation_failed)
        validation_relevant = completed_jobs + validation_failed
        validation_pass_rate = (completed_jobs / validation_relevant * 100) if validation_relevant > 0 else 100
        
        # Fallback rate = fallback / completed
        fallback_rate = (fallback_jobs / completed_jobs * 100) if completed_jobs > 0 else 0
        
        # Success rate = completed / total
        success_rate = (completed_jobs / total_jobs * 100)
    else:
        validation_pass_rate = 100
        fallback_rate = 0
        success_rate = 100
    
    # Get breakdown by job type
    breakdown_query = select(
        AgentJob.job_type,
        func.count(AgentJob.id).label("count"),
        func.avg(AgentJob.duration_ms).label("avg_duration"),
        func.avg(AgentJob.user_rating).label("avg_rating"),
        func.count(case(
            (AgentJob.validation_pass.is_(True), 1),
        )).label("completed"),
        func.count(case(
            (AgentJob.fallback_used.is_(True), 1),
        )).label("fallback"),
    ).where(and_(*filters)).group_by(AgentJob.job_type)
    
    breakdown_result = await db.execute(breakdown_query)
    breakdown_rows = breakdown_result.all()
    
    breakdown_by_type = {}
    for brow in breakdown_rows:
        type_completed = brow.completed or 0
        type_fallback = brow.fallback or 0
        type_fallback_rate = (type_fallback / type_completed * 100) if type_completed > 0 else 0
        
        breakdown_by_type[brow.job_type] = {
            "count": brow.count,
            "avg_duration_ms": round(brow.avg_duration or 0, 2),
            "avg_rating": round(brow.avg_rating, 2) if brow.avg_rating else None,
            "success_rate_pct": round((type_completed / brow.count * 100) if brow.count > 0 else 100, 2),
            "fallback_rate_pct": round(type_fallback_rate, 2),
        }
    
    # Get replan-specific metrics
    replan_query = select(
        func.avg(AgentJob.duration_ms).label("avg_replan_ms"),
        func.min(AgentJob.duration_ms).label("min_replan_ms"),
        func.max(AgentJob.duration_ms).label("max_replan_ms"),
    ).where(and_(
        *filters,
        AgentJob.job_type == AgentJobType.DISRUPTION_REPLAN.value,
        AgentJob.status.in_([
            AgentJobStatus.SUCCEEDED.value, 
            AgentJobStatus.FALLBACK_USED.value
        ]),
    ))
    
    replan_result = await db.execute(replan_query)
    replan_row = replan_result.one()
    
    return {
        "org_id": str(org_id),
        "period": {
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
        },
        "summary": {
            "total_jobs": total_jobs,
            "completed_jobs": completed_jobs,
            "failed_jobs": failed_jobs,
            "validation_failed_jobs": validation_failed,
            "validation_pass_rate_pct": round(validation_pass_rate, 2),
            "fallback_rate_pct": round(fallback_rate, 2),
            "success_rate_pct": round(success_rate, 2),
            "avg_duration_ms": round(avg_duration, 2),
        },
        "ratings": {
            "avg_rating": round(avg_rating, 2) if avg_rating else None,
            "rated_jobs_count": rated_jobs,
            "rating_coverage_pct": round((rated_jobs / total_jobs * 100) if total_jobs > 0 else 0, 2),
        },
        "replan_speed": {
            "avg_ms": round(replan_row.avg_replan_ms or 0, 2),
            "min_ms": replan_row.min_replan_ms,
            "max_ms": replan_row.max_replan_ms,
            "target_ms": 600000,  # 10 minutes target from rubric
            "meets_target": (replan_row.avg_replan_ms or 0) < 600000,
        },
        "rubric_metrics": {
            "validation_pass_rate": {
                "value": round(validation_pass_rate, 2),
                "target": 98,
                "unit": "%",
                "meets_target": validation_pass_rate >= 98,
            },
            "fallback_rate": {
                "value": round(fallback_rate, 2),
                "target": 2,
                "unit": "%",
                "meets_target": fallback_rate <= 2,
            },
            "replan_speed": {
                "value": round((replan_row.avg_replan_ms or 0) / 1000 / 60, 2),
                "target": 10,
                "unit": "minutes",
                "meets_target": (replan_row.avg_replan_ms or 0) < 600000,
            },
            "setup_clarity_rating": {
                "value": round(avg_rating, 2) if avg_rating else None,
                "target": 4.5,
                "unit": "/5",
                "meets_target": (avg_rating or 0) >= 4.5 if avg_rating else None,
            },
        },
        "breakdown_by_type": breakdown_by_type,
        "generated_at": datetime.utcnow().isoformat(),
    }


@router.get("/orgs/{org_id}/metrics/ai/trends")
async def get_ai_metrics_trends(
    org_id: UUID,
    current_user: CurrentUserDep,
    db: DbSession,
    days: int = Query(30, ge=7, le=90, description="Number of days for trend data"),
) -> dict:
    """Get daily AI metrics trends for visualization.
    
    Returns daily aggregates for charting.
    """
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    
    # Get daily aggregates
    # Note: This uses date truncation which may need adjustment for your DB
    daily_query = select(
        func.date(AgentJob.created_at).label("date"),
        func.count(AgentJob.id).label("total"),
        func.count(case(
            (AgentJob.status == AgentJobStatus.SUCCEEDED.value, 1),
            (AgentJob.status == AgentJobStatus.FALLBACK_USED.value, 1),
        )).label("completed"),
        func.count(case(
            (AgentJob.status == AgentJobStatus.FALLBACK_USED.value, 1),
        )).label("fallback"),
        func.avg(AgentJob.duration_ms).label("avg_duration"),
        func.avg(AgentJob.user_rating).label("avg_rating"),
    ).where(and_(
        AgentJob.org_id == org_id,
        AgentJob.created_at >= start_date,
        AgentJob.created_at <= end_date,
    )).group_by(func.date(AgentJob.created_at)).order_by(func.date(AgentJob.created_at))
    
    result = await db.execute(daily_query)
    rows = result.all()
    
    daily_data = []
    for row in rows:
        completed = row.completed or 0
        fallback = row.fallback or 0
        total = row.total or 0
        
        daily_data.append({
            "date": row.date.isoformat() if row.date else None,
            "total_jobs": total,
            "completed_jobs": completed,
            "fallback_jobs": fallback,
            "success_rate_pct": round((completed / total * 100) if total > 0 else 100, 2),
            "fallback_rate_pct": round((fallback / completed * 100) if completed > 0 else 0, 2),
            "avg_duration_ms": round(row.avg_duration or 0, 2),
            "avg_rating": round(row.avg_rating, 2) if row.avg_rating else None,
        })
    
    return {
        "org_id": str(org_id),
        "period": {
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "days": days,
        },
        "daily_data": daily_data,
        "generated_at": datetime.utcnow().isoformat(),
    }
