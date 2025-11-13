"""Schemas for Permission module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class PermissionBase(BaseModel):
    """Base schema for Permission."""
    pass


class PermissionCreate(PermissionBase):
    """Schema for creating Permission."""
    pass


class PermissionUpdate(BaseModel):
    """Schema for updating Permission."""
    pass


class PermissionResponse(PermissionBase):
    """Response schema for Permission."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class PermissionListResponse(BaseModel):
    """List response schema for Permission."""

    items: list[PermissionResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
