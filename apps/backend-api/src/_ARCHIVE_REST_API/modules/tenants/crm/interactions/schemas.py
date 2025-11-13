"""
고객 상호작용 이력 관리 테이블

Pydantic schemas for Interactions model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class InteractionsBase(BaseModel):
    """Base schema for Interactions"""
    model_config = ConfigDict(from_attributes=True)

    interaction_type: str = Field(max_length=20, description="상호작용 유형 (INQUIRY/COMPLAINT/FEEDBACK/SUPPORT/SALES/FOLLOW_UP/OTHER)")
    channel: str = Field(max_length=20, description="채널 (PHONE/EMAIL/CHAT/SNS/VISIT/WEB/MOBILE_APP/OTHER)")
    direction: str = Field(max_length=20, description="방향 (INBOUND: 고객→자사, OUTBOUND: 자사→고객)")
    partner_id: UUID | None = Field(None, description="거래처 ID")
    lead_id: UUID | None = Field(None, description="리드 ID")
    contact_id: UUID | None = Field(None, description="담당자 ID (partner_contacts)")
    opportunity_id: UUID | None = Field(None, description="영업 기회 ID")
    subject: str | None = Field(None, max_length=200, description="제목")
    content: str | None = Field(None, description="내용")
    summary: str | None = Field(None, description="요약")
    interaction_date: datetime = Field(description="상호작용 일시")
    duration_seconds: int | None = Field(None, description="소요 시간 (초)")
    handled_by: UUID | None = Field(None, description="처리자 UUID (자사 직원)")
    sentiment: str | None = Field(None, max_length=20, description="감정 분석 (POSITIVE/NEUTRAL/NEGATIVE)")
    satisfaction_score: int | None = Field(None, description="만족도 점수 (1-5점)")
    outcome: str | None = Field(None, max_length=50, description="결과 (RESOLVED/PENDING/ESCALATED/CLOSED 등)")
    is_follow_up_required: bool | None = Field(default=False, description="후속 조치 필요 여부")
    follow_up_notes: str | None = Field(None, description="후속 조치 메모")
    follow_up_date: date | None = Field(None, description="후속 조치 예정일")
    tags: str | None = Field(None, description="태그 배열")
    category: str | None = Field(None, max_length=50, description="카테고리")
    attachments: dict | None = Field(None, description="첨부파일 정보 (JSON)")
    reference_url: str | None = Field(None, max_length=500, description="참조 URL (이메일, 채팅 링크 등)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    notes: str | None = Field(None, description="비고")


class InteractionsCreate(InteractionsBase):
    """Schema for creating Interactions"""

    # Exclude auto-generated fields
    pass


class InteractionsUpdate(BaseModel):
    """Schema for updating Interactions (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    interaction_type: str | None = Field(None, max_length=20, description="상호작용 유형 (INQUIRY/COMPLAINT/FEEDBACK/SUPPORT/SALES/FOLLOW_UP/OTHER)")
    channel: str | None = Field(None, max_length=20, description="채널 (PHONE/EMAIL/CHAT/SNS/VISIT/WEB/MOBILE_APP/OTHER)")
    direction: str | None = Field(None, max_length=20, description="방향 (INBOUND: 고객→자사, OUTBOUND: 자사→고객)")
    partner_id: UUID | None = Field(None, description="거래처 ID")
    lead_id: UUID | None = Field(None, description="리드 ID")
    contact_id: UUID | None = Field(None, description="담당자 ID (partner_contacts)")
    opportunity_id: UUID | None = Field(None, description="영업 기회 ID")
    subject: str | None = Field(None, max_length=200, description="제목")
    content: str | None = Field(None, description="내용")
    summary: str | None = Field(None, description="요약")
    interaction_date: datetime | None = Field(None, description="상호작용 일시")
    duration_seconds: int | None = Field(None, description="소요 시간 (초)")
    handled_by: UUID | None = Field(None, description="처리자 UUID (자사 직원)")
    sentiment: str | None = Field(None, max_length=20, description="감정 분석 (POSITIVE/NEUTRAL/NEGATIVE)")
    satisfaction_score: int | None = Field(None, description="만족도 점수 (1-5점)")
    outcome: str | None = Field(None, max_length=50, description="결과 (RESOLVED/PENDING/ESCALATED/CLOSED 등)")
    is_follow_up_required: bool | None = Field(default=False, description="후속 조치 필요 여부")
    follow_up_notes: str | None = Field(None, description="후속 조치 메모")
    follow_up_date: date | None = Field(None, description="후속 조치 예정일")
    tags: str | None = Field(None, description="태그 배열")
    category: str | None = Field(None, max_length=50, description="카테고리")
    attachments: dict | None = Field(None, description="첨부파일 정보 (JSON)")
    reference_url: str | None = Field(None, max_length=500, description="참조 URL (이메일, 채팅 링크 등)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    notes: str | None = Field(None, description="비고")


class InteractionsResponse(InteractionsBase):
    """Schema for Interactions response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class InteractionsListResponse(BaseModel):
    """Schema for paginated Interactions list response"""

    items: list[InteractionsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "InteractionsBase",
    "InteractionsCreate",
    "InteractionsUpdate",
    "InteractionsResponse",
    "InteractionsListResponse",
]
