"""Security utilities: password hashing and JWT token management.

Password hashing uses Argon2 (winner of Password Hashing Competition).
JWTs are signed with HS256 and include standard claims.
"""

import logging
from datetime import datetime, timedelta, timezone
from typing import Any, Optional
from uuid import UUID

from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from backend.app.core.config import settings

logger = logging.getLogger(__name__)

# Password hashing context using Argon2
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto",
)


class TokenPayload(BaseModel):
    """JWT token payload structure."""
    sub: str  # user_id as string
    org_ids: list[str]  # list of org_ids user belongs to
    active_org_id: Optional[str] = None  # currently selected org
    exp: datetime
    iat: datetime
    jti: Optional[str] = None  # unique token ID for revocation


class TokenResponse(BaseModel):
    """Response containing access and refresh tokens."""
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    expires_in: int  # seconds until expiration


def hash_password(password: str) -> str:
    """Hash a password using Argon2.
    
    Args:
        password: Plain text password
        
    Returns:
        Argon2 hash string
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash.
    
    Args:
        plain_password: Plain text password to check
        hashed_password: Stored Argon2 hash
        
    Returns:
        True if password matches, False otherwise
    """
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        logger.error(f"Password verification error: {e}")
        return False


def create_access_token(
    user_id: UUID,
    org_ids: list[UUID],
    active_org_id: Optional[UUID] = None,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Create a JWT access token.
    
    Args:
        user_id: User's UUID
        org_ids: List of organization UUIDs user belongs to
        active_org_id: Currently selected organization
        expires_delta: Custom expiration time (default from settings)
        
    Returns:
        Encoded JWT string
    """
    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.jwt_access_token_expire_minutes)
    
    now = datetime.now(timezone.utc)
    expire = now + expires_delta
    
    payload = {
        "sub": str(user_id),
        "org_ids": [str(oid) for oid in org_ids],
        "active_org_id": str(active_org_id) if active_org_id else None,
        "exp": expire,
        "iat": now,
        "type": "access",
    }
    
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def create_refresh_token(
    user_id: UUID,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Create a JWT refresh token.
    
    Args:
        user_id: User's UUID
        expires_delta: Custom expiration time (default from settings)
        
    Returns:
        Encoded JWT string
    """
    if expires_delta is None:
        expires_delta = timedelta(days=settings.jwt_refresh_token_expire_days)
    
    now = datetime.now(timezone.utc)
    expire = now + expires_delta
    
    payload = {
        "sub": str(user_id),
        "exp": expire,
        "iat": now,
        "type": "refresh",
    }
    
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> Optional[dict[str, Any]]:
    """Decode and validate a JWT token.
    
    Args:
        token: Encoded JWT string
        
    Returns:
        Decoded payload dict if valid, None if invalid
    """
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )
        return payload
    except JWTError as e:
        logger.warning(f"JWT decode error: {e}")
        return None


def validate_access_token(token: str) -> Optional[TokenPayload]:
    """Validate an access token and return payload.
    
    Args:
        token: Encoded JWT string
        
    Returns:
        TokenPayload if valid access token, None otherwise
    """
    payload = decode_token(token)
    if payload is None:
        return None
    
    if payload.get("type") != "access":
        logger.warning("Token is not an access token")
        return None
    
    try:
        return TokenPayload(
            sub=payload["sub"],
            org_ids=payload.get("org_ids", []),
            active_org_id=payload.get("active_org_id"),
            exp=datetime.fromtimestamp(payload["exp"], tz=timezone.utc),
            iat=datetime.fromtimestamp(payload["iat"], tz=timezone.utc),
        )
    except Exception as e:
        logger.error(f"Error parsing token payload: {e}")
        return None
