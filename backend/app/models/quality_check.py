"""Quality Check model for logging quality inspection results."""

import uuid
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional

from sqlalchemy import String, Integer, DateTime, ForeignKey, func, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.core.database import Base
from backend.app.core.types import GUID

if TYPE_CHECKING:
    from backend.app.models.org import Org
    from backend.app.models.user import User


class QualityResult(str, Enum):
    """Result of a quality check."""
    PASS = "pass"
    FAIL = "fail"
    REWORK = "rework"
    CONDITIONAL = "conditional"


class QualityCheck(Base):
    """Quality inspection result logged by supervisor.
    
    Captures inspection results for operations/orders.
    Used for tracking quality metrics and identifying issues.
    """

    __tablename__ = "quality_checks"
    __table_args__ = (
        Index("ix_quality_checks_org", "org_id"),
        Index("ix_quality_checks_order", "org_id", "order_id"),
        Index("ix_quality_checks_result", "org_id", "result"),
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
        comment="User who logged this check",
    )
    order_id: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        comment="Order identifier",
    )
    op_id: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
        comment="Operation identifier (if specific to an op)",
    )
    machine_id: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
        comment="Machine where check was performed",
    )
    result: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        comment="Check result (pass/fail/rework/conditional)",
    )
    defect_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        comment="Number of defects found",
    )
    defect_type: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        comment="Type of defect if any",
    )
    notes: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
        comment="Inspector notes",
    )
    check_ts: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        comment="When the check was performed",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # Relationships
    org: Mapped["Org"] = relationship("Org")
    logged_by: Mapped[Optional["User"]] = relationship("User")

    def __repr__(self) -> str:
        return f"<QualityCheck(id={self.id}, order={self.order_id}, result={self.result})>"
