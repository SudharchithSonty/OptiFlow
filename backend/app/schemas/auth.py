"""Authentication request/response schemas."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    """Login request with credentials."""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=1, description="User password")
    otp: Optional[str] = Field(None, description="Optional OTP code")


class MembershipResponse(BaseModel):
    """User's membership in an organization."""
    model_config = {"from_attributes": True}
    
    org_id: UUID
    org_name: str
    org_slug: str
    role: str
    active_run_id: Optional[UUID] = None  # Currently published schedule


class UserResponse(BaseModel):
    """User profile response."""
    model_config = {"from_attributes": True}
    
    id: UUID
    email: str
    full_name: Optional[str]
    is_active: bool
    created_at: datetime


class TokenResponse(BaseModel):
    """JWT token response."""
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    expires_in: int = Field(..., description="Seconds until expiration")


class LoginResponse(BaseModel):
    """Complete login response with user, memberships, and tokens."""
    user: UserResponse
    memberships: list[MembershipResponse]
    tokens: TokenResponse


class RefreshRequest(BaseModel):
    """Request to refresh access token."""
    refresh_token: str
