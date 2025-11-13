"""Business Documents schemas for request/response validation."""

from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field


class BusinessDocumentsBase(BaseModel):
    """Base schema."""
    pass


class BusinessDocumentsCreate(BaseModel):
    """Create schema."""
    pass


class BusinessDocumentsUpdate(BaseModel):
    """Update schema."""
    pass


class BusinessDocumentsResponse(BaseModel):
    """Response schema."""
    
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class BusinessDocumentsListResponse(BaseModel):
    """List response schema."""
    
    items: list[BusinessDocumentsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
