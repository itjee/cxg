"""Schemas for UsageStats module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class UsageStatsBase(BaseModel):
    """Base schema for UsageStats."""
    pass


class UsageStatsCreate(UsageStatsBase):
    """Schema for creating UsageStats."""
    pass


class UsageStatsUpdate(BaseModel):
    """Schema for updating UsageStats."""
    pass


class UsageStatsResponse(UsageStatsBase):
    """Response schema for UsageStats."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class UsageStatsListResponse(BaseModel):
    """List response schema for UsageStats."""

    items: list[UsageStatsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
