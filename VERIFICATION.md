# Verification Gates

This document describes how to verify the CNC Job Shop application.

## Backend Tests

Run all backend tests:

```bash
cd /Users/archithsonty/Desktop/Project
source venv/bin/activate
PYTHONPATH=/Users/archithsonty/Desktop/Project pytest backend/tests/ -v
```

Current test count: 88 tests (70 original + 18 new feature tests)

## Frontend Build

Verify frontend builds without errors:

```bash
cd frontend
npm run build
```

## Type Checking

Backend (mypy):
```bash
cd backend
mypy . --strict --ignore-missing-imports
```

Frontend (tsc):
```bash
cd frontend
npx tsc --noEmit
```

## Linting

Backend (ruff):
```bash
cd backend
ruff check .
```

Frontend (eslint):
```bash
cd frontend
npm run lint
```

## Concurrency Smoke Tests

Test API endpoint under load (requires `hey` tool):

```bash
# Install hey: go install github.com/rakyll/hey@latest

# Test auth endpoint
hey -n 100 -c 10 http://localhost:8000/api/health

# Test runs list (requires valid JWT)
hey -n 100 -c 10 -H "Authorization: Bearer <token>" \
  http://localhost:8000/api/v1/orgs/<org_id>/runs

# Test agent brief (requires completed run)
hey -n 50 -c 5 -m POST -H "Authorization: Bearer <token>" \
  http://localhost:8000/api/v1/orgs/<org_id>/runs/<run_id>/agent/brief
```

## E2E Tests (Playwright)

```bash
cd frontend
npx playwright install  # First time only
npx playwright test
```

## Anti-Pattern Verification

Check for banned patterns:

```bash
# No manual ID generation
grep -r "MAX(id" ./backend ./agent && echo "FAIL" || echo "PASS"

# No StaticPool in production code (OK in tests)
grep -r "StaticPool" ./backend/app && echo "FAIL" || echo "PASS"

# No hardcoded absolute paths
grep -r '"/app/' ./backend ./agent && echo "FAIL" || echo "PASS"
```

## Database Migration

Apply migrations (requires running Postgres):

```bash
cd backend
alembic upgrade head
```

## Full Verification Checklist

- [ ] All backend tests pass (88 tests)
- [ ] Frontend builds without errors
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] No banned anti-patterns
- [ ] Concurrency smoke test passes (no 500s)
- [ ] E2E tests pass

## Running the Application

Backend:
```bash
cd /Users/archithsonty/Desktop/Project
source venv/bin/activate
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

Frontend:
```bash
cd frontend
npm run dev
```
