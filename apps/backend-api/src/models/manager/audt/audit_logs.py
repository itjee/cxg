"""AuditLogs 모델"""

from uuid import UUID as PyUUID

from sqlalchemy import Boolean, String, Text
from sqlalchemy.dialects.postgresql import INET, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class AuditLogs(BaseModel):
    """AuditLogs 모델"""

    __tablename__ = "audit_logs"
    __table_args__ = {"schema": "audt"}

    user_id: Mapped[PyUUID | None] = mapped_column(index=True)
    tenant_id: Mapped[PyUUID | None] = mapped_column(index=True)
    action: Mapped[str] = mapped_column(String(255), index=True)
    target_entity: Mapped[str | None] = mapped_column(String(255), index=True)
    target_id: Mapped[PyUUID | None] = mapped_column(index=True)
    request_path: Mapped[str] = mapped_column(String(255))
    request_method: Mapped[str] = mapped_column(String(10))
    ip_address: Mapped[str] = mapped_column(INET, nullable=False, index=True)
    user_agent: Mapped[str | None] = mapped_column(Text)
    risk_level: Mapped[str] = mapped_column(String(20), nullable=False, default="LOW")
    extra_data: Mapped[dict | None] = mapped_column(JSONB, default="{}")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ACTIVE")
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<AuditLogs(id={self.id})>"
