"""
시스템의 모든 권한을 정의하는 마스터 테이블 (모듈별 리소스에 대한 액션 권한 관리)

Pydantic schemas for Permissions model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class PermissionsBase(BaseModel):
    """Base schema for Permissions"""
    model_config = ConfigDict(from_attributes=True)

    code: str = Field(max_length=100, description="권한 코드 (전체 시스템 유니크, 예: ADM_USERS_CREATE)")
    name: str = Field(max_length=200, description="권한명 (사용자에게 표시되는 이름)")
    module_code: str = Field(max_length=50, description="모듈 코드 (ADM, PSM, SRM, IVM, LWM, CSM, ASM, FIM, BIM, COM, SYS)")
    resource: str = Field(max_length=100, description="리소스명 (권한이 적용되는 대상: 테이블명, 화면명, 기능명 등)")
    action: str = Field(max_length=50, description="액션 (리소스에 대한 작업: CREATE, READ, UPDATE, DELETE, APPROVE, EXPORT 등)")
    description: str | None = Field(None, description="권한 설명")
    is_active: bool | None = Field(default=True, description="활성 상태")


class PermissionsCreate(PermissionsBase):
    """Schema for creating Permissions"""

    # Exclude auto-generated fields
    pass


class PermissionsUpdate(BaseModel):
    """Schema for updating Permissions (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    code: str | None = Field(None, max_length=100, description="권한 코드 (전체 시스템 유니크, 예: ADM_USERS_CREATE)")
    name: str | None = Field(None, max_length=200, description="권한명 (사용자에게 표시되는 이름)")
    module_code: str | None = Field(None, max_length=50, description="모듈 코드 (ADM, PSM, SRM, IVM, LWM, CSM, ASM, FIM, BIM, COM, SYS)")
    resource: str | None = Field(None, max_length=100, description="리소스명 (권한이 적용되는 대상: 테이블명, 화면명, 기능명 등)")
    action: str | None = Field(None, max_length=50, description="액션 (리소스에 대한 작업: CREATE, READ, UPDATE, DELETE, APPROVE, EXPORT 등)")
    description: str | None = Field(None, description="권한 설명")
    is_active: bool | None = Field(default=True, description="활성 상태")


class PermissionsResponse(PermissionsBase):
    """Schema for Permissions response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class PermissionsListResponse(BaseModel):
    """Schema for paginated Permissions list response"""

    items: list[PermissionsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "PermissionsBase",
    "PermissionsCreate",
    "PermissionsUpdate",
    "PermissionsResponse",
    "PermissionsListResponse",
]
