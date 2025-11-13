from uuid import UUID as PyUUID
from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Opportunities"]


class Opportunities(TenantBaseModel):
    """영업 기회 관리 테이블 (Sales Funnel/Pipeline)"""
    __tablename__ = "opportunities"
    __table_args__ = {"schema": "crm"}

    opportunity_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 영업 기회 코드 (고유번호)
    name: Mapped[str] = mapped_column(String(200), nullable=False)  # 영업 기회명
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    partner_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("crm.partners.id"))  # 거래처 ID
    lead_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("crm.leads.id"))  # 리드 ID
    contact_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("crm.partner_contacts.id"))  # 담당자 ID (partner_contacts)
    stage: Mapped[str] = mapped_column(String(20), nullable=False, default='LEAD')  # 영업 단계 (LEAD/QUALIFIED/PROPOSAL/NEGOTIATION/CLOSING/WON/LOST)
    status: Mapped[str | None] = mapped_column(String(20), default='OPEN')  # 상태 (OPEN/WON/LOST/CANCELLED)
    amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=2), default=0)  # 예상 금액
    currency: Mapped[str | None] = mapped_column(String(3), default='KRW')  # 통화 (ISO 4217)
    win_probability: Mapped[int | None] = mapped_column(Integer, default=0)  # 성공 확률 (0-100%)
    expected_revenue: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=2), default=0)  # 예상 수익 (금액 × 확률)
    expected_close_date: Mapped[date | None] = mapped_column(Date)  # 예상 마감일
    actual_close_date: Mapped[date | None] = mapped_column(Date)  # 실제 마감일
    owner_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.employees.id"))  # 담당 영업자 UUID
    team_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.departments.id"))  # 담당 팀 UUID
    source: Mapped[str | None] = mapped_column(String(50))  # 기회 출처 (WEBSITE/REFERRAL/EXHIBITION/CAMPAIGN/COLD_CALL 등)
    source_detail: Mapped[str | None] = mapped_column(String(200))  # 출처 상세 설명
    campaign_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 관련 캠페인 ID
    product_interest: Mapped[str | None] = mapped_column(String(200))  # 관심 제품
    service_interest: Mapped[str | None] = mapped_column(String(200))  # 관심 서비스
    competitors: Mapped[str | None] = mapped_column(Text)  # 경쟁사 정보
    our_advantage: Mapped[str | None] = mapped_column(Text)  # 우리의 강점
    lost_reason: Mapped[str | None] = mapped_column(String(50))  # 실패 사유 코드 (PRICE/COMPETITOR/NO_BUDGET/NO_DECISION/TIMING 등)
    lost_reason_detail: Mapped[str | None] = mapped_column(Text)  # 실패 사유 상세
    won_so_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("srm.sales_orders.id"))  # 수주된 판매주문 ID
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그
    notes: Mapped[str | None] = mapped_column(Text)  # 비고