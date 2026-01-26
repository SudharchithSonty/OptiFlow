"""Validator for agent outputs - ensures no hallucinated IDs.

Every ID referenced in agent output must exist in the actual data.
"""

import logging
from typing import Any

logger = logging.getLogger(__name__)


class BriefValidator:
    """Validates agent brief outputs against actual data."""
    
    def __init__(
        self,
        order_ids: set[str],
        machine_ids: set[str],
        op_ids: set[str],
        kpis_baseline: dict[str, Any],
        kpis_optimized: dict[str, Any],
    ):
        """Initialize validator with valid IDs from the run.
        
        Args:
            order_ids: Set of valid order IDs
            machine_ids: Set of valid machine IDs  
            op_ids: Set of valid operation IDs
            kpis_baseline: Baseline KPI values
            kpis_optimized: Optimized KPI values
        """
        self.order_ids = order_ids
        self.machine_ids = machine_ids
        self.op_ids = op_ids
        self.kpis_baseline = kpis_baseline
        self.kpis_optimized = kpis_optimized
        self.errors: list[str] = []
    
    def validate_brief(self, brief: dict[str, Any]) -> bool:
        """Validate a brief dictionary.
        
        Args:
            brief: Brief content to validate
            
        Returns:
            True if valid, False if any validation errors
        """
        self.errors = []
        
        # Validate recommendations
        recommendations = brief.get("recommendations", [])
        for i, rec in enumerate(recommendations):
            self._validate_recommendation(i, rec)
        
        # Validate KPI deltas
        kpi_deltas = brief.get("kpi_deltas", [])
        for delta in kpi_deltas:
            self._validate_kpi_delta(delta)
        
        if self.errors:
            logger.warning(f"Brief validation failed with {len(self.errors)} errors")
            for error in self.errors:
                logger.warning(f"  - {error}")
        
        return len(self.errors) == 0
    
    def _validate_recommendation(self, index: int, rec: dict[str, Any]) -> None:
        """Validate a single recommendation."""
        # Check order IDs
        for order_id in rec.get("related_orders", []):
            if order_id not in self.order_ids:
                self.errors.append(
                    f"Recommendation {index}: Unknown order_id '{order_id}'"
                )
        
        # Check machine IDs
        for machine_id in rec.get("related_machines", []):
            if machine_id not in self.machine_ids:
                self.errors.append(
                    f"Recommendation {index}: Unknown machine_id '{machine_id}'"
                )
    
    def _validate_kpi_delta(self, delta: dict[str, Any]) -> None:
        """Validate a KPI delta entry."""
        metric = delta.get("metric", "")
        baseline = delta.get("baseline_value")
        optimized = delta.get("optimized_value")
        
        if metric not in self.kpis_baseline and metric not in self.kpis_optimized:
            self.errors.append(f"Unknown KPI metric: '{metric}'")
            return
        
        # Verify values are approximately correct (allow 1% tolerance)
        actual_baseline = self.kpis_baseline.get(metric)
        actual_optimized = self.kpis_optimized.get(metric)
        
        if actual_baseline is not None and baseline is not None:
            if not self._approx_equal(baseline, actual_baseline, tolerance=0.01):
                self.errors.append(
                    f"KPI '{metric}' baseline mismatch: claimed {baseline}, actual {actual_baseline}"
                )
        
        if actual_optimized is not None and optimized is not None:
            if not self._approx_equal(optimized, actual_optimized, tolerance=0.01):
                self.errors.append(
                    f"KPI '{metric}' optimized mismatch: claimed {optimized}, actual {actual_optimized}"
                )
    
    def _approx_equal(self, a: float, b: float, tolerance: float = 0.01) -> bool:
        """Check if two numbers are approximately equal."""
        if b == 0:
            return abs(a) < tolerance
        return abs((a - b) / b) < tolerance


def validate_operation_ids(op_ids: list[str], valid_ids: set[str]) -> list[str]:
    """Validate that all operation IDs exist.
    
    Args:
        op_ids: List of operation IDs to validate
        valid_ids: Set of valid operation IDs
        
    Returns:
        List of invalid IDs (empty if all valid)
    """
    return [oid for oid in op_ids if oid not in valid_ids]
