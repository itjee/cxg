"""
거래처 담당자 배정 관리 테이블 - 자사 영업/관리 담당자 매핑

Pydantic schemas for PartnerManagers model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class PartnerManagersBase(BaseModel):
    """Base schema for PartnerManagers"""
    model_config = ConfigDict(from_attributes=True)

    partner_id: UUID = Field(description="거래처 식별자")
    employee_id: UUID = Field(description="담당 사원 식별자")
    start_date: date = Field(description="담당 시작일")
    end_date: date | None = Field(None, description="담당 종료일 (NULL이면 현재 담당 중)")
    manager_type: str = Field(max_length=20, default='PRIMARY', description="담당자 유형 (PRIMARY: 주담당, SECONDARY: 부담당, BACKUP: 백업, TECHNICAL: 기술, SALES: 영업, SUPPORT: 지원)")
    description: str | None = Field(None, description="담당 업무/역할")
    notes: str | None = Field(None, description="비고/메모")
    status: str = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE: 활성, INACTIVE: 비활성, EXPIRED: 만료, TERMINATED: 종료)")
    is_deleted: bool = Field(default=False, description="논리 삭제 플래그")


class PartnerManagersCreate(PartnerManagersBase):
    """Schema for creating PartnerManagers"""

    # Exclude auto-generated fields
    pass


class PartnerManagersUpdate(BaseModel):
    """Schema for updating PartnerManagers (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    partner_id: UUID | None = Field(None, description="거래처 식별자")
    employee_id: UUID | None = Field(None, description="담당 사원 식별자")
    start_date: date | None = Field(None, description="담당 시작일")
    end_date: date | None = Field(None, description="담당 종료일 (NULL이면 현재 담당 중)")
    manager_type: str | None = Field(max_length=20, default='PRIMARY', description="담당자 유형 (PRIMARY: 주담당, SECONDARY: 부담당, BACKUP: 백업, TECHNICAL: 기술, SALES: 영업, SUPPORT: 지원)")
    description: str | None = Field(None, description="담당 업무/역할")
    notes: str | None = Field(None, description="비고/메모")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE: 활성, INACTIVE: 비활성, EXPIRED: 만료, TERMINATED: 종료)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class PartnerManagersResponse(PartnerManagersBase):
    """Schema for PartnerManagers response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class PartnerManagersListResponse(BaseModel):
    """Schema for paginated PartnerManagers list response"""

    items: list[PartnerManagersResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "PartnerManagersBase",
    "PartnerManagersCreate",
    "PartnerManagersUpdate",
    "PartnerManagersResponse",
    "PartnerManagersListResponse",
]
