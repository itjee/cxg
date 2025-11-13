"""Accounts Payable schemas for request/response validation."""

from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field


class AccountsPayableBase(BaseModel):
    """Base schema."""
    pass


class AccountsPayableCreate(BaseModel):
    """Create schema."""
    pass


class AccountsPayableUpdate(BaseModel):
    """Update schema."""
    pass


class AccountsPayableResponse(BaseModel):
    """Response schema."""
    
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class AccountsPayableListResponse(BaseModel):
    """List response schema."""
    
    items: list[AccountsPayableResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
