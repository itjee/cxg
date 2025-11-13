from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func

from ..base import TenantBaseModel

__all__ = ["CustomerSurveys"]


class CustomerSurveys(TenantBaseModel):
    """고객 만족도 설문 관리 테이블"""
    __tablename__ = "customer_surveys"
    __table_args__ = {"schema": "crm"}

    survey_code: Mapped[str] = mapped_column(nullable=False)  # 설문 코드 (고유번호)
    survey_type: Mapped[str | None] = mapped_column()  # 설문 유형 (NPS: 0-10, CSAT: 1-5, CES: 1-7, GENERAL, CUSTOM)
    partner_id: Mapped[str | None] = mapped_column(ForeignKey("crm.partners.id"))  # 거래처 ID
    lead_id: Mapped[str | None] = mapped_column(ForeignKey("crm.leads.id"))  # 리드 ID
    contact_id: Mapped[str | None] = mapped_column(ForeignKey("crm.partner_contacts.id"))  # 담당자 ID (partner_contacts)
    opportunity_id: Mapped[str | None] = mapped_column(ForeignKey("crm.opportunities.id"))  # 영업기회 ID
    so_id: Mapped[str | None] = mapped_column(ForeignKey("srm.sales_orders.id"))  # 판매주문 ID
    question: Mapped[str] = mapped_column(nullable=False)  # 질문 내용
    response_score: Mapped[str | None] = mapped_column()  # 응답 점수 (NPS: 0-10, CSAT: 1-5, CES: 1-7)
    response_text: Mapped[str | None] = mapped_column()  # 응답 텍스트 (자유 의견)
    response_at: Mapped[str | None] = mapped_column()  # 응답 일시
    sentiment: Mapped[str | None] = mapped_column()  # 감정 분석 (POSITIVE/NEUTRAL/NEGATIVE)
    sent_date: Mapped[str | None] = mapped_column()  # 발송일
    sent_by: Mapped[str | None] = mapped_column(ForeignKey("hrm.employees.id"))  # 발송자 UUID
    send_channel: Mapped[str | None] = mapped_column()  # 발송 채널 (EMAIL/SMS/PHONE/WEB/MOBILE_APP)
    status: Mapped[str | None] = mapped_column(default='PENDING')  # 상태 (PENDING/SENT/RESPONDED/EXPIRED/CANCELLED)
    is_anonymous: Mapped[str | None] = mapped_column(default=False)  # 익명 여부
    is_deleted: Mapped[str | None] = mapped_column(default=False)  # 논리 삭제 플래그
    notes: Mapped[str | None] = mapped_column()  # 비고