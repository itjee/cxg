"""
KPI 목표값 및 실적 관리 테이블

Pydantic schemas for KpiTargets model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class KpiTargetsBase(BaseModel):
    """Base schema for KpiTargets"""
    model_config = ConfigDict(from_attributes=True)

    kpi_id: UUID = Field(description="KPI 정의 식별자")
    target_period: str = Field(max_length=7, description="목표 기간 (YYYY-MM)")
    fiscal_year: str | None = Field(None, max_length=4, description="회계 연도")
    quarter: str | None = Field(None, max_length=2, description="분기 (Q1/Q2/Q3/Q4)")
    department_id: UUID | None = Field(None, description="부서 식별자")
    user_id: UUID | None = Field(None, description="사용자 식별자")
    team_id: UUID | None = Field(None, description="팀 식별자")
    target_value: Decimal = Field(description="목표값")
    actual_value: Decimal | None = Field(None, description="실적값")
    achievement_rate: Decimal | None = Field(None, description="달성률 (%)")
    status: str | None = Field(max_length=20, default='IN_PROGRESS', description="상태 (NOT_STARTED: 미시작/IN_PROGRESS: 진행중/ACHIEVED: 달성/NOT_ACHIEVED: 미달성/EXCEEDED: 초과달성/CANCELLED: 취소)")
    performance_grade: str | None = Field(None, max_length=10, description="성과 등급 (S/A/B/C/D/F)")
    variance_value: Decimal | None = Field(None, description="편차값 (실적-목표)")
    variance_rate: Decimal | None = Field(None, description="편차율 (%)")
    start_date: date | None = Field(None, description="시작일")
    end_date: date | None = Field(None, description="종료일")
    last_measured_at: datetime | None = Field(None, description="최종 측정 일시")
    comments: str | None = Field(None, description="코멘트/메모")
    action_plan: str | None = Field(None, description="실행 계획")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class KpiTargetsCreate(KpiTargetsBase):
    """Schema for creating KpiTargets"""

    # Exclude auto-generated fields
    pass


class KpiTargetsUpdate(BaseModel):
    """Schema for updating KpiTargets (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    kpi_id: UUID | None = Field(None, description="KPI 정의 식별자")
    target_period: str | None = Field(None, max_length=7, description="목표 기간 (YYYY-MM)")
    fiscal_year: str | None = Field(None, max_length=4, description="회계 연도")
    quarter: str | None = Field(None, max_length=2, description="분기 (Q1/Q2/Q3/Q4)")
    department_id: UUID | None = Field(None, description="부서 식별자")
    user_id: UUID | None = Field(None, description="사용자 식별자")
    team_id: UUID | None = Field(None, description="팀 식별자")
    target_value: Decimal | None = Field(None, description="목표값")
    actual_value: Decimal | None = Field(None, description="실적값")
    achievement_rate: Decimal | None = Field(None, description="달성률 (%)")
    status: str | None = Field(max_length=20, default='IN_PROGRESS', description="상태 (NOT_STARTED: 미시작/IN_PROGRESS: 진행중/ACHIEVED: 달성/NOT_ACHIEVED: 미달성/EXCEEDED: 초과달성/CANCELLED: 취소)")
    performance_grade: str | None = Field(None, max_length=10, description="성과 등급 (S/A/B/C/D/F)")
    variance_value: Decimal | None = Field(None, description="편차값 (실적-목표)")
    variance_rate: Decimal | None = Field(None, description="편차율 (%)")
    start_date: date | None = Field(None, description="시작일")
    end_date: date | None = Field(None, description="종료일")
    last_measured_at: datetime | None = Field(None, description="최종 측정 일시")
    comments: str | None = Field(None, description="코멘트/메모")
    action_plan: str | None = Field(None, description="실행 계획")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class KpiTargetsResponse(KpiTargetsBase):
    """Schema for KpiTargets response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class KpiTargetsListResponse(BaseModel):
    """Schema for paginated KpiTargets list response"""

    items: list[KpiTargetsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "KpiTargetsBase",
    "KpiTargetsCreate",
    "KpiTargetsUpdate",
    "KpiTargetsResponse",
    "KpiTargetsListResponse",
]
