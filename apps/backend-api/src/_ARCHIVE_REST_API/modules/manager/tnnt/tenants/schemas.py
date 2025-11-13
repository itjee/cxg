"""Schemas for Tenant module."""

from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, Field


class TenantBase(BaseModel):
    """Base schema for Tenant."""

    code: str = Field(..., min_length=3, max_length=20, description="테넌트 코드")
    name: str = Field(..., min_length=1, max_length=100, description="테넌트 명")
    type: str = Field(default="STANDARD", description="테넌트 타입")
    biz_no: str | None = Field(None, max_length=20, description="사업자 등록번호")
    biz_name: str | None = Field(None, max_length=200, description="사업체명")
    biz_type: str = Field(default="C", max_length=1, description="사업 유형")
    ceo_name: str | None = Field(None, max_length=50, description="대표자명")
    biz_kind: str | None = Field(None, max_length=100, description="업종")
    biz_item: str | None = Field(None, max_length=100, description="업태")
    postcode: str | None = Field(None, max_length=10, description="우편번호")
    address1: str | None = Field(None, max_length=100, description="주소1")
    address2: str | None = Field(None, max_length=100, description="주소2")
    phone_no: str | None = Field(None, max_length=20, description="전화번호")
    employee_count: int = Field(default=0, ge=0, description="직원수")
    start_date: date = Field(..., description="계약 시작일")
    close_date: date | None = Field(None, description="계약 종료일")
    timezone: str = Field(default="Asia/Seoul", description="시간대")
    locale: str = Field(default="ko-KR", description="언어")
    currency: str = Field(default="KRW", max_length=3, description="통화")
    status: str = Field(default="ACTIVE", description="상태")
    extra_data: dict = Field(default_factory=dict, description="추가 메타데이터")


class TenantCreate(TenantBase):
    """Schema for creating Tenant."""

    pass


class TenantUpdate(BaseModel):
    """Schema for updating Tenant."""

    code: str | None = Field(None, min_length=3, max_length=20, description="테넌트 코드")
    name: str | None = Field(None, min_length=1, max_length=100, description="테넌트 명")
    type: str | None = Field(None, description="테넌트 타입")
    biz_no: str | None = Field(None, max_length=20, description="사업자 등록번호")
    biz_name: str | None = Field(None, max_length=200, description="사업체명")
    biz_type: str | None = Field(None, max_length=1, description="사업 유형")
    ceo_name: str | None = Field(None, max_length=50, description="대표자명")
    biz_kind: str | None = Field(None, max_length=100, description="업종")
    biz_item: str | None = Field(None, max_length=100, description="업태")
    postcode: str | None = Field(None, max_length=10, description="우편번호")
    address1: str | None = Field(None, max_length=100, description="주소1")
    address2: str | None = Field(None, max_length=100, description="주소2")
    phone_no: str | None = Field(None, max_length=20, description="전화번호")
    employee_count: int | None = Field(None, ge=0, description="직원수")
    start_date: date | None = Field(None, description="계약 시작일")
    close_date: date | None = Field(None, description="계약 종료일")
    timezone: str | None = Field(None, description="시간대")
    locale: str | None = Field(None, description="언어")
    currency: str | None = Field(None, max_length=3, description="통화")
    status: str | None = Field(None, description="상태")
    extra_data: dict | None = Field(None, description="추가 메타데이터")


class TenantResponse(BaseModel):
    """Response schema for Tenant."""

    id: UUID
    code: str
    name: str
    type: str
    biz_no: str | None = None
    biz_name: str | None = None
    biz_type: str
    ceo_name: str | None = None
    biz_kind: str | None = None
    biz_item: str | None = None
    postcode: str | None = None
    address1: str | None = None
    address2: str | None = None
    phone_no: str | None = None
    employee_count: int
    start_date: date
    close_date: date | None = None
    timezone: str
    locale: str
    currency: str
    status: str
    extra_data: dict
    is_deleted: bool
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None = None
    updated_by: UUID | None = None

    class Config:
        """Pydantic config."""

        from_attributes = True


class TenantListResponse(BaseModel):
    """List response schema for Tenant."""

    items: list[TenantResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
