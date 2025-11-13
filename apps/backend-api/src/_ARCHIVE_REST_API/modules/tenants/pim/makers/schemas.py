"""
제조사 마스터 정보 관리 테이블

Pydantic schemas for Makers model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class MakersBase(BaseModel):
    """Base schema for Makers"""
    model_config = ConfigDict(from_attributes=True)

    code: str = Field(max_length=20, description="제조사 코드 (사내 규칙)")
    name: str = Field(max_length=200, description="제조사명")
    name_en: str | None = Field(None, max_length=200, description="영문 제조사명")
    country_code: str | None = Field(None, max_length=3, description="본사 국가 코드 (ISO 3166-1 alpha-3)")
    postcode: str | None = Field(None, max_length=10, description="우편번호")
    address1: str | None = Field(None, max_length=100, description="주소1 (기본주소)")
    address2: str | None = Field(None, max_length=100, description="주소2 (상세주소)")
    phone: str | None = Field(None, max_length=50, description="전화번호")
    email: str | None = Field(None, max_length=255, description="이메일")
    website: str | None = Field(None, max_length=255, description="웹사이트 URL")
    display_order: int | None = Field(default=0, description="정렬 순서")
    logo_url: str | None = Field(None, max_length=500, description="로고 이미지 URL")
    description: str | None = Field(None, description="제조사 설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/DISCONTINUED/PENDING)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class MakersCreate(MakersBase):
    """Schema for creating Makers"""

    # Exclude auto-generated fields
    pass


class MakersUpdate(BaseModel):
    """Schema for updating Makers (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    code: str | None = Field(None, max_length=20, description="제조사 코드 (사내 규칙)")
    name: str | None = Field(None, max_length=200, description="제조사명")
    name_en: str | None = Field(None, max_length=200, description="영문 제조사명")
    country_code: str | None = Field(None, max_length=3, description="본사 국가 코드 (ISO 3166-1 alpha-3)")
    postcode: str | None = Field(None, max_length=10, description="우편번호")
    address1: str | None = Field(None, max_length=100, description="주소1 (기본주소)")
    address2: str | None = Field(None, max_length=100, description="주소2 (상세주소)")
    phone: str | None = Field(None, max_length=50, description="전화번호")
    email: str | None = Field(None, max_length=255, description="이메일")
    website: str | None = Field(None, max_length=255, description="웹사이트 URL")
    display_order: int | None = Field(default=0, description="정렬 순서")
    logo_url: str | None = Field(None, max_length=500, description="로고 이미지 URL")
    description: str | None = Field(None, description="제조사 설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/DISCONTINUED/PENDING)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class MakersResponse(MakersBase):
    """Schema for Makers response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class MakersListResponse(BaseModel):
    """Schema for paginated Makers list response"""

    items: list[MakersResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "MakersBase",
    "MakersCreate",
    "MakersUpdate",
    "MakersResponse",
    "MakersListResponse",
]
