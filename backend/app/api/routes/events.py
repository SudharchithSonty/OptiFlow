"""Event routes - log and list events on runs."""

import logging
from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from backend.app.api.deps import CurrentUserDep, DbSession
from backend.app.models import Run, Event
from backend.app.schemas.event import EventCreate, EventResponse, EventSummary

logger = logging.getLogger(__name__)
router = APIRouter(tags=["events"])


@router.post(
    "/orgs/{org_id}/runs/{run_id}/events",
    response_model=EventResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_event(
    org_id: UUID,
    run_id: str,
    request: EventCreate,
    current_user: CurrentUserDep,
    db: DbSession,
) -> EventResponse:
    """Create an event on a run.
    
    Events capture disruptions, changes, and comments during execution.
    """
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    # Get run
    result = await db.execute(
        select(Run).where(Run.org_id == org_id, Run.run_id == run_id)
    )
    run = result.scalar_one_or_none()
    
    if run is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Run not found",
        )
    
    # Create event
    event = Event(
        org_id=org_id,
        run_id=run.id,
        created_by_user_id=current_user.user.id,
        event_type=request.event_type,
        title=request.title,
        description=request.description,
        payload=request.payload,
        event_ts=request.event_ts,
    )
    
    db.add(event)
    await db.commit()
    await db.refresh(event)
    
    logger.info(f"Created event {event.id} on run {run_id}")
    
    return EventResponse.model_validate(event)


@router.get(
    "/orgs/{org_id}/runs/{run_id}/events",
    response_model=list[EventSummary],
)
async def list_events(
    org_id: UUID,
    run_id: str,
    current_user: CurrentUserDep,
    db: DbSession,
    limit: int = 50,
    offset: int = 0,
) -> list[EventSummary]:
    """List events for a run."""
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    # Get run
    result = await db.execute(
        select(Run).where(Run.org_id == org_id, Run.run_id == run_id)
    )
    run = result.scalar_one_or_none()
    
    if run is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Run not found",
        )
    
    # Get events
    events_result = await db.execute(
        select(Event)
        .where(Event.run_id == run.id)
        .order_by(Event.event_ts.desc())
        .limit(limit)
        .offset(offset)
    )
    events = events_result.scalars().all()
    
    return [EventSummary.model_validate(e) for e in events]
