"""Order model for customer jobs."""

import uuid
from datetime import date, datetime
from typing import Optional

from sqlalchemy import String, Integer, Date, DateTime, Float, ForeignKey, func, Index
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.core.database import Base
from backend.app.core.types import GUID


class Order(Base):
    """A customer order/job to be scheduled."""

    __tablename__ = "orders"
    __table_args__ = (
        Index("ix_orders_org_status", "org_id", "status"),
        Index("ix_orders_org_code", "org_id", "order_code", unique=True),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        GUID(), primary_key=True, default=uuid.uuid4,
    )
    org_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("orgs.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    customer_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        GUID(), ForeignKey("customers.id", ondelete="SET NULL"),
        nullable=True,
    )
    product_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        GUID(), ForeignKey("products.id", ondelete="SET NULL"),
        nullable=True,
    )
    order_code: Mapped[str] = mapped_column(
        String(50), nullable=False,
    )
    customer_name: Mapped[str] = mapped_column(
        String(255), nullable=False,
    )
    product_name: Mapped[str] = mapped_column(
        String(255), nullable=False,
    )
    quantity: Mapped[int] = mapped_column(
        Integer, nullable=False,
    )
    priority: Mapped[str] = mapped_column(
        String(20), nullable=False, default="medium",
    )
    due_date: Mapped[date] = mapped_column(
        Date, nullable=False,
    )
    status: Mapped[str] = mapped_column(
        String(50), nullable=False, default="pending",
    )
    progress_pct: Mapped[float] = mapped_column(
        Float, nullable=False, default=0.0,
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
        return f"<Order(id={self.id}, code={self.order_code})>"
