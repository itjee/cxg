"""Schemas for UserRole module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class UserRoleBase(BaseModel):
    """Base schema for UserRole."""
    pass


class UserRoleCreate(UserRoleBase):
    """Schema for creating UserRole."""
    pass


class UserRoleUpdate(BaseModel):
    """Schema for updating UserRole."""
    pass


class UserRoleResponse(UserRoleBase):
    """Response schema for UserRole."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class UserRoleListResponse(BaseModel):
    """List response schema for UserRole."""

    items: list[UserRoleResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
