from uuid import UUID as PyUUID
from datetime import date, datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Users"]


class Users(TenantBaseModel):
    """시스템 사용자 정보를 관리하는 테이블 (각 테넌트별 사용자 계정 분리 관리)"""
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint("failed_login_attempts >= 0", name="ck_users__failed_attempts"),
        {"schema": "sys"},
    )

    user_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 사용자 코드 (테넌트 내 유니크)
    username: Mapped[str] = mapped_column(String(100), nullable=False)  # 로그인 사용자명
    email: Mapped[str] = mapped_column(String(255), nullable=False)  # 이메일 주소 (사용자 식별 및 알림 발송용)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)  # 암호화된 비밀번호 (bcrypt 등으로 해시화)
    first_name: Mapped[str | None] = mapped_column(String(100))  # 이름
    last_name: Mapped[str | None] = mapped_column(String(100))  # 성
    phone: Mapped[str | None] = mapped_column(String(50))  # 전화번호
    department_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 소속 부서 ID
    position: Mapped[str | None] = mapped_column(String(100))  # 직급/직책
    role_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("sys.roles.id"))  # 기본 역할 ID
    default_conflict_resolution_policy_id: Mapped[PyUUID | None] = mapped_column(
        UUID,
        ForeignKey("sys.permission_conflict_resolution.id", ondelete="SET NULL"),
        nullable=True
    )  # 다중 역할 사용 시 기본 권한 충돌 해결 정책
    failed_login_attempts: Mapped[int] = mapped_column(Integer, nullable=False, default=0)  # 연속 로그인 실패 횟수
    locked_until: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)  # 계정 잠금 해제 시각
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))  # 마지막 로그인 일시
    last_login_ip: Mapped[str | None] = mapped_column(String(45))  # 마지막 로그인 IP (IPv6 지원)
    is_system_user: Mapped[bool] = mapped_column(Boolean, default=False)  # 시스템 사용자 여부 (자동화/배치용)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)  # 활성 상태 (true: 로그인 가능, false: 로그인 불가)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그