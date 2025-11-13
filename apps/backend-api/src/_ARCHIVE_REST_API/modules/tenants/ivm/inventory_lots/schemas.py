"""
로트 마스터 관리 테이블

Pydantic schemas for InventoryLots model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class InventoryLotsBase(BaseModel):
    """Base schema for InventoryLots"""
    model_config = ConfigDict(from_attributes=True)

    lot_number: str = Field(max_length=100, description="로트 번호")
    product_id: UUID = Field(description="제품 식별자")
    manufactured_date: date | None = Field(None, description="제조 일자")
    manufacturer_id: UUID | None = Field(None, description="제조사 식별자")
    supplier_id: UUID | None = Field(None, description="공급사 식별자")
    expiry_date: str | None = Field(None, description="유통기한")
    best_before_date: str | None = Field(None, description="품질 보증 기한")
    quality_grade: str | None = Field(None, max_length=20, description="품질 등급 (A/B/C 등)")
    quality_certificate_no: str | None = Field(None, max_length=100, description="품질 인증서 번호")
    quality_test_date: date | None = Field(None, description="품질 검사 일자")
    quality_test_result: str | None = Field(None, description="품질 검사 결과 (PASS/FAIL/PENDING)")
    quality_notes: str | None = Field(None, description="품질 관련 비고")
    origin_country: str | None = Field(None, max_length=3, description="원산지 국가 코드 (ISO 3166-1 alpha-3)")
    origin_region: str | None = Field(None, max_length=100, description="원산지 지역")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/QUARANTINE/EXPIRED/RECALLED)")
    quarantine_reason: str | None = Field(None, description="격리 사유")
    recall_date: date | None = Field(None, description="리콜 일자")
    recall_reason: str | None = Field(None, description="리콜 사유")
    notes: str | None = Field(None, description="비고")
    REFERENCES: str | None = None
    ON: str | None = None


class InventoryLotsCreate(InventoryLotsBase):
    """Schema for creating InventoryLots"""

    # Exclude auto-generated fields
    pass


class InventoryLotsUpdate(BaseModel):
    """Schema for updating InventoryLots (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    lot_number: str | None = Field(None, max_length=100, description="로트 번호")
    product_id: UUID | None = Field(None, description="제품 식별자")
    manufactured_date: date | None = Field(None, description="제조 일자")
    manufacturer_id: UUID | None = Field(None, description="제조사 식별자")
    supplier_id: UUID | None = Field(None, description="공급사 식별자")
    expiry_date: str | None = Field(None, description="유통기한")
    best_before_date: str | None = Field(None, description="품질 보증 기한")
    quality_grade: str | None = Field(None, max_length=20, description="품질 등급 (A/B/C 등)")
    quality_certificate_no: str | None = Field(None, max_length=100, description="품질 인증서 번호")
    quality_test_date: date | None = Field(None, description="품질 검사 일자")
    quality_test_result: str | None = Field(None, description="품질 검사 결과 (PASS/FAIL/PENDING)")
    quality_notes: str | None = Field(None, description="품질 관련 비고")
    origin_country: str | None = Field(None, max_length=3, description="원산지 국가 코드 (ISO 3166-1 alpha-3)")
    origin_region: str | None = Field(None, max_length=100, description="원산지 지역")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/QUARANTINE/EXPIRED/RECALLED)")
    quarantine_reason: str | None = Field(None, description="격리 사유")
    recall_date: date | None = Field(None, description="리콜 일자")
    recall_reason: str | None = Field(None, description="리콜 사유")
    notes: str | None = Field(None, description="비고")
    REFERENCES: str | None = None
    ON: str | None = None


class InventoryLotsResponse(InventoryLotsBase):
    """Schema for InventoryLots response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class InventoryLotsListResponse(BaseModel):
    """Schema for paginated InventoryLots list response"""

    items: list[InventoryLotsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "InventoryLotsBase",
    "InventoryLotsCreate",
    "InventoryLotsUpdate",
    "InventoryLotsResponse",
    "InventoryLotsListResponse",
]
