"""테넌트 사용자-역할 매핑 모델"""

from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, Boolean, DateTime, ForeignKey, func, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from datetime import date, datetime

from ..base import TenantBaseModel

__all__ = ["UserRoles"]


class UserRoles(TenantBaseModel):
    """테넌트 사용자-역할 매핑 (할당 이력 포함)"""
    __tablename__ = "user_roles"
    __table_args__ = (
        CheckConstraint("expires_at IS NULL OR expires_at > granted_at", name="ck_user_roles__expires"),
        CheckConstraint("revoked_at IS NULL OR revoked_at >= granted_at", name="ck_user_roles__revoke"),
        {"schema": "sys"},
    )

    user_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("sys.users.id", ondelete="CASCADE"), nullable=False)
    role_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("sys.roles.id", ondelete="CASCADE"), nullable=False)

    # 역할 할당 정보
    granted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )  # 할당 시각
    granted_by: Mapped[PyUUID | None] = mapped_column(UUID, nullable=True)  # 누가 할당했나

    # 역할 만료 (임시 역할 지원)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)  # NULL: 무기한, 값: 임시 역할

    # 권한 충돌 해결 정책 (다중 역할 사용 시)
    conflict_resolution_policy_id: Mapped[PyUUID | None] = mapped_column(
        UUID,
        ForeignKey("sys.permission_conflict_resolution.id", ondelete="SET NULL"),
        nullable=True
    )  # 이 역할 할당에 적용될 권한 충돌 해결 정책 ID

    # 역할 해제 정보
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)  # 역할 해제 시각
    revoked_by: Mapped[PyUUID | None] = mapped_column(UUID, nullable=True)  # 누가 해제했나
    revoke_reason: Mapped[str | None] = mapped_column(Text, nullable=True)  # 해제 사유

    # 상태
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)  # 활성 여부
