"""Manager IDAM Login Logs - GraphQL Types

Manager 시스템 로그인 이력 관련 GraphQL 타입 정의
로그인/로그아웃 시도 기록, 보안 감사, 이상 행위 탐지를 위한 타입들을 정의합니다.
"""

from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

import strawberry

from src.graphql.common import Node

# Import at module level for Strawberry to resolve type hints
# These need to be available in globals() for get_type_hints() to work
from ..users.types import ManagerUser

if TYPE_CHECKING:
    pass


@strawberry.type(description="Manager 로그인 이력")
class ManagerLoginLog(Node):
    """
    Manager 시스템 로그인 이력

    모든 로그인 시도(성공/실패)를 기록하여 보안 감사 및 이상 행위 탐지에 활용합니다.

    주요 활용:
        - 보안 감사(Security Audit): 누가, 언제, 어디서 로그인했는지 추적
        - 이상 탐지: 비정상적인 로그인 패턴 감지 (예: 짧은 시간 내 여러 실패)
        - 사용자 활동 추적: 마지막 로그인 시간, 접속 위치 등
        - 규정 준수: GDPR, ISO27001 등의 로그 보관 요구사항 충족
    """

    id: strawberry.ID

    # 사용자 정보
    user_id: UUID | None = strawberry.field(default=None, description="사용자 ID (로그인 성공 시)")
    user_type: str | None = strawberry.field(
        default=None, description="사용자 타입 (MASTER, TENANT, SYSTEM)"
    )
    tenant_context: UUID | None = strawberry.field(
        default=None, description="테넌트 컨텍스트 (멀티테넌트 환경)"
    )
    username: str | None = strawberry.field(
        default=None, description="시도한 사용자명 (실패 시에도 기록)"
    )

    @strawberry.field(description="로그인 사용자")
    async def user(self, info) -> "ManagerUser | None":
        """
        로그인 이력 사용자 정보 조회

        성공한 로그인의 경우 사용자 정보를 조회할 수 있습니다.
        실패한 로그인이나 존재하지 않는 사용자의 경우 None을 반환합니다.
        """
        from .resolvers import resolve_manager_login_log_user

        return await resolve_manager_login_log_user(self.user_id, info)

    # 로그인 시도 정보
    attempt_type: str = strawberry.field(
        description="시도 타입 (LOGIN: 로그인, LOGOUT: 로그아웃, FAILED_LOGIN: 로그인 실패, "
        "LOCKED: 계정 잠김, PASSWORD_RESET: 비밀번호 재설정)"
    )
    success: bool = strawberry.field(description="성공 여부 (True: 성공, False: 실패)")
    failure_reason: str | None = strawberry.field(
        default=None,
        description="실패 사유 (USER_NOT_FOUND: 사용자 없음, INVALID_PASSWORD: 비밀번호 불일치, "
        "ACCOUNT_LOCKED: 계정 잠김, INACTIVE_ACCOUNT: 비활성 계정)",
    )

    # 세션 및 접속 정보
    session_id: str | None = strawberry.field(
        default=None, description="세션 ID (로그인 성공 시 생성)"
    )
    ip_address: str = strawberry.field(description="접속 IP 주소")
    user_agent: str | None = strawberry.field(
        default=None, description="User Agent (브라우저 및 OS 정보)"
    )
    country_code: str | None = strawberry.field(
        default=None, description="접속 국가 코드 (예: KR, US)"
    )
    city: str | None = strawberry.field(default=None, description="접속 도시 (GeoIP 기반)")

    # MFA (Multi-Factor Authentication) 정보
    mfa_used: bool = strawberry.field(description="MFA 사용 여부")
    mfa_method: str | None = strawberry.field(
        default=None, description="MFA 방법 (TOTP: OTP 앱, SMS: SMS 인증, EMAIL: 이메일 인증)"
    )

    # 시스템 필드
    created_at: datetime = strawberry.field(description="기록 생성일시 (로그인 시도 시각)")


@strawberry.type(description="Manager 로그인 이력 목록 응답")
class ManagerLoginLogsConnection:
    """
    Manager 로그인 이력 목록과 전체 개수를 포함하는 응답 타입

    페이지네이션을 위해 현재 페이지의 데이터와 전체 개수를 함께 반환합니다.
    """

    items: list[ManagerLoginLog] = strawberry.field(description="로그인 이력 목록")
    total: int = strawberry.field(description="전체 로그인 이력 개수 (필터 조건 기반)")


@strawberry.input(description="Manager 로그인 이력 생성 입력")
class ManagerLoginLogCreateInput:
    """
    Manager 로그인 이력 생성 입력 타입

    로그인 시도를 기록하기 위한 입력 데이터입니다.
    일반적으로 시스템이 자동으로 생성하며, 수동 생성은 드뭅니다.

    Note:
        이 입력 타입은 주로 인증 미들웨어나 로그인 핸들러에서 사용됩니다.
        GraphQL Mutation으로 직접 호출하는 경우는 거의 없습니다.
    """

    user_id: UUID | None = None
    user_type: str | None = None
    tenant_context: UUID | None = None
    username: str | None = None
    attempt_type: str = strawberry.field(description="시도 타입")
    success: bool = strawberry.field(description="성공 여부")
    failure_reason: str | None = None
    session_id: str | None = None
    ip_address: str = strawberry.field(description="IP 주소")
    user_agent: str | None = None
    country_code: str | None = None
    city: str | None = None
    mfa_used: bool = False
    mfa_method: str | None = None
