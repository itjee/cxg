"""Settings schemas for request/response validation."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class SettingsBase(BaseModel):
    """Settings base schema."""

    key: str = Field(..., min_length=1, max_length=100, description="설정 키 (도메인.기능.속성 형태, 예: app.email.smtp_host)")
    value: str | None = Field(None, description="설정 값")
    value_type: str = Field("STRING", max_length=20, description="값 타입 (STRING/NUMBER/BOOLEAN/JSON)")
    default_value: str | None = Field(None, description="기본값 (설정 초기화용)")
    description: str | None = Field(None, description="설명")
    category: str | None = Field(None, max_length=50, description="카테고리 (system/tenant/feature 등)")
    is_active: bool = Field(True, description="활성 여부")
    is_system: bool = Field(False, description="시스템 설정 여부 (수정 제한)")
    is_encrypted: bool = Field(False, description="암호화 여부 (민감정보 표시)")


class SettingsCreate(SettingsBase):
    """Settings creation schema."""

    pass


class SettingsUpdate(BaseModel):
    """Settings update schema."""

    key: str | None = Field(None, min_length=1, max_length=100, description="설정 키")
    value: str | None = Field(None, description="설정 값")
    value_type: str | None = Field(None, max_length=20, description="값 타입")
    default_value: str | None = Field(None, description="기본값")
    description: str | None = Field(None, description="설명")
    category: str | None = Field(None, max_length=50, description="카테고리")
    is_active: bool | None = Field(None, description="활성 여부")
    is_system: bool | None = Field(None, description="시스템 설정 여부")
    is_encrypted: bool | None = Field(None, description="암호화 여부")


class SettingsResponse(SettingsBase):
    """Settings response schema."""

    id: UUID
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None

    class Config:
        """Pydantic config."""

        from_attributes = True


class SettingsListResponse(BaseModel):
    """Settings list response schema."""

    items: list[SettingsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
