"""Schemas for AuditLogs module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class AuditLogsBase(BaseModel):
    """Base schema for AuditLogs."""
    pass


class AuditLogsCreate(AuditLogsBase):
    """Schema for creating AuditLogs."""

    user_id: UUID | None = None
    tenant_id: UUID | None = None
    action: str
    target_entity: str | None = None
    target_id: UUID | None = None
    request_path: str
    request_method: str
    ip_address: str
    user_agent: str | None = None
    risk_level: str = "LOW"
    extra_data: dict | None = None


class AuditLogsUpdate(BaseModel):
    """Schema for updating AuditLogs."""
    pass


class AuditLogsResponse(AuditLogsBase):
    """Response schema for AuditLogs."""

    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class AuditLogsListResponse(BaseModel):
    """List response schema for AuditLogs."""

    items: list[AuditLogsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
