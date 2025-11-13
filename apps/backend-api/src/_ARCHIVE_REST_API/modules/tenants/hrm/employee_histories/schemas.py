"""
인사 발령 이력 테이블 - 사원 인사 변경 이력 관리 (부서이동, 직급변경, 직책변경 등)

Pydantic schemas for EmployeeHistories model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class EmployeeHistoriesBase(BaseModel):
    """Base schema for EmployeeHistories"""
    model_config = ConfigDict(from_attributes=True)

    employee_id: UUID = Field(description="사원 식별자")
    order_type: str = Field(max_length=20, description="발령 유형 (HIRE: 입사, TRANSFER: 전보, PROMOTION: 승진, DEMOTION: 강등, POSITION_CHANGE: 직책변경, LOCATION_CHANGE: 근무지변경, WORK_TYPE_CHANGE: 근무형태변경, EMPLOYMENT_TYPE_CHANGE: 고용형태변경, SALARY_CHANGE: 급여변경, LEAVE: 휴직, RETURN: 복직, TERMINATE: 해고, RETIRE: 퇴직)")
    order_date: date = Field(description="발령일")
    effective_date: date = Field(description="시행일 (실제 적용일)")
    order_reason: str | None = Field(None, description="발령 사유")
    old_department_id: UUID | None = Field(None, description="변경 전 부서 식별자")
    new_department_id: UUID | None = Field(None, description="변경 후 부서 식별자")
    old_job_level: str | None = Field(None, max_length=20, description="변경 전 직급")
    new_job_level: str | None = Field(None, max_length=20, description="변경 후 직급")
    old_job_title: str | None = Field(None, max_length=100, description="변경 전 직책")
    new_job_title: str | None = Field(None, max_length=100, description="변경 후 직책")
    old_work_location: str | None = Field(None, max_length=100, description="변경 전 근무지")
    new_work_location: str | None = Field(None, max_length=100, description="변경 후 근무지")
    old_work_type: str | None = Field(None, max_length=20, description="변경 전 근무 형태")
    new_work_type: str | None = Field(None, max_length=20, description="변경 후 근무 형태")
    old_employment_type: str | None = Field(None, max_length=20, description="변경 전 고용 형태")
    new_employment_type: str | None = Field(None, max_length=20, description="변경 후 고용 형태")
    old_salary_type: str | None = Field(None, max_length=20, description="변경 전 급여 유형")
    new_salary_type: str | None = Field(None, max_length=20, description="변경 후 급여 유형")
    old_base_salary: Decimal | None = Field(None, description="변경 전 기본급")
    new_base_salary: Decimal | None = Field(None, description="변경 후 기본급")
    old_status: str | None = Field(None, max_length=20, description="변경 전 재직 상태")
    new_status: str | None = Field(None, max_length=20, description="변경 후 재직 상태")
    order_number: str | None = Field(None, max_length=50, description="발령 번호")
    order_document: str | None = Field(None, description="발령 문서 내용")
    attachment_url: str | None = Field(None, max_length=500, description="첨부 문서 URL")
    approved_by: UUID | None = Field(None, description="승인자 UUID")
    approved_at: datetime | None = Field(None, description="승인 일시")
    status: str = Field(max_length=20, default='PENDING', description="발령 상태 (PENDING: 대기, APPROVED: 승인, REJECTED: 반려, CANCELLED: 취소)")
    is_deleted: bool = Field(default=False, description="논리 삭제 플래그")


class EmployeeHistoriesCreate(EmployeeHistoriesBase):
    """Schema for creating EmployeeHistories"""

    # Exclude auto-generated fields
    pass


class EmployeeHistoriesUpdate(BaseModel):
    """Schema for updating EmployeeHistories (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    employee_id: UUID | None = Field(None, description="사원 식별자")
    order_type: str | None = Field(None, max_length=20, description="발령 유형 (HIRE: 입사, TRANSFER: 전보, PROMOTION: 승진, DEMOTION: 강등, POSITION_CHANGE: 직책변경, LOCATION_CHANGE: 근무지변경, WORK_TYPE_CHANGE: 근무형태변경, EMPLOYMENT_TYPE_CHANGE: 고용형태변경, SALARY_CHANGE: 급여변경, LEAVE: 휴직, RETURN: 복직, TERMINATE: 해고, RETIRE: 퇴직)")
    order_date: date | None = Field(None, description="발령일")
    effective_date: date | None = Field(None, description="시행일 (실제 적용일)")
    order_reason: str | None = Field(None, description="발령 사유")
    old_department_id: UUID | None = Field(None, description="변경 전 부서 식별자")
    new_department_id: UUID | None = Field(None, description="변경 후 부서 식별자")
    old_job_level: str | None = Field(None, max_length=20, description="변경 전 직급")
    new_job_level: str | None = Field(None, max_length=20, description="변경 후 직급")
    old_job_title: str | None = Field(None, max_length=100, description="변경 전 직책")
    new_job_title: str | None = Field(None, max_length=100, description="변경 후 직책")
    old_work_location: str | None = Field(None, max_length=100, description="변경 전 근무지")
    new_work_location: str | None = Field(None, max_length=100, description="변경 후 근무지")
    old_work_type: str | None = Field(None, max_length=20, description="변경 전 근무 형태")
    new_work_type: str | None = Field(None, max_length=20, description="변경 후 근무 형태")
    old_employment_type: str | None = Field(None, max_length=20, description="변경 전 고용 형태")
    new_employment_type: str | None = Field(None, max_length=20, description="변경 후 고용 형태")
    old_salary_type: str | None = Field(None, max_length=20, description="변경 전 급여 유형")
    new_salary_type: str | None = Field(None, max_length=20, description="변경 후 급여 유형")
    old_base_salary: Decimal | None = Field(None, description="변경 전 기본급")
    new_base_salary: Decimal | None = Field(None, description="변경 후 기본급")
    old_status: str | None = Field(None, max_length=20, description="변경 전 재직 상태")
    new_status: str | None = Field(None, max_length=20, description="변경 후 재직 상태")
    order_number: str | None = Field(None, max_length=50, description="발령 번호")
    order_document: str | None = Field(None, description="발령 문서 내용")
    attachment_url: str | None = Field(None, max_length=500, description="첨부 문서 URL")
    approved_by: UUID | None = Field(None, description="승인자 UUID")
    approved_at: datetime | None = Field(None, description="승인 일시")
    status: str | None = Field(max_length=20, default='PENDING', description="발령 상태 (PENDING: 대기, APPROVED: 승인, REJECTED: 반려, CANCELLED: 취소)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class EmployeeHistoriesResponse(EmployeeHistoriesBase):
    """Schema for EmployeeHistories response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class EmployeeHistoriesListResponse(BaseModel):
    """Schema for paginated EmployeeHistories list response"""

    items: list[EmployeeHistoriesResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "EmployeeHistoriesBase",
    "EmployeeHistoriesCreate",
    "EmployeeHistoriesUpdate",
    "EmployeeHistoriesResponse",
    "EmployeeHistoriesListResponse",
]
