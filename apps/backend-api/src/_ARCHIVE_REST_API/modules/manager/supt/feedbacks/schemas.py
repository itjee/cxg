"""Schemas for Feedbacks module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class FeedbacksBase(BaseModel):
    """Base schema for Feedbacks."""
    pass


class FeedbacksCreate(FeedbacksBase):
    """Schema for creating Feedbacks."""
    pass


class FeedbacksUpdate(BaseModel):
    """Schema for updating Feedbacks."""
    pass


class FeedbacksResponse(FeedbacksBase):
    """Response schema for Feedbacks."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class FeedbacksListResponse(BaseModel):
    """List response schema for Feedbacks."""

    items: list[FeedbacksResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
