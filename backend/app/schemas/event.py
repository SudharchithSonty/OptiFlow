"""Event request/response schemas."""

from datetime import datetime
from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class EventCreate(BaseModel):
    """Request to create an event."""
    event_type: str = Field(..., min_length=1, max_length=50)
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    payload: Optional[dict[str, Any]] = None
    event_ts: Optional[datetime] = None


class EventResponse(BaseModel):
    """Event details response."""
    model_config = {"from_attributes": True}
    
    id: UUID
    org_id: UUID
    run_id: UUID
    event_type: str
    title: str
    description: Optional[str]
    payload: Optional[dict[str, Any]]
    event_ts: datetime
    created_at: datetime
    created_by_user_id: Optional[UUID]


class EventSummary(BaseModel):
    """Abbreviated event for listing."""
    model_config = {"from_attributes": True}
    
    id: UUID
    event_type: str
    title: str
    event_ts: datetime
