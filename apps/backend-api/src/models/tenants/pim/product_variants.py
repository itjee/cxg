from uuid import UUID as PyUUID
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["ProductVariants"]


class ProductVariants(TenantBaseModel):
    """제품 변형(SKU) 관리 테이블 (빨강-L, 파랑-M 등)"""
    __tablename__ = "product_variants"
    __table_args__ = {"schema": "pim"}

    product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 제품 식별자
    sku: Mapped[str] = mapped_column(String(50), nullable=False)  # SKU (Stock Keeping Unit)
    name: Mapped[str | None] = mapped_column(String(200))  # 변형명 (예: 빨강-L)
    option_values: Mapped[dict] = mapped_column(JSON, nullable=False)  # 옵션 값 조합 (JSON 배열: [{"option_id": "...", "value_id": "..."}])
    price: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 판매 가격
    cost_price: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 원가
    stock_quantity: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=2), default=0)  # 재고 수량
    reserved_quantity: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=2), default=0)  # 예약 수량 (주문 대기 등)
    available_quantity: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=2))  # 가용 수량 (재고 - 예약)
    weight: Mapped[Decimal | None] = mapped_column(Numeric(precision=10, scale=2))  # 무게 (g)
    length: Mapped[Decimal | None] = mapped_column(Numeric(precision=10, scale=2))  # 길이 (cm)
    width: Mapped[Decimal | None] = mapped_column(Numeric(precision=10, scale=2))  # 너비 (cm)
    height: Mapped[Decimal | None] = mapped_column(Numeric(precision=10, scale=2))  # 높이 (cm)
    image_url: Mapped[str | None] = mapped_column(String(500))  # 대표 이미지 URL
    barcode: Mapped[str | None] = mapped_column(String(50))  # 바코드
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str | None] = mapped_column(String(20), default='ACTIVE')  # 상태 (ACTIVE/INACTIVE/OUT_OF_STOCK/DISCONTINUED)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그