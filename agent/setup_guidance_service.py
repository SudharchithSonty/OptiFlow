"""Setup Guidance Service - generates setup checklists for machines.

Generates per-machine setup guidance with checklists for changeovers
and first-piece checks, sourced from known parameters and KB citations.
"""

import json
import logging
import time
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

from agent.claude_client import claude_client
from agent.proposal_schemas import (
    SetupGuidance,
    MachineSetupGuidance,
    SetupChecklistItem,
)
from agent.proposal_validator import validate_setup_guidance

logger = logging.getLogger(__name__)


class SetupGuidanceError(Exception):
    """Raised when setup guidance generation fails."""
    pass


class SetupGuidanceService:
    """Service for generating setup guidance for a run/shift."""
    
    def __init__(
        self,
        run_dir: Path,
        org_id: Optional[str] = None,
    ):
        """Initialize service with run directory.
        
        Args:
            run_dir: Path to run's artifact directory
            org_id: Optional org ID for KB queries
        """
        self.run_dir = run_dir
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
        """Load a JSON artifact from the run directory."""
        filepath = self.run_dir / filename
        if not filepath.exists():
            self.errors.append(f"Missing artifact: {filename}")
            return None
        
        try:
            with open(filepath) as f:
                return json.load(f)
        except Exception as e:
            self.errors.append(f"Error loading {filename}: {e}")
            return None
    
    def generate_guidance(
        self,
        shift_start: Optional[datetime] = None,
        shift_end: Optional[datetime] = None,
        machines: Optional[list[str]] = None,
    ) -> dict[str, Any]:
        """Generate setup guidance for the run.
        
        Args:
            shift_start: Optional shift start time (filter operations)
            shift_end: Optional shift end time (filter operations)
            machines: Optional list of machine IDs to include
            
        Returns:
            Dict with guidance, mode, validation status, and errors
        """
        start_time = time.time()
        self.trace_entries = []
        self.errors = []
        
        self._log_trace("start", {"run_dir": str(self.run_dir)})
        
        # Load artifacts
        scenario_meta = self._load_artifact("scenario_meta.json") or {}
        schedule_data = self._load_artifact("schedule_optimized.json") or {}
        schedule = schedule_data.get("schedule", [])
        
        self._log_trace("artifacts_loaded", {
            "scenario_meta_found": bool(scenario_meta),
            "schedule_ops_count": len(schedule),
        })
        
        # Try Claude first
        mode = "rules_fallback"
        guidance: Optional[SetupGuidance] = None
        validation_passed = False
        
        if claude_client.is_available:
            self._log_trace("claude_attempt", {"model": claude_client.model})
            claude_start = time.time()
            
            guidance = self._generate_guidance_claude(
                scenario_meta=scenario_meta,
                schedule=schedule,
                shift_start=shift_start,
                shift_end=shift_end,
                machines=machines,
            )
            
            claude_ms = int((time.time() - claude_start) * 1000)
            
            if guidance:
                # Validate Claude's output
                is_valid, val_errors = validate_setup_guidance(
                    guidance, scenario_meta
                )
                
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
                    guidance = None
            else:
                self._log_trace("claude_failed", {}, claude_ms)
        
        # Fall back to rules
        if guidance is None:
            fallback_start = time.time()
            self._log_trace("fallback_start", {})
            
            guidance = self._generate_guidance_rules(
                scenario_meta=scenario_meta,
                schedule=schedule,
                shift_start=shift_start,
                shift_end=shift_end,
                machines=machines,
            )
            
            # Validate (should always pass for rules-based)
            is_valid, val_errors = validate_setup_guidance(
                guidance, scenario_meta
            )
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
            "guidance": guidance,
            "mode": mode,
            "validation_passed": validation_passed,
            "errors": self.errors,
            "trace": self.trace_entries,
            "generation_time_ms": total_ms,
        }
    
    def _generate_guidance_claude(
        self,
        scenario_meta: dict[str, Any],
        schedule: list[dict],
        shift_start: Optional[datetime],
        shift_end: Optional[datetime],
        machines: Optional[list[str]],
    ) -> Optional[SetupGuidance]:
        """Generate guidance using Claude.
        
        Returns:
            SetupGuidance or None if generation fails
        """
        # Extract valid IDs
        orders = scenario_meta.get("orders", [])
        machines_list = scenario_meta.get("machines", [])
        valid_machine_ids = [m.get("machine_id") for m in machines_list if m.get("machine_id")]
        valid_families = set()
        for order in orders:
            if order.get("product_family"):
                valid_families.add(order["product_family"])
            if order.get("family_id"):
                valid_families.add(order["family_id"])
        
        run_id = scenario_meta.get("run_id", "unknown")
        
        # Build prompt
        system_prompt = """You are an AI assistant for manufacturing setup guidance.
Generate a setup guidance checklist in JSON format for machine changeovers.

IMPORTANT CONSTRAINTS:
- Only use machine_ids and families that exist in the scenario
- Do not invent specific numeric parameters (RPM, pressure, etc.) unless they come from known data
- For numeric parameters, use placeholder text like "per SOP" or "per process sheet"
- Focus on general changeover steps and first-piece check reminders
- Always include the safety header

Output must be valid JSON matching this structure:
{
    "run_id": "string",
    "generated_at": "ISO datetime",
    "shift_start": "ISO datetime or null",
    "shift_end": "ISO datetime or null",
    "safety_header": "IMPORTANT: This guidance supplements...",
    "machines": [
        {
            "machine_id": "string",
            "from_family": "string or null",
            "to_family": "string",
            "estimated_setup_minutes": number or null,
            "checklist": [
                {
                    "step_number": 1,
                    "category": "tooling|fixture|material|first_piece|safety",
                    "instruction": "description",
                    "is_safety_critical": false,
                    "source": "artifact_field or null"
                }
            ],
            "first_piece_checks": [
                {
                    "step_number": 1,
                    "category": "first_piece",
                    "instruction": "description",
                    "is_safety_critical": false
                }
            ]
        }
    ],
    "referenced_machine_ids": ["list of machine IDs"],
    "limitations": ["list of limitations"]
}"""

        user_prompt = f"""Generate setup guidance for the following schedule.

Run ID: {run_id}
Valid Machine IDs: {valid_machine_ids}
Valid Families: {list(valid_families)}

Schedule operations (first 20):
{json.dumps(schedule[:20], default=str)}

Generate guidance for machine changeovers observed in the schedule."""

        try:
            response = claude_client.client.messages.create(
                model=claude_client.model,
                max_tokens=3000,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
            )
            
            content = response.content[0].text
            
            # Extract JSON
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]
            
            data = json.loads(content.strip())
            
            # Build SetupGuidance
            machines_guidance = []
            for mg in data.get("machines", []):
                checklist = [
                    SetupChecklistItem(
                        step_number=item.get("step_number", i + 1),
                        category=item.get("category", "tooling"),
                        instruction=item.get("instruction", ""),
                        is_safety_critical=item.get("is_safety_critical", False),
                        source=item.get("source"),
                    )
                    for i, item in enumerate(mg.get("checklist", []))
                ]
                
                first_piece = [
                    SetupChecklistItem(
                        step_number=item.get("step_number", i + 1),
                        category="first_piece",
                        instruction=item.get("instruction", ""),
                        is_safety_critical=item.get("is_safety_critical", False),
                    )
                    for i, item in enumerate(mg.get("first_piece_checks", []))
                ]
                
                machines_guidance.append(MachineSetupGuidance(
                    machine_id=mg.get("machine_id", ""),
                    from_family=mg.get("from_family"),
                    to_family=mg.get("to_family", ""),
                    estimated_setup_minutes=mg.get("estimated_setup_minutes"),
                    checklist=checklist,
                    first_piece_checks=first_piece,
                ))
            
            return SetupGuidance(
                run_id=run_id,
                generated_at=datetime.utcnow(),
                shift_start=shift_start,
                shift_end=shift_end,
                machines=machines_guidance,
                referenced_machine_ids=data.get("referenced_machine_ids", []),
                limitations=data.get("limitations", [
                    "Generated by AI - verify against SOPs",
                ]),
            )
            
        except Exception as e:
            logger.warning(f"Claude guidance generation failed: {e}")
            return None
    
    def _generate_guidance_rules(
        self,
        scenario_meta: dict[str, Any],
        schedule: list[dict],
        shift_start: Optional[datetime],
        shift_end: Optional[datetime],
        machines: Optional[list[str]],
    ) -> SetupGuidance:
        """Generate guidance using rules-based logic.
        
        Always uses valid IDs from scenario_meta.
        """
        run_id = scenario_meta.get("run_id", "unknown")
        machines_list = scenario_meta.get("machines", [])
        valid_machine_ids = {m.get("machine_id") for m in machines_list if m.get("machine_id")}
        
        # Extract families from orders
        orders = scenario_meta.get("orders", [])
        valid_families: set[str] = set()
        for order in orders:
            if order.get("product_family"):
                valid_families.add(order["product_family"])
            if order.get("family_id"):
                valid_families.add(order["family_id"])
        
        # Find changeovers from schedule
        changeovers: dict[str, list[tuple[Optional[str], str]]] = {}
        
        # Group operations by machine and sort by start time
        ops_by_machine: dict[str, list[dict]] = {}
        for op in schedule:
            mid = op.get("machine_id")
            if mid and mid in valid_machine_ids:
                if mid not in ops_by_machine:
                    ops_by_machine[mid] = []
                ops_by_machine[mid].append(op)
        
        for mid, ops in ops_by_machine.items():
            sorted_ops = sorted(ops, key=lambda x: x.get("start_min", 0))
            prev_family = None
            
            for op in sorted_ops:
                family = op.get("family_id") or op.get("product_family")
                if family and family in valid_families:
                    if prev_family is not None and family != prev_family:
                        # Changeover detected
                        if mid not in changeovers:
                            changeovers[mid] = []
                        changeovers[mid].append((prev_family, family))
                    prev_family = family
        
        # Build guidance for machines with changeovers
        machines_guidance: list[MachineSetupGuidance] = []
        referenced_machines: list[str] = []
        
        if machines:
            target_machines = [m for m in machines if m in valid_machine_ids]
        else:
            target_machines = list(changeovers.keys())
        
        for mid in target_machines:
            if mid not in valid_machine_ids:
                continue
            
            referenced_machines.append(mid)
            
            changeover_list = changeovers.get(mid, [])
            
            if changeover_list:
                from_fam, to_fam = changeover_list[0]  # First changeover
            else:
                from_fam = None
                to_fam = list(valid_families)[0] if valid_families else "UNKNOWN"
            
            # Build checklist (generic, no made-up numbers)
            checklist = [
                SetupChecklistItem(
                    step_number=1,
                    category="safety",
                    instruction=f"Ensure machine {mid} is in safe state before changeover",
                    is_safety_critical=True,
                    source="artifact_field",
                ),
                SetupChecklistItem(
                    step_number=2,
                    category="tooling",
                    instruction=f"Verify correct tooling for family {to_fam} per process sheet",
                    source="artifact_field",
                ),
                SetupChecklistItem(
                    step_number=3,
                    category="fixture",
                    instruction=f"Install fixture for family {to_fam} - check alignment",
                    source="artifact_field",
                ),
                SetupChecklistItem(
                    step_number=4,
                    category="material",
                    instruction="Verify material specification matches work order",
                    source="artifact_field",
                ),
            ]
            
            first_piece = [
                SetupChecklistItem(
                    step_number=1,
                    category="first_piece",
                    instruction="Run first piece and inspect per quality plan",
                ),
                SetupChecklistItem(
                    step_number=2,
                    category="first_piece",
                    instruction="Verify dimensions within tolerance",
                ),
                SetupChecklistItem(
                    step_number=3,
                    category="first_piece",
                    instruction="Document first-piece inspection results",
                ),
            ]
            
            machines_guidance.append(MachineSetupGuidance(
                machine_id=mid,
                from_family=from_fam,
                to_family=to_fam,
                estimated_setup_minutes=None,  # Don't guess
                checklist=checklist,
                first_piece_checks=first_piece,
            ))
        
        return SetupGuidance(
            run_id=run_id,
            generated_at=datetime.utcnow(),
            shift_start=shift_start,
            shift_end=shift_end,
            machines=machines_guidance,
            referenced_machine_ids=referenced_machines,
            limitations=[
                "Generated by rules-based system (Claude unavailable)",
                "Numeric parameters not included - refer to SOPs",
                "Verify all procedures against current process documentation",
            ],
        )
    
    def save_guidance_artifacts(
        self,
        guidance: SetupGuidance,
        mode: str,
        generation_time_ms: int,
    ) -> None:
        """Save guidance artifacts to run directory.
        
        Args:
            guidance: The setup guidance
            mode: Generation mode
            generation_time_ms: Generation time
        """
        # Save JSON
        guidance_data = {
            "run_id": guidance.run_id,
            "generated_at": guidance.generated_at.isoformat(),
            "shift_start": guidance.shift_start.isoformat() if guidance.shift_start else None,
            "shift_end": guidance.shift_end.isoformat() if guidance.shift_end else None,
            "safety_header": guidance.safety_header,
            "machines": [
                {
                    "machine_id": mg.machine_id,
                    "from_family": mg.from_family,
                    "to_family": mg.to_family,
                    "estimated_setup_minutes": mg.estimated_setup_minutes,
                    "checklist": [
                        {
                            "step_number": item.step_number,
                            "category": item.category,
                            "instruction": item.instruction,
                            "is_safety_critical": item.is_safety_critical,
                            "source": item.source,
                        }
                        for item in mg.checklist
                    ],
                    "first_piece_checks": [
                        {
                            "step_number": item.step_number,
                            "category": item.category,
                            "instruction": item.instruction,
                            "is_safety_critical": item.is_safety_critical,
                        }
                        for item in mg.first_piece_checks
                    ],
                }
                for mg in guidance.machines
            ],
            "referenced_machine_ids": guidance.referenced_machine_ids,
            "limitations": guidance.limitations,
            "_meta": {
                "mode": mode,
                "generation_time_ms": generation_time_ms,
            },
        }
        
        json_path = self.run_dir / "setup_guidance.json"
        with open(json_path, "w") as f:
            json.dump(guidance_data, f, indent=2)
        
        # Save markdown version
        md_content = self._render_guidance_markdown(guidance, mode)
        md_path = self.run_dir / "setup_guidance.md"
        with open(md_path, "w") as f:
            f.write(md_content)
        
        logger.info(f"Saved setup guidance artifacts to {self.run_dir}")
    
    def _render_guidance_markdown(
        self,
        guidance: SetupGuidance,
        mode: str,
    ) -> str:
        """Render guidance as markdown."""
        lines = ["# Setup Guidance\n"]
        
        # Safety header
        lines.append("## IMPORTANT SAFETY NOTICE\n")
        lines.append(f"_{guidance.safety_header}_\n")
        lines.append("")
        
        # Shift info
        if guidance.shift_start or guidance.shift_end:
            lines.append("## Shift Information\n")
            if guidance.shift_start:
                lines.append(f"- **Start:** {guidance.shift_start.isoformat()}")
            if guidance.shift_end:
                lines.append(f"- **End:** {guidance.shift_end.isoformat()}")
            lines.append("")
        
        # Per-machine guidance
        for mg in guidance.machines:
            lines.append(f"## Machine: {mg.machine_id}\n")
            
            if mg.from_family:
                lines.append(f"**Changeover:** {mg.from_family} -> {mg.to_family}\n")
            else:
                lines.append(f"**Setup for:** {mg.to_family}\n")
            
            if mg.estimated_setup_minutes:
                lines.append(f"**Estimated time:** {mg.estimated_setup_minutes} minutes\n")
            
            lines.append("")
            
            # Checklist
            lines.append("### Setup Checklist\n")
            for item in mg.checklist:
                safety_mark = "[SAFETY] " if item.is_safety_critical else ""
                lines.append(f"{item.step_number}. {safety_mark}**{item.category.title()}:** {item.instruction}")
            lines.append("")
            
            # First piece checks
            if mg.first_piece_checks:
                lines.append("### First Piece Checks\n")
                for item in mg.first_piece_checks:
                    lines.append(f"{item.step_number}. {item.instruction}")
                lines.append("")
        
        # Limitations
        if guidance.limitations:
            lines.append("## Limitations\n")
            for lim in guidance.limitations:
                lines.append(f"- {lim}")
            lines.append("")
        
        # Footer
        lines.append("---\n")
        lines.append(f"*Generated by: {mode} | Run: {guidance.run_id}*\n")
        
        return "\n".join(lines)
