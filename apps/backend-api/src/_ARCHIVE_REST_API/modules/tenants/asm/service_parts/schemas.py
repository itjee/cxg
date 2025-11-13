"""
A/S 작업시 사용된 부품 내역 관리 테이블

Pydantic schemas for ServiceParts model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class ServicePartsBase(BaseModel):
    """Base schema for ServiceParts"""
    model_config = ConfigDict(from_attributes=True)

    service_request_id: UUID = Field(description="A/S 요청 식별자")
    product_id: UUID = Field(description="부품(제품) 식별자")
    part_name: str | None = Field(None, max_length=200, description="부품명")
    part_code: str | None = Field(None, max_length=50, description="부품 코드")
    serial_number: str | None = Field(None, max_length=100, description="부품 시리얼 번호")
    qty: int = Field(description="사용 수량")
    unit_cost: Decimal = Field(description="부품 단가")
    total_cost: Decimal = Field(description="총 비용 (단가 × 수량)")
    part_condition: str | None = Field(None, max_length=20, description="부품 상태 (NEW: 신품/REFURBISHED: 리퍼/USED: 중고)")
    warranty_months: int | None = Field(None, description="부품 보증 개월수")
    notes: str | None = Field(None, description="비고")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ServicePartsCreate(ServicePartsBase):
    """Schema for creating ServiceParts"""

    # Exclude auto-generated fields
    pass


class ServicePartsUpdate(BaseModel):
    """Schema for updating ServiceParts (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    service_request_id: UUID | None = Field(None, description="A/S 요청 식별자")
    product_id: UUID | None = Field(None, description="부품(제품) 식별자")
    part_name: str | None = Field(None, max_length=200, description="부품명")
    part_code: str | None = Field(None, max_length=50, description="부품 코드")
    serial_number: str | None = Field(None, max_length=100, description="부품 시리얼 번호")
    qty: int | None = Field(None, description="사용 수량")
    unit_cost: Decimal | None = Field(None, description="부품 단가")
    total_cost: Decimal | None = Field(None, description="총 비용 (단가 × 수량)")
    part_condition: str | None = Field(None, max_length=20, description="부품 상태 (NEW: 신품/REFURBISHED: 리퍼/USED: 중고)")
    warranty_months: int | None = Field(None, description="부품 보증 개월수")
    notes: str | None = Field(None, description="비고")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ServicePartsResponse(ServicePartsBase):
    """Schema for ServiceParts response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class ServicePartsListResponse(BaseModel):
    """Schema for paginated ServiceParts list response"""

    items: list[ServicePartsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "ServicePartsBase",
    "ServicePartsCreate",
    "ServicePartsUpdate",
    "ServicePartsResponse",
    "ServicePartsListResponse",
]
