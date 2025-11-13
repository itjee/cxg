from uuid import UUID as PyUUID
from datetime import date, datetime
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["AssetDisposals"]


class AssetDisposals(TenantBaseModel):
    """자산 처분: 고정자산 매각/폐기 이력"""
    __tablename__ = "asset_disposals"
    __table_args__ = {"schema": "fam"}

    asset_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("fam.fixed_assets.id"), nullable=False)  # 고정자산 ID
    asset_code: Mapped[str | None] = mapped_column(String(50))  # 자산 코드 (스냅샷)
    asset_name: Mapped[str | None] = mapped_column(String(200))  # 자산명 (스냅샷)
    disposal_no: Mapped[str] = mapped_column(String(50), nullable=False)  # 처분 번호
    disposal_date: Mapped[date] = mapped_column(Date, nullable=False)  # 처분일
    disposal_method: Mapped[str] = mapped_column(String(20), nullable=False)  # 처분 방법 (SALE/DISCARD/DONATION/EXCHANGE/LOSS)
    disposal_reason: Mapped[str | None] = mapped_column(Text)  # 처분 사유
    acquisition_cost: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 취득가액 (스냅샷)
    accumulated_depreciation: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 감가상각누계액 (스냅샷)
    book_value: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 장부가액 (스냅샷)
    disposal_amount: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 처분가액
    disposal_gain_loss: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 처분손익 (처분가액 - 장부가액)
    buyer_partner_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("crm.partners.id"))  # 매입자 ID (거래처)
    buyer_name: Mapped[str | None] = mapped_column(String(200))  # 매입자명
    buyer_contact: Mapped[str | None] = mapped_column(String(100))  # 매입자 연락처
    journal_entry_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("fim.journal_entries.id"))  # 분개 ID
    business_document_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("fim.business_documents.id"))  # 업무전표 ID
    approval_status: Mapped[str | None] = mapped_column(String(20))  # 승인 상태 (PENDING/APPROVED/REJECTED)
    approved_by: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("sys.users.id"))  # 승인자 UUID
    approved_at: Mapped[datetime | None] = mapped_column(DateTime)  # 승인 일시
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 삭제 여부