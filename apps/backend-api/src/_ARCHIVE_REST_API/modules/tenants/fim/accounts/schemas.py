"""Accounts schemas for request/response validation."""

from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field


class AccountsBase(BaseModel):
    """Base schema."""
    pass


class AccountsCreate(BaseModel):
    """Create schema."""
    pass


class AccountsUpdate(BaseModel):
    """Update schema."""
    pass


class AccountsResponse(BaseModel):
    """Response schema."""
    
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class AccountsListResponse(BaseModel):
    """List response schema."""
    
    items: list[AccountsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
