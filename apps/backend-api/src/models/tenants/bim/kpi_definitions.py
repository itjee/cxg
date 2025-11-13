from uuid import UUID as PyUUID
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["KpiDefinitions"]


class KpiDefinitions(TenantBaseModel):
    """KPI(핵심성과지표) 정의 및 설정 정보 관리 테이블"""
    __tablename__ = "kpi_definitions"
    __table_args__ = {"schema": "bim"}

    kpi_code: Mapped[str] = mapped_column(String(50), nullable=False)  # KPI 코드
    kpi_name: Mapped[str] = mapped_column(String(200), nullable=False)  # KPI 명칭
    kpi_name_en: Mapped[str | None] = mapped_column(String(200))  # KPI 영문명
    description: Mapped[str | None] = mapped_column(Text)  # KPI 상세 설명
    category: Mapped[str | None] = mapped_column(String(50))  # KPI 카테고리 (매출/수익성/효율성/품질/고객만족)
    sub_category: Mapped[str | None] = mapped_column(String(50))  # 하위 카테고리
    business_area: Mapped[str | None] = mapped_column(String(50))  # 사업 영역 (영업/생산/재무/인사 등)
    measurement_unit: Mapped[str | None] = mapped_column(String(20))  # 측정 단위 (원/%/건수/시간 등)
    calculation_formula: Mapped[str | None] = mapped_column(Text)  # 계산 방법 (수식/집계 방법)
    data_source: Mapped[str | None] = mapped_column(Text)  # 데이터 출처
    measurement_frequency: Mapped[str | None] = mapped_column(String(20), default='MONTHLY')  # 측정 주기 (DAILY: 일별/WEEKLY: 주별/MONTHLY: 월별/QUARTERLY: 분기별/YEARLY: 연별)
    target_type: Mapped[str | None] = mapped_column(String(20), default='HIGHER_BETTER')  # 목표 유형 (HIGHER_BETTER: 높을수록 좋음/LOWER_BETTER: 낮을수록 좋음/TARGET_VALUE: 목표값 달성/RANGE: 범위 내)
    default_target_value: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 기본 목표값
    threshold_warning: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 경고 임계값
    threshold_critical: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 위험 임계값
    display_order: Mapped[int | None] = mapped_column(Integer, default=0)  # 표시 순서
    chart_type: Mapped[str | None] = mapped_column(String(20))  # 차트 유형 (LINE: 선형/BAR: 막대/PIE: 원형/GAUGE: 게이지/AREA: 영역/SCATTER: 산점도)
    color_code: Mapped[str | None] = mapped_column(String(7))  # 색상 코드 (#RRGGBB 형식)
    icon_name: Mapped[str | None] = mapped_column(String(50))  # 아이콘 이름
    owner_user_id: Mapped[PyUUID | None] = mapped_column(UUID)  # KPI 담당자 UUID
    owner_department_id: Mapped[PyUUID | None] = mapped_column(UUID)  # KPI 책임 부서 UUID
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    is_active: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 활성화 여부
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그