"""Pytest configuration and fixtures for backend tests.

Uses SQLite for unit tests with sync operations.

NOTE: StaticPool is used here ONLY for sequential unit tests.
In production code (backend/app/), async engines with Postgres handle pooling.
This is acceptable per reliability rules for test-only code.
"""

import pytest
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool

from backend.app.core.database import Base
from backend.app.core.security import hash_password
from backend.app.models import User, Org, Membership


# Test database URL (SQLite in-memory)
TEST_DATABASE_URL = "sqlite:///:memory:"

# Create sync engine for testing (StaticPool OK for sequential tests)
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="function")
def db_session() -> Generator[Session, None, None]:
    """Create a fresh database session for each test."""
    # Create all tables
    Base.metadata.create_all(bind=test_engine)
    
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        # Drop all tables after test
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def test_user(db_session: Session) -> User:
    """Create a test user."""
    user = User(
        email="test@example.com",
        password_hash=hash_password("testpassword123"),
        full_name="Test User",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def test_org(db_session: Session) -> Org:
    """Create a test organization."""
    org = Org(
        name="Test Org",
        slug="test-org",
        is_active=True,
    )
    db_session.add(org)
    db_session.commit()
    db_session.refresh(org)
    return org


@pytest.fixture
def test_user_with_org(db_session: Session, test_user: User, test_org: Org) -> dict:
    """Create a test user with an organization membership."""
    membership = Membership(
        org_id=test_org.id,
        user_id=test_user.id,
        role="owner",
    )
    db_session.add(membership)
    db_session.commit()
    
    return {"user": test_user, "org": test_org, "membership": membership}
