"""
견적 요청서 품목 관리 테이블

Pydantic schemas for RfqItems model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class RfqItemsBase(BaseModel):
    """Base schema for RfqItems"""
    model_config = ConfigDict(from_attributes=True)

    rfq_id: UUID = Field(description="견적 요청서 헤더 ID")
    line_no: int = Field(description="라인 번호")
    product_id: UUID | None = Field(None, description="제품 ID (등록된 제품인 경우)")
    product_name: str | None = Field(None, max_length=200, description="제품명 (제품 미등록 시 직접 입력)")
    product_code: str | None = Field(None, max_length=100, description="제품 코드 (제품 미등록 시 직접 입력)")
    description: str | None = Field(None, description="상세 설명")
    specifications: str | None = Field(None, description="사양 (크기, 색상, 재질 등)")
    qty: int = Field(description="요청 수량")
    unit: str | None = Field(None, max_length=20, description="단위 (개, EA, BOX 등)")
    target_price: Decimal | None = Field(None, description="희망 단가")
    target_delivery_date: date | None = Field(None, description="희망 납기일")
    notes: str | None = Field(None, description="비고")


class RfqItemsCreate(RfqItemsBase):
    """Schema for creating RfqItems"""

    # Exclude auto-generated fields
    pass


class RfqItemsUpdate(BaseModel):
    """Schema for updating RfqItems (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    rfq_id: UUID | None = Field(None, description="견적 요청서 헤더 ID")
    line_no: int | None = Field(None, description="라인 번호")
    product_id: UUID | None = Field(None, description="제품 ID (등록된 제품인 경우)")
    product_name: str | None = Field(None, max_length=200, description="제품명 (제품 미등록 시 직접 입력)")
    product_code: str | None = Field(None, max_length=100, description="제품 코드 (제품 미등록 시 직접 입력)")
    description: str | None = Field(None, description="상세 설명")
    specifications: str | None = Field(None, description="사양 (크기, 색상, 재질 등)")
    qty: int | None = Field(None, description="요청 수량")
    unit: str | None = Field(None, max_length=20, description="단위 (개, EA, BOX 등)")
    target_price: Decimal | None = Field(None, description="희망 단가")
    target_delivery_date: date | None = Field(None, description="희망 납기일")
    notes: str | None = Field(None, description="비고")


class RfqItemsResponse(RfqItemsBase):
    """Schema for RfqItems response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class RfqItemsListResponse(BaseModel):
    """Schema for paginated RfqItems list response"""

    items: list[RfqItemsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "RfqItemsBase",
    "RfqItemsCreate",
    "RfqItemsUpdate",
    "RfqItemsResponse",
    "RfqItemsListResponse",
]
