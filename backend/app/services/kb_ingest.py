"""Knowledge Base ingestion service.

Handles: file upload -> text extraction -> chunking -> embedding -> storage.
"""

import hashlib
import logging
import time
from pathlib import Path
from typing import List, Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import settings
from backend.app.models import KnowledgeDocument, KnowledgeChunk, DocumentStatus

logger = logging.getLogger(__name__)


def extract_text_from_pdf(file_path: Path) -> tuple[str, int]:
    """Extract text from PDF file.
    
    Args:
        file_path: Path to PDF file
        
    Returns:
        Tuple of (extracted text, page count)
        
    Raises:
        ValueError: If file cannot be processed
    """
    try:
        from pypdf import PdfReader
        
        reader = PdfReader(file_path)
        page_count = len(reader.pages)
        
        text_parts = []
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
        
        full_text = "\n\n".join(text_parts)
        
        if not full_text.strip():
            raise ValueError("PDF contains no extractable text")
        
        return full_text, page_count
        
    except Exception as e:
        logger.error(f"PDF extraction failed for {file_path}: {e}")
        raise ValueError(f"Failed to extract text from PDF: {e}")


def chunk_text(
    text: str,
    chunk_size: int = settings.kb_chunk_size,
    overlap: int = settings.kb_chunk_overlap,
) -> List[dict]:
    """Split text into overlapping chunks.
    
    Args:
        text: Full text to chunk
        chunk_size: Target characters per chunk
        overlap: Character overlap between chunks
        
    Returns:
        List of dicts with text, char_start, char_end
    """
    chunks = []
    start = 0
    text_len = len(text)
    
    while start < text_len:
        end = min(start + chunk_size, text_len)
        
        # Try to break at sentence boundary
        if end < text_len:
            # Look for sentence end within last 20% of chunk
            search_start = max(start + int(chunk_size * 0.8), start)
            for sep in [". ", ".\n", "! ", "? ", "\n\n"]:
                pos = text.rfind(sep, search_start, end)
                if pos > start:
                    end = pos + len(sep)
                    break
        
        chunk_text = text[start:end].strip()
        if chunk_text:
            chunks.append({
                "text": chunk_text,
                "char_start": start,
                "char_end": end,
            })
        
        # Move forward, accounting for overlap
        start = max(end - overlap, start + 1)
        if start >= text_len:
            break
    
    return chunks


async def get_embeddings(texts: List[str]) -> List[List[float]]:
    """Get embeddings for a list of texts using OpenAI API.
    
    Args:
        texts: List of text strings to embed
        
    Returns:
        List of embedding vectors
        
    Raises:
        ValueError: If embedding fails
    """
    if not settings.openai_api_key:
        logger.warning("OpenAI API key not configured, returning empty embeddings")
        return [[0.0] * settings.embedding_dimensions for _ in texts]
    
    try:
        import openai
        
        client = openai.OpenAI(
            api_key=settings.openai_api_key,
            timeout=settings.openai_timeout_seconds,
        )
        
        response = client.embeddings.create(
            model=settings.embedding_model,
            input=texts,
        )
        
        return [item.embedding for item in response.data]
        
    except Exception as e:
        logger.error(f"Embedding generation failed: {e}")
        raise ValueError(f"Failed to generate embeddings: {e}")


async def ingest_document(
    db: AsyncSession,
    org_id: UUID,
    user_id: Optional[UUID],
    title: str,
    filename: str,
    file_path: Path,
    mime_type: str,
    source: Optional[str] = None,
) -> KnowledgeDocument:
    """Ingest a document into the knowledge base.
    
    Full pipeline: store file -> extract text -> chunk -> embed -> store chunks.
    
    Args:
        db: Database session
        org_id: Organization ID
        user_id: Uploading user ID
        title: Document title
        filename: Original filename
        file_path: Path to uploaded file
        mime_type: MIME type
        source: Optional source description
        
    Returns:
        Created KnowledgeDocument
    """
    start_time = time.time()
    
    # Calculate file hash for deduplication
    with open(file_path, "rb") as f:
        file_hash = hashlib.sha256(f.read()).hexdigest()
    
    file_size = file_path.stat().st_size
    
    # Check for duplicate
    existing = await db.execute(
        select(KnowledgeDocument).where(
            KnowledgeDocument.org_id == org_id,
            KnowledgeDocument.sha256 == file_hash,
        )
    )
    if existing.scalar_one_or_none():
        raise ValueError("Document with same content already exists")
    
    # Create document record
    doc = KnowledgeDocument(
        org_id=org_id,
        uploaded_by_user_id=user_id,
        title=title,
        filename=filename,
        source=source,
        mime_type=mime_type,
        file_path=str(file_path),
        sha256=file_hash,
        file_size_bytes=file_size,
        status=DocumentStatus.PROCESSING.value,
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    
    try:
        # Extract text
        if mime_type == "application/pdf":
            full_text, page_count = extract_text_from_pdf(file_path)
            doc.page_count = page_count
        else:
            # For text files
            full_text = file_path.read_text(encoding="utf-8")
            doc.page_count = None
        
        # Chunk text
        chunks_data = chunk_text(full_text)
        
        if not chunks_data:
            raise ValueError("No chunks generated from document")
        
        # Generate embeddings
        chunk_texts = [c["text"] for c in chunks_data]
        embeddings = await get_embeddings(chunk_texts)
        
        # Create chunk records
        for i, (chunk_data, embedding) in enumerate(zip(chunks_data, embeddings)):
            chunk = KnowledgeChunk(
                org_id=org_id,
                document_id=doc.id,
                chunk_index=i,
                text=chunk_data["text"],
                char_start=chunk_data["char_start"],
                char_end=chunk_data["char_end"],
                embedding=embedding,
                token_count=len(chunk_data["text"].split()),  # Rough estimate
            )
            db.add(chunk)
        
        doc.chunk_count = len(chunks_data)
        doc.status = DocumentStatus.READY.value
        
        await db.commit()
        await db.refresh(doc)
        
        elapsed = time.time() - start_time
        logger.info(f"Ingested document {doc.id}: {len(chunks_data)} chunks in {elapsed:.2f}s")
        
        return doc
        
    except Exception as e:
        logger.error(f"Document ingestion failed: {e}")
        doc.status = DocumentStatus.FAILED.value
        doc.error_message = str(e)[:1000]
        await db.commit()
        raise
