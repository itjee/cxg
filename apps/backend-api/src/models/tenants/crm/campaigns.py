from uuid import UUID as PyUUID
from datetime import date

from sqlalchemy import (
    Boolean,
    Date,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column

from ..base import TenantBaseModel


__all__ = ["Campaigns"]


class Campaigns(TenantBaseModel):
    """마케팅 캠페인 관리 테이블"""

    __tablename__ = "campaigns"
    __table_args__ = {"schema": "crm"}

    campaign_code: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # 캠페인 코드 (고유번호)
    name: Mapped[str] = mapped_column(String(200), nullable=False)  # 캠페인명
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    campaign_type: Mapped[str] = mapped_column(
        String(20), nullable=False
    )  # 캠페인 유형 (EMAIL/EXHIBITION/WEBINAR/AD/SOCIAL/EVENT/CONTENT/REFERRAL/OTHER)
    category: Mapped[str | None] = mapped_column(String(50))  # 카테고리
    start_date: Mapped[date] = mapped_column(Date, nullable=False)  # 시작일
    end_date: Mapped[date | None] = mapped_column(Date)  # 종료일
    budget_amount: Mapped[Decimal | None] = mapped_column(
        Numeric(precision=18, scale=2), default=0
    )  # 예산
    actual_cost: Mapped[Decimal | None] = mapped_column(
        Numeric(precision=18, scale=2), default=0
    )  # 실제 비용
    currency: Mapped[str | None] = mapped_column(String(3), default="KRW")  # 통화 (ISO 4217)
    target_audience: Mapped[str | None] = mapped_column(Text)  # 목표 대상 (페르소나, 세그먼트 등)
    target_leads: Mapped[int | None] = mapped_column(Integer)  # 목표 리드 수
    target_opportunities: Mapped[int | None] = mapped_column(Integer)  # 목표 영업기회 수
    target_revenue: Mapped[Decimal | None] = mapped_column(
        Numeric(precision=18, scale=2)
    )  # 목표 매출
    actual_leads: Mapped[int | None] = mapped_column(Integer, default=0)  # 실제 생성된 리드 수
    actual_opportunities: Mapped[int | None] = mapped_column(
        Integer, default=0
    )  # 실제 생성된 영업기회 수
    actual_revenue: Mapped[Decimal | None] = mapped_column(
        Numeric(precision=18, scale=2), default=0
    )  # 실제 매출
    owner_id: Mapped[PyUUID | None] = mapped_column(
        UUID, ForeignKey("hrm.employees.id")
    )  # 담당자 UUID
    team_id: Mapped[PyUUID | None] = mapped_column(
        UUID, ForeignKey("hrm.departments.id")
    )  # 담당 팀 UUID
    primary_channel: Mapped[str | None] = mapped_column(String(50))  # 주 채널
    channels: Mapped[str | None] = mapped_column(Text)  # 사용 채널 배열 (이메일, SNS, 웹광고 등)
    status: Mapped[str | None] = mapped_column(
        String(20), default="PLANNED"
    )  # 상태 (PLANNED/IN_PROGRESS/COMPLETED/CANCELLED/ON_HOLD)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그
    landing_page_url: Mapped[str | None] = mapped_column(String(500))  # 랜딩 페이지 URL
    tracking_code: Mapped[str | None] = mapped_column(String(100))  # 트래킹 코드 (UTM 코드 등)
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
