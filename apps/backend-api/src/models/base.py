"""모델 베이스 클래스"""

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from src.core.database import Base


class TimestampMixin:
    """타임스탬프 Mixin"""

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        onupdate=func.now(),
        nullable=True,
    )


class UserTrackingMixin:
    """사용자 추적 Mixin"""

    created_by: Mapped[UUID | None] = mapped_column(nullable=True)
    updated_by: Mapped[UUID | None] = mapped_column(nullable=True)


class SoftDeleteMixin:
    """Soft Delete Mixin"""

    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    deleted_by: Mapped[UUID | None] = mapped_column(nullable=True)


class TenantMixin:
    """테넌트 Mixin"""

    tenant_id: Mapped[UUID] = mapped_column(nullable=False, index=True)


class BaseModel(Base, TimestampMixin, UserTrackingMixin):
    """기본 모델 클래스 (관리자 DB용)"""

    __abstract__ = True

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)


class TenantBaseModel(Base, TimestampMixin, UserTrackingMixin, TenantMixin):
    """테넌트 모델 클래스 (테넌트 DB용)"""

    __abstract__ = True

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
