"""Knowledge Base routes - upload, list, and query documents."""

import hashlib
import logging
import shutil
from pathlib import Path
from uuid import UUID

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select

from backend.app.api.deps import CurrentUserDep, DbSession
from backend.app.core.config import settings
from backend.app.models import KnowledgeDocument, DocumentStatus
from backend.app.schemas.kb import (
    KBDocumentResponse,
    KBDocumentSummary,
    KBQueryRequest,
    KBQueryResponse,
)
from backend.app.services.kb_ingest import ingest_document
from backend.app.services.kb_retrieve import search_chunks

logger = logging.getLogger(__name__)
router = APIRouter(tags=["kb"])

# Allowed MIME types
ALLOWED_MIME_TYPES = {
    "application/pdf": ".pdf",
    "text/plain": ".txt",
    "text/markdown": ".md",
}


@router.post(
    "/orgs/{org_id}/kb/documents",
    response_model=KBDocumentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_document(
    org_id: UUID,
    title: str = Form(...),
    source: str = Form(None),
    file: UploadFile = File(...),
    current_user: CurrentUserDep = None,
    db: DbSession = None,
) -> KBDocumentResponse:
    """Upload a document to the knowledge base.
    
    Accepts PDF, TXT, and MD files. Documents are processed into
    chunks with embeddings for RAG retrieval.
    """
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    # Validate file type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: {file.content_type}. Allowed: {list(ALLOWED_MIME_TYPES.keys())}",
        )
    
    # Validate file size (10MB limit)
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to start
    
    if file_size > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large. Maximum size is 10MB.",
        )
    
    # Create upload directory
    upload_dir = settings.get_kb_upload_path(str(org_id))
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    # Calculate file hash for filename
    content = await file.read()
    file_hash = hashlib.sha256(content).hexdigest()[:16]
    
    # Save file
    ext = ALLOWED_MIME_TYPES[file.content_type]
    file_path = upload_dir / f"{file_hash}{ext}"
    
    with open(file_path, "wb") as f:
        f.write(content)
    
    try:
        doc = await ingest_document(
            db=db,
            org_id=org_id,
            user_id=current_user.user.id,
            title=title,
            filename=file.filename or f"document{ext}",
            file_path=file_path,
            mime_type=file.content_type,
            source=source,
        )
        
        return KBDocumentResponse.model_validate(doc)
        
    except ValueError as e:
        # Clean up file on error
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Document upload failed: {e}")
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Document processing failed: {str(e)}",
        )


@router.get(
    "/orgs/{org_id}/kb/documents",
    response_model=list[KBDocumentSummary],
)
async def list_documents(
    org_id: UUID,
    current_user: CurrentUserDep,
    db: DbSession,
    status_filter: str = None,
    limit: int = 50,
    offset: int = 0,
) -> list[KBDocumentSummary]:
    """List knowledge base documents for an organization."""
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    query = select(KnowledgeDocument).where(KnowledgeDocument.org_id == org_id)
    
    if status_filter:
        query = query.where(KnowledgeDocument.status == status_filter)
    
    query = query.order_by(KnowledgeDocument.created_at.desc()).limit(limit).offset(offset)
    
    result = await db.execute(query)
    docs = result.scalars().all()
    
    return [KBDocumentSummary.model_validate(d) for d in docs]


@router.get(
    "/orgs/{org_id}/kb/documents/{doc_id}",
    response_model=KBDocumentResponse,
)
async def get_document(
    org_id: UUID,
    doc_id: UUID,
    current_user: CurrentUserDep,
    db: DbSession,
) -> KBDocumentResponse:
    """Get details of a specific document."""
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    result = await db.execute(
        select(KnowledgeDocument).where(
            KnowledgeDocument.org_id == org_id,
            KnowledgeDocument.id == doc_id,
        )
    )
    doc = result.scalar_one_or_none()
    
    if doc is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )
    
    return KBDocumentResponse.model_validate(doc)


@router.post(
    "/orgs/{org_id}/kb/query",
    response_model=KBQueryResponse,
)
async def query_kb(
    org_id: UUID,
    request: KBQueryRequest,
    current_user: CurrentUserDep,
    db: DbSession,
) -> KBQueryResponse:
    """Query the knowledge base for relevant chunks.
    
    Returns top-k most relevant chunks with citations.
    Multi-tenant: only searches within the specified organization.
    """
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    try:
        response = await search_chunks(
            db=db,
            org_id=org_id,
            query=request.query,
            top_k=request.top_k,
        )
        return response
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )
