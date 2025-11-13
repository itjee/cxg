"""
재고 이동 이력 관리 테이블

Pydantic schemas for InventoryMovements model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class InventoryMovementsBase(BaseModel):
    """Base schema for InventoryMovements"""
    model_config = ConfigDict(from_attributes=True)

    movement_code: str = Field(max_length=50, description="이동 코드 (이동번호)")
    doc_date: date = Field(description="전표 일자")
    movement_type: str = Field(max_length=20, description="이동 유형 (IN/OUT/TRANSFER/ADJUSTMENT)")
    reference_doc_type: str | None = Field(None, max_length=50, description="참조 문서 유형 (PO/SO/TRANSFER 등)")
    reference_doc_id: UUID | None = Field(None, description="참조 문서 식별자")
    warehouse_id: UUID = Field(description="창고 식별자")
    location_id: UUID | None = Field(None, description="로케이션 식별자")
    product_id: UUID = Field(description="제품 식별자")
    lot_number: str | None = Field(None, max_length=100, description="로트 번호")
    serial_number: str | None = Field(None, max_length=100, description="시리얼 번호")
    qty: int = Field(description="이동 수량 (입고: 양수, 출고: 음수)")
    unit_cost: Decimal | None = Field(default=0, description="단가")
    total_cost: Decimal | None = Field(default=0, description="총 원가 (수량 × 단가)")
    reason_code: str | None = Field(None, max_length=50, description="사유 코드")
    notes: str | None = Field(None, description="비고")
    REFERENCES: str | None = None
    ON: str | None = None


class InventoryMovementsCreate(InventoryMovementsBase):
    """Schema for creating InventoryMovements"""

    # Exclude auto-generated fields
    pass


class InventoryMovementsUpdate(BaseModel):
    """Schema for updating InventoryMovements (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    movement_code: str | None = Field(None, max_length=50, description="이동 코드 (이동번호)")
    doc_date: date | None = Field(None, description="전표 일자")
    movement_type: str | None = Field(None, max_length=20, description="이동 유형 (IN/OUT/TRANSFER/ADJUSTMENT)")
    reference_doc_type: str | None = Field(None, max_length=50, description="참조 문서 유형 (PO/SO/TRANSFER 등)")
    reference_doc_id: UUID | None = Field(None, description="참조 문서 식별자")
    warehouse_id: UUID | None = Field(None, description="창고 식별자")
    location_id: UUID | None = Field(None, description="로케이션 식별자")
    product_id: UUID | None = Field(None, description="제품 식별자")
    lot_number: str | None = Field(None, max_length=100, description="로트 번호")
    serial_number: str | None = Field(None, max_length=100, description="시리얼 번호")
    qty: int | None = Field(None, description="이동 수량 (입고: 양수, 출고: 음수)")
    unit_cost: Decimal | None = Field(default=0, description="단가")
    total_cost: Decimal | None = Field(default=0, description="총 원가 (수량 × 단가)")
    reason_code: str | None = Field(None, max_length=50, description="사유 코드")
    notes: str | None = Field(None, description="비고")
    REFERENCES: str | None = None
    ON: str | None = None


class InventoryMovementsResponse(InventoryMovementsBase):
    """Schema for InventoryMovements response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class InventoryMovementsListResponse(BaseModel):
    """Schema for paginated InventoryMovements list response"""

    items: list[InventoryMovementsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "InventoryMovementsBase",
    "InventoryMovementsCreate",
    "InventoryMovementsUpdate",
    "InventoryMovementsResponse",
    "InventoryMovementsListResponse",
]
