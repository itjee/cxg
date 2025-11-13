"""Tax Invoices schemas for request/response validation."""

from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field


class TaxInvoicesBase(BaseModel):
    """Base schema."""
    pass


class TaxInvoicesCreate(BaseModel):
    """Create schema."""
    pass


class TaxInvoicesUpdate(BaseModel):
    """Update schema."""
    pass


class TaxInvoicesResponse(BaseModel):
    """Response schema."""
    
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class TaxInvoicesListResponse(BaseModel):
    """List response schema."""
    
    items: list[TaxInvoicesResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
