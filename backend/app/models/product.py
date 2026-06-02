"""Product model."""

import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import String, DateTime, Float, ForeignKey, func, Index
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.core.database import Base
from backend.app.core.types import GUID


class Product(Base):
    """A product/SKU that can be manufactured."""

    __tablename__ = "products"
    __table_args__ = (
        Index("ix_products_org_sku", "org_id", "sku", unique=True),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        GUID(), primary_key=True, default=uuid.uuid4,
    )
    org_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("orgs.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    sku: Mapped[str] = mapped_column(
        String(100), nullable=False,
    )
    name: Mapped[str] = mapped_column(
        String(255), nullable=False,
    )
    description: Mapped[Optional[str]] = mapped_column(
        String(1000), nullable=True,
    )
    cycle_time_minutes: Mapped[float] = mapped_column(
        Float, nullable=False, default=10.0,
    )
    setup_time_minutes: Mapped[float] = mapped_column(
        Float, nullable=False, default=15.0,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(),
    )

    def __repr__(self) -> str:
        return f"<Product(id={self.id}, sku={self.sku})>"
