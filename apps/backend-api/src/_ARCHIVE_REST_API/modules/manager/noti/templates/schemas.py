"""Schemas for Templates module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class TemplatesBase(BaseModel):
    """Base schema for Templates."""
    pass


class TemplatesCreate(TemplatesBase):
    """Schema for creating Templates."""
    pass


class TemplatesUpdate(BaseModel):
    """Schema for updating Templates."""
    pass


class TemplatesResponse(TemplatesBase):
    """Response schema for Templates."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class TemplatesListResponse(BaseModel):
    """List response schema for Templates."""

    items: list[TemplatesResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
