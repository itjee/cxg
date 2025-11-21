"""Manager IDAM Users - GraphQL Types

사용자(User) 관련 GraphQL 타입 정의
"""

from datetime import datetime

import strawberry

from src.graphql.common import Node


@strawberry.type(name="ManagerUser", description="Manager 사용자")
class ManagerUser(Node):
    """
    Manager 시스템 사용자

    Manager 앱에서 플랫폼을 관리하는 관리자 계정입니다.
    사용자는 역할(Role)을 통해 권한(Permission)을 부여받고,
    세션(Session)을 통해 시스템에 인증됩니다.
    """

    id: strawberry.ID

    # 기본 정보
    user_type: str = strawberry.field(
        description="사용자 타입 (MASTER: 최고관리자, TENANT: 테넌트 관리자, SYSTEM: 시스템 사용자)"
    )
    full_name: str = strawberry.field(description="전체 이름")
    email: str = strawberry.field(description="이메일 주소")
    phone: str | None = strawberry.field(default=None, description="전화번호")

    # 인증 정보
    username: str = strawberry.field(description="사용자명 (로그인 ID)")

    # SSO 정보
    sso_provider: str | None = strawberry.field(
        default=None, description="SSO 제공자 (예: google, azure)"
    )
    sso_subject: str | None = strawberry.field(
        default=None, description="SSO Subject (외부 인증 시스템의 사용자 식별자)"
    )

    # MFA 설정
    mfa_enabled: bool = strawberry.field(description="MFA(다중 인증) 활성화 여부")

    # 계정 상태
    status: str = strawberry.field(
        description="계정 상태 (ACTIVE: 활성, INACTIVE: 비활성, LOCKED: 잠김, SUSPENDED: 정지됨)"
    )

    # 보안 정보
    last_login_at: datetime | None = strawberry.field(
        default=None, description="마지막 로그인 일시"
    )
    last_login_ip: str | None = strawberry.field(default=None, description="마지막 로그인 IP 주소")
    failed_login_attempts: int = strawberry.field(description="연속 로그인 실패 횟수")
    locked_until: datetime | None = strawberry.field(
        default=None, description="계정 잠금 해제 예정 일시"
    )
    force_password_change: bool = strawberry.field(description="비밀번호 변경 강제 여부")

    # 메타데이터
    timezone: str = strawberry.field(default="UTC", description="사용자 타임존")
    locale: str = strawberry.field(default="ko-KR", description="사용자 로케일 (언어 설정)")
    department: str | None = strawberry.field(default=None, description="소속 부서")
    position: str | None = strawberry.field(default=None, description="직급/직책")

    # 시스템 필드
    created_at: datetime = strawberry.field(description="생성일시")
    updated_at: datetime | None = strawberry.field(default=None, description="수정일시")

    # NOTE: Field resolvers commented out due to circular import issues with Strawberry
    # These will be re-enabled after resolving the circular dependency structure
    # @strawberry.field(description="사용자에게 할당된 역할 목록")
    # async def roles(self, info) -> list["ManagerRole"]:
    #     """사용자에게 할당된 역할 목록을 조회하는 필드 resolver"""
    #     from uuid import UUID
    #     from .resolvers import resolve_user_roles
    #     return await resolve_user_roles(UUID(self.id), info)

    # @strawberry.field(description="사용자의 세션 목록")
    # async def sessions(
    #     self, info, status: str | None = None, limit: int = 10
    # ) -> list["ManagerSession"]:
    #     """사용자의 세션 목록을 조회하는 필드 resolver"""
    #     from uuid import UUID
    #     from .resolvers import resolve_user_sessions
    #     return await resolve_user_sessions(UUID(self.id), info, status)

    # @strawberry.field(description="사용자의 유효 권한 목록")
    # async def permissions(self, info) -> list["ManagerPermission"]:
    #     """사용자의 유효 권한 목록을 조회하는 필드 resolver"""
    #     from uuid import UUID
    #     from .resolvers import resolve_user_permissions
    #     return await resolve_user_permissions(UUID(self.id), info)


@strawberry.input(description="Manager 사용자 생성 입력")
class ManagerUserCreateInput:
    """
    Manager 사용자 생성

    새로운 Manager 시스템 사용자를 생성할 때 필요한 입력 데이터입니다.
    """

    user_type: str = strawberry.field(description="사용자 타입 (MASTER, TENANT, SYSTEM)")
    full_name: str = strawberry.field(description="전체 이름")
    email: str = strawberry.field(description="이메일 주소 (고유해야 함)")
    username: str = strawberry.field(description="사용자명 (고유해야 함)")
    password: str = strawberry.field(description="비밀번호 (평문, 저장 시 자동 해싱)")
    phone: str | None = None
    department: str | None = None
    position: str | None = None


@strawberry.input(description="Manager 사용자 수정 입력")
class ManagerUserUpdateInput:
    """
    Manager 사용자 수정

    기존 사용자의 정보를 수정할 때 사용합니다.
    모든 필드는 선택적이며, 제공된 필드만 업데이트됩니다.
    비밀번호는 별도의 Mutation을 통해 변경해야 합니다.
    """

    user_type: str | None = None
    full_name: str | None = None
    email: str | None = None
    phone: str | None = None
    department: str | None = None
    position: str | None = None
    status: str | None = None
    mfa_enabled: bool | None = None
