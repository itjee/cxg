from uuid import UUID as PyUUID
from datetime import date, datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func

from ..base import TenantBaseModel

__all__ = ["EmailTemplates"]


class EmailTemplates(TenantBaseModel):
    """이메일 템플릿 관리 테이블"""
    __tablename__ = "email_templates"
    __table_args__ = {"schema": "crm"}

    template_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 템플릿 코드 (고유번호)
    name: Mapped[str] = mapped_column(String(200), nullable=False)  # 템플릿명
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    category: Mapped[str | None] = mapped_column(String(50))  # 카테고리 (영업, 마케팅, 고객지원 등)
    template_type: Mapped[str] = mapped_column(String(20), nullable=False)  # 템플릿 유형 (WELCOME/FOLLOW_UP/CAMPAIGN/QUOTE/ORDER/INVOICE/SURVEY/NOTIFICATION/CUSTOM)
    subject: Mapped[str] = mapped_column(String(500), nullable=False)  # 이메일 제목 (변수 사용 가능: {{customer_name}})
    body_html: Mapped[str] = mapped_column(Text, nullable=False)  # 본문 HTML (변수 사용 가능)
    body_text: Mapped[str | None] = mapped_column(Text)  # 본문 텍스트 (HTML 미지원 클라이언트용)
    variables: Mapped[dict | None] = mapped_column(JSON)  # 사용 가능한 변수 목록 (JSON, 예: ["customer_name", "order_number"])
    from_name: Mapped[str | None] = mapped_column(String(100))  # 발신자명
    from_email: Mapped[str | None] = mapped_column(String(100))  # 발신자 이메일
    reply_to: Mapped[str | None] = mapped_column(String(100))  # 답장 주소
    default_attachments: Mapped[dict | None] = mapped_column(JSON)  # 기본 첨부파일 정보 (JSON)
    usage_count: Mapped[int | None] = mapped_column(Integer, default=0)  # 사용 횟수
    last_used_at: Mapped[datetime | None] = mapped_column(DateTime)  # 마지막 사용 일시
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='DRAFT')  # 상태 (DRAFT/ACTIVE/ARCHIVED)
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 논리 삭제 플래그
    notes: Mapped[str | None] = mapped_column(Text)  # 비고