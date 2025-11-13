"""Schemas for Executions module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ExecutionsBase(BaseModel):
    """Base schema for Executions."""
    pass


class ExecutionsCreate(ExecutionsBase):
    """Schema for creating Executions."""
    pass


class ExecutionsUpdate(BaseModel):
    """Schema for updating Executions."""
    pass


class ExecutionsResponse(ExecutionsBase):
    """Response schema for Executions."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class ExecutionsListResponse(BaseModel):
    """List response schema for Executions."""

    items: list[ExecutionsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
