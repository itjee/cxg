"""
영업 목표 및 실적 관리 테이블

Pydantic schemas for SalesTargets model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class SalesTargetsBase(BaseModel):
    """Base schema for SalesTargets"""
    model_config = ConfigDict(from_attributes=True)

    target_code: str = Field(description="목표 코드 (고유번호)")
    name: str = Field(description="목표명")
    description: str | None = Field(None, description="설명")
    target_type: str = Field(description="목표 유형 (INDIVIDUAL: 개인, TEAM: 팀, DEPARTMENT: 부서, COMPANY: 회사)")
    employee_id: str | None = Field(None, description="대상 직원 UUID")
    team_id: str | None = Field(None, description="대상 팀/부서 UUID")
    period_type: str = Field(description="기간 유형 (MONTH: 월별, QUARTER: 분기별, YEAR: 연도별, CUSTOM: 사용자 정의)")
    start_date: str = Field(description="시작일")
    end_date: str = Field(description="종료일")
    year: str = Field(description="연도")
    quarter: str | None = Field(None, description="분기 (1-4)")
    month: str | None = Field(None, description="월 (1-12)")
    target_revenue: str | None = Field(default=0, description="목표 매출")
    actual_revenue: str | None = Field(default=0, description="실제 매출")
    revenue_achievement_rate: str | None = Field(default=0, description="매출 달성률 (%)")
    target_deals: str | None = Field(default=0, description="목표 계약 건수")
    actual_deals: str | None = Field(default=0, description="실제 계약 건수")
    deals_achievement_rate: str | None = Field(default=0, description="건수 달성률 (%)")
    target_leads: str | None = Field(default=0, description="목표 리드 수")
    actual_leads: str | None = Field(default=0, description="실제 리드 수")
    target_opportunities: str | None = Field(default=0, description="목표 영업기회 수")
    actual_opportunities: str | None = Field(default=0, description="실제 영업기회 수")
    target_conversion_rate: str | None = Field(None, description="목표 전환율 (%)")
    actual_conversion_rate: str | None = Field(None, description="실제 전환율 (%)")
    currency: str | None = Field(default='KRW', description="통화 (ISO 4217)")
    status: str | None = Field(default='ACTIVE', description="상태 (ACTIVE: 활성, COMPLETED: 완료, CANCELLED: 취소)")
    is_deleted: str | None = Field(default=False, description="논리 삭제 플래그")
    notes: str | None = Field(None, description="비고")


class SalesTargetsCreate(SalesTargetsBase):
    """Schema for creating SalesTargets"""

    # Exclude auto-generated fields
    pass


class SalesTargetsUpdate(BaseModel):
    """Schema for updating SalesTargets (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    target_code: str | None = Field(None, description="목표 코드 (고유번호)")
    name: str | None = Field(None, description="목표명")
    description: str | None = Field(None, description="설명")
    target_type: str | None = Field(None, description="목표 유형 (INDIVIDUAL: 개인, TEAM: 팀, DEPARTMENT: 부서, COMPANY: 회사)")
    employee_id: str | None = Field(None, description="대상 직원 UUID")
    team_id: str | None = Field(None, description="대상 팀/부서 UUID")
    period_type: str | None = Field(None, description="기간 유형 (MONTH: 월별, QUARTER: 분기별, YEAR: 연도별, CUSTOM: 사용자 정의)")
    start_date: str | None = Field(None, description="시작일")
    end_date: str | None = Field(None, description="종료일")
    year: str | None = Field(None, description="연도")
    quarter: str | None = Field(None, description="분기 (1-4)")
    month: str | None = Field(None, description="월 (1-12)")
    target_revenue: str | None = Field(default=0, description="목표 매출")
    actual_revenue: str | None = Field(default=0, description="실제 매출")
    revenue_achievement_rate: str | None = Field(default=0, description="매출 달성률 (%)")
    target_deals: str | None = Field(default=0, description="목표 계약 건수")
    actual_deals: str | None = Field(default=0, description="실제 계약 건수")
    deals_achievement_rate: str | None = Field(default=0, description="건수 달성률 (%)")
    target_leads: str | None = Field(default=0, description="목표 리드 수")
    actual_leads: str | None = Field(default=0, description="실제 리드 수")
    target_opportunities: str | None = Field(default=0, description="목표 영업기회 수")
    actual_opportunities: str | None = Field(default=0, description="실제 영업기회 수")
    target_conversion_rate: str | None = Field(None, description="목표 전환율 (%)")
    actual_conversion_rate: str | None = Field(None, description="실제 전환율 (%)")
    currency: str | None = Field(default='KRW', description="통화 (ISO 4217)")
    status: str | None = Field(default='ACTIVE', description="상태 (ACTIVE: 활성, COMPLETED: 완료, CANCELLED: 취소)")
    is_deleted: str | None = Field(default=False, description="논리 삭제 플래그")
    notes: str | None = Field(None, description="비고")


class SalesTargetsResponse(SalesTargetsBase):
    """Schema for SalesTargets response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class SalesTargetsListResponse(BaseModel):
    """Schema for paginated SalesTargets list response"""

    items: list[SalesTargetsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "SalesTargetsBase",
    "SalesTargetsCreate",
    "SalesTargetsUpdate",
    "SalesTargetsResponse",
    "SalesTargetsListResponse",
]
