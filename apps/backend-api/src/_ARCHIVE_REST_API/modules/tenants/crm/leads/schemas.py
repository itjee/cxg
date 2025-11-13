"""
리드/잠재고객 관리 테이블

Pydantic schemas for Leads model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class LeadsBase(BaseModel):
    """Base schema for Leads"""
    model_config = ConfigDict(from_attributes=True)

    lead_code: str = Field(max_length=50, description="리드 코드 (고유번호)")
    company_name: str = Field(max_length=200, description="회사명")
    website: str | None = Field(None, max_length=200, description="웹사이트")
    industry: str | None = Field(None, max_length=100, description="업종")
    employee_count: int | None = Field(None, description="직원 수")
    annual_revenue: Decimal | None = Field(None, description="연매출액")
    contact_name: str = Field(max_length=100, description="담당자명")
    contact_title: str | None = Field(None, max_length=100, description="직책")
    contact_phone: str | None = Field(None, max_length=20, description="전화번호")
    contact_mobile: str | None = Field(None, max_length=20, description="휴대폰")
    contact_email: str | None = Field(None, max_length=100, description="이메일")
    country_code: str | None = Field(None, max_length=3, description="국가 코드")
    postcode: str | None = Field(None, max_length=20, description="우편번호")
    address1: str | None = Field(None, max_length=200, description="주소1")
    address2: str | None = Field(None, max_length=200, description="주소2")
    city: str | None = Field(None, max_length=100, description="도시")
    state_province: str | None = Field(None, max_length=100, description="주/도")
    source: str | None = Field(None, max_length=50, description="리드 출처 (WEBSITE/REFERRAL/EXHIBITION/COLD_CALL/PARTNER 등)")
    source_detail: str | None = Field(None, max_length=200, description="출처 상세 설명")
    lead_score: int | None = Field(default=0, description="리드 점수 (0-100, Lead Scoring)")
    rating: str | None = Field(None, max_length=20, description="등급 (HOT/WARM/COLD)")
    interest_product: str | None = Field(None, max_length=200, description="관심 제품")
    interest_service: str | None = Field(None, max_length=200, description="관심 서비스")
    budget_range: str | None = Field(None, max_length=50, description="예산 범위")
    purchase_timeframe: str | None = Field(None, max_length=50, description="구매 시기 (IMMEDIATE/1_MONTH/3_MONTHS/6_MONTHS/1_YEAR)")
    owner_id: UUID | None = Field(None, description="담당 영업자 UUID")
    converted_partner_id: UUID | None = Field(None, description="전환된 거래처 ID")
    converted_at: datetime | None = Field(None, description="전환 일시")
    converted_by: UUID | None = Field(None, description="전환 처리자 UUID")
    status: str | None = Field(max_length=20, default='NEW', description="상태 (NEW/CONTACTED/QUALIFIED/CONVERTED/LOST)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    description: str | None = Field(None, description="설명")
    notes: str | None = Field(None, description="비고")


class LeadsCreate(LeadsBase):
    """Schema for creating Leads"""

    # Exclude auto-generated fields
    pass


class LeadsUpdate(BaseModel):
    """Schema for updating Leads (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    lead_code: str | None = Field(None, max_length=50, description="리드 코드 (고유번호)")
    company_name: str | None = Field(None, max_length=200, description="회사명")
    website: str | None = Field(None, max_length=200, description="웹사이트")
    industry: str | None = Field(None, max_length=100, description="업종")
    employee_count: int | None = Field(None, description="직원 수")
    annual_revenue: Decimal | None = Field(None, description="연매출액")
    contact_name: str | None = Field(None, max_length=100, description="담당자명")
    contact_title: str | None = Field(None, max_length=100, description="직책")
    contact_phone: str | None = Field(None, max_length=20, description="전화번호")
    contact_mobile: str | None = Field(None, max_length=20, description="휴대폰")
    contact_email: str | None = Field(None, max_length=100, description="이메일")
    country_code: str | None = Field(None, max_length=3, description="국가 코드")
    postcode: str | None = Field(None, max_length=20, description="우편번호")
    address1: str | None = Field(None, max_length=200, description="주소1")
    address2: str | None = Field(None, max_length=200, description="주소2")
    city: str | None = Field(None, max_length=100, description="도시")
    state_province: str | None = Field(None, max_length=100, description="주/도")
    source: str | None = Field(None, max_length=50, description="리드 출처 (WEBSITE/REFERRAL/EXHIBITION/COLD_CALL/PARTNER 등)")
    source_detail: str | None = Field(None, max_length=200, description="출처 상세 설명")
    lead_score: int | None = Field(default=0, description="리드 점수 (0-100, Lead Scoring)")
    rating: str | None = Field(None, max_length=20, description="등급 (HOT/WARM/COLD)")
    interest_product: str | None = Field(None, max_length=200, description="관심 제품")
    interest_service: str | None = Field(None, max_length=200, description="관심 서비스")
    budget_range: str | None = Field(None, max_length=50, description="예산 범위")
    purchase_timeframe: str | None = Field(None, max_length=50, description="구매 시기 (IMMEDIATE/1_MONTH/3_MONTHS/6_MONTHS/1_YEAR)")
    owner_id: UUID | None = Field(None, description="담당 영업자 UUID")
    converted_partner_id: UUID | None = Field(None, description="전환된 거래처 ID")
    converted_at: datetime | None = Field(None, description="전환 일시")
    converted_by: UUID | None = Field(None, description="전환 처리자 UUID")
    status: str | None = Field(max_length=20, default='NEW', description="상태 (NEW/CONTACTED/QUALIFIED/CONVERTED/LOST)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    description: str | None = Field(None, description="설명")
    notes: str | None = Field(None, description="비고")


class LeadsResponse(LeadsBase):
    """Schema for Leads response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class LeadsListResponse(BaseModel):
    """Schema for paginated Leads list response"""

    items: list[LeadsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "LeadsBase",
    "LeadsCreate",
    "LeadsUpdate",
    "LeadsResponse",
    "LeadsListResponse",
]
