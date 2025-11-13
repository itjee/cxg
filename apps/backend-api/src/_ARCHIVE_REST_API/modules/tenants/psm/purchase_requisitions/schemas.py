"""
구매요청 헤더 관리 테이블

Pydantic schemas for PurchaseRequisitions model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class PurchaseRequisitionsBase(BaseModel):
    """Base schema for PurchaseRequisitions"""
    model_config = ConfigDict(from_attributes=True)

    pr_code: str = Field(max_length=50, description="구매요청 코드 (PR-YYYYMMDD-001)")
    doc_date: date = Field(description="전표 일자")
    requester_id: UUID = Field(description="요청자 식별자")
    department_id: UUID | None = Field(None, description="부서 식별자")
    required_date: date | None = Field(None, description="필요 일자 (납품 요청일)")
    purpose: str | None = Field(None, description="구매 목적")
    total_amount: Decimal | None = Field(default=0, description="총 금액 (모든 라인의 합계)")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217 - KRW/USD/JPY 등)")
    status: str | None = Field(max_length=20, default='DRAFT', description="상태 (DRAFT/SUBMITTED/APPROVED/REJECTED/ORDERED)")
    approved_at: datetime | None = Field(None, description="승인 일시")
    approved_by: UUID | None = Field(None, description="승인자 UUID")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    REFERENCES: str | None = None
    ON: str | None = None


class PurchaseRequisitionsCreate(PurchaseRequisitionsBase):
    """Schema for creating PurchaseRequisitions"""

    # Exclude auto-generated fields
    pass


class PurchaseRequisitionsUpdate(BaseModel):
    """Schema for updating PurchaseRequisitions (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    pr_code: str | None = Field(None, max_length=50, description="구매요청 코드 (PR-YYYYMMDD-001)")
    doc_date: date | None = Field(None, description="전표 일자")
    requester_id: UUID | None = Field(None, description="요청자 식별자")
    department_id: UUID | None = Field(None, description="부서 식별자")
    required_date: date | None = Field(None, description="필요 일자 (납품 요청일)")
    purpose: str | None = Field(None, description="구매 목적")
    total_amount: Decimal | None = Field(default=0, description="총 금액 (모든 라인의 합계)")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217 - KRW/USD/JPY 등)")
    status: str | None = Field(max_length=20, default='DRAFT', description="상태 (DRAFT/SUBMITTED/APPROVED/REJECTED/ORDERED)")
    approved_at: datetime | None = Field(None, description="승인 일시")
    approved_by: UUID | None = Field(None, description="승인자 UUID")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    REFERENCES: str | None = None
    ON: str | None = None


class PurchaseRequisitionsResponse(PurchaseRequisitionsBase):
    """Schema for PurchaseRequisitions response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class PurchaseRequisitionsListResponse(BaseModel):
    """Schema for paginated PurchaseRequisitions list response"""

    items: list[PurchaseRequisitionsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "PurchaseRequisitionsBase",
    "PurchaseRequisitionsCreate",
    "PurchaseRequisitionsUpdate",
    "PurchaseRequisitionsResponse",
    "PurchaseRequisitionsListResponse",
]
