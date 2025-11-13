"""
카테고리 담당자 이력 관리 테이블

Pydantic schemas for CategoryManagers model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class CategoryManagersBase(BaseModel):
    """Base schema for CategoryManagers"""
    model_config = ConfigDict(from_attributes=True)

    category_id: UUID = Field(description="카테고리 식별자")
    employee_id: UUID = Field(description="담당자 식별자")
    start_date: date = Field(description="담당 시작일")
    end_date: date | None = Field(None, description="담당 종료일")
    manager_type: str | None = Field(max_length=20, default='PRIMARY', description="담당자 유형 (PRIMARY/SECONDARY/SALES/TECHNICAL/PURCHASE/MARKETING/ANALYST)")
    description: str | None = Field(None, description="담당 업무/역할")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/EXPIRED/TERMINATED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class CategoryManagersCreate(CategoryManagersBase):
    """Schema for creating CategoryManagers"""

    # Exclude auto-generated fields
    pass


class CategoryManagersUpdate(BaseModel):
    """Schema for updating CategoryManagers (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    category_id: UUID | None = Field(None, description="카테고리 식별자")
    employee_id: UUID | None = Field(None, description="담당자 식별자")
    start_date: date | None = Field(None, description="담당 시작일")
    end_date: date | None = Field(None, description="담당 종료일")
    manager_type: str | None = Field(max_length=20, default='PRIMARY', description="담당자 유형 (PRIMARY/SECONDARY/SALES/TECHNICAL/PURCHASE/MARKETING/ANALYST)")
    description: str | None = Field(None, description="담당 업무/역할")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/EXPIRED/TERMINATED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class CategoryManagersResponse(CategoryManagersBase):
    """Schema for CategoryManagers response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class CategoryManagersListResponse(BaseModel):
    """Schema for paginated CategoryManagers list response"""

    items: list[CategoryManagersResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "CategoryManagersBase",
    "CategoryManagersCreate",
    "CategoryManagersUpdate",
    "CategoryManagersResponse",
    "CategoryManagersListResponse",
]
