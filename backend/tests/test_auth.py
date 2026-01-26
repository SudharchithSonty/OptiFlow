"""Tests for authentication - unit tests for security module.

Full auth endpoint tests require a running database and are covered
in integration tests. These tests focus on the security utilities.
"""

import uuid

import pytest
from fastapi.testclient import TestClient

from backend.app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    validate_access_token,
    verify_password,
)
from backend.app.main import app


# Test client for endpoint tests that don't require database
client = TestClient(app)


class TestHealthCheck:
    """Test health check endpoint."""

    def test_health_check(self) -> None:
        """Health endpoint should return healthy status."""
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    def test_root_endpoint(self) -> None:
        """Root endpoint should return API info."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "docs" in data


class TestPasswordSecurity:
    """Test password hashing and verification."""

    def test_hash_password_returns_string(self) -> None:
        """Hashing should return a non-empty string."""
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


class TestJWTTokens:
    """Test JWT token creation and validation."""

    def test_create_access_token(self) -> None:
        """Should create a valid JWT access token."""
        user_id = uuid.uuid4()
        org_ids = [uuid.uuid4(), uuid.uuid4()]
        
        token = create_access_token(user_id, org_ids)
        
        assert isinstance(token, str)
        assert token.count(".") == 2  # JWT format

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
        """Invalid token should return None."""
        assert decode_token("invalid.token.here") is None
        assert decode_token("") is None

    def test_validate_access_token_returns_payload(self) -> None:
        """Valid access token should return TokenPayload."""
        user_id = uuid.uuid4()
        org_ids = [uuid.uuid4()]
        active_org = org_ids[0]
        
        token = create_access_token(user_id, org_ids, active_org)
        payload = validate_access_token(token)
        
        assert payload is not None
        assert payload.sub == str(user_id)

    def test_validate_refresh_token_as_access_fails(self) -> None:
        """Refresh token should not validate as access token."""
        user_id = uuid.uuid4()
        token = create_refresh_token(user_id)
        
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


class TestRequestValidation:
    """Test request validation (doesn't require database)."""

    def test_invalid_email_format_returns_422(self) -> None:
        """Invalid email format should return 422 (Pydantic validation)."""
        response = client.post(
            "/api/v1/auth/login",
            json={
                "email": "notanemail",
                "password": "anypassword",
            },
        )
        assert response.status_code == 422

    def test_missing_password_returns_422(self) -> None:
        """Missing password should return 422."""
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "test@example.com"},
        )
        assert response.status_code == 422

    def test_empty_run_name_returns_422(self) -> None:
        """Empty run name should return 422."""
        from backend.app.schemas.run import RunCreate
        import pydantic
        
        with pytest.raises(pydantic.ValidationError):
            RunCreate(run_name="", seed=42)
