"""
고객 세그먼트 관리 테이블

Pydantic schemas for CustomerSegments model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class CustomerSegmentsBase(BaseModel):
    """Base schema for CustomerSegments"""
    model_config = ConfigDict(from_attributes=True)

    segment_code: str = Field(max_length=50, description="세그먼트 코드 (고유번호)")
    name: str = Field(max_length=200, description="세그먼트명")
    description: str | None = Field(None, description="설명")
    segment_type: str = Field(max_length=20, description="세그먼트 유형 (STATIC/DYNAMIC/BEHAVIORAL/DEMOGRAPHIC/GEOGRAPHIC/VALUE_BASED/CUSTOM)")
    criteria: dict | None = Field(None, description="세그먼트 조건 (JSON 형식, 예: {\"industry\": \"IT\", \"revenue\": \">1000000\"})")
    member_count: int | None = Field(default=0, description="회원 수 (캐시)")
    last_calculated_at: datetime | None = Field(None, description="마지막 계산 일시")
    is_dynamic: bool | None = Field(default=False, description="동적 세그먼트 여부 (조건에 따라 자동 추가/제거)")
    is_auto_update: bool | None = Field(default=False, description="자동 업데이트 여부")
    update_frequency: str | None = Field(None, max_length=20, description="업데이트 주기 (HOURLY/DAILY/WEEKLY/MONTHLY)")
    owner_id: UUID | None = Field(None, description="담당자 UUID")
    status: str = Field(max_length=20, default='ACTIVE', description="세그먼트 상태 (ACTIVE: 활성, INACTIVE: 비활성, ARCHIVED: 보관)")
    is_deleted: bool = Field(default=False, description="논리 삭제 플래그")
    notes: str | None = Field(None, description="비고")


class CustomerSegmentsCreate(CustomerSegmentsBase):
    """Schema for creating CustomerSegments"""

    # Exclude auto-generated fields
    pass


class CustomerSegmentsUpdate(BaseModel):
    """Schema for updating CustomerSegments (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    segment_code: str | None = Field(None, max_length=50, description="세그먼트 코드 (고유번호)")
    name: str | None = Field(None, max_length=200, description="세그먼트명")
    description: str | None = Field(None, description="설명")
    segment_type: str | None = Field(None, max_length=20, description="세그먼트 유형 (STATIC/DYNAMIC/BEHAVIORAL/DEMOGRAPHIC/GEOGRAPHIC/VALUE_BASED/CUSTOM)")
    criteria: dict | None = Field(None, description="세그먼트 조건 (JSON 형식, 예: {\"industry\": \"IT\", \"revenue\": \">1000000\"})")
    member_count: int | None = Field(default=0, description="회원 수 (캐시)")
    last_calculated_at: datetime | None = Field(None, description="마지막 계산 일시")
    is_dynamic: bool | None = Field(default=False, description="동적 세그먼트 여부 (조건에 따라 자동 추가/제거)")
    is_auto_update: bool | None = Field(default=False, description="자동 업데이트 여부")
    update_frequency: str | None = Field(None, max_length=20, description="업데이트 주기 (HOURLY/DAILY/WEEKLY/MONTHLY)")
    owner_id: UUID | None = Field(None, description="담당자 UUID")
    status: str | None = Field(max_length=20, default='ACTIVE', description="세그먼트 상태 (ACTIVE: 활성, INACTIVE: 비활성, ARCHIVED: 보관)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    notes: str | None = Field(None, description="비고")


class CustomerSegmentsResponse(CustomerSegmentsBase):
    """Schema for CustomerSegments response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class CustomerSegmentsListResponse(BaseModel):
    """Schema for paginated CustomerSegments list response"""

    items: list[CustomerSegmentsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "CustomerSegmentsBase",
    "CustomerSegmentsCreate",
    "CustomerSegmentsUpdate",
    "CustomerSegmentsResponse",
    "CustomerSegmentsListResponse",
]
