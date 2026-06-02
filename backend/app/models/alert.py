"""Alert model for actionable notifications."""

import uuid
from datetime import datetime
from typing import Any, Optional

from sqlalchemy import String, Boolean, DateTime, ForeignKey, func, Index, JSON
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.core.database import Base
from backend.app.core.types import GUID


class Alert(Base):
    """Actionable alert derived from events, orders, or machine state."""

    __tablename__ = "alerts"
    __table_args__ = (
        Index("ix_alerts_org_ack", "org_id", "acknowledged"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        GUID(), primary_key=True, default=uuid.uuid4,
    )
    org_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("orgs.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    alert_type: Mapped[str] = mapped_column(
        String(50), nullable=False,
    )
    severity: Mapped[str] = mapped_column(
        String(20), nullable=False, default="info",
    )
    title: Mapped[str] = mapped_column(
        String(255), nullable=False,
    )
    message: Mapped[str] = mapped_column(
        String(2000), nullable=False,
    )
    source_entity: Mapped[Optional[str]] = mapped_column(
        String(100), nullable=True,
    )
    source_id: Mapped[Optional[str]] = mapped_column(
        String(100), nullable=True,
    )
    payload: Mapped[Optional[dict[str, Any]]] = mapped_column(
        JSON, nullable=True,
    )
    acknowledged: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False,
    )
    acknowledged_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        GUID(), ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    acknowledged_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(),
    )

    def __repr__(self) -> str:
        return f"<Alert(id={self.id}, type={self.alert_type}, severity={self.severity})>"
