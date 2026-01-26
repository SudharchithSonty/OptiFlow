"""Knowledge Chunk model for RAG vector storage (pgvector)."""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import String, Integer, DateTime, ForeignKey, func, Index, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.core.database import Base
from backend.app.core.types import GUID, Vector
from backend.app.core.config import settings

if TYPE_CHECKING:
    from backend.app.models.org import Org
    from backend.app.models.knowledge_document import KnowledgeDocument


class KnowledgeChunk(Base):
    """A chunk of text from a knowledge document with embedding.
    
    Chunks are used for RAG retrieval via similarity search.
    Embeddings are stored as pgvector VECTOR type in Postgres.
    Multi-tenant via org_id.
    """

    __tablename__ = "knowledge_chunks"
    __table_args__ = (
        Index("ix_kb_chunks_org", "org_id"),
        Index("ix_kb_chunks_doc", "document_id"),
        # Note: pgvector index (ivfflat or hnsw) should be created via migration
        # after sufficient data exists for training
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
    document_id: Mapped[uuid.UUID] = mapped_column(
        GUID(),
        ForeignKey("knowledge_documents.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Parent document",
    )
    chunk_index: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        comment="Order within document (0-based)",
    )
    text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment="Chunk text content",
    )
    page: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Page number in source document",
    )
    char_start: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Character offset start in original text",
    )
    char_end: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Character offset end in original text",
    )
    embedding: Mapped[Optional[List[float]]] = mapped_column(
        Vector(dim=settings.embedding_dimensions),
        nullable=True,
        comment="Embedding vector for similarity search",
    )
    token_count: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Approximate token count",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # Relationships
    org: Mapped["Org"] = relationship("Org")
    document: Mapped["KnowledgeDocument"] = relationship(
        "KnowledgeDocument",
        back_populates="chunks",
    )

    def to_citation(self) -> dict:
        """Return citation info for this chunk."""
        return {
            "chunk_id": str(self.id),
            "document_id": str(self.document_id),
            "page": self.page,
            "chunk_index": self.chunk_index,
            "excerpt": self.text[:200] + "..." if len(self.text) > 200 else self.text,
        }

    def __repr__(self) -> str:
        return f"<KnowledgeChunk(id={self.id}, doc_id={self.document_id}, idx={self.chunk_index})>"
