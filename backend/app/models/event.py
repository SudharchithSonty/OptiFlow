"""Event model for logging events on runs."""

import uuid
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional, Any

from sqlalchemy import String, DateTime, ForeignKey, func, Index, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.core.database import Base
from backend.app.core.types import GUID

if TYPE_CHECKING:
    from backend.app.models.org import Org
    from backend.app.models.run import Run
    from backend.app.models.user import User


class EventType(str, Enum):
    """Type of event logged."""
    DISRUPTION = "disruption"
    MACHINE_DOWN = "machine_down"
    PRIORITY_CHANGE = "priority_change"
    ORDER_ADDED = "order_added"
    ORDER_CANCELLED = "order_cancelled"
    MANUAL_OVERRIDE = "manual_override"
    QUALITY_ISSUE = "quality_issue"
    COMMENT = "comment"


class Event(Base):
    """An event logged on a run.
    
    Events capture disruptions, changes, and comments during execution.
    Multi-tenant via org_id.
    """

    __tablename__ = "events"
    __table_args__ = (
        Index("ix_events_org_run", "org_id", "run_id"),
        Index("ix_events_type", "org_id", "event_type"),
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
        comment="Run this event belongs to",
    )
    created_by_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        GUID(),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        comment="User who created this event",
    )
    event_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        comment="Type of event",
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="Short title/summary",
    )
    description: Mapped[Optional[str]] = mapped_column(
        String(2000),
        nullable=True,
        comment="Detailed description",
    )
    payload: Mapped[Optional[dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True,
        comment="Additional structured data",
    )
    event_ts: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        comment="When the event occurred",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # Relationships
    org: Mapped["Org"] = relationship("Org")
    run: Mapped["Run"] = relationship("Run", back_populates="events")
    created_by: Mapped[Optional["User"]] = relationship("User")

    def __repr__(self) -> str:
        return f"<Event(id={self.id}, type={self.event_type}, run_id={self.run_id})>"
