from uuid import UUID as PyUUID
from datetime import date, datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Absences"]


class Absences(TenantBaseModel):
    """결근/휴가 관리 테이블 - 직원의 결근, 휴가, 병가, 휴직 등 관리"""
    __tablename__ = "absences"
    __table_args__ = {"schema": "hrm"}

    employee_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("hrm.employees.id"), nullable=False)  # 직원 식별자
    absence_type: Mapped[str] = mapped_column(String(20), nullable=False)  # 결근 유형 (ABSENCE: 결근, LATE: 지각, SICK: 병가, ANNUAL: 연차, UNPAID: 무급휴가, MATERNITY: 출산휴가, LEAVE: 휴직)
    date_from: Mapped[date] = mapped_column(Date, nullable=False)  # 시작일
    date_to: Mapped[date] = mapped_column(Date, nullable=False)  # 종료일
    duration_hours: Mapped[int | None] = mapped_column(Integer)  # 소요 시간 (NULL이면 전일)
    reason: Mapped[str | None] = mapped_column(Text)  # 사유
    attached_document_path: Mapped[str | None] = mapped_column(String(500))  # 첨부 문서 경로 (진단서 등)
    approved_by: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.employees.id"))  # 승인자 UUID
    approval_date: Mapped[datetime | None] = mapped_column(DateTime)  # 승인 일시
    rejection_reason: Mapped[str | None] = mapped_column(Text)  # 거부 사유
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='DRAFT')  # 상태 (DRAFT: 임시저장, SUBMITTED: 제출, APPROVED: 승인, REJECTED: 거부, CANCELLED: 취소)
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 논리 삭제 플래그