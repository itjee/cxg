"""
조직/부서 정보 관리 테이블 - 회사 조직도 및 부서 계층 구조 관리

Pydantic schemas for Departments model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class DepartmentsBase(BaseModel):
    """Base schema for Departments"""
    model_config = ConfigDict(from_attributes=True)

    code: str = Field(max_length=50, description="부서 코드 (영대문자, 숫자, 언더스코어 2-50자)")
    name: str = Field(max_length=100, description="부서명")
    name_en: str | None = Field(None, max_length=100, description="부서명 (영문, 다국어 지원)")
    description: str | None = Field(None, description="부서 설명")
    parent_id: UUID | None = Field(None, description="상위 부서 식별자 (계층구조)")
    level: int | None = Field(default=1, description="부서 레벨 (1: 회사, 2: 본부, 3: 부서, 4: 팀)")
    dept_type: str = Field(max_length=20, default='DEPARTMENT', description="부서 유형 (COMPANY: 회사, DIVISION: 본부, DEPARTMENT: 부서, TEAM: 팀)")
    manager_id: UUID | None = Field(None, description="부서장 식별자 (사원 참조)")
    cost_center_code: str | None = Field(None, max_length=50, description="원가센터 코드 (회계 연계용)")
    phone: str | None = Field(None, max_length=50, description="부서 전화번호")
    email: str | None = Field(None, max_length=255, description="부서 이메일")
    fax: str | None = Field(None, max_length=50, description="팩스번호")
    location: str | None = Field(None, max_length=200, description="근무지/사무실 위치")
    floor: str | None = Field(None, max_length=20, description="층 정보")
    sort_order: int | None = Field(default=0, description="정렬 순서")
    status: str = Field(max_length=20, default='ACTIVE', description="부서 상태 (ACTIVE: 활성, INACTIVE: 비활성, CLOSED: 폐쇄)")
    is_deleted: bool = Field(default=False, description="논리 삭제 플래그")


class DepartmentsCreate(DepartmentsBase):
    """Schema for creating Departments"""

    # Exclude auto-generated fields
    pass


class DepartmentsUpdate(BaseModel):
    """Schema for updating Departments (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    code: str | None = Field(None, max_length=50, description="부서 코드 (영대문자, 숫자, 언더스코어 2-50자)")
    name: str | None = Field(None, max_length=100, description="부서명")
    name_en: str | None = Field(None, max_length=100, description="부서명 (영문, 다국어 지원)")
    description: str | None = Field(None, description="부서 설명")
    parent_id: UUID | None = Field(None, description="상위 부서 식별자 (계층구조)")
    level: int | None = Field(default=1, description="부서 레벨 (1: 회사, 2: 본부, 3: 부서, 4: 팀)")
    dept_type: str | None = Field(max_length=20, default='DEPARTMENT', description="부서 유형 (COMPANY: 회사, DIVISION: 본부, DEPARTMENT: 부서, TEAM: 팀)")
    manager_id: UUID | None = Field(None, description="부서장 식별자 (사원 참조)")
    cost_center_code: str | None = Field(None, max_length=50, description="원가센터 코드 (회계 연계용)")
    phone: str | None = Field(None, max_length=50, description="부서 전화번호")
    email: str | None = Field(None, max_length=255, description="부서 이메일")
    fax: str | None = Field(None, max_length=50, description="팩스번호")
    location: str | None = Field(None, max_length=200, description="근무지/사무실 위치")
    floor: str | None = Field(None, max_length=20, description="층 정보")
    sort_order: int | None = Field(default=0, description="정렬 순서")
    status: str | None = Field(max_length=20, default='ACTIVE', description="부서 상태 (ACTIVE: 활성, INACTIVE: 비활성, CLOSED: 폐쇄)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class DepartmentsResponse(DepartmentsBase):
    """Schema for Departments response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class DepartmentsListResponse(BaseModel):
    """Schema for paginated Departments list response"""

    items: list[DepartmentsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "DepartmentsBase",
    "DepartmentsCreate",
    "DepartmentsUpdate",
    "DepartmentsResponse",
    "DepartmentsListResponse",
]
