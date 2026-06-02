"""Current user endpoint."""

import logging

from fastapi import APIRouter
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from backend.app.api.deps import CurrentUserDep, DbSession
from backend.app.models import User, Membership
from backend.app.schemas.auth import UserResponse, MembershipResponse

logger = logging.getLogger(__name__)
router = APIRouter(tags=["user"])


class MeResponse(UserResponse):
    memberships: list[MembershipResponse] = []


@router.get("/me", response_model=MeResponse)
async def get_me(
    current_user: CurrentUserDep,
    db: DbSession,
) -> MeResponse:
    """Return the currently authenticated user with their org memberships."""
    result = await db.execute(
        select(User)
        .options(selectinload(User.memberships).selectinload(Membership.org))
        .where(User.id == current_user.user.id)
    )
    user = result.scalar_one()

    memberships = []
    for m in user.memberships:
        if m.org and m.org.is_active:
            memberships.append(
                MembershipResponse(
                    org_id=m.org.id,
                    org_name=m.org.name,
                    org_slug=m.org.slug,
                    role=m.role,
                )
            )

    return MeResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        created_at=user.created_at,
        memberships=memberships,
    )
