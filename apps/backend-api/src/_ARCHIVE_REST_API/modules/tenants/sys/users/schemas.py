"""
시스템 사용자 정보를 관리하는 테이블 (각 테넌트별 사용자 계정 분리 관리)

Pydantic schemas for Users model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class UsersBase(BaseModel):
    """Base schema for Users"""
    model_config = ConfigDict(from_attributes=True)

    user_code: str = Field(max_length=50, description="사용자 코드 (테넌트 내 유니크)")
    username: str = Field(max_length=100, description="로그인 사용자명")
    email: str = Field(max_length=255, description="이메일 주소 (사용자 식별 및 알림 발송용)")
    password_hash: str = Field(max_length=255, description="암호화된 비밀번호 (bcrypt 등으로 해시화)")
    first_name: str | None = Field(None, max_length=100, description="이름")
    last_name: str | None = Field(None, max_length=100, description="성")
    phone: str | None = Field(None, max_length=50, description="전화번호")
    department_id: UUID | None = Field(None, description="소속 부서 ID")
    position: str | None = Field(None, max_length=100, description="직급/직책")
    role_id: UUID | None = Field(None, description="기본 역할 ID")
    default_conflict_resolution_policy_id: UUID | None = Field(None, description="다중 역할 사용 시 기본 권한 충돌 해결 정책 ID")
    failed_login_attempts: int = Field(default=0, ge=0, description="연속 로그인 실패 횟수")
    locked_until: datetime | None = Field(None, description="계정 잠금 해제 시각")
    last_login_at: datetime | None = Field(None, description="마지막 로그인 일시")
    last_login_ip: str | None = Field(None, max_length=45, description="마지막 로그인 IP (IPv6 지원)")
    is_system_user: bool = Field(default=False, description="시스템 사용자 여부 (자동화/배치용)")
    is_active: bool = Field(default=True, description="활성 상태 (true: 로그인 가능, false: 로그인 불가)")
    is_deleted: bool = Field(default=False, description="논리 삭제 플래그")


class UsersCreate(UsersBase):
    """Schema for creating Users"""

    # Exclude auto-generated fields
    pass


class UsersUpdate(BaseModel):
    """Schema for updating Users (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    user_code: str | None = Field(None, max_length=50, description="사용자 코드 (테넌트 내 유니크)")
    username: str | None = Field(None, max_length=100, description="로그인 사용자명")
    email: str | None = Field(None, max_length=255, description="이메일 주소 (사용자 식별 및 알림 발송용)")
    password_hash: str | None = Field(None, max_length=255, description="암호화된 비밀번호 (bcrypt 등으로 해시화)")
    first_name: str | None = Field(None, max_length=100, description="이름")
    last_name: str | None = Field(None, max_length=100, description="성")
    phone: str | None = Field(None, max_length=50, description="전화번호")
    department_id: UUID | None = Field(None, description="소속 부서 ID")
    position: str | None = Field(None, max_length=100, description="직급/직책")
    role_id: UUID | None = Field(None, description="기본 역할 ID")
    default_conflict_resolution_policy_id: UUID | None = Field(None, description="다중 역할 사용 시 기본 권한 충돌 해결 정책 ID")
    failed_login_attempts: int | None = Field(None, ge=0, description="연속 로그인 실패 횟수")
    locked_until: datetime | None = Field(None, description="계정 잠금 해제 시각")
    last_login_at: datetime | None = Field(None, description="마지막 로그인 일시")
    last_login_ip: str | None = Field(None, max_length=45, description="마지막 로그인 IP (IPv6 지원)")
    is_system_user: bool | None = Field(None, description="시스템 사용자 여부 (자동화/배치용)")
    is_active: bool | None = Field(None, description="활성 상태 (true: 로그인 가능, false: 로그인 불가)")
    is_deleted: bool | None = Field(None, description="논리 삭제 플래그")


class UsersResponse(UsersBase):
    """Schema for Users response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class UsersListResponse(BaseModel):
    """Schema for paginated Users list response"""

    items: list[UsersResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


class UserInviteRequest(BaseModel):
    """Schema for inviting a new user"""
    model_config = ConfigDict(from_attributes=True)

    username: str = Field(max_length=100, description="로그인 사용자명")
    email: str = Field(max_length=255, description="이메일 주소")
    full_name: str = Field(max_length=100, description="이름")
    phone: str | None = Field(None, max_length=50, description="전화번호")
    department_id: UUID | None = Field(None, description="소속 부서 ID")
    position: str | None = Field(None, max_length=100, description="직급/직책")
    role_id: UUID | None = Field(None, description="기본 역할 ID")


class UserInviteResponse(BaseModel):
    """Schema for user invitation response"""
    model_config = ConfigDict(from_attributes=True)

    user_id: UUID
    username: str
    email: str
    full_name: str
    temp_password: str  # 임시 비밀번호 (이메일 발송용)
    invited_at: datetime


class PasswordChangeRequest(BaseModel):
    """Schema for password change"""
    model_config = ConfigDict(from_attributes=True)

    current_password: str = Field(min_length=1, description="현재 비밀번호")
    new_password: str = Field(min_length=8, max_length=100, description="새 비밀번호 (최소 8자)")


class PasswordChangeResponse(BaseModel):
    """Schema for password change response"""
    model_config = ConfigDict(from_attributes=True)

    message: str
    changed_at: datetime


__all__ = [
    "UsersBase",
    "UsersCreate",
    "UsersUpdate",
    "UsersResponse",
    "UsersListResponse",
    "UserInviteRequest",
    "UserInviteResponse",
    "PasswordChangeRequest",
    "PasswordChangeResponse",
]
