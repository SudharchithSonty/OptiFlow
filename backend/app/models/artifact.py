"""Artifact model for tracking run outputs."""

import uuid
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional

from sqlalchemy import String, DateTime, ForeignKey, func, Index, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.core.database import Base
from backend.app.core.types import GUID

if TYPE_CHECKING:
    from backend.app.models.run import Run


class ArtifactKind(str, Enum):
    """Types of artifacts produced by runs."""
    SCENARIO_META = "scenario_meta"
    SCHEDULE_BASELINE = "schedule_baseline"
    SCHEDULE_OPTIMIZED = "schedule_optimized"
    KPI_BASELINE = "kpi_baseline"
    KPI_OPTIMIZED = "kpi_optimized"
    AGENT_BRIEF_JSON = "agent_brief_json"
    AGENT_BRIEF_MD = "agent_brief_md"
    AGENT_TRACE = "agent_trace"


class Artifact(Base):
    """Tracks artifacts (JSON files) produced by a run.
    
    Small artifacts may be stored directly in JSONB.
    Larger ones are stored on disk with path reference.
    """

    __tablename__ = "artifacts"
    __table_args__ = (
        Index("ix_artifacts_run_kind", "run_id", "kind"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        GUID(),
        primary_key=True,
        default=uuid.uuid4,
    )
    run_id: Mapped[uuid.UUID] = mapped_column(
        GUID(),
        ForeignKey("runs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    kind: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        comment="Artifact type from ArtifactKind enum",
    )
    path: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
        comment="Relative path to artifact file (if stored on disk)",
    )
    data: Mapped[Optional[dict]] = mapped_column(
        JSON,
        nullable=True,
        comment="Inline artifact data (for small JSON artifacts)",
    )
    size_bytes: Mapped[Optional[int]] = mapped_column(
        nullable=True,
        comment="File size in bytes",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # Relationships
    run: Mapped["Run"] = relationship("Run", back_populates="artifacts")

    def __repr__(self) -> str:
        return f"<Artifact(id={self.id}, kind={self.kind}, run_id={self.run_id})>"
