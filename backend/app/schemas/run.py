"""Run-related request/response schemas."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class RunCreate(BaseModel):
    """Request to create a new run."""
    run_name: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="User-provided name for the run",
    )
    seed: int = Field(
        default=42,
        ge=1,
        le=999999,
        description="Random seed for reproducibility",
    )


class RescheduleRequest(BaseModel):
    """Request to create a reschedule run from a parent."""
    run_name: Optional[str] = Field(
        None,
        min_length=1,
        max_length=255,
        description="Name for the child run (auto-generated if not provided)",
    )
    reschedule_mode: str = Field(
        "from_now",
        description="Mode: from_now, from_timestamp, or full",
    )
    reschedule_from_ts: Optional[datetime] = Field(
        None,
        description="Timestamp to reschedule from (if mode is from_timestamp)",
    )
    copy_seed: bool = Field(
        True,
        description="Whether to copy seed from parent run",
    )


class RunResponse(BaseModel):
    """Full run details response."""
    model_config = {"from_attributes": True}
    
    id: UUID
    org_id: UUID
    run_name: str
    run_id: str  # Sanitized filesystem-safe ID
    seed: int
    status: str
    error_message: Optional[str]
    created_at: datetime
    updated_at: datetime
    created_by_user_id: Optional[UUID]
    # Reschedule lineage
    parent_run_id: Optional[UUID]
    trigger: str
    reschedule_mode: str
    reschedule_from_ts: Optional[datetime]


class RunSummary(BaseModel):
    """Abbreviated run summary for listing."""
    model_config = {"from_attributes": True}
    
    id: UUID
    run_name: str
    run_id: str
    status: str
    created_at: datetime
    parent_run_id: Optional[UUID] = None
    trigger: str = "manual"


class ArtifactInfo(BaseModel):
    """Information about a run artifact."""
    model_config = {"from_attributes": True}
    
    kind: str
    path: Optional[str]
    size_bytes: Optional[int]
    created_at: datetime


class RunDetailResponse(BaseModel):
    """Run details with artifact information."""
    run: RunResponse
    artifacts: list[ArtifactInfo]


class KPIDelta(BaseModel):
    """KPI comparison between runs."""
    metric: str
    parent_value: float
    child_value: float
    delta: float
    delta_pct: float
    is_improvement: bool


class RunCompareResponse(BaseModel):
    """Response comparing parent and child runs."""
    parent_run: RunResponse
    child_run: RunResponse
    kpi_deltas: list[KPIDelta]
    schedule_changes: dict
    summary: str = ""
