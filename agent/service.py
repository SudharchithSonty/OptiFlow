"""Agent service - orchestrates brief generation with Claude/fallback and RAG.

Provides the main entry points for agent functionality:
- generate_brief: Creates a planner brief from schedule artifacts with KB context
- answer_why: Explains scheduling decisions with KB citations
"""

import json
import logging
import time
from datetime import datetime
from pathlib import Path
from typing import Any, Optional
from uuid import UUID

from agent.claude_client import claude_client
from agent.fallback import generate_rules_brief, answer_why_question_rules
from agent.validator import BriefValidator

logger = logging.getLogger(__name__)


async def query_kb_for_context(
    org_id: str,
    query: str,
    top_k: int = 3,
) -> tuple[list[dict], str]:
    """Query the knowledge base for relevant context.
    
    Args:
        org_id: Organization ID for multi-tenant isolation
        query: Search query
        top_k: Number of results
        
    Returns:
        Tuple of (sources list, context string)
    """
    # This would normally use the KB retrieval service
    # For now, return empty if KB service not available
    try:
        from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
        from sqlalchemy.orm import sessionmaker
        from backend.app.core.config import settings
        from backend.app.services.kb_retrieve import search_chunks
        
        # Create async session
        engine = create_async_engine(
            settings.database_url.replace("postgresql://", "postgresql+asyncpg://"),
            pool_size=1,
        )
        async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
        
        async with async_session() as session:
            result = await search_chunks(
                db=session,
                org_id=UUID(org_id),
                query=query,
                top_k=top_k,
            )
        
        await engine.dispose()
        
        sources = []
        context_parts = []
        
        for chunk in result.results:
            sources.append({
                "document_id": chunk.document_id,
                "document_title": chunk.document_title,
                "page": chunk.page,
                "chunk_index": chunk.chunk_index,
                "excerpt": chunk.excerpt,
            })
            context_parts.append(f"From '{chunk.document_title}': {chunk.excerpt}")
        
        context = "\n\n".join(context_parts) if context_parts else ""
        return sources, context
        
    except Exception as e:
        logger.warning(f"KB query failed (non-fatal): {e}")
        return [], ""


class AgentService:
    """Service for generating AI-powered planner briefs with RAG support."""
    
    def __init__(self, run_dir: Path, org_id: Optional[str] = None):
        """Initialize agent with run directory.
        
        Args:
            run_dir: Path to the run's artifact directory
            org_id: Optional org ID for KB queries (multi-tenant)
        """
        self.run_dir = run_dir
        self.org_id = org_id
        self.trace_entries: list[dict] = []
        self.errors: list[str] = []
        self.kb_sources: list[dict] = []
    
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
    
    def generate_brief(self) -> dict[str, Any]:
        """Generate a planner brief from run artifacts.
        
        Returns:
            Dict containing brief content, mode, timing, and any errors
        """
        start_time = time.time()
        self.trace_entries = []
        self.errors = []
        
        self._log_trace("start", {"run_dir": str(self.run_dir)})
        
        # Load required artifacts
        load_start = time.time()
        kpis_baseline = self._load_artifact("kpi_baseline.json") or {}
        kpis_optimized = self._load_artifact("kpi_optimized.json") or {}
        schedule_baseline_data = self._load_artifact("schedule_baseline.json") or {}
        schedule_optimized_data = self._load_artifact("schedule_optimized.json") or {}
        scenario_meta = self._load_artifact("scenario_meta.json") or {}
        
        schedule_baseline = schedule_baseline_data.get("schedule", [])
        schedule_optimized = schedule_optimized_data.get("schedule", [])
        
        load_ms = int((time.time() - load_start) * 1000)
        self._log_trace("load_artifacts", {
            "loaded": bool(kpis_baseline and kpis_optimized),
            "errors": self.errors.copy(),
        }, load_ms)
        
        # Query KB for relevant context (if org_id available)
        kb_context = ""
        self.kb_sources = []
        
        if self.org_id:
            try:
                import asyncio
                # Build query from KPIs and bottlenecks
                kb_query = self._build_kb_query(kpis_baseline, kpis_optimized, scenario_meta)
                
                # Run async KB query in sync context
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                self.kb_sources, kb_context = loop.run_until_complete(
                    query_kb_for_context(self.org_id, kb_query, top_k=3)
                )
                loop.close()
                
                if self.kb_sources:
                    self._log_trace("kb_query", {
                        "query": kb_query[:100],
                        "sources_found": len(self.kb_sources),
                    })
            except Exception as e:
                logger.warning(f"KB query failed (non-fatal): {e}")
        
        # Try Claude first
        mode = "rules_fallback"
        claude_model = None
        brief_content = None
        
        if claude_client.is_available:
            claude_start = time.time()
            self._log_trace("claude_attempt", {"model": claude_client.model})
            
            brief_content = claude_client.generate_brief(
                kpis_baseline,
                kpis_optimized,
                schedule_baseline,
                schedule_optimized,
                scenario_meta,
                kb_context=kb_context,
            )
            
            claude_ms = int((time.time() - claude_start) * 1000)
            
            if brief_content:
                # Validate Claude output
                validator = self._create_validator(
                    scenario_meta, kpis_baseline, kpis_optimized
                )
                
                if validator.validate_brief(brief_content):
                    mode = "claude"
                    claude_model = claude_client.model
                    self._log_trace("claude_success", {
                        "model": claude_model,
                    }, claude_ms)
                else:
                    self.errors.extend(validator.errors)
                    self._log_trace("claude_validation_failed", {
                        "errors": validator.errors,
                    }, claude_ms)
                    brief_content = None
            else:
                self._log_trace("claude_failed", {}, claude_ms)
        
        # Fall back to rules if Claude failed or unavailable
        if brief_content is None:
            fallback_start = time.time()
            self._log_trace("fallback_start", {})
            
            brief_content = generate_rules_brief(
                kpis_baseline,
                kpis_optimized,
                schedule_baseline,
                schedule_optimized,
                scenario_meta,
            )
            
            fallback_ms = int((time.time() - fallback_start) * 1000)
            self._log_trace("fallback_complete", {}, fallback_ms)
        
        # Add KB sources to brief
        if self.kb_sources and isinstance(brief_content, dict):
            brief_content["sources"] = self.kb_sources
        
        total_ms = int((time.time() - start_time) * 1000)
        self._log_trace("complete", {"mode": mode, "total_ms": total_ms})
        
        # Save artifacts
        self._save_brief_artifacts(brief_content, mode, claude_model, total_ms)
        
        return {
            "brief": brief_content,
            "mode": mode,
            "claude_model": claude_model,
            "generation_time_ms": total_ms,
            "errors": self.errors,
            "trace": self.trace_entries,
        }
    
    def answer_why(self, question: str, context: Optional[str] = None) -> dict[str, Any]:
        """Answer a 'why' question about the schedule.
        
        Args:
            question: The question to answer
            context: Optional additional context
            
        Returns:
            Answer with evidence, KB sources, and mode information
        """
        start_time = time.time()
        
        # Load artifacts
        schedule_data = self._load_artifact("schedule_optimized.json") or {}
        scenario_meta = self._load_artifact("scenario_meta.json") or {}
        schedule = schedule_data.get("schedule", [])
        
        # Query KB for relevant context
        kb_sources: list[dict] = []
        kb_context = ""
        
        if self.org_id:
            try:
                import asyncio
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                kb_sources, kb_context = loop.run_until_complete(
                    query_kb_for_context(self.org_id, question, top_k=3)
                )
                loop.close()
            except Exception as e:
                logger.warning(f"KB query failed for why question: {e}")
        
        mode = "rules_fallback"
        answer_data = None
        
        # Try Claude first
        if claude_client.is_available:
            answer_data = claude_client.answer_why(
                question, 
                schedule, 
                scenario_meta,
                kb_context=kb_context,
            )
            if answer_data:
                mode = "claude"
        
        # Fall back to rules
        if answer_data is None:
            answer_data = answer_why_question_rules(question, schedule, scenario_meta)
        
        total_ms = int((time.time() - start_time) * 1000)
        
        return {
            "question": question,
            "answer": answer_data.get("answer", "Unable to answer question"),
            "evidence": answer_data.get("evidence", []),
            "related_operations": answer_data.get("related_operations", []),
            "sources": kb_sources,
            "mode": mode,
            "generation_time_ms": total_ms,
        }
    
    def _build_kb_query(
        self, 
        kpis_baseline: dict, 
        kpis_optimized: dict, 
        scenario_meta: dict,
    ) -> str:
        """Build a query for KB based on schedule context.
        
        Extracts key topics like bottleneck machines, setup issues, etc.
        """
        parts = []
        
        # Check for setup time issues
        baseline_setup = kpis_baseline.get("setup_time_total", 0)
        opt_setup = kpis_optimized.get("setup_time_total", 0)
        if baseline_setup > 0 or opt_setup > 0:
            parts.append("setup changeover procedures")
        
        # Check for machine bottlenecks
        if scenario_meta.get("machines"):
            parts.append("machine capacity optimization")
        
        # Check for OTD issues
        baseline_otd = kpis_baseline.get("on_time_delivery_pct", 100)
        if baseline_otd < 100:
            parts.append("delivery scheduling late orders")
        
        # Default query if nothing specific
        if not parts:
            parts.append("scheduling best practices job shop")
        
        return " ".join(parts[:3])
    
    def _create_validator(
        self,
        scenario_meta: dict,
        kpis_baseline: dict,
        kpis_optimized: dict,
    ) -> BriefValidator:
        """Create a validator from scenario metadata."""
        orders = scenario_meta.get("orders", [])
        machines = scenario_meta.get("machines", [])
        
        order_ids = {o.get("order_id") for o in orders if o.get("order_id")}
        machine_ids = {m.get("machine_id") for m in machines if m.get("machine_id")}
        op_ids: set[str] = set()  # Would need to extract from schedule
        
        return BriefValidator(
            order_ids=order_ids,
            machine_ids=machine_ids,
            op_ids=op_ids,
            kpis_baseline=kpis_baseline,
            kpis_optimized=kpis_optimized,
        )
    
    def _save_brief_artifacts(
        self,
        brief: dict,
        mode: str,
        claude_model: Optional[str],
        generation_time_ms: int,
    ) -> None:
        """Save brief artifacts to run directory."""
        # Save JSON brief
        brief_path = self.run_dir / "agent_brief.json"
        with open(brief_path, "w") as f:
            json.dump(brief, f, indent=2)
        
        # Save markdown version
        md_content = self._render_brief_markdown(brief, mode, generation_time_ms)
        md_path = self.run_dir / "agent_brief.md"
        with open(md_path, "w") as f:
            f.write(md_content)
        
        # Save trace
        trace_path = self.run_dir / "agent_trace.json"
        with open(trace_path, "w") as f:
            json.dump({
                "mode": mode,
                "claude_model": claude_model,
                "generation_time_ms": generation_time_ms,
                "entries": self.trace_entries,
                "errors": self.errors,
            }, f, indent=2)
    
    def _render_brief_markdown(
        self,
        brief: dict,
        mode: str,
        generation_time_ms: int,
    ) -> str:
        """Render brief as markdown."""
        lines = ["# Planner Brief\n"]
        
        # Summary
        lines.append("## Executive Summary\n")
        lines.append(brief.get("summary", "No summary available."))
        lines.append("\n")
        
        # KPI Deltas
        lines.append("## KPI Improvements\n")
        lines.append("| Metric | Baseline | Optimized | Improvement |")
        lines.append("|--------|----------|-----------|-------------|")
        for delta in brief.get("kpi_deltas", []):
            sign = "+" if delta.get("is_improvement") else ""
            lines.append(
                f"| {delta.get('metric', '')} | "
                f"{delta.get('baseline_value', 0):.1f} | "
                f"{delta.get('optimized_value', 0):.1f} | "
                f"{sign}{delta.get('improvement_pct', 0):.1f}% |"
            )
        lines.append("\n")
        
        # Recommendations
        lines.append("## Recommendations\n")
        for rec in brief.get("recommendations", []):
            lines.append(f"### {rec.get('priority', '?')}. {rec.get('title', 'Untitled')}\n")
            lines.append(f"{rec.get('description', '')}\n")
            lines.append(f"**Impact:** {rec.get('impact', 'Unknown')}\n")
            if rec.get("related_orders"):
                lines.append(f"**Related Orders:** {', '.join(rec['related_orders'])}\n")
            if rec.get("related_machines"):
                lines.append(f"**Related Machines:** {', '.join(rec['related_machines'])}\n")
            lines.append("")
        
        # Bottleneck Analysis
        lines.append("## Bottleneck Analysis\n")
        lines.append(brief.get("bottleneck_analysis", "No analysis available."))
        lines.append("\n")
        
        # Limitations
        if brief.get("limitations"):
            lines.append("## Limitations\n")
            for lim in brief["limitations"]:
                lines.append(f"- {lim}")
            lines.append("\n")
        
        # Footer
        lines.append("---\n")
        lines.append(f"*Generated by: {mode} | Time: {generation_time_ms}ms*\n")
        
        return "\n".join(lines)
