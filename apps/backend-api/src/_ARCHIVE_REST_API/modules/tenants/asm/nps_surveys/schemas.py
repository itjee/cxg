"""
NPS(Net Promoter Score) 설문 관리 테이블 - 고객 추천도 조사

Pydantic schemas for NpsSurveys model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class NpsSurveysBase(BaseModel):
    """Base schema for NpsSurveys"""
    model_config = ConfigDict(from_attributes=True)

    partner_id: UUID = Field(description="거래처 식별자")
    nps_score: int = Field(description="NPS 점수 (0-10, 0-6: Detractor, 7-8: Passive, 9-10: Promoter)")
    recommendation_reason: str | None = Field(None, max_length=20, description="추천 의향 분류 (PROMOTER: 추천함, PASSIVE: 중립, DETRACTOR: 비추천)")
    recommendation_text: str | None = Field(None, description="추천 사유 또는 개선점")
    sent_date: date | None = Field(None, description="설문 발송일")
    response_date: date | None = Field(None, description="응답일")
    response_time_days: int | None = Field(None, description="응답까지 소요 일수")
    status: str = Field(max_length=20, default='PENDING', description="상태 (PENDING: 대기, SENT: 발송, RESPONDED: 응답, CLOSED: 완료)")
    is_deleted: bool = Field(default=False, description="논리 삭제 플래그")


class NpsSurveysCreate(NpsSurveysBase):
    """Schema for creating NpsSurveys"""

    # Exclude auto-generated fields
    pass


class NpsSurveysUpdate(BaseModel):
    """Schema for updating NpsSurveys (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    partner_id: UUID | None = Field(None, description="거래처 식별자")
    nps_score: int | None = Field(None, description="NPS 점수 (0-10, 0-6: Detractor, 7-8: Passive, 9-10: Promoter)")
    recommendation_reason: str | None = Field(None, max_length=20, description="추천 의향 분류 (PROMOTER: 추천함, PASSIVE: 중립, DETRACTOR: 비추천)")
    recommendation_text: str | None = Field(None, description="추천 사유 또는 개선점")
    sent_date: date | None = Field(None, description="설문 발송일")
    response_date: date | None = Field(None, description="응답일")
    response_time_days: int | None = Field(None, description="응답까지 소요 일수")
    status: str | None = Field(max_length=20, default='PENDING', description="상태 (PENDING: 대기, SENT: 발송, RESPONDED: 응답, CLOSED: 완료)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class NpsSurveysResponse(NpsSurveysBase):
    """Schema for NpsSurveys response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class NpsSurveysListResponse(BaseModel):
    """Schema for paginated NpsSurveys list response"""

    items: list[NpsSurveysResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "NpsSurveysBase",
    "NpsSurveysCreate",
    "NpsSurveysUpdate",
    "NpsSurveysResponse",
    "NpsSurveysListResponse",
]
