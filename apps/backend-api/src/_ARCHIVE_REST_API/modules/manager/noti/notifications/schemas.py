"""Schemas for Notifications module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class NotificationsBase(BaseModel):
    """Base schema for Notifications."""
    pass


class NotificationsCreate(NotificationsBase):
    """Schema for creating Notifications."""
    pass


class NotificationsUpdate(BaseModel):
    """Schema for updating Notifications."""
    pass


class NotificationsResponse(NotificationsBase):
    """Response schema for Notifications."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class NotificationsListResponse(BaseModel):
    """List response schema for Notifications."""

    items: list[NotificationsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
