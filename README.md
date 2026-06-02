# OptiFlow - CNC Job Shop Operations Assistant

AI-powered scheduling optimization for manufacturing job shops.

## Architecture

```
Frontend (Vite + React)  →  Backend (FastAPI)  →  Database (PostgreSQL)
                                    ↓
                           Scheduler (OR-Tools)
                           AI Agent (Claude)
```

**Stack:**

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS + Radix UI
- **Backend:** FastAPI + SQLAlchemy 2 (async) + Alembic
- **Database:** PostgreSQL
- **Solver:** Google OR-Tools CP-SAT
- **AI Agent:** Claude (Anthropic) with rules-based fallback

## Project Structure

```
OptiFlow/
├── backend/
│   ├── app/
│   │   ├── main.py              ← FastAPI app entry point
│   │   ├── api/
│   │   │   ├── deps.py          ← Auth & DB dependencies (implemented)
│   │   │   └── routes/
│   │   │       ├── auth.py      ← Login/refresh (implemented - reference)
│   │   │       ├── me.py        ← Current user (implemented - reference)
│   │   │       ├── machines.py  ← TODO: implement
│   │   │       ├── orders.py    ← TODO: implement
│   │   │       ├── runs.py      ← TODO: implement
│   │   │       ├── schedule.py  ← TODO: implement
│   │   │       ├── events.py    ← TODO: implement
│   │   │       └── agent.py     ← TODO: implement (last)
│   │   ├── core/
│   │   │   ├── config.py        ← Settings from .env
│   │   │   ├── database.py      ← Async SQLAlchemy engine
│   │   │   └── security.py      ← JWT + Argon2 (implemented)
│   │   ├── models/              ← SQLAlchemy models (all defined)
│   │   ├── schemas/             ← Pydantic schemas (auth done, rest TODO)
│   │   ├── services/            ← Business logic (scheduling.py exists)
│   │   └── seed.py              ← Demo data seeder
│   ├── alembic/                 ← Database migrations
│   └── tests/                   ← Backend tests
├── frontend/
│   └── src/
│       ├── App.tsx              ← Router and app shell
│       ├── components/          ← React components (using mock data)
│       ├── lib/
│       │   ├── config.ts        ← API base URL config
│       │   ├── api/
│       │   │   ├── client.ts    ← Typed fetch wrapper (implemented)
│       │   │   └── schemas.ts   ← Zod schemas (TODO: add per slice)
│       │   └── auth/
│       │       └── token.ts     ← JWT token storage (implemented)
│       └── types/               ← TypeScript types + mock data
├── agent/                       ← AI agent services
├── scheduler/                   ← OR-Tools CP-SAT solver
└── data_generator/              ← Synthetic data generation
```

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL 15+

### Backend

```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy and edit environment variables
cp .env.example .env

# Create the database
createdb optiflow   # or use psql

# Create tables and seed demo data
python -m backend.app.seed

# Start the API server
uvicorn backend.app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on <http://localhost:3000> and proxies `/api` requests to <http://localhost:8000>.

## Learning Path

This project is set up as a learning assignment. Implement each "slice" in order:

1. **Slice A** (done): Auth + `/me` — see `routes/auth.py` and `routes/me.py` as reference
2. **Slice B**: Master data — implement `routes/machines.py` and `routes/orders.py`
3. **Slice C**: Runs — implement `routes/runs.py`
4. **Slice D**: Schedule & Metrics — implement `routes/schedule.py`
5. **Slice E**: Events & Alerts — implement `routes/events.py`
6. **Slice F**: Agent features — implement `routes/agent.py`

For each slice:

1. Open the stub route file and read the docstring for the endpoint list
2. Write the endpoint implementation (use `auth.py` as your pattern)
3. Uncomment the router in `main.py`
4. Test via `/api/docs` (Swagger UI)
5. Wire the frontend component to use `lib/api/client.ts` instead of mock data

### Demo Credentials (after seeding)

| Email               | Password      | Role       |
|---------------------|---------------|------------|
| <amit@demo-mfg.com>   | password123   | owner      |
| <ravi@demo-mfg.com>   | password123   | planner    |
| <priya@demo-mfg.com>  | password123   | supervisor |

## API Documentation

Start the backend and visit <http://localhost:8000/api/docs> for the interactive Swagger UI.
