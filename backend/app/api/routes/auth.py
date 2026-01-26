"""Authentication routes - login, token refresh.

FastAPI issues JWTs; NextAuth stores and uses them.
"""

import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.app.api.deps import DbSession
from backend.app.core.config import settings
from backend.app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_password,
)
from backend.app.models import User, Membership, Org
from backend.app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    MembershipResponse,
    RefreshRequest,
    TokenResponse,
    UserResponse,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
async def login(
    request: LoginRequest,
    db: DbSession,
) -> LoginResponse:
    """Authenticate user and issue JWT tokens.
    
    Args:
        request: Login credentials (email, password, optional OTP)
        db: Database session
        
    Returns:
        User profile, org memberships, and JWT tokens
        
    Raises:
        HTTPException: 401 if credentials invalid
        HTTPException: 403 if user disabled
    """
    # Fetch user with memberships and orgs
    result = await db.execute(
        select(User)
        .options(
            selectinload(User.memberships).selectinload(Membership.org)
        )
        .where(User.email == request.email)
    )
    user = result.scalar_one_or_none()
    
    # Verify user exists and password is correct
    if user is None:
        logger.warning(f"Login attempt for unknown email: {request.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    if not verify_password(request.password, user.password_hash):
        logger.warning(f"Invalid password for user: {user.id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    # Check if user is active
    if not user.is_active:
        logger.warning(f"Login attempt for disabled user: {user.id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled",
        )
    
    # TODO: OTP verification would go here if request.otp is provided
    # For MVP, OTP is optional and not enforced
    
    # Build membership list
    memberships = []
    org_ids = []
    for membership in user.memberships:
        if membership.org and membership.org.is_active:
            org_ids.append(membership.org.id)
            memberships.append(
                MembershipResponse(
                    org_id=membership.org.id,
                    org_name=membership.org.name,
                    org_slug=membership.org.slug,
                    role=membership.role,
                )
            )
    
    # Default to first org if user has memberships
    active_org_id = org_ids[0] if org_ids else None
    
    # Create tokens
    access_token = create_access_token(
        user_id=user.id,
        org_ids=org_ids,
        active_org_id=active_org_id,
    )
    refresh_token = create_refresh_token(user_id=user.id)
    
    logger.info(f"User {user.id} logged in successfully")
    
    return LoginResponse(
        user=UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            is_active=user.is_active,
            created_at=user.created_at,
        ),
        memberships=memberships,
        tokens=TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=settings.jwt_access_token_expire_minutes * 60,
        ),
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    request: RefreshRequest,
    db: DbSession,
) -> TokenResponse:
    """Refresh access token using refresh token.
    
    Args:
        request: Refresh token
        db: Database session
        
    Returns:
        New access token
        
    Raises:
        HTTPException: 401 if refresh token invalid
    """
    payload = decode_token(request.refresh_token)
    
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    
    try:
        user_id = payload["sub"]
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    
    # Fetch user with memberships
    from uuid import UUID
    result = await db.execute(
        select(User)
        .options(selectinload(User.memberships))
        .where(User.id == UUID(user_id))
    )
    user = result.scalar_one_or_none()
    
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or disabled",
        )
    
    # Get org IDs from memberships
    org_ids = [m.org_id for m in user.memberships]
    active_org_id = org_ids[0] if org_ids else None
    
    # Create new access token
    access_token = create_access_token(
        user_id=user.id,
        org_ids=org_ids,
        active_org_id=active_org_id,
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.jwt_access_token_expire_minutes * 60,
    )
