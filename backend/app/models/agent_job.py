"""AgentJob model for tracking AI agent executions and metrics."""

import uuid
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Any, Optional

from sqlalchemy import String, Integer, DateTime, ForeignKey, func, Index, JSON, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.core.database import Base
from backend.app.core.types import GUID

if TYPE_CHECKING:
    from backend.app.models.org import Org
    from backend.app.models.run import Run
    from backend.app.models.event import Event
    from backend.app.models.user import User


class AgentJobType(str, Enum):
    """Type of agent job."""
    DISRUPTION_REPLAN = "disruption_replan"
    SHIFT_BRIEF = "shift_brief"
    SETUP_GUIDANCE = "setup_guidance"
    PLANNER_BRIEF = "planner_brief"


class AgentJobTrigger(str, Enum):
    """What triggered the agent job."""
    EXTERNAL_SCHEDULER = "external_scheduler"
    PLANNER_CLICK = "planner_click"
    EVENT_LOGGED = "event_logged"


class AgentJobStatus(str, Enum):
    """Status of an agent job."""
    QUEUED = "queued"
    RUNNING = "running"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    VALIDATION_FAILED = "validation_failed"
    FALLBACK_USED = "fallback_used"


class AgentJob(Base):
    """Record of an AI agent job execution.
    
    Tracks every agentic action for audit, metrics, and debugging.
    Multi-tenant via org_id.
    """

    __tablename__ = "agent_jobs"
    __table_args__ = (
        Index("ix_agent_jobs_org_status", "org_id", "status"),
        Index("ix_agent_jobs_org_type", "org_id", "job_type"),
        Index("ix_agent_jobs_created", "org_id", "created_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        GUID(),
        primary_key=True,
        default=uuid.uuid4,
    )
    org_id: Mapped[uuid.UUID] = mapped_column(
        GUID(),
        ForeignKey("orgs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Owning organization (multi-tenant key)",
    )
    run_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        GUID(),
        ForeignKey("runs.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
        comment="Run context for this job (parent run for replans)",
    )
    child_run_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        GUID(),
        ForeignKey("runs.id", ondelete="SET NULL"),
        nullable=True,
        comment="Child run created by this job (for replans)",
    )
    input_event_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        GUID(),
        ForeignKey("events.id", ondelete="SET NULL"),
        nullable=True,
        comment="Input event that triggered this job (for disruption replans)",
    )
    created_by_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        GUID(),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        comment="User who triggered this job (if planner_click)",
    )
    job_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        comment="Type of agent job (disruption_replan, shift_brief, setup_guidance)",
    )
    trigger_source: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        comment="What triggered this job (external_scheduler, planner_click, event_logged)",
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default=AgentJobStatus.QUEUED.value,
        comment="Current job status",
    )
    # Timing
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    started_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        comment="When job execution started",
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        comment="When job execution completed",
    )
    duration_ms: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Total execution duration in milliseconds",
    )
    # Outcomes
    artifact_paths: Mapped[Optional[dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True,
        comment="Paths to artifacts produced by this job",
    )
    error_message: Mapped[Optional[str]] = mapped_column(
        String(2000),
        nullable=True,
        comment="Error details if job failed",
    )
    validation_errors: Mapped[Optional[list[str]]] = mapped_column(
        JSON,
        nullable=True,
        comment="List of validation errors if validation_failed",
    )
    # Explicit metric fields for rubric tracking
    validation_pass: Mapped[Optional[bool]] = mapped_column(
        Boolean,
        nullable=True,
        comment="Whether validation passed for this job",
    )
    fallback_used: Mapped[Optional[bool]] = mapped_column(
        Boolean,
        nullable=True,
        comment="Whether fallback was used for this job",
    )
    # Metrics for AI success tracking
    metrics: Mapped[Optional[dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True,
        comment="Job metrics: {validation_pass, fallback_used, model_used, etc.}",
    )
    # User rating (for setup guidance clarity)
    user_rating: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="User rating 1-5 for output quality (setup guidance clarity)",
    )
    rating_comment: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
        comment="Optional user comment on rating",
    )

    # Relationships
    org: Mapped["Org"] = relationship("Org")
    run: Mapped[Optional["Run"]] = relationship(
        "Run",
        foreign_keys=[run_id],
    )
    child_run: Mapped[Optional["Run"]] = relationship(
        "Run",
        foreign_keys=[child_run_id],
    )
    input_event: Mapped[Optional["Event"]] = relationship("Event")
    created_by: Mapped[Optional["User"]] = relationship("User")

    def __repr__(self) -> str:
        return f"<AgentJob(id={self.id}, type={self.job_type}, status={self.status})>"

    def mark_running(self) -> None:
        """Mark job as running."""
        self.status = AgentJobStatus.RUNNING.value
        self.started_at = datetime.utcnow()

    def mark_succeeded(self, duration_ms: int, metrics: Optional[dict] = None) -> None:
        """Mark job as succeeded."""
        self.status = AgentJobStatus.SUCCEEDED.value
        self.completed_at = datetime.utcnow()
        self.duration_ms = duration_ms
        self.validation_pass = True
        self.fallback_used = False
        if metrics:
            self.metrics = metrics

    def mark_failed(self, error_message: str, duration_ms: int) -> None:
        """Mark job as failed."""
        self.status = AgentJobStatus.FAILED.value
        self.completed_at = datetime.utcnow()
        self.duration_ms = duration_ms
        self.error_message = error_message
        self.validation_pass = None
        self.fallback_used = False

    def mark_validation_failed(
        self, 
        errors: list[str], 
        duration_ms: int,
    ) -> None:
        """Mark job as validation failed."""
        self.status = AgentJobStatus.VALIDATION_FAILED.value
        self.completed_at = datetime.utcnow()
        self.duration_ms = duration_ms
        self.validation_errors = errors
        self.validation_pass = False
        self.fallback_used = False

    def mark_fallback_used(
        self, 
        duration_ms: int, 
        metrics: Optional[dict] = None,
    ) -> None:
        """Mark job as succeeded with fallback."""
        self.status = AgentJobStatus.FALLBACK_USED.value
        self.completed_at = datetime.utcnow()
        self.duration_ms = duration_ms
        self.validation_pass = True
        self.fallback_used = True
        if metrics:
            self.metrics = metrics
        else:
            self.metrics = {"fallback_used": True}
