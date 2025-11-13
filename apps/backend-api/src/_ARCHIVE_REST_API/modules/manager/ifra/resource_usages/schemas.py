"""Schemas for ResourceUsages module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ResourceUsagesBase(BaseModel):
    """Base schema for ResourceUsages."""
    pass


class ResourceUsagesCreate(ResourceUsagesBase):
    """Schema for creating ResourceUsages."""
    pass


class ResourceUsagesUpdate(BaseModel):
    """Schema for updating ResourceUsages."""
    pass


class ResourceUsagesResponse(ResourceUsagesBase):
    """Response schema for ResourceUsages."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class ResourceUsagesListResponse(BaseModel):
    """List response schema for ResourceUsages."""

    items: list[ResourceUsagesResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
