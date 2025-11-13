"""Schemas for Session module."""

from datetime import datetime
from ipaddress import IPv4Address, IPv6Address
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class SessionBase(BaseModel):
    """Base schema for Session."""

    session_type: str = Field(default="WEB", description="세션 타입 (WEB, API, MOBILE)")
    tenant_context: UUID | None = Field(None, description="테넌트 컨텍스트")
    fingerprint: str | None = Field(None, description="브라우저 핑거프린트")
    user_agent: str | None = Field(None, description="User Agent")
    ip_address: str = Field(..., description="IP 주소")
    country_code: str | None = Field(None, description="국가 코드")
    city: str | None = Field(None, description="도시")


class SessionCreate(SessionBase):
    """Schema for creating Session."""

    session_id: str = Field(..., description="세션 ID")
    user_id: UUID = Field(..., description="사용자 ID")
    expires_at: datetime = Field(..., description="만료 시간")


class SessionUpdate(BaseModel):
    """Schema for updating Session."""

    status: str | None = Field(None, description="세션 상태 (ACTIVE, EXPIRED, REVOKED)")
    last_activity_at: datetime | None = Field(None, description="마지막 활동 시간")
    mfa_verified: bool | None = Field(None, description="MFA 인증 여부")
    mfa_verified_at: datetime | None = Field(None, description="MFA 인증 시간")


class SessionResponse(SessionBase):
    """Response schema for Session."""

    id: UUID
    session_id: str
    user_id: UUID
    status: str
    expires_at: datetime
    last_activity_at: datetime
    mfa_verified: bool
    mfa_verified_at: datetime | None
    created_at: datetime
    updated_at: datetime | None

    @field_validator('ip_address', mode='before')
    @classmethod
    def convert_ip_address(cls, v):
        """IP 주소를 문자열로 변환"""
        if isinstance(v, (IPv4Address, IPv6Address)):
            return str(v)
        return v

    class Config:
        """Pydantic config."""

        from_attributes = True


class SessionListResponse(BaseModel):
    """List response schema for Session."""

    items: list[SessionResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
