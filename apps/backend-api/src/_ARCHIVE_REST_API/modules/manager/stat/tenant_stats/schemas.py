"""Schemas for TenantStats module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class TenantStatsBase(BaseModel):
    """Base schema for TenantStats."""
    pass


class TenantStatsCreate(TenantStatsBase):
    """Schema for creating TenantStats."""
    pass


class TenantStatsUpdate(BaseModel):
    """Schema for updating TenantStats."""
    pass


class TenantStatsResponse(TenantStatsBase):
    """Response schema for TenantStats."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class TenantStatsListResponse(BaseModel):
    """List response schema for TenantStats."""

    items: list[TenantStatsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
