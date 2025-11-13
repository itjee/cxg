"""
자산 처분: 고정자산 매각/폐기 이력

Pydantic schemas for AssetDisposals model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class AssetDisposalsBase(BaseModel):
    """Base schema for AssetDisposals"""
    model_config = ConfigDict(from_attributes=True)

    asset_id: UUID = Field(description="고정자산 ID")
    asset_code: str | None = Field(None, max_length=50, description="자산 코드 (스냅샷)")
    asset_name: str | None = Field(None, max_length=200, description="자산명 (스냅샷)")
    disposal_no: str = Field(max_length=50, description="처분 번호")
    disposal_date: date = Field(description="처분일")
    disposal_method: str = Field(max_length=20, description="처분 방법 (SALE/DISCARD/DONATION/EXCHANGE/LOSS)")
    disposal_reason: str | None = Field(None, description="처분 사유")
    acquisition_cost: Decimal = Field(default=0, description="취득가액 (스냅샷)")
    accumulated_depreciation: Decimal = Field(default=0, description="감가상각누계액 (스냅샷)")
    book_value: Decimal = Field(default=0, description="장부가액 (스냅샷)")
    disposal_amount: Decimal = Field(default=0, description="처분가액")
    disposal_gain_loss: Decimal = Field(default=0, description="처분손익 (처분가액 - 장부가액)")
    buyer_partner_id: UUID | None = Field(None, description="매입자 ID (거래처)")
    buyer_name: str | None = Field(None, max_length=200, description="매입자명")
    buyer_contact: str | None = Field(None, max_length=100, description="매입자 연락처")
    journal_entry_id: UUID | None = Field(None, description="분개 ID")
    business_document_id: UUID | None = Field(None, description="업무전표 ID")
    approval_status: str | None = Field(None, max_length=20, description="승인 상태 (PENDING/APPROVED/REJECTED)")
    approved_by: UUID | None = Field(None, description="승인자 UUID")
    approved_at: datetime | None = Field(None, description="승인 일시")
    notes: str | None = Field(None, description="비고")
    is_deleted: bool = Field(default=False, description="삭제 여부")


class AssetDisposalsCreate(AssetDisposalsBase):
    """Schema for creating AssetDisposals"""

    # Exclude auto-generated fields
    pass


class AssetDisposalsUpdate(BaseModel):
    """Schema for updating AssetDisposals (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    asset_id: UUID | None = Field(None, description="고정자산 ID")
    asset_code: str | None = Field(None, max_length=50, description="자산 코드 (스냅샷)")
    asset_name: str | None = Field(None, max_length=200, description="자산명 (스냅샷)")
    disposal_no: str | None = Field(None, max_length=50, description="처분 번호")
    disposal_date: date | None = Field(None, description="처분일")
    disposal_method: str | None = Field(None, max_length=20, description="처분 방법 (SALE/DISCARD/DONATION/EXCHANGE/LOSS)")
    disposal_reason: str | None = Field(None, description="처분 사유")
    acquisition_cost: Decimal | None = Field(default=0, description="취득가액 (스냅샷)")
    accumulated_depreciation: Decimal | None = Field(default=0, description="감가상각누계액 (스냅샷)")
    book_value: Decimal | None = Field(default=0, description="장부가액 (스냅샷)")
    disposal_amount: Decimal | None = Field(default=0, description="처분가액")
    disposal_gain_loss: Decimal | None = Field(default=0, description="처분손익 (처분가액 - 장부가액)")
    buyer_partner_id: UUID | None = Field(None, description="매입자 ID (거래처)")
    buyer_name: str | None = Field(None, max_length=200, description="매입자명")
    buyer_contact: str | None = Field(None, max_length=100, description="매입자 연락처")
    journal_entry_id: UUID | None = Field(None, description="분개 ID")
    business_document_id: UUID | None = Field(None, description="업무전표 ID")
    approval_status: str | None = Field(None, max_length=20, description="승인 상태 (PENDING/APPROVED/REJECTED)")
    approved_by: UUID | None = Field(None, description="승인자 UUID")
    approved_at: datetime | None = Field(None, description="승인 일시")
    notes: str | None = Field(None, description="비고")
    is_deleted: bool | None = Field(default=False, description="삭제 여부")


class AssetDisposalsResponse(AssetDisposalsBase):
    """Schema for AssetDisposals response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class AssetDisposalsListResponse(BaseModel):
    """Schema for paginated AssetDisposals list response"""

    items: list[AssetDisposalsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "AssetDisposalsBase",
    "AssetDisposalsCreate",
    "AssetDisposalsUpdate",
    "AssetDisposalsResponse",
    "AssetDisposalsListResponse",
]
