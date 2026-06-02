"""Schedule & Metrics endpoints - Slice D.

Implement these endpoints:
  GET /orgs/{org_id}/runs/{run_id}/schedule  - get schedule operations (Gantt data)
  GET /orgs/{org_id}/runs/{run_id}/metrics   - get KPI snapshot for a run
  GET /orgs/{org_id}/metrics/overview        - org-wide metrics overview
  GET /orgs/{org_id}/metrics/weekly          - weekly metrics trend

Models: ScheduleOperation, RunMetric (backend.app.models)
Schemas: backend.app.schemas.schedule, backend.app.schemas.metrics
"""

from fastapi import APIRouter

router = APIRouter(tags=["schedule"])

# TODO: Implement schedule and metrics endpoints
