"""Schemas for ServiceQuotas module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ServiceQuotasBase(BaseModel):
    """Base schema for ServiceQuotas."""
    pass


class ServiceQuotasCreate(ServiceQuotasBase):
    """Schema for creating ServiceQuotas."""
    pass


class ServiceQuotasUpdate(BaseModel):
    """Schema for updating ServiceQuotas."""
    pass


class ServiceQuotasResponse(ServiceQuotasBase):
    """Response schema for ServiceQuotas."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class ServiceQuotasListResponse(BaseModel):
    """List response schema for ServiceQuotas."""

    items: list[ServiceQuotasResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
