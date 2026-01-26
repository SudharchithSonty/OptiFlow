"""Pydantic schemas for request/response validation."""

from backend.app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    TokenResponse,
    UserResponse,
    MembershipResponse,
)
from backend.app.schemas.run import (
    RunCreate,
    RunResponse,
    RunSummary,
    RunDetailResponse,
    ArtifactInfo,
    RescheduleRequest,
    RunCompareResponse,
)
from backend.app.schemas.event import (
    EventCreate,
    EventResponse,
    EventSummary,
)
from backend.app.schemas.draft_impact import (
    DraftImpactCreate,
    DraftImpactResponse,
)
from backend.app.schemas.actuals import (
    SetupActualCreate,
    SetupActualResponse,
    QualityCheckCreate,
    QualityCheckResponse,
)
from backend.app.schemas.metrics import (
    WeeklyMetricsRequest,
    WeeklyMetricsResponse,
    SetupMetrics,
    QualityMetrics,
)
from backend.app.schemas.kb import (
    KBDocumentUpload,
    KBDocumentResponse,
    KBDocumentSummary,
    KBChunkCitation,
    KBQueryRequest,
    KBQueryResponse,
)
from backend.app.schemas.agent_job import (
    AgentJobCreate,
    AgentJobResponse,
    AgentJobSummary,
    AgentJobRatingUpdate,
    ReplanRequest,
    ReplanResponse,
    PublishRequest,
    PublishResponse,
    ActiveScheduleResponse,
)

__all__ = [
    # Auth
    "LoginRequest",
    "LoginResponse",
    "TokenResponse",
    "UserResponse",
    "MembershipResponse",
    # Runs
    "RunCreate",
    "RunResponse",
    "RunSummary",
    "RunDetailResponse",
    "ArtifactInfo",
    "RescheduleRequest",
    "RunCompareResponse",
    # Events
    "EventCreate",
    "EventResponse",
    "EventSummary",
    # Draft Impact
    "DraftImpactCreate",
    "DraftImpactResponse",
    # Actuals
    "SetupActualCreate",
    "SetupActualResponse",
    "QualityCheckCreate",
    "QualityCheckResponse",
    # Metrics
    "WeeklyMetricsRequest",
    "WeeklyMetricsResponse",
    "SetupMetrics",
    "QualityMetrics",
    # KB
    "KBDocumentUpload",
    "KBDocumentResponse",
    "KBDocumentSummary",
    "KBChunkCitation",
    "KBQueryRequest",
    "KBQueryResponse",
    # Agent Jobs
    "AgentJobCreate",
    "AgentJobResponse",
    "AgentJobSummary",
    "AgentJobRatingUpdate",
    "ReplanRequest",
    "ReplanResponse",
    "PublishRequest",
    "PublishResponse",
    "ActiveScheduleResponse",
]
