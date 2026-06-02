"""Agent endpoints - Slice F: Optional AI Features.

Implement these endpoints (after core slices are done):
  GET  /orgs/{org_id}/agent-jobs                           - list agent jobs
  GET  /orgs/{org_id}/agent-jobs/{job_id}                  - get job detail
  POST /orgs/{org_id}/runs/{run_id}/agent/brief            - generate shift brief
  POST /orgs/{org_id}/runs/{run_id}/agent/setup-guidance   - get setup guidance
  POST /orgs/{org_id}/runs/{run_id}/agent/explain          - explain chat

Models: AgentJob (backend.app.models)
Schemas: backend.app.schemas.agent_job
"""

from fastapi import APIRouter

router = APIRouter(tags=["agent"])

# TODO: Implement agent endpoints (defer until core CRUD works)
