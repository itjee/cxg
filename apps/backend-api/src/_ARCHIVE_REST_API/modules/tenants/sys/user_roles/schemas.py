"""
Pydantic schemas for UserRoles model.

테넌트 사용자-역할 매핑 스키마
"""

from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class UserRolesBase(BaseModel):
    """Base schema for UserRoles"""
    model_config = ConfigDict(from_attributes=True)

    user_id: UUID = Field(..., description="사용자 ID")
    role_id: UUID = Field(..., description="역할 ID")
    granted_at: datetime = Field(default_factory=datetime.now, description="할당 시각")
    granted_by: Optional[UUID] = Field(None, description="할당자 ID")
    expires_at: Optional[datetime] = Field(None, description="역할 만료 시각 (NULL: 무기한)")
    conflict_resolution_policy_id: Optional[UUID] = Field(None, description="이 역할 할당에 적용될 권한 충돌 해결 정책 ID")
    is_active: bool = Field(default=True, description="활성 여부")


class UserRolesCreate(UserRolesBase):
    """Schema for creating UserRoles"""
    user_id: UUID = Field(...)
    role_id: UUID = Field(...)


class UserRolesUpdate(BaseModel):
    """Schema for updating UserRoles"""
    model_config = ConfigDict(from_attributes=True)

    expires_at: Optional[datetime] = Field(None, description="역할 만료 시각")
    conflict_resolution_policy_id: Optional[UUID] = Field(None, description="권한 충돌 해결 정책 ID")
    is_active: Optional[bool] = Field(None, description="활성 여부")


class UserRolesRevoke(BaseModel):
    """Schema for revoking UserRoles"""
    model_config = ConfigDict(from_attributes=True)

    revoke_reason: Optional[str] = Field(None, description="해제 사유")


class UserRolesResponse(UserRolesBase):
    """Response schema for UserRoles"""

    id: UUID = Field(..., description="매핑 ID")
    revoked_at: Optional[datetime] = Field(None, description="역할 해제 시각")
    revoked_by: Optional[UUID] = Field(None, description="해제자 ID")
    revoke_reason: Optional[str] = Field(None, description="해제 사유")
    created_at: datetime = Field(..., description="생성 일시")
    updated_at: Optional[datetime] = Field(None, description="수정 일시")
    created_by: Optional[UUID] = Field(None, description="생성자 ID")
    updated_by: Optional[UUID] = Field(None, description="수정자 ID")


class UserRolesListResponse(BaseModel):
    """Schema for paginated UserRoles list response"""

    items: list[UserRolesResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "UserRolesBase",
    "UserRolesCreate",
    "UserRolesUpdate",
    "UserRolesRevoke",
    "UserRolesResponse",
    "UserRolesListResponse",
]
