from uuid import UUID as PyUUID
from datetime import date, datetime
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["BusinessDocuments"]


class BusinessDocuments(TenantBaseModel):
    """업무전표: 업무 문서와 회계 분개를 연결하는 전표 (입고/출고/입금/출금 등)"""
    __tablename__ = "business_documents"
    __table_args__ = {"schema": "fim"}

    document_no: Mapped[str] = mapped_column(String(50), nullable=False)  # 전표 번호 (자동 채번)
    document_date: Mapped[date] = mapped_column(Date, nullable=False)  # 전표 일자
    document_type: Mapped[str] = mapped_column(String(30), nullable=False)  # 전표 유형 (PURCHASE_RECEIPT/SALES_SHIPMENT/RECEIPT/PAYMENT 등)
    source_module: Mapped[str] = mapped_column(String(20), nullable=False)  # 원천 모듈 (PSM/SRM/WMS/IVM/HRM/FIM/MANUAL)
    source_type: Mapped[str] = mapped_column(String(30), nullable=False)  # 원천 유형 (RECEIVING/SHIPPING/PAYMENT_TRANSACTION 등)
    source_id: Mapped[PyUUID] = mapped_column(UUID, nullable=False)  # 원천 문서 ID
    source_no: Mapped[str | None] = mapped_column(String(50))  # 원천 문서 번호
    source_line_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 원천 문서 라인 ID (선택)
    fiscal_year: Mapped[int] = mapped_column(Integer, nullable=False)  # 회계연도
    fiscal_period: Mapped[int] = mapped_column(Integer, nullable=False)  # 회계기간 (월: 1~12)
    account_date: Mapped[date] = mapped_column(Date, nullable=False)  # 회계처리일
    total_amount: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 전표 금액
    tax_amount: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 세액
    currency_code: Mapped[str] = mapped_column(String(3), ForeignKey("adm.currencies.id"), nullable=False)  # 통화 코드
    exchange_rate: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=6), default=1)  # 환율
    partner_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("crm.partners.id"))  # 거래처 ID
    partner_name: Mapped[str | None] = mapped_column(String(200))  # 거래처명 (스냅샷)
    department_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.departments.id"))  # 부서 ID
    cost_center_code: Mapped[str | None] = mapped_column(String(20))  # 원가센터 코드
    project_code: Mapped[str | None] = mapped_column(String(50))  # 프로젝트 코드
    journal_entry_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("fim.journal_entries.id"))  # 분개 ID (연결)
    is_posted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 전기 여부
    posted_at: Mapped[datetime | None] = mapped_column(DateTime)  # 전기 일시
    posted_by: Mapped[PyUUID | None] = mapped_column(UUID)  # 전기자 UUID
    is_cancelled: Mapped[bool] = mapped_column(Boolean, ForeignKey("fim.business_documents.id"), nullable=False, default=False)  # 취소 여부
    cancelled_at: Mapped[datetime | None] = mapped_column(DateTime)  # 취소 일시
    cancelled_by: Mapped[PyUUID | None] = mapped_column(UUID)  # 취소자 UUID
    cancelled_reason: Mapped[str | None] = mapped_column(Text)  # 취소 사유
    reversed_document_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 역분개 전표 ID
    approval_status: Mapped[str | None] = mapped_column(String(20))  # 승인 상태 (PENDING/APPROVED/REJECTED)
    approved_by: Mapped[PyUUID | None] = mapped_column(UUID)  # 승인자 UUID
    approved_at: Mapped[datetime | None] = mapped_column(DateTime)  # 승인 일시
    tax_invoice_no: Mapped[str | None] = mapped_column(String(50))  # 세금계산서 번호
    tax_invoice_date: Mapped[date | None] = mapped_column(Date)  # 세금계산서 발행일
    description: Mapped[str | None] = mapped_column(Text)  # 적요
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='DRAFT')  # 상태 (DRAFT/PENDING/APPROVED/REJECTED/POSTED/CANCELLED)
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 삭제 여부