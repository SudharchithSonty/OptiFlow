"""Organization model for multi-tenancy."""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import String, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.core.database import Base
from backend.app.core.types import GUID

if TYPE_CHECKING:
    from backend.app.models.membership import Membership
    from backend.app.models.run import Run


class Org(Base):
    """Organization entity for multi-tenant isolation.
    
    Every domain object (runs, artifacts) is scoped to an org.
    The active_run_id points to the currently published schedule.
    """

    __tablename__ = "orgs"

    id: Mapped[uuid.UUID] = mapped_column(
        GUID(),
        primary_key=True,
        default=uuid.uuid4,
        comment="Database-generated UUID (never manual ID logic)",
    )
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="Display name of the organization",
    )
    slug: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
        comment="URL-safe identifier for the org",
    )
    is_active: Mapped[bool] = mapped_column(
        default=True,
        comment="Soft delete flag",
    )
    # Active schedule pointer - the published run for this org
    active_run_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        GUID(),
        ForeignKey("runs.id", ondelete="SET NULL"),
        nullable=True,
        comment="Currently published/active schedule run for this org",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        comment="Creation timestamp",
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        comment="Last update timestamp",
    )

    # Relationships
    memberships: Mapped[List["Membership"]] = relationship(
        "Membership",
        back_populates="org",
        cascade="all, delete-orphan",
    )
    runs: Mapped[List["Run"]] = relationship(
        "Run",
        back_populates="org",
        cascade="all, delete-orphan",
        foreign_keys="Run.org_id",
    )
    active_run: Mapped[Optional["Run"]] = relationship(
        "Run",
        foreign_keys=[active_run_id],
        post_update=True,
    )

    def __repr__(self) -> str:
        return f"<Org(id={self.id}, slug={self.slug})>"
