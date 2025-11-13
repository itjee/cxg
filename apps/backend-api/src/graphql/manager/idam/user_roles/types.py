"""Manager IDAM User Roles - GraphQL Types"""

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

    사용자에게 역할을 할당하는 관계 정의
    """

    id: strawberry.ID

    # 매핑 관계
    user_id: strawberry.ID = strawberry.field(description="사용자 ID")
    role_id: strawberry.ID = strawberry.field(description="역할 ID")

    # 권한 컨텍스트
    scope: str = strawberry.field(description="범위 (GLOBAL, TENANT)")
    tenant_context: strawberry.ID | None = strawberry.field(
        default=None, description="테넌트 컨텍스트 ID"
    )

    # 역할 부여 정보
    granted_at: datetime | None = strawberry.field(default=None, description="역할 부여 시각")
    granted_by: strawberry.ID | None = strawberry.field(default=None, description="역할 부여자 ID")
    expires_at: datetime | None = strawberry.field(default=None, description="만료 시각")

    # 상태
    status: str = strawberry.field(description="상태 (ACTIVE, INACTIVE, EXPIRED)")

    # 시스템 필드
    created_at: datetime = strawberry.field(description="생성일시")
    updated_at: datetime | None = strawberry.field(default=None, description="수정일시")

    @strawberry.field(description="사용자 정보")
    async def user(self, info) -> ManagerUser | None:
        """사용자 정보"""
        from ..users.loaders import ManagerUserLoader
        from ..users.queries import user_to_graphql

        db = info.context.manager_db_session
        loader = ManagerUserLoader(db)
        user_model = await loader.load(str(self.user_id))
        return user_to_graphql(user_model) if user_model else None

    @strawberry.field(description="역할 정보")
    async def role(self, info) -> ManagerRole | None:
        """역할 정보"""
        from ..roles.loaders import ManagerRoleLoader
        from ..roles.queries import role_to_graphql

        db = info.context.manager_db_session
        loader = ManagerRoleLoader(db)
        role_model = await loader.load(str(self.role_id))
        return role_to_graphql(role_model) if role_model else None


@strawberry.input(description="Manager 사용자-역할 할당 입력")
class ManagerUserRoleCreateInput:
    """Manager 사용자에게 역할 할당"""

    user_id: strawberry.ID = strawberry.field(description="사용자 ID")
    role_id: strawberry.ID = strawberry.field(description="역할 ID")
    scope: str = strawberry.field(default="GLOBAL", description="범위 (GLOBAL, TENANT)")
    tenant_context: strawberry.ID | None = None
    expires_at: str | None = None  # ISO 8601 datetime string


@strawberry.input(description="Manager 사용자-역할 수정 입력")
class ManagerUserRoleUpdateInput:
    """Manager 사용자-역할 수정"""

    scope: str | None = None
    tenant_context: strawberry.ID | None = None
    expires_at: str | None = None  # ISO 8601 datetime string
    status: str | None = None


@strawberry.input(description="Manager 사용자-역할 해제 입력")
class ManagerUserRoleRevokeInput:
    """Manager 사용자에서 역할 해제"""

    user_id: strawberry.ID = strawberry.field(description="사용자 ID")
    role_id: strawberry.ID = strawberry.field(description="역할 ID")
