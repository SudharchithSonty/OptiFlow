"""API dependencies for authentication and authorization.

These dependencies extract and validate JWT tokens from requests,
ensuring multi-tenant isolation by verifying org membership.
"""

import logging
from typing import Annotated, Optional
from uuid import UUID

from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.app.core.database import get_db
from backend.app.core.security import validate_access_token, TokenPayload
from backend.app.models import User, Membership, Org

logger = logging.getLogger(__name__)

# HTTP Bearer token scheme
bearer_scheme = HTTPBearer(auto_error=False)


class CurrentUser:
    """Authenticated user context with org info."""
    
    def __init__(
        self,
        user: User,
        token_payload: TokenPayload,
        active_org_id: Optional[UUID] = None,
    ):
        self.user = user
        self.token_payload = token_payload
        self.active_org_id = active_org_id
        self.org_ids = [UUID(oid) for oid in token_payload.org_ids]
    
    def can_access_org(self, org_id: UUID) -> bool:
        """Check if user has access to the specified org."""
        return org_id in self.org_ids


async def get_current_user(
    credentials: Annotated[Optional[HTTPAuthorizationCredentials], Depends(bearer_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CurrentUser:
    """Extract and validate the current user from JWT token.
    
    Raises:
        HTTPException: 401 if token is missing or invalid
        HTTPException: 401 if user not found or inactive
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if credentials is None:
        logger.warning("No credentials provided")
        raise credentials_exception
    
    token = credentials.credentials
    payload = validate_access_token(token)
    
    if payload is None:
        logger.warning("Invalid or expired token")
        raise credentials_exception
    
    # Fetch user from database
    try:
        user_id = UUID(payload.sub)
    except ValueError:
        logger.error(f"Invalid user ID in token: {payload.sub}")
        raise credentials_exception
    
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if user is None:
        logger.warning(f"User not found: {user_id}")
        raise credentials_exception
    
    if not user.is_active:
        logger.warning(f"Inactive user attempted access: {user_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled",
        )
    
    active_org_id = UUID(payload.active_org_id) if payload.active_org_id else None
    
    return CurrentUser(
        user=user,
        token_payload=payload,
        active_org_id=active_org_id,
    )


async def get_current_user_with_org(
    current_user: Annotated[CurrentUser, Depends(get_current_user)],
    org_id: UUID,
) -> CurrentUser:
    """Verify user has access to the specified org.
    
    Args:
        current_user: Authenticated user
        org_id: Organization ID from path parameter
        
    Raises:
        HTTPException: 403 if user doesn't have access to org
    """
    if not current_user.can_access_org(org_id):
        logger.warning(
            f"User {current_user.user.id} attempted to access org {org_id} without membership"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    return current_user


# Type alias for dependency injection
CurrentUserDep = Annotated[CurrentUser, Depends(get_current_user)]
DbSession = Annotated[AsyncSession, Depends(get_db)]
