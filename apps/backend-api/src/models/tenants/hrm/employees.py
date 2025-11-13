from uuid import UUID as PyUUID
from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Employees"]


class Employees(TenantBaseModel):
    """사원 기본 정보 관리 테이블 - 임직원 인사정보 및 재직 이력 관리"""
    __tablename__ = "employees"
    __table_args__ = {"schema": "hrm"}

    code: Mapped[str] = mapped_column(String(20), nullable=False)  # 사원번호 (영대문자, 숫자, 언더스코어 2-20자)
    name: Mapped[str] = mapped_column(String(100), nullable=False)  # 사원명 (한글명)
    name_en: Mapped[str | None] = mapped_column(String(100))  # 사원명 (영문명, 다국어 지원)
    name_cn: Mapped[str | None] = mapped_column(String(100))  # 사원명 (한자명, 다국어 지원)
    birth_date: Mapped[date | None] = mapped_column(Date)  # 생년월일
    gender: Mapped[str | None] = mapped_column(String(10))  # 성별 (MALE: 남성, FEMALE: 여성, OTHER: 기타)
    nationality: Mapped[str | None] = mapped_column(String(3))  # 국적 (ISO 3166-1 alpha-3, 예: KOR, USA, CHN)
    id_number: Mapped[str | None] = mapped_column(String(50))  # 주민등록번호/여권번호 (암호화 필요)
    phone: Mapped[str | None] = mapped_column(String(50))  # 전화번호
    mobile: Mapped[str | None] = mapped_column(String(50))  # 휴대폰 번호
    email: Mapped[str | None] = mapped_column(String(255))  # 이메일 주소
    emergency_contact: Mapped[str | None] = mapped_column(String(50))  # 비상연락처
    emergency_contact_name: Mapped[str | None] = mapped_column(String(100))  # 비상연락처 이름
    postcode: Mapped[str | None] = mapped_column(String(10))  # 우편번호
    address1: Mapped[str | None] = mapped_column(String(200))  # 기본 주소
    address2: Mapped[str | None] = mapped_column(String(200))  # 상세 주소
    department_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.departments.id"))  # 소속 부서 식별자
    job_title: Mapped[str | None] = mapped_column(String(100))  # 직책/직위
    job_level: Mapped[str | None] = mapped_column(String(20))  # 직급 (STAFF/SENIOR/ASSISTANT_MANAGER/MANAGER/SENIOR_MANAGER/DIRECTOR/VP/CEO)
    job_description: Mapped[str | None] = mapped_column(Text)  # 직무내용
    work_location: Mapped[str | None] = mapped_column(String(100))  # 근무지
    work_type: Mapped[str] = mapped_column(String(20), nullable=False, default='OFFICE')  # 근무 형태 (OFFICE: 사무실, REMOTE: 재택, HYBRID: 혼합, FIELD: 현장)
    employment_type: Mapped[str | None] = mapped_column(String(20), default='REGULAR')  # 고용 형태 (REGULAR: 정규직, CONTRACT: 계약직, PART_TIME: 파트타임, INTERN: 인턴, TEMPORARY: 임시직)
    hire_date: Mapped[date | None] = mapped_column(Date)  # 입사일
    probation_end_date: Mapped[date | None] = mapped_column(Date)  # 수습 종료일
    leave_date: Mapped[date | None] = mapped_column(Date)  # 퇴사일
    leave_reason: Mapped[str | None] = mapped_column(Text)  # 퇴사 사유
    salary_type: Mapped[str | None] = mapped_column(String(20))  # 급여 유형 (MONTHLY: 월급, HOURLY: 시급, ANNUAL: 연봉, DAILY: 일급)
    base_salary: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=2))  # 기본급
    currency_code: Mapped[str | None] = mapped_column(String(3), ForeignKey("adm.currencies.id"), default='KRW')  # 통화 코드 (ISO 4217, 예: KRW, USD)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='ACTIVE')  # 재직 상태 (ACTIVE: 재직, PROBATION: 수습, LEAVE: 휴직, TERMINATED: 해고, RETIRED: 퇴직)
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 논리 삭제 플래그