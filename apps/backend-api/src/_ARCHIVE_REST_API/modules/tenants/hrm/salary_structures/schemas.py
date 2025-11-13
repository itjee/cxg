"""Salary Structures schemas for request/response validation."""

from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field


class SalaryStructuresBase(BaseModel):
    """Base schema."""
    pass


class SalaryStructuresCreate(BaseModel):
    """Create schema."""
    pass


class SalaryStructuresUpdate(BaseModel):
    """Update schema."""
    pass


class SalaryStructuresResponse(BaseModel):
    """Response schema."""
    
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class SalaryStructuresListResponse(BaseModel):
    """List response schema."""
    
    items: list[SalaryStructuresResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
