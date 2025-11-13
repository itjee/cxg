from uuid import UUID as PyUUID
from datetime import date, datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["SupportTickets"]


class SupportTickets(TenantBaseModel):
    """고객 문의 및 지원 티켓 관리 테이블 (기술지원/제품문의/불만사항)"""
    __tablename__ = "support_tickets"
    __table_args__ = {"schema": "asm"}

    ticket_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 티켓 코드
    customer_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("crm.partners.id"))  # 고객 식별자 (NULL: 비회원 문의)
    contact_name: Mapped[str | None] = mapped_column(String(100))  # 문의자 이름
    contact_email: Mapped[str | None] = mapped_column(String(255))  # 문의자 이메일
    contact_phone: Mapped[str | None] = mapped_column(String(50))  # 문의자 연락처
    subject: Mapped[str] = mapped_column(String(255), nullable=False)  # 문의 제목
    description: Mapped[str | None] = mapped_column(Text)  # 문의 상세 내용
    category: Mapped[str | None] = mapped_column(String(50))  # 카테고리 (기술지원/제품문의/불만사항/제안 등)
    sub_category: Mapped[str | None] = mapped_column(String(50))  # 하위 카테고리
    priority: Mapped[str | None] = mapped_column(String(20), default='MEDIUM')  # 우선순위 (LOW: 낮음/MEDIUM: 보통/HIGH: 높음/URGENT: 긴급)
    status: Mapped[str | None] = mapped_column(String(20), ForeignKey("adm.employees.id"), default='OPEN')  # 상태 (OPEN: 접수/IN_PROGRESS: 진행중/RESOLVED: 해결/CLOSED: 종료/CANCELLED: 취소)
    assigned_to: Mapped[PyUUID | None] = mapped_column(UUID)  # 담당자 식별자
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime)  # 해결 일시
    closed_at: Mapped[datetime | None] = mapped_column(DateTime)  # 종료 일시
    resolution: Mapped[str | None] = mapped_column(Text)  # 해결 내용
    resolution_time_minutes: Mapped[int | None] = mapped_column(Integer)  # 해결 소요 시간 (분 단위)
    satisfaction_rating: Mapped[int | None] = mapped_column(Integer)  # 만족도 평가 (1-5점)
    satisfaction_comment: Mapped[str | None] = mapped_column(Text)  # 만족도 평가 코멘트
    linked_service_request_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("asm.service_requests.id"))  # 연계된 A/S 요청 식별자 (티켓이 A/S로 전환된 경우)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그