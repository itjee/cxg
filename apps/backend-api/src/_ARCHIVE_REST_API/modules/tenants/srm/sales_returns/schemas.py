"""
판매 반품 헤더 관리 테이블

Pydantic schemas for SalesReturns model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class SalesReturnsBase(BaseModel):
    """Base schema for SalesReturns"""
    model_config = ConfigDict(from_attributes=True)

    return_code: str = Field(max_length=50, description="반품 코드 (반품번호)")
    return_type: str = Field(max_length=20, default='RETURN', description="반품 유형 (RETURN/EXCHANGE/DEFECT)")
    so_id: UUID | None = Field(None, description="판매주문 식별자")
    delivery_id: UUID | None = Field(None, description="출고 식별자")
    invoice_id: UUID | None = Field(None, description="송장 식별자")
    customer_id: UUID = Field(description="고객 식별자")
    doc_date: date = Field(description="전표 일자")
    return_date: date | None = Field(None, description="실제 반품일")
    warehouse_id: UUID = Field(description="입고 창고 식별자")
    reason_code: str | None = Field(None, max_length=20, description="반품 사유 코드")
    reason_desc: str | None = Field(None, description="반품 사유 설명")
    total_amount: Decimal | None = Field(default=0, description="총 금액")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    status: str | None = Field(max_length=20, default='DRAFT', description="상태 (DRAFT/CONFIRMED/RECEIVED/REFUNDED/CANCELLED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    notes: str | None = Field(None, description="비고")


class SalesReturnsCreate(SalesReturnsBase):
    """Schema for creating SalesReturns"""

    # Exclude auto-generated fields
    pass


class SalesReturnsUpdate(BaseModel):
    """Schema for updating SalesReturns (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    return_code: str | None = Field(None, max_length=50, description="반품 코드 (반품번호)")
    return_type: str | None = Field(max_length=20, default='RETURN', description="반품 유형 (RETURN/EXCHANGE/DEFECT)")
    so_id: UUID | None = Field(None, description="판매주문 식별자")
    delivery_id: UUID | None = Field(None, description="출고 식별자")
    invoice_id: UUID | None = Field(None, description="송장 식별자")
    customer_id: UUID | None = Field(None, description="고객 식별자")
    doc_date: date | None = Field(None, description="전표 일자")
    return_date: date | None = Field(None, description="실제 반품일")
    warehouse_id: UUID | None = Field(None, description="입고 창고 식별자")
    reason_code: str | None = Field(None, max_length=20, description="반품 사유 코드")
    reason_desc: str | None = Field(None, description="반품 사유 설명")
    total_amount: Decimal | None = Field(default=0, description="총 금액")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    status: str | None = Field(max_length=20, default='DRAFT', description="상태 (DRAFT/CONFIRMED/RECEIVED/REFUNDED/CANCELLED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    notes: str | None = Field(None, description="비고")


class SalesReturnsResponse(SalesReturnsBase):
    """Schema for SalesReturns response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class SalesReturnsListResponse(BaseModel):
    """Schema for paginated SalesReturns list response"""

    items: list[SalesReturnsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "SalesReturnsBase",
    "SalesReturnsCreate",
    "SalesReturnsUpdate",
    "SalesReturnsResponse",
    "SalesReturnsListResponse",
]
