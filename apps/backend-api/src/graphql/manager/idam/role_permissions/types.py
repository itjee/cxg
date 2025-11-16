"""Manager IDAM Role Permissions - GraphQL Types

역할-권한 매핑을 위한 GraphQL 타입 정의

타입 구조:
- ManagerRolePermission: 역할-권한 매핑 객체 타입
- ManagerRolePermissionCreateInput: 권한 할당 입력 타입
- ManagerRolePermissionDeleteInput: 권한 해제 입력 타입
"""

from __future__ import annotations

from typing import TYPE_CHECKING

import strawberry

from src.graphql.common import Node


if TYPE_CHECKING:
    from datetime import datetime

    from ..permissions.types import ManagerPermission
    from ..roles.types import ManagerRole


@strawberry.type(name="ManagerRolePermission", description="Manager 역할-권한 매핑")
class ManagerRolePermission(Node):
    """Manager 역할-권한 매핑

    역할(Role)과 권한(Permission)의 다대다 관계를 표현하는 중간 테이블입니다.

    주요 필드:
    - role_id, permission_id: 매핑 관계를 나타내는 외래 키
    - granted_at, granted_by: 권한 부여 메타데이터
    - role, permission: 실제 역할/권한 객체를 조회하는 필드 resolver
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
    async def role(self, info) -> "ManagerRole | None":
        """역할 정보를 조회하는 필드 resolver

        매핑된 역할의 상세 정보를 조회합니다.
        DataLoader를 사용하여 N+1 쿼리 문제를 방지합니다.

        Returns:
            ManagerRole 객체 또는 None
        """
        from uuid import UUID

        from .resolvers import resolve_manager_role_permission_role

        # strawberry.ID를 UUID로 변환하여 resolver 호출
        return await resolve_manager_role_permission_role(UUID(self.role_id), info)

    @strawberry.field(description="권한 정보")
    async def permission(self, info) -> "ManagerPermission | None":
        """권한 정보를 조회하는 필드 resolver

        매핑된 권한의 상세 정보를 조회합니다.
        DataLoader를 사용하여 N+1 쿼리 문제를 방지합니다.

        Returns:
            ManagerPermission 객체 또는 None
        """
        from uuid import UUID

        from .resolvers import resolve_manager_role_permission_permission

        # strawberry.ID를 UUID로 변환하여 resolver 호출
        return await resolve_manager_role_permission_permission(UUID(self.permission_id), info)


@strawberry.input(description="Manager 역할-권한 할당 입력")
class ManagerRolePermissionCreateInput:
    """Manager 역할에 권한 할당

    새로운 역할-권한 매핑을 생성할 때 사용하는 입력 타입입니다.
    """

    role_id: strawberry.ID = strawberry.field(description="역할 ID")
    permission_id: strawberry.ID = strawberry.field(description="권한 ID")


@strawberry.input(description="Manager 역할-권한 해제 입력")
class ManagerRolePermissionDeleteInput:
    """Manager 역할에서 권한 해제

    기존 역할-권한 매핑을 삭제할 때 사용하는 입력 타입입니다.
    """

    role_id: strawberry.ID = strawberry.field(description="역할 ID")
    permission_id: strawberry.ID = strawberry.field(description="권한 ID")
