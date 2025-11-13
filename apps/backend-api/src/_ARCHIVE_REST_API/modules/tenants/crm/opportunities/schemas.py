"""
영업 기회 관리 테이블 (Sales Funnel/Pipeline)

Pydantic schemas for Opportunities model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class OpportunitiesBase(BaseModel):
    """Base schema for Opportunities"""
    model_config = ConfigDict(from_attributes=True)

    opportunity_code: str = Field(max_length=50, description="영업 기회 코드 (고유번호)")
    name: str = Field(max_length=200, description="영업 기회명")
    description: str | None = Field(None, description="설명")
    partner_id: UUID | None = Field(None, description="거래처 ID")
    lead_id: UUID | None = Field(None, description="리드 ID")
    contact_id: UUID | None = Field(None, description="담당자 ID (partner_contacts)")
    stage: str = Field(max_length=20, default='LEAD', description="영업 단계 (LEAD/QUALIFIED/PROPOSAL/NEGOTIATION/CLOSING/WON/LOST)")
    status: str | None = Field(max_length=20, default='OPEN', description="상태 (OPEN/WON/LOST/CANCELLED)")
    amount: Decimal | None = Field(default=0, description="예상 금액")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    win_probability: int | None = Field(default=0, description="성공 확률 (0-100%)")
    expected_revenue: Decimal | None = Field(default=0, description="예상 수익 (금액 × 확률)")
    expected_close_date: date | None = Field(None, description="예상 마감일")
    actual_close_date: date | None = Field(None, description="실제 마감일")
    owner_id: UUID | None = Field(None, description="담당 영업자 UUID")
    team_id: UUID | None = Field(None, description="담당 팀 UUID")
    source: str | None = Field(None, max_length=50, description="기회 출처 (WEBSITE/REFERRAL/EXHIBITION/CAMPAIGN/COLD_CALL 등)")
    source_detail: str | None = Field(None, max_length=200, description="출처 상세 설명")
    campaign_id: UUID | None = Field(None, description="관련 캠페인 ID")
    product_interest: str | None = Field(None, max_length=200, description="관심 제품")
    service_interest: str | None = Field(None, max_length=200, description="관심 서비스")
    competitors: str | None = Field(None, description="경쟁사 정보")
    our_advantage: str | None = Field(None, description="우리의 강점")
    lost_reason: str | None = Field(None, max_length=50, description="실패 사유 코드 (PRICE/COMPETITOR/NO_BUDGET/NO_DECISION/TIMING 등)")
    lost_reason_detail: str | None = Field(None, description="실패 사유 상세")
    won_so_id: UUID | None = Field(None, description="수주된 판매주문 ID")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    notes: str | None = Field(None, description="비고")


class OpportunitiesCreate(OpportunitiesBase):
    """Schema for creating Opportunities"""

    # Exclude auto-generated fields
    pass


class OpportunitiesUpdate(BaseModel):
    """Schema for updating Opportunities (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    opportunity_code: str | None = Field(None, max_length=50, description="영업 기회 코드 (고유번호)")
    name: str | None = Field(None, max_length=200, description="영업 기회명")
    description: str | None = Field(None, description="설명")
    partner_id: UUID | None = Field(None, description="거래처 ID")
    lead_id: UUID | None = Field(None, description="리드 ID")
    contact_id: UUID | None = Field(None, description="담당자 ID (partner_contacts)")
    stage: str | None = Field(max_length=20, default='LEAD', description="영업 단계 (LEAD/QUALIFIED/PROPOSAL/NEGOTIATION/CLOSING/WON/LOST)")
    status: str | None = Field(max_length=20, default='OPEN', description="상태 (OPEN/WON/LOST/CANCELLED)")
    amount: Decimal | None = Field(default=0, description="예상 금액")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    win_probability: int | None = Field(default=0, description="성공 확률 (0-100%)")
    expected_revenue: Decimal | None = Field(default=0, description="예상 수익 (금액 × 확률)")
    expected_close_date: date | None = Field(None, description="예상 마감일")
    actual_close_date: date | None = Field(None, description="실제 마감일")
    owner_id: UUID | None = Field(None, description="담당 영업자 UUID")
    team_id: UUID | None = Field(None, description="담당 팀 UUID")
    source: str | None = Field(None, max_length=50, description="기회 출처 (WEBSITE/REFERRAL/EXHIBITION/CAMPAIGN/COLD_CALL 등)")
    source_detail: str | None = Field(None, max_length=200, description="출처 상세 설명")
    campaign_id: UUID | None = Field(None, description="관련 캠페인 ID")
    product_interest: str | None = Field(None, max_length=200, description="관심 제품")
    service_interest: str | None = Field(None, max_length=200, description="관심 서비스")
    competitors: str | None = Field(None, description="경쟁사 정보")
    our_advantage: str | None = Field(None, description="우리의 강점")
    lost_reason: str | None = Field(None, max_length=50, description="실패 사유 코드 (PRICE/COMPETITOR/NO_BUDGET/NO_DECISION/TIMING 등)")
    lost_reason_detail: str | None = Field(None, description="실패 사유 상세")
    won_so_id: UUID | None = Field(None, description="수주된 판매주문 ID")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    notes: str | None = Field(None, description="비고")


class OpportunitiesResponse(OpportunitiesBase):
    """Schema for Opportunities response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class OpportunitiesListResponse(BaseModel):
    """Schema for paginated Opportunities list response"""

    items: list[OpportunitiesResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "OpportunitiesBase",
    "OpportunitiesCreate",
    "OpportunitiesUpdate",
    "OpportunitiesResponse",
    "OpportunitiesListResponse",
]
