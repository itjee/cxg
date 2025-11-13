from uuid import UUID as PyUUID
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["JournalEntryLines"]


class JournalEntryLines(TenantBaseModel):
    """회계 분개 전표 상세 라인 정보 관리 테이블 (차변/대변)"""
    __tablename__ = "journal_entry_lines"
    __table_args__ = {"schema": "fim"}

    je_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("fim.journal_entries.id"), nullable=False)  # 분개 전표 식별자
    line_no: Mapped[int] = mapped_column(Integer, nullable=False)  # 라인 번호 (순서)
    account_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("fim.accounts.id"), nullable=False)  # 계정과목 식별자
    debit_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 차변 금액
    credit_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 대변 금액
    description: Mapped[str | None] = mapped_column(Text)  # 적요 (라인별 설명)
    cost_center: Mapped[str | None] = mapped_column(String(50))  # 원가센터 코드
    cost_center_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 원가센터 식별자
    project_code: Mapped[str | None] = mapped_column(String(50))  # 프로젝트 코드
    project_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 프로젝트 식별자
    department_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 부서 식별자
    partner_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 거래처 식별자
    partner_type: Mapped[str | None] = mapped_column(String(20))  # 거래처 유형 (CUSTOMER: 고객/VENDOR: 공급업체/EMPLOYEE: 임직원/OTHER: 기타)
    tax_code: Mapped[str | None] = mapped_column(String(20))  # 세금 코드
    tax_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 세액
    quantity: Mapped[Decimal | None] = mapped_column(Numeric(precision=15, scale=3))  # 수량 (재고 관련)
    unit_price: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 단가
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그