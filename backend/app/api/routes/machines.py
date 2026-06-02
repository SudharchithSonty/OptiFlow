"""Machine endpoints - Slice B: Master Data.

Implement these endpoints:
  GET  /orgs/{org_id}/machines            - list all machines for an org
  GET  /orgs/{org_id}/machines/{machine_id} - get a single machine

Reference: auth.py and me.py for the pattern (deps, org access check, db query).
"""

from fastapi import APIRouter

router = APIRouter(prefix="/orgs/{org_id}/machines", tags=["machines"])

# TODO: Implement list_machines and get_machine endpoints
# Hints:
#   - Import CurrentUserDep, DbSession from backend.app.api.deps
#   - Import Machine from backend.app.models
#   - Import MachineResponse from backend.app.schemas.machine
#   - Use current_user.can_access_org(org_id) to check access
#   - Use select(Machine).where(Machine.org_id == org_id) to query
