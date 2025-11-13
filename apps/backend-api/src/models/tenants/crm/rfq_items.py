from uuid import UUID as PyUUID
from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["RfqItems"]


class RfqItems(TenantBaseModel):
    """견적 요청서 품목 관리 테이블"""
    __tablename__ = "rfq_items"
    __table_args__ = {"schema": "crm"}

    rfq_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("crm.rfqs.id"), nullable=False)  # 견적 요청서 헤더 ID
    line_no: Mapped[int] = mapped_column(Integer, nullable=False)  # 라인 번호
    product_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("pim.products.id"))  # 제품 ID (등록된 제품인 경우)
    product_name: Mapped[str | None] = mapped_column(String(200))  # 제품명 (제품 미등록 시 직접 입력)
    product_code: Mapped[str | None] = mapped_column(String(100))  # 제품 코드 (제품 미등록 시 직접 입력)
    description: Mapped[str | None] = mapped_column(Text)  # 상세 설명
    specifications: Mapped[str | None] = mapped_column(Text)  # 사양 (크기, 색상, 재질 등)
    qty: Mapped[int] = mapped_column(Integer, nullable=False)  # 요청 수량
    unit: Mapped[str | None] = mapped_column(String(20))  # 단위 (개, EA, BOX 등)
    target_price: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 희망 단가
    target_delivery_date: Mapped[date | None] = mapped_column(Date)  # 희망 납기일
    notes: Mapped[str | None] = mapped_column(Text)  # 비고