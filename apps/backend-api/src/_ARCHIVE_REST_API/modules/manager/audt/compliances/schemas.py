"""Schemas for Compliances module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class CompliancesBase(BaseModel):
    """Base schema for Compliances."""
    pass


class CompliancesCreate(CompliancesBase):
    """Schema for creating Compliances."""
    pass


class CompliancesUpdate(BaseModel):
    """Schema for updating Compliances."""
    pass


class CompliancesResponse(CompliancesBase):
    """Response schema for Compliances."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class CompliancesListResponse(BaseModel):
    """List response schema for Compliances."""

    items: list[CompliancesResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
