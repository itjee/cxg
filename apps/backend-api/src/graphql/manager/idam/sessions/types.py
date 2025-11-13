"""Manager IDAM Sessions - GraphQL Types"""

from datetime import datetime
from uuid import UUID

import strawberry

from src.graphql.common import Node


@strawberry.type(description="Manager 세션")
class ManagerSession(Node):
    """
    Manager 시스템 세션

    사용자 세션 정보 및 상태 관리
    """

    id: strawberry.ID

    # 세션 정보
    session_id: str = strawberry.field(description="세션 ID")
    user_id: UUID = strawberry.field(description="사용자 ID")

    # 세션 컨텍스트
    tenant_context: UUID | None = strawberry.field(default=None, description="테넌트 컨텍스트")
    session_type: str = strawberry.field(description="세션 타입 (WEB, API, MOBILE)")

    # 세션 메타데이터
    fingerprint: str | None = strawberry.field(default=None, description="브라우저 지문")
    user_agent: str | None = strawberry.field(default=None, description="User Agent")
    ip_address: str = strawberry.field(description="IP 주소")
    country_code: str | None = strawberry.field(default=None, description="국가 코드")
    city: str | None = strawberry.field(default=None, description="도시")

    # 세션 상태
    status: str = strawberry.field(description="상태 (ACTIVE, EXPIRED, REVOKED)")
    expires_at: datetime = strawberry.field(description="만료일시")
    last_activity_at: datetime = strawberry.field(description="마지막 활동일시")

    # MFA 정보
    mfa_verified: bool = strawberry.field(description="MFA 인증 여부")
    mfa_verified_at: datetime | None = strawberry.field(default=None, description="MFA 인증일시")

    # 시스템 필드
    created_at: datetime = strawberry.field(description="생성일시")
    updated_at: datetime | None = strawberry.field(default=None, description="수정일시")
