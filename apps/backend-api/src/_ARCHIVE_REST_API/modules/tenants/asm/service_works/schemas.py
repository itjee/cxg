"""
A/S 작업 내역 및 진행 상황 관리 테이블

Pydantic schemas for ServiceWorks model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class ServiceWorksBase(BaseModel):
    """Base schema for ServiceWorks"""
    model_config = ConfigDict(from_attributes=True)

    service_request_id: UUID = Field(description="A/S 요청 식별자")
    work_date: date = Field(description="작업 실시 일자")
    technician_id: UUID = Field(description="작업 기술자 식별자")
    work_description: str = Field(description="작업 내용 상세 설명")
    work_start_time: time | None = Field(None, description="작업 시작 시간")
    work_end_time: time | None = Field(None, description="작업 종료 시간")
    labor_hours: Decimal | None = Field(default=0, description="작업 소요 시간 (시간 단위)")
    labor_cost: Decimal | None = Field(default=0, description="인건비")
    parts_cost: Decimal | None = Field(default=0, description="부품비")
    other_cost: Decimal | None = Field(default=0, description="기타 비용")
    total_cost: Decimal | None = Field(default=0, description="총 비용 (인건비 + 부품비 + 기타)")
    work_result: str | None = Field(None, max_length=20, description="작업 결과 (SUCCESS: 성공/PARTIAL: 부분성공/FAILED: 실패)")
    result_notes: str | None = Field(None, description="작업 결과 메모")
    status: str | None = Field(max_length=20, default='COMPLETED', description="작업 상태 (IN_PROGRESS: 진행중/COMPLETED: 완료/CANCELLED: 취소)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ServiceWorksCreate(ServiceWorksBase):
    """Schema for creating ServiceWorks"""

    # Exclude auto-generated fields
    pass


class ServiceWorksUpdate(BaseModel):
    """Schema for updating ServiceWorks (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    service_request_id: UUID | None = Field(None, description="A/S 요청 식별자")
    work_date: date | None = Field(None, description="작업 실시 일자")
    technician_id: UUID | None = Field(None, description="작업 기술자 식별자")
    work_description: str | None = Field(None, description="작업 내용 상세 설명")
    work_start_time: time | None = Field(None, description="작업 시작 시간")
    work_end_time: time | None = Field(None, description="작업 종료 시간")
    labor_hours: Decimal | None = Field(default=0, description="작업 소요 시간 (시간 단위)")
    labor_cost: Decimal | None = Field(default=0, description="인건비")
    parts_cost: Decimal | None = Field(default=0, description="부품비")
    other_cost: Decimal | None = Field(default=0, description="기타 비용")
    total_cost: Decimal | None = Field(default=0, description="총 비용 (인건비 + 부품비 + 기타)")
    work_result: str | None = Field(None, max_length=20, description="작업 결과 (SUCCESS: 성공/PARTIAL: 부분성공/FAILED: 실패)")
    result_notes: str | None = Field(None, description="작업 결과 메모")
    status: str | None = Field(max_length=20, default='COMPLETED', description="작업 상태 (IN_PROGRESS: 진행중/COMPLETED: 완료/CANCELLED: 취소)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ServiceWorksResponse(ServiceWorksBase):
    """Schema for ServiceWorks response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class ServiceWorksListResponse(BaseModel):
    """Schema for paginated ServiceWorks list response"""

    items: list[ServiceWorksResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "ServiceWorksBase",
    "ServiceWorksCreate",
    "ServiceWorksUpdate",
    "ServiceWorksResponse",
    "ServiceWorksListResponse",
]
