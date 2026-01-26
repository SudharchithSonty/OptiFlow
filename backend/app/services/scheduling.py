"""Scheduling service - reusable scheduling logic.

Extracted from runs routes for reuse in replan service.
"""

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

from backend.app.core.config import settings

logger = logging.getLogger(__name__)


class SchedulingError(Exception):
    """Raised when scheduling fails."""
    pass


def run_schedulers(
    run_dir: Path,
    seed: int = 42,
    constraint_overrides: Optional[dict[str, Any]] = None,
) -> dict[str, Any]:
    """Run baseline and optimized schedulers on data in run_dir.
    
    Args:
        run_dir: Path to run directory containing data/
        seed: Random seed for reproducibility
        constraint_overrides: Optional constraint overrides (machine downtime, etc.)
        
    Returns:
        Dict with schedule results and KPIs
        
    Raises:
        SchedulingError: If scheduling fails
    """
    from scheduler.data_loader import DataLoader
    from scheduler.job_shop_solver import JobShopSolver
    from scheduler.baseline_scheduler import BaselineScheduler
    from scheduler.kpi import compute_kpis
    
    data_dir = run_dir / "data"
    
    if not data_dir.exists():
        raise SchedulingError(f"Data directory not found: {data_dir}")
    
    try:
        # Load data
        loader = DataLoader(data_dir)
        loader.load_all()
        
        # Apply constraint overrides if provided
        if constraint_overrides:
            _apply_constraint_overrides(loader, constraint_overrides)
        
        # Run baseline scheduler
        baseline = BaselineScheduler(loader)
        baseline_schedule = baseline.schedule_edd()
        baseline_kpis = compute_kpis(baseline_schedule, loader, "M03")
        
        # Run optimized scheduler
        solver = JobShopSolver(loader)
        solver.build_model()
        solved = solver.solve()
        
        if solved:
            optimized_schedule = solver.schedule
            optimized_kpis = compute_kpis(optimized_schedule, loader, "M03")
            solver_status = solver.get_status_string()
        else:
            logger.warning("Solver did not find optimal solution")
            optimized_schedule = []
            optimized_kpis = {}
            solver_status = "FAILED"
        
        # Build scenario meta
        scenario_meta = {
            "seed": seed,
            "num_operations": len(loader.order_ops),
            "num_orders": len(loader.orders),
            "num_machines": len(loader.machines),
            "horizon_end_min": loader.get_horizon_end_min(),
            "t0": loader.t0.isoformat() if loader.t0 else None,
            "orders": loader.orders.to_dict("records"),
            "machines": loader.machines.to_dict("records"),
        }
        
        return {
            "scenario_meta": scenario_meta,
            "baseline_schedule": baseline_schedule,
            "baseline_kpis": baseline_kpis,
            "baseline_makespan": baseline.get_makespan(),
            "optimized_schedule": optimized_schedule,
            "optimized_kpis": optimized_kpis,
            "optimized_makespan": solver.get_makespan() if solved else 0,
            "solver_status": solver_status,
        }
        
    except Exception as e:
        logger.error(f"Scheduling failed: {e}", exc_info=True)
        raise SchedulingError(f"Scheduling failed: {str(e)}")


def _apply_constraint_overrides(
    loader: Any, 
    overrides: dict[str, Any],
) -> None:
    """Apply constraint overrides to the data loader.
    
    Args:
        loader: DataLoader instance
        overrides: Dict with constraint overrides:
            - machine_unavailable: list of {machine_id, start_ts, end_ts}
            - order_locked: list of order_ids to lock (not reschedule)
            - priority_overrides: list of {order_id, new_priority}
    """
    # Handle machine unavailability (downtime windows)
    if "machine_unavailable" in overrides:
        for unavail in overrides["machine_unavailable"]:
            machine_id = unavail.get("machine_id")
            start_ts = unavail.get("start_ts")
            end_ts = unavail.get("end_ts")
            
            if machine_id and start_ts and end_ts:
                # Add to machine_unavailabilities if loader supports it
                if hasattr(loader, "machine_unavailabilities"):
                    loader.machine_unavailabilities.append({
                        "machine_id": machine_id,
                        "start_min": _ts_to_minutes(start_ts, loader.t0),
                        "end_min": _ts_to_minutes(end_ts, loader.t0),
                    })
                logger.info(
                    f"Applied machine unavailability: {machine_id} "
                    f"from {start_ts} to {end_ts}"
                )
    
    # Handle priority overrides
    if "priority_overrides" in overrides:
        for po in overrides["priority_overrides"]:
            order_id = po.get("order_id")
            new_priority = po.get("new_priority")
            
            if order_id and new_priority is not None:
                # Update priority in orders dataframe
                if hasattr(loader, "orders") and "priority" in loader.orders.columns:
                    mask = loader.orders["order_id"] == order_id
                    if mask.any():
                        loader.orders.loc[mask, "priority"] = new_priority
                        logger.info(
                            f"Applied priority override: {order_id} -> {new_priority}"
                        )


def _ts_to_minutes(ts: datetime, t0: Optional[datetime]) -> int:
    """Convert timestamp to minutes from t0."""
    if t0 is None:
        return 0
    if isinstance(ts, str):
        ts = datetime.fromisoformat(ts)
    delta = ts - t0
    return int(delta.total_seconds() / 60)


def write_schedule_artifacts(
    run_dir: Path,
    run_id: str,
    results: dict[str, Any],
) -> list[tuple[str, str]]:
    """Write schedule artifacts to run directory.
    
    Args:
        run_dir: Path to run directory
        run_id: Run identifier
        results: Results from run_schedulers
        
    Returns:
        List of (filename, artifact_kind) tuples
    """
    from backend.app.models import ArtifactKind
    
    artifacts_to_write = [
        ("scenario_meta.json", ArtifactKind.SCENARIO_META, {
            "run_id": run_id,
            **results["scenario_meta"],
        }),
        ("schedule_baseline.json", ArtifactKind.SCHEDULE_BASELINE, {
            "schedule": results["baseline_schedule"],
            "makespan": results["baseline_makespan"],
        }),
        ("schedule_optimized.json", ArtifactKind.SCHEDULE_OPTIMIZED, {
            "schedule": results["optimized_schedule"],
            "makespan": results["optimized_makespan"],
            "solver_status": results["solver_status"],
        }),
        ("kpi_baseline.json", ArtifactKind.KPI_BASELINE, results["baseline_kpis"]),
        ("kpi_optimized.json", ArtifactKind.KPI_OPTIMIZED, results["optimized_kpis"]),
    ]
    
    written = []
    for filename, kind, data in artifacts_to_write:
        filepath = run_dir / filename
        with open(filepath, "w") as f:
            json.dump(data, f, indent=2, default=str)
        written.append((filename, kind.value))
        logger.info(f"Wrote artifact: {filepath}")
    
    return written


def compute_impact_summary(
    parent_kpis: dict[str, Any],
    child_kpis: dict[str, Any],
    parent_schedule: list[dict],
    child_schedule: list[dict],
) -> dict[str, Any]:
    """Compute impact summary comparing parent and child schedules.
    
    Args:
        parent_kpis: Parent run KPIs
        child_kpis: Child run KPIs
        parent_schedule: Parent schedule operations
        child_schedule: Child schedule operations
        
    Returns:
        Impact summary dict
    """
    # Compute KPI deltas
    kpi_deltas = []
    
    metrics_config = [
        ("makespan", True),  # lower is better
        ("on_time_delivery_pct", False),  # higher is better
        ("machine_utilization_pct", False),
        ("total_setup_time", True),
    ]
    
    for metric, lower_is_better in metrics_config:
        parent_val = parent_kpis.get(metric, 0)
        child_val = child_kpis.get(metric, 0)
        
        if not isinstance(parent_val, (int, float)) or not isinstance(child_val, (int, float)):
            continue
        
        delta = child_val - parent_val
        delta_pct = (delta / abs(parent_val) * 100) if parent_val != 0 else 0
        
        is_improvement = (delta < 0) if lower_is_better else (delta > 0)
        
        kpi_deltas.append({
            "metric": metric,
            "parent_value": parent_val,
            "child_value": child_val,
            "delta": delta,
            "delta_pct": round(delta_pct, 2),
            "is_improvement": is_improvement,
        })
    
    # Find late orders
    late_orders = list(set(
        op.get("order_id")
        for op in child_schedule
        if op.get("is_late", False) and op.get("order_id")
    ))
    
    # Find improved orders (were late in parent, not late in child)
    parent_late = set(
        op.get("order_id")
        for op in parent_schedule
        if op.get("is_late", False) and op.get("order_id")
    )
    child_late = set(
        op.get("order_id")
        for op in child_schedule
        if op.get("is_late", False) and op.get("order_id")
    )
    orders_improved = list(parent_late - child_late)
    
    # Find bottleneck machines (highest utilization)
    machine_load: dict[str, int] = {}
    for op in child_schedule:
        mid = op.get("machine_id")
        dur = op.get("duration_min", 0)
        if mid:
            machine_load[mid] = machine_load.get(mid, 0) + dur
    
    sorted_machines = sorted(machine_load.items(), key=lambda x: x[1], reverse=True)
    bottleneck_machines = [m[0] for m in sorted_machines[:3]]
    
    # Determine bottleneck risk
    if len(late_orders) == 0:
        bottleneck_risk = "low"
    elif len(late_orders) <= 2:
        bottleneck_risk = "medium"
    else:
        bottleneck_risk = "high"
    
    # Generate key changes summary
    key_changes = []
    
    makespan_delta = next((d for d in kpi_deltas if d["metric"] == "makespan"), None)
    if makespan_delta and abs(makespan_delta["delta_pct"]) > 5:
        direction = "decreased" if makespan_delta["is_improvement"] else "increased"
        key_changes.append(
            f"Makespan {direction} by {abs(makespan_delta['delta_pct']):.1f}%"
        )
    
    if orders_improved:
        key_changes.append(
            f"{len(orders_improved)} orders improved from late to on-time"
        )
    
    new_late = child_late - parent_late
    if new_late:
        key_changes.append(
            f"{len(new_late)} orders became late after reschedule"
        )
    
    return {
        "kpi_deltas": kpi_deltas,
        "late_orders": late_orders,
        "orders_improved": orders_improved,
        "bottleneck_machines": bottleneck_machines,
        "bottleneck_risk": bottleneck_risk,
        "key_changes": key_changes,
    }
