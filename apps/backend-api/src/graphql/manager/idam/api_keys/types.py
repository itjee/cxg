"""Manager IDAM API Keys - GraphQL Types

Manager 시스템 API 키 관련 GraphQL 타입 정의
API 키 생성, 조회, 관리를 위한 타입들을 정의합니다.
"""

from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

import strawberry

from src.graphql.common import Node


if TYPE_CHECKING:
    from ..users.types import ManagerUser


@strawberry.type(description="Manager API 키")
class ManagerApiKey(Node):
    """
    Manager 시스템 API 키

    사용자나 서비스가 API를 호출할 때 사용하는 인증 키입니다.
    JWT 토큰 대신 장기 실행되는 서비스나 자동화 스크립트에서 사용합니다.

    특징:
        - 사용자별로 여러 개의 API 키 발급 가능
        - Rate Limiting으로 사용량 제한
        - IP 화이트리스트로 보안 강화
        - 사용 통계 추적
    """

    id: strawberry.ID

    # API 키 기본 정보
    key_id: str = strawberry.field(description="API 키 ID (공개, 클라이언트가 전송)")
    key_name: str = strawberry.field(description="API 키 이름 (관리용, 예: 'Production API Key')")

    # 소유자 정보
    user_id: UUID = strawberry.field(description="소유자 사용자 ID")
    tenant_context: UUID | None = strawberry.field(
        default=None, description="테넌트 컨텍스트 (멀티테넌트 환경)"
    )
    service_account: str | None = strawberry.field(
        default=None, description="서비스 계정명 (자동화 서비스용)"
    )

    @strawberry.field(description="API 키 소유자")
    async def user(self, info) -> "ManagerUser | None":
        """
        API 키 소유자 정보 조회

        관계형 필드로 사용자 정보를 한 번에 가져옵니다.
        """
        from .resolvers import resolve_manager_api_key_user

        return await resolve_manager_api_key_user(self.user_id, info)

    # 권한 및 스코프
    scopes: list[str] | None = strawberry.field(
        default=None, description="허용된 스코프 목록 (예: ['users:read', 'orders:write'])"
    )
    allowed_ips: list[str] | None = strawberry.field(
        default=None, description="허용된 IP 주소 목록 (화이트리스트)"
    )

    # 사용 제한 (Rate Limiting)
    rate_limit_per_minute: int = strawberry.field(description="분당 최대 요청 수")
    rate_limit_per_hour: int = strawberry.field(description="시간당 최대 요청 수")
    rate_limit_per_day: int = strawberry.field(description="일일 최대 요청 수")

    # 상태 및 만료
    status: str = strawberry.field(
        description="상태 (ACTIVE: 활성, INACTIVE: 비활성, REVOKED: 폐기됨)"
    )
    expires_at: datetime | None = strawberry.field(
        default=None, description="만료일시 (None이면 무기한)"
    )

    # 사용 통계
    last_used_at: datetime | None = strawberry.field(default=None, description="마지막 사용 일시")
    last_used_ip: str | None = strawberry.field(default=None, description="마지막 사용 IP 주소")
    usage_count: int = strawberry.field(description="총 사용 횟수 (API 호출 카운트)")

    # 시스템 필드
    created_at: datetime = strawberry.field(description="생성일시")
    updated_at: datetime | None = strawberry.field(default=None, description="수정일시")


@strawberry.input(description="Manager API 키 생성 입력")
class ManagerApiKeyCreateInput:
    """
    Manager API 키 생성 입력 타입

    새로운 API 키를 생성하기 위한 정보입니다.
    """

    key_name: str = strawberry.field(description="API 키 이름 (관리용, 예: 'Production Server')")
    user_id: UUID = strawberry.field(description="소유자 사용자 ID")
    tenant_context: UUID | None = None
    service_account: str | None = None
    scopes: list[str] | None = None
    allowed_ips: list[str] | None = None
    rate_limit_per_minute: int = 1000
    rate_limit_per_hour: int = 10000
    rate_limit_per_day: int = 100000
    expires_at: datetime | None = None


@strawberry.input(description="Manager API 키 수정 입력")
class ManagerApiKeyUpdateInput:
    """
    Manager API 키 수정 입력 타입

    기존 API 키의 설정을 변경합니다.
    모든 필드는 선택적이며, 제공된 필드만 업데이트됩니다.

    Note:
        key_id와 key_hash는 변경할 수 없습니다.
        키를 재발급하려면 기존 키를 폐기하고 새로 생성해야 합니다.
    """

    key_name: str | None = None
    scopes: list[str] | None = None
    allowed_ips: list[str] | None = None
    rate_limit_per_minute: int | None = None
    rate_limit_per_hour: int | None = None
    rate_limit_per_day: int | None = None
    status: str | None = None
    expires_at: datetime | None = None


@strawberry.type(description="Manager API 키 생성 응답")
class ManagerApiKeyCreateResponse:
    """
    Manager API 키 생성 응답

    API 키 생성 시 반환되는 응답입니다.
    full_api_key는 이 응답에서만 표시되며, 이후에는 조회할 수 없습니다.

    Important:
        full_api_key는 데이터베이스에 해시로 저장되므로,
        클라이언트는 이 응답에서 받은 키를 안전하게 보관해야 합니다.
        분실 시 키를 폐기하고 새로 발급받아야 합니다.
    """

    api_key: ManagerApiKey = strawberry.field(description="생성된 API 키 메타데이터")
    full_api_key: str = strawberry.field(
        description="전체 API 키 (예: 'cxg_mgr_abc123...') - 이 응답에서만 표시됨!"
    )
