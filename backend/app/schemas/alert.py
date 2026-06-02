"""Alert schemas."""

from datetime import datetime
from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel


class AlertResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: UUID
    alert_type: str
    severity: str
    title: str
    message: str
    source_entity: Optional[str] = None
    source_id: Optional[str] = None
    payload: Optional[dict[str, Any]] = None
    acknowledged: bool
    acknowledged_by: Optional[UUID] = None
    acknowledged_at: Optional[datetime] = None
    created_at: datetime
