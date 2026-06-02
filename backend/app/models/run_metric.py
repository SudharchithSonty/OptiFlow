"""Run metrics model for KPI snapshots."""

import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import String, DateTime, Float, ForeignKey, func, Index
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.core.database import Base
from backend.app.core.types import GUID


class RunMetric(Base):
    """KPI snapshot for a scheduling run.

    Each run produces one metrics row summarizing performance indicators
    like OTD, utilization, setup time, etc.
    """

    __tablename__ = "run_metrics"
    __table_args__ = (
        Index("ix_run_metrics_run", "run_id", unique=True),
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
    on_time_delivery_pct: Mapped[float] = mapped_column(
        Float, nullable=False, default=0.0,
    )
    utilization_pct: Mapped[float] = mapped_column(
        Float, nullable=False, default=0.0,
    )
    total_setup_minutes: Mapped[float] = mapped_column(
        Float, nullable=False, default=0.0,
    )
    total_processing_minutes: Mapped[float] = mapped_column(
        Float, nullable=False, default=0.0,
    )
    makespan_hours: Mapped[float] = mapped_column(
        Float, nullable=False, default=0.0,
    )
    total_late_jobs: Mapped[int] = mapped_column(
        default=0,
    )
    total_jobs: Mapped[int] = mapped_column(
        default=0,
    )
    avg_flow_time_hours: Mapped[float] = mapped_column(
        Float, nullable=False, default=0.0,
    )
    downtime_minutes: Mapped[float] = mapped_column(
        Float, nullable=False, default=0.0,
    )
    reject_count: Mapped[int] = mapped_column(
        default=0,
    )
    notes: Mapped[Optional[str]] = mapped_column(
        String(1000), nullable=True,
    )
    computed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(),
    )

    def __repr__(self) -> str:
        return f"<RunMetric(run_id={self.run_id}, otd={self.on_time_delivery_pct}%)>"
