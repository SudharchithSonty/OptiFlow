"""Baseline scheduler using EDD/FCFS + greedy machine assignment."""

from typing import Dict, List, Tuple
import pandas as pd
from .data_loader import DataLoader


class BaselineScheduler:
    """Simple baseline scheduler for KPI comparison."""

    def __init__(self, data_loader: DataLoader):
        """Initialize with data loader."""
        self.loader = data_loader
        self.schedule: List[Dict] = []

    def _get_next_available_time(
        self, machine_id: str, earliest_start: int, duration: int
    ) -> int:
        """Find next available time slot on machine, respecting unavailability."""
        unavail_intervals = self.loader.get_unavailability_intervals(machine_id)
        if not unavail_intervals:
            return earliest_start

        # Sort by start time
        unavail_intervals.sort(key=lambda x: x[0])

        current_start = earliest_start
        for unavail_start, unavail_duration in unavail_intervals:
            unavail_end = unavail_start + unavail_duration

            # If operation would start during unavailability, push it after
            if current_start >= unavail_start and current_start < unavail_end:
                current_start = unavail_end
            # If operation would overlap unavailability, push it after
            elif current_start < unavail_start and current_start + duration > unavail_start:
                current_start = unavail_end

        return current_start

    def schedule_edd(self) -> List[Dict]:
        """Schedule using Earliest Due Date (EDD) with greedy machine assignment."""
        self.schedule = []

        # Get all operations sorted by due date (EDD)
        order_ops = self.loader.order_ops.copy()
        order_ops = order_ops.merge(
            self.loader.orders[["order_id", "due_time_min", "release_time_min"]],
            on="order_id",
            how="left"
        )

        # Sort by due_time_min, then order_id, then op_seq (ensures precedence)
        order_ops = order_ops.sort_values(["due_time_min", "order_id", "op_seq"])

        # Track machine availability (end time per machine)
        machine_end_time: Dict[str, int] = {}
        for machine_id in self.loader.machines["machine_id"].unique():
            machine_end_time[machine_id] = 0

        # Track operation end times for precedence (op_id -> end_time)
        op_end_times: Dict[str, int] = {}

        # Track previous op per order for precedence
        order_prev_op: Dict[str, str] = {}

        # Schedule operations greedily
        for _, op in order_ops.iterrows():
            op_id = op["op_id"]
            order_id = op["order_id"]
            machine_id = op["machine_id"]
            release_time = int(op["release_time_min"])
            duration = int(op["duration_min"])

            # Earliest start = max(release_time, machine availability, previous op end)
            earliest_start = max(release_time, machine_end_time[machine_id])

            # Check precedence: if previous op in same order exists, wait for it
            if order_id in order_prev_op:
                prev_op_id = order_prev_op[order_id]
                prev_end = op_end_times.get(prev_op_id, 0)
                earliest_start = max(earliest_start, prev_end)

            # Find next available slot respecting unavailability
            start_time = self._get_next_available_time(machine_id, earliest_start, duration)
            end_time = start_time + duration

            self.schedule.append({
                "op_id": op_id,
                "order_id": order_id,
                "machine_id": machine_id,
                "start_time_min": start_time,
                "end_time_min": end_time,
                "duration_min": duration,
                "family_id": op["family_id"],
            })

            machine_end_time[machine_id] = end_time
            op_end_times[op_id] = end_time
            order_prev_op[order_id] = op_id

        return self.schedule

    def schedule_fcfs(self) -> List[Dict]:
        """Schedule using First Come First Served (FCFS) with greedy machine assignment."""
        self.schedule = []

        # Get all operations sorted by release time (FCFS)
        order_ops = self.loader.order_ops.copy()
        order_ops = order_ops.merge(
            self.loader.orders[["order_id", "release_time_min"]],
            on="order_id",
            how="left"
        )

        # Sort by release_time_min, then order_id, then op_seq (ensures precedence)
        order_ops = order_ops.sort_values(["release_time_min", "order_id", "op_seq"])

        # Track machine availability
        machine_end_time: Dict[str, int] = {}
        for machine_id in self.loader.machines["machine_id"].unique():
            machine_end_time[machine_id] = 0

        # Track operation end times for precedence
        op_end_times: Dict[str, int] = {}

        # Track previous op per order for precedence
        order_prev_op: Dict[str, str] = {}

        # Schedule operations greedily
        for _, op in order_ops.iterrows():
            op_id = op["op_id"]
            order_id = op["order_id"]
            machine_id = op["machine_id"]
            release_time = int(op["release_time_min"])
            duration = int(op["duration_min"])

            # Earliest start = max(release_time, machine availability, previous op end)
            earliest_start = max(release_time, machine_end_time[machine_id])

            # Check precedence
            if order_id in order_prev_op:
                prev_op_id = order_prev_op[order_id]
                prev_end = op_end_times.get(prev_op_id, 0)
                earliest_start = max(earliest_start, prev_end)

            # Find next available slot
            start_time = self._get_next_available_time(machine_id, earliest_start, duration)
            end_time = start_time + duration

            self.schedule.append({
                "op_id": op_id,
                "order_id": order_id,
                "machine_id": machine_id,
                "start_time_min": start_time,
                "end_time_min": end_time,
                "duration_min": duration,
                "family_id": op["family_id"],
            })

            machine_end_time[machine_id] = end_time
            op_end_times[op_id] = end_time
            order_prev_op[order_id] = op_id

        return self.schedule

    def get_makespan(self) -> int:
        """Get makespan (maximum end time)."""
        if not self.schedule:
            return 0
        return max(op["end_time_min"] for op in self.schedule)



