"""Schemas for HealthChecks module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class HealthChecksBase(BaseModel):
    """Base schema for HealthChecks."""
    pass


class HealthChecksCreate(HealthChecksBase):
    """Schema for creating HealthChecks."""
    pass


class HealthChecksUpdate(BaseModel):
    """Schema for updating HealthChecks."""
    pass


class HealthChecksResponse(HealthChecksBase):
    """Response schema for HealthChecks."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class HealthChecksListResponse(BaseModel):
    """List response schema for HealthChecks."""

    items: list[HealthChecksResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
