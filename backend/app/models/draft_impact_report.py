"""Draft Impact Report model for stepwise wizard persistence."""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import String, Integer, DateTime, ForeignKey, func, Index, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.core.database import Base
from backend.app.core.types import GUID

if TYPE_CHECKING:
    from backend.app.models.org import Org
    from backend.app.models.run import Run
    from backend.app.models.user import User


class DraftImpactReport(Base):
    """A draft impact report saved during the reschedule wizard.
    
    Allows users to save progress at each step and resume later.
    Only one active draft per run at a time.
    """

    __tablename__ = "draft_impact_reports"
    __table_args__ = (
        Index("ix_draft_impact_org_run", "org_id", "run_id"),
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
    run_id: Mapped[uuid.UUID] = mapped_column(
        GUID(),
        ForeignKey("runs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Run this draft belongs to",
    )
    created_by_user_id: Mapped[uuid.UUID] = mapped_column(
        GUID(),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        comment="User who created this draft",
    )
    step: Mapped[int] = mapped_column(
        Integer,
        default=1,
        comment="Current wizard step (1-based)",
    )
    data: Mapped[dict[str, Any]] = mapped_column(
        JSON,
        nullable=False,
        default=dict,
        comment="Draft form data as JSON",
    )
    is_complete: Mapped[bool] = mapped_column(
        default=False,
        comment="Whether the draft has been finalized",
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
    org: Mapped["Org"] = relationship("Org")
    run: Mapped["Run"] = relationship("Run", back_populates="draft_impact_reports")
    created_by: Mapped["User"] = relationship("User")

    def __repr__(self) -> str:
        return f"<DraftImpactReport(id={self.id}, run_id={self.run_id}, step={self.step})>"
