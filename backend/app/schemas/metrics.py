"""Metrics aggregation request/response schemas."""

from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class WeeklyMetricsRequest(BaseModel):
    """Request for weekly metrics."""
    start_date: date = Field(..., description="Start of the week")
    end_date: Optional[date] = Field(None, description="End of the week (defaults to start + 7 days)")


class SetupMetrics(BaseModel):
    """Aggregated setup time metrics."""
    total_setups: int
    total_actual_minutes: float
    total_planned_minutes: float
    avg_variance_minutes: float
    worst_variance_family_pair: Optional[str]


class QualityMetrics(BaseModel):
    """Aggregated quality check metrics."""
    total_checks: int
    pass_count: int
    fail_count: int
    rework_count: int
    pass_rate_pct: float
    total_defects: int
    top_defect_type: Optional[str]


class WeeklyMetricsResponse(BaseModel):
    """Weekly metrics aggregation response."""
    org_id: UUID
    start_date: date
    end_date: date
    setup_metrics: SetupMetrics
    quality_metrics: QualityMetrics
    generated_at: datetime
