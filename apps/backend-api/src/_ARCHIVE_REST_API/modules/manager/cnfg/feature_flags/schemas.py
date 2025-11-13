"""Schemas for FeatureFlags module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class FeatureFlagsBase(BaseModel):
    """Base schema for FeatureFlags."""
    pass


class FeatureFlagsCreate(FeatureFlagsBase):
    """Schema for creating FeatureFlags."""
    pass


class FeatureFlagsUpdate(BaseModel):
    """Schema for updating FeatureFlags."""
    pass


class FeatureFlagsResponse(FeatureFlagsBase):
    """Response schema for FeatureFlags."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class FeatureFlagsListResponse(BaseModel):
    """List response schema for FeatureFlags."""

    items: list[FeatureFlagsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
