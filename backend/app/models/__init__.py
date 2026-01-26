"""SQLAlchemy ORM models for multi-tenant CNC Job Shop."""

from backend.app.models.org import Org
from backend.app.models.user import User
from backend.app.models.membership import Membership
from backend.app.models.run import Run, RunStatus, RunTrigger, RescheduleMode
from backend.app.models.artifact import Artifact, ArtifactKind
from backend.app.models.event import Event, EventType
from backend.app.models.draft_impact_report import DraftImpactReport
from backend.app.models.setup_actual import SetupActual
from backend.app.models.quality_check import QualityCheck, QualityResult
from backend.app.models.knowledge_document import KnowledgeDocument, DocumentStatus
from backend.app.models.knowledge_chunk import KnowledgeChunk
from backend.app.models.agent_job import (
    AgentJob,
    AgentJobType,
    AgentJobTrigger,
    AgentJobStatus,
)

__all__ = [
    # Core entities
    "Org",
    "User",
    "Membership",
    # Runs
    "Run",
    "RunStatus",
    "RunTrigger",
    "RescheduleMode",
    "Artifact",
    "ArtifactKind",
    # Events
    "Event",
    "EventType",
    # Drafts
    "DraftImpactReport",
    # Actuals
    "SetupActual",
    "QualityCheck",
    "QualityResult",
    # Knowledge Base (RAG)
    "KnowledgeDocument",
    "DocumentStatus",
    "KnowledgeChunk",
    # Agent Jobs (AI metrics/audit)
    "AgentJob",
    "AgentJobType",
    "AgentJobTrigger",
    "AgentJobStatus",
]
