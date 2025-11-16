"""Tenants SYS Users - GraphQL Types"""

from datetime import datetime
from typing import Optional

import strawberry

from src.graphql.common import Node


@strawberry.type(name="TenantsUser", description="Tenant 사용자")
class TenantsUser(Node):
    """
    Tenant 시스템 사용자

    각 테넌트 내의 사용자 계정
    """

    id: strawberry.ID

    # 기본 정보
    user_code: str = strawberry.field(description="사용자 코드")
    username: str = strawberry.field(description="사용자명")
    email: str = strawberry.field(description="이메일")
    first_name: str | None = strawberry.field(default=None, description="이름")
    last_name: str | None = strawberry.field(default=None, description="성")
    phone: str | None = strawberry.field(default=None, description="전화번호")

    # 조직 정보
    department_id: strawberry.ID | None = strawberry.field(default=None, description="부서 ID")
    position: str | None = strawberry.field(default=None, description="직급/직책")
    role_id: strawberry.ID | None = strawberry.field(default=None, description="역할 ID")

    # 보안 정보
    failed_login_attempts: int = strawberry.field(description="로그인 실패 횟수")
    locked_until: datetime | None = strawberry.field(default=None, description="잠금 해제 시간")
    last_login_at: datetime | None = strawberry.field(
        default=None, description="마지막 로그인 시간"
    )
    last_login_ip: str | None = strawberry.field(default=None, description="마지막 로그인 IP")

    # 상태
    is_system_user: bool = strawberry.field(description="시스템 사용자 여부")
    is_active: bool = strawberry.field(description="활성 상태")
    is_deleted: bool = strawberry.field(description="삭제 여부")

    # 시스템 필드
    created_at: datetime = strawberry.field(description="생성일시")
    updated_at: datetime | None = strawberry.field(default=None, description="수정일시")
    created_by: strawberry.ID | None = strawberry.field(default=None, description="생성자 ID")
    updated_by: strawberry.ID | None = strawberry.field(default=None, description="수정자 ID")

    @strawberry.field(description="부서 정보")
    async def department(self, info) -> Optional["TenantsDepartment"]:
        """부서 정보"""
        if not self.department_id:
            return None
        # TODO: DataLoader로 구현
        return None

    @strawberry.field(description="역할 정보")
    async def role(self, info) -> Optional["TenantsRole"]:
        """역할 정보"""
        if not self.role_id:
            return None
        # TODO: DataLoader로 구현
        return None


@strawberry.input(description="Tenant 사용자 생성 입력")
class TenantsUserCreateInput:
    """Tenant 사용자 생성"""

    user_code: str = strawberry.field(description="사용자 코드")
    username: str = strawberry.field(description="사용자명")
    email: str = strawberry.field(description="이메일")
    password: str = strawberry.field(description="비밀번호")
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    department_id: strawberry.ID | None = None
    position: str | None = None
    role_id: strawberry.ID | None = None


@strawberry.input(description="Tenant 사용자 수정 입력")
class TenantsUserUpdateInput:
    """Tenant 사용자 수정"""

    email: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    department_id: strawberry.ID | None = None
    position: str | None = None
    role_id: strawberry.ID | None = None
    is_active: bool | None = None


@strawberry.type(description="Tenant Department (placeholder)")
class TenantsDepartment:
    """Tenant 부서"""

    id: strawberry.ID
    name: str


@strawberry.type(description="Tenant Role (placeholder)")
class TenantsRole:
    """Tenant 역할"""

    id: strawberry.ID
    name: str
