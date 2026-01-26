"""Custom SQLAlchemy types for cross-database compatibility."""

import json
import uuid
from typing import Any, List, Optional

from sqlalchemy import String, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.types import TypeDecorator


class GUID(TypeDecorator):
    """Platform-independent GUID type.
    
    Uses PostgreSQL's UUID type when available, otherwise uses
    a CHAR(36), storing as stringified hex values.
    """
    impl = String(36)
    cache_ok = True
    
    def load_dialect_impl(self, dialect: Any) -> Any:
        if dialect.name == "postgresql":
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        else:
            return dialect.type_descriptor(String(36))
    
    def process_bind_param(self, value: Any, dialect: Any) -> Any:
        if value is None:
            return value
        elif dialect.name == "postgresql":
            return value
        else:
            if isinstance(value, uuid.UUID):
                return str(value)
            return value
    
    def process_result_value(self, value: Any, dialect: Any) -> Any:
        if value is None:
            return value
        if isinstance(value, uuid.UUID):
            return value
        return uuid.UUID(value)


class Vector(TypeDecorator):
    """Platform-independent vector type for embeddings.
    
    Uses pgvector's VECTOR type when available (PostgreSQL),
    otherwise stores as JSON-encoded TEXT (for SQLite testing).
    """
    impl = Text
    cache_ok = True
    
    def __init__(self, dim: Optional[int] = None) -> None:
        """Initialize vector type with optional dimension.
        
        Args:
            dim: Vector dimension (required for PostgreSQL pgvector)
        """
        super().__init__()
        self.dim = dim
    
    def load_dialect_impl(self, dialect: Any) -> Any:
        if dialect.name == "postgresql":
            # Import pgvector type only when using PostgreSQL
            try:
                from pgvector.sqlalchemy import Vector as PGVector
                return dialect.type_descriptor(PGVector(self.dim))
            except ImportError:
                # Fallback if pgvector not installed
                return dialect.type_descriptor(Text())
        else:
            # SQLite: store as JSON text
            return dialect.type_descriptor(Text())
    
    def process_bind_param(self, value: Any, dialect: Any) -> Any:
        if value is None:
            return value
        elif dialect.name == "postgresql":
            # pgvector expects list or numpy array
            return value
        else:
            # SQLite: JSON encode the list
            return json.dumps(value) if isinstance(value, list) else value
    
    def process_result_value(self, value: Any, dialect: Any) -> Optional[List[float]]:
        if value is None:
            return value
        if dialect.name == "postgresql":
            # pgvector returns a list already
            return list(value) if hasattr(value, "__iter__") else value
        else:
            # SQLite: decode JSON
            if isinstance(value, str):
                return json.loads(value)
            return value
