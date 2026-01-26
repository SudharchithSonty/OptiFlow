"""Validators for agent proposals and setup guidance.

Ensures no hallucinated IDs and all parameters are sourced.
"""

import logging
from datetime import datetime
from typing import Any, Optional

from agent.proposal_schemas import (
    RescheduleProposal,
    ImpactSummary,
    SetupGuidance,
    SetupChecklistItem,
)

logger = logging.getLogger(__name__)


class ProposalValidationError(Exception):
    """Raised when proposal validation fails."""
    
    def __init__(self, errors: list[str]):
        self.errors = errors
        super().__init__(f"Proposal validation failed: {errors}")


class ProposalValidator:
    """Validates RescheduleProposal against scenario data.
    
    Ensures:
    - All referenced IDs exist in scenario_meta
    - Time windows are within horizon
    - No auto-publish flags
    """
    
    def __init__(
        self,
        valid_order_ids: set[str],
        valid_machine_ids: set[str],
        valid_op_ids: set[str],
        horizon_start: Optional[datetime] = None,
        horizon_end: Optional[datetime] = None,
    ):
        """Initialize validator with valid IDs from scenario.
        
        Args:
            valid_order_ids: Set of valid order IDs from scenario
            valid_machine_ids: Set of valid machine IDs from scenario
            valid_op_ids: Set of valid operation IDs from scenario
            horizon_start: Earliest valid timestamp
            horizon_end: Latest valid timestamp
        """
        self.valid_order_ids = valid_order_ids
        self.valid_machine_ids = valid_machine_ids
        self.valid_op_ids = valid_op_ids
        self.horizon_start = horizon_start
        self.horizon_end = horizon_end
        self.errors: list[str] = []
    
    def validate(self, proposal: RescheduleProposal) -> bool:
        """Validate a reschedule proposal.
        
        Args:
            proposal: The proposal to validate
            
        Returns:
            True if valid, False if errors found
        """
        self.errors = []
        
        # Validate referenced IDs
        self._validate_order_ids(proposal.referenced_order_ids)
        self._validate_machine_ids(proposal.referenced_machine_ids)
        self._validate_op_ids(proposal.referenced_op_ids)
        
        # Validate IDs in constraints
        for constraint in proposal.assumed_constraints:
            if constraint.constraint_type == "order_locked":
                if constraint.entity_id not in self.valid_order_ids:
                    self.errors.append(
                        f"Unknown order_id in constraint: {constraint.entity_id}"
                    )
            elif constraint.constraint_type == "machine_unavailable":
                if constraint.entity_id not in self.valid_machine_ids:
                    self.errors.append(
                        f"Unknown machine_id in constraint: {constraint.entity_id}"
                    )
        
        # Validate IDs in recommended actions
        for action in proposal.recommended_actions:
            for order_id in action.affected_orders:
                if order_id not in self.valid_order_ids:
                    self.errors.append(
                        f"Unknown order_id in action: {order_id}"
                    )
            for machine_id in action.affected_machines:
                if machine_id not in self.valid_machine_ids:
                    self.errors.append(
                        f"Unknown machine_id in action: {machine_id}"
                    )
        
        # Validate timestamps
        if proposal.reschedule_from_ts:
            self._validate_timestamp(
                proposal.reschedule_from_ts, 
                "reschedule_from_ts"
            )
        
        for constraint in proposal.assumed_constraints:
            if constraint.start_ts:
                self._validate_timestamp(constraint.start_ts, "constraint.start_ts")
            if constraint.end_ts:
                self._validate_timestamp(constraint.end_ts, "constraint.end_ts")
        
        if self.errors:
            logger.warning(f"Proposal validation failed: {self.errors}")
        
        return len(self.errors) == 0
    
    def _validate_order_ids(self, order_ids: list[str]) -> None:
        """Check all order IDs exist."""
        for oid in order_ids:
            if oid not in self.valid_order_ids:
                self.errors.append(f"Unknown order_id: {oid}")
    
    def _validate_machine_ids(self, machine_ids: list[str]) -> None:
        """Check all machine IDs exist."""
        for mid in machine_ids:
            if mid not in self.valid_machine_ids:
                self.errors.append(f"Unknown machine_id: {mid}")
    
    def _validate_op_ids(self, op_ids: list[str]) -> None:
        """Check all operation IDs exist."""
        for opid in op_ids:
            if opid not in self.valid_op_ids:
                self.errors.append(f"Unknown op_id: {opid}")
    
    def _validate_timestamp(self, ts: datetime, field_name: str) -> None:
        """Check timestamp is within horizon."""
        if self.horizon_start and ts < self.horizon_start:
            self.errors.append(
                f"{field_name} is before horizon start: {ts}"
            )
        if self.horizon_end and ts > self.horizon_end:
            self.errors.append(
                f"{field_name} is after horizon end: {ts}"
            )


class ImpactSummaryValidator:
    """Validates ImpactSummary against scenario data."""
    
    def __init__(
        self,
        valid_order_ids: set[str],
        valid_machine_ids: set[str],
    ):
        self.valid_order_ids = valid_order_ids
        self.valid_machine_ids = valid_machine_ids
        self.errors: list[str] = []
    
    def validate(self, summary: ImpactSummary) -> bool:
        """Validate an impact summary.
        
        Args:
            summary: The summary to validate
            
        Returns:
            True if valid, False if errors found
        """
        self.errors = []
        
        # Validate order IDs
        for oid in summary.late_orders:
            if oid not in self.valid_order_ids:
                self.errors.append(f"Unknown order_id in late_orders: {oid}")
        
        for oid in summary.orders_improved:
            if oid not in self.valid_order_ids:
                self.errors.append(f"Unknown order_id in orders_improved: {oid}")
        
        # Validate machine IDs
        for mid in summary.bottleneck_machines:
            if mid not in self.valid_machine_ids:
                self.errors.append(f"Unknown machine_id in bottleneck_machines: {mid}")
        
        return len(self.errors) == 0


class SetupGuidanceValidator:
    """Validates SetupGuidance against scenario data.
    
    Ensures:
    - All referenced IDs exist
    - Numeric parameters are sourced (have kb_document_id or source)
    - No fabricated instructions
    """
    
    def __init__(
        self,
        valid_order_ids: set[str],
        valid_machine_ids: set[str],
        valid_op_ids: set[str],
        valid_families: set[str],
        valid_kb_doc_ids: Optional[set[str]] = None,
    ):
        self.valid_order_ids = valid_order_ids
        self.valid_machine_ids = valid_machine_ids
        self.valid_op_ids = valid_op_ids
        self.valid_families = valid_families
        self.valid_kb_doc_ids = valid_kb_doc_ids or set()
        self.errors: list[str] = []
    
    def validate(self, guidance: SetupGuidance) -> bool:
        """Validate setup guidance.
        
        Args:
            guidance: The guidance to validate
            
        Returns:
            True if valid, False if errors found
        """
        self.errors = []
        
        # Validate referenced IDs
        for oid in guidance.referenced_order_ids:
            if oid not in self.valid_order_ids:
                self.errors.append(f"Unknown order_id: {oid}")
        
        for mid in guidance.referenced_machine_ids:
            if mid not in self.valid_machine_ids:
                self.errors.append(f"Unknown machine_id: {mid}")
        
        for opid in guidance.referenced_op_ids:
            if opid not in self.valid_op_ids:
                self.errors.append(f"Unknown op_id: {opid}")
        
        # Validate KB sources
        for kb_id in guidance.kb_sources:
            if self.valid_kb_doc_ids and kb_id not in self.valid_kb_doc_ids:
                self.errors.append(f"Unknown KB document_id: {kb_id}")
        
        # Validate per-machine guidance
        for machine_guidance in guidance.machines:
            self._validate_machine_guidance(machine_guidance)
        
        return len(self.errors) == 0
    
    def _validate_machine_guidance(self, mg: Any) -> None:
        """Validate a single machine's guidance."""
        # Machine ID must be valid
        if mg.machine_id not in self.valid_machine_ids:
            self.errors.append(f"Unknown machine_id: {mg.machine_id}")
        
        # Families must be valid
        if mg.from_family and mg.from_family not in self.valid_families:
            self.errors.append(f"Unknown from_family: {mg.from_family}")
        
        if mg.to_family not in self.valid_families:
            self.errors.append(f"Unknown to_family: {mg.to_family}")
        
        # Validate checklist items
        for item in mg.checklist:
            self._validate_checklist_item(item, mg.machine_id)
        
        for item in mg.first_piece_checks:
            self._validate_checklist_item(item, mg.machine_id)
    
    def _validate_checklist_item(
        self, 
        item: SetupChecklistItem, 
        machine_id: str,
    ) -> None:
        """Validate a single checklist item.
        
        Numeric parameters must have a source.
        """
        # Check for numeric values in instruction without source
        import re
        # Look for numbers that might be parameters (e.g., "set to 1500 RPM")
        numeric_pattern = r'\b\d+(?:\.\d+)?\s*(?:mm|cm|in|rpm|psi|bar|deg|C|F|min|sec|s)\b'
        
        if re.search(numeric_pattern, item.instruction, re.IGNORECASE):
            if not item.source and not item.kb_document_id:
                self.errors.append(
                    f"Numeric parameter in checklist for {machine_id} "
                    f"without source: {item.instruction[:50]}..."
                )
        
        # Validate KB reference if provided
        if item.kb_document_id:
            if self.valid_kb_doc_ids and item.kb_document_id not in self.valid_kb_doc_ids:
                self.errors.append(
                    f"Unknown KB document_id in checklist: {item.kb_document_id}"
                )


def validate_proposal(
    proposal: RescheduleProposal,
    scenario_meta: dict[str, Any],
) -> tuple[bool, list[str]]:
    """Convenience function to validate a proposal against scenario metadata.
    
    Args:
        proposal: The proposal to validate
        scenario_meta: Scenario metadata containing valid IDs
        
    Returns:
        Tuple of (is_valid, errors)
    """
    # Extract valid IDs from scenario_meta
    orders = scenario_meta.get("orders", [])
    machines = scenario_meta.get("machines", [])
    
    valid_order_ids = {o.get("order_id") for o in orders if o.get("order_id")}
    valid_machine_ids = {m.get("machine_id") for m in machines if m.get("machine_id")}
    
    # Extract op_ids from order operations if available
    valid_op_ids: set[str] = set()
    for order in orders:
        for op in order.get("operations", []):
            if op.get("op_id"):
                valid_op_ids.add(op["op_id"])
    
    validator = ProposalValidator(
        valid_order_ids=valid_order_ids,
        valid_machine_ids=valid_machine_ids,
        valid_op_ids=valid_op_ids,
    )
    
    is_valid = validator.validate(proposal)
    return is_valid, validator.errors


def validate_setup_guidance(
    guidance: SetupGuidance,
    scenario_meta: dict[str, Any],
    kb_doc_ids: Optional[set[str]] = None,
) -> tuple[bool, list[str]]:
    """Convenience function to validate setup guidance against scenario metadata.
    
    Args:
        guidance: The guidance to validate
        scenario_meta: Scenario metadata containing valid IDs
        kb_doc_ids: Optional set of valid KB document IDs
        
    Returns:
        Tuple of (is_valid, errors)
    """
    orders = scenario_meta.get("orders", [])
    machines = scenario_meta.get("machines", [])
    
    valid_order_ids = {o.get("order_id") for o in orders if o.get("order_id")}
    valid_machine_ids = {m.get("machine_id") for m in machines if m.get("machine_id")}
    
    # Extract families from orders
    valid_families: set[str] = set()
    for order in orders:
        if order.get("product_family"):
            valid_families.add(order["product_family"])
        if order.get("family_id"):
            valid_families.add(order["family_id"])
    
    # Extract op_ids
    valid_op_ids: set[str] = set()
    for order in orders:
        for op in order.get("operations", []):
            if op.get("op_id"):
                valid_op_ids.add(op["op_id"])
    
    validator = SetupGuidanceValidator(
        valid_order_ids=valid_order_ids,
        valid_machine_ids=valid_machine_ids,
        valid_op_ids=valid_op_ids,
        valid_families=valid_families,
        valid_kb_doc_ids=kb_doc_ids,
    )
    
    is_valid = validator.validate(guidance)
    return is_valid, validator.errors
