"""Schemas for ApiKey module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ApiKeyBase(BaseModel):
    """Base schema for ApiKey."""
    pass


class ApiKeyCreate(ApiKeyBase):
    """Schema for creating ApiKey."""
    pass


class ApiKeyUpdate(BaseModel):
    """Schema for updating ApiKey."""
    pass


class ApiKeyResponse(ApiKeyBase):
    """Response schema for ApiKey."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class ApiKeyListResponse(BaseModel):
    """List response schema for ApiKey."""

    items: list[ApiKeyResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
