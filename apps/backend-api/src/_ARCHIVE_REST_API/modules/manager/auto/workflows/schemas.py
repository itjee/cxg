"""Schemas for Workflows module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class WorkflowsBase(BaseModel):
    """Base schema for Workflows."""
    pass


class WorkflowsCreate(WorkflowsBase):
    """Schema for creating Workflows."""
    pass


class WorkflowsUpdate(BaseModel):
    """Schema for updating Workflows."""
    pass


class WorkflowsResponse(WorkflowsBase):
    """Response schema for Workflows."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class WorkflowsListResponse(BaseModel):
    """List response schema for Workflows."""

    items: list[WorkflowsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
