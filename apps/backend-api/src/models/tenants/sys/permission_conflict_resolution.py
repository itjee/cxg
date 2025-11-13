"""권한 충돌 해결 정책 모델"""

from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, Boolean, Integer, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["PermissionConflictResolution"]


class PermissionConflictResolution(TenantBaseModel):
    """권한 충돌 해결 전략 정의 - 사용자가 여러 역할을 가질 때 권한 병합 규칙 설정"""

    __tablename__ = "permission_conflict_resolution"
    __table_args__ = (
        CheckConstraint(
            "conflict_strategy IN ('DENY_OVERRIDE', 'ALLOW_UNION', 'PRIORITY_BASED', 'MOST_RESTRICTIVE')",
            name="ck_permission_conflict_resolution__strategy",
        ),
        CheckConstraint(
            "max_concurrent_roles IS NULL OR max_concurrent_roles > 0",
            name="ck_permission_conflict_resolution__max_roles",
        ),
        {"schema": "sys"},
    )

    # 정책 코드 및 이름
    code: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)

    # 충돌 해결 전략
    conflict_strategy: Mapped[str] = mapped_column(String(50), nullable=False)
    # DENY_OVERRIDE: 하나의 역할이라도 거부하면 거부 (AND 연산)
    # ALLOW_UNION: 하나의 역할이라도 허용하면 허용 (OR 연산)
    # PRIORITY_BASED: 우선순위가 높은 역할의 권한 사용
    # MOST_RESTRICTIVE: 가장 제한적인 권한 사용

    merge_rule: Mapped[str] = mapped_column(String(50), nullable=False, default="DENY_OVERRIDE")

    # 다중 역할 최대 수 (성능 최적화)
    max_concurrent_roles: Mapped[int | None] = mapped_column(Integer)  # NULL: 무제한

    # 우선순위 설정
    use_role_priority: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    priority_direction: Mapped[str | None] = mapped_column(String(20))  # ASC: 낮은 숫자 우선, DESC: 높은 숫자 우선

    # 예외 사항
    apply_global_rules: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    apply_to_admins: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    # 상태
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    is_system: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 시스템 기본 정책 여부 (수정 불가)
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<PermissionConflictResolution(id={self.id}, code={self.code}, strategy={self.conflict_strategy})>"
