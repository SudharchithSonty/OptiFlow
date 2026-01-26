"""Tests for agent module - validator and fallback logic.

TDD: Tests define the agent contract.
"""

from datetime import datetime, timedelta

import pytest

from agent.validator import BriefValidator, validate_operation_ids
from agent.fallback import (
    generate_rules_brief,
    answer_why_question_rules,
    _calculate_kpi_deltas,
)
from agent.proposal_schemas import (
    MachineDownPayload,
    PriorityChangePayload,
    OrderAddedPayload,
    QualityIssuePayload,
    RescheduleProposal,
    ConstraintAssumption,
    RecommendedAction,
    ImpactSummary,
    SetupGuidance,
    MachineSetupGuidance,
    SetupChecklistItem,
)
from agent.proposal_validator import (
    ProposalValidator,
    SetupGuidanceValidator,
    validate_proposal,
    validate_setup_guidance,
)


class TestBriefValidator:
    """Test suite for brief validation."""
    
    @pytest.fixture
    def validator(self):
        """Create a validator with test data."""
        return BriefValidator(
            order_ids={"ORD001", "ORD002", "ORD003"},
            machine_ids={"M01", "M02", "M03"},
            op_ids={"OP001", "OP002", "OP003"},
            kpis_baseline={"makespan": 1000, "on_time_delivery_pct": 85},
            kpis_optimized={"makespan": 800, "on_time_delivery_pct": 95},
        )
    
    def test_valid_brief_passes(self, validator) -> None:
        """A valid brief should pass validation."""
        brief = {
            "recommendations": [
                {
                    "related_orders": ["ORD001", "ORD002"],
                    "related_machines": ["M01"],
                }
            ],
            "kpi_deltas": [
                {
                    "metric": "makespan",
                    "baseline_value": 1000,
                    "optimized_value": 800,
                }
            ],
        }
        
        assert validator.validate_brief(brief) is True
        assert len(validator.errors) == 0
    
    def test_unknown_order_id_fails(self, validator) -> None:
        """Unknown order IDs should fail validation."""
        brief = {
            "recommendations": [
                {"related_orders": ["ORD999"], "related_machines": []}
            ],
            "kpi_deltas": [],
        }
        
        assert validator.validate_brief(brief) is False
        assert any("ORD999" in err for err in validator.errors)
    
    def test_unknown_machine_id_fails(self, validator) -> None:
        """Unknown machine IDs should fail validation."""
        brief = {
            "recommendations": [
                {"related_orders": [], "related_machines": ["M99"]}
            ],
            "kpi_deltas": [],
        }
        
        assert validator.validate_brief(brief) is False
        assert any("M99" in err for err in validator.errors)
    
    def test_kpi_value_mismatch_fails(self, validator) -> None:
        """KPI values that don't match should fail."""
        brief = {
            "recommendations": [],
            "kpi_deltas": [
                {
                    "metric": "makespan",
                    "baseline_value": 2000,  # Wrong value
                    "optimized_value": 800,
                }
            ],
        }
        
        assert validator.validate_brief(brief) is False
        assert any("mismatch" in err for err in validator.errors)


class TestOperationIdValidation:
    """Test operation ID validation utility."""
    
    def test_all_valid_returns_empty(self) -> None:
        """All valid IDs should return empty list."""
        valid = {"OP1", "OP2", "OP3"}
        to_check = ["OP1", "OP2"]
        
        result = validate_operation_ids(to_check, valid)
        assert result == []
    
    def test_invalid_ids_returned(self) -> None:
        """Invalid IDs should be returned."""
        valid = {"OP1", "OP2"}
        to_check = ["OP1", "OP99", "OP100"]
        
        result = validate_operation_ids(to_check, valid)
        assert "OP99" in result
        assert "OP100" in result
        assert "OP1" not in result


class TestKPIDeltas:
    """Test KPI delta calculation."""
    
    def test_makespan_improvement(self) -> None:
        """Lower makespan should show positive improvement."""
        baseline = {"makespan": 1000}
        optimized = {"makespan": 800}
        
        deltas = _calculate_kpi_deltas(baseline, optimized)
        makespan_delta = next(d for d in deltas if d["metric"] == "makespan")
        
        assert makespan_delta["improvement_pct"] == 20.0
        assert makespan_delta["is_improvement"] is True
    
    def test_otd_improvement(self) -> None:
        """Higher OTD should show positive improvement."""
        baseline = {"on_time_delivery_pct": 80}
        optimized = {"on_time_delivery_pct": 95}
        
        deltas = _calculate_kpi_deltas(baseline, optimized)
        otd_delta = next(d for d in deltas if d["metric"] == "on_time_delivery_pct")
        
        assert otd_delta["improvement_pct"] > 0
        assert otd_delta["is_improvement"] is True


class TestRulesBriefGeneration:
    """Test rules-based brief generation."""
    
    @pytest.fixture
    def sample_data(self):
        """Create sample data for brief generation."""
        return {
            "kpis_baseline": {
                "makespan": 1200,
                "on_time_delivery_pct": 75,
                "machine_utilization_pct": 60,
                "total_setup_time": 120,
                "family_switches": 10,
            },
            "kpis_optimized": {
                "makespan": 900,
                "on_time_delivery_pct": 90,
                "machine_utilization_pct": 75,
                "total_setup_time": 80,
                "family_switches": 5,
            },
            "schedule_baseline": [],
            "schedule_optimized": [
                {"op_id": "OP1", "machine_id": "M03", "order_id": "ORD1"},
            ],
            "scenario_meta": {
                "num_orders": 10,
                "num_operations": 50,
                "num_machines": 5,
                "orders": [{"order_id": "ORD1"}],
                "machines": [{"machine_id": "M03"}],
            },
        }
    
    def test_generates_summary(self, sample_data) -> None:
        """Brief should include a summary."""
        brief = generate_rules_brief(**sample_data)
        
        assert "summary" in brief
        assert len(brief["summary"]) > 0
    
    def test_generates_kpi_deltas(self, sample_data) -> None:
        """Brief should include KPI deltas."""
        brief = generate_rules_brief(**sample_data)
        
        assert "kpi_deltas" in brief
        assert len(brief["kpi_deltas"]) > 0
    
    def test_generates_recommendations(self, sample_data) -> None:
        """Brief should include recommendations."""
        brief = generate_rules_brief(**sample_data)
        
        assert "recommendations" in brief
        assert len(brief["recommendations"]) > 0
    
    def test_includes_limitations(self, sample_data) -> None:
        """Brief should include limitations notice."""
        brief = generate_rules_brief(**sample_data)
        
        assert "limitations" in brief
        assert any("rules-based" in lim.lower() for lim in brief["limitations"])


class TestWhyQuestionRules:
    """Test rules-based why question answering."""
    
    def test_lateness_question(self) -> None:
        """Questions about lateness should get relevant answer."""
        answer = answer_why_question_rules(
            "Why is order ORD1 late?",
            [{"op_id": "OP1", "is_late": True}],
            {"orders": [{"order_id": "ORD1"}]},
        )
        
        assert "answer" in answer
        assert "evidence" in answer
    
    def test_setup_question(self) -> None:
        """Questions about setup should get relevant answer."""
        answer = answer_why_question_rules(
            "Why are there so many setup changes?",
            [{"op_id": "OP1", "machine_id": "M03"}],
            {},
        )
        
        assert "answer" in answer
        assert "setup" in answer["answer"].lower() or "changeover" in answer["answer"].lower()
    
    def test_bottleneck_question(self) -> None:
        """Questions about bottleneck should mention M03."""
        answer = answer_why_question_rules(
            "What is causing the bottleneck?",
            [{"op_id": "OP1", "machine_id": "M03", "duration_min": 100}],
            {},
        )
        
        assert "answer" in answer
        assert "m03" in answer["answer"].lower()


# =============================================================================
# Event Payload Schema Tests
# =============================================================================

class TestMachineDownPayload:
    """Tests for MachineDownPayload schema."""
    
    def test_valid_payload(self) -> None:
        """Valid payload should parse correctly."""
        payload = MachineDownPayload(
            machine_id="M03",
            start_ts=datetime.now(),
            end_ts=datetime.now() + timedelta(hours=2),
            reason="Maintenance",
        )
        assert payload.machine_id == "M03"
    
    def test_end_before_start_fails(self) -> None:
        """End time before start time should fail."""
        with pytest.raises(ValueError, match="end_ts must be after start_ts"):
            MachineDownPayload(
                machine_id="M03",
                start_ts=datetime.now(),
                end_ts=datetime.now() - timedelta(hours=1),
            )
    
    def test_no_end_ts_allowed(self) -> None:
        """Missing end_ts (unknown) should be allowed."""
        payload = MachineDownPayload(
            machine_id="M03",
            start_ts=datetime.now(),
        )
        assert payload.end_ts is None


class TestQualityIssuePayload:
    """Tests for QualityIssuePayload schema."""
    
    def test_valid_severity(self) -> None:
        """Valid severity values should work."""
        for severity in ["minor", "major", "critical"]:
            payload = QualityIssuePayload(
                order_id="ORD001",
                severity=severity,
            )
            assert payload.severity == severity
    
    def test_invalid_severity_fails(self) -> None:
        """Invalid severity should fail."""
        with pytest.raises(ValueError, match="severity must be one of"):
            QualityIssuePayload(
                order_id="ORD001",
                severity="invalid",
            )


class TestOrderAddedPayload:
    """Tests for OrderAddedPayload schema."""
    
    def test_valid_payload(self) -> None:
        """Valid payload should parse correctly."""
        payload = OrderAddedPayload(
            order_id="ORD100",
            product_family="FAM_A",
            quantity=50,
            due_date=datetime.now() + timedelta(days=5),
        )
        assert payload.quantity == 50
        assert payload.priority == 5  # default
    
    def test_invalid_quantity_fails(self) -> None:
        """Zero quantity should fail."""
        with pytest.raises(ValueError):
            OrderAddedPayload(
                order_id="ORD100",
                product_family="FAM_A",
                quantity=0,
                due_date=datetime.now(),
            )


# =============================================================================
# RescheduleProposal Schema Tests
# =============================================================================

class TestRescheduleProposal:
    """Tests for RescheduleProposal schema."""
    
    def test_valid_proposal(self) -> None:
        """Valid proposal should parse correctly."""
        proposal = RescheduleProposal(
            parent_run_id="run_2024_01_01",
            reschedule_mode="from_now",
            explanation="Rescheduling due to machine breakdown",
        )
        assert proposal.parent_run_id == "run_2024_01_01"
        assert len(proposal.assumed_constraints) == 0
    
    def test_invalid_mode_fails(self) -> None:
        """Invalid reschedule mode should fail."""
        with pytest.raises(ValueError, match="reschedule_mode must be one of"):
            RescheduleProposal(
                parent_run_id="run_123",
                reschedule_mode="invalid_mode",
                explanation="Test explanation here",
            )
    
    def test_with_constraints(self) -> None:
        """Proposal with constraints should work."""
        proposal = RescheduleProposal(
            parent_run_id="run_123",
            explanation="Rescheduling due to M03 downtime for maintenance",
            assumed_constraints=[
                ConstraintAssumption(
                    constraint_type="machine_unavailable",
                    entity_id="M03",
                    start_ts=datetime.now(),
                    end_ts=datetime.now() + timedelta(hours=4),
                    reason="Scheduled maintenance",
                )
            ],
        )
        assert len(proposal.assumed_constraints) == 1


# =============================================================================
# ProposalValidator Tests
# =============================================================================

class TestProposalValidator:
    """Tests for RescheduleProposal validation."""
    
    @pytest.fixture
    def validator(self):
        """Create validator with test data."""
        return ProposalValidator(
            valid_order_ids={"ORD001", "ORD002", "ORD003"},
            valid_machine_ids={"M01", "M02", "M03"},
            valid_op_ids={"OP001", "OP002", "OP003"},
        )
    
    def test_valid_proposal_passes(self, validator) -> None:
        """Valid proposal should pass validation."""
        proposal = RescheduleProposal(
            parent_run_id="run_123",
            explanation="Valid reschedule due to downtime",
            referenced_order_ids=["ORD001", "ORD002"],
            referenced_machine_ids=["M01", "M03"],
        )
        
        assert validator.validate(proposal) is True
        assert len(validator.errors) == 0
    
    def test_unknown_order_id_fails(self, validator) -> None:
        """Proposal with unknown order ID should fail."""
        proposal = RescheduleProposal(
            parent_run_id="run_123",
            explanation="Reschedule with invalid order reference",
            referenced_order_ids=["ORD001", "ORD999"],
        )
        
        assert validator.validate(proposal) is False
        assert any("ORD999" in err for err in validator.errors)
    
    def test_unknown_machine_id_fails(self, validator) -> None:
        """Proposal with unknown machine ID should fail."""
        proposal = RescheduleProposal(
            parent_run_id="run_123",
            explanation="Reschedule with invalid machine reference",
            referenced_machine_ids=["M99"],
        )
        
        assert validator.validate(proposal) is False
        assert any("M99" in err for err in validator.errors)
    
    def test_unknown_id_in_constraint_fails(self, validator) -> None:
        """Unknown ID in constraint should fail."""
        proposal = RescheduleProposal(
            parent_run_id="run_123",
            explanation="Reschedule with invalid constraint entity",
            assumed_constraints=[
                ConstraintAssumption(
                    constraint_type="machine_unavailable",
                    entity_id="M99",
                    reason="Unknown machine",
                )
            ],
        )
        
        assert validator.validate(proposal) is False
        assert any("M99" in err for err in validator.errors)
    
    def test_unknown_id_in_action_fails(self, validator) -> None:
        """Unknown ID in recommended action should fail."""
        proposal = RescheduleProposal(
            parent_run_id="run_123",
            explanation="Reschedule with invalid action reference",
            recommended_actions=[
                RecommendedAction(
                    priority=1,
                    action="Expedite order ORD999 to meet deadline",
                    affected_orders=["ORD999"],
                )
            ],
        )
        
        assert validator.validate(proposal) is False
        assert any("ORD999" in err for err in validator.errors)


class TestValidateProposalConvenience:
    """Tests for the convenience validate_proposal function."""
    
    def test_validates_against_scenario_meta(self) -> None:
        """Should extract IDs from scenario_meta and validate."""
        scenario_meta = {
            "orders": [
                {"order_id": "ORD001"},
                {"order_id": "ORD002"},
            ],
            "machines": [
                {"machine_id": "M01"},
                {"machine_id": "M02"},
            ],
        }
        
        proposal = RescheduleProposal(
            parent_run_id="run_123",
            explanation="Valid proposal against scenario metadata",
            referenced_order_ids=["ORD001"],
            referenced_machine_ids=["M01"],
        )
        
        is_valid, errors = validate_proposal(proposal, scenario_meta)
        assert is_valid is True
        assert len(errors) == 0
    
    def test_fails_with_unknown_ids(self) -> None:
        """Should fail when IDs don't exist in scenario_meta."""
        scenario_meta = {
            "orders": [{"order_id": "ORD001"}],
            "machines": [{"machine_id": "M01"}],
        }
        
        proposal = RescheduleProposal(
            parent_run_id="run_123",
            explanation="Invalid proposal with unknown references",
            referenced_order_ids=["ORD999"],
        )
        
        is_valid, errors = validate_proposal(proposal, scenario_meta)
        assert is_valid is False
        assert any("ORD999" in err for err in errors)


# =============================================================================
# SetupGuidance Schema Tests
# =============================================================================

class TestSetupGuidance:
    """Tests for SetupGuidance schema."""
    
    def test_valid_guidance(self) -> None:
        """Valid guidance should parse correctly."""
        guidance = SetupGuidance(
            run_id="run_123",
            generated_at=datetime.now(),
            machines=[
                MachineSetupGuidance(
                    machine_id="M03",
                    to_family="FAM_A",
                    checklist=[
                        SetupChecklistItem(
                            step_number=1,
                            category="tooling",
                            instruction="Install fixture A for family FAM_A",
                        )
                    ],
                )
            ],
        )
        assert len(guidance.machines) == 1
    
    def test_safety_header_default(self) -> None:
        """Safety header should have default value."""
        guidance = SetupGuidance(
            run_id="run_123",
            generated_at=datetime.now(),
        )
        assert "SOP" in guidance.safety_header
        assert "safety" in guidance.safety_header.lower()


# =============================================================================
# SetupGuidanceValidator Tests
# =============================================================================

class TestSetupGuidanceValidator:
    """Tests for SetupGuidance validation."""
    
    @pytest.fixture
    def validator(self):
        """Create validator with test data."""
        return SetupGuidanceValidator(
            valid_order_ids={"ORD001", "ORD002"},
            valid_machine_ids={"M01", "M02", "M03"},
            valid_op_ids={"OP001", "OP002"},
            valid_families={"FAM_A", "FAM_B"},
            valid_kb_doc_ids={"DOC001", "DOC002"},
        )
    
    def test_valid_guidance_passes(self, validator) -> None:
        """Valid guidance should pass validation."""
        guidance = SetupGuidance(
            run_id="run_123",
            generated_at=datetime.now(),
            referenced_machine_ids=["M01", "M03"],
            machines=[
                MachineSetupGuidance(
                    machine_id="M03",
                    from_family="FAM_A",
                    to_family="FAM_B",
                    checklist=[
                        SetupChecklistItem(
                            step_number=1,
                            category="tooling",
                            instruction="Change fixture from A to B",
                        )
                    ],
                )
            ],
        )
        
        assert validator.validate(guidance) is True
        assert len(validator.errors) == 0
    
    def test_unknown_machine_fails(self, validator) -> None:
        """Guidance with unknown machine should fail."""
        guidance = SetupGuidance(
            run_id="run_123",
            generated_at=datetime.now(),
            machines=[
                MachineSetupGuidance(
                    machine_id="M99",
                    to_family="FAM_A",
                )
            ],
        )
        
        assert validator.validate(guidance) is False
        assert any("M99" in err for err in validator.errors)
    
    def test_unknown_family_fails(self, validator) -> None:
        """Guidance with unknown family should fail."""
        guidance = SetupGuidance(
            run_id="run_123",
            generated_at=datetime.now(),
            machines=[
                MachineSetupGuidance(
                    machine_id="M01",
                    to_family="FAM_UNKNOWN",
                )
            ],
        )
        
        assert validator.validate(guidance) is False
        assert any("FAM_UNKNOWN" in err for err in validator.errors)
    
    def test_numeric_param_without_source_fails(self, validator) -> None:
        """Numeric parameters without source should fail."""
        guidance = SetupGuidance(
            run_id="run_123",
            generated_at=datetime.now(),
            machines=[
                MachineSetupGuidance(
                    machine_id="M01",
                    to_family="FAM_A",
                    checklist=[
                        SetupChecklistItem(
                            step_number=1,
                            category="tooling",
                            instruction="Set spindle speed to 1500 RPM",
                            # No source or kb_document_id
                        )
                    ],
                )
            ],
        )
        
        assert validator.validate(guidance) is False
        assert any("without source" in err for err in validator.errors)
    
    def test_numeric_param_with_source_passes(self, validator) -> None:
        """Numeric parameters with source should pass."""
        guidance = SetupGuidance(
            run_id="run_123",
            generated_at=datetime.now(),
            machines=[
                MachineSetupGuidance(
                    machine_id="M01",
                    to_family="FAM_A",
                    checklist=[
                        SetupChecklistItem(
                            step_number=1,
                            category="tooling",
                            instruction="Set spindle speed to 1500 RPM",
                            source="artifact_field",
                        )
                    ],
                )
            ],
        )
        
        assert validator.validate(guidance) is True
    
    def test_invalid_kb_doc_id_fails(self, validator) -> None:
        """Invalid KB document ID should fail."""
        guidance = SetupGuidance(
            run_id="run_123",
            generated_at=datetime.now(),
            machines=[
                MachineSetupGuidance(
                    machine_id="M01",
                    to_family="FAM_A",
                    checklist=[
                        SetupChecklistItem(
                            step_number=1,
                            category="tooling",
                            instruction="Follow procedure for FAM_A setup",
                            kb_document_id="DOC999",
                        )
                    ],
                )
            ],
        )
        
        assert validator.validate(guidance) is False
        assert any("DOC999" in err for err in validator.errors)
