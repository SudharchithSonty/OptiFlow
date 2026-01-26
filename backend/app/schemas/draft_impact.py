"""Draft impact report request/response schemas."""

from datetime import datetime
from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class DraftImpactCreate(BaseModel):
    """Request to save/update a draft impact report."""
    step: int = Field(..., ge=1, le=10, description="Current wizard step (1-based)")
    data: dict[str, Any] = Field(default_factory=dict, description="Form data for this step")
    is_complete: bool = Field(default=False, description="Mark draft as finalized")


class DraftImpactResponse(BaseModel):
    """Draft impact report response."""
    model_config = {"from_attributes": True}
    
    id: UUID
    org_id: UUID
    run_id: UUID
    step: int
    data: dict[str, Any]
    is_complete: bool
    created_at: datetime
    updated_at: datetime
    created_by_user_id: Optional[UUID]
