"""
고객 문의 및 지원 티켓 관리 테이블 (기술지원/제품문의/불만사항)

Pydantic schemas for SupportTickets model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class SupportTicketsBase(BaseModel):
    """Base schema for SupportTickets"""
    model_config = ConfigDict(from_attributes=True)

    ticket_code: str = Field(max_length=50, description="티켓 코드")
    customer_id: UUID | None = Field(None, description="고객 식별자 (NULL: 비회원 문의)")
    contact_name: str | None = Field(None, max_length=100, description="문의자 이름")
    contact_email: str | None = Field(None, max_length=255, description="문의자 이메일")
    contact_phone: str | None = Field(None, max_length=50, description="문의자 연락처")
    subject: str = Field(max_length=255, description="문의 제목")
    description: str | None = Field(None, description="문의 상세 내용")
    category: str | None = Field(None, max_length=50, description="카테고리 (기술지원/제품문의/불만사항/제안 등)")
    sub_category: str | None = Field(None, max_length=50, description="하위 카테고리")
    priority: str | None = Field(max_length=20, default='MEDIUM', description="우선순위 (LOW: 낮음/MEDIUM: 보통/HIGH: 높음/URGENT: 긴급)")
    status: str | None = Field(max_length=20, default='OPEN', description="상태 (OPEN: 접수/IN_PROGRESS: 진행중/RESOLVED: 해결/CLOSED: 종료/CANCELLED: 취소)")
    assigned_to: UUID | None = Field(None, description="담당자 식별자")
    resolved_at: datetime | None = Field(None, description="해결 일시")
    closed_at: datetime | None = Field(None, description="종료 일시")
    resolution: str | None = Field(None, description="해결 내용")
    resolution_time_minutes: int | None = Field(None, description="해결 소요 시간 (분 단위)")
    satisfaction_rating: int | None = Field(None, description="만족도 평가 (1-5점)")
    satisfaction_comment: str | None = Field(None, description="만족도 평가 코멘트")
    linked_service_request_id: UUID | None = Field(None, description="연계된 A/S 요청 식별자 (티켓이 A/S로 전환된 경우)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class SupportTicketsCreate(SupportTicketsBase):
    """Schema for creating SupportTickets"""

    # Exclude auto-generated fields
    pass


class SupportTicketsUpdate(BaseModel):
    """Schema for updating SupportTickets (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    ticket_code: str | None = Field(None, max_length=50, description="티켓 코드")
    customer_id: UUID | None = Field(None, description="고객 식별자 (NULL: 비회원 문의)")
    contact_name: str | None = Field(None, max_length=100, description="문의자 이름")
    contact_email: str | None = Field(None, max_length=255, description="문의자 이메일")
    contact_phone: str | None = Field(None, max_length=50, description="문의자 연락처")
    subject: str | None = Field(None, max_length=255, description="문의 제목")
    description: str | None = Field(None, description="문의 상세 내용")
    category: str | None = Field(None, max_length=50, description="카테고리 (기술지원/제품문의/불만사항/제안 등)")
    sub_category: str | None = Field(None, max_length=50, description="하위 카테고리")
    priority: str | None = Field(max_length=20, default='MEDIUM', description="우선순위 (LOW: 낮음/MEDIUM: 보통/HIGH: 높음/URGENT: 긴급)")
    status: str | None = Field(max_length=20, default='OPEN', description="상태 (OPEN: 접수/IN_PROGRESS: 진행중/RESOLVED: 해결/CLOSED: 종료/CANCELLED: 취소)")
    assigned_to: UUID | None = Field(None, description="담당자 식별자")
    resolved_at: datetime | None = Field(None, description="해결 일시")
    closed_at: datetime | None = Field(None, description="종료 일시")
    resolution: str | None = Field(None, description="해결 내용")
    resolution_time_minutes: int | None = Field(None, description="해결 소요 시간 (분 단위)")
    satisfaction_rating: int | None = Field(None, description="만족도 평가 (1-5점)")
    satisfaction_comment: str | None = Field(None, description="만족도 평가 코멘트")
    linked_service_request_id: UUID | None = Field(None, description="연계된 A/S 요청 식별자 (티켓이 A/S로 전환된 경우)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class SupportTicketsResponse(SupportTicketsBase):
    """Schema for SupportTickets response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class SupportTicketsListResponse(BaseModel):
    """Schema for paginated SupportTickets list response"""

    items: list[SupportTicketsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "SupportTicketsBase",
    "SupportTicketsCreate",
    "SupportTicketsUpdate",
    "SupportTicketsResponse",
    "SupportTicketsListResponse",
]
