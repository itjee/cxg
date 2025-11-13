"""Schemas for TenantFeatures module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class TenantFeaturesBase(BaseModel):
    """Base schema for TenantFeatures."""
    pass


class TenantFeaturesCreate(TenantFeaturesBase):
    """Schema for creating TenantFeatures."""
    pass


class TenantFeaturesUpdate(BaseModel):
    """Schema for updating TenantFeatures."""
    pass


class TenantFeaturesResponse(TenantFeaturesBase):
    """Response schema for TenantFeatures."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class TenantFeaturesListResponse(BaseModel):
    """List response schema for TenantFeatures."""

    items: list[TenantFeaturesResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
