"""Schemas for RecoveryPlans module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class RecoveryPlansBase(BaseModel):
    """Base schema for RecoveryPlans."""
    pass


class RecoveryPlansCreate(RecoveryPlansBase):
    """Schema for creating RecoveryPlans."""
    pass


class RecoveryPlansUpdate(BaseModel):
    """Schema for updating RecoveryPlans."""
    pass


class RecoveryPlansResponse(RecoveryPlansBase):
    """Response schema for RecoveryPlans."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class RecoveryPlansListResponse(BaseModel):
    """List response schema for RecoveryPlans."""

    items: list[RecoveryPlansResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
