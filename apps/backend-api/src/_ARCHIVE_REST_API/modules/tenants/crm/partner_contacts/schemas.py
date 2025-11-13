"""
거래처 담당자 정보 관리 테이블

Pydantic schemas for PartnerContacts model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class PartnerContactsBase(BaseModel):
    """Base schema for PartnerContacts"""
    model_config = ConfigDict(from_attributes=True)

    partner_id: UUID = Field(description="거래처 식별자")
    name: str = Field(max_length=100, description="담당자명")
    position: str | None = Field(None, max_length=100, description="직책/직위")
    department: str | None = Field(None, max_length=100, description="소속 부서")
    phone: str | None = Field(None, max_length=50, description="직장 전화번호")
    mobile: str | None = Field(None, max_length=50, description="휴대폰 번호")
    email: str | None = Field(None, max_length=255, description="이메일 주소")
    contact_type: str | None = Field(None, max_length=20, description="업무 유형 (SALES: 영업, PURCHASING: 구매, ACCOUNTING: 회계, TECHNICAL: 기술, MANAGEMENT: 경영진, OTHER: 기타)")
    is_primary: bool = Field(default=False, description="주담당자 여부")
    notes: str | None = Field(None, description="비고")
    status: str = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE)")
    is_deleted: bool = Field(default=False, description="논리 삭제 플래그")


class PartnerContactsCreate(PartnerContactsBase):
    """Schema for creating PartnerContacts"""

    # Exclude auto-generated fields
    pass


class PartnerContactsUpdate(BaseModel):
    """Schema for updating PartnerContacts (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    partner_id: UUID | None = Field(None, description="거래처 식별자")
    name: str | None = Field(None, max_length=100, description="담당자명")
    position: str | None = Field(None, max_length=100, description="직책/직위")
    department: str | None = Field(None, max_length=100, description="소속 부서")
    phone: str | None = Field(None, max_length=50, description="직장 전화번호")
    mobile: str | None = Field(None, max_length=50, description="휴대폰 번호")
    email: str | None = Field(None, max_length=255, description="이메일 주소")
    contact_type: str | None = Field(None, max_length=20, description="업무 유형 (SALES: 영업, PURCHASING: 구매, ACCOUNTING: 회계, TECHNICAL: 기술, MANAGEMENT: 경영진, OTHER: 기타)")
    is_primary: bool | None = Field(default=False, description="주담당자 여부")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class PartnerContactsResponse(PartnerContactsBase):
    """Schema for PartnerContacts response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class PartnerContactsListResponse(BaseModel):
    """Schema for paginated PartnerContacts list response"""

    items: list[PartnerContactsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "PartnerContactsBase",
    "PartnerContactsCreate",
    "PartnerContactsUpdate",
    "PartnerContactsResponse",
    "PartnerContactsListResponse",
]
