"""
마케팅 캠페인 관리 테이블

Pydantic schemas for Campaigns model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class CampaignsBase(BaseModel):
    """Base schema for Campaigns"""
    model_config = ConfigDict(from_attributes=True)

    campaign_code: str = Field(max_length=50)
    name: str = Field(max_length=200, description="캠페인명")
    description: str | None = Field(None, description="설명")
    campaign_type: str = Field(max_length=20)
    category: str | None = Field(None, max_length=50, description="카테고리")
    start_date: date = Field(description="시작일")
    end_date: date | None = Field(None, description="종료일")
    budget_amount: Decimal | None = Field(default=0)
    actual_cost: Decimal | None = Field(default=0)
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    target_audience: str | None = Field(None, description="목표 대상 (페르소나, 세그먼트 등)")
    target_leads: int | None = Field(None, description="목표 리드 수")
    target_opportunities: int | None = Field(None, description="목표 영업기회 수")
    target_revenue: Decimal | None = None
    actual_leads: int | None = Field(default=0, description="실제 생성된 리드 수")
    actual_opportunities: int | None = Field(default=0)
    actual_revenue: Decimal | None = Field(default=0)
    owner_id: UUID | None = None
    team_id: UUID | None = None
    primary_channel: str | None = Field(None, max_length=50, description="주 채널")
    channels: str | None = Field(None, description="사용 채널 배열 (이메일, SNS, 웹광고 등)")
    status: str | None = Field(max_length=20, default='PLANNED')
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    landing_page_url: str | None = Field(None, max_length=500, description="랜딩 페이지 URL")
    tracking_code: str | None = Field(None, max_length=100, description="트래킹 코드 (UTM 코드 등)")
    notes: str | None = Field(None, description="비고")


class CampaignsCreate(CampaignsBase):
    """Schema for creating Campaigns"""

    # Exclude auto-generated fields
    pass


class CampaignsUpdate(BaseModel):
    """Schema for updating Campaigns (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    campaign_code: str | None = Field(None, max_length=50)
    name: str | None = Field(None, max_length=200, description="캠페인명")
    description: str | None = Field(None, description="설명")
    campaign_type: str | None = Field(None, max_length=20)
    category: str | None = Field(None, max_length=50, description="카테고리")
    start_date: date | None = Field(None, description="시작일")
    end_date: date | None = Field(None, description="종료일")
    budget_amount: Decimal | None = Field(default=0)
    actual_cost: Decimal | None = Field(default=0)
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    target_audience: str | None = Field(None, description="목표 대상 (페르소나, 세그먼트 등)")
    target_leads: int | None = Field(None, description="목표 리드 수")
    target_opportunities: int | None = Field(None, description="목표 영업기회 수")
    target_revenue: Decimal | None = None
    actual_leads: int | None = Field(default=0, description="실제 생성된 리드 수")
    actual_opportunities: int | None = Field(default=0)
    actual_revenue: Decimal | None = Field(default=0)
    owner_id: UUID | None = None
    team_id: UUID | None = None
    primary_channel: str | None = Field(None, max_length=50, description="주 채널")
    channels: str | None = Field(None, description="사용 채널 배열 (이메일, SNS, 웹광고 등)")
    status: str | None = Field(max_length=20, default='PLANNED')
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    landing_page_url: str | None = Field(None, max_length=500, description="랜딩 페이지 URL")
    tracking_code: str | None = Field(None, max_length=100, description="트래킹 코드 (UTM 코드 등)")
    notes: str | None = Field(None, description="비고")


class CampaignsResponse(CampaignsBase):
    """Schema for Campaigns response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class CampaignsListResponse(BaseModel):
    """Schema for paginated Campaigns list response"""

    items: list[CampaignsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "CampaignsBase",
    "CampaignsCreate",
    "CampaignsUpdate",
    "CampaignsResponse",
    "CampaignsListResponse",
]
