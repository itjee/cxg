"""
고객 피드백/평가 관리 테이블 - 고객 만족도, 피드백 의견 관리

Pydantic schemas for CustomerFeedback model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class CustomerFeedbackBase(BaseModel):
    """Base schema for CustomerFeedback"""
    model_config = ConfigDict(from_attributes=True)

    partner_id: UUID = Field(description="거래처 식별자")
    transaction_type: str = Field(max_length=20, description="거래 유형 (SALE: 판매, SERVICE: 서비스, SUPPORT: 지원)")
    transaction_id: UUID | None = Field(None, description="거래 식별자 (판매주문, 서비스, 티켓 등)")
    rating: int = Field(description="별점 (1-5, 1: 매우 불만족, 5: 매우 만족)")
    comment: str | None = Field(None, description="피드백 의견")
    feedback_categories: str | None = Field(None, max_length=100, description="피드백 카테고리 배열 (예: {품질, 배송})")
    response_text: str | None = Field(None, description="회신 내용")
    response_by: UUID | None = Field(None, description="회신자 직원 UUID")
    response_date: datetime | None = Field(None, description="회신 일시")
    status: str = Field(max_length=20, default='NEW', description="상태 (NEW: 신규, REVIEWED: 검토, RESPONDED: 회신, CLOSED: 종결)")
    is_deleted: bool = Field(default=False, description="논리 삭제 플래그")


class CustomerFeedbackCreate(CustomerFeedbackBase):
    """Schema for creating CustomerFeedback"""

    # Exclude auto-generated fields
    pass


class CustomerFeedbackUpdate(BaseModel):
    """Schema for updating CustomerFeedback (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    partner_id: UUID | None = Field(None, description="거래처 식별자")
    transaction_type: str | None = Field(None, max_length=20, description="거래 유형 (SALE: 판매, SERVICE: 서비스, SUPPORT: 지원)")
    transaction_id: UUID | None = Field(None, description="거래 식별자 (판매주문, 서비스, 티켓 등)")
    rating: int | None = Field(None, description="별점 (1-5, 1: 매우 불만족, 5: 매우 만족)")
    comment: str | None = Field(None, description="피드백 의견")
    feedback_categories: str | None = Field(None, max_length=100, description="피드백 카테고리 배열 (예: {품질, 배송})")
    response_text: str | None = Field(None, description="회신 내용")
    response_by: UUID | None = Field(None, description="회신자 직원 UUID")
    response_date: datetime | None = Field(None, description="회신 일시")
    status: str | None = Field(max_length=20, default='NEW', description="상태 (NEW: 신규, REVIEWED: 검토, RESPONDED: 회신, CLOSED: 종결)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class CustomerFeedbackResponse(CustomerFeedbackBase):
    """Schema for CustomerFeedback response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class CustomerFeedbackListResponse(BaseModel):
    """Schema for paginated CustomerFeedback list response"""

    items: list[CustomerFeedbackResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "CustomerFeedbackBase",
    "CustomerFeedbackCreate",
    "CustomerFeedbackUpdate",
    "CustomerFeedbackResponse",
    "CustomerFeedbackListResponse",
]
