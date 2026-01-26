"""Pydantic schemas for agent request/response validation."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class Recommendation(BaseModel):
    """A single scheduling recommendation."""
    priority: int = Field(..., ge=1, le=5, description="Priority 1-5 (1 is highest)")
    title: str = Field(..., max_length=200)
    description: str = Field(..., max_length=1000)
    impact: str = Field(..., max_length=500, description="Expected impact if implemented")
    related_orders: list[str] = Field(default_factory=list)
    related_machines: list[str] = Field(default_factory=list)


class KPIDelta(BaseModel):
    """KPI improvement summary."""
    metric: str
    baseline_value: float
    optimized_value: float
    improvement_pct: float
    is_improvement: bool


class KBSource(BaseModel):
    """A source citation from the knowledge base."""
    document_id: str
    document_title: str
    page: Optional[int] = None
    chunk_index: int
    excerpt: str = Field(..., max_length=500)


class BriefContent(BaseModel):
    """Structured content of a planner brief."""
    summary: str = Field(..., max_length=2000, description="Executive summary")
    kpi_deltas: list[KPIDelta]
    recommendations: list[Recommendation]
    bottleneck_analysis: str = Field(..., max_length=1000)
    limitations: list[str] = Field(default_factory=list, description="Known limitations")
    sources: list[KBSource] = Field(default_factory=list, description="KB citations used")


class AgentBriefResponse(BaseModel):
    """Response from brief generation endpoint."""
    run_id: str
    brief: BriefContent
    generated_at: datetime
    mode: str = Field(..., description="'claude' or 'rules_fallback'")
    claude_model: Optional[str] = None
    generation_time_ms: int


class WhyQuestion(BaseModel):
    """Request to explain a scheduling decision."""
    question: str = Field(..., min_length=10, max_length=500)
    context: Optional[str] = Field(None, max_length=1000, description="Optional context")


class WhyResponse(BaseModel):
    """Response explaining a scheduling decision."""
    question: str
    answer: str
    evidence: list[str] = Field(default_factory=list)
    related_operations: list[str] = Field(default_factory=list)
    sources: list[KBSource] = Field(default_factory=list, description="KB citations")
    mode: str


class AgentTraceEntry(BaseModel):
    """Single entry in agent trace log."""
    timestamp: datetime
    action: str
    details: dict
    duration_ms: Optional[int] = None


class AgentTrace(BaseModel):
    """Complete trace of agent execution for debugging."""
    run_id: str
    mode: str
    entries: list[AgentTraceEntry]
    total_duration_ms: int
    errors: list[str] = Field(default_factory=list)
