"""Partner Addresses schemas for request/response validation."""

from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field


class PartnerAddressesBase(BaseModel):
    """Base schema."""
    pass


class PartnerAddressesCreate(BaseModel):
    """Create schema."""
    pass


class PartnerAddressesUpdate(BaseModel):
    """Update schema."""
    pass


class PartnerAddressesResponse(BaseModel):
    """Response schema."""
    
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class PartnerAddressesListResponse(BaseModel):
    """List response schema."""
    
    items: list[PartnerAddressesResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
