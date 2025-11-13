"""Schemas for Webhooks module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class WebhooksBase(BaseModel):
    """Base schema for Webhooks."""
    pass


class WebhooksCreate(WebhooksBase):
    """Schema for creating Webhooks."""
    pass


class WebhooksUpdate(BaseModel):
    """Schema for updating Webhooks."""
    pass


class WebhooksResponse(WebhooksBase):
    """Response schema for Webhooks."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class WebhooksListResponse(BaseModel):
    """List response schema for Webhooks."""

    items: list[WebhooksResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
