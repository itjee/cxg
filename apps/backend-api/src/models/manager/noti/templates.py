"""Templates 모델"""

from sqlalchemy import Boolean, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Templates(BaseModel):
    """Templates 모델"""

    __tablename__ = "templates"
    __table_args__ = {"schema": "noti"}

    template_variables: Mapped[dict] = mapped_column(JSONB, nullable=False, default="{}")
    locale: Mapped[str] = mapped_column(String(10), nullable=False, default="ko-KR")
    version: Mapped[str] = mapped_column(String(20), nullable=False, default="1.0")
    test_data: Mapped[dict] = mapped_column(JSONB, nullable=False, default="{}")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ACTIVE")
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    email_body: Mapped[str] = mapped_column(String(255), nullable=False)
    sms_message: Mapped[str] = mapped_column(String(255), nullable=False)
    push_title: Mapped[str] = mapped_column(String(255), nullable=False)
    push_body: Mapped[str] = mapped_column(String(255), nullable=False)
    in_app_title: Mapped[str] = mapped_column(String(255), nullable=False)
    in_app_message: Mapped[str] = mapped_column(String(255), nullable=False)

    def __repr__(self) -> str:
        return f"<Templates(id={self.id})>"
