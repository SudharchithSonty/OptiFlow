"""Claude API client for brief generation.

Uses Anthropic API with timeout enforcement and structured output parsing.
"""

import json
import logging
from typing import Any, Optional

import anthropic
from anthropic import APIError, APITimeoutError

from backend.app.core.config import settings

logger = logging.getLogger(__name__)


BRIEF_SYSTEM_PROMPT = """You are an expert manufacturing scheduling analyst. 
Your job is to analyze scheduling optimization results and produce actionable briefs for plant managers.

CRITICAL RULES:
1. Only reference order_ids, machine_ids, and operation_ids that exist in the provided data
2. All KPI values must match the provided values exactly (within 0.1%)
3. Recommendations must be specific, actionable, and prioritized
4. Be concise but thorough

Your response must be valid JSON matching this schema:
{
  "summary": "Executive summary (max 2000 chars)",
  "kpi_deltas": [
    {
      "metric": "string",
      "baseline_value": number,
      "optimized_value": number, 
      "improvement_pct": number,
      "is_improvement": boolean
    }
  ],
  "recommendations": [
    {
      "priority": integer (1-5, 1 is highest),
      "title": "string (max 200 chars)",
      "description": "string (max 1000 chars)",
      "impact": "string (max 500 chars)",
      "related_orders": ["order_id", ...],
      "related_machines": ["machine_id", ...]
    }
  ],
  "bottleneck_analysis": "string (max 1000 chars)",
  "limitations": ["string", ...]
}"""


WHY_SYSTEM_PROMPT = """You are an expert at explaining scheduling decisions.
Given a schedule and a question, provide a clear, evidence-based answer.

Your response must be valid JSON:
{
  "answer": "Clear explanation (max 1000 chars)",
  "evidence": ["Evidence point 1", "Evidence point 2", ...],
  "related_operations": ["op_id1", "op_id2", ...]
}

CRITICAL: Only reference operation IDs that exist in the provided schedule."""


class ClaudeClient:
    """Client for Claude API interactions."""
    
    def __init__(self):
        """Initialize client if API key is available."""
        self.client: Optional[anthropic.Anthropic] = None
        self.model = settings.anthropic_model
        self.timeout = settings.anthropic_timeout_seconds
        
        if settings.anthropic_api_key:
            self.client = anthropic.Anthropic(
                api_key=settings.anthropic_api_key,
                timeout=self.timeout,
            )
            logger.info(f"Claude client initialized with model: {self.model}")
        else:
            logger.info("Claude client not initialized - no API key")
    
    @property
    def is_available(self) -> bool:
        """Check if Claude is available."""
        return self.client is not None
    
    def generate_brief(
        self,
        kpis_baseline: dict[str, Any],
        kpis_optimized: dict[str, Any],
        schedule_baseline: list[dict],
        schedule_optimized: list[dict],
        scenario_meta: dict[str, Any],
        kb_context: str = "",
    ) -> Optional[dict[str, Any]]:
        """Generate a planner brief using Claude.
        
        Args:
            kpis_baseline: Baseline KPIs
            kpis_optimized: Optimized KPIs
            schedule_baseline: Baseline schedule
            schedule_optimized: Optimized schedule
            scenario_meta: Scenario metadata
            kb_context: Optional context from knowledge base RAG
            
        Returns:
            Brief content dict if successful, None if failed
        """
        if not self.is_available:
            logger.warning("Claude not available for brief generation")
            return None
        
        # Build KB context section if available
        kb_section = ""
        if kb_context:
            kb_section = f"""
## Relevant Knowledge Base Context
{kb_context}

Use this context to provide more specific recommendations if applicable.
"""
        
        # Build the prompt with context
        user_prompt = f"""Analyze this scheduling optimization and generate a planner brief.

## Scenario
- Orders: {scenario_meta.get('num_orders', 0)}
- Operations: {scenario_meta.get('num_operations', 0)}
- Machines: {scenario_meta.get('num_machines', 0)}
- Horizon: {scenario_meta.get('horizon_end_min', 0)} minutes

## Valid IDs for Reference
Order IDs: {[o.get('order_id') for o in scenario_meta.get('orders', [])]}
Machine IDs: {[m.get('machine_id') for m in scenario_meta.get('machines', [])]}

## Baseline KPIs
{json.dumps(kpis_baseline, indent=2)}

## Optimized KPIs
{json.dumps(kpis_optimized, indent=2)}

## Sample Optimized Schedule (first 10 operations)
{json.dumps(schedule_optimized[:10], indent=2)}
{kb_section}
Generate the planner brief as JSON:"""

        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=2000,
                system=BRIEF_SYSTEM_PROMPT,
                messages=[{"role": "user", "content": user_prompt}],
            )
            
            # Extract text response
            content = response.content[0].text
            
            # Parse JSON from response
            brief = self._parse_json_response(content)
            
            if brief is None:
                logger.error("Failed to parse Claude response as JSON")
                return None
            
            logger.info("Successfully generated brief via Claude")
            return brief
            
        except APITimeoutError:
            logger.error(f"Claude API timeout after {self.timeout}s")
            return None
        except APIError as e:
            logger.error(f"Claude API error: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error in Claude brief generation: {e}")
            return None
    
    def answer_why(
        self,
        question: str,
        schedule_optimized: list[dict],
        scenario_meta: dict[str, Any],
        kb_context: str = "",
    ) -> Optional[dict[str, Any]]:
        """Answer a 'why' question about scheduling.
        
        Args:
            question: The question to answer
            schedule_optimized: The optimized schedule
            scenario_meta: Scenario metadata
            kb_context: Optional context from knowledge base RAG
            
        Returns:
            Answer dict if successful, None if failed
        """
        if not self.is_available:
            return None
        
        # Build context
        op_ids = [op.get("op_id") for op in schedule_optimized if op.get("op_id")]
        
        # Build KB context section if available
        kb_section = ""
        if kb_context:
            kb_section = f"""
## Relevant Knowledge Base Context
{kb_context}

Use this context to enhance your answer if relevant.
"""
        
        user_prompt = f"""Question: {question}

## Schedule Context
Operation IDs (valid for reference): {op_ids[:50]}  # First 50

## Sample Schedule Data
{json.dumps(schedule_optimized[:20], indent=2)}

## Scenario Info
{json.dumps({k: v for k, v in scenario_meta.items() if k != 'orders'}, indent=2)}
{kb_section}
Answer the question as JSON:"""

        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1000,
                system=WHY_SYSTEM_PROMPT,
                messages=[{"role": "user", "content": user_prompt}],
            )
            
            content = response.content[0].text
            answer = self._parse_json_response(content)
            
            if answer is None:
                return None
            
            return answer
            
        except Exception as e:
            logger.error(f"Error in Claude why question: {e}")
            return None
    
    def _parse_json_response(self, content: str) -> Optional[dict[str, Any]]:
        """Parse JSON from Claude response.
        
        Handles responses that may have markdown code blocks.
        """
        # Try direct parse first
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            pass
        
        # Try to extract JSON from markdown code block
        if "```json" in content:
            start = content.find("```json") + 7
            end = content.find("```", start)
            if end > start:
                try:
                    return json.loads(content[start:end].strip())
                except json.JSONDecodeError:
                    pass
        
        # Try to extract any JSON object
        if "{" in content:
            start = content.find("{")
            end = content.rfind("}") + 1
            if end > start:
                try:
                    return json.loads(content[start:end])
                except json.JSONDecodeError:
                    pass
        
        return None


# Global client instance
claude_client = ClaudeClient()
