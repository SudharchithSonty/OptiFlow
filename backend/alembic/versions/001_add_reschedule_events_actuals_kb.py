"""Add reschedule lineage, events, actuals, and knowledge base tables.

Revision ID: 001
Revises: 
Create Date: 2026-01-02

This migration adds:
- Reschedule fields to runs table (parent_run_id, trigger, reschedule_mode, reschedule_from_ts)
- Events table for run event logging
- Draft impact reports table for wizard step persistence
- Setup actuals table for supervisor logging
- Quality checks table for QC logging
- Knowledge documents table for RAG
- Knowledge chunks table with pgvector embeddings
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Enable pgvector extension (Postgres only)
    op.execute('CREATE EXTENSION IF NOT EXISTS vector')
    
    # Add reschedule fields to runs table
    op.add_column('runs', sa.Column('parent_run_id', sa.String(36), sa.ForeignKey('runs.id', ondelete='SET NULL'), nullable=True))
    op.add_column('runs', sa.Column('trigger', sa.String(50), nullable=False, server_default='manual'))
    op.add_column('runs', sa.Column('reschedule_mode', sa.String(50), nullable=False, server_default='from_now'))
    op.add_column('runs', sa.Column('reschedule_from_ts', sa.DateTime(timezone=True), nullable=True))
    op.create_index('ix_runs_parent', 'runs', ['parent_run_id'])
    
    # Create events table
    op.create_table(
        'events',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('org_id', sa.String(36), sa.ForeignKey('orgs.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('run_id', sa.String(36), sa.ForeignKey('runs.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('created_by_user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('event_type', sa.String(50), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.String(2000), nullable=True),
        sa.Column('payload', sa.JSON(), nullable=True),
        sa.Column('event_ts', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('ix_events_org_run', 'events', ['org_id', 'run_id'])
    op.create_index('ix_events_type', 'events', ['org_id', 'event_type'])
    
    # Create draft_impact_reports table
    op.create_table(
        'draft_impact_reports',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('org_id', sa.String(36), sa.ForeignKey('orgs.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('run_id', sa.String(36), sa.ForeignKey('runs.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('created_by_user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('step', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('data', sa.JSON(), nullable=False, server_default='{}'),
        sa.Column('is_complete', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('ix_draft_impact_org_run', 'draft_impact_reports', ['org_id', 'run_id'])
    
    # Create setup_actuals table
    op.create_table(
        'setup_actuals',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('org_id', sa.String(36), sa.ForeignKey('orgs.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('logged_by_user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('machine_id', sa.String(50), nullable=False),
        sa.Column('from_family', sa.String(50), nullable=False),
        sa.Column('to_family', sa.String(50), nullable=False),
        sa.Column('actual_minutes', sa.Float(), nullable=False),
        sa.Column('planned_minutes', sa.Float(), nullable=True),
        sa.Column('notes', sa.String(500), nullable=True),
        sa.Column('setup_ts', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('ix_setup_actuals_org', 'setup_actuals', ['org_id'])
    op.create_index('ix_setup_actuals_machine', 'setup_actuals', ['org_id', 'machine_id'])
    op.create_index('ix_setup_actuals_families', 'setup_actuals', ['org_id', 'from_family', 'to_family'])
    
    # Create quality_checks table
    op.create_table(
        'quality_checks',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('org_id', sa.String(36), sa.ForeignKey('orgs.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('logged_by_user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('order_id', sa.String(50), nullable=False),
        sa.Column('op_id', sa.String(50), nullable=True),
        sa.Column('machine_id', sa.String(50), nullable=True),
        sa.Column('result', sa.String(50), nullable=False),
        sa.Column('defect_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('defect_type', sa.String(100), nullable=True),
        sa.Column('notes', sa.String(500), nullable=True),
        sa.Column('check_ts', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('ix_quality_checks_org', 'quality_checks', ['org_id'])
    op.create_index('ix_quality_checks_order', 'quality_checks', ['org_id', 'order_id'])
    op.create_index('ix_quality_checks_result', 'quality_checks', ['org_id', 'result'])
    
    # Create knowledge_documents table
    op.create_table(
        'knowledge_documents',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('org_id', sa.String(36), sa.ForeignKey('orgs.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('uploaded_by_user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('filename', sa.String(255), nullable=False),
        sa.Column('source', sa.String(500), nullable=True),
        sa.Column('mime_type', sa.String(100), nullable=False),
        sa.Column('file_path', sa.String(500), nullable=False),
        sa.Column('sha256', sa.String(64), nullable=False, index=True),
        sa.Column('file_size_bytes', sa.Integer(), nullable=False),
        sa.Column('page_count', sa.Integer(), nullable=True),
        sa.Column('chunk_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('status', sa.String(50), nullable=False, server_default='pending'),
        sa.Column('error_message', sa.String(1000), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('ix_kb_docs_org', 'knowledge_documents', ['org_id'])
    op.create_index('ix_kb_docs_status', 'knowledge_documents', ['org_id', 'status'])
    
    # Create knowledge_chunks table with pgvector embedding column
    op.create_table(
        'knowledge_chunks',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('org_id', sa.String(36), sa.ForeignKey('orgs.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('document_id', sa.String(36), sa.ForeignKey('knowledge_documents.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('chunk_index', sa.Integer(), nullable=False),
        sa.Column('text', sa.Text(), nullable=False),
        sa.Column('page', sa.Integer(), nullable=True),
        sa.Column('char_start', sa.Integer(), nullable=True),
        sa.Column('char_end', sa.Integer(), nullable=True),
        sa.Column('token_count', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('ix_kb_chunks_org', 'knowledge_chunks', ['org_id'])
    op.create_index('ix_kb_chunks_doc', 'knowledge_chunks', ['document_id'])
    
    # Add vector column for embeddings (pgvector)
    # Using raw SQL because alembic doesn't have native pgvector support
    op.execute('ALTER TABLE knowledge_chunks ADD COLUMN embedding vector(1536)')
    
    # Create HNSW index for fast similarity search (after data is loaded, this is more efficient)
    # For now, create an IVFFlat index which is faster to build
    # Note: In production with more data, consider HNSW: CREATE INDEX ... USING hnsw (embedding vector_cosine_ops)
    op.execute('''
        CREATE INDEX ix_kb_chunks_embedding ON knowledge_chunks 
        USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)
    ''')


def downgrade() -> None:
    # Drop knowledge chunks table
    op.drop_index('ix_kb_chunks_embedding', table_name='knowledge_chunks')
    op.drop_index('ix_kb_chunks_doc', table_name='knowledge_chunks')
    op.drop_index('ix_kb_chunks_org', table_name='knowledge_chunks')
    op.drop_table('knowledge_chunks')
    
    # Drop knowledge documents table
    op.drop_index('ix_kb_docs_status', table_name='knowledge_documents')
    op.drop_index('ix_kb_docs_org', table_name='knowledge_documents')
    op.drop_table('knowledge_documents')
    
    # Drop quality checks table
    op.drop_index('ix_quality_checks_result', table_name='quality_checks')
    op.drop_index('ix_quality_checks_order', table_name='quality_checks')
    op.drop_index('ix_quality_checks_org', table_name='quality_checks')
    op.drop_table('quality_checks')
    
    # Drop setup actuals table
    op.drop_index('ix_setup_actuals_families', table_name='setup_actuals')
    op.drop_index('ix_setup_actuals_machine', table_name='setup_actuals')
    op.drop_index('ix_setup_actuals_org', table_name='setup_actuals')
    op.drop_table('setup_actuals')
    
    # Drop draft impact reports table
    op.drop_index('ix_draft_impact_org_run', table_name='draft_impact_reports')
    op.drop_table('draft_impact_reports')
    
    # Drop events table
    op.drop_index('ix_events_type', table_name='events')
    op.drop_index('ix_events_org_run', table_name='events')
    op.drop_table('events')
    
    # Remove reschedule fields from runs table
    op.drop_index('ix_runs_parent', table_name='runs')
    op.drop_column('runs', 'reschedule_from_ts')
    op.drop_column('runs', 'reschedule_mode')
    op.drop_column('runs', 'trigger')
    op.drop_column('runs', 'parent_run_id')
    
    # Note: We don't drop the pgvector extension as it may be used by other tables
