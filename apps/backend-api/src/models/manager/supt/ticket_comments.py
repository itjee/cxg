"""TicketComments 모델"""

from sqlalchemy import Boolean, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class TicketComments(BaseModel):
    """TicketComments 모델"""

    __tablename__ = "ticket_comments"
    __table_args__ = {"schema": "supt"}

    comment_type: Mapped[str] = mapped_column(String(20), nullable=False, default="COMMENT")
    is_internal: Mapped[bool | None] = mapped_column(Boolean, default=False)
    files: Mapped[dict | None] = mapped_column(JSONB, default="[]")
    automated: Mapped[bool | None] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ACTIVE")
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<TicketComments(id={self.id})>"
