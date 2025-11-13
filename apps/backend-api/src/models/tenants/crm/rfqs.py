from uuid import UUID as PyUUID
from datetime import date, datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Rfqs"]


class Rfqs(TenantBaseModel):
    """견적 요청서 헤더 관리 테이블 (Request for Quotation)"""
    __tablename__ = "rfqs"
    __table_args__ = {"schema": "crm"}

    rfq_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 견적 요청서 코드 (고유번호)
    title: Mapped[str] = mapped_column(String(200), nullable=False)  # 제목
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    partner_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("crm.partners.id"))  # 거래처 ID
    lead_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("crm.leads.id"))  # 리드 ID
    contact_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("crm.partner_contacts.id"))  # 담당자 ID (partner_contacts)
    request_date: Mapped[date] = mapped_column(Date, nullable=False)  # 요청일
    due_date: Mapped[date | None] = mapped_column(Date)  # 회신 마감일
    required_delivery_date: Mapped[date | None] = mapped_column(Date)  # 납품 희망일
    delivery_address: Mapped[str | None] = mapped_column(Text)  # 배송 주소
    delivery_terms: Mapped[str | None] = mapped_column(String(100))  # 배송 조건
    payment_terms: Mapped[str | None] = mapped_column(String(100))  # 결제 조건
    currency: Mapped[str | None] = mapped_column(String(3), default='KRW')  # 통화 (ISO 4217)
    owner_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 담당 영업자 UUID
    converted_quote_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("srm.quotations.id"))  # 전환된 견적서 ID
    converted_at: Mapped[datetime | None] = mapped_column(DateTime)  # 전환 일시
    status: Mapped[str | None] = mapped_column(String(20), default='DRAFT')  # 상태 (DRAFT/SUBMITTED/IN_REVIEW/QUOTED/DECLINED/CANCELLED)
    priority: Mapped[str | None] = mapped_column(String(20), default='NORMAL')  # 우선순위 (URGENT/HIGH/NORMAL/LOW)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그
    notes: Mapped[str | None] = mapped_column(Text)  # 비고