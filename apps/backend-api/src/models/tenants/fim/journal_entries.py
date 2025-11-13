from uuid import UUID as PyUUID
from datetime import date, datetime
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["JournalEntries"]


class JournalEntries(TenantBaseModel):
    """회계 분개 전표 헤더 정보 관리 테이블"""
    __tablename__ = "journal_entries"
    __table_args__ = {"schema": "fim"}

    je_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 분개 전표 코드
    je_type: Mapped[str | None] = mapped_column(String(20), default='GENERAL')  # 전표 유형 (GENERAL: 일반/PURCHASE: 매입/SALES: 매출/PAYROLL: 급여/ADJUSTMENT: 조정/CLOSING: 결산)
    doc_date: Mapped[date] = mapped_column(Date, nullable=False)  # 전표 일자 (문서 일자)
    posting_date: Mapped[date] = mapped_column(Date, nullable=False)  # 전기 일자
    period: Mapped[str] = mapped_column(String(7), nullable=False)  # 회계 기간 (YYYY-MM)
    fiscal_year: Mapped[str | None] = mapped_column(String(4))  # 회계 연도
    reference_doc_type: Mapped[str | None] = mapped_column(String(50))  # 참조 문서 유형 (구매전표/판매전표/급여전표 등)
    reference_doc_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 참조 문서 식별자
    reference_number: Mapped[str | None] = mapped_column(String(100))  # 참조 번호
    total_debit: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 총 차변 금액
    total_credit: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 총 대변 금액
    currency: Mapped[str | None] = mapped_column(String(3), ForeignKey("adm.currencies.id"), default='KRW')  # 통화 (ISO 4217)
    exchange_rate: Mapped[Decimal | None] = mapped_column(Numeric(precision=15, scale=6), default=1)  # 환율
    description: Mapped[str | None] = mapped_column(Text)  # 적요 (전표 설명)
    memo: Mapped[str | None] = mapped_column(Text)  # 메모
    status: Mapped[str | None] = mapped_column(String(20), ForeignKey("fim.journal_entries.id"), default='DRAFT')  # 상태 (DRAFT: 임시저장/POSTED: 전기완료/REVERSED: 역분개/CANCELLED: 취소)
    posted_at: Mapped[datetime | None] = mapped_column(DateTime)  # 전기 일시
    posted_by: Mapped[PyUUID | None] = mapped_column(UUID)  # 전기자 UUID
    approved_by: Mapped[PyUUID | None] = mapped_column(UUID)  # 승인자 UUID
    approved_at: Mapped[datetime | None] = mapped_column(DateTime)  # 승인 일시
    reversed_je_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 역분개 전표 ID
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그