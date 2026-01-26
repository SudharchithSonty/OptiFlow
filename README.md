# CNC Job Shop Operations Assistant

AI-powered scheduling optimization for manufacturing job shops with multi-tenant support.

## Architecture

```
+------------------+       +------------------+       +------------------+
|   Next.js 16     |------>|   FastAPI        |------>|   PostgreSQL     |
|   (Frontend)     |       |   (Backend)      |       |   (Database)     |
|   + Auth.js      |       |   + OR-Tools     |       |                  |
+------------------+       |   + AI Agent     |       +------------------+
                           +------------------+
```

**Stack:**
- **Frontend:** Next.js 16 (App Router) + Auth.js + TailwindCSS
- **Backend:** FastAPI + SQLAlchemy + Alembic
- **Solver:** Google OR-Tools CP-SAT
- **AI Agent:** Claude (Anthropic) + rules-based fallback
- **Database:** PostgreSQL (with SQLite support for testing)

## Features

- Multi-tenant organization support with JWT authentication
- Synthetic data generation for job shop scenarios
- Baseline scheduling (EDD, FCFS algorithms)
- Optimized scheduling with OR-Tools CP-SAT solver
- Sequence-dependent setup times on bottleneck machine (M03)
- Machine unavailability constraints (shifts, planned downtime)
- KPI comparison (makespan, OTD, utilization, setup time)
- AI-powered planner briefs with Claude integration
- Rules-based fallback when Claude unavailable
- Brief validation (no hallucinated IDs)

## Project Structure

```
Project/
|-- backend/
|   |-- app/
|   |   |-- api/routes/       # FastAPI endpoints
|   |   |-- core/             # Config, database, security
|   |   |-- models/           # SQLAlchemy models
|   |   |-- schemas/          # Pydantic schemas
|   |-- alembic/              # Database migrations
|   |-- tests/                # Backend tests
|-- frontend/
|   |-- src/
|   |   |-- app/              # Next.js pages
|   |   |-- components/       # React components
|   |   |-- lib/              # Auth, API client
|-- agent/
|   |-- schemas.py            # Agent data contracts
|   |-- claude_client.py      # Anthropic API client
|   |-- fallback.py           # Rules-based generation
|   |-- validator.py          # Output validation
|   |-- service.py            # Agent orchestration
|   |-- tests/                # Agent tests
|-- scheduler/
|   |-- job_shop_solver.py    # OR-Tools CP-SAT solver
|   |-- baseline_scheduler.py # EDD/FCFS algorithms
|   |-- data_loader.py        # CSV data loading
|   |-- kpi.py                # KPI computation
|-- data_generator/           # Synthetic data generation
```

## Installation

### Backend

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
export DATABASE_URL="postgresql://user:pass@localhost:5432/cncjobshop"
export JWT_SECRET="your-secure-secret"
export ANTHROPIC_API_KEY="sk-..."  # Optional for Claude
export RUNS_DIR="runs"

# Run migrations (when database is ready)
alembic upgrade head

# Start backend
uvicorn backend.app.main:app --reload
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set environment variables (create .env.local)
# NEXTAUTH_SECRET=your-secret
# NEXTAUTH_URL=http://localhost:3000
# FASTAPI_BASE_URL=http://localhost:8000

# Start development server
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/login` - Login with email/password
- `POST /api/v1/auth/refresh` - Refresh access token

### Runs

- `POST /api/v1/orgs/{org_id}/runs` - Create new run
- `GET /api/v1/orgs/{org_id}/runs` - List runs
- `GET /api/v1/orgs/{org_id}/runs/{run_id}` - Get run details
- `POST /api/v1/orgs/{org_id}/runs/{run_id}/generate` - Generate data
- `POST /api/v1/orgs/{org_id}/runs/{run_id}/schedule` - Run schedulers

### Agent

- `POST /api/v1/orgs/{org_id}/runs/{run_id}/agent/brief` - Generate planner brief
- `POST /api/v1/orgs/{org_id}/runs/{run_id}/agent/why` - Answer "why" questions about scheduling
- `POST /api/v1/orgs/{org_id}/runs/{run_id}/agent/setup-guidance` - Generate setup guidance checklists
- `POST /api/v1/orgs/{org_id}/runs/{run_id}/events/{event_id}/replan` - Trigger replan from specific event
- `POST /api/v1/orgs/{org_id}/runs/{run_id}/replan/latest` - Trigger replan from latest unprocessed disruption
- `POST /api/v1/orgs/{org_id}/runs/active/shift-brief` - Generate shift brief for active schedule (external scheduler)
- `POST /api/v1/orgs/{org_id}/runs/{run_id}/publish` - Publish run as active schedule
- `GET /api/v1/orgs/{org_id}/runs/active` - Get active schedule for organization
- `GET /api/v1/orgs/{org_id}/agent-jobs` - List agent jobs (with filters)
- `GET /api/v1/orgs/{org_id}/agent-jobs/{job_id}` - Get agent job details
- `POST /api/v1/orgs/{org_id}/agent-jobs/{job_id}/rate` - Rate agent job output (1-5)
- `GET /api/v1/orgs/{org_id}/metrics/ai` - Get AI success metrics

## Use of AI (Agent)

OptiFlow uses an **agentic AI loop** to reduce operational friction in small-batch manufacturing. The AI agent produces structured, machine-readable outputs that influence system outcomes but remain human-approved.

### AI Use Cases

The AI agent enables three primary use cases:

1. **Fast Disruption Replanning**: When disruptions occur (machine breakdown, rush orders, material delays, quality issues), the AI generates a reschedule proposal that creates a child run with re-optimized schedule and impact summary.

2. **Clear Shift Briefs**: At shift start, the AI generates a planner brief that summarizes jobs, risks, and recommended actions for the active schedule.

3. **Structured Setup Guidance**: The AI produces per-machine setup checklists with changeover steps and first-piece checks, sourced only from known parameters and knowledge base citations.

### Agent Responsibility

The AI agent produces **structured, machine-readable outputs**:

- **Child Schedule (Re-optimized Run)**: When a disruption occurs, the agent generates a `RescheduleProposal` that specifies constraints (machine downtime windows, priority changes) and recommended actions. This proposal is validated and then executed deterministically by the CP-SAT scheduler to produce the actual child schedule.

- **Impact Summary**: After the child run is scheduled, the agent computes KPI deltas comparing parent vs. child runs, identifies late orders, bottleneck risks, and key changes.

- **Shift Brief**: A planner-oriented summary of the active schedule including jobs, risks, bottlenecks, and recommended actions. Generated using Claude (if available) or rules-based fallback.

- **Setup Checklist + First-Piece Checks**: Per-machine guidance for changeovers with tooling/fixture reminders, changeover steps, and first-piece inspection checklists. Only includes parameters sourced from artifacts or knowledge base (no hallucinated values).

### Trigger

The AI agent runs automatically when:

1. **Planner Clicks "Optimize"**: Manual trigger from the UI to generate a planner brief for a completed run.

2. **Disruption Event Logged**: When an event is logged (machine breakdown, rush order, material delay, quality issue), the system can trigger a replan:
   - `POST /api/v1/orgs/{org_id}/runs/{run_id}/events/{event_id}/replan` - Replan from specific event
   - `POST /api/v1/orgs/{org_id}/runs/{run_id}/replan/latest` - Replan from latest unprocessed disruption

3. **Shift Start (Scheduled)**: External scheduler calls `POST /api/v1/orgs/{org_id}/runs/active/shift-brief` at shift start (e.g., daily at 7 AM) to generate a shift-oriented brief.

4. **Setup Guidance Requested**: Planner requests setup guidance via `POST /api/v1/orgs/{org_id}/runs/{run_id}/agent/setup-guidance`.

### Boundaries

The AI agent is **not allowed** to:

- **Auto-publish schedules**: The agent can generate child runs, but only the planner can approve and publish them as the active schedule. The `RescheduleProposal` validator explicitly rejects proposals that request auto-publish.

- **Invent order/machine IDs**: All IDs referenced in agent outputs (orders, machines, operations) must exist in the scenario metadata. The `ProposalValidator` and `SetupGuidanceValidator` enforce this by checking against `scenario_meta.json`.

- **Output unapproved setup parameters**: Numeric parameters (RPM, pressure, temperatures) in setup guidance must be sourced from either:
  - Knowledge base citations (with `kb_document_id`)
  - Artifact fields (with `source: "artifact_field"`)
  - Generic placeholders like "per SOP" or "per process sheet"
  
  The validator rejects numeric parameters without a source.

- **Output infeasible sequences or impossible metrics**: The deterministic CP-SAT scheduler enforces feasibility. If the solver fails or yields an empty schedule, the agent job is marked as failed with a clear error reason.

### Failure Handling

The system implements multiple layers of guardrails and failure handling:

1. **Validation Guardrails**:
   - **ID Validation**: `ProposalValidator` and `SetupGuidanceValidator` check all referenced IDs exist in `scenario_meta.json`. Unknown IDs cause validation failure.
   - **Time Window Validation**: Timestamps in proposals must be within the scheduling horizon. Invalid timestamps cause validation failure.
   - **Parameter Source Validation**: Setup guidance numeric parameters must have a source (KB citation or artifact field). Unsourced parameters cause validation failure.

2. **Fallback Behavior**:
   - If Claude is unavailable or validation fails, the system falls back to rules-based generation:
     - `RescheduleAgentService._generate_proposal_rules()` - Generates proposals using deterministic logic based on event type
     - `SetupGuidanceService._generate_guidance_rules()` - Generates checklists from schedule analysis
     - `AgentService.generate_brief()` - Uses `generate_rules_brief()` when Claude unavailable
   - Fallback outputs are validated the same way as Claude outputs to ensure they never contain unknown IDs.

3. **Loud Failures**:
   - All failures are recorded in `agent_jobs` table with:
     - `status`: `failed`, `validation_failed`, or `fallback_used`
     - `error_message`: Detailed error description
     - `validation_errors`: List of validation failures (if applicable)
   - API responses include validation errors and error messages for transparency.
   - Failed agent jobs are visible in the UI and metrics dashboard.

4. **Schedule Feasibility**:
   - The deterministic CP-SAT scheduler enforces all constraints. If the solver fails:
     - Agent job is marked as `failed`
     - Error message includes solver status and reason
     - No child run is created
     - Parent run remains unchanged

5. **Transaction Safety**:
   - Multi-step operations (create child run, schedule, compute impact) are wrapped in database transactions.
   - If any step fails, the transaction rolls back and the agent job is marked as failed.

### AI Success Metrics

The system tracks four key metrics aligned to the rubric:

1. **Validation Pass Rate** (Target: ≥98%):
   - Calculated as: `(succeeded + fallback_used) / (succeeded + fallback_used + validation_failed)`
   - Tracked in `agent_jobs` table via `status` field
   - Available via `GET /api/v1/orgs/{org_id}/metrics/ai`

2. **Fallback Rate** (Target: <2%):
   - Calculated as: `fallback_used / (succeeded + fallback_used)`
   - Tracked via `status = 'fallback_used'` in `agent_jobs`
   - Indicates Claude availability and quality

3. **Replan Speed** (Target: <10 minutes):
   - End-to-end duration from replan job creation to child run scheduled + impact computed
   - Tracked via `duration_ms` in `agent_jobs` for `job_type = 'disruption_replan'`
   - Average computed in metrics endpoint

4. **Setup Clarity Rating** (Target: ≥4.5/5):
   - User-provided rating (1-5) on setup guidance quality
   - Stored in `agent_jobs.user_rating` for `job_type = 'setup_guidance'`
   - Average computed from all rated setup guidance jobs

**Metrics Dashboard**: Available at `/dashboard/ai-metrics` showing all four metrics with target comparisons and breakdown by job type.

### Agentic Loop Architecture

```
Event Logged → Replan Job Requested → AI Reschedule Proposal
                                                      ↓
                                    Proposal Validator (checks IDs, time windows)
                                                      ↓
                                    ┌─────────────────┴─────────────────┐
                                    │                                     │
                              [Pass]                                   [Fail]
                                    │                                     │
                                    ↓                                     ↓
                          Create Child Run                    Fallback Template
                                    │                                     │
                                    ↓                                     ↓
                          Run Scheduler (CP-SAT)              Rules-based Proposal
                                    │                                     │
                                    ↓                                     ↓
                          Impact Summary                      Validated Proposal
                                    │                                     │
                                    └─────────────────┬─────────────────┘
                                                      ↓
                                          Planner Review
                                                      ↓
                                    ┌─────────────────┴─────────────────┐
                                    │                                     │
                              [Approve]                              [Reject]
                                    │                                     │
                                    ↓                                     ↓
                          Publish Active Schedule                  No Publish
                                    │
                                    ↓
                          Execution Views (Active Schedule)
```

**Key Design Decisions**:
- AI generates **proposals/configs**, not raw schedules. The deterministic scheduler executes them.
- Human approval required for publishing (no auto-publish).
- Validation happens before execution to catch errors early.
- Fallback ensures system remains operational even if Claude unavailable.

## CP-SAT Model

The solver uses these constraints:

1. **Precedence:** Operations within an order follow sequence
2. **Machine capacity:** `NoOverlap` per machine
3. **Release times:** Operations start after order release
4. **Unavailability:** Machine downtime periods
5. **Setup times:** `AddCircuit` on M03 for family-dependent transitions

**Objective:** Minimize makespan + small penalty for family switches

## KPIs Computed

| Metric | Description |
|--------|-------------|
| Makespan | Total schedule duration (minutes) |
| On-Time Delivery % | Orders completing before due date |
| Machine Utilization % | Work time / available time |
| Total Setup Time | Sum of setup/changeover times |
| Family Switches | Number of family transitions on M03 |

## Testing

```bash
# Run all tests
./venv/bin/python -m pytest backend/tests/ agent/tests/ -v

# With coverage
./venv/bin/python -m pytest --cov=backend --cov=agent

# Frontend type check
cd frontend && npm run type-check
```

## Multi-Tenancy

All data is scoped by organization:
- Users belong to orgs via memberships
- Runs are owned by orgs
- Artifacts stored under `runs/<org_id>/<run_id>/`
- JWT contains `org_ids` claim for authorization

## Security

- Passwords hashed with Argon2
- JWT tokens with configurable expiration
- Run IDs sanitized to prevent path traversal
- No hardcoded secrets (all from environment)
- CORS configured for frontend origin

## Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
RUNS_DIR=runs
ANTHROPIC_API_KEY=sk-...  # Optional
ANTHROPIC_TIMEOUT_SECONDS=20
```

### Frontend (.env.local)

```
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
FASTAPI_BASE_URL=http://localhost:8000
```

## Reliability Rules

Following senior-level reliability standards:

- TDD: Tests written before implementation
- No `MAX(id)+1` - database-native IDs only
- QueuePool for Postgres (NullPool for SQLite)
- Timeouts on all external calls
- Loud failures with structured errors
- Multi-tenant isolation enforced
- Brief validation prevents hallucinated IDs

## License

Internal use only.
