"""Agent job request/response schemas."""

from datetime import datetime
from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class AgentJobCreate(BaseModel):
    """Request to create an agent job."""
    job_type: str = Field(
        ...,
        description="Type: disruption_replan, shift_brief, setup_guidance, planner_brief",
    )
    trigger_source: str = Field(
        ...,
        description="Trigger: external_scheduler, planner_click, event_logged",
    )
    run_id: Optional[UUID] = Field(
        None,
        description="Parent run context for the job",
    )
    input_event_id: Optional[UUID] = Field(
        None,
        description="Event that triggered the job (for disruption_replan)",
    )


class AgentJobResponse(BaseModel):
    """Full agent job response."""
    model_config = {"from_attributes": True}
    
    id: UUID
    org_id: UUID
    run_id: Optional[UUID]
    child_run_id: Optional[UUID]
    input_event_id: Optional[UUID]
    created_by_user_id: Optional[UUID]
    job_type: str
    trigger_source: str
    status: str
    created_at: datetime
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    duration_ms: Optional[int]
    artifact_paths: Optional[dict[str, Any]]
    error_message: Optional[str]
    validation_errors: Optional[list[str]]
    validation_pass: Optional[bool]
    fallback_used: Optional[bool]
    metrics: Optional[dict[str, Any]]
    user_rating: Optional[int]
    rating_comment: Optional[str]


class AgentJobSummary(BaseModel):
    """Abbreviated agent job for listing."""
    model_config = {"from_attributes": True}
    
    id: UUID
    job_type: str
    trigger_source: str
    status: str
    created_at: datetime
    duration_ms: Optional[int]
    child_run_id: Optional[UUID]


class AgentJobRatingUpdate(BaseModel):
    """Request to update user rating on an agent job."""
    rating: int = Field(..., ge=1, le=5, description="Rating 1-5")
    comment: Optional[str] = Field(None, max_length=500, description="Optional comment")


class ReplanRequest(BaseModel):
    """Request to trigger a replan from an event."""
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


class ReplanResponse(BaseModel):
    """Response from replan endpoint."""
    agent_job_id: UUID
    child_run_id: Optional[UUID]
    status: str
    validation_errors: Optional[list[str]] = None
    error_message: Optional[str] = None


class PublishRequest(BaseModel):
    """Request to publish a run as active schedule."""
    # Currently empty - just needs run_id from URL
    pass


class PublishResponse(BaseModel):
    """Response from publish endpoint."""
    org_id: UUID
    run_id: UUID
    run_name: str
    published_at: datetime
    message: str


class ActiveScheduleResponse(BaseModel):
    """Response for active schedule endpoint."""
    org_id: UUID
    has_active_schedule: bool
    run_id: Optional[str] = None
    run_name: Optional[str] = None
    run_status: Optional[str] = None
    published_at: Optional[datetime] = None
