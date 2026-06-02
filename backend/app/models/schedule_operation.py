"""Schedule operation model for Gantt chart data."""

import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import String, Integer, DateTime, Float, ForeignKey, func, Index
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.core.database import Base
from backend.app.core.types import GUID


class ScheduleOperation(Base):
    """A single scheduled operation/task within a run.

    Each row represents one job-on-machine assignment with start/end times,
    used to render the Gantt chart on the schedule view.
    """

    __tablename__ = "schedule_operations"
    __table_args__ = (
        Index("ix_schedops_run", "run_id"),
        Index("ix_schedops_machine", "run_id", "machine_code"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        GUID(), primary_key=True, default=uuid.uuid4,
    )
    run_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("runs.id", ondelete="CASCADE"),
        nullable=False,
    )
    org_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("orgs.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    order_code: Mapped[str] = mapped_column(
        String(50), nullable=False,
    )
    machine_code: Mapped[str] = mapped_column(
        String(50), nullable=False,
    )
    product_name: Mapped[str] = mapped_column(
        String(255), nullable=False,
    )
    operation_seq: Mapped[int] = mapped_column(
        Integer, nullable=False, default=1,
    )
    start_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False,
    )
    end_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False,
    )
    setup_minutes: Mapped[float] = mapped_column(
        Float, nullable=False, default=0.0,
    )
    processing_minutes: Mapped[float] = mapped_column(
        Float, nullable=False, default=0.0,
    )
    status: Mapped[str] = mapped_column(
        String(50), nullable=False, default="scheduled",
    )
    notes: Mapped[Optional[str]] = mapped_column(
        String(500), nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(),
    )

    def __repr__(self) -> str:
        return f"<ScheduleOperation(id={self.id}, order={self.order_code}, machine={self.machine_code})>"
