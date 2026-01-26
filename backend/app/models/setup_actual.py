"""Setup Actual model for logging actual setup times."""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import String, Float, DateTime, ForeignKey, func, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.core.database import Base
from backend.app.core.types import GUID

if TYPE_CHECKING:
    from backend.app.models.org import Org
    from backend.app.models.user import User


class SetupActual(Base):
    """Actual setup time logged by supervisor.
    
    Captures real changeover times between product families on machines.
    Used for comparing planned vs actual and refining changeover matrix.
    """

    __tablename__ = "setup_actuals"
    __table_args__ = (
        Index("ix_setup_actuals_org", "org_id"),
        Index("ix_setup_actuals_machine", "org_id", "machine_id"),
        Index("ix_setup_actuals_families", "org_id", "from_family", "to_family"),
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
    logged_by_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        GUID(),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        comment="User who logged this actual",
    )
    machine_id: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        comment="Machine identifier (e.g., M01)",
    )
    from_family: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        comment="Previous product family",
    )
    to_family: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        comment="New product family",
    )
    actual_minutes: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        comment="Actual setup time in minutes",
    )
    planned_minutes: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
        comment="Planned setup time from matrix (for variance)",
    )
    notes: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
        comment="Optional notes about the setup",
    )
    setup_ts: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        comment="When the setup occurred",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # Relationships
    org: Mapped["Org"] = relationship("Org")
    logged_by: Mapped[Optional["User"]] = relationship("User")

    @property
    def variance_minutes(self) -> Optional[float]:
        """Calculate variance between actual and planned."""
        if self.planned_minutes is not None:
            return self.actual_minutes - self.planned_minutes
        return None

    def __repr__(self) -> str:
        return f"<SetupActual(id={self.id}, {self.from_family}->{self.to_family}, {self.actual_minutes}min)>"
