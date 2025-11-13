"""Payment Transactions schemas for request/response validation."""

from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field


class PaymentTransactionsBase(BaseModel):
    """Base schema."""
    pass


class PaymentTransactionsCreate(BaseModel):
    """Create schema."""
    pass


class PaymentTransactionsUpdate(BaseModel):
    """Update schema."""
    pass


class PaymentTransactionsResponse(BaseModel):
    """Response schema."""
    
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class PaymentTransactionsListResponse(BaseModel):
    """List response schema."""
    
    items: list[PaymentTransactionsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
