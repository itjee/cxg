"""Sales Invoices schemas for request/response validation."""

from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field


class SalesInvoicesBase(BaseModel):
    """Base schema."""
    pass


class SalesInvoicesCreate(BaseModel):
    """Create schema."""
    pass


class SalesInvoicesUpdate(BaseModel):
    """Update schema."""
    pass


class SalesInvoicesResponse(BaseModel):
    """Response schema."""
    
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class SalesInvoicesListResponse(BaseModel):
    """List response schema."""
    
    items: list[SalesInvoicesResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
