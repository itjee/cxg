"""
휴가 정책 관리 테이블 - 연차, 병가, 출산휴가 등 휴가 정책 정의

Pydantic schemas for LeavePolicies model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class LeavePoliciesBase(BaseModel):
    """Base schema for LeavePolicies"""
    model_config = ConfigDict(from_attributes=True)

    leave_type: str = Field(max_length=20, description="휴가 유형 (ANNUAL: 연차, SICK: 병가, MATERNITY: 출산휴가, UNPAID: 무급)")
    leave_name: str = Field(max_length=100, description="휴가명")
    description: str | None = Field(None, description="설명")
    entitled_days_per_year: int | None = Field(None, description="연간 부여 일수 (NULL이면 무제한)")
    is_paid: bool = Field(default=True, description="유급 여부 (true: 유급, false: 무급)")
    validity_years: int | None = Field(default=2, description="유효 기간 (연, 연차는 일반적으로 2년)")
    is_carryover_allowed: bool | None = Field(default=False, description="이월 가능 여부")
    carryover_max_days: int | None = Field(None, description="이월 최대 일수 (NULL이면 무제한)")
    is_compensation_required: bool | None = Field(default=True, description="미사용 보상금 필요 여부")
    compensation_rate: Decimal | None = Field(default=100, description="보상금 비율 (%)")
    is_active: bool | None = Field(default=True, description="활성 여부")
    is_deleted: bool = Field(default=False, description="논리 삭제 플래그")


class LeavePoliciesCreate(LeavePoliciesBase):
    """Schema for creating LeavePolicies"""

    # Exclude auto-generated fields
    pass


class LeavePoliciesUpdate(BaseModel):
    """Schema for updating LeavePolicies (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    leave_type: str | None = Field(None, max_length=20, description="휴가 유형 (ANNUAL: 연차, SICK: 병가, MATERNITY: 출산휴가, UNPAID: 무급)")
    leave_name: str | None = Field(None, max_length=100, description="휴가명")
    description: str | None = Field(None, description="설명")
    entitled_days_per_year: int | None = Field(None, description="연간 부여 일수 (NULL이면 무제한)")
    is_paid: bool | None = Field(default=True, description="유급 여부 (true: 유급, false: 무급)")
    validity_years: int | None = Field(default=2, description="유효 기간 (연, 연차는 일반적으로 2년)")
    is_carryover_allowed: bool | None = Field(default=False, description="이월 가능 여부")
    carryover_max_days: int | None = Field(None, description="이월 최대 일수 (NULL이면 무제한)")
    is_compensation_required: bool | None = Field(default=True, description="미사용 보상금 필요 여부")
    compensation_rate: Decimal | None = Field(default=100, description="보상금 비율 (%)")
    is_active: bool | None = Field(default=True, description="활성 여부")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class LeavePoliciesResponse(LeavePoliciesBase):
    """Schema for LeavePolicies response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class LeavePoliciesListResponse(BaseModel):
    """Schema for paginated LeavePolicies list response"""

    items: list[LeavePoliciesResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "LeavePoliciesBase",
    "LeavePoliciesCreate",
    "LeavePoliciesUpdate",
    "LeavePoliciesResponse",
    "LeavePoliciesListResponse",
]
