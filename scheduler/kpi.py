"""KPI computation for schedule comparison.

KPI computation is done via the same post-processing logic for both baseline
and optimized schedules to keep comparisons fair.
"""

from typing import Dict, List, Tuple
from .data_loader import DataLoader


def compute_kpis(
    schedule: List[Dict],
    loader: DataLoader,
    bottleneck_machine_id: str = "M03"
) -> Dict[str, float]:
    """Compute KPIs for a schedule.
    
    Args:
        schedule: List of scheduled operations with op_id, order_id, machine_id,
                  start_time_min, end_time_min, duration_min, family_id
        loader: DataLoader with orders and machine data
        bottleneck_machine_id: Machine ID for setup time calculations
        
    Returns:
        Dictionary of KPI values
    """
    if not schedule:
        return {
            "makespan": 0,
            "on_time_delivery_pct": 0.0,
            "machine_utilization_pct": 0.0,
            "total_setup_time_min": 0,
            "family_switches": 0,
        }

    kpis = {}

    # 1. Makespan
    kpis["makespan"] = max(op["end_time_min"] for op in schedule)

    # 2. On-time delivery %
    on_time_count = 0
    total_orders = len(loader.orders)
    
    # Get latest end time per order
    order_completion: Dict[str, int] = {}
    for op in schedule:
        order_id = op["order_id"]
        end_time = op["end_time_min"]
        order_completion[order_id] = max(order_completion.get(order_id, 0), end_time)

    # Check against due times
    for _, order in loader.orders.iterrows():
        order_id = order["order_id"]
        due_time = order["due_time_min"]
        completion_time = order_completion.get(order_id, 0)
        if completion_time <= due_time:
            on_time_count += 1

    kpis["on_time_delivery_pct"] = (on_time_count / total_orders * 100) if total_orders > 0 else 0.0

    # 3. Machine utilization %
    # Total working time / total available time per machine
    machine_work_time: Dict[str, int] = {}
    for op in schedule:
        machine_id = op["machine_id"]
        machine_work_time[machine_id] = machine_work_time.get(machine_id, 0) + op["duration_min"]

    # Calculate available time per machine (horizon - unavailability)
    horizon_end = kpis["makespan"]
    total_utilization = 0.0
    machine_count = 0

    for machine_id in loader.machines["machine_id"]:
        unavail_intervals = loader.get_unavailability_intervals(machine_id)
        total_unavail = sum(
            min(start + dur, horizon_end) - min(start, horizon_end)
            for start, dur in unavail_intervals
            if start < horizon_end
        )
        available_time = max(0, horizon_end - total_unavail)
        work_time = machine_work_time.get(machine_id, 0)
        
        if available_time > 0:
            utilization = work_time / available_time * 100
            total_utilization += utilization
            machine_count += 1

    kpis["machine_utilization_pct"] = (total_utilization / machine_count) if machine_count > 0 else 0.0

    # 4. Total setup time on bottleneck machine
    # 5. Family switches on bottleneck machine
    bottleneck_ops = sorted(
        [op for op in schedule if op["machine_id"] == bottleneck_machine_id],
        key=lambda x: x["start_time_min"]
    )

    total_setup_time = 0
    family_switches = 0
    machine_type = loader.get_machine_type(bottleneck_machine_id)

    if machine_type and len(bottleneck_ops) > 1:
        prev_family = bottleneck_ops[0]["family_id"]
        prev_end = bottleneck_ops[0]["end_time_min"]
        
        for op in bottleneck_ops[1:]:
            current_family = op["family_id"]
            current_start = op["start_time_min"]
            
            # Get setup time from changeover matrix
            setup_time = loader.get_setup_time(machine_type, prev_family, current_family)
            
            # Check if there's actual idle time that could be setup
            idle_time = current_start - prev_end
            if idle_time >= setup_time and setup_time > 0:
                total_setup_time += setup_time
            
            # Count family switches
            if prev_family != current_family:
                family_switches += 1
                
            prev_family = current_family
            prev_end = op["end_time_min"]

    kpis["total_setup_time_min"] = total_setup_time
    kpis["family_switches"] = family_switches

    return kpis


def compare_schedules(
    baseline_schedule: List[Dict],
    optimized_schedule: List[Dict],
    loader: DataLoader,
    bottleneck_machine_id: str = "M03"
) -> Dict[str, Dict[str, float]]:
    """Compare KPIs between baseline and optimized schedules.
    
    Returns:
        Dictionary with 'baseline', 'optimized', and 'improvement' KPIs
    """
    baseline_kpis = compute_kpis(baseline_schedule, loader, bottleneck_machine_id)
    optimized_kpis = compute_kpis(optimized_schedule, loader, bottleneck_machine_id)
    
    # Calculate improvements (positive = better)
    improvement = {}
    for key in baseline_kpis:
        baseline_val = baseline_kpis[key]
        optimized_val = optimized_kpis[key]
        
        if key in ["makespan", "total_setup_time_min", "family_switches"]:
            # Lower is better
            if baseline_val > 0:
                improvement[key] = ((baseline_val - optimized_val) / baseline_val) * 100
            else:
                improvement[key] = 0.0
        else:
            # Higher is better (utilization, on-time delivery)
            if baseline_val > 0:
                improvement[key] = ((optimized_val - baseline_val) / baseline_val) * 100
            else:
                improvement[key] = optimized_val - baseline_val

    return {
        "baseline": baseline_kpis,
        "optimized": optimized_kpis,
        "improvement_pct": improvement,
    }


def format_kpi_report(comparison: Dict[str, Dict[str, float]]) -> str:
    """Format KPI comparison as a readable report."""
    lines = []
    lines.append("=" * 60)
    lines.append("KPI Comparison Report")
    lines.append("=" * 60)
    lines.append(f"{'Metric':<25} {'Baseline':>12} {'Optimized':>12} {'Improvement':>12}")
    lines.append("-" * 60)
    
    metrics = [
        ("Makespan (min)", "makespan", "{:.0f}"),
        ("On-Time Delivery (%)", "on_time_delivery_pct", "{:.1f}"),
        ("Machine Utilization (%)", "machine_utilization_pct", "{:.1f}"),
        ("Setup Time (min)", "total_setup_time_min", "{:.0f}"),
        ("Family Switches", "family_switches", "{:.0f}"),
    ]
    
    for label, key, fmt in metrics:
        baseline = comparison["baseline"][key]
        optimized = comparison["optimized"][key]
        improvement = comparison["improvement_pct"][key]
        
        baseline_str = fmt.format(baseline)
        optimized_str = fmt.format(optimized)
        improvement_str = f"{improvement:+.1f}%"
        
        lines.append(f"{label:<25} {baseline_str:>12} {optimized_str:>12} {improvement_str:>12}")
    
    lines.append("=" * 60)
    return "\n".join(lines)
