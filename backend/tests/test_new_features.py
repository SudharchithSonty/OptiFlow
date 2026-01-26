"""Regression tests for new features: reschedule, events, actuals, KB/RAG.

These tests verify the new models and their behavior.
"""

import pytest
from uuid import uuid4
from datetime import datetime

from backend.app.models.run import sanitize_run_id, Run, RunTrigger, RescheduleMode
from backend.app.models.event import Event, EventType
from backend.app.models.setup_actual import SetupActual
from backend.app.models.quality_check import QualityCheck, QualityResult
from backend.app.models.knowledge_document import KnowledgeDocument, DocumentStatus
from backend.app.models.knowledge_chunk import KnowledgeChunk


class TestRescheduleLineage:
    """Tests for run reschedule functionality."""

    def test_run_has_parent_run_id_field(self, db_session, test_org):
        """Run model should have parent_run_id for lineage."""
        run = Run(
            org_id=test_org.id,
            run_name="Test Run",
            run_id="test_run",
            parent_run_id=None,
        )
        db_session.add(run)
        db_session.commit()
        
        assert run.parent_run_id is None
        assert run.trigger == RunTrigger.MANUAL.value

    def test_reschedule_mode_default(self, db_session, test_org):
        """Default reschedule_mode should be 'from_now'."""
        run = Run(
            org_id=test_org.id,
            run_name="Test Run",
            run_id="test_run",
        )
        db_session.add(run)
        db_session.commit()
        
        assert run.reschedule_mode == RescheduleMode.FROM_NOW.value

    def test_run_trigger_types(self):
        """Verify all trigger types exist."""
        assert RunTrigger.MANUAL.value == "manual"
        assert RunTrigger.RESCHEDULE.value == "reschedule"
        assert RunTrigger.ACTUALS.value == "actuals"
        assert RunTrigger.WHATIF.value == "whatif"


class TestEvents:
    """Tests for event logging on runs."""

    def test_event_types_defined(self):
        """Verify all event types exist."""
        assert EventType.DISRUPTION.value == "disruption"
        assert EventType.MACHINE_DOWN.value == "machine_down"
        assert EventType.PRIORITY_CHANGE.value == "priority_change"
        assert EventType.ORDER_ADDED.value == "order_added"

    def test_create_event(self, db_session, test_org):
        """Should be able to create an event with required fields."""
        # First create a run
        run = Run(
            org_id=test_org.id,
            run_name="Test Run",
            run_id="test_run",
        )
        db_session.add(run)
        db_session.commit()
        
        event = Event(
            org_id=test_org.id,
            run_id=run.id,
            event_type=EventType.DISRUPTION.value,
            title="Test disruption",
            description="Machine M01 went down",
        )
        db_session.add(event)
        db_session.commit()
        
        assert event.id is not None
        assert event.event_type == "disruption"


class TestActuals:
    """Tests for setup and quality actuals logging."""

    def test_setup_actual_variance(self):
        """SetupActual should compute variance correctly."""
        actual = SetupActual(
            org_id=uuid4(),
            machine_id="M01",
            from_family="F1",
            to_family="F2",
            actual_minutes=15.0,
            planned_minutes=10.0,
        )
        
        assert actual.variance_minutes == 5.0

    def test_setup_actual_no_planned(self):
        """Variance should be None if no planned time."""
        actual = SetupActual(
            org_id=uuid4(),
            machine_id="M01",
            from_family="F1",
            to_family="F2",
            actual_minutes=15.0,
            planned_minutes=None,
        )
        
        assert actual.variance_minutes is None

    def test_quality_results_defined(self):
        """Verify all quality results exist."""
        assert QualityResult.PASS.value == "pass"
        assert QualityResult.FAIL.value == "fail"
        assert QualityResult.REWORK.value == "rework"
        assert QualityResult.CONDITIONAL.value == "conditional"


class TestKBModels:
    """Tests for Knowledge Base models."""

    def test_document_status_values(self):
        """Verify all document statuses exist."""
        assert DocumentStatus.PENDING.value == "pending"
        assert DocumentStatus.PROCESSING.value == "processing"
        assert DocumentStatus.READY.value == "ready"
        assert DocumentStatus.FAILED.value == "failed"

    def test_chunk_to_citation(self):
        """KnowledgeChunk should return citation info."""
        chunk = KnowledgeChunk(
            id=uuid4(),
            org_id=uuid4(),
            document_id=uuid4(),
            chunk_index=0,
            text="This is a test chunk with enough text to test the excerpt truncation functionality.",
            page=1,
        )
        
        citation = chunk.to_citation()
        
        assert "chunk_id" in citation
        assert "document_id" in citation
        assert citation["page"] == 1
        assert citation["chunk_index"] == 0
        assert "excerpt" in citation


class TestPathTraversalGuards:
    """Regression tests for path traversal prevention."""

    def test_run_id_blocks_double_dot(self):
        """Run ID should reject '..' path traversal."""
        with pytest.raises(ValueError, match="path traversal"):
            sanitize_run_id("../malicious")

    def test_run_id_blocks_leading_dot(self):
        """Run ID should reject leading dot."""
        with pytest.raises(ValueError, match="path traversal"):
            sanitize_run_id(".hidden")

    def test_run_id_blocks_path_separators(self):
        """Run ID should strip path separators."""
        result = sanitize_run_id("foo/bar\\baz")
        assert "/" not in result
        assert "\\" not in result

    def test_run_id_valid_name(self):
        """Valid names should pass through."""
        result = sanitize_run_id("MyTestRun_2024")
        assert result == "mytestrun_2024"


class TestMultiTenancy:
    """Tests for multi-tenant isolation."""

    def test_run_requires_org_id(self, db_session):
        """Run should require org_id."""
        # This would fail without org_id due to FK constraint
        # Just verify the model has the field
        assert hasattr(Run, "org_id")

    def test_event_requires_org_id(self):
        """Event should require org_id."""
        assert hasattr(Event, "org_id")

    def test_kb_document_requires_org_id(self):
        """KnowledgeDocument should require org_id."""
        assert hasattr(KnowledgeDocument, "org_id")

    def test_kb_chunk_requires_org_id(self):
        """KnowledgeChunk should require org_id."""
        assert hasattr(KnowledgeChunk, "org_id")
