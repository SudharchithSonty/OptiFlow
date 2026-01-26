"""Setup and quality actuals request/response schemas."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class SetupActualCreate(BaseModel):
    """Request to log a setup actual."""
    machine_id: str = Field(..., min_length=1, max_length=50)
    from_family: str = Field(..., min_length=1, max_length=50)
    to_family: str = Field(..., min_length=1, max_length=50)
    actual_minutes: float = Field(..., gt=0, le=1440)
    planned_minutes: Optional[float] = Field(None, gt=0, le=1440)
    notes: Optional[str] = Field(None, max_length=500)
    setup_ts: Optional[datetime] = None


class SetupActualResponse(BaseModel):
    """Setup actual response."""
    model_config = {"from_attributes": True}
    
    id: UUID
    org_id: UUID
    machine_id: str
    from_family: str
    to_family: str
    actual_minutes: float
    planned_minutes: Optional[float]
    notes: Optional[str]
    setup_ts: datetime
    created_at: datetime
    logged_by_user_id: Optional[UUID]


class QualityCheckCreate(BaseModel):
    """Request to log a quality check."""
    order_id: str = Field(..., min_length=1, max_length=50)
    op_id: Optional[str] = Field(None, max_length=50)
    machine_id: Optional[str] = Field(None, max_length=50)
    result: str = Field(..., pattern="^(pass|fail|rework|conditional)$")
    defect_count: int = Field(default=0, ge=0)
    defect_type: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = Field(None, max_length=500)
    check_ts: Optional[datetime] = None


class QualityCheckResponse(BaseModel):
    """Quality check response."""
    model_config = {"from_attributes": True}
    
    id: UUID
    org_id: UUID
    order_id: str
    op_id: Optional[str]
    machine_id: Optional[str]
    result: str
    defect_count: int
    defect_type: Optional[str]
    notes: Optional[str]
    check_ts: datetime
    created_at: datetime
    logged_by_user_id: Optional[UUID]
