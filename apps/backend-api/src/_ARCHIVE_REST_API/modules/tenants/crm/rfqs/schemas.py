"""
견적 요청서 헤더 관리 테이블 (Request for Quotation)

Pydantic schemas for Rfqs model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class RfqsBase(BaseModel):
    """Base schema for Rfqs"""
    model_config = ConfigDict(from_attributes=True)

    rfq_code: str = Field(max_length=50, description="견적 요청서 코드 (고유번호)")
    title: str = Field(max_length=200, description="제목")
    description: str | None = Field(None, description="설명")
    partner_id: UUID | None = Field(None, description="거래처 ID")
    lead_id: UUID | None = Field(None, description="리드 ID")
    contact_id: UUID | None = Field(None, description="담당자 ID (partner_contacts)")
    request_date: date = Field(description="요청일")
    due_date: date | None = Field(None, description="회신 마감일")
    required_delivery_date: date | None = Field(None, description="납품 희망일")
    delivery_address: str | None = Field(None, description="배송 주소")
    delivery_terms: str | None = Field(None, max_length=100, description="배송 조건")
    payment_terms: str | None = Field(None, max_length=100, description="결제 조건")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    owner_id: UUID | None = Field(None, description="담당 영업자 UUID")
    converted_quote_id: UUID | None = Field(None, description="전환된 견적서 ID")
    converted_at: datetime | None = Field(None, description="전환 일시")
    status: str | None = Field(max_length=20, default='DRAFT', description="상태 (DRAFT/SUBMITTED/IN_REVIEW/QUOTED/DECLINED/CANCELLED)")
    priority: str | None = Field(max_length=20, default='NORMAL', description="우선순위 (URGENT/HIGH/NORMAL/LOW)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    notes: str | None = Field(None, description="비고")


class RfqsCreate(RfqsBase):
    """Schema for creating Rfqs"""

    # Exclude auto-generated fields
    pass


class RfqsUpdate(BaseModel):
    """Schema for updating Rfqs (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    rfq_code: str | None = Field(None, max_length=50, description="견적 요청서 코드 (고유번호)")
    title: str | None = Field(None, max_length=200, description="제목")
    description: str | None = Field(None, description="설명")
    partner_id: UUID | None = Field(None, description="거래처 ID")
    lead_id: UUID | None = Field(None, description="리드 ID")
    contact_id: UUID | None = Field(None, description="담당자 ID (partner_contacts)")
    request_date: date | None = Field(None, description="요청일")
    due_date: date | None = Field(None, description="회신 마감일")
    required_delivery_date: date | None = Field(None, description="납품 희망일")
    delivery_address: str | None = Field(None, description="배송 주소")
    delivery_terms: str | None = Field(None, max_length=100, description="배송 조건")
    payment_terms: str | None = Field(None, max_length=100, description="결제 조건")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    owner_id: UUID | None = Field(None, description="담당 영업자 UUID")
    converted_quote_id: UUID | None = Field(None, description="전환된 견적서 ID")
    converted_at: datetime | None = Field(None, description="전환 일시")
    status: str | None = Field(max_length=20, default='DRAFT', description="상태 (DRAFT/SUBMITTED/IN_REVIEW/QUOTED/DECLINED/CANCELLED)")
    priority: str | None = Field(max_length=20, default='NORMAL', description="우선순위 (URGENT/HIGH/NORMAL/LOW)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    notes: str | None = Field(None, description="비고")


class RfqsResponse(RfqsBase):
    """Schema for Rfqs response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class RfqsListResponse(BaseModel):
    """Schema for paginated Rfqs list response"""

    items: list[RfqsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "RfqsBase",
    "RfqsCreate",
    "RfqsUpdate",
    "RfqsResponse",
    "RfqsListResponse",
]
