"""Service layer for business logic.

Services contain the core business logic, keeping routes thin.
"""

from backend.app.services.reschedule import create_reschedule_run, get_run_lineage
from backend.app.services.scheduling import (
    run_schedulers,
    write_schedule_artifacts,
    compute_impact_summary,
    SchedulingError,
)
from backend.app.services.replan import (
    create_replan_from_event,
    create_replan_from_latest_event,
    ReplanError,
)

__all__ = [
    # Reschedule
    "create_reschedule_run",
    "get_run_lineage",
    # Scheduling
    "run_schedulers",
    "write_schedule_artifacts",
    "compute_impact_summary",
    "SchedulingError",
    # Replan (AI agent)
    "create_replan_from_event",
    "create_replan_from_latest_event",
    "ReplanError",
]
