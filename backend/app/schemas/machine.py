"""Machine schemas."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class MachineResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: UUID
    code: str
    name: str
    machine_type: str
    status: str
    capacity_hours: float
    setup_time_minutes: float
    efficiency: float
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
