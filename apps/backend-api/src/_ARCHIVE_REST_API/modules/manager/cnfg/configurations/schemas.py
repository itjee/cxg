"""Schemas for Configurations module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ConfigurationsBase(BaseModel):
    """Base schema for Configurations."""
    pass


class ConfigurationsCreate(ConfigurationsBase):
    """Schema for creating Configurations."""
    pass


class ConfigurationsUpdate(BaseModel):
    """Schema for updating Configurations."""
    pass


class ConfigurationsResponse(ConfigurationsBase):
    """Response schema for Configurations."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class ConfigurationsListResponse(BaseModel):
    """List response schema for Configurations."""

    items: list[ConfigurationsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
