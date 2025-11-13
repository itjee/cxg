"""Schemas for SystemMetrics module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class SystemMetricsBase(BaseModel):
    """Base schema for SystemMetrics."""
    pass


class SystemMetricsCreate(SystemMetricsBase):
    """Schema for creating SystemMetrics."""
    pass


class SystemMetricsUpdate(BaseModel):
    """Schema for updating SystemMetrics."""
    pass


class SystemMetricsResponse(SystemMetricsBase):
    """Response schema for SystemMetrics."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class SystemMetricsListResponse(BaseModel):
    """List response schema for SystemMetrics."""

    items: list[SystemMetricsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
