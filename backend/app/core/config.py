"""Application configuration from environment variables.

All config is loaded from environment; no hardcoded secrets or paths.
"""

import logging
from pathlib import Path
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Application
    app_name: str = "CNC Job Shop Scheduler"
    debug: bool = False
    log_level: str = "INFO"

    # Database (Postgres + pgvector)
    database_url: str = "postgresql://postgres:postgres@localhost:5432/cncjobshop"

    # JWT Authentication
    jwt_secret: str = "CHANGE_ME_IN_PRODUCTION_USE_STRONG_SECRET"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60
    jwt_refresh_token_expire_days: int = 7

    # Paths (no hardcoded absolute paths)
    runs_dir: Path = Path("runs")
    data_dir: Path = Path("data/synthetic")
    kb_uploads_dir: Path = Path("kb_uploads")

    # Anthropic (Claude) - optional
    anthropic_api_key: Optional[str] = None
    anthropic_timeout_seconds: float = 20.0
    anthropic_model: str = "claude-3-haiku-20240307"

    # OpenAI (embeddings) - optional
    openai_api_key: Optional[str] = None
    openai_timeout_seconds: float = 30.0
    embedding_model: str = "text-embedding-3-small"
    embedding_dimensions: int = 1536

    # RAG settings
    kb_chunk_size: int = 500
    kb_chunk_overlap: int = 50
    kb_top_k: int = 5

    # Request timeouts
    default_timeout_seconds: float = 30.0

    def get_runs_path(self, org_id: str, run_id: str) -> Path:
        """Get the path for a specific run directory.
        
        Args:
            org_id: Organization identifier (sanitized)
            run_id: Run identifier (sanitized)
            
        Returns:
            Path to the run directory
        """
        return self.runs_dir / org_id / run_id

    def get_kb_upload_path(self, org_id: str) -> Path:
        """Get the path for KB uploads for an organization.
        
        Args:
            org_id: Organization identifier
            
        Returns:
            Path to the KB uploads directory
        """
        return self.kb_uploads_dir / org_id

    def configure_logging(self) -> None:
        """Configure application logging."""
        logging.basicConfig(
            level=getattr(logging, self.log_level.upper()),
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        )


# Global settings instance
settings = Settings()
