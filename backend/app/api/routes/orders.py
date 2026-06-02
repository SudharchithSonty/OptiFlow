"""Order endpoints - Slice B: Master Data.

Implement these endpoints:
  GET   /orgs/{org_id}/orders              - list orders (with pagination, filters)
  GET   /orgs/{org_id}/orders/{order_id}   - get a single order
  POST  /orgs/{org_id}/orders              - create a new order
  PATCH /orgs/{org_id}/orders/{order_id}   - update an existing order

Reference: auth.py for the full pattern. Schemas are in backend.app.schemas.order.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/orgs/{org_id}/orders", tags=["orders"])

# TODO: Implement list_orders, get_order, create_order, update_order
# Hints:
#   - Import CurrentUserDep, DbSession from backend.app.api.deps
#   - Import Order from backend.app.models
#   - Import OrderCreate, OrderResponse, OrderUpdate from backend.app.schemas.order
#   - For create: db.add(order), await db.commit(), await db.refresh(order)
#   - For update: body.model_dump(exclude_unset=True) to get only changed fields
