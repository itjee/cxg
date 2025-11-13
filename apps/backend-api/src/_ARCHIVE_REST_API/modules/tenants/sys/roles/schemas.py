"""
시스템 역할 정보를 관리하는 테이블 (RBAC - Role-Based Access Control 구현)

Pydantic schemas for Roles model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class RolesBase(BaseModel):
    """Base schema for Roles"""
    model_config = ConfigDict(from_attributes=True)

    code: str = Field(max_length=50, description="역할 코드 (테넌트 내 유니크, 예: ADMIN, MANAGER, USER)")
    name: str = Field(max_length=100, description="역할명 (사용자에게 표시되는 이름)")
    description: str | None = Field(None, description="역할 설명")
    is_system_role: bool | None = Field(default=False, description="시스템 기본 역할 여부 (true: 시스템 기본 역할/삭제 불가, false: 사용자 정의 역할)")
    is_active: bool | None = Field(default=True, description="활성 상태")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class RolesCreate(RolesBase):
    """Schema for creating Roles"""

    # Exclude auto-generated fields
    pass


class RolesUpdate(BaseModel):
    """Schema for updating Roles (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    code: str | None = Field(None, max_length=50, description="역할 코드 (테넌트 내 유니크, 예: ADMIN, MANAGER, USER)")
    name: str | None = Field(None, max_length=100, description="역할명 (사용자에게 표시되는 이름)")
    description: str | None = Field(None, description="역할 설명")
    is_system_role: bool | None = Field(default=False, description="시스템 기본 역할 여부 (true: 시스템 기본 역할/삭제 불가, false: 사용자 정의 역할)")
    is_active: bool | None = Field(default=True, description="활성 상태")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class RolesResponse(RolesBase):
    """Schema for Roles response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class RolesListResponse(BaseModel):
    """Schema for paginated Roles list response"""

    items: list[RolesResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "RolesBase",
    "RolesCreate",
    "RolesUpdate",
    "RolesResponse",
    "RolesListResponse",
]
