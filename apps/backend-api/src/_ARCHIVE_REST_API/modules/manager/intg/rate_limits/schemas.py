"""Schemas for RateLimits module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class RateLimitsBase(BaseModel):
    """Base schema for RateLimits."""
    pass


class RateLimitsCreate(RateLimitsBase):
    """Schema for creating RateLimits."""
    pass


class RateLimitsUpdate(BaseModel):
    """Schema for updating RateLimits."""
    pass


class RateLimitsResponse(RateLimitsBase):
    """Response schema for RateLimits."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class RateLimitsListResponse(BaseModel):
    """List response schema for RateLimits."""

    items: list[RateLimitsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
