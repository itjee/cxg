"""Schemas for Policies module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class PoliciesBase(BaseModel):
    """Base schema for Policies."""
    pass


class PoliciesCreate(PoliciesBase):
    """Schema for creating Policies."""
    pass


class PoliciesUpdate(BaseModel):
    """Schema for updating Policies."""
    pass


class PoliciesResponse(PoliciesBase):
    """Response schema for Policies."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class PoliciesListResponse(BaseModel):
    """List response schema for Policies."""

    items: list[PoliciesResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
