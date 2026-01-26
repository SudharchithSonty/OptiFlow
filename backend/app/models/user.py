"""User model for authentication."""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.core.database import Base
from backend.app.core.types import GUID

if TYPE_CHECKING:
    from backend.app.models.membership import Membership
    from backend.app.models.run import Run


class User(Base):
    """User entity for authentication and audit.
    
    Users belong to orgs via memberships.
    Password is stored as argon2 hash (never plaintext).
    """

    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        GUID(),
        primary_key=True,
        default=uuid.uuid4,
        comment="Database-generated UUID",
    )
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
        comment="Unique email address",
    )
    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="Argon2 password hash (never store plaintext)",
    )
    full_name: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        comment="Display name",
    )
    is_active: Mapped[bool] = mapped_column(
        default=True,
        comment="Can login if True",
    )
    is_superuser: Mapped[bool] = mapped_column(
        default=False,
        comment="Global admin flag",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Relationships
    memberships: Mapped[List["Membership"]] = relationship(
        "Membership",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    created_runs: Mapped[List["Run"]] = relationship(
        "Run",
        back_populates="created_by",
        foreign_keys="Run.created_by_user_id",
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email})>"
