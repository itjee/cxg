from uuid import UUID as PyUUID
from datetime import date, datetime, time
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Activities"]


class Activities(TenantBaseModel):
    """영업 활동 관리 테이블 (고객 접촉 이력)"""
    __tablename__ = "activities"
    __table_args__ = {"schema": "crm"}

    activity_type: Mapped[str] = mapped_column(String(20), nullable=False)  # 활동 유형 (CALL/EMAIL/MEETING/DEMO/VISIT/TASK/FOLLOW_UP/OTHER)
    subject: Mapped[str] = mapped_column(String(200), nullable=False)  # 제목
    description: Mapped[str | None] = mapped_column(Text)  # 내용
    related_to_type: Mapped[str | None] = mapped_column(String(20))  # 관련 대상 타입 (PARTNER/LEAD/OPPORTUNITY/CONTACT)
    partner_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("crm.partners.id"))  # 거래처 ID
    lead_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("crm.leads.id"))  # 리드 ID
    opportunity_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("crm.opportunities.id"))  # 영업 기회 ID
    contact_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("crm.partner_contacts.id"))  # 담당자 ID (partner_contacts)
    activity_date: Mapped[date] = mapped_column(Date, nullable=False)  # 활동 일자
    start_time: Mapped[time | None] = mapped_column(Time)  # 시작 시간
    end_time: Mapped[time | None] = mapped_column(Time)  # 종료 시간
    duration_minutes: Mapped[int | None] = mapped_column(Integer)  # 소요 시간 (분)
    location: Mapped[str | None] = mapped_column(String(200))  # 장소
    is_online: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 온라인 여부 (화상회의 등)
    meeting_url: Mapped[str | None] = mapped_column(String(500))  # 회의 URL (Zoom, Teams 등)
    owner_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("hrm.employees.id"), nullable=False)  # 담당자 UUID (활동 수행자)
    participants: Mapped[str | None] = mapped_column(Text)  # 참석자 목록 (JSON 배열)
    status: Mapped[str | None] = mapped_column(String(20), default='PLANNED')  # 상태 (PLANNED/IN_PROGRESS/COMPLETED/CANCELLED)
    priority: Mapped[str | None] = mapped_column(String(20), default='NORMAL')  # 우선순위 (URGENT/HIGH/NORMAL/LOW)
    is_completed: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 완료 여부
    completed_at: Mapped[datetime | None] = mapped_column(DateTime)  # 완료 일시
    completed_by: Mapped[PyUUID | None] = mapped_column(UUID)  # 완료 처리자 UUID
    outcome: Mapped[str | None] = mapped_column(String(50))  # 결과 (SUCCESSFUL/UNSUCCESSFUL/NO_ANSWER/RESCHEDULED 등)
    outcome_notes: Mapped[str | None] = mapped_column(Text)  # 결과 메모
    is_follow_up_required: Mapped[bool | None] = mapped_column(Boolean, ForeignKey("crm.activities.id"), default=False)  # 후속 활동 필요 여부
    follow_up_date: Mapped[date | None] = mapped_column(Date)  # 후속 활동 예정일
    follow_up_activity_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 생성된 후속 활동 ID
    is_reminder_enabled: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 알림 사용 여부
    reminder_minutes: Mapped[int | None] = mapped_column(Integer)  # 알림 시간 (활동 시작 n분 전)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그
    notes: Mapped[str | None] = mapped_column(Text)  # 비고