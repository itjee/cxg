"""Manager IDAM Roles - GraphQL Types

역할(Role) 관련 GraphQL 타입 정의
"""

from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

import strawberry

from src.graphql.common import Node


if TYPE_CHECKING:
    from ..permissions.types import ManagerPermission


@strawberry.type(description="Manager 역할")
class ManagerRole(Node):
    """
    Manager 시스템 역할

    플랫폼 관리자 및 테넌트 관리자 역할 정의.
    역할은 여러 권한(Permission)을 그룹화하여 사용자에게 할당됩니다.
    """

    id: strawberry.ID

    # 역할 기본 정보
    code: str = strawberry.field(description="역할 코드 (예: MANAGER_ADMIN, TENANT_USER)")
    name: str = strawberry.field(description="역할 이름")
    description: str | None = strawberry.field(default=None, description="역할 설명")

    # 역할 속성
    category: str = strawberry.field(
        description="역할 카테고리 (MANAGER_ADMIN, PLATFORM_SUPPORT, TENANT_ADMIN, TENANT_USER)"
    )
    level: int = strawberry.field(description="역할 레벨 (1-200, 숫자가 작을수록 높은 권한)")
    scope: str = strawberry.field(description="범위 (GLOBAL: 전역, TENANT: 테넌트 한정)")
    is_default: bool = strawberry.field(description="기본 역할 여부 (신규 사용자 자동 할당)")
    priority: int = strawberry.field(description="우선순위 (정렬 및 표시 순서)")

    # 상태
    status: str = strawberry.field(description="상태 (ACTIVE: 활성, INACTIVE: 비활성)")

    # 시스템 필드
    created_at: datetime = strawberry.field(description="생성일시")
    updated_at: datetime | None = strawberry.field(default=None, description="수정일시")

    @strawberry.field(description="역할에 할당된 권한 목록")
    async def permissions(self, info) -> list["ManagerPermission"]:
        """
        역할에 할당된 권한 목록을 조회하는 필드 resolver

        Role과 Permission은 Many-to-Many 관계로,
        RolePermission 중간 테이블을 통해 연결됩니다.
        """
        from .resolvers import resolve_role_permissions

        # strawberry.ID를 UUID로 변환하여 resolver 호출
        return await resolve_role_permissions(UUID(self.id), info)


@strawberry.input(description="Manager 역할 생성 입력")
class ManagerRoleCreateInput:
    """
    Manager 역할 생성 입력 타입

    새로운 역할을 생성할 때 필요한 필드들을 정의합니다.
    """

    code: str = strawberry.field(description="역할 코드 (유일해야 함)")
    name: str = strawberry.field(description="역할 이름")
    description: str | None = None
    category: str = strawberry.field(description="역할 카테고리")
    level: int = strawberry.field(description="역할 레벨")
    scope: str = strawberry.field(description="범위")
    is_default: bool = False
    priority: int = 100


@strawberry.input(description="Manager 역할 수정 입력")
class ManagerRoleUpdateInput:
    """
    Manager 역할 수정 입력 타입

    기존 역할의 정보를 수정할 때 사용합니다.
    모든 필드는 선택적이며, 제공된 필드만 업데이트됩니다.
    """

    name: str | None = None
    description: str | None = None
    level: int | None = None
    is_default: bool | None = None
    priority: int | None = None
    status: str | None = None
