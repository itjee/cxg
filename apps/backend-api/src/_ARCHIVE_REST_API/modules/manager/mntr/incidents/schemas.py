"""Schemas for Incidents module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class IncidentsBase(BaseModel):
    """Base schema for Incidents."""
    pass


class IncidentsCreate(IncidentsBase):
    """Schema for creating Incidents."""
    pass


class IncidentsUpdate(BaseModel):
    """Schema for updating Incidents."""
    pass


class IncidentsResponse(IncidentsBase):
    """Response schema for Incidents."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class IncidentsListResponse(BaseModel):
    """List response schema for Incidents."""

    items: list[IncidentsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
