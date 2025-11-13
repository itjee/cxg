from uuid import UUID as PyUUID
from datetime import date, datetime
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["AssetDepreciation"]


class AssetDepreciation(TenantBaseModel):
    """감가상각: 고정자산 월별 감가상각 이력"""
    __tablename__ = "asset_depreciation"
    __table_args__ = {"schema": "fam"}

    asset_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("fam.fixed_assets.id"), nullable=False)  # 고정자산 ID
    asset_code: Mapped[str | None] = mapped_column(String(50))  # 자산 코드 (스냅샷)
    asset_name: Mapped[str | None] = mapped_column(String(200))  # 자산명 (스냅샷)
    depreciation_year: Mapped[int] = mapped_column(Integer, nullable=False)  # 상각 연도
    depreciation_month: Mapped[int] = mapped_column(Integer, nullable=False)  # 상각 월 (1-12)
    depreciation_date: Mapped[date] = mapped_column(Date, nullable=False)  # 상각 일자
    depreciation_method: Mapped[str] = mapped_column(String(20), nullable=False)  # 상각 방법
    depreciation_amount: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 당월 상각액
    accumulated_depreciation: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 감가상각누계액
    book_value: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 장부가액
    journal_entry_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("fim.journal_entries.id"))  # 분개 ID
    business_document_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("fim.business_documents.id"))  # 업무전표 ID
    is_posted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 전기 여부
    posted_at: Mapped[datetime | None] = mapped_column(DateTime)  # 전기 일시
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 삭제 여부