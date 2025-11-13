from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Accounts"]


class Accounts(TenantBaseModel):
    """회계 계정과목 정보 관리 테이블 (자산, 부채, 자본, 수익, 비용)"""
    __tablename__ = "accounts"
    __table_args__ = {"schema": "fim"}

    account_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 계정과목 코드
    account_name: Mapped[str] = mapped_column(String(200), nullable=False)  # 계정과목 명칭
    account_name_en: Mapped[str | None] = mapped_column(String(200))  # 계정과목 영문명
    account_type: Mapped[str] = mapped_column(String(20), nullable=False)  # 계정 유형 (ASSET: 자산/LIABILITY: 부채/EQUITY: 자본/REVENUE: 수익/EXPENSE: 비용)
    account_group: Mapped[str | None] = mapped_column(String(50))  # 계정 그룹 (유동자산/비유동자산/영업수익/영업외수익 등)
    account_class: Mapped[str | None] = mapped_column(String(50))  # 계정 분류 (현금성자산/매출채권/재고자산 등)
    parent_account_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("fim.accounts.id"))  # 상위 계정과목 식별자 (계층구조)
    level_depth: Mapped[int | None] = mapped_column(Integer, default=1)  # 계층 깊이 (1=대분류, 2=중분류, 3=소분류)
    full_path: Mapped[str | None] = mapped_column(String(500))  # 전체 경로
    is_control_account: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 통제계정 여부 (하위계정 관리)
    is_posting_allowed: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 전기 허용 여부
    is_bank_account: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 은행계정 여부
    is_cash_account: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 현금계정 여부
    currency: Mapped[str | None] = mapped_column(String(3), default='KRW')  # 기본 통화 (ISO 4217)
    fs_position: Mapped[str | None] = mapped_column(String(50))  # 재무제표 표시 위치
    statement_order: Mapped[int | None] = mapped_column(Integer, default=0)  # 재무제표 표시 순서
    tax_category: Mapped[str | None] = mapped_column(String(20))  # 세금 분류
    tax_code: Mapped[str | None] = mapped_column(String(20))  # 세금 코드
    description: Mapped[str | None] = mapped_column(Text)  # 계정 설명
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    is_active: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 사용 여부
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그