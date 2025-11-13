from uuid import UUID as PyUUID
from datetime import date, datetime
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["EmployeeHistories"]


class EmployeeHistories(TenantBaseModel):
    """인사 발령 이력 테이블 - 사원 인사 변경 이력 관리 (부서이동, 직급변경, 직책변경 등)"""
    __tablename__ = "employee_histories"
    __table_args__ = {"schema": "hrm"}

    employee_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("hrm.employees.id"), nullable=False)  # 사원 식별자
    order_type: Mapped[str] = mapped_column(String(20), nullable=False)  # 발령 유형 (HIRE: 입사, TRANSFER: 전보, PROMOTION: 승진, DEMOTION: 강등, POSITION_CHANGE: 직책변경, LOCATION_CHANGE: 근무지변경, WORK_TYPE_CHANGE: 근무형태변경, EMPLOYMENT_TYPE_CHANGE: 고용형태변경, SALARY_CHANGE: 급여변경, LEAVE: 휴직, RETURN: 복직, TERMINATE: 해고, RETIRE: 퇴직)
    order_date: Mapped[date] = mapped_column(Date, nullable=False)  # 발령일
    effective_date: Mapped[date] = mapped_column(Date, nullable=False)  # 시행일 (실제 적용일)
    order_reason: Mapped[str | None] = mapped_column(Text)  # 발령 사유
    old_department_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.departments.id"))  # 변경 전 부서 식별자
    new_department_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.departments.id"))  # 변경 후 부서 식별자
    old_job_level: Mapped[str | None] = mapped_column(String(20))  # 변경 전 직급
    new_job_level: Mapped[str | None] = mapped_column(String(20))  # 변경 후 직급
    old_job_title: Mapped[str | None] = mapped_column(String(100))  # 변경 전 직책
    new_job_title: Mapped[str | None] = mapped_column(String(100))  # 변경 후 직책
    old_work_location: Mapped[str | None] = mapped_column(String(100))  # 변경 전 근무지
    new_work_location: Mapped[str | None] = mapped_column(String(100))  # 변경 후 근무지
    old_work_type: Mapped[str | None] = mapped_column(String(20))  # 변경 전 근무 형태
    new_work_type: Mapped[str | None] = mapped_column(String(20))  # 변경 후 근무 형태
    old_employment_type: Mapped[str | None] = mapped_column(String(20))  # 변경 전 고용 형태
    new_employment_type: Mapped[str | None] = mapped_column(String(20))  # 변경 후 고용 형태
    old_salary_type: Mapped[str | None] = mapped_column(String(20))  # 변경 전 급여 유형
    new_salary_type: Mapped[str | None] = mapped_column(String(20))  # 변경 후 급여 유형
    old_base_salary: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=2))  # 변경 전 기본급
    new_base_salary: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=2))  # 변경 후 기본급
    old_status: Mapped[str | None] = mapped_column(String(20))  # 변경 전 재직 상태
    new_status: Mapped[str | None] = mapped_column(String(20))  # 변경 후 재직 상태
    order_number: Mapped[str | None] = mapped_column(String(50))  # 발령 번호
    order_document: Mapped[str | None] = mapped_column(Text)  # 발령 문서 내용
    attachment_url: Mapped[str | None] = mapped_column(String(500))  # 첨부 문서 URL
    approved_by: Mapped[PyUUID | None] = mapped_column(UUID)  # 승인자 UUID
    approved_at: Mapped[datetime | None] = mapped_column(DateTime)  # 승인 일시
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='PENDING')  # 발령 상태 (PENDING: 대기, APPROVED: 승인, REJECTED: 반려, CANCELLED: 취소)
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 논리 삭제 플래그