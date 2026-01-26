"""FastAPI application entry point.

This is the main application that wires together all routes and middleware.
"""

import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.api.routes import auth
from backend.app.core.config import settings
from backend.app.core.database import close_db, init_db

# Configure logging
settings.configure_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan handler for startup/shutdown."""
    logger.info("Starting up CNC Job Shop API...")
    # In production, use Alembic migrations instead of init_db
    # await init_db()
    yield
    logger.info("Shutting down CNC Job Shop API...")
    await close_db()


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="AI-powered CNC Job Shop scheduling with multi-tenant support",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)


# CORS middleware (configure for Next.js frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler for loud failures
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle uncaught exceptions with logging.
    
    Never fail silently - always log and return structured error.
    """
    logger.error(
        f"Unhandled exception: {exc}",
        exc_info=True,
        extra={
            "path": request.url.path,
            "method": request.method,
        }
    )
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "type": "internal_error",
        },
    )


# Include routers
app.include_router(auth.router, prefix="/api/v1")

# Import and include all routers
from backend.app.api.routes import (
    runs, agent, events, drafts, reschedule, compare, 
    actuals, metrics, kb, publish, replan, ai_metrics
)

app.include_router(runs.router, prefix="/api/v1")
app.include_router(agent.router, prefix="/api/v1")
app.include_router(events.router, prefix="/api/v1")
app.include_router(drafts.router, prefix="/api/v1")
app.include_router(reschedule.router, prefix="/api/v1")
app.include_router(compare.router, prefix="/api/v1")
app.include_router(actuals.router, prefix="/api/v1")
app.include_router(metrics.router, prefix="/api/v1")
app.include_router(kb.router, prefix="/api/v1")
app.include_router(publish.router, prefix="/api/v1")
app.include_router(replan.router, prefix="/api/v1")
app.include_router(ai_metrics.router, prefix="/api/v1")


# Health check endpoint
@app.get("/api/health")
async def health_check() -> dict:
    """Health check endpoint for load balancers."""
    return {"status": "healthy", "service": settings.app_name}


# Root redirect to docs
@app.get("/")
async def root() -> dict:
    """Root endpoint with API info."""
    return {
        "message": "CNC Job Shop API",
        "docs": "/api/docs",
        "health": "/api/health",
    }
