from uuid import UUID as PyUUID
from datetime import date, datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["DepartmentHistories"]


class DepartmentHistories(TenantBaseModel):
    """조직 개편 이력 테이블 - 부서 변경 이력 관리 (부서명, 부서장, 조직개편 등)"""
    __tablename__ = "department_histories"
    __table_args__ = {"schema": "hrm"}

    department_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("hrm.departments.id"), nullable=False)  # 부서 식별자
    change_type: Mapped[str] = mapped_column(String(20), nullable=False)  # 변경 유형 (RENAME: 명칭변경, REORGANIZE: 조직개편, MANAGER_CHANGE: 부서장변경, TYPE_CHANGE: 유형변경, PARENT_CHANGE: 상위부서변경, MERGE: 통합, SPLIT: 분할, CLOSE: 폐쇄, REOPEN: 재개)
    change_date: Mapped[date] = mapped_column(Date, nullable=False)  # 변경 발령일
    effective_date: Mapped[date] = mapped_column(Date, nullable=False)  # 변경 시행일 (실제 적용일)
    change_reason: Mapped[str | None] = mapped_column(Text)  # 변경 사유
    old_code: Mapped[str | None] = mapped_column(String(50))  # 변경 전 부서 코드
    new_code: Mapped[str | None] = mapped_column(String(50))  # 변경 후 부서 코드
    old_name: Mapped[str | None] = mapped_column(String(100))  # 변경 전 부서명
    new_name: Mapped[str | None] = mapped_column(String(100))  # 변경 후 부서명
    old_dept_type: Mapped[str | None] = mapped_column(String(20))  # 변경 전 부서 유형
    new_dept_type: Mapped[str | None] = mapped_column(String(20))  # 변경 후 부서 유형
    old_parent_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.departments.id"))  # 변경 전 상위 부서 식별자
    new_parent_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.departments.id"))  # 변경 후 상위 부서 식별자
    old_manager_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.employees.id"))  # 변경 전 부서장 식별자
    new_manager_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.employees.id"))  # 변경 후 부서장 식별자
    order_number: Mapped[str | None] = mapped_column(String(50))  # 발령 번호
    order_document: Mapped[str | None] = mapped_column(Text)  # 발령 문서 내용
    attachment_url: Mapped[str | None] = mapped_column(String(500))  # 첨부 문서 URL
    approved_by: Mapped[PyUUID | None] = mapped_column(UUID)  # 승인자 UUID
    approved_at: Mapped[datetime | None] = mapped_column(DateTime)  # 승인 일시
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='PENDING')  # 상태 (PENDING: 대기, APPROVED: 승인, REJECTED: 반려, CANCELLED: 취소)
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 논리 삭제 플래그