"""Schemas for Tasks module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class TasksBase(BaseModel):
    """Base schema for Tasks."""
    pass


class TasksCreate(TasksBase):
    """Schema for creating Tasks."""
    pass


class TasksUpdate(BaseModel):
    """Schema for updating Tasks."""
    pass


class TasksResponse(TasksBase):
    """Response schema for Tasks."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class TasksListResponse(BaseModel):
    """List response schema for Tasks."""

    items: list[TasksResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
