"""Schemas for TicketComments module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class TicketCommentsBase(BaseModel):
    """Base schema for TicketComments."""
    pass


class TicketCommentsCreate(TicketCommentsBase):
    """Schema for creating TicketComments."""
    pass


class TicketCommentsUpdate(BaseModel):
    """Schema for updating TicketComments."""
    pass


class TicketCommentsResponse(TicketCommentsBase):
    """Response schema for TicketComments."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class TicketCommentsListResponse(BaseModel):
    """List response schema for TicketComments."""

    items: list[TicketCommentsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
