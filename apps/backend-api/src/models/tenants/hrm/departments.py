from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Departments"]


class Departments(TenantBaseModel):
    """조직/부서 정보 관리 테이블 - 회사 조직도 및 부서 계층 구조 관리"""
    __tablename__ = "departments"
    __table_args__ = {"schema": "hrm"}

    code: Mapped[str] = mapped_column(String(50), nullable=False)  # 부서 코드 (영대문자, 숫자, 언더스코어 2-50자)
    name: Mapped[str] = mapped_column(String(100), nullable=False)  # 부서명
    name_en: Mapped[str | None] = mapped_column(String(100))  # 부서명 (영문, 다국어 지원)
    description: Mapped[str | None] = mapped_column(Text)  # 부서 설명
    parent_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.departments.id"))  # 상위 부서 식별자 (계층구조)
    level: Mapped[int | None] = mapped_column(Integer, default=1)  # 부서 레벨 (1: 회사, 2: 본부, 3: 부서, 4: 팀)
    dept_type: Mapped[str] = mapped_column(String(20), nullable=False, default='DEPARTMENT')  # 부서 유형 (COMPANY: 회사, DIVISION: 본부, DEPARTMENT: 부서, TEAM: 팀)
    manager_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.employees.id"))  # 부서장 식별자 (사원 참조)
    cost_center_code: Mapped[str | None] = mapped_column(String(50))  # 원가센터 코드 (회계 연계용)
    phone: Mapped[str | None] = mapped_column(String(50))  # 부서 전화번호
    email: Mapped[str | None] = mapped_column(String(255))  # 부서 이메일
    fax: Mapped[str | None] = mapped_column(String(50))  # 팩스번호
    location: Mapped[str | None] = mapped_column(String(200))  # 근무지/사무실 위치
    floor: Mapped[str | None] = mapped_column(String(20))  # 층 정보
    sort_order: Mapped[int | None] = mapped_column(Integer, default=0)  # 정렬 순서
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='ACTIVE')  # 부서 상태 (ACTIVE: 활성, INACTIVE: 비활성, CLOSED: 폐쇄)
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 논리 삭제 플래그