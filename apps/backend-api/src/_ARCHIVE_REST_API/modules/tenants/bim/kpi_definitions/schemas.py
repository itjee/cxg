"""
KPI(핵심성과지표) 정의 및 설정 정보 관리 테이블

Pydantic schemas for KpiDefinitions model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class KpiDefinitionsBase(BaseModel):
    """Base schema for KpiDefinitions"""
    model_config = ConfigDict(from_attributes=True)

    kpi_code: str = Field(max_length=50, description="KPI 코드")
    kpi_name: str = Field(max_length=200, description="KPI 명칭")
    kpi_name_en: str | None = Field(None, max_length=200, description="KPI 영문명")
    description: str | None = Field(None, description="KPI 상세 설명")
    category: str | None = Field(None, max_length=50, description="KPI 카테고리 (매출/수익성/효율성/품질/고객만족)")
    sub_category: str | None = Field(None, max_length=50, description="하위 카테고리")
    business_area: str | None = Field(None, max_length=50, description="사업 영역 (영업/생산/재무/인사 등)")
    measurement_unit: str | None = Field(None, max_length=20, description="측정 단위 (원/%/건수/시간 등)")
    calculation_formula: str | None = Field(None, description="계산 방법 (수식/집계 방법)")
    data_source: str | None = Field(None, description="데이터 출처")
    measurement_frequency: str | None = Field(max_length=20, default='MONTHLY', description="측정 주기 (DAILY: 일별/WEEKLY: 주별/MONTHLY: 월별/QUARTERLY: 분기별/YEARLY: 연별)")
    target_type: str | None = Field(max_length=20, default='HIGHER_BETTER', description="목표 유형 (HIGHER_BETTER: 높을수록 좋음/LOWER_BETTER: 낮을수록 좋음/TARGET_VALUE: 목표값 달성/RANGE: 범위 내)")
    default_target_value: Decimal | None = Field(None, description="기본 목표값")
    threshold_warning: Decimal | None = Field(None, description="경고 임계값")
    threshold_critical: Decimal | None = Field(None, description="위험 임계값")
    display_order: int | None = Field(default=0, description="표시 순서")
    chart_type: str | None = Field(None, max_length=20, description="차트 유형 (LINE: 선형/BAR: 막대/PIE: 원형/GAUGE: 게이지/AREA: 영역/SCATTER: 산점도)")
    color_code: str | None = Field(None, max_length=7, description="색상 코드 (#RRGGBB 형식)")
    icon_name: str | None = Field(None, max_length=50, description="아이콘 이름")
    owner_user_id: UUID | None = Field(None, description="KPI 담당자 UUID")
    owner_department_id: UUID | None = Field(None, description="KPI 책임 부서 UUID")
    notes: str | None = Field(None, description="비고")
    is_active: bool | None = Field(default=True, description="활성화 여부")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class KpiDefinitionsCreate(KpiDefinitionsBase):
    """Schema for creating KpiDefinitions"""

    # Exclude auto-generated fields
    pass


class KpiDefinitionsUpdate(BaseModel):
    """Schema for updating KpiDefinitions (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    kpi_code: str | None = Field(None, max_length=50, description="KPI 코드")
    kpi_name: str | None = Field(None, max_length=200, description="KPI 명칭")
    kpi_name_en: str | None = Field(None, max_length=200, description="KPI 영문명")
    description: str | None = Field(None, description="KPI 상세 설명")
    category: str | None = Field(None, max_length=50, description="KPI 카테고리 (매출/수익성/효율성/품질/고객만족)")
    sub_category: str | None = Field(None, max_length=50, description="하위 카테고리")
    business_area: str | None = Field(None, max_length=50, description="사업 영역 (영업/생산/재무/인사 등)")
    measurement_unit: str | None = Field(None, max_length=20, description="측정 단위 (원/%/건수/시간 등)")
    calculation_formula: str | None = Field(None, description="계산 방법 (수식/집계 방법)")
    data_source: str | None = Field(None, description="데이터 출처")
    measurement_frequency: str | None = Field(max_length=20, default='MONTHLY', description="측정 주기 (DAILY: 일별/WEEKLY: 주별/MONTHLY: 월별/QUARTERLY: 분기별/YEARLY: 연별)")
    target_type: str | None = Field(max_length=20, default='HIGHER_BETTER', description="목표 유형 (HIGHER_BETTER: 높을수록 좋음/LOWER_BETTER: 낮을수록 좋음/TARGET_VALUE: 목표값 달성/RANGE: 범위 내)")
    default_target_value: Decimal | None = Field(None, description="기본 목표값")
    threshold_warning: Decimal | None = Field(None, description="경고 임계값")
    threshold_critical: Decimal | None = Field(None, description="위험 임계값")
    display_order: int | None = Field(default=0, description="표시 순서")
    chart_type: str | None = Field(None, max_length=20, description="차트 유형 (LINE: 선형/BAR: 막대/PIE: 원형/GAUGE: 게이지/AREA: 영역/SCATTER: 산점도)")
    color_code: str | None = Field(None, max_length=7, description="색상 코드 (#RRGGBB 형식)")
    icon_name: str | None = Field(None, max_length=50, description="아이콘 이름")
    owner_user_id: UUID | None = Field(None, description="KPI 담당자 UUID")
    owner_department_id: UUID | None = Field(None, description="KPI 책임 부서 UUID")
    notes: str | None = Field(None, description="비고")
    is_active: bool | None = Field(default=True, description="활성화 여부")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class KpiDefinitionsResponse(KpiDefinitionsBase):
    """Schema for KpiDefinitions response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class KpiDefinitionsListResponse(BaseModel):
    """Schema for paginated KpiDefinitions list response"""

    items: list[KpiDefinitionsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "KpiDefinitionsBase",
    "KpiDefinitionsCreate",
    "KpiDefinitionsUpdate",
    "KpiDefinitionsResponse",
    "KpiDefinitionsListResponse",
]
