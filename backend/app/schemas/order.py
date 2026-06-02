"""Order schemas."""

from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class OrderResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: UUID
    order_code: str
    customer_name: str
    product_name: str
    quantity: int
    priority: str
    due_date: date
    status: str
    progress_pct: float
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class OrderCreate(BaseModel):
    order_code: str = Field(..., min_length=1, max_length=50)
    customer_name: str = Field(..., min_length=1, max_length=255)
    product_name: str = Field(..., min_length=1, max_length=255)
    quantity: int = Field(..., gt=0)
    priority: str = Field(default="medium")
    due_date: date
    notes: Optional[str] = None


class OrderUpdate(BaseModel):
    customer_name: Optional[str] = None
    product_name: Optional[str] = None
    quantity: Optional[int] = Field(None, gt=0)
    priority: Optional[str] = None
    due_date: Optional[date] = None
    status: Optional[str] = None
    progress_pct: Optional[float] = Field(None, ge=0, le=100)
    notes: Optional[str] = None
