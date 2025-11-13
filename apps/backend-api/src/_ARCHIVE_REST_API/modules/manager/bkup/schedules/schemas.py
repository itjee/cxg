"""Schemas for Schedules module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class SchedulesBase(BaseModel):
    """Base schema for Schedules."""
    pass


class SchedulesCreate(SchedulesBase):
    """Schema for creating Schedules."""
    pass


class SchedulesUpdate(BaseModel):
    """Schema for updating Schedules."""
    pass


class SchedulesResponse(SchedulesBase):
    """Response schema for Schedules."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class SchedulesListResponse(BaseModel):
    """List response schema for Schedules."""

    items: list[SchedulesResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
