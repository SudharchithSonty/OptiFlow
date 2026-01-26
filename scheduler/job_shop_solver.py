"""OR-Tools CP-SAT job shop solver with sequence-dependent setup times."""

from typing import Dict, List, Tuple, Optional
from ortools.sat.python import cp_model
from .data_loader import DataLoader

# Bottleneck machine for transitions (locked for MVP)
BOTTLENECK_MACHINE_ID = "M03"


class JobShopSolver:
    """CP-SAT solver for job shop scheduling with sequence-dependent setup."""

    def __init__(self, data_loader: DataLoader):
        """Initialize solver with data loader."""
        self.loader = data_loader
        self.model = cp_model.CpModel()
        self.solver = cp_model.CpSolver()
        self.solver.parameters.max_time_in_seconds = 30.0  # Time limit for MVP

        # Variables
        self.op_intervals: Dict[str, cp_model.IntervalVar] = {}
        self.op_starts: Dict[str, cp_model.IntVar] = {}
        self.op_ends: Dict[str, cp_model.IntVar] = {}
        self.makespan: Optional[cp_model.IntVar] = None

        # For M03 transitions
        self.m03_ops: List[str] = []
        self.arc_selected: Dict[Tuple[str, str], cp_model.BoolVar] = {}
        self.family_map: Dict[str, str] = {}  # op_id -> family_id

        # Results
        self.schedule: List[Dict] = []

    def build_model(self) -> None:
        """Build the CP-SAT model."""
        # Step 1: Create interval variables for all operations
        self._create_interval_variables()

        # Step 2: Add precedence constraints (routing sequence)
        self._add_precedence_constraints()

        # Step 3: Add release time constraints
        self._add_release_time_constraints()

        # Step 4: Add machine capacity constraints (NoOverlap)
        self._add_machine_capacity_constraints()

        # Step 5: Add sequence-dependent setup for M03 (AddCircuit transitions)
        self._add_transitions_m03()

        # Step 6: Add horizon end bound
        self._add_horizon_end_bound()

        # Step 7: Set objective
        self._set_objective()

    def _create_interval_variables(self) -> None:
        """Create interval variables for each operation."""
        for _, op in self.loader.order_ops.iterrows():
            op_id = op["op_id"]
            duration = int(op["duration_min"])

            # Create start, end, and interval variables
            start_var = self.model.NewIntVar(0, self.loader.get_horizon_end_min(), f"start_{op_id}")
            end_var = self.model.NewIntVar(0, self.loader.get_horizon_end_min(), f"end_{op_id}")
            interval_var = self.model.NewIntervalVar(
                start_var, duration, end_var, f"interval_{op_id}"
            )

            self.op_intervals[op_id] = interval_var
            self.op_starts[op_id] = start_var
            self.op_ends[op_id] = end_var

            # Track family for setup time lookup
            self.family_map[op_id] = op["family_id"]

            # Track M03 operations
            if op["machine_id"] == BOTTLENECK_MACHINE_ID:
                self.m03_ops.append(op_id)

    def _add_precedence_constraints(self) -> None:
        """Add precedence constraints using AddEndBeforeStart."""
        for order_id in self.loader.orders["order_id"].unique():
            ops = self.loader.get_operations_by_order(order_id)
            if len(ops) < 2:
                continue

            prev_op_id = None
            for _, op in ops.iterrows():
                op_id = op["op_id"]
                if prev_op_id:
                    # Previous operation must end before this one starts
                    self.model.Add(
                        self.op_ends[prev_op_id] <= self.op_starts[op_id]
                    )
                prev_op_id = op_id

    def _add_release_time_constraints(self) -> None:
        """Add release time constraints."""
        for _, order in self.loader.orders.iterrows():
            order_id = order["order_id"]
            release_time = order["release_time_min"]
            ops = self.loader.get_operations_by_order(order_id)

            for _, op in ops.iterrows():
                op_id = op["op_id"]
                self.model.Add(self.op_starts[op_id] >= release_time)

    def _add_machine_capacity_constraints(self) -> None:
        """Add NoOverlap constraints per machine (including fixed intervals)."""
        for machine_id in self.loader.machines["machine_id"].unique():
            # Get all operations on this machine
            ops_on_machine = self.loader.get_operations_for_machine(machine_id)
            intervals = [self.op_intervals[op_id] for op_id in ops_on_machine["op_id"]]

            # Add fixed intervals for unavailability
            unavail_intervals = self.loader.get_unavailability_intervals(machine_id)
            for start_min, duration_min in unavail_intervals:
                # Create fixed interval
                fixed_interval = self.model.NewFixedSizeIntervalVar(
                    start_min, duration_min, f"unavail_{machine_id}_{start_min}"
                )
                intervals.append(fixed_interval)

            # Add NoOverlap constraint
            if intervals:
                self.model.AddNoOverlap(intervals)

    def _add_transitions_m03(self) -> None:
        """Add sequence-dependent setup for M03 using AddCircuit transitions."""
        if not self.m03_ops:
            return  # No M03 operations, skip transitions
        
        if len(self.m03_ops) == 1:
            # Only one operation on M03, no transitions needed
            return

        # Map op_ids to integer indices for AddCircuit
        # Node 0 is the dummy node, actual ops start at 1
        op_to_idx: Dict[str, int] = {}
        idx_to_op: Dict[int, str] = {}
        for i, op_id in enumerate(self.m03_ops):
            op_to_idx[op_id] = i + 1  # Start from 1 (0 is dummy)
            idx_to_op[i + 1] = op_id

        dummy_node = 0

        # Create arcs: 0→task, task→0, task↔task
        arcs = []

        # Entry arcs: 0→task
        for op_id in self.m03_ops:
            task_idx = op_to_idx[op_id]
            arc_var = self.model.NewBoolVar(f"arc_0_{op_id}")
            self.arc_selected[(0, task_idx)] = arc_var
            arcs.append((dummy_node, task_idx, arc_var))

        # Exit arcs: task→0
        for op_id in self.m03_ops:
            task_idx = op_to_idx[op_id]
            arc_var = self.model.NewBoolVar(f"arc_{op_id}_0")
            self.arc_selected[(task_idx, 0)] = arc_var
            arcs.append((task_idx, dummy_node, arc_var))

        # Transition arcs: task↔task
        for i, op_i in enumerate(self.m03_ops):
            for j, op_j in enumerate(self.m03_ops):
                if i != j:
                    idx_i = op_to_idx[op_i]
                    idx_j = op_to_idx[op_j]
                    arc_var = self.model.NewBoolVar(f"arc_{op_i}_{op_j}")
                    self.arc_selected[(idx_i, idx_j)] = arc_var
                    arcs.append((idx_i, idx_j, arc_var))

        # Add circuit constraint
        self.model.AddCircuit(arcs)

        # Reify setup time on chosen arcs
        machine_type = self.loader.get_machine_type(BOTTLENECK_MACHINE_ID)
        M = self.loader.get_horizon_end_min()  # Big-M value

        for (from_idx, to_idx), arc_var in self.arc_selected.items():
            if from_idx == dummy_node or to_idx == dummy_node:
                # Entry/exit arcs: setup_time = 0 (no constraint needed)
                continue
            else:
                # Transition arcs: lookup from changeover matrix
                from_op = idx_to_op[from_idx]
                to_op = idx_to_op[to_idx]
                from_family = self.family_map[from_op]
                to_family = self.family_map[to_op]
                setup_time = self.loader.get_setup_time(machine_type, from_family, to_family)

                if setup_time > 0:
                    # If arc is selected (arc_var = 1), enforce start[j] >= end[i] + setup_time
                    # Using big-M formulation: start[j] >= end[i] + setup_time - M * (1 - arc_var)
                    # When arc_var = 1: start[j] >= end[i] + setup_time
                    # When arc_var = 0: start[j] >= end[i] + setup_time - M (non-binding if M is large)
                    self.model.Add(
                        self.op_starts[to_op] >= self.op_ends[from_op] + setup_time - M * (1 - arc_var)
                    )

    def _add_horizon_end_bound(self) -> None:
        """Add horizon end bound (keep bounds tight)."""
        horizon_end = self.loader.get_horizon_end_min()
        for op_id in self.op_ends:
            self.model.Add(self.op_ends[op_id] <= horizon_end)

    def _set_objective(self) -> None:
        """Set objective: minimize makespan + tiny penalty for family switches."""
        # Makespan = max(end_time)
        horizon_end = self.loader.get_horizon_end_min()
        self.makespan = self.model.NewIntVar(0, horizon_end, "makespan")
        for op_id in self.op_ends:
            self.model.Add(self.makespan >= self.op_ends[op_id])

        # Count family switches on M03 (optional penalty)
        if self.m03_ops and len(self.m03_ops) > 1 and self.arc_selected:
            machine_type = self.loader.get_machine_type(BOTTLENECK_MACHINE_ID)
            switch_count = self.model.NewIntVar(0, len(self.m03_ops), "family_switches")

            # Build idx_to_op mapping (same as in _add_transitions_m03)
            idx_to_op: Dict[int, str] = {}
            for i, op_id in enumerate(self.m03_ops):
                idx_to_op[i + 1] = op_id

            # Count transitions that change family
            switch_vars = []
            for (from_idx, to_idx), arc_var in self.arc_selected.items():
                if from_idx != 0 and to_idx != 0:  # Skip dummy node arcs
                    from_op = idx_to_op.get(from_idx)
                    to_op = idx_to_op.get(to_idx)
                    if from_op and to_op:
                        from_family = self.family_map.get(from_op)
                        to_family = self.family_map.get(to_op)
                        if from_family and to_family and from_family != to_family:
                            switch_vars.append(arc_var)

            if switch_vars:
                self.model.Add(switch_count == sum(switch_vars))
                # Objective: makespan + tiny penalty * switches (penalty = 1 to keep it small)
                self.model.Minimize(self.makespan + switch_count)
            else:
                self.model.Minimize(self.makespan)
        else:
            self.model.Minimize(self.makespan)

    def solve(self) -> bool:
        """Solve the model and extract schedule."""
        status = self.solver.Solve(self.model)

        if status in [cp_model.OPTIMAL, cp_model.FEASIBLE]:
            # Extract schedule
            self.schedule = []
            for _, op in self.loader.order_ops.iterrows():
                op_id = op["op_id"]
                start_time = self.solver.Value(self.op_starts[op_id])
                end_time = self.solver.Value(self.op_ends[op_id])

                self.schedule.append({
                    "op_id": op_id,
                    "order_id": op["order_id"],
                    "machine_id": op["machine_id"],
                    "start_time_min": start_time,
                    "end_time_min": end_time,
                    "duration_min": int(op["duration_min"]),
                    "family_id": op["family_id"],
                })

            return True
        return False

    def get_makespan(self) -> int:
        """Get makespan from solution."""
        if self.makespan is not None:
            return self.solver.Value(self.makespan)
        if self.schedule:
            return max(op["end_time_min"] for op in self.schedule)
        return 0

    def get_status_string(self) -> str:
        """Get solver status string (uses cached status from last solve)."""
        # Use StatusName which returns the string representation of the status
        return self.solver.StatusName()

