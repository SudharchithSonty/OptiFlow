"""Configuration parameters for synthetic data generation."""

from datetime import datetime, timedelta

# Seed for reproducibility
RANDOM_SEED = 42

# Horizon settings
HORIZON_DAYS = 3
SHIFT_START = "09:00"
SHIFT_END = "18:00"
SHIFT_DURATION_MIN = 540  # 9 hours

# Machine configuration
MACHINE_TYPES = ["TURN", "MILL", "DRILL", "GRIND", "CMM"]
# For MVP: exactly one MILL machine (M03) for bottleneck transitions
MACHINES = [
    {"machine_id": "M01", "machine_type": "TURN", "is_bottleneck": 0},
    {"machine_id": "M02", "machine_type": "TURN", "is_bottleneck": 0},
    {"machine_id": "M03", "machine_type": "MILL", "is_bottleneck": 1},  # Bottleneck - only MILL
    {"machine_id": "M04", "machine_type": "DRILL", "is_bottleneck": 0},
    {"machine_id": "M05", "machine_type": "DRILL", "is_bottleneck": 0},
    {"machine_id": "M06", "machine_type": "GRIND", "is_bottleneck": 0},
    {"machine_id": "M07", "machine_type": "GRIND", "is_bottleneck": 0},
    {"machine_id": "M08", "machine_type": "CMM", "is_bottleneck": 0},
]

# Maximum operation duration (must fit within shift with buffer)
MAX_OPERATION_DURATION_MIN = 360  # 6 hours max per operation

# Family configuration
FAMILIES = ["F1", "F2", "F3", "F4", "F5", "F6"]
NUM_SKUS = 15

# Processing time ranges (minutes per unit) by operation type
PROC_TIME_RANGES = {
    "TURN": (2.0, 8.0),
    "MILL": (3.0, 12.0),
    "DRILL": (1.5, 6.0),
    "GRIND": (2.0, 5.0),
    "CMM": (0.5, 2.0),
}

# Order quantity range (reduced for MVP to ensure feasibility within 3-day horizon)
ORDER_QTY_MIN = 20
ORDER_QTY_MAX = 80

# Changeover time ranges (minutes)
# Same family: internal 5-15 min, external 5-10 min
# Different family: internal 25-90 min, external 10-30 min
CHANGEOVER_SAME_FAMILY = {
    "internal_min": (5, 15),
    "external_min": (5, 10),
    "reject_prob": (0.02, 0.08),
}

CHANGEOVER_DIFFERENT_FAMILY = {
    "internal_min": (25, 90),
    "external_min": (10, 30),
    "reject_prob": (0.08, 0.25),
}

# Operations per SKU
OPS_PER_SKU_MIN = 2
OPS_PER_SKU_MAX = 4

# Priority levels
PRIORITY_LEVELS = [1, 2, 3, 4, 5]

# Base date for generation
BASE_DATE = datetime(2025, 12, 15)



