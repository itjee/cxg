"""Manager IDAM Role Permissions - GraphQL Types"""

from __future__ import annotations

from typing import TYPE_CHECKING

import strawberry

from src.graphql.common import Node


if TYPE_CHECKING:
    from datetime import datetime

    from ..permissions.types import ManagerPermission
    from ..roles.types import ManagerRole


@strawberry.type(description="Manager 역할-권한 매핑")
class ManagerRolePermission(Node):
    """
    Manager 역할-권한 매핑

    역할에 권한을 할당하는 관계 정의
    """

    id: strawberry.ID

    # 매핑 관계
    role_id: strawberry.ID = strawberry.field(description="역할 ID")
    permission_id: strawberry.ID = strawberry.field(description="권한 ID")

    # 권한 부여 정보
    granted_at: datetime | None = strawberry.field(default=None, description="권한 부여 시각")
    granted_by: strawberry.ID | None = strawberry.field(default=None, description="권한 부여자 ID")

    # 시스템 필드
    created_at: datetime = strawberry.field(description="생성일시")
    updated_at: datetime | None = strawberry.field(default=None, description="수정일시")

    @strawberry.field(description="역할 정보")
    async def role(self, info) -> ManagerRole | None:
        """
        역할 정보를 조회하는 필드 resolver

        RolePermission에 연결된 Role 객체를 조회합니다.
        """
        from uuid import UUID

        from .resolvers import resolve_role_permission_role

        # strawberry.ID를 UUID로 변환하여 resolver 호출
        return await resolve_role_permission_role(UUID(self.role_id), info)

    @strawberry.field(description="권한 정보")
    async def permission(self, info) -> ManagerPermission | None:
        """
        권한 정보를 조회하는 필드 resolver

        RolePermission에 연결된 Permission 객체를 조회합니다.
        """
        from uuid import UUID

        from .resolvers import resolve_role_permission_permission

        # strawberry.ID를 UUID로 변환하여 resolver 호출
        return await resolve_role_permission_permission(UUID(self.permission_id), info)


@strawberry.input(description="Manager 역할-권한 할당 입력")
class ManagerRolePermissionCreateInput:
    """Manager 역할에 권한 할당"""

    role_id: strawberry.ID = strawberry.field(description="역할 ID")
    permission_id: strawberry.ID = strawberry.field(description="권한 ID")


@strawberry.input(description="Manager 역할-권한 해제 입력")
class ManagerRolePermissionDeleteInput:
    """Manager 역할에서 권한 해제"""

    role_id: strawberry.ID = strawberry.field(description="역할 ID")
    permission_id: strawberry.ID = strawberry.field(description="권한 ID")
