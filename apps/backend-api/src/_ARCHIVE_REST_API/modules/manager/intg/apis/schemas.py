"""Schemas for Apis module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ApisBase(BaseModel):
    """Base schema for Apis."""
    pass


class ApisCreate(ApisBase):
    """Schema for creating Apis."""
    pass


class ApisUpdate(BaseModel):
    """Schema for updating Apis."""
    pass


class ApisResponse(ApisBase):
    """Response schema for Apis."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class ApisListResponse(BaseModel):
    """List response schema for Apis."""

    items: list[ApisResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
