"""User schemas for request/response validation."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, field_validator


class UserBase(BaseModel):
    """User base schema."""

    full_name: str = Field(..., min_length=1, max_length=100, description="사용자 전체 이름")
    email: EmailStr = Field(..., description="이메일 주소")
    phone: str | None = Field(None, max_length=20, description="전화번호")
    user_type: str = Field(
        default="TENANT", pattern="^(MASTER|TENANT|SYSTEM)$", description="사용자 유형"
    )


class UserCreate(UserBase):
    """User creation schema."""

    username: str = Field(..., min_length=3, max_length=100, description="사용자명")
    password: str = Field(..., min_length=8, max_length=100, description="비밀번호")
    mfa_enabled: bool = Field(default=False, description="MFA 활성화 여부")

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        """비밀번호 검증."""
        if len(v) < 8:
            raise ValueError("비밀번호는 최소 8자 이상이어야 합니다")
        if not any(c.isupper() for c in v):
            raise ValueError("비밀번호는 최소 1개의 대문자를 포함해야 합니다")
        if not any(c.islower() for c in v):
            raise ValueError("비밀번호는 최소 1개의 소문자를 포함해야 합니다")
        if not any(c.isdigit() for c in v):
            raise ValueError("비밀번호는 최소 1개의 숫자를 포함해야 합니다")
        return v


class UserUpdate(BaseModel):
    """User update schema."""

    full_name: str | None = Field(None, min_length=1, max_length=100, description="사용자 전체 이름")
    email: EmailStr | None = Field(None, description="이메일 주소")
    phone: str | None = Field(None, max_length=20, description="전화번호")
    status: str | None = Field(
        None, pattern="^(ACTIVE|INACTIVE|LOCKED|SUSPENDED)$", description="계정 상태"
    )
    mfa_enabled: bool | None = Field(None, description="MFA 활성화 여부")


class UserResponse(UserBase):
    """User response schema."""

    id: UUID
    username: str
    status: str
    mfa_enabled: bool
    sso_provider: str | None
    email_verified: bool
    phone_verified: bool
    last_login_at: datetime | None
    last_login_ip: str | None
    failed_login_attempts: int
    locked_until: datetime | None
    password_changed_at: datetime | None
    profile_image_url: str | None
    timezone: str | None
    locale: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class UserListResponse(BaseModel):
    """User list response schema."""

    items: list[UserResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
