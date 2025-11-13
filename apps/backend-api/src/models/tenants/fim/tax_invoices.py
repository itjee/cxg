from uuid import UUID as PyUUID
from datetime import date, datetime
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["TaxInvoices"]


class TaxInvoices(TenantBaseModel):
    """세금계산서: 전자세금계산서 발행 및 관리"""
    __tablename__ = "tax_invoices"
    __table_args__ = {"schema": "fim"}

    invoice_no: Mapped[str] = mapped_column(String(50), nullable=False)  # 세금계산서 번호
    invoice_type: Mapped[str] = mapped_column(String(20), nullable=False)  # 세금계산서 유형 (TAX/CREDIT_NOTE/DEBIT_NOTE/MODIFIED)
    issue_type: Mapped[str] = mapped_column(String(20), nullable=False, default='NORMAL')  # 발행 유형 (NORMAL/REVERSE/IMPORT/ZERO_RATE)
    invoice_date: Mapped[date] = mapped_column(Date, nullable=False)  # 작성일자
    issue_date: Mapped[date] = mapped_column(Date, nullable=False)  # 발행일자
    approval_no: Mapped[str | None] = mapped_column(String(50))  # 승인번호 (국세청)
    approval_datetime: Mapped[datetime | None] = mapped_column(DateTime)  # 승인일시
    is_nts_confirmed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 국세청 전송 확인
    nts_confirmed_at: Mapped[datetime | None] = mapped_column(DateTime)  # 국세청 확인일시
    supplier_business_no: Mapped[str] = mapped_column(String(20), nullable=False)  # 공급자 사업자등록번호
    supplier_name: Mapped[str] = mapped_column(String(200), nullable=False)  # 공급자 상호
    supplier_ceo: Mapped[str | None] = mapped_column(String(50))  # 공급자 대표자
    supplier_address: Mapped[str | None] = mapped_column(String(500))  # 공급자 주소
    supplier_business_type: Mapped[str | None] = mapped_column(String(100))  # 공급자 업태
    supplier_business_item: Mapped[str | None] = mapped_column(String(100))  # 공급자 종목
    supplier_email: Mapped[str | None] = mapped_column(String(255))  # 공급자 이메일
    supplier_contact: Mapped[str | None] = mapped_column(String(50))  # 공급자 담당자
    supplier_phone: Mapped[str | None] = mapped_column(String(50))  # 공급자 전화번호
    buyer_business_no: Mapped[str] = mapped_column(String(20), nullable=False)  # 공급받는자 사업자등록번호
    buyer_name: Mapped[str] = mapped_column(String(200), nullable=False)  # 공급받는자 상호
    buyer_ceo: Mapped[str | None] = mapped_column(String(50))  # 공급받는자 대표자
    buyer_address: Mapped[str | None] = mapped_column(String(500))  # 공급받는자 주소
    buyer_business_type: Mapped[str | None] = mapped_column(String(100))  # 공급받는자 업태
    buyer_business_item: Mapped[str | None] = mapped_column(String(100))  # 공급받는자 종목
    buyer_email: Mapped[str | None] = mapped_column(String(255))  # 공급받는자 이메일
    buyer_contact: Mapped[str | None] = mapped_column(String(50))  # 공급받는자 담당자
    buyer_phone: Mapped[str | None] = mapped_column(String(50))  # 공급받는자 전화번호
    partner_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("crm.partners.id"))  # 거래처 ID (구매/판매 모두 참조)
    sales_order_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("srm.sales_orders.id"))  # 판매주문 식별자 (판매 세금계산서용)
    sales_delivery_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("srm.sales_deliveries.id"))  # 출고 식별자 (판매 세금계산서용)
    customer_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("crm.partners.id"))  # 고객 식별자 (판매 세금계산서용, deprecated - partner_id 사용 권장)
    supply_amount: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 공급가액
    tax_amount: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 세액
    total_amount: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 합계금액
    currency_code: Mapped[str] = mapped_column(String(3), ForeignKey("adm.currencies.id"), nullable=False, default='KRW')  # 통화 코드
    due_date: Mapped[date | None] = mapped_column(Date)  # 지급 기한일 (판매 세금계산서용)
    source_type: Mapped[str | None] = mapped_column(String(30))  # 원천 유형
    source_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 원천 문서 ID
    source_no: Mapped[str | None] = mapped_column(String(50))  # 원천 문서 번호
    business_document_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("fim.business_documents.id"))  # 업무전표 ID
    remark: Mapped[str | None] = mapped_column(Text)  # 비고 (계산서 출력용)
    notes: Mapped[str | None] = mapped_column(Text)  # 메모 (내부용)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='DRAFT')  # 상태 (DRAFT/ISSUED/SENT/CONFIRMED/CANCELLED)
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 삭제 여부