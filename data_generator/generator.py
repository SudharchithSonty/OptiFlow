"""Main data generator for CNC job shop synthetic data."""

import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Tuple

from .config import (
    RANDOM_SEED,
    HORIZON_DAYS,
    SHIFT_START,
    SHIFT_END,
    SHIFT_DURATION_MIN,
    MACHINES,
    MACHINE_TYPES,
    FAMILIES,
    NUM_SKUS,
    PROC_TIME_RANGES,
    ORDER_QTY_MIN,
    ORDER_QTY_MAX,
    CHANGEOVER_SAME_FAMILY,
    CHANGEOVER_DIFFERENT_FAMILY,
    OPS_PER_SKU_MIN,
    OPS_PER_SKU_MAX,
    PRIORITY_LEVELS,
    BASE_DATE,
    MAX_OPERATION_DURATION_MIN,
)


class DataGenerator:
    """Generate synthetic CNC job shop data."""

    def __init__(self, seed: int = RANDOM_SEED):
        """Initialize generator with seed for reproducibility."""
        self.seed = seed
        random.seed(seed)
        np.random.seed(seed)
        self.machines = MACHINES
        self.skus = []
        self.routings = []
        self.orders = []
        self.order_ops = []

    def generate_all(self, output_dir: Path) -> None:
        """Generate all CSV files."""
        output_dir.mkdir(parents=True, exist_ok=True)

        # Generate in dependency order
        self._generate_machines(output_dir)
        self._generate_machine_calendar(output_dir)
        self._generate_sku(output_dir)
        self._generate_routing(output_dir)
        self._generate_machine_type_map(output_dir)
        self._generate_changeover_matrix(output_dir)
        self._generate_orders(output_dir)
        self._generate_order_ops(output_dir)  # Critical: expands orders
        self._generate_machine_unavailability(output_dir)  # Single source of truth
        self._generate_disruptions(output_dir)
        self._generate_kpi_targets(output_dir)

    def _generate_machines(self, output_dir: Path) -> None:
        """Generate machines.csv."""
        df = pd.DataFrame(self.machines)
        df.to_csv(output_dir / "machines.csv", index=False)

    def _generate_machine_calendar(self, output_dir: Path) -> None:
        """Generate machine_calendar.csv with shift blocks."""
        records = []
        for day in range(HORIZON_DAYS):
            date = BASE_DATE + timedelta(days=day)
            for machine in self.machines:
                records.append({
                    "machine_id": machine["machine_id"],
                    "date": date.strftime("%Y-%m-%d"),
                    "shift_start": SHIFT_START,
                    "shift_end": SHIFT_END,
                })
        df = pd.DataFrame(records)
        df.to_csv(output_dir / "machine_calendar.csv", index=False)

    def _generate_sku(self, output_dir: Path) -> None:
        """Generate sku.csv."""
        self.skus = []
        for i in range(1, NUM_SKUS + 1):
            sku_id = f"S{i:02d}"
            family_id = random.choice(FAMILIES)
            sku_name = f"Part_{sku_id}_{family_id}"
            avg_lot_size = random.randint(80, 200)
            self.skus.append({
                "sku_id": sku_id,
                "family_id": family_id,
                "sku_name": sku_name,
                "avg_lot_size": avg_lot_size,
            })
        df = pd.DataFrame(self.skus)
        df.to_csv(output_dir / "sku.csv", index=False)

    def _generate_routing(self, output_dir: Path) -> None:
        """Generate routing.csv with fixed machine assignments."""
        self.routings = []
        machine_by_type = {mt: [] for mt in MACHINE_TYPES}
        for machine in self.machines:
            machine_by_type[machine["machine_type"]].append(machine["machine_id"])

        for sku in self.skus:
            num_ops = random.randint(OPS_PER_SKU_MIN, OPS_PER_SKU_MAX)
            # Ensure operations use different machine types
            op_types = random.sample(MACHINE_TYPES, min(num_ops, len(MACHINE_TYPES)))
            if len(op_types) < num_ops:
                op_types.extend(random.choices(MACHINE_TYPES, k=num_ops - len(op_types)))

            for op_seq, machine_type in enumerate(op_types, 1):
                # Fixed assignment: pick one machine of this type
                machine_id = random.choice(machine_by_type[machine_type])
                proc_time = random.uniform(*PROC_TIME_RANGES[machine_type])
                op_name = f"{machine_type.lower().capitalize()}_Op{op_seq}"

                self.routings.append({
                    "sku_id": sku["sku_id"],
                    "op_seq": op_seq,
                    "op_name": op_name,
                    "machine_type": machine_type,
                    "machine_id": machine_id,
                    "proc_time_per_unit_min": round(proc_time, 2),
                })
        df = pd.DataFrame(self.routings)
        df.to_csv(output_dir / "routing.csv", index=False)

    def _generate_machine_type_map(self, output_dir: Path) -> None:
        """Generate machine_type_map.csv (optional for MVP)."""
        records = []
        for machine in self.machines:
            records.append({
                "machine_type": machine["machine_type"],
                "machine_id": machine["machine_id"],
            })
        df = pd.DataFrame(records)
        df.to_csv(output_dir / "machine_type_map.csv", index=False)

    def _generate_changeover_matrix(self, output_dir: Path) -> None:
        """Generate changeover_matrix.csv with asymmetric setup times."""
        records = []
        for machine_type in MACHINE_TYPES:
            for from_family in FAMILIES:
                for to_family in FAMILIES:
                    if from_family == to_family:
                        cfg = CHANGEOVER_SAME_FAMILY
                    else:
                        cfg = CHANGEOVER_DIFFERENT_FAMILY

                    internal = random.randint(*cfg["internal_min"])
                    external = random.randint(*cfg["external_min"])
                    reject_prob = random.uniform(*cfg["reject_prob"])

                    records.append({
                        "machine_type": machine_type,
                        "from_family": from_family,
                        "to_family": to_family,
                        "internal_setup_min": internal,
                        "external_setup_min": external,
                        "first_piece_reject_prob": round(reject_prob, 3),
                    })
        df = pd.DataFrame(records)
        df.to_csv(output_dir / "changeover_matrix.csv", index=False)

    def _generate_orders(self, output_dir: Path) -> None:
        """Generate orders.csv with congestion-inducing due dates."""
        self.orders = []
        num_orders = random.randint(8, 15)

        for i in range(1, num_orders + 1):
            order_id = f"O{i:03d}"
            sku = random.choice(self.skus)
            qty = random.randint(ORDER_QTY_MIN, ORDER_QTY_MAX)
            priority = random.choice(PRIORITY_LEVELS)

            # Release time: start of horizon or slightly later
            release_offset_hours = random.randint(0, 6)
            release_ts = BASE_DATE + timedelta(hours=9 + release_offset_hours)

            # Calculate estimated total work time
            sku_routings = [r for r in self.routings if r["sku_id"] == sku["sku_id"]]
            estimated_work_min = sum(r["proc_time_per_unit_min"] * qty for r in sku_routings)
            # Due date = release + (estimated_work / 0.75) to force congestion
            due_offset_min = int(estimated_work_min / 0.75)
            due_ts = release_ts + timedelta(minutes=due_offset_min)

            self.orders.append({
                "order_id": order_id,
                "sku_id": sku["sku_id"],
                "qty": qty,
                "release_ts": release_ts.strftime("%Y-%m-%d %H:%M"),
                "due_ts": due_ts.strftime("%Y-%m-%d %H:%M"),
                "priority": priority,
            })
        df = pd.DataFrame(self.orders)
        df.to_csv(output_dir / "orders.csv", index=False)

    def _generate_order_ops(self, output_dir: Path) -> None:
        """Generate order_ops.csv - critical expansion of orders into operations."""
        self.order_ops = []
        op_counter = 1

        for order in self.orders:
            sku_id = order["sku_id"]
            qty = order["qty"]
            sku_routings = sorted(
                [r for r in self.routings if r["sku_id"] == sku_id],
                key=lambda x: x["op_seq"]
            )

            # Get family_id from SKU
            sku_info = next(s for s in self.skus if s["sku_id"] == sku_id)
            family_id = sku_info["family_id"]

            op_seq_offset = 0
            for routing in sku_routings:
                duration_min = routing["proc_time_per_unit_min"] * qty

                # CRITICAL: Ensure duration fits within shift window
                # Split long operations into multiple sequential operations
                remaining_duration = duration_min
                split_num = 0
                while remaining_duration > 0:
                    op_duration = min(remaining_duration, MAX_OPERATION_DURATION_MIN)
                    op_id = f"OP{op_counter:04d}"
                    
                    # Adjust op_seq for split operations
                    adjusted_seq = routing["op_seq"] + op_seq_offset
                    op_name = routing["op_name"]
                    if split_num > 0:
                        op_name = f"{routing['op_name']}_part{split_num + 1}"
                        op_seq_offset += 1

                    self.order_ops.append({
                        "op_id": op_id,
                        "order_id": order["order_id"],
                        "sku_id": sku_id,
                        "op_seq": adjusted_seq,
                        "op_name": op_name,
                        "machine_id": routing["machine_id"],
                        "family_id": family_id,
                        "duration_min": round(op_duration, 2),
                    })
                    op_counter += 1
                    remaining_duration -= op_duration
                    split_num += 1

        df = pd.DataFrame(self.order_ops)
        df.to_csv(output_dir / "order_ops.csv", index=False)

    def _generate_machine_unavailability(self, output_dir: Path) -> None:
        """Generate machine_unavailability.csv - single source of truth for 'cannot run' time."""
        records = []

        shift_start_hour = int(SHIFT_START.split(":")[0])
        shift_start_minute = int(SHIFT_START.split(":")[1])
        shift_end_hour = int(SHIFT_END.split(":")[0])
        shift_end_minute = int(SHIFT_END.split(":")[1])

        # Calculate total work time and estimate days needed
        total_work_per_machine: Dict[str, float] = {}
        for op in self.order_ops:
            machine_id = op["machine_id"]
            total_work_per_machine[machine_id] = total_work_per_machine.get(machine_id, 0) + op["duration_min"]

        max_work = max(total_work_per_machine.values()) if total_work_per_machine else 0
        shift_duration = SHIFT_DURATION_MIN
        days_needed = max(HORIZON_DAYS, int(max_work / (shift_duration * 0.8)) + 2)

        # Generate off-shift periods for each day (extended if needed)
        for day in range(days_needed):
            date = BASE_DATE + timedelta(days=day)

            for machine in self.machines:
                # Off-shift: before shift start (midnight to shift_start)
                morning_unavail_duration = shift_start_hour * 60 + shift_start_minute
                if morning_unavail_duration > 0:
                    records.append({
                        "machine_id": machine["machine_id"],
                        "start_ts": date.strftime("%Y-%m-%d 00:00"),
                        "duration_min": morning_unavail_duration,
                    })

                # Off-shift: after shift end (shift_end to midnight)
                evening_unavail_duration = (24 * 60) - (shift_end_hour * 60 + shift_end_minute)
                if evening_unavail_duration > 0:
                    shift_end_ts = datetime.combine(date.date(), datetime.strptime(SHIFT_END, "%H:%M").time())
                    records.append({
                        "machine_id": machine["machine_id"],
                        "start_ts": shift_end_ts.strftime("%Y-%m-%d %H:%M"),
                        "duration_min": evening_unavail_duration,
                    })

        # Generate some planned downtime (random) - but keep it small for MVP
        for machine in self.machines:
            num_downtimes = random.randint(0, 1)
            for _ in range(num_downtimes):
                day = random.randint(0, min(HORIZON_DAYS - 1, days_needed - 1))
                date = BASE_DATE + timedelta(days=day)
                # Downtime during shift hours (but keep it small: 15-45 min)
                hour = random.randint(shift_start_hour + 1, shift_end_hour - 2)
                start_ts = datetime.combine(date.date(), datetime.strptime(f"{hour}:00", "%H:%M").time())
                duration_min = random.randint(15, 45)

                records.append({
                    "machine_id": machine["machine_id"],
                    "start_ts": start_ts.strftime("%Y-%m-%d %H:%M"),
                    "duration_min": duration_min,
                })

        df = pd.DataFrame(records)
        df.to_csv(output_dir / "machine_unavailability.csv", index=False)

    def _generate_disruptions(self, output_dir: Path) -> None:
        """Generate disruptions.csv (optional breakdown/rush events)."""
        records = []
        # For MVP, generate a few disruptions
        num_disruptions = random.randint(0, 3)
        for i in range(num_disruptions):
            event_id = f"EVT{i+1:03d}"
            event_type = random.choice(["breakdown", "rush"])
            machine_id = random.choice([m["machine_id"] for m in self.machines]) if random.random() > 0.3 else None
            day = random.randint(0, HORIZON_DAYS - 1)
            hour = random.randint(9, 17)
            start_ts = datetime.combine(
                (BASE_DATE + timedelta(days=day)).date(),
                datetime.strptime(f"{hour}:00", "%H:%M").time()
            )
            duration_min = random.randint(60, 240)
            order_id = random.choice(self.orders)["order_id"] if event_type == "rush" else None

            records.append({
                "event_id": event_id,
                "event_type": event_type,
                "machine_id": machine_id,
                "start_ts": start_ts.strftime("%Y-%m-%d %H:%M"),
                "duration_min": duration_min,
                "order_id": order_id,
            })
        df = pd.DataFrame(records)
        df.to_csv(output_dir / "disruptions.csv", index=False)

    def _generate_kpi_targets(self, output_dir: Path) -> None:
        """Generate kpi_targets.csv."""
        records = [
            {"metric": "makespan", "baseline_value": 100.0, "target_value": 85.0, "timeframe_weeks": 4},
            {"metric": "on_time_delivery", "baseline_value": 70.0, "target_value": 90.0, "timeframe_weeks": 4},
            {"metric": "machine_utilization", "baseline_value": 65.0, "target_value": 80.0, "timeframe_weeks": 4},
            {"metric": "setup_time_reduction", "baseline_value": 0.0, "target_value": 20.0, "timeframe_weeks": 4},
        ]
        df = pd.DataFrame(records)
        df.to_csv(output_dir / "kpi_targets.csv", index=False)


def generate_data(output_dir: str = "data/synthetic", seed: int = RANDOM_SEED) -> None:
    """Convenience function to generate all data."""
    generator = DataGenerator(seed=seed)
    generator.generate_all(Path(output_dir))


if __name__ == "__main__":
    generate_data()



