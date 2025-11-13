from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func

from ..base import TenantBaseModel

__all__ = ["Permissions"]


class Permissions(TenantBaseModel):
    """시스템의 모든 권한을 정의하는 마스터 테이블 (모듈별 리소스에 대한 액션 권한 관리)"""
    __tablename__ = "permissions"
    __table_args__ = {"schema": "sys"}

    code: Mapped[str] = mapped_column(String(100), nullable=False)  # 권한 코드 (전체 시스템 유니크, 예: ADM_USERS_CREATE)
    name: Mapped[str] = mapped_column(String(200), nullable=False)  # 권한명 (사용자에게 표시되는 이름)
    module_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 모듈 코드 (ADM, PSM, SRM, IVM, LWM, CSM, ASM, FIM, BIM, COM, SYS)
    resource: Mapped[str] = mapped_column(String(100), nullable=False)  # 리소스명 (권한이 적용되는 대상: 테이블명, 화면명, 기능명 등)
    action: Mapped[str] = mapped_column(String(50), nullable=False)  # 액션 (리소스에 대한 작업: CREATE, READ, UPDATE, DELETE, APPROVE, EXPORT 등)
    description: Mapped[str | None] = mapped_column(Text)  # 권한 설명
    is_active: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 활성 상태