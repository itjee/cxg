"""Manager IDAM User Roles - GraphQL Types

사용자-역할 매핑(User-Role Mapping) 관련 GraphQL 타입 정의
"""

from __future__ import annotations

from typing import TYPE_CHECKING

import strawberry

from src.graphql.common import Node


if TYPE_CHECKING:
    from datetime import datetime

    from ..roles.types import ManagerRole
    from ..users.types import ManagerUser


@strawberry.type(description="Manager 사용자-역할 매핑")
class ManagerUserRole(Node):
    """
    Manager 사용자-역할 매핑

    사용자에게 역할을 할당하는 Many-to-Many 관계를 정의합니다.
    각 매핑은 특정 범위(GLOBAL/TENANT)와 컨텍스트에서 유효하며,
    만료일과 상태를 관리할 수 있습니다.
    """

    id: strawberry.ID

    # 매핑 관계
    user_id: strawberry.ID = strawberry.field(description="사용자 ID")
    role_id: strawberry.ID = strawberry.field(description="역할 ID")

    # 권한 컨텍스트
    scope: str = strawberry.field(description="권한 범위 (GLOBAL: 전역, TENANT: 테넌트 한정)")
    tenant_context: strawberry.ID | None = strawberry.field(
        default=None, description="테넌트 컨텍스트 ID (TENANT scope인 경우)"
    )

    # 역할 부여 정보
    granted_at: datetime | None = strawberry.field(default=None, description="역할 부여 일시")
    granted_by: strawberry.ID | None = strawberry.field(
        default=None, description="역할 부여자 ID (관리자)"
    )
    expires_at: datetime | None = strawberry.field(
        default=None, description="만료 일시 (임시 역할인 경우)"
    )

    # 상태
    status: str = strawberry.field(
        description="상태 (ACTIVE: 활성, INACTIVE: 비활성, EXPIRED: 만료됨)"
    )

    # 시스템 필드
    created_at: datetime = strawberry.field(description="생성일시")
    updated_at: datetime | None = strawberry.field(default=None, description="수정일시")

    @strawberry.field(description="사용자 정보")
    async def user(self, info) -> ManagerUser | None:
        """
        매핑된 사용자 정보를 조회하는 필드 resolver

        UserRole과 User는 Many-to-One 관계입니다.
        """
        from uuid import UUID

        from .resolvers import resolve_user_role_user

        return await resolve_user_role_user(UUID(self.user_id), info)

    @strawberry.field(description="역할 정보")
    async def role(self, info) -> ManagerRole | None:
        """
        매핑된 역할 정보를 조회하는 필드 resolver

        UserRole과 Role는 Many-to-One 관계입니다.
        """
        from uuid import UUID

        from .resolvers import resolve_user_role_role

        return await resolve_user_role_role(UUID(self.role_id), info)

    @strawberry.field(description="역할 부여자 정보")
    async def granter(self, info) -> ManagerUser | None:
        """
        역할을 부여한 관리자 정보를 조회하는 필드 resolver

        granted_by도 User를 참조합니다.
        """
        if not self.granted_by:
            return None

        from uuid import UUID

        from .resolvers import resolve_granted_by_user

        return await resolve_granted_by_user(UUID(self.granted_by), info)


@strawberry.input(description="Manager 사용자-역할 할당 입력")
class ManagerUserRoleCreateInput:
    """
    Manager 사용자에게 역할 할당

    새로운 사용자-역할 매핑을 생성할 때 필요한 입력 데이터입니다.
    """

    user_id: strawberry.ID = strawberry.field(description="사용자 ID")
    role_id: strawberry.ID = strawberry.field(description="역할 ID")
    scope: str = strawberry.field(default="GLOBAL", description="권한 범위 (GLOBAL, TENANT)")
    tenant_context: strawberry.ID | None = None
    expires_at: str | None = None  # ISO 8601 datetime string


@strawberry.input(description="Manager 사용자-역할 수정 입력")
class ManagerUserRoleUpdateInput:
    """
    Manager 사용자-역할 매핑 수정

    기존 매핑의 속성을 수정할 때 사용합니다.
    모든 필드는 선택적이며, 제공된 필드만 업데이트됩니다.
    """

    scope: str | None = None
    tenant_context: strawberry.ID | None = None
    expires_at: str | None = None  # ISO 8601 datetime string
    status: str | None = None


@strawberry.input(description="Manager 사용자-역할 해제 입력")
class ManagerUserRoleRevokeInput:
    """
    Manager 사용자에서 역할 해제

    사용자-역할 매핑을 해제하거나 삭제할 때 사용하는 입력 데이터입니다.
    """

    user_id: strawberry.ID = strawberry.field(description="사용자 ID")
    role_id: strawberry.ID = strawberry.field(description="역할 ID")
