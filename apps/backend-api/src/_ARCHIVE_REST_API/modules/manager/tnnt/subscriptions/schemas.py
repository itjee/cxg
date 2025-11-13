"""Schemas for Subscription module."""

from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, Field


class SubscriptionBase(BaseModel):
    """Base schema for Subscription."""

    tenant_id: UUID = Field(..., description="테넌트 ID")
    plan_id: UUID = Field(..., description="플랜 ID")
    start_date: date = Field(..., description="시작일")
    close_date: date | None = Field(None, description="종료일")
    billing_cycle: str = Field(default="MONTHLY", description="청구 주기")
    max_users: int | None = Field(None, description="최대 사용자 수")
    max_storage: int | None = Field(None, description="최대 스토리지")
    max_api_calls: int | None = Field(None, description="최대 API 호출 수")
    base_amount: float = Field(..., description="기본 요금")
    user_amount: float = Field(default=0, description="사용자당 추가 요금")
    currency: str = Field(default="KRW", max_length=3, description="통화")
    auto_renewal: bool = Field(default=True, description="자동 갱신 여부")
    noti_renewal: bool = Field(default=False, description="갱신 알림 여부")
    status: str = Field(default="ACTIVE", description="상태")


class SubscriptionCreate(SubscriptionBase):
    """Schema for creating Subscription."""

    pass


class SubscriptionUpdate(BaseModel):
    """Schema for updating Subscription."""

    tenant_id: UUID | None = Field(None, description="테넌트 ID")
    plan_id: UUID | None = Field(None, description="플랜 ID")
    start_date: date | None = Field(None, description="시작일")
    close_date: date | None = Field(None, description="종료일")
    billing_cycle: str | None = Field(None, description="청구 주기")
    max_users: int | None = Field(None, description="최대 사용자 수")
    max_storage: int | None = Field(None, description="최대 스토리지")
    max_api_calls: int | None = Field(None, description="최대 API 호출 수")
    base_amount: float | None = Field(None, description="기본 요금")
    user_amount: float | None = Field(None, description="사용자당 추가 요금")
    currency: str | None = Field(None, max_length=3, description="통화")
    auto_renewal: bool | None = Field(None, description="자동 갱신 여부")
    noti_renewal: bool | None = Field(None, description="갱신 알림 여부")
    status: str | None = Field(None, description="상태")


class SubscriptionResponse(SubscriptionBase):
    """Response schema for Subscription."""

    id: UUID
    deleted: bool = Field(default=False, description="삭제 여부")
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None = None
    updated_by: UUID | None = None

    class Config:
        """Pydantic config."""

        from_attributes = True


class SubscriptionListResponse(BaseModel):
    """List response schema for Subscription."""

    items: list[SubscriptionResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
