"""Contracts schemas for request/response validation."""

from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field


class ContractsBase(BaseModel):
    """Base schema."""
    pass


class ContractsCreate(BaseModel):
    """Create schema."""
    pass


class ContractsUpdate(BaseModel):
    """Update schema."""
    pass


class ContractsResponse(BaseModel):
    """Response schema."""
    
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class ContractsListResponse(BaseModel):
    """List response schema."""
    
    items: list[ContractsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
