"""Schedule operation schemas."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class ScheduleOperationResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: UUID
    order_code: str
    machine_code: str
    product_name: str
    operation_seq: int
    start_time: datetime
    end_time: datetime
    setup_minutes: float
    processing_minutes: float
    status: str
    notes: Optional[str] = None
