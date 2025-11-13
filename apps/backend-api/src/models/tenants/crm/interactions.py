from uuid import UUID as PyUUID
from datetime import date, datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Interactions"]


class Interactions(TenantBaseModel):
    """고객 상호작용 이력 관리 테이블"""
    __tablename__ = "interactions"
    __table_args__ = {"schema": "crm"}

    interaction_type: Mapped[str] = mapped_column(String(20), nullable=False)  # 상호작용 유형 (INQUIRY/COMPLAINT/FEEDBACK/SUPPORT/SALES/FOLLOW_UP/OTHER)
    channel: Mapped[str] = mapped_column(String(20), nullable=False)  # 채널 (PHONE/EMAIL/CHAT/SNS/VISIT/WEB/MOBILE_APP/OTHER)
    direction: Mapped[str] = mapped_column(String(20), nullable=False)  # 방향 (INBOUND: 고객→자사, OUTBOUND: 자사→고객)
    partner_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("crm.partners.id"))  # 거래처 ID
    lead_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("crm.leads.id"))  # 리드 ID
    contact_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("crm.partner_contacts.id"))  # 담당자 ID (partner_contacts)
    opportunity_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("crm.opportunities.id"))  # 영업 기회 ID
    subject: Mapped[str | None] = mapped_column(String(200))  # 제목
    content: Mapped[str | None] = mapped_column(Text)  # 내용
    summary: Mapped[str | None] = mapped_column(Text)  # 요약
    interaction_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)  # 상호작용 일시
    duration_seconds: Mapped[int | None] = mapped_column(Integer)  # 소요 시간 (초)
    handled_by: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.employees.id"))  # 처리자 UUID (자사 직원)
    sentiment: Mapped[str | None] = mapped_column(String(20))  # 감정 분석 (POSITIVE/NEUTRAL/NEGATIVE)
    satisfaction_score: Mapped[int | None] = mapped_column(Integer)  # 만족도 점수 (1-5점)
    outcome: Mapped[str | None] = mapped_column(String(50))  # 결과 (RESOLVED/PENDING/ESCALATED/CLOSED 등)
    is_follow_up_required: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 후속 조치 필요 여부
    follow_up_notes: Mapped[str | None] = mapped_column(Text)  # 후속 조치 메모
    follow_up_date: Mapped[date | None] = mapped_column(Date)  # 후속 조치 예정일
    tags: Mapped[str | None] = mapped_column(Text)  # 태그 배열
    category: Mapped[str | None] = mapped_column(String(50))  # 카테고리
    attachments: Mapped[dict | None] = mapped_column(JSON)  # 첨부파일 정보 (JSON)
    reference_url: Mapped[str | None] = mapped_column(String(500))  # 참조 URL (이메일, 채팅 링크 등)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그
    notes: Mapped[str | None] = mapped_column(Text)  # 비고