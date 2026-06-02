"""FastAPI application entry point."""

import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.core.config import settings
from backend.app.core.database import close_db

settings.configure_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    logger.info("Starting OptiFlow API...")
    yield
    logger.info("Shutting down OptiFlow API...")
    await close_db()


app = FastAPI(
    title=settings.app_name,
    description="AI-powered CNC Job Shop scheduling",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error(
        f"Unhandled exception: {exc}",
        exc_info=True,
        extra={"path": request.url.path, "method": request.method},
    )
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "type": "internal_error"},
    )


# --- Slice A: Auth + Current User (implemented - reference for other slices) ---
from backend.app.api.routes import auth  # noqa: E402
from backend.app.api.routes import me  # noqa: E402

app.include_router(auth.router, prefix="/api/v1")
app.include_router(me.router, prefix="/api/v1")

# --- Slice B: Master Data (uncomment after implementing) ---
# from backend.app.api.routes import machines, orders  # noqa: E402
# app.include_router(machines.router, prefix="/api/v1")
# app.include_router(orders.router, prefix="/api/v1")

# --- Slice C: Runs (uncomment after implementing) ---
# from backend.app.api.routes import runs  # noqa: E402
# app.include_router(runs.router, prefix="/api/v1")

# --- Slice D: Schedule & Metrics (uncomment after implementing) ---
# from backend.app.api.routes import schedule  # noqa: E402
# app.include_router(schedule.router, prefix="/api/v1")

# --- Slice E: Events, Alerts & Actuals (uncomment after implementing) ---
# from backend.app.api.routes import events  # noqa: E402
# app.include_router(events.router, prefix="/api/v1")

# --- Slice F: Agent (uncomment after implementing) ---
# from backend.app.api.routes import agent  # noqa: E402
# app.include_router(agent.router, prefix="/api/v1")


@app.get("/api/health")
async def health_check() -> dict:
    return {"status": "healthy", "service": settings.app_name}


@app.get("/")
async def root() -> dict:
    return {
        "message": "OptiFlow API",
        "docs": "/api/docs",
        "health": "/api/health",
    }
