"""Add explicit AI metrics columns to agent_jobs.

Revision ID: 003
Revises: 002
Create Date: 2026-01-21
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add validation_pass and fallback_used to agent_jobs."""
    op.add_column(
        "agent_jobs",
        sa.Column(
            "validation_pass",
            sa.Boolean(),
            nullable=True,
            comment="Whether validation passed for this job",
        ),
    )
    op.add_column(
        "agent_jobs",
        sa.Column(
            "fallback_used",
            sa.Boolean(),
            nullable=True,
            comment="Whether fallback was used for this job",
        ),
    )
    # Backfill existing rows based on status
    op.execute(
        """
        UPDATE agent_jobs
        SET validation_pass = CASE
            WHEN status IN ('succeeded', 'fallback_used') THEN TRUE
            WHEN status = 'validation_failed' THEN FALSE
            ELSE NULL
        END,
        fallback_used = CASE
            WHEN status = 'fallback_used' THEN TRUE
            WHEN status IN ('succeeded', 'validation_failed', 'failed') THEN FALSE
            ELSE NULL
        END
        """
    )


def downgrade() -> None:
    """Remove explicit AI metrics columns."""
    op.drop_column("agent_jobs", "fallback_used")
    op.drop_column("agent_jobs", "validation_pass")
