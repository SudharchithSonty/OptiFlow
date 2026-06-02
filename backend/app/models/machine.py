"""Machine model for manufacturing equipment."""

import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import String, DateTime, Float, ForeignKey, func, Index
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.core.database import Base
from backend.app.core.types import GUID


class Machine(Base):
    """A manufacturing machine/work-center within an organization."""

    __tablename__ = "machines"
    __table_args__ = (
        Index("ix_machines_org_code", "org_id", "code", unique=True),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        GUID(), primary_key=True, default=uuid.uuid4,
    )
    org_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("orgs.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    code: Mapped[str] = mapped_column(
        String(50), nullable=False,
    )
    name: Mapped[str] = mapped_column(
        String(255), nullable=False,
    )
    machine_type: Mapped[str] = mapped_column(
        String(100), nullable=False, default="CNC",
    )
    status: Mapped[str] = mapped_column(
        String(50), nullable=False, default="idle",
    )
    capacity_hours: Mapped[float] = mapped_column(
        Float, nullable=False, default=8.0,
    )
    setup_time_minutes: Mapped[float] = mapped_column(
        Float, nullable=False, default=30.0,
    )
    efficiency: Mapped[float] = mapped_column(
        Float, nullable=False, default=0.85,
    )
    notes: Mapped[Optional[str]] = mapped_column(
        String(1000), nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(),
    )

    def __repr__(self) -> str:
        return f"<Machine(id={self.id}, code={self.code})>"
