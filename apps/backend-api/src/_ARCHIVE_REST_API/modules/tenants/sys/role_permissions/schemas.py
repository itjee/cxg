"""
역할과 권한의 매핑 테이블 (RBAC 구현을 위한 역할별 권한 할당 관리)

Pydantic schemas for RolePermissions model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class RolePermissionsBase(BaseModel):
    """Base schema for RolePermissions"""
    model_config = ConfigDict(from_attributes=True)

    role_id: UUID = Field(description="역할 ID")
    permission_id: UUID = Field(description="권한 ID")
    is_active: bool | None = Field(default=True, description="활성 상태")


class RolePermissionsCreate(RolePermissionsBase):
    """Schema for creating RolePermissions"""

    # Exclude auto-generated fields
    pass


class RolePermissionsUpdate(BaseModel):
    """Schema for updating RolePermissions (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    role_id: UUID | None = Field(None, description="역할 ID")
    permission_id: UUID | None = Field(None, description="권한 ID")
    is_active: bool | None = Field(default=True, description="활성 상태")


class RolePermissionsResponse(RolePermissionsBase):
    """Schema for RolePermissions response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class RolePermissionsListResponse(BaseModel):
    """Schema for paginated RolePermissions list response"""

    items: list[RolePermissionsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "RolePermissionsBase",
    "RolePermissionsCreate",
    "RolePermissionsUpdate",
    "RolePermissionsResponse",
    "RolePermissionsListResponse",
]
