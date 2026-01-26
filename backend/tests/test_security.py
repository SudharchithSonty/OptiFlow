"""Tests for security utilities - password hashing and JWT tokens.

TDD: These tests define the security contract for authentication.
"""

import uuid
from datetime import timedelta

import pytest

from backend.app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    validate_access_token,
    verify_password,
)


class TestPasswordHashing:
    """Test suite for password hashing with Argon2."""

    def test_hash_password_returns_string(self) -> None:
        """Hashing should return a string."""
        hashed = hash_password("mysecretpassword")
        assert isinstance(hashed, str)
        assert len(hashed) > 0

    def test_hash_is_not_plaintext(self) -> None:
        """Hash should not contain the original password."""
        password = "mysecretpassword"
        hashed = hash_password(password)
        assert password not in hashed

    def test_verify_correct_password(self) -> None:
        """Correct password should verify successfully."""
        password = "mysecretpassword"
        hashed = hash_password(password)
        assert verify_password(password, hashed) is True

    def test_verify_wrong_password(self) -> None:
        """Wrong password should fail verification."""
        hashed = hash_password("correctpassword")
        assert verify_password("wrongpassword", hashed) is False

    def test_different_hashes_for_same_password(self) -> None:
        """Same password should produce different hashes (salting)."""
        password = "mysecretpassword"
        hash1 = hash_password(password)
        hash2 = hash_password(password)
        assert hash1 != hash2
        # But both should verify
        assert verify_password(password, hash1) is True
        assert verify_password(password, hash2) is True

    def test_verify_invalid_hash_returns_false(self) -> None:
        """Invalid hash should return False, not crash."""
        assert verify_password("anypassword", "notavalidhash") is False


class TestJWTTokens:
    """Test suite for JWT token creation and validation."""

    def test_create_access_token(self) -> None:
        """Should create a valid access token."""
        user_id = uuid.uuid4()
        org_ids = [uuid.uuid4(), uuid.uuid4()]
        
        token = create_access_token(user_id, org_ids)
        
        assert isinstance(token, str)
        assert len(token) > 0
        assert token.count(".") == 2  # JWT format: header.payload.signature

    def test_decode_valid_token(self) -> None:
        """Should decode a valid token successfully."""
        user_id = uuid.uuid4()
        org_ids = [uuid.uuid4()]
        
        token = create_access_token(user_id, org_ids)
        payload = decode_token(token)
        
        assert payload is not None
        assert payload["sub"] == str(user_id)
        assert payload["type"] == "access"

    def test_decode_invalid_token_returns_none(self) -> None:
        """Invalid token should return None, not crash."""
        assert decode_token("invalid.token.here") is None
        assert decode_token("") is None
        assert decode_token("notajwt") is None

    def test_validate_access_token_returns_payload(self) -> None:
        """Valid access token should return TokenPayload."""
        user_id = uuid.uuid4()
        org_ids = [uuid.uuid4()]
        active_org = org_ids[0]
        
        token = create_access_token(user_id, org_ids, active_org)
        payload = validate_access_token(token)
        
        assert payload is not None
        assert payload.sub == str(user_id)
        assert str(active_org) in payload.org_ids
        assert payload.active_org_id == str(active_org)

    def test_validate_refresh_token_as_access_fails(self) -> None:
        """Refresh token should not validate as access token."""
        user_id = uuid.uuid4()
        token = create_refresh_token(user_id)
        
        # Should return None because type is "refresh", not "access"
        payload = validate_access_token(token)
        assert payload is None

    def test_token_contains_org_ids(self) -> None:
        """Token should contain all org_ids."""
        user_id = uuid.uuid4()
        org_ids = [uuid.uuid4(), uuid.uuid4(), uuid.uuid4()]
        
        token = create_access_token(user_id, org_ids)
        payload = decode_token(token)
        
        assert payload is not None
        assert len(payload["org_ids"]) == 3
        for oid in org_ids:
            assert str(oid) in payload["org_ids"]

    def test_custom_expiration(self) -> None:
        """Custom expiration should be respected."""
        user_id = uuid.uuid4()
        org_ids = [uuid.uuid4()]
        
        # Create token with very short expiration
        token = create_access_token(
            user_id, org_ids, expires_delta=timedelta(minutes=5)
        )
        payload = decode_token(token)
        
        assert payload is not None
        # exp should be ~5 minutes from now (with some tolerance)
        import time
        exp_time = payload["exp"]
        now = time.time()
        assert 4 * 60 < (exp_time - now) < 6 * 60

    def test_refresh_token_has_longer_expiry(self) -> None:
        """Refresh token should have longer expiration than access token."""
        user_id = uuid.uuid4()
        org_ids = [uuid.uuid4()]
        
        access = create_access_token(user_id, org_ids)
        refresh = create_refresh_token(user_id)
        
        access_payload = decode_token(access)
        refresh_payload = decode_token(refresh)
        
        assert access_payload is not None
        assert refresh_payload is not None
        assert refresh_payload["exp"] > access_payload["exp"]
