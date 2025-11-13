"""Employees schemas for request/response validation."""

from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field


class EmployeesBase(BaseModel):
    """Base schema."""
    pass


class EmployeesCreate(BaseModel):
    """Create schema."""
    pass


class EmployeesUpdate(BaseModel):
    """Update schema."""
    pass


class EmployeesResponse(BaseModel):
    """Response schema."""
    
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class EmployeesListResponse(BaseModel):
    """List response schema."""
    
    items: list[EmployeesResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
