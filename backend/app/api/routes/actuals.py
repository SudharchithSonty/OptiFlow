"""Actuals routes - log setup times and quality checks."""

import logging
from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from backend.app.api.deps import CurrentUserDep, DbSession
from backend.app.models import SetupActual, QualityCheck
from backend.app.schemas.actuals import (
    SetupActualCreate,
    SetupActualResponse,
    QualityCheckCreate,
    QualityCheckResponse,
)

logger = logging.getLogger(__name__)
router = APIRouter(tags=["actuals"])


@router.post(
    "/orgs/{org_id}/setup-actuals",
    response_model=SetupActualResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_setup_actual(
    org_id: UUID,
    request: SetupActualCreate,
    current_user: CurrentUserDep,
    db: DbSession,
) -> SetupActualResponse:
    """Log an actual setup time.
    
    Used by supervisors to record real changeover times between families.
    """
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    # Create setup actual
    actual = SetupActual(
        org_id=org_id,
        logged_by_user_id=current_user.user.id,
        machine_id=request.machine_id,
        from_family=request.from_family,
        to_family=request.to_family,
        actual_minutes=request.actual_minutes,
        planned_minutes=request.planned_minutes,
        notes=request.notes,
        setup_ts=request.setup_ts or datetime.utcnow(),
    )
    
    db.add(actual)
    await db.commit()
    await db.refresh(actual)
    
    logger.info(f"Logged setup actual {actual.id} for machine {request.machine_id}")
    
    return SetupActualResponse.model_validate(actual)


@router.get(
    "/orgs/{org_id}/setup-actuals",
    response_model=list[SetupActualResponse],
)
async def list_setup_actuals(
    org_id: UUID,
    current_user: CurrentUserDep,
    db: DbSession,
    machine_id: str = None,
    limit: int = 50,
    offset: int = 0,
) -> list[SetupActualResponse]:
    """List setup actuals for an organization."""
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    query = select(SetupActual).where(SetupActual.org_id == org_id)
    
    if machine_id:
        query = query.where(SetupActual.machine_id == machine_id)
    
    query = query.order_by(SetupActual.setup_ts.desc()).limit(limit).offset(offset)
    
    result = await db.execute(query)
    actuals = result.scalars().all()
    
    return [SetupActualResponse.model_validate(a) for a in actuals]


@router.post(
    "/orgs/{org_id}/quality-checks",
    response_model=QualityCheckResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_quality_check(
    org_id: UUID,
    request: QualityCheckCreate,
    current_user: CurrentUserDep,
    db: DbSession,
) -> QualityCheckResponse:
    """Log a quality check result.
    
    Used by supervisors to record inspection results.
    """
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    # Create quality check
    check = QualityCheck(
        org_id=org_id,
        logged_by_user_id=current_user.user.id,
        order_id=request.order_id,
        op_id=request.op_id,
        machine_id=request.machine_id,
        result=request.result,
        defect_count=request.defect_count,
        defect_type=request.defect_type,
        notes=request.notes,
        check_ts=request.check_ts or datetime.utcnow(),
    )
    
    db.add(check)
    await db.commit()
    await db.refresh(check)
    
    logger.info(f"Logged quality check {check.id} for order {request.order_id}")
    
    return QualityCheckResponse.model_validate(check)


@router.get(
    "/orgs/{org_id}/quality-checks",
    response_model=list[QualityCheckResponse],
)
async def list_quality_checks(
    org_id: UUID,
    current_user: CurrentUserDep,
    db: DbSession,
    order_id: str = None,
    result: str = None,
    limit: int = 50,
    offset: int = 0,
) -> list[QualityCheckResponse]:
    """List quality checks for an organization."""
    if not current_user.can_access_org(org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this organization",
        )
    
    query = select(QualityCheck).where(QualityCheck.org_id == org_id)
    
    if order_id:
        query = query.where(QualityCheck.order_id == order_id)
    if result:
        query = query.where(QualityCheck.result == result)
    
    query = query.order_by(QualityCheck.check_ts.desc()).limit(limit).offset(offset)
    
    result_data = await db.execute(query)
    checks = result_data.scalars().all()
    
    return [QualityCheckResponse.model_validate(c) for c in checks]
