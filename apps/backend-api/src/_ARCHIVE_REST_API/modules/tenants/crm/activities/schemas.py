"""
영업 활동 관리 테이블 (고객 접촉 이력)

Pydantic schemas for Activities model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class ActivitiesBase(BaseModel):
    """Base schema for Activities"""
    model_config = ConfigDict(from_attributes=True)

    activity_type: str = Field(max_length=20, description="활동 유형 (CALL/EMAIL/MEETING/DEMO/VISIT/TASK/FOLLOW_UP/OTHER)")
    subject: str = Field(max_length=200, description="제목")
    description: str | None = Field(None, description="내용")
    related_to_type: str | None = Field(None, max_length=20, description="관련 대상 타입 (PARTNER/LEAD/OPPORTUNITY/CONTACT)")
    partner_id: UUID | None = Field(None, description="거래처 ID")
    lead_id: UUID | None = Field(None, description="리드 ID")
    opportunity_id: UUID | None = Field(None, description="영업 기회 ID")
    contact_id: UUID | None = Field(None, description="담당자 ID (partner_contacts)")
    activity_date: date = Field(description="활동 일자")
    start_time: time | None = Field(None, description="시작 시간")
    end_time: time | None = Field(None, description="종료 시간")
    duration_minutes: int | None = Field(None, description="소요 시간 (분)")
    location: str | None = Field(None, max_length=200, description="장소")
    is_online: bool | None = Field(default=False, description="온라인 여부 (화상회의 등)")
    meeting_url: str | None = Field(None, max_length=500, description="회의 URL (Zoom, Teams 등)")
    owner_id: UUID = Field(description="담당자 UUID (활동 수행자)")
    participants: str | None = Field(None, description="참석자 목록 (JSON 배열)")
    status: str | None = Field(max_length=20, default='PLANNED', description="상태 (PLANNED/IN_PROGRESS/COMPLETED/CANCELLED)")
    priority: str | None = Field(max_length=20, default='NORMAL', description="우선순위 (URGENT/HIGH/NORMAL/LOW)")
    is_completed: bool | None = Field(default=False, description="완료 여부")
    completed_at: datetime | None = Field(None, description="완료 일시")
    completed_by: UUID | None = Field(None, description="완료 처리자 UUID")
    outcome: str | None = Field(None, max_length=50, description="결과 (SUCCESSFUL/UNSUCCESSFUL/NO_ANSWER/RESCHEDULED 등)")
    outcome_notes: str | None = Field(None, description="결과 메모")
    is_follow_up_required: bool | None = Field(default=False, description="후속 활동 필요 여부")
    follow_up_date: date | None = Field(None, description="후속 활동 예정일")
    follow_up_activity_id: UUID | None = Field(None, description="생성된 후속 활동 ID")
    is_reminder_enabled: bool | None = Field(default=False, description="알림 사용 여부")
    reminder_minutes: int | None = Field(None, description="알림 시간 (활동 시작 n분 전)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    notes: str | None = Field(None, description="비고")


class ActivitiesCreate(ActivitiesBase):
    """Schema for creating Activities"""

    # Exclude auto-generated fields
    pass


class ActivitiesUpdate(BaseModel):
    """Schema for updating Activities (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    activity_type: str | None = Field(None, max_length=20, description="활동 유형 (CALL/EMAIL/MEETING/DEMO/VISIT/TASK/FOLLOW_UP/OTHER)")
    subject: str | None = Field(None, max_length=200, description="제목")
    description: str | None = Field(None, description="내용")
    related_to_type: str | None = Field(None, max_length=20, description="관련 대상 타입 (PARTNER/LEAD/OPPORTUNITY/CONTACT)")
    partner_id: UUID | None = Field(None, description="거래처 ID")
    lead_id: UUID | None = Field(None, description="리드 ID")
    opportunity_id: UUID | None = Field(None, description="영업 기회 ID")
    contact_id: UUID | None = Field(None, description="담당자 ID (partner_contacts)")
    activity_date: date | None = Field(None, description="활동 일자")
    start_time: time | None = Field(None, description="시작 시간")
    end_time: time | None = Field(None, description="종료 시간")
    duration_minutes: int | None = Field(None, description="소요 시간 (분)")
    location: str | None = Field(None, max_length=200, description="장소")
    is_online: bool | None = Field(default=False, description="온라인 여부 (화상회의 등)")
    meeting_url: str | None = Field(None, max_length=500, description="회의 URL (Zoom, Teams 등)")
    owner_id: UUID | None = Field(None, description="담당자 UUID (활동 수행자)")
    participants: str | None = Field(None, description="참석자 목록 (JSON 배열)")
    status: str | None = Field(max_length=20, default='PLANNED', description="상태 (PLANNED/IN_PROGRESS/COMPLETED/CANCELLED)")
    priority: str | None = Field(max_length=20, default='NORMAL', description="우선순위 (URGENT/HIGH/NORMAL/LOW)")
    is_completed: bool | None = Field(default=False, description="완료 여부")
    completed_at: datetime | None = Field(None, description="완료 일시")
    completed_by: UUID | None = Field(None, description="완료 처리자 UUID")
    outcome: str | None = Field(None, max_length=50, description="결과 (SUCCESSFUL/UNSUCCESSFUL/NO_ANSWER/RESCHEDULED 등)")
    outcome_notes: str | None = Field(None, description="결과 메모")
    is_follow_up_required: bool | None = Field(default=False, description="후속 활동 필요 여부")
    follow_up_date: date | None = Field(None, description="후속 활동 예정일")
    follow_up_activity_id: UUID | None = Field(None, description="생성된 후속 활동 ID")
    is_reminder_enabled: bool | None = Field(default=False, description="알림 사용 여부")
    reminder_minutes: int | None = Field(None, description="알림 시간 (활동 시작 n분 전)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    notes: str | None = Field(None, description="비고")


class ActivitiesResponse(ActivitiesBase):
    """Schema for Activities response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class ActivitiesListResponse(BaseModel):
    """Schema for paginated Activities list response"""

    items: list[ActivitiesResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "ActivitiesBase",
    "ActivitiesCreate",
    "ActivitiesUpdate",
    "ActivitiesResponse",
    "ActivitiesListResponse",
]
