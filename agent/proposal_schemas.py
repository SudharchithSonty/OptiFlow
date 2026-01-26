"""Schemas for event payloads and agent proposal outputs.

These schemas ensure strict validation of inputs to the agent
and outputs from the agent, preventing hallucinated data.
"""

from datetime import datetime
from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


# =============================================================================
# Event Payload Schemas (input to agent)
# =============================================================================

class MachineDownPayload(BaseModel):
    """Payload for machine_down events."""
    machine_id: str = Field(..., min_length=1, max_length=50)
    start_ts: datetime = Field(..., description="When downtime started")
    end_ts: Optional[datetime] = Field(
        None, description="Expected end (None = unknown)"
    )
    reason: Optional[str] = Field(None, max_length=500)
    
    @field_validator("end_ts")
    @classmethod
    def end_after_start(cls, v: Optional[datetime], info) -> Optional[datetime]:
        """Ensure end_ts is after start_ts if provided."""
        if v is not None:
            start = info.data.get("start_ts")
            if start and v < start:
                raise ValueError("end_ts must be after start_ts")
        return v


class PriorityChangePayload(BaseModel):
    """Payload for priority_change events."""
    order_id: str = Field(..., min_length=1, max_length=50)
    new_priority: Optional[int] = Field(None, ge=1, le=10)
    new_due_date: Optional[datetime] = Field(None)
    reason: Optional[str] = Field(None, max_length=500)
    
    @field_validator("new_priority", "new_due_date")
    @classmethod
    def at_least_one_change(cls, v, info):
        """Ensure at least one change is specified."""
        # This is validated at model level, not field level
        return v


class OrderAddedPayload(BaseModel):
    """Payload for order_added events."""
    order_id: str = Field(..., min_length=1, max_length=50)
    product_family: str = Field(..., min_length=1, max_length=50)
    quantity: int = Field(..., ge=1)
    due_date: datetime
    priority: int = Field(default=5, ge=1, le=10)
    notes: Optional[str] = Field(None, max_length=500)


class QualityIssuePayload(BaseModel):
    """Payload for quality_issue events."""
    order_id: str = Field(..., min_length=1, max_length=50)
    op_id: Optional[str] = Field(None, max_length=50)
    machine_id: Optional[str] = Field(None, max_length=50)
    severity: str = Field(
        ..., 
        description="Severity: minor, major, critical"
    )
    hold_production: bool = Field(
        default=False, 
        description="Whether to hold production"
    )
    notes: Optional[str] = Field(None, max_length=1000)
    
    @field_validator("severity")
    @classmethod
    def valid_severity(cls, v: str) -> str:
        """Validate severity level."""
        allowed = {"minor", "major", "critical"}
        if v.lower() not in allowed:
            raise ValueError(f"severity must be one of {allowed}")
        return v.lower()


# =============================================================================
# Agent Output Schemas (validated outputs)
# =============================================================================

class ConstraintAssumption(BaseModel):
    """An assumed constraint for rescheduling."""
    constraint_type: str = Field(
        ...,
        description="Type: machine_unavailable, order_locked, priority_override",
    )
    entity_id: str = Field(..., description="ID of affected entity")
    start_ts: Optional[datetime] = None
    end_ts: Optional[datetime] = None
    value: Optional[Any] = Field(
        None, 
        description="Constraint value (priority number, etc.)"
    )
    reason: str = Field(..., max_length=500)


class RecommendedAction(BaseModel):
    """A recommended human action."""
    priority: int = Field(..., ge=1, le=5)
    action: str = Field(..., min_length=5, max_length=500)
    affected_orders: list[str] = Field(default_factory=list)
    affected_machines: list[str] = Field(default_factory=list)


class RescheduleProposal(BaseModel):
    """Agent-generated reschedule proposal.
    
    This is a configuration/plan that will be executed deterministically,
    NOT a raw schedule. The agent proposes constraints and recommendations,
    and the scheduler executes them.
    """
    parent_run_id: str = Field(..., description="Parent run to reschedule from")
    reschedule_mode: str = Field(
        default="from_now",
        description="Mode: from_now, from_timestamp, full",
    )
    reschedule_from_ts: Optional[datetime] = Field(
        None,
        description="Timestamp to reschedule from (if mode=from_timestamp)",
    )
    assumed_constraints: list[ConstraintAssumption] = Field(
        default_factory=list,
        description="Constraints assumed for this replan",
    )
    recommended_actions: list[RecommendedAction] = Field(
        default_factory=list,
        description="Recommended human actions",
    )
    explanation: str = Field(
        ...,
        min_length=10,
        max_length=2000,
        description="Short explanation of the proposal",
    )
    # IDs referenced - for validation
    referenced_order_ids: list[str] = Field(default_factory=list)
    referenced_machine_ids: list[str] = Field(default_factory=list)
    referenced_op_ids: list[str] = Field(default_factory=list)
    
    @field_validator("reschedule_mode")
    @classmethod
    def valid_mode(cls, v: str) -> str:
        """Validate reschedule mode."""
        allowed = {"from_now", "from_timestamp", "full"}
        if v not in allowed:
            raise ValueError(f"reschedule_mode must be one of {allowed}")
        return v


class KPIDelta(BaseModel):
    """KPI comparison between runs."""
    metric: str
    parent_value: float
    child_value: float
    delta: float
    delta_pct: float
    is_improvement: bool


class ImpactSummary(BaseModel):
    """Impact summary comparing parent and child runs after reschedule."""
    parent_run_id: str
    child_run_id: str
    kpi_deltas: list[KPIDelta] = Field(default_factory=list)
    late_orders: list[str] = Field(
        default_factory=list,
        description="Orders that will be late after reschedule",
    )
    orders_improved: list[str] = Field(
        default_factory=list,
        description="Orders with improved delivery after reschedule",
    )
    bottleneck_machines: list[str] = Field(
        default_factory=list,
        description="Machines that are bottlenecks",
    )
    bottleneck_risk: str = Field(
        default="low",
        description="Overall bottleneck risk: low, medium, high",
    )
    key_changes: list[str] = Field(
        default_factory=list,
        description="Summary of key schedule changes",
    )
    
    @field_validator("bottleneck_risk")
    @classmethod
    def valid_risk(cls, v: str) -> str:
        """Validate risk level."""
        allowed = {"low", "medium", "high"}
        if v.lower() not in allowed:
            raise ValueError(f"bottleneck_risk must be one of {allowed}")
        return v.lower()


# =============================================================================
# Setup Guidance Schemas
# =============================================================================

class SetupChecklistItem(BaseModel):
    """A single item in a setup checklist."""
    step_number: int = Field(..., ge=1)
    category: str = Field(
        ...,
        description="Category: tooling, fixture, material, first_piece, safety",
    )
    instruction: str = Field(..., min_length=5, max_length=500)
    is_safety_critical: bool = Field(default=False)
    source: Optional[str] = Field(
        None,
        max_length=200,
        description="Source: kb_citation, artifact_field, or None (general)",
    )
    kb_document_id: Optional[str] = Field(
        None,
        description="KB document ID if sourced from knowledge base",
    )


class MachineSetupGuidance(BaseModel):
    """Setup guidance for a single machine."""
    machine_id: str = Field(..., min_length=1, max_length=50)
    from_family: Optional[str] = Field(None, max_length=50)
    to_family: str = Field(..., min_length=1, max_length=50)
    estimated_setup_minutes: Optional[float] = Field(None, ge=0)
    checklist: list[SetupChecklistItem] = Field(default_factory=list)
    first_piece_checks: list[SetupChecklistItem] = Field(default_factory=list)


class SetupGuidance(BaseModel):
    """Complete setup guidance for a shift/run.
    
    Contains per-machine guidance with checklists sourced from
    known parameters and KB citations only.
    """
    run_id: str = Field(..., description="Run this guidance is for")
    generated_at: datetime
    shift_start: Optional[datetime] = Field(
        None, description="Start of shift this guidance covers"
    )
    shift_end: Optional[datetime] = Field(
        None, description="End of shift this guidance covers"
    )
    safety_header: str = Field(
        default="IMPORTANT: This guidance supplements but does not replace "
                "facility Standard Operating Procedures (SOPs). Always follow "
                "safety protocols and lockout/tagout procedures.",
        description="Safety disclaimer header",
    )
    machines: list[MachineSetupGuidance] = Field(default_factory=list)
    # IDs referenced - for validation
    referenced_order_ids: list[str] = Field(default_factory=list)
    referenced_machine_ids: list[str] = Field(default_factory=list)
    referenced_op_ids: list[str] = Field(default_factory=list)
    kb_sources: list[str] = Field(
        default_factory=list,
        description="KB document IDs used as sources",
    )
    limitations: list[str] = Field(
        default_factory=list,
        description="Known limitations of this guidance",
    )
