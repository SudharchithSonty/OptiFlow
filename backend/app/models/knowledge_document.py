"""Knowledge Document model for RAG knowledge base."""

import uuid
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import String, Integer, DateTime, ForeignKey, func, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.core.database import Base
from backend.app.core.types import GUID

if TYPE_CHECKING:
    from backend.app.models.org import Org
    from backend.app.models.user import User
    from backend.app.models.knowledge_chunk import KnowledgeChunk


class DocumentStatus(str, Enum):
    """Status of document processing."""
    PENDING = "pending"
    PROCESSING = "processing"
    READY = "ready"
    FAILED = "failed"


class KnowledgeDocument(Base):
    """A document uploaded to the knowledge base.
    
    Documents are processed into chunks with embeddings for RAG retrieval.
    Multi-tenant via org_id.
    """

    __tablename__ = "knowledge_documents"
    __table_args__ = (
        Index("ix_kb_docs_org", "org_id"),
        Index("ix_kb_docs_status", "org_id", "status"),
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
    uploaded_by_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        GUID(),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        comment="User who uploaded this document",
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="Document title",
    )
    filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="Original filename",
    )
    source: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
        comment="Source/origin of the document",
    )
    mime_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        comment="MIME type (e.g., application/pdf)",
    )
    file_path: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
        comment="Relative path to stored file",
    )
    sha256: Mapped[str] = mapped_column(
        String(64),
        nullable=False,
        index=True,
        comment="SHA256 hash for deduplication",
    )
    file_size_bytes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        comment="File size in bytes",
    )
    page_count: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Number of pages (for PDFs)",
    )
    chunk_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        comment="Number of chunks created",
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default=DocumentStatus.PENDING.value,
        comment="Processing status",
    )
    error_message: Mapped[Optional[str]] = mapped_column(
        String(1000),
        nullable=True,
        comment="Error details if processing failed",
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
    org: Mapped["Org"] = relationship("Org")
    uploaded_by: Mapped[Optional["User"]] = relationship("User")
    chunks: Mapped[List["KnowledgeChunk"]] = relationship(
        "KnowledgeChunk",
        back_populates="document",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<KnowledgeDocument(id={self.id}, title={self.title}, status={self.status})>"
