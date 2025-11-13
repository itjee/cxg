"""Policies 모델"""

from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Policies(BaseModel):
    """Policies 모델"""

    __tablename__ = "policies"
    __table_args__ = {"schema": "audt"}

    apply_to_all_tenants: Mapped[bool | None] = mapped_column(Boolean, default=True)
    enforcement_level: Mapped[str] = mapped_column(String(20), nullable=False, default="MANDATORY")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="DRAFT")
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<Policies(id={self.id})>"
