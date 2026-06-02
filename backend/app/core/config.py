"""Application configuration from environment variables."""

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

    app_name: str = "OptiFlow"
    debug: bool = False
    log_level: str = "INFO"

    database_url: str = "postgresql://postgres:postgres@localhost:5432/optiflow"

    jwt_secret: str = "CHANGE_ME_IN_PRODUCTION"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60
    jwt_refresh_token_expire_days: int = 7

    runs_dir: Path = Path("runs")
    data_dir: Path = Path("data/synthetic")

    anthropic_api_key: Optional[str] = None
    anthropic_timeout_seconds: float = 20.0
    anthropic_model: str = "claude-3-haiku-20240307"

    openai_api_key: Optional[str] = None
    openai_timeout_seconds: float = 30.0

    default_timeout_seconds: float = 30.0

    def get_runs_path(self, org_id: str, run_id: str) -> Path:
        return self.runs_dir / org_id / run_id

    def configure_logging(self) -> None:
        logging.basicConfig(
            level=getattr(logging, self.log_level.upper()),
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        )


settings = Settings()
