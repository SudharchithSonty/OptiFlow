"""Constraint helper functions for scheduling."""

from typing import List, Tuple
from .data_loader import DataLoader


def get_machine_availability_windows(
    loader: DataLoader, machine_id: str
) -> List[Tuple[int, int]]:
    """Get available time windows for a machine (between unavailability periods)."""
    unavail_intervals = loader.get_unavailability_intervals(machine_id)
    horizon_end = loader.get_horizon_end_min()

    if not unavail_intervals:
        return [(0, horizon_end)]

    # Sort by start time
    unavail_intervals.sort(key=lambda x: x[0])

    windows = []
    current_start = 0

    for start, duration in unavail_intervals:
        if current_start < start:
            windows.append((current_start, start))
        current_start = start + duration

    if current_start < horizon_end:
        windows.append((current_start, horizon_end))

    return windows


def check_operation_fits_in_window(
    duration: int, release_time: int, windows: List[Tuple[int, int]]
) -> bool:
    """Check if an operation can fit in any available window."""
    for window_start, window_end in windows:
        if release_time >= window_start and release_time + duration <= window_end:
            return True
    return False



