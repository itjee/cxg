"""
결근/휴가 관리 테이블 - 직원의 결근, 휴가, 병가, 휴직 등 관리

Pydantic schemas for Absences model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class AbsencesBase(BaseModel):
    """Base schema for Absences"""
    model_config = ConfigDict(from_attributes=True)

    employee_id: UUID = Field(description="직원 식별자")
    absence_type: str = Field(max_length=20, description="결근 유형 (ABSENCE: 결근, LATE: 지각, SICK: 병가, ANNUAL: 연차, UNPAID: 무급휴가, MATERNITY: 출산휴가, LEAVE: 휴직)")
    date_from: date = Field(description="시작일")
    date_to: date = Field(description="종료일")
    duration_hours: int | None = Field(None, description="소요 시간 (NULL이면 전일)")
    reason: str | None = Field(None, description="사유")
    attached_document_path: str | None = Field(None, max_length=500, description="첨부 문서 경로 (진단서 등)")
    approved_by: UUID | None = Field(None, description="승인자 UUID")
    approval_date: datetime | None = Field(None, description="승인 일시")
    rejection_reason: str | None = Field(None, description="거부 사유")
    status: str = Field(max_length=20, default='DRAFT', description="상태 (DRAFT: 임시저장, SUBMITTED: 제출, APPROVED: 승인, REJECTED: 거부, CANCELLED: 취소)")
    is_deleted: bool = Field(default=False, description="논리 삭제 플래그")


class AbsencesCreate(AbsencesBase):
    """Schema for creating Absences"""

    # Exclude auto-generated fields
    pass


class AbsencesUpdate(BaseModel):
    """Schema for updating Absences (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    employee_id: UUID | None = Field(None, description="직원 식별자")
    absence_type: str | None = Field(None, max_length=20, description="결근 유형 (ABSENCE: 결근, LATE: 지각, SICK: 병가, ANNUAL: 연차, UNPAID: 무급휴가, MATERNITY: 출산휴가, LEAVE: 휴직)")
    date_from: date | None = Field(None, description="시작일")
    date_to: date | None = Field(None, description="종료일")
    duration_hours: int | None = Field(None, description="소요 시간 (NULL이면 전일)")
    reason: str | None = Field(None, description="사유")
    attached_document_path: str | None = Field(None, max_length=500, description="첨부 문서 경로 (진단서 등)")
    approved_by: UUID | None = Field(None, description="승인자 UUID")
    approval_date: datetime | None = Field(None, description="승인 일시")
    rejection_reason: str | None = Field(None, description="거부 사유")
    status: str | None = Field(max_length=20, default='DRAFT', description="상태 (DRAFT: 임시저장, SUBMITTED: 제출, APPROVED: 승인, REJECTED: 거부, CANCELLED: 취소)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class AbsencesResponse(AbsencesBase):
    """Schema for Absences response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class AbsencesListResponse(BaseModel):
    """Schema for paginated Absences list response"""

    items: list[AbsencesResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "AbsencesBase",
    "AbsencesCreate",
    "AbsencesUpdate",
    "AbsencesResponse",
    "AbsencesListResponse",
]
