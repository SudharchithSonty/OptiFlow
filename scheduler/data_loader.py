"""Load and prepare CSV data for scheduling."""

import pandas as pd
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional


class DataLoader:
    """Load CSV data and convert to scheduling format."""

    def __init__(self, data_dir: Path):
        """Initialize loader with data directory."""
        self.data_dir = Path(data_dir)
        self.t0: Optional[datetime] = None
        self.machines: pd.DataFrame = None
        self.order_ops: pd.DataFrame = None
        self.changeover_matrix: pd.DataFrame = None
        self.machine_unavailability: pd.DataFrame = None
        self.orders: pd.DataFrame = None
        self.skus: pd.DataFrame = None

    def load_all(self) -> None:
        """Load all required CSV files."""
        self.machines = pd.read_csv(self.data_dir / "machines.csv")
        self.order_ops = pd.read_csv(self.data_dir / "order_ops.csv")
        self.changeover_matrix = pd.read_csv(self.data_dir / "changeover_matrix.csv")
        self.machine_unavailability = pd.read_csv(self.data_dir / "machine_unavailability.csv")
        self.orders = pd.read_csv(self.data_dir / "orders.csv")
        self.skus = pd.read_csv(self.data_dir / "sku.csv")

        # Find t0 (earliest release time)
        self._find_t0()

        # Convert timestamps to integer minutes from t0
        self._convert_timestamps()

    def _find_t0(self) -> None:
        """Find t0 as the earliest release time."""
        release_times = []
        for _, order in self.orders.iterrows():
            release_ts = datetime.strptime(order["release_ts"], "%Y-%m-%d %H:%M")
            release_times.append(release_ts)

        # Also check unavailability start times
        for _, unavail in self.machine_unavailability.iterrows():
            start_ts = datetime.strptime(unavail["start_ts"], "%Y-%m-%d %H:%M")
            release_times.append(start_ts)

        self.t0 = min(release_times) if release_times else datetime.now()

    def _convert_timestamps(self) -> None:
        """Convert all timestamps to integer minutes from t0."""
        # Convert order release_ts and due_ts
        self.orders["release_time_min"] = self.orders["release_ts"].apply(
            lambda x: int((datetime.strptime(x, "%Y-%m-%d %H:%M") - self.t0).total_seconds() / 60)
        )
        self.orders["due_time_min"] = self.orders["due_ts"].apply(
            lambda x: int((datetime.strptime(x, "%Y-%m-%d %H:%M") - self.t0).total_seconds() / 60)
        )

        # Convert unavailability start_ts
        self.machine_unavailability["start_time_min"] = self.machine_unavailability["start_ts"].apply(
            lambda x: int((datetime.strptime(x, "%Y-%m-%d %H:%M") - self.t0).total_seconds() / 60)
        )

    def get_operations_for_machine(self, machine_id: str) -> pd.DataFrame:
        """Get all operations assigned to a specific machine."""
        return self.order_ops[self.order_ops["machine_id"] == machine_id].copy()

    def get_family_for_operation(self, op_id: str) -> str:
        """Get family_id for an operation."""
        op = self.order_ops[self.order_ops["op_id"] == op_id]
        if len(op) > 0:
            return op.iloc[0]["family_id"]
        return None

    def get_setup_time(self, machine_type: str, from_family: str, to_family: str) -> int:
        """Get setup time from changeover matrix."""
        match = self.changeover_matrix[
            (self.changeover_matrix["machine_type"] == machine_type) &
            (self.changeover_matrix["from_family"] == from_family) &
            (self.changeover_matrix["to_family"] == to_family)
        ]
        if len(match) > 0:
            return int(match.iloc[0]["internal_setup_min"])
        return 0

    def get_unavailability_intervals(self, machine_id: str) -> List[Tuple[int, int]]:
        """Get unavailability intervals for a machine as (start_min, duration_min) tuples."""
        unavail = self.machine_unavailability[
            self.machine_unavailability["machine_id"] == machine_id
        ]
        intervals = []
        for _, row in unavail.iterrows():
            start_min = row["start_time_min"]
            duration_min = row["duration_min"]
            intervals.append((start_min, duration_min))
        return intervals

    def get_horizon_end_min(self) -> int:
        """Calculate horizon_end_min (end of last shift on last day).
        
        This needs to be large enough to fit all operations while respecting
        machine unavailability windows.
        """
        # Calculate total work time needed per machine
        machine_work = {}
        for _, op in self.order_ops.iterrows():
            machine_id = op["machine_id"]
            duration = op["duration_min"]
            machine_work[machine_id] = machine_work.get(machine_id, 0) + duration

        # Find max work on any single machine
        max_work = max(machine_work.values()) if machine_work else 0

        # Calculate available time per day (shift duration minus typical downtime)
        # Assuming 9-hour shifts (540 min) with some buffer
        available_per_day = 480  # Conservative estimate

        # Estimate days needed for max work machine
        days_needed = max(3, int(max_work / available_per_day) + 2)

        # Find latest due time
        max_due = self.orders["due_time_min"].max() if len(self.orders) > 0 else 0

        # Find latest unavailability end
        max_unavail_end = 0
        for _, row in self.machine_unavailability.iterrows():
            end = row["start_time_min"] + row["duration_min"]
            max_unavail_end = max(max_unavail_end, end)

        # Horizon = max of (days needed * minutes per day, max_due, max_unavail_end) + buffer
        horizon = max(days_needed * 24 * 60, max_due, max_unavail_end) + 2880  # Add 2 day buffer
        return int(horizon)

    def get_operations_by_order(self, order_id: str) -> pd.DataFrame:
        """Get all operations for an order, sorted by op_seq."""
        ops = self.order_ops[self.order_ops["order_id"] == order_id].copy()
        return ops.sort_values("op_seq")

    def get_machine_type(self, machine_id: str) -> str:
        """Get machine_type for a machine_id."""
        machine = self.machines[self.machines["machine_id"] == machine_id]
        if len(machine) > 0:
            return machine.iloc[0]["machine_type"]
        return None



