"""Partners schemas for request/response validation."""

from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field


class PartnersBase(BaseModel):
    """Base schema."""
    pass


class PartnersCreate(BaseModel):
    """Create schema."""
    pass


class PartnersUpdate(BaseModel):
    """Update schema."""
    pass


class PartnersResponse(BaseModel):
    """Response schema."""
    
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class PartnersListResponse(BaseModel):
    """List response schema."""
    
    items: list[PartnersResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
