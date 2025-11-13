"""Accounts Receivable schemas for request/response validation."""

from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field


class AccountsReceivableBase(BaseModel):
    """Base schema."""
    pass


class AccountsReceivableCreate(BaseModel):
    """Create schema."""
    pass


class AccountsReceivableUpdate(BaseModel):
    """Update schema."""
    pass


class AccountsReceivableResponse(BaseModel):
    """Response schema."""
    
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class AccountsReceivableListResponse(BaseModel):
    """List response schema."""
    
    items: list[AccountsReceivableResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
