"""Schemas for Campaigns module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class CampaignsBase(BaseModel):
    """Base schema for Campaigns."""
    pass


class CampaignsCreate(CampaignsBase):
    """Schema for creating Campaigns."""
    pass


class CampaignsUpdate(BaseModel):
    """Schema for updating Campaigns."""
    pass


class CampaignsResponse(CampaignsBase):
    """Response schema for Campaigns."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class CampaignsListResponse(BaseModel):
    """List response schema for Campaigns."""

    items: list[CampaignsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
