"""Manager IDAM Users - GraphQL Types"""

from datetime import datetime

import strawberry

from src.graphql.common import Node


@strawberry.type(description="Manager 사용자")
class ManagerUser(Node):
    """
    Manager 시스템 사용자

    Manager 앱에서 플랫폼을 관리하는 관리자 계정
    """

    id: strawberry.ID

    # 기본 정보
    user_type: str = strawberry.field(description="사용자 타입 (MASTER, TENANT, SYSTEM)")
    full_name: str = strawberry.field(description="전체 이름")
    email: str = strawberry.field(description="이메일")
    phone: str | None = strawberry.field(default=None, description="전화번호")

    # 인증 정보
    username: str = strawberry.field(description="사용자명")

    # SSO 정보
    sso_provider: str | None = strawberry.field(default=None, description="SSO 제공자")
    sso_subject: str | None = strawberry.field(default=None, description="SSO Subject")

    # MFA 설정
    mfa_enabled: bool = strawberry.field(description="MFA 활성화 여부")

    # 계정 상태
    status: str = strawberry.field(description="상태 (ACTIVE, INACTIVE, LOCKED, SUSPENDED)")

    # 보안 정보
    last_login_at: datetime | None = strawberry.field(
        default=None, description="마지막 로그인 시간"
    )
    last_login_ip: str | None = strawberry.field(default=None, description="마지막 로그인 IP")
    failed_login_attempts: int = strawberry.field(description="로그인 실패 횟수")
    force_password_change: bool = strawberry.field(description="비밀번호 변경 강제 여부")

    # 메타데이터
    timezone: str = strawberry.field(default="UTC", description="타임존")
    locale: str = strawberry.field(default="ko-KR", description="로케일")
    department: str | None = strawberry.field(default=None, description="부서")
    position: str | None = strawberry.field(default=None, description="직급")

    # 시스템 필드
    created_at: datetime = strawberry.field(description="생성일시")
    updated_at: datetime | None = strawberry.field(default=None, description="수정일시")

    @strawberry.field(description="사용자 역할 목록")
    async def roles(self, info) -> list["ManagerRole"]:
        """사용자에게 할당된 역할 목록"""
        # TODO: DataLoader로 구현
        return []


@strawberry.input(description="Manager 사용자 생성 입력")
class ManagerUserCreateInput:
    """Manager 사용자 생성"""

    user_type: str = strawberry.field(description="사용자 타입")
    full_name: str = strawberry.field(description="전체 이름")
    email: str = strawberry.field(description="이메일")
    username: str = strawberry.field(description="사용자명")
    password: str = strawberry.field(description="비밀번호")
    phone: str | None = None
    department: str | None = None
    position: str | None = None


@strawberry.input(description="Manager 사용자 수정 입력")
class ManagerUserUpdateInput:
    """Manager 사용자 수정"""

    full_name: str | None = None
    email: str | None = None
    phone: str | None = None
    department: str | None = None
    position: str | None = None
    status: str | None = None
    mfa_enabled: bool | None = None


@strawberry.type(description="Manager Role")
class ManagerRole:
    """Manager 역할 (placeholder)"""

    id: strawberry.ID
    code: str
    name: str
