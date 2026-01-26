"""Run model for scheduling scenarios."""

import re
import uuid
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import String, Integer, DateTime, ForeignKey, func, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.core.database import Base
from backend.app.core.types import GUID

if TYPE_CHECKING:
    from backend.app.models.org import Org
    from backend.app.models.user import User
    from backend.app.models.artifact import Artifact
    from backend.app.models.event import Event
    from backend.app.models.draft_impact_report import DraftImpactReport


class RunStatus(str, Enum):
    """Status of a scheduling run."""
    CREATED = "created"
    GENERATING = "generating"
    GENERATED = "generated"
    SCHEDULING = "scheduling"
    COMPLETED = "completed"
    FAILED = "failed"


class RunTrigger(str, Enum):
    """What triggered the creation of this run."""
    MANUAL = "manual"
    RESCHEDULE = "reschedule"
    ACTUALS = "actuals"
    WHATIF = "whatif"


class RescheduleMode(str, Enum):
    """Mode for reschedule runs."""
    FROM_NOW = "from_now"
    FROM_TIMESTAMP = "from_timestamp"
    FULL = "full"


# Pattern for valid run names (alphanumeric, hyphens, underscores)
RUN_NAME_PATTERN = re.compile(r"^[a-zA-Z0-9][a-zA-Z0-9_-]{0,62}[a-zA-Z0-9]$|^[a-zA-Z0-9]$")


def sanitize_run_id(name: str) -> str:
    """Sanitize run name to create a safe run_id.
    
    Prevents path traversal and ensures filesystem safety.
    
    Args:
        name: User-provided run name
        
    Returns:
        Sanitized run_id safe for filesystem paths
        
    Raises:
        ValueError: If name cannot be sanitized to a valid run_id
    """
    if not name:
        raise ValueError("Run name cannot be empty")
    
    # Check for path traversal BEFORE any sanitization
    if ".." in name:
        raise ValueError("Invalid run name: potential path traversal")
    
    # Check for leading dot BEFORE sanitization
    stripped_name = name.strip()
    if stripped_name.startswith("."):
        raise ValueError("Invalid run name: potential path traversal")
    
    # Remove any path separators and dangerous characters
    sanitized = re.sub(r"[/\\:*?\"<>|]", "", name)
    sanitized = re.sub(r"\.+", "_", sanitized)  # Replace dots
    sanitized = re.sub(r"\s+", "_", sanitized)  # Replace whitespace
    sanitized = re.sub(r"_+", "_", sanitized)  # Collapse multiple underscores
    sanitized = sanitized.strip("_-")
    
    if not sanitized or len(sanitized) > 64:
        raise ValueError("Run name must be 1-64 characters after sanitization")
    
    return sanitized.lower()


class Run(Base):
    """A scheduling run within an organization.
    
    Each run contains generated data, schedules, KPIs, and agent outputs.
    Artifacts are stored on disk under runs/<org_id>/<run_id>/.
    
    Supports reschedule lineage via parent_run_id for compare views.
    """

    __tablename__ = "runs"
    __table_args__ = (
        Index("ix_runs_org_status", "org_id", "status"),
        Index("ix_runs_parent", "parent_run_id"),
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
    created_by_user_id: Mapped[uuid.UUID] = mapped_column(
        GUID(),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        comment="User who created this run",
    )
    # Reschedule lineage
    parent_run_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        GUID(),
        ForeignKey("runs.id", ondelete="SET NULL"),
        nullable=True,
        comment="Parent run if this is a reschedule/whatif",
    )
    trigger: Mapped[str] = mapped_column(
        String(50),
        default=RunTrigger.MANUAL.value,
        comment="What triggered this run creation",
    )
    reschedule_mode: Mapped[str] = mapped_column(
        String(50),
        default=RescheduleMode.FROM_NOW.value,
        comment="Mode for reschedule (from_now, from_timestamp, full)",
    )
    reschedule_from_ts: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        comment="Timestamp to reschedule from (if mode is from_timestamp)",
    )
    run_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="User-provided display name",
    )
    run_id: Mapped[str] = mapped_column(
        String(64),
        nullable=False,
        index=True,
        comment="Sanitized filesystem-safe identifier",
    )
    seed: Mapped[int] = mapped_column(
        Integer,
        default=42,
        comment="Random seed for reproducibility",
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default=RunStatus.CREATED.value,
        comment="Current run status",
    )
    error_message: Mapped[Optional[str]] = mapped_column(
        String(1000),
        nullable=True,
        comment="Error details if status is FAILED",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Relationships
    org: Mapped["Org"] = relationship("Org", back_populates="runs")
    created_by: Mapped[Optional["User"]] = relationship(
        "User",
        back_populates="created_runs",
        foreign_keys=[created_by_user_id],
    )
    parent_run: Mapped[Optional["Run"]] = relationship(
        "Run",
        remote_side=[id],
        back_populates="child_runs",
        foreign_keys=[parent_run_id],
    )
    child_runs: Mapped[List["Run"]] = relationship(
        "Run",
        back_populates="parent_run",
        foreign_keys=[parent_run_id],
    )
    artifacts: Mapped[List["Artifact"]] = relationship(
        "Artifact",
        back_populates="run",
        cascade="all, delete-orphan",
    )
    events: Mapped[List["Event"]] = relationship(
        "Event",
        back_populates="run",
        cascade="all, delete-orphan",
    )
    draft_impact_reports: Mapped[List["DraftImpactReport"]] = relationship(
        "DraftImpactReport",
        back_populates="run",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Run(id={self.id}, run_id={self.run_id}, status={self.status})>"
