"""
회계 분개 전표 상세 라인 정보 관리 테이블 (차변/대변)

Pydantic schemas for JournalEntryLines model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class JournalEntryLinesBase(BaseModel):
    """Base schema for JournalEntryLines"""
    model_config = ConfigDict(from_attributes=True)

    je_id: UUID = Field(description="분개 전표 식별자")
    line_no: int = Field(description="라인 번호 (순서)")
    account_id: UUID = Field(description="계정과목 식별자")
    debit_amount: Decimal | None = Field(default=0, description="차변 금액")
    credit_amount: Decimal | None = Field(default=0, description="대변 금액")
    description: str | None = Field(None, description="적요 (라인별 설명)")
    cost_center: str | None = Field(None, max_length=50, description="원가센터 코드")
    cost_center_id: UUID | None = Field(None, description="원가센터 식별자")
    project_code: str | None = Field(None, max_length=50, description="프로젝트 코드")
    project_id: UUID | None = Field(None, description="프로젝트 식별자")
    department_id: UUID | None = Field(None, description="부서 식별자")
    partner_id: UUID | None = Field(None, description="거래처 식별자")
    partner_type: str | None = Field(None, max_length=20, description="거래처 유형 (CUSTOMER: 고객/VENDOR: 공급업체/EMPLOYEE: 임직원/OTHER: 기타)")
    tax_code: str | None = Field(None, max_length=20, description="세금 코드")
    tax_amount: Decimal | None = Field(default=0, description="세액")
    quantity: Decimal | None = Field(None, description="수량 (재고 관련)")
    unit_price: Decimal | None = Field(None, description="단가")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class JournalEntryLinesCreate(JournalEntryLinesBase):
    """Schema for creating JournalEntryLines"""

    # Exclude auto-generated fields
    pass


class JournalEntryLinesUpdate(BaseModel):
    """Schema for updating JournalEntryLines (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    je_id: UUID | None = Field(None, description="분개 전표 식별자")
    line_no: int | None = Field(None, description="라인 번호 (순서)")
    account_id: UUID | None = Field(None, description="계정과목 식별자")
    debit_amount: Decimal | None = Field(default=0, description="차변 금액")
    credit_amount: Decimal | None = Field(default=0, description="대변 금액")
    description: str | None = Field(None, description="적요 (라인별 설명)")
    cost_center: str | None = Field(None, max_length=50, description="원가센터 코드")
    cost_center_id: UUID | None = Field(None, description="원가센터 식별자")
    project_code: str | None = Field(None, max_length=50, description="프로젝트 코드")
    project_id: UUID | None = Field(None, description="프로젝트 식별자")
    department_id: UUID | None = Field(None, description="부서 식별자")
    partner_id: UUID | None = Field(None, description="거래처 식별자")
    partner_type: str | None = Field(None, max_length=20, description="거래처 유형 (CUSTOMER: 고객/VENDOR: 공급업체/EMPLOYEE: 임직원/OTHER: 기타)")
    tax_code: str | None = Field(None, max_length=20, description="세금 코드")
    tax_amount: Decimal | None = Field(default=0, description="세액")
    quantity: Decimal | None = Field(None, description="수량 (재고 관련)")
    unit_price: Decimal | None = Field(None, description="단가")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class JournalEntryLinesResponse(JournalEntryLinesBase):
    """Schema for JournalEntryLines response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class JournalEntryLinesListResponse(BaseModel):
    """Schema for paginated JournalEntryLines list response"""

    items: list[JournalEntryLinesResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "JournalEntryLinesBase",
    "JournalEntryLinesCreate",
    "JournalEntryLinesUpdate",
    "JournalEntryLinesResponse",
    "JournalEntryLinesListResponse",
]
