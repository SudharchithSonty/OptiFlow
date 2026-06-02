"""Customer model."""

import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import String, DateTime, ForeignKey, func, Index
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.core.database import Base
from backend.app.core.types import GUID


class Customer(Base):
    """A customer of the manufacturing organization."""

    __tablename__ = "customers"
    __table_args__ = (
        Index("ix_customers_org_code", "org_id", "code", unique=True),
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
    contact_email: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True,
    )
    priority_tier: Mapped[str] = mapped_column(
        String(20), nullable=False, default="normal",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(),
    )

    def __repr__(self) -> str:
        return f"<Customer(id={self.id}, code={self.code})>"
