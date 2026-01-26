"""Knowledge Base retrieval service.

Handles: query embedding -> similarity search -> result formatting.
"""

import logging
import time
from typing import List
from uuid import UUID

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import settings
from backend.app.models import KnowledgeChunk, KnowledgeDocument
from backend.app.schemas.kb import KBChunkCitation, KBQueryResponse

logger = logging.getLogger(__name__)


async def get_query_embedding(query: str) -> List[float]:
    """Get embedding for a query string.
    
    Args:
        query: Search query
        
    Returns:
        Embedding vector
    """
    if not settings.openai_api_key:
        logger.warning("OpenAI API key not configured, returning zero embedding")
        return [0.0] * settings.embedding_dimensions
    
    try:
        import openai
        
        client = openai.OpenAI(
            api_key=settings.openai_api_key,
            timeout=settings.openai_timeout_seconds,
        )
        
        response = client.embeddings.create(
            model=settings.embedding_model,
            input=[query],
        )
        
        return response.data[0].embedding
        
    except Exception as e:
        logger.error(f"Query embedding failed: {e}")
        raise ValueError(f"Failed to generate query embedding: {e}")


async def search_chunks(
    db: AsyncSession,
    org_id: UUID,
    query: str,
    top_k: int = settings.kb_top_k,
) -> KBQueryResponse:
    """Search knowledge base for relevant chunks.
    
    Uses cosine similarity via pgvector for ranking.
    Multi-tenant: only searches chunks in the specified org.
    
    Args:
        db: Database session
        org_id: Organization ID (multi-tenant filter)
        query: Search query
        top_k: Number of results to return
        
    Returns:
        KBQueryResponse with ranked results
    """
    start_time = time.time()
    
    # Get query embedding
    query_embedding = await get_query_embedding(query)
    
    # Count total chunks for this org
    count_result = await db.execute(
        select(KnowledgeChunk.id).where(KnowledgeChunk.org_id == org_id)
    )
    total_chunks = len(count_result.all())
    
    if total_chunks == 0:
        return KBQueryResponse(
            query=query,
            chunks=[],
            total_chunks_searched=0,
            query_time_ms=(time.time() - start_time) * 1000,
        )
    
    # For SQLite (testing) - simple text search fallback
    # For Postgres with pgvector - use proper vector similarity
    try:
        # Try pgvector similarity search
        # Note: This requires pgvector extension to be enabled
        embedding_str = "[" + ",".join(map(str, query_embedding)) + "]"
        
        sql = text("""
            SELECT c.id, c.document_id, c.chunk_index, c.text, c.page,
                   d.title as doc_title,
                   1 - (c.embedding <=> :embedding::vector) as score
            FROM knowledge_chunks c
            JOIN knowledge_documents d ON c.document_id = d.id
            WHERE c.org_id = :org_id
            ORDER BY c.embedding <=> :embedding::vector
            LIMIT :limit
        """)
        
        result = await db.execute(
            sql,
            {
                "org_id": str(org_id),
                "embedding": embedding_str,
                "limit": top_k,
            }
        )
        rows = result.fetchall()
        
    except Exception as e:
        logger.warning(f"pgvector search failed, using fallback: {e}")
        # Fallback: simple keyword matching (for SQLite tests)
        result = await db.execute(
            select(KnowledgeChunk)
            .where(KnowledgeChunk.org_id == org_id)
            .where(KnowledgeChunk.text.ilike(f"%{query}%"))
            .limit(top_k)
        )
        chunks = result.scalars().all()
        
        # Get document titles
        citations = []
        for chunk in chunks:
            doc_result = await db.execute(
                select(KnowledgeDocument).where(KnowledgeDocument.id == chunk.document_id)
            )
            doc = doc_result.scalar_one_or_none()
            doc_title = doc.title if doc else "Unknown"
            
            citations.append(KBChunkCitation(
                chunk_id=chunk.id,
                document_id=chunk.document_id,
                document_title=doc_title,
                page=chunk.page,
                chunk_index=chunk.chunk_index,
                excerpt=chunk.text[:200] + "..." if len(chunk.text) > 200 else chunk.text,
                score=None,
            ))
        
        return KBQueryResponse(
            query=query,
            chunks=citations,
            total_chunks_searched=total_chunks,
            query_time_ms=(time.time() - start_time) * 1000,
        )
    
    # Format pgvector results
    citations = []
    for row in rows:
        citations.append(KBChunkCitation(
            chunk_id=row.id,
            document_id=row.document_id,
            document_title=row.doc_title,
            page=row.page,
            chunk_index=row.chunk_index,
            excerpt=row.text[:200] + "..." if len(row.text) > 200 else row.text,
            score=row.score,
        ))
    
    query_time = (time.time() - start_time) * 1000
    logger.info(f"KB search for org {org_id}: {len(citations)} results in {query_time:.1f}ms")
    
    return KBQueryResponse(
        query=query,
        chunks=citations,
        total_chunks_searched=total_chunks,
        query_time_ms=query_time,
    )


async def get_chunks_by_ids(
    db: AsyncSession,
    org_id: UUID,
    chunk_ids: List[str],
) -> List[KnowledgeChunk]:
    """Get specific chunks by ID with org validation.
    
    Args:
        db: Database session
        org_id: Organization ID for validation
        chunk_ids: List of chunk IDs to retrieve
        
    Returns:
        List of KnowledgeChunk objects
    """
    result = await db.execute(
        select(KnowledgeChunk)
        .where(KnowledgeChunk.org_id == org_id)
        .where(KnowledgeChunk.id.in_(chunk_ids))
    )
    return list(result.scalars().all())
