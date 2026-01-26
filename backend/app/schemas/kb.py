"""Knowledge Base (RAG) schemas."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class KBDocumentUpload(BaseModel):
    """Metadata for document upload (actual file via multipart)."""
    title: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Document title",
    )
    source: Optional[str] = Field(
        None,
        max_length=500,
        description="Source/origin of the document",
    )


class KBDocumentResponse(BaseModel):
    """Response with knowledge document details."""
    model_config = {"from_attributes": True}
    
    id: UUID
    org_id: UUID
    title: str
    filename: str
    source: Optional[str]
    mime_type: str
    file_size_bytes: int
    page_count: Optional[int]
    chunk_count: int
    status: str
    error_message: Optional[str]
    created_at: datetime
    updated_at: datetime
    uploaded_by_user_id: Optional[UUID]


class KBDocumentSummary(BaseModel):
    """Abbreviated document for listing."""
    model_config = {"from_attributes": True}
    
    id: UUID
    title: str
    filename: str
    status: str
    chunk_count: int
    created_at: datetime


class KBChunkCitation(BaseModel):
    """Citation info for a retrieved chunk."""
    chunk_id: str
    document_id: str
    document_title: str
    page: Optional[int]
    chunk_index: int
    excerpt: str
    score: Optional[float] = None


class KBQueryRequest(BaseModel):
    """Request to query the knowledge base."""
    query: str = Field(
        ...,
        min_length=3,
        max_length=1000,
        description="Search query",
    )
    top_k: int = Field(
        5,
        ge=1,
        le=20,
        description="Number of results to return",
    )


class KBQueryResponse(BaseModel):
    """Response from knowledge base query."""
    query: str
    results: list[KBChunkCitation]
    total_chunks_searched: int
    query_time_ms: float
