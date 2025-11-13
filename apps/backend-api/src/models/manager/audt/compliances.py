"""Compliances 모델"""

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Compliances(BaseModel):
    """Compliances 모델"""

    __tablename__ = "compliances"
    __table_args__ = {"schema": "audt"}

    scope: Mapped[str] = mapped_column(String(50), nullable=False, default="ALL_TENANTS")
    findings_count: Mapped[int | None] = mapped_column(Integer, default=0)
    critical_count: Mapped[int | None] = mapped_column(Integer, default=0)
    file_type: Mapped[str | None] = mapped_column(String(20), default="PDF")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="DRAFT")
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<Compliances(id={self.id})>"
