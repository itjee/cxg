from uuid import UUID as PyUUID
from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["ProductSuppliers"]


class ProductSuppliers(TenantBaseModel):
    """제품 공급업체 관리 테이블"""
    __tablename__ = "product_suppliers"
    __table_args__ = {"schema": "pim"}

    product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 제품 식별자
    supplier_id: Mapped[PyUUID] = mapped_column(UUID, nullable=False)  # 공급업체 식별자
    supplier_code: Mapped[str | None] = mapped_column(String(50))  # 공급업체의 제품 코드
    supplier_name: Mapped[str | None] = mapped_column(String(200))  # 공급업체의 제품명
    supply_price: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 공급 가격
    currency: Mapped[str | None] = mapped_column(String(3), default='KRW')  # 통화 (ISO 4217)
    lead_time_days: Mapped[int | None] = mapped_column(Integer)  # 리드타임 (일수)
    moq: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=2))  # 최소 주문 수량 (Minimum Order Quantity)
    moq_unit: Mapped[str | None] = mapped_column(String(20))  # MOQ 단위
    is_preferred: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 주 공급업체 여부
    priority: Mapped[int | None] = mapped_column(Integer, default=0)  # 우선순위 (낮을수록 우선)
    contract_start_date: Mapped[date | None] = mapped_column(Date)  # 계약 시작일
    contract_end_date: Mapped[date | None] = mapped_column(Date)  # 계약 종료일
    contract_no: Mapped[str | None] = mapped_column(String(50))  # 계약 번호
    quality_rating: Mapped[int | None] = mapped_column(Integer)  # 품질 평가 (1-5점)
    delivery_rating: Mapped[int | None] = mapped_column(Integer)  # 납기 평가 (1-5점)
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str | None] = mapped_column(String(20), default='ACTIVE')  # 상태 (ACTIVE/INACTIVE/SUSPENDED/TERMINATED)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그