"""Reschedule Agent Service - orchestrates disruption replanning.

Generates proposals using Claude (or fallback), validates them,
creates child runs, schedules them, and computes impact.
"""

import json
import logging
import time
from datetime import datetime
from pathlib import Path
from typing import Any, Optional
from uuid import UUID

from agent.claude_client import claude_client
from agent.proposal_schemas import (
    RescheduleProposal,
    ConstraintAssumption,
    RecommendedAction,
    ImpactSummary,
    MachineDownPayload,
    PriorityChangePayload,
    QualityIssuePayload,
)
from agent.proposal_validator import validate_proposal

logger = logging.getLogger(__name__)


class RescheduleAgentError(Exception):
    """Raised when reschedule agent fails."""
    
    def __init__(self, message: str, errors: Optional[list[str]] = None):
        self.message = message
        self.errors = errors or []
        super().__init__(message)


class RescheduleAgentService:
    """Service for generating AI-powered reschedule proposals.
    
    Generates proposals that are then executed deterministically by
    the scheduler. The agent doesn't generate schedules directly.
    """
    
    def __init__(
        self,
        parent_run_dir: Path,
        org_id: Optional[str] = None,
    ):
        """Initialize agent with parent run directory.
        
        Args:
            parent_run_dir: Path to parent run's artifact directory
            org_id: Optional org ID for KB queries
        """
        self.parent_run_dir = parent_run_dir
        self.org_id = org_id
        self.trace_entries: list[dict] = []
        self.errors: list[str] = []
    
    def _log_trace(
        self,
        action: str,
        details: dict,
        duration_ms: Optional[int] = None,
    ) -> None:
        """Add entry to execution trace."""
        self.trace_entries.append({
            "timestamp": datetime.utcnow().isoformat(),
            "action": action,
            "details": details,
            "duration_ms": duration_ms,
        })
    
    def _load_artifact(self, filename: str) -> Optional[dict[str, Any]]:
        """Load a JSON artifact from the parent run directory."""
        filepath = self.parent_run_dir / filename
        if not filepath.exists():
            self.errors.append(f"Missing artifact: {filename}")
            return None
        
        try:
            with open(filepath) as f:
                return json.load(f)
        except Exception as e:
            self.errors.append(f"Error loading {filename}: {e}")
            return None
    
    def generate_proposal(
        self,
        event_type: str,
        event_payload: dict[str, Any],
        event_title: str,
    ) -> dict[str, Any]:
        """Generate a reschedule proposal based on a disruption event.
        
        Args:
            event_type: Type of event (machine_down, priority_change, etc.)
            event_payload: Event payload data
            event_title: Event title/description
            
        Returns:
            Dict with proposal, mode, validation status, and errors
        """
        start_time = time.time()
        self.trace_entries = []
        self.errors = []
        
        self._log_trace("start", {
            "parent_run_dir": str(self.parent_run_dir),
            "event_type": event_type,
        })
        
        # Load parent run artifacts
        scenario_meta = self._load_artifact("scenario_meta.json") or {}
        kpis_optimized = self._load_artifact("kpi_optimized.json") or {}
        schedule_optimized_data = self._load_artifact("schedule_optimized.json") or {}
        schedule_optimized = schedule_optimized_data.get("schedule", [])
        
        self._log_trace("artifacts_loaded", {
            "scenario_meta_found": bool(scenario_meta),
            "schedule_found": bool(schedule_optimized),
        })
        
        # Try Claude first
        mode = "rules_fallback"
        proposal: Optional[RescheduleProposal] = None
        validation_passed = False
        
        if claude_client.is_available:
            self._log_trace("claude_attempt", {"model": claude_client.model})
            claude_start = time.time()
            
            proposal = self._generate_proposal_claude(
                event_type=event_type,
                event_payload=event_payload,
                event_title=event_title,
                scenario_meta=scenario_meta,
                schedule=schedule_optimized,
            )
            
            claude_ms = int((time.time() - claude_start) * 1000)
            
            if proposal:
                # Validate Claude's proposal
                is_valid, val_errors = validate_proposal(proposal, scenario_meta)
                
                if is_valid:
                    mode = "claude"
                    validation_passed = True
                    self._log_trace("claude_success", {
                        "model": claude_client.model,
                    }, claude_ms)
                else:
                    self.errors.extend(val_errors)
                    self._log_trace("claude_validation_failed", {
                        "errors": val_errors,
                    }, claude_ms)
                    proposal = None
            else:
                self._log_trace("claude_failed", {}, claude_ms)
        
        # Fall back to rules if Claude failed or unavailable
        if proposal is None:
            fallback_start = time.time()
            self._log_trace("fallback_start", {})
            
            proposal = self._generate_proposal_rules(
                event_type=event_type,
                event_payload=event_payload,
                scenario_meta=scenario_meta,
            )
            
            # Validate fallback proposal (should always pass)
            is_valid, val_errors = validate_proposal(proposal, scenario_meta)
            validation_passed = is_valid
            
            if not is_valid:
                self.errors.extend(val_errors)
            
            fallback_ms = int((time.time() - fallback_start) * 1000)
            self._log_trace("fallback_complete", {
                "validation_passed": validation_passed,
            }, fallback_ms)
        
        total_ms = int((time.time() - start_time) * 1000)
        self._log_trace("complete", {"mode": mode, "total_ms": total_ms})
        
        return {
            "proposal": proposal,
            "mode": mode,
            "validation_passed": validation_passed,
            "errors": self.errors,
            "trace": self.trace_entries,
            "generation_time_ms": total_ms,
        }
    
    def _generate_proposal_claude(
        self,
        event_type: str,
        event_payload: dict[str, Any],
        event_title: str,
        scenario_meta: dict[str, Any],
        schedule: list[dict],
    ) -> Optional[RescheduleProposal]:
        """Generate proposal using Claude.
        
        Args:
            event_type: Type of disruption event
            event_payload: Event payload
            event_title: Event description
            scenario_meta: Scenario metadata
            schedule: Current schedule
            
        Returns:
            RescheduleProposal or None if generation fails
        """
        # Build prompt for Claude
        system_prompt = """You are an AI assistant for manufacturing scheduling.
Generate a reschedule proposal in JSON format based on the disruption event.

IMPORTANT CONSTRAINTS:
- Only reference order_ids, machine_ids, and op_ids that exist in the scenario_meta
- Do not invent new IDs or fabricate data
- Keep explanations concise but informative
- Focus on practical recommendations

Output must be valid JSON matching this structure:
{
    "parent_run_id": "string (from input)",
    "reschedule_mode": "from_now" | "from_timestamp" | "full",
    "reschedule_from_ts": "ISO datetime or null",
    "assumed_constraints": [
        {
            "constraint_type": "machine_unavailable" | "order_locked" | "priority_override",
            "entity_id": "ID of affected entity",
            "start_ts": "ISO datetime or null",
            "end_ts": "ISO datetime or null",
            "value": "constraint value or null",
            "reason": "why this constraint"
        }
    ],
    "recommended_actions": [
        {
            "priority": 1-5,
            "action": "description of action",
            "affected_orders": ["order_ids"],
            "affected_machines": ["machine_ids"]
        }
    ],
    "explanation": "short explanation",
    "referenced_order_ids": ["all order IDs mentioned"],
    "referenced_machine_ids": ["all machine IDs mentioned"],
    "referenced_op_ids": ["all op IDs mentioned"]
}"""

        # Extract valid IDs for context
        orders = scenario_meta.get("orders", [])
        machines = scenario_meta.get("machines", [])
        valid_order_ids = [o.get("order_id") for o in orders if o.get("order_id")]
        valid_machine_ids = [m.get("machine_id") for m in machines if m.get("machine_id")]
        
        parent_run_id = scenario_meta.get("run_id", "unknown")
        
        user_prompt = f"""Disruption Event:
Type: {event_type}
Title: {event_title}
Payload: {json.dumps(event_payload, default=str)}

Current Schedule Context:
- {len(orders)} orders
- {len(machines)} machines
- Valid order IDs: {valid_order_ids[:10]}... (first 10)
- Valid machine IDs: {valid_machine_ids}

Parent Run ID: {parent_run_id}

Generate a reschedule proposal to address this disruption."""

        try:
            response = claude_client.client.messages.create(
                model=claude_client.model,
                max_tokens=2000,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
            )
            
            # Parse response
            content = response.content[0].text
            
            # Extract JSON from response (Claude sometimes wraps in markdown)
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]
            
            proposal_data = json.loads(content.strip())
            
            # Build RescheduleProposal from response
            constraints = []
            for c in proposal_data.get("assumed_constraints", []):
                constraints.append(ConstraintAssumption(
                    constraint_type=c.get("constraint_type", ""),
                    entity_id=c.get("entity_id", ""),
                    start_ts=c.get("start_ts"),
                    end_ts=c.get("end_ts"),
                    value=c.get("value"),
                    reason=c.get("reason", ""),
                ))
            
            actions = []
            for a in proposal_data.get("recommended_actions", []):
                actions.append(RecommendedAction(
                    priority=a.get("priority", 3),
                    action=a.get("action", ""),
                    affected_orders=a.get("affected_orders", []),
                    affected_machines=a.get("affected_machines", []),
                ))
            
            return RescheduleProposal(
                parent_run_id=proposal_data.get("parent_run_id", parent_run_id),
                reschedule_mode=proposal_data.get("reschedule_mode", "from_now"),
                reschedule_from_ts=proposal_data.get("reschedule_from_ts"),
                assumed_constraints=constraints,
                recommended_actions=actions,
                explanation=proposal_data.get("explanation", "AI-generated proposal"),
                referenced_order_ids=proposal_data.get("referenced_order_ids", []),
                referenced_machine_ids=proposal_data.get("referenced_machine_ids", []),
                referenced_op_ids=proposal_data.get("referenced_op_ids", []),
            )
            
        except Exception as e:
            logger.warning(f"Claude proposal generation failed: {e}")
            return None
    
    def _generate_proposal_rules(
        self,
        event_type: str,
        event_payload: dict[str, Any],
        scenario_meta: dict[str, Any],
    ) -> RescheduleProposal:
        """Generate proposal using rules-based logic.
        
        Args:
            event_type: Type of disruption event
            event_payload: Event payload
            scenario_meta: Scenario metadata
            
        Returns:
            RescheduleProposal (always valid - only uses known IDs)
        """
        parent_run_id = scenario_meta.get("run_id", "unknown")
        orders = scenario_meta.get("orders", [])
        machines = scenario_meta.get("machines", [])
        
        valid_order_ids = {o.get("order_id") for o in orders if o.get("order_id")}
        valid_machine_ids = {m.get("machine_id") for m in machines if m.get("machine_id")}
        
        constraints: list[ConstraintAssumption] = []
        actions: list[RecommendedAction] = []
        referenced_orders: list[str] = []
        referenced_machines: list[str] = []
        explanation = ""
        
        if event_type == "machine_down":
            machine_id = event_payload.get("machine_id", "")
            start_ts = event_payload.get("start_ts")
            end_ts = event_payload.get("end_ts")
            
            if machine_id in valid_machine_ids:
                constraints.append(ConstraintAssumption(
                    constraint_type="machine_unavailable",
                    entity_id=machine_id,
                    start_ts=start_ts,
                    end_ts=end_ts,
                    reason=event_payload.get("reason", "Machine downtime"),
                ))
                referenced_machines.append(machine_id)
                
                actions.append(RecommendedAction(
                    priority=1,
                    action=f"Reschedule operations from {machine_id} during downtime",
                    affected_machines=[machine_id],
                ))
                
                explanation = (
                    f"Machine {machine_id} is unavailable. Operations will be "
                    "rescheduled around the downtime window."
                )
        
        elif event_type == "priority_change":
            order_id = event_payload.get("order_id", "")
            new_priority = event_payload.get("new_priority")
            
            if order_id in valid_order_ids:
                if new_priority is not None:
                    constraints.append(ConstraintAssumption(
                        constraint_type="priority_override",
                        entity_id=order_id,
                        value=new_priority,
                        reason="Priority change requested",
                    ))
                
                referenced_orders.append(order_id)
                
                actions.append(RecommendedAction(
                    priority=1,
                    action=f"Expedite order {order_id} per priority change",
                    affected_orders=[order_id],
                ))
                
                explanation = (
                    f"Order {order_id} priority changed. Schedule will be "
                    "re-optimized with new priority."
                )
        
        elif event_type == "quality_issue":
            order_id = event_payload.get("order_id", "")
            hold = event_payload.get("hold_production", False)
            
            if order_id in valid_order_ids:
                if hold:
                    constraints.append(ConstraintAssumption(
                        constraint_type="order_locked",
                        entity_id=order_id,
                        reason="Production held due to quality issue",
                    ))
                
                referenced_orders.append(order_id)
                
                actions.append(RecommendedAction(
                    priority=1 if hold else 2,
                    action=f"Review quality issue for order {order_id}",
                    affected_orders=[order_id],
                ))
                
                explanation = (
                    f"Quality issue on order {order_id}. "
                    + ("Production held - " if hold else "")
                    + "Schedule adjusted."
                )
        
        elif event_type == "order_added":
            order_id = event_payload.get("order_id", "")
            
            # New order might not be in valid_order_ids yet
            referenced_orders.append(order_id)
            
            actions.append(RecommendedAction(
                priority=2,
                action=f"Integrate new order {order_id} into schedule",
                affected_orders=[order_id],
            ))
            
            explanation = (
                f"New order {order_id} added. Full reschedule to integrate."
            )
        
        else:
            # Generic disruption
            explanation = f"Disruption event ({event_type}). Reschedule recommended."
            actions.append(RecommendedAction(
                priority=3,
                action="Review schedule for disruption impact",
            ))
        
        # If no explanation set
        if not explanation:
            explanation = "Rules-based reschedule proposal generated."
        
        return RescheduleProposal(
            parent_run_id=parent_run_id,
            reschedule_mode="from_now",
            assumed_constraints=constraints,
            recommended_actions=actions,
            explanation=explanation,
            referenced_order_ids=referenced_orders,
            referenced_machine_ids=referenced_machines,
        )
    
    def save_proposal_artifact(
        self,
        child_run_dir: Path,
        proposal: RescheduleProposal,
        mode: str,
        generation_time_ms: int,
    ) -> None:
        """Save proposal artifact to child run directory.
        
        Args:
            child_run_dir: Path to child run directory
            proposal: The reschedule proposal
            mode: Generation mode (claude or rules_fallback)
            generation_time_ms: Generation time in ms
        """
        proposal_data = {
            "parent_run_id": proposal.parent_run_id,
            "reschedule_mode": proposal.reschedule_mode,
            "reschedule_from_ts": proposal.reschedule_from_ts.isoformat() if proposal.reschedule_from_ts else None,
            "assumed_constraints": [
                {
                    "constraint_type": c.constraint_type,
                    "entity_id": c.entity_id,
                    "start_ts": c.start_ts.isoformat() if c.start_ts else None,
                    "end_ts": c.end_ts.isoformat() if c.end_ts else None,
                    "value": c.value,
                    "reason": c.reason,
                }
                for c in proposal.assumed_constraints
            ],
            "recommended_actions": [
                {
                    "priority": a.priority,
                    "action": a.action,
                    "affected_orders": a.affected_orders,
                    "affected_machines": a.affected_machines,
                }
                for a in proposal.recommended_actions
            ],
            "explanation": proposal.explanation,
            "referenced_order_ids": proposal.referenced_order_ids,
            "referenced_machine_ids": proposal.referenced_machine_ids,
            "referenced_op_ids": proposal.referenced_op_ids,
            "_meta": {
                "mode": mode,
                "generation_time_ms": generation_time_ms,
                "generated_at": datetime.utcnow().isoformat(),
            },
        }
        
        proposal_path = child_run_dir / "reschedule_proposal.json"
        with open(proposal_path, "w") as f:
            json.dump(proposal_data, f, indent=2)
        
        logger.info(f"Saved proposal artifact: {proposal_path}")


def build_constraint_overrides(
    proposal: RescheduleProposal,
) -> dict[str, Any]:
    """Convert proposal constraints to scheduler constraint overrides.
    
    Args:
        proposal: The reschedule proposal
        
    Returns:
        Dict of constraint overrides for the scheduler
    """
    overrides: dict[str, Any] = {
        "machine_unavailable": [],
        "priority_overrides": [],
    }
    
    for constraint in proposal.assumed_constraints:
        if constraint.constraint_type == "machine_unavailable":
            overrides["machine_unavailable"].append({
                "machine_id": constraint.entity_id,
                "start_ts": constraint.start_ts,
                "end_ts": constraint.end_ts,
            })
        elif constraint.constraint_type == "priority_override":
            overrides["priority_overrides"].append({
                "order_id": constraint.entity_id,
                "new_priority": constraint.value,
            })
    
    return overrides
