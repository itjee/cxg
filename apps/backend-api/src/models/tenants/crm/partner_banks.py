from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["PartnerBanks"]


class PartnerBanks(TenantBaseModel):
    """거래처 계좌 정보 관리 테이블 - 입출금 계좌 정보"""
    __tablename__ = "partner_banks"
    __table_args__ = {"schema": "crm"}

    partner_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("crm.customers.id"), nullable=False)  # 거래처 식별자
    account_type: Mapped[str] = mapped_column(String(20), nullable=False)  # 계좌 유형 (CHECKING: 당좌, SAVINGS: 보통, FOREIGN_CURRENCY: 외화, ESCROW: 에스크로, TRUST: 신탁, OTHER: 기타)
    bank_code: Mapped[str] = mapped_column(String(10), nullable=False)  # 은행 코드
    bank_name: Mapped[str | None] = mapped_column(String(100))  # 은행명
    account_no: Mapped[str] = mapped_column(String(50), nullable=False)  # 계좌번호
    account_holder: Mapped[str] = mapped_column(String(100), nullable=False)  # 예금주명
    account_name: Mapped[str | None] = mapped_column(String(100))  # 계좌별칭
    is_primary: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 주계좌 여부
    is_receive: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 기본 입금계좌 여부
    is_payment: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 기본 지급계좌 여부
    swift_code: Mapped[str | None] = mapped_column(String(20))  # SWIFT 코드 (해외송금용, 8자리 또는 11자리)
    branch_code: Mapped[str | None] = mapped_column(String(20))  # 지점 코드
    branch_name: Mapped[str | None] = mapped_column(String(100))  # 지점명
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='ACTIVE')  # 상태 (ACTIVE: 활성, INACTIVE: 비활성, SUSPENDED: 정지, CLOSED: 폐쇄)
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 논리 삭제 플래그