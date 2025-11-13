"""
고객 만족도 설문 관리 테이블

Pydantic schemas for CustomerSurveys model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class CustomerSurveysBase(BaseModel):
    """Base schema for CustomerSurveys"""
    model_config = ConfigDict(from_attributes=True)

    survey_code: str = Field(description="설문 코드 (고유번호)")
    survey_type: str | None = Field(None, description="설문 유형 (NPS: 0-10, CSAT: 1-5, CES: 1-7, GENERAL, CUSTOM)")
    partner_id: str | None = Field(None, description="거래처 ID")
    lead_id: str | None = Field(None, description="리드 ID")
    contact_id: str | None = Field(None, description="담당자 ID (partner_contacts)")
    opportunity_id: str | None = Field(None, description="영업기회 ID")
    so_id: str | None = Field(None, description="판매주문 ID")
    question: str = Field(description="질문 내용")
    response_score: str | None = Field(None, description="응답 점수 (NPS: 0-10, CSAT: 1-5, CES: 1-7)")
    response_text: str | None = Field(None, description="응답 텍스트 (자유 의견)")
    response_at: str | None = Field(None, description="응답 일시")
    sentiment: str | None = Field(None, description="감정 분석 (POSITIVE/NEUTRAL/NEGATIVE)")
    sent_date: str | None = Field(None, description="발송일")
    sent_by: str | None = Field(None, description="발송자 UUID")
    send_channel: str | None = Field(None, description="발송 채널 (EMAIL/SMS/PHONE/WEB/MOBILE_APP)")
    status: str | None = Field(default='PENDING', description="상태 (PENDING/SENT/RESPONDED/EXPIRED/CANCELLED)")
    is_anonymous: str | None = Field(default=False, description="익명 여부")
    is_deleted: str | None = Field(default=False, description="논리 삭제 플래그")
    notes: str | None = Field(None, description="비고")


class CustomerSurveysCreate(CustomerSurveysBase):
    """Schema for creating CustomerSurveys"""

    # Exclude auto-generated fields
    pass


class CustomerSurveysUpdate(BaseModel):
    """Schema for updating CustomerSurveys (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    survey_code: str | None = Field(None, description="설문 코드 (고유번호)")
    survey_type: str | None = Field(None, description="설문 유형 (NPS: 0-10, CSAT: 1-5, CES: 1-7, GENERAL, CUSTOM)")
    partner_id: str | None = Field(None, description="거래처 ID")
    lead_id: str | None = Field(None, description="리드 ID")
    contact_id: str | None = Field(None, description="담당자 ID (partner_contacts)")
    opportunity_id: str | None = Field(None, description="영업기회 ID")
    so_id: str | None = Field(None, description="판매주문 ID")
    question: str | None = Field(None, description="질문 내용")
    response_score: str | None = Field(None, description="응답 점수 (NPS: 0-10, CSAT: 1-5, CES: 1-7)")
    response_text: str | None = Field(None, description="응답 텍스트 (자유 의견)")
    response_at: str | None = Field(None, description="응답 일시")
    sentiment: str | None = Field(None, description="감정 분석 (POSITIVE/NEUTRAL/NEGATIVE)")
    sent_date: str | None = Field(None, description="발송일")
    sent_by: str | None = Field(None, description="발송자 UUID")
    send_channel: str | None = Field(None, description="발송 채널 (EMAIL/SMS/PHONE/WEB/MOBILE_APP)")
    status: str | None = Field(default='PENDING', description="상태 (PENDING/SENT/RESPONDED/EXPIRED/CANCELLED)")
    is_anonymous: str | None = Field(default=False, description="익명 여부")
    is_deleted: str | None = Field(default=False, description="논리 삭제 플래그")
    notes: str | None = Field(None, description="비고")


class CustomerSurveysResponse(CustomerSurveysBase):
    """Schema for CustomerSurveys response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class CustomerSurveysListResponse(BaseModel):
    """Schema for paginated CustomerSurveys list response"""

    items: list[CustomerSurveysResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "CustomerSurveysBase",
    "CustomerSurveysCreate",
    "CustomerSurveysUpdate",
    "CustomerSurveysResponse",
    "CustomerSurveysListResponse",
]
