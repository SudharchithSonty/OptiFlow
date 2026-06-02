# Dev Commands Reference

General commands for local development, testing, debugging, and deployment. Replace placeholders (`myapp`, `3001`, paths) for your project.

---

## Python virtual environment

```bash
# Create venv with latest Python on your PATH
python3 -m venv venv

# Or pick a specific version (macOS with pyenv/homebrew)
python3.12 -m venv venv
/usr/local/bin/python3.11 -m venv venv

# Activate (macOS / Linux)
source venv/bin/activate

# Activate (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Activate (Windows CMD)
venv\Scripts\activate.bat

# Deactivate
deactivate

# Confirm which Python/pip you're using
which python
python --version
pip --version
```

---

## Python packages

```bash
# Install from requirements
pip install -r requirements.txt

# Upgrade pip itself
python -m pip install --upgrade pip

# Upgrade all installed packages (review before doing in production)
pip list --outdated
pip install --upgrade $(pip list --outdated --format=freeze | cut -d= -f1)

# Upgrade one package
pip install --upgrade fastapi uvicorn sqlalchemy

# Freeze current env to a file
pip freeze > requirements-lock.txt

# Install dev / test tools
pip install pytest pytest-asyncio pytest-cov coverage ruff mypy
```

---

## Node / npm

```bash
# Install dependencies from package.json
npm install

# Update package.json ranges to latest (review diff before committing)
npx npm-check-updates -u
npm install

# Update one package to latest
npm install react@latest
npm install -D typescript@latest

# Clean reinstall
rm -rf node_modules package-lock.json
npm install

# Outdated packages
npm outdated

# Audit vulnerabilities
npm audit
npm audit fix
```

---

## PostgreSQL

```bash
# Connect to default local instance
psql postgres

# Connect to a specific database
psql -h localhost -p 5432 -U postgres -d mydb

# Connection string (used by apps)
# postgresql://USER:PASSWORD@localhost:5432/DATABASE

# Create database
createdb mydb
# or inside psql:
# CREATE DATABASE mydb;

# Drop database (destructive)
dropdb mydb

# List databases
psql -l

# Run a SQL file
psql -d mydb -f script.sql

# One-liner query
psql -d mydb -c "SELECT count(*) FROM users;"
```

**Useful psql meta-commands (inside `psql`):**

```sql
\l          -- list databases
\c mydb     -- connect to database
\dt         -- list tables
\d users    -- describe table
\q          -- quit
```

**Alembic (migrations):**

```bash
alembic upgrade head
alembic downgrade -1
alembic revision --autogenerate -m "describe change"
alembic current
alembic history
```

---

## Docker — build, run, compose

```bash
# Build image
docker build -t myapp:latest .
docker build -f Dockerfile.dev -t myapp:dev .

# Run container
docker run -p 8000:8000 --env-file .env myapp:latest
docker run -it --rm myapp:latest /bin/sh   # shell inside container

# Run on a different host port (keep container port the same)
docker run -p 3002:3001 myapp:latest

# List / inspect
docker ps              # running
docker ps -a           # all
docker logs -f <container_id_or_name>
docker exec -it <container_id_or_name> /bin/sh

# Compose
docker compose up              # foreground
docker compose up -d           # detached
docker compose up --build      # rebuild then start
docker compose down            # stop and remove containers/networks
docker compose down -v         # also remove volumes (destructive — wipes DB data)
docker compose restart         # restart all services
docker compose restart api     # restart one service
docker compose build
docker compose build --no-cache
docker compose logs -f
docker compose ps
```

**Clean seed / fresh DB (wipe volumes so entrypoint re-runs migrations):**

```bash
cd /path/to/your/project
docker compose down -v
docker compose up --build
```

---

## Docker — ports & containers

```bash
# Find containers by port, name, or image
docker ps -a | grep -E "3001|myapp|deskzen" || echo "No matching containers found"
docker ps | grep 3001

# Check what is using a port (host)
lsof -i :3001          # macOS / Linux
lsof -i :8000
kill -9 <PID>          # stop the process using the port

# Stop containers
docker stop <container_name_or_id>
docker stop $(docker ps -q)    # stop ALL running containers

# Remove stopped containers
docker container prune
docker rm <container_name_or_id>
```

---

## Docker — images (tag, save, load, run elsewhere)

```bash
# Tag for registry or local reuse
docker tag myapp-backend:latest yourname/myapp-backend:latest

# Save image to tar (transfer to another machine)
docker save myapp-backend:latest -o myapp-backend.tar

# On the other machine: load and run
docker load -i myapp-backend.tar
docker run --name myapp-backend \
  -p 8000:8000 \
  -v myapp-backend-data:/data \
  -v myapp-backend-logs:/app/logs \
  myapp-backend:latest
```

---

## Docker — database inside container

**SQLite (example — adjust container name and path):**

```bash
# Open SQLite shell inside the backend container
docker exec -it myapp-backend sqlite3 /data/myapp.db
```

**PostgreSQL in Docker Compose:**

```bash
docker compose exec db psql -U postgres -d mydb
# or
docker exec -it <postgres_container_name> psql -U postgres -d mydb
```

---

## Docker — prune (free disk space)

Review what will be deleted before running prune commands.

```bash
docker system df
docker container prune         # stopped containers
docker image prune             # dangling images
docker volume prune            # unused volumes
docker network prune           # unused networks
docker system prune            # containers + networks + dangling images
docker system prune -a         # all unused images (aggressive)
docker builder prune           # build cache
```

---

## Tests & coverage

**pytest (basic):**

```bash
pytest                          # run all tests
pytest tests/                   # one directory
pytest path/to/test_file.py     # one file
pytest -k "test_login"          # name filter
pytest -v                       # verbose
pytest -x                       # stop on first failure
pytest -s                       # show print output
pytest --cov=app                # coverage via pytest-cov
```

**coverage.py (standalone):**

```bash
# Basic coverage run + report
coverage run -m pytest test_main.py -v && coverage report

# Branch coverage + missing lines + summary for key files
python main.py && coverage run --branch -m pytest test_main.py -v && \
  coverage report --show-missing | grep -E "^(main\.py|test_main\.py|TOTAL)" | \
  awk '{printf "%s - Line: %.2f%%, Branch: %.2f%%\n", $1, ($2-$3)/$2*100, ($4-$5)/$4*100}'

# HTML report (open htmlcov/index.html in browser)
coverage run -m pytest && coverage html

# Combine multiple runs
coverage combine
coverage report
```

**JavaScript / TypeScript:**

```bash
npm test                        # project test script
npm run test -- --watch         # watch mode (Vitest/Jest)
npm run type-check              # tsc --noEmit
npm run lint
npx vitest run
npx playwright test
npx playwright test --ui        # interactive UI
```

**HTTP / API smoke tests:**

```bash
curl http://localhost:8000/api/health
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'

# Concurrency smoke (requires hey: brew install hey)
hey -n 100 -c 10 http://localhost:8000/api/health
```

---

## Run / debug webapps

```bash
# FastAPI (dev)
uvicorn app.main:app --reload --port 8000
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4   # prod-ish

# Flask (dev)
flask --app app run --debug --port 5000

# Vite / React
npm run dev

# Next.js
npm run dev          # usually :3000
npm run build && npm start

# Django
python manage.py runserver
python manage.py migrate
```

---

## Bash (shell basics)

```bash
# Navigation & listing
pwd
ls -la
cd /path/to/project

# Environment
echo $PATH
export MY_VAR=value
set -a && source .env && set +a   # load .env into current shell

# Search / filter
grep -r "pattern" .
find . -name "*.py" -type f

# Process / port
ps aux | grep uvicorn
lsof -i :8000
kill <PID>
kill -9 <PID>

# Chaining (run next command only if previous succeeded)
cmd1 && cmd2
cmd1 || cmd2
cmd1 ; cmd2                       # always run cmd2

# Background
long_running_cmd &
jobs
fg %1
```

---

## Git (quick)

```bash
git status
git diff
git add -p
git commit -m "message"
git push -u origin HEAD
git pull --rebase
git log --oneline -10
```

---

## Environment files

```bash
cp .env.example .env
# Edit .env, then restart the app so it picks up changes
```

---

## OptiFlow (this project)

**Backend:**

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

createdb optiflow
python -m backend.app.seed
uvicorn backend.app.main:app --reload --port 8000
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev          # http://localhost:3000
npm run build
npm run type-check
npm run lint
```

**Tests & lint:**

```bash
pytest backend/tests agent/tests
ruff check .
mypy backend --strict           # if configured
```

**Demo credentials (after seed):**

| Email | Password | Role |
|-------|----------|------|

| <amit@demo-mfg.com> | password123 | owner |
| <ravi@demo-mfg.com> | password123 | planner |
| <priya@demo-mfg.com> | password123 | supervisor |

**API docs:** <http://localhost:8000/api/docs>
