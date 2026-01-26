"""Add active_run_id to orgs and agent_jobs table.

Revision ID: 002
Revises: 001
Create Date: 2026-01-21

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSON


# revision identifiers, used by Alembic.
revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add active_run_id to orgs table and create agent_jobs table."""
    # Add active_run_id to orgs table
    op.add_column(
        "orgs",
        sa.Column(
            "active_run_id",
            UUID(as_uuid=True),
            sa.ForeignKey("runs.id", ondelete="SET NULL"),
            nullable=True,
            comment="Currently published/active schedule run for this org",
        ),
    )

    # Create agent_jobs table
    op.create_table(
        "agent_jobs",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "org_id",
            UUID(as_uuid=True),
            sa.ForeignKey("orgs.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
            comment="Owning organization (multi-tenant key)",
        ),
        sa.Column(
            "run_id",
            UUID(as_uuid=True),
            sa.ForeignKey("runs.id", ondelete="SET NULL"),
            nullable=True,
            index=True,
            comment="Run context for this job (parent run for replans)",
        ),
        sa.Column(
            "child_run_id",
            UUID(as_uuid=True),
            sa.ForeignKey("runs.id", ondelete="SET NULL"),
            nullable=True,
            comment="Child run created by this job (for replans)",
        ),
        sa.Column(
            "input_event_id",
            UUID(as_uuid=True),
            sa.ForeignKey("events.id", ondelete="SET NULL"),
            nullable=True,
            comment="Input event that triggered this job (for disruption replans)",
        ),
        sa.Column(
            "created_by_user_id",
            UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
            comment="User who triggered this job (if planner_click)",
        ),
        sa.Column(
            "job_type",
            sa.String(50),
            nullable=False,
            comment="Type of agent job (disruption_replan, shift_brief, setup_guidance)",
        ),
        sa.Column(
            "trigger_source",
            sa.String(50),
            nullable=False,
            comment="What triggered this job (external_scheduler, planner_click, event_logged)",
        ),
        sa.Column(
            "status",
            sa.String(50),
            default="queued",
            comment="Current job status",
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
        sa.Column(
            "started_at",
            sa.DateTime(timezone=True),
            nullable=True,
            comment="When job execution started",
        ),
        sa.Column(
            "completed_at",
            sa.DateTime(timezone=True),
            nullable=True,
            comment="When job execution completed",
        ),
        sa.Column(
            "duration_ms",
            sa.Integer,
            nullable=True,
            comment="Total execution duration in milliseconds",
        ),
        sa.Column(
            "artifact_paths",
            JSON,
            nullable=True,
            comment="Paths to artifacts produced by this job",
        ),
        sa.Column(
            "error_message",
            sa.String(2000),
            nullable=True,
            comment="Error details if job failed",
        ),
        sa.Column(
            "validation_errors",
            JSON,
            nullable=True,
            comment="List of validation errors if validation_failed",
        ),
        sa.Column(
            "metrics",
            JSON,
            nullable=True,
            comment="Job metrics: {validation_pass, fallback_used, model_used, etc.}",
        ),
        sa.Column(
            "user_rating",
            sa.Integer,
            nullable=True,
            comment="User rating 1-5 for output quality (setup guidance clarity)",
        ),
        sa.Column(
            "rating_comment",
            sa.String(500),
            nullable=True,
            comment="Optional user comment on rating",
        ),
    )

    # Create indexes for agent_jobs
    op.create_index(
        "ix_agent_jobs_org_status",
        "agent_jobs",
        ["org_id", "status"],
    )
    op.create_index(
        "ix_agent_jobs_org_type",
        "agent_jobs",
        ["org_id", "job_type"],
    )
    op.create_index(
        "ix_agent_jobs_created",
        "agent_jobs",
        ["org_id", "created_at"],
    )


def downgrade() -> None:
    """Remove agent_jobs table and active_run_id from orgs."""
    op.drop_index("ix_agent_jobs_created", table_name="agent_jobs")
    op.drop_index("ix_agent_jobs_org_type", table_name="agent_jobs")
    op.drop_index("ix_agent_jobs_org_status", table_name="agent_jobs")
    op.drop_table("agent_jobs")
    op.drop_column("orgs", "active_run_id")
