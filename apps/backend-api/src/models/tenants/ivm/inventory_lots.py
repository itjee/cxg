from uuid import UUID as PyUUID
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["InventoryLots"]


class InventoryLots(TenantBaseModel):
    """로트 마스터 관리 테이블"""
    __tablename__ = "inventory_lots"
    __table_args__ = {"schema": "ivm"}

    lot_number: Mapped[str] = mapped_column(String(100), nullable=False)  # 로트 번호
    product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 제품 식별자
    manufactured_date: Mapped[date | None] = mapped_column(Date)  # 제조 일자
    manufacturer_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 제조사 식별자
    supplier_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 공급사 식별자
    expiry_date: Mapped[str | None] = mapped_column()  # 유통기한
    best_before_date: Mapped[str | None] = mapped_column()  # 품질 보증 기한
    quality_grade: Mapped[str | None] = mapped_column(String(20))  # 품질 등급 (A/B/C 등)
    quality_certificate_no: Mapped[str | None] = mapped_column(String(100))  # 품질 인증서 번호
    quality_test_date: Mapped[date | None] = mapped_column(Date)  # 품질 검사 일자
    quality_test_result: Mapped[str | None] = mapped_column()  # 품질 검사 결과 (PASS/FAIL/PENDING)
    quality_notes: Mapped[str | None] = mapped_column(Text)  # 품질 관련 비고
    origin_country: Mapped[str | None] = mapped_column(String(3))  # 원산지 국가 코드 (ISO 3166-1 alpha-3)
    origin_region: Mapped[str | None] = mapped_column(String(100))  # 원산지 지역
    status: Mapped[str | None] = mapped_column(String(20), default='ACTIVE')  # 상태 (ACTIVE/QUARANTINE/EXPIRED/RECALLED)
    quarantine_reason: Mapped[str | None] = mapped_column(Text)  # 격리 사유
    recall_date: Mapped[date | None] = mapped_column(Date)  # 리콜 일자
    recall_reason: Mapped[str | None] = mapped_column(Text)  # 리콜 사유
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    REFERENCES: Mapped[str | None] = mapped_column()
    ON: Mapped[str | None] = mapped_column()