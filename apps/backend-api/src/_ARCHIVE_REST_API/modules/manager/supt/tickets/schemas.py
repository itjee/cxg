"""Schemas for Tickets module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class TicketsBase(BaseModel):
    """Base schema for Tickets."""
    pass


class TicketsCreate(TicketsBase):
    """Schema for creating Tickets."""
    pass


class TicketsUpdate(BaseModel):
    """Schema for updating Tickets."""
    pass


class TicketsResponse(TicketsBase):
    """Response schema for Tickets."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class TicketsListResponse(BaseModel):
    """List response schema for Tickets."""

    items: list[TicketsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
