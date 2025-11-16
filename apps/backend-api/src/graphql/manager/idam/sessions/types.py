"""Manager IDAM Sessions - GraphQL Types

세션(Session) 관련 GraphQL 타입 정의
"""

from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

import strawberry

from src.graphql.common import Node


if TYPE_CHECKING:
    from ..users.types import ManagerUser


@strawberry.type(description="Manager 세션")
class ManagerSession(Node):
    """
    Manager 시스템 세션

    사용자 인증 후 생성되는 세션 정보를 관리합니다.
    세션은 사용자의 로그인 상태, 위치, 디바이스 정보 등을 추적합니다.
    """

    id: strawberry.ID

    # 세션 기본 정보
    session_id: str = strawberry.field(description="세션 ID (고유 식별자)")
    user_id: UUID = strawberry.field(description="사용자 ID")

    # 세션 컨텍스트
    tenant_context: UUID | None = strawberry.field(
        default=None, description="테넌트 컨텍스트 (테넌트 사용자의 경우)"
    )
    session_type: str = strawberry.field(
        description="세션 타입 (WEB: 웹, API: API 키, MOBILE: 모바일 앱)"
    )

    # 세션 메타데이터
    fingerprint: str | None = strawberry.field(
        default=None, description="브라우저 지문 (디바이스 식별용)"
    )
    user_agent: str | None = strawberry.field(default=None, description="User Agent 문자열")
    ip_address: str = strawberry.field(description="IP 주소")
    country_code: str | None = strawberry.field(default=None, description="국가 코드 (ISO 3166-1)")
    city: str | None = strawberry.field(default=None, description="도시명")

    # 세션 상태
    status: str = strawberry.field(
        description="세션 상태 (ACTIVE: 활성, EXPIRED: 만료, REVOKED: 폐기됨)"
    )
    expires_at: datetime = strawberry.field(description="세션 만료일시")
    last_activity_at: datetime = strawberry.field(description="마지막 활동일시")

    # MFA 정보
    mfa_verified: bool = strawberry.field(description="MFA(다중 인증) 검증 여부")
    mfa_verified_at: datetime | None = strawberry.field(default=None, description="MFA 검증일시")

    # 시스템 필드
    created_at: datetime = strawberry.field(description="생성일시")
    updated_at: datetime | None = strawberry.field(default=None, description="수정일시")

    @strawberry.field(description="세션 소유자 (사용자)")
    async def user(self, info) -> "ManagerUser | None":
        """
        세션 소유자(사용자) 정보를 조회하는 필드 resolver

        Session과 User는 Many-to-One 관계입니다.
        """
        from .resolvers import resolve_manager_session_user

        # UUID를 그대로 전달
        return await resolve_manager_session_user(self.user_id, info)
