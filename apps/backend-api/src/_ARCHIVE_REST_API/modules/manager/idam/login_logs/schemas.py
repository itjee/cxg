"""Schemas for LoginLog module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class LoginLogBase(BaseModel):
    """Base schema for LoginLog."""
    pass


class LoginLogCreate(LoginLogBase):
    """Schema for creating LoginLog."""

    user_id: UUID | None = None
    user_type: str | None = None
    tenant_context: UUID | None = None
    username: str | None = None
    attempt_type: str
    success: bool
    failure_reason: str | None = None
    session_id: str | None = None
    ip_address: str
    user_agent: str | None = None
    country_code: str | None = None
    city: str | None = None
    mfa_used: bool = False
    mfa_method: str | None = None


class LoginLogUpdate(BaseModel):
    """Schema for updating LoginLog."""
    pass


class LoginLogResponse(LoginLogBase):
    """Response schema for LoginLog."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class LoginLogListResponse(BaseModel):
    """List response schema for LoginLog."""

    items: list[LoginLogResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
