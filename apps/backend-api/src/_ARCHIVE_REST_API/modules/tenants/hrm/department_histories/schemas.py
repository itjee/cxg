"""
조직 개편 이력 테이블 - 부서 변경 이력 관리 (부서명, 부서장, 조직개편 등)

Pydantic schemas for DepartmentHistories model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class DepartmentHistoriesBase(BaseModel):
    """Base schema for DepartmentHistories"""
    model_config = ConfigDict(from_attributes=True)

    department_id: UUID = Field(description="부서 식별자")
    change_type: str = Field(max_length=20, description="변경 유형 (RENAME: 명칭변경, REORGANIZE: 조직개편, MANAGER_CHANGE: 부서장변경, TYPE_CHANGE: 유형변경, PARENT_CHANGE: 상위부서변경, MERGE: 통합, SPLIT: 분할, CLOSE: 폐쇄, REOPEN: 재개)")
    change_date: date = Field(description="변경 발령일")
    effective_date: date = Field(description="변경 시행일 (실제 적용일)")
    change_reason: str | None = Field(None, description="변경 사유")
    old_code: str | None = Field(None, max_length=50, description="변경 전 부서 코드")
    new_code: str | None = Field(None, max_length=50, description="변경 후 부서 코드")
    old_name: str | None = Field(None, max_length=100, description="변경 전 부서명")
    new_name: str | None = Field(None, max_length=100, description="변경 후 부서명")
    old_dept_type: str | None = Field(None, max_length=20, description="변경 전 부서 유형")
    new_dept_type: str | None = Field(None, max_length=20, description="변경 후 부서 유형")
    old_parent_id: UUID | None = Field(None, description="변경 전 상위 부서 식별자")
    new_parent_id: UUID | None = Field(None, description="변경 후 상위 부서 식별자")
    old_manager_id: UUID | None = Field(None, description="변경 전 부서장 식별자")
    new_manager_id: UUID | None = Field(None, description="변경 후 부서장 식별자")
    order_number: str | None = Field(None, max_length=50, description="발령 번호")
    order_document: str | None = Field(None, description="발령 문서 내용")
    attachment_url: str | None = Field(None, max_length=500, description="첨부 문서 URL")
    approved_by: UUID | None = Field(None, description="승인자 UUID")
    approved_at: datetime | None = Field(None, description="승인 일시")
    status: str = Field(max_length=20, default='PENDING', description="상태 (PENDING: 대기, APPROVED: 승인, REJECTED: 반려, CANCELLED: 취소)")
    is_deleted: bool = Field(default=False, description="논리 삭제 플래그")


class DepartmentHistoriesCreate(DepartmentHistoriesBase):
    """Schema for creating DepartmentHistories"""

    # Exclude auto-generated fields
    pass


class DepartmentHistoriesUpdate(BaseModel):
    """Schema for updating DepartmentHistories (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    department_id: UUID | None = Field(None, description="부서 식별자")
    change_type: str | None = Field(None, max_length=20, description="변경 유형 (RENAME: 명칭변경, REORGANIZE: 조직개편, MANAGER_CHANGE: 부서장변경, TYPE_CHANGE: 유형변경, PARENT_CHANGE: 상위부서변경, MERGE: 통합, SPLIT: 분할, CLOSE: 폐쇄, REOPEN: 재개)")
    change_date: date | None = Field(None, description="변경 발령일")
    effective_date: date | None = Field(None, description="변경 시행일 (실제 적용일)")
    change_reason: str | None = Field(None, description="변경 사유")
    old_code: str | None = Field(None, max_length=50, description="변경 전 부서 코드")
    new_code: str | None = Field(None, max_length=50, description="변경 후 부서 코드")
    old_name: str | None = Field(None, max_length=100, description="변경 전 부서명")
    new_name: str | None = Field(None, max_length=100, description="변경 후 부서명")
    old_dept_type: str | None = Field(None, max_length=20, description="변경 전 부서 유형")
    new_dept_type: str | None = Field(None, max_length=20, description="변경 후 부서 유형")
    old_parent_id: UUID | None = Field(None, description="변경 전 상위 부서 식별자")
    new_parent_id: UUID | None = Field(None, description="변경 후 상위 부서 식별자")
    old_manager_id: UUID | None = Field(None, description="변경 전 부서장 식별자")
    new_manager_id: UUID | None = Field(None, description="변경 후 부서장 식별자")
    order_number: str | None = Field(None, max_length=50, description="발령 번호")
    order_document: str | None = Field(None, description="발령 문서 내용")
    attachment_url: str | None = Field(None, max_length=500, description="첨부 문서 URL")
    approved_by: UUID | None = Field(None, description="승인자 UUID")
    approved_at: datetime | None = Field(None, description="승인 일시")
    status: str | None = Field(max_length=20, default='PENDING', description="상태 (PENDING: 대기, APPROVED: 승인, REJECTED: 반려, CANCELLED: 취소)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class DepartmentHistoriesResponse(DepartmentHistoriesBase):
    """Schema for DepartmentHistories response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class DepartmentHistoriesListResponse(BaseModel):
    """Schema for paginated DepartmentHistories list response"""

    items: list[DepartmentHistoriesResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "DepartmentHistoriesBase",
    "DepartmentHistoriesCreate",
    "DepartmentHistoriesUpdate",
    "DepartmentHistoriesResponse",
    "DepartmentHistoriesListResponse",
]
