"""Service Requests schemas for request/response validation."""

from datetime import datetime, date
from uuid import UUID
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class ServiceRequestsBase(BaseModel):
    """Service Requests base schema."""

    sr_code: str = Field(..., max_length=50, description="A/S 요청 코드")
    customer_id: UUID = Field(..., description="고객 식별자")
    product_id: Optional[UUID] = Field(None, description="제품 식별자")
    serial_number: Optional[str] = Field(None, max_length=100, description="제품 시리얼 번호")
    purchase_date: Optional[date] = Field(None, description="제품 구매 일자")
    warranty_end_date: Optional[date] = Field(None, description="보증 종료일")
    is_warranty: Optional[bool] = Field(False, description="보증기간 내 A/S 여부")
    issue_description: str = Field(..., description="문제 및 고장 내용 설명")
    issue_category: Optional[str] = Field(None, max_length=50, description="문제 카테고리")
    service_type: Optional[str] = Field("REPAIR", max_length=20, description="A/S 유형")
    priority: Optional[str] = Field("MEDIUM", max_length=20, description="우선순위")
    status: Optional[str] = Field("RECEIVED", max_length=20, description="상태")
    assigned_technician_id: Optional[UUID] = Field(None, description="배정된 기술자 식별자")
    scheduled_date: Optional[date] = Field(None, description="예약 작업일")
    expected_completion_date: Optional[date] = Field(None, description="예상 완료일")
    estimated_cost: Optional[Decimal] = Field(None, description="예상 비용")
    actual_cost: Optional[Decimal] = Field(None, description="실제 비용")
    currency: Optional[str] = Field("KRW", max_length=3, description="통화 코드")
    customer_notes: Optional[str] = Field(None, description="고객 요청사항")
    technician_notes: Optional[str] = Field(None, description="기술자 메모")


class ServiceRequestsCreate(ServiceRequestsBase):
    """Service Requests creation schema."""

    pass


class ServiceRequestsUpdate(BaseModel):
    """Service Requests update schema."""

    sr_code: Optional[str] = Field(None, max_length=50, description="A/S 요청 코드")
    product_id: Optional[UUID] = Field(None, description="제품 식별자")
    serial_number: Optional[str] = Field(None, max_length=100, description="제품 시리얼 번호")
    issue_description: Optional[str] = Field(None, description="문제 및 고장 내용 설명")
    issue_category: Optional[str] = Field(None, max_length=50, description="문제 카테고리")
    service_type: Optional[str] = Field(None, max_length=20, description="A/S 유형")
    priority: Optional[str] = Field(None, max_length=20, description="우선순위")
    status: Optional[str] = Field(None, max_length=20, description="상태")
    assigned_technician_id: Optional[UUID] = Field(None, description="배정된 기술자 식별자")
    scheduled_date: Optional[date] = Field(None, description="예약 작업일")
    expected_completion_date: Optional[date] = Field(None, description="예상 완료일")
    actual_cost: Optional[Decimal] = Field(None, description="실제 비용")
    customer_notes: Optional[str] = Field(None, description="고객 요청사항")
    technician_notes: Optional[str] = Field(None, description="기술자 메모")


class ServiceRequestsResponse(ServiceRequestsBase):
    """Service Requests response schema."""

    id: UUID
    created_at: datetime
    updated_at: Optional[datetime]
    created_by: Optional[UUID]
    updated_by: Optional[UUID]
    completed_at: Optional[datetime]

    class Config:
        """Pydantic config."""

        from_attributes = True


class ServiceRequestsListResponse(BaseModel):
    """Service Requests list response schema."""

    items: list[ServiceRequestsResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
