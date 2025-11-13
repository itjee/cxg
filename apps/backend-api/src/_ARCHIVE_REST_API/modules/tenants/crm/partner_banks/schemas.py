"""
거래처 계좌 정보 관리 테이블 - 입출금 계좌 정보

Pydantic schemas for PartnerBanks model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class PartnerBanksBase(BaseModel):
    """Base schema for PartnerBanks"""
    model_config = ConfigDict(from_attributes=True)

    partner_id: UUID = Field(description="거래처 식별자")
    account_type: str = Field(max_length=20, description="계좌 유형 (CHECKING: 당좌, SAVINGS: 보통, FOREIGN_CURRENCY: 외화, ESCROW: 에스크로, TRUST: 신탁, OTHER: 기타)")
    bank_code: str = Field(max_length=10, description="은행 코드")
    bank_name: str | None = Field(None, max_length=100, description="은행명")
    account_no: str = Field(max_length=50, description="계좌번호")
    account_holder: str = Field(max_length=100, description="예금주명")
    account_name: str | None = Field(None, max_length=100, description="계좌별칭")
    is_primary: bool = Field(default=False, description="주계좌 여부")
    is_receive: bool = Field(default=False, description="기본 입금계좌 여부")
    is_payment: bool = Field(default=False, description="기본 지급계좌 여부")
    swift_code: str | None = Field(None, max_length=20, description="SWIFT 코드 (해외송금용, 8자리 또는 11자리)")
    branch_code: str | None = Field(None, max_length=20, description="지점 코드")
    branch_name: str | None = Field(None, max_length=100, description="지점명")
    notes: str | None = Field(None, description="비고")
    status: str = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE: 활성, INACTIVE: 비활성, SUSPENDED: 정지, CLOSED: 폐쇄)")
    is_deleted: bool = Field(default=False, description="논리 삭제 플래그")


class PartnerBanksCreate(PartnerBanksBase):
    """Schema for creating PartnerBanks"""

    # Exclude auto-generated fields
    pass


class PartnerBanksUpdate(BaseModel):
    """Schema for updating PartnerBanks (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    partner_id: UUID | None = Field(None, description="거래처 식별자")
    account_type: str | None = Field(None, max_length=20, description="계좌 유형 (CHECKING: 당좌, SAVINGS: 보통, FOREIGN_CURRENCY: 외화, ESCROW: 에스크로, TRUST: 신탁, OTHER: 기타)")
    bank_code: str | None = Field(None, max_length=10, description="은행 코드")
    bank_name: str | None = Field(None, max_length=100, description="은행명")
    account_no: str | None = Field(None, max_length=50, description="계좌번호")
    account_holder: str | None = Field(None, max_length=100, description="예금주명")
    account_name: str | None = Field(None, max_length=100, description="계좌별칭")
    is_primary: bool | None = Field(default=False, description="주계좌 여부")
    is_receive: bool | None = Field(default=False, description="기본 입금계좌 여부")
    is_payment: bool | None = Field(default=False, description="기본 지급계좌 여부")
    swift_code: str | None = Field(None, max_length=20, description="SWIFT 코드 (해외송금용, 8자리 또는 11자리)")
    branch_code: str | None = Field(None, max_length=20, description="지점 코드")
    branch_name: str | None = Field(None, max_length=100, description="지점명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE: 활성, INACTIVE: 비활성, SUSPENDED: 정지, CLOSED: 폐쇄)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class PartnerBanksResponse(PartnerBanksBase):
    """Schema for PartnerBanks response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class PartnerBanksListResponse(BaseModel):
    """Schema for paginated PartnerBanks list response"""

    items: list[PartnerBanksResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "PartnerBanksBase",
    "PartnerBanksCreate",
    "PartnerBanksUpdate",
    "PartnerBanksResponse",
    "PartnerBanksListResponse",
]
