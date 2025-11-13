from uuid import UUID as PyUUID
from datetime import date, time
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["ServiceWorks"]


class ServiceWorks(TenantBaseModel):
    """A/S 작업 내역 및 진행 상황 관리 테이블"""
    __tablename__ = "service_works"
    __table_args__ = {"schema": "asm"}

    service_request_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("asm.service_requests.id"), nullable=False)  # A/S 요청 식별자
    work_date: Mapped[date] = mapped_column(Date, nullable=False)  # 작업 실시 일자
    technician_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("adm.employees.id"), nullable=False)  # 작업 기술자 식별자
    work_description: Mapped[str] = mapped_column(Text, nullable=False)  # 작업 내용 상세 설명
    work_start_time: Mapped[time | None] = mapped_column(Time)  # 작업 시작 시간
    work_end_time: Mapped[time | None] = mapped_column(Time)  # 작업 종료 시간
    labor_hours: Mapped[Decimal | None] = mapped_column(Numeric(precision=5, scale=2), default=0)  # 작업 소요 시간 (시간 단위)
    labor_cost: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 인건비
    parts_cost: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 부품비
    other_cost: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 기타 비용
    total_cost: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 총 비용 (인건비 + 부품비 + 기타)
    work_result: Mapped[str | None] = mapped_column(String(20))  # 작업 결과 (SUCCESS: 성공/PARTIAL: 부분성공/FAILED: 실패)
    result_notes: Mapped[str | None] = mapped_column(Text)  # 작업 결과 메모
    status: Mapped[str | None] = mapped_column(String(20), default='COMPLETED')  # 작업 상태 (IN_PROGRESS: 진행중/COMPLETED: 완료/CANCELLED: 취소)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그