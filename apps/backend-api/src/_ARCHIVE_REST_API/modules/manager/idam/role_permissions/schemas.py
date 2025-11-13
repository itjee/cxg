"""Schemas for RolePermission module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class RolePermissionBase(BaseModel):
    """Base schema for RolePermission."""
    pass


class RolePermissionCreate(RolePermissionBase):
    """Schema for creating RolePermission."""
    pass


class RolePermissionUpdate(BaseModel):
    """Schema for updating RolePermission."""
    pass


class RolePermissionResponse(RolePermissionBase):
    """Response schema for RolePermission."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class RolePermissionListResponse(BaseModel):
    """List response schema for RolePermission."""

    items: list[RolePermissionResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
