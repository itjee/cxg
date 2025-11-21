"""Manager 시스템 스키마"""

import strawberry

from .auth.mutations import ManagerAuthMutations
from .auth.queries import ManagerAuthQueries
from .auth.types import ManagerAuthUser
from .dashboard import Activity, DashboardQueries, DashboardStats, TenantGrowthData
from .idam.permissions import (
    ManagerPermission,
    ManagerPermissionMutations,
    ManagerPermissionQueries,
)
from .idam.role_permissions import (
    ManagerRolePermission,
    ManagerRolePermissionMutations,
    ManagerRolePermissionQueries,
)
from .idam.roles import ManagerRole, ManagerRoleMutations, ManagerRoleQueries
from .idam.sessions import ManagerSession, ManagerSessionMutations, ManagerSessionQueries
from .idam.user_roles import ManagerUserRole, ManagerUserRoleMutations, ManagerUserRoleQueries
from .idam.users import ManagerUser, ManagerUserMutations, ManagerUserQueries


# NOTE: ManagerRoleMutations, ManagerPermissionMutations, ManagerRolePermissionMutations, and UserRoleMutations
# were renamed to RoleMutations, PermissionMutations, RolePermissionMutations, and UserRoleMutations respectively


@strawberry.type(description="Manager 시스템 Query")
class ManagerQuery:
    """Manager 시스템 Query"""

    # Auth
    @strawberry.field(description="현재 로그인한 사용자 정보 조회")
    async def me(self, info) -> "ManagerAuthUser | None":
        """현재 로그인한 사용자 정보를 조회합니다."""
        return await ManagerAuthQueries().me(info)

    # Dashboard
    @strawberry.field(description="Dashboard 통계 데이터")
    async def dashboard(self, info) -> DashboardStats:
        return await DashboardQueries.dashboard(self, info)

    @strawberry.field(description="테넌트 성장 데이터")
    async def tenant_growth(self, info, period: str = "month") -> list[TenantGrowthData]:
        return await DashboardQueries.tenant_growth(self, info, period)

    @strawberry.field(description="활동 로그")
    async def activities(
        self, info, limit: int = 10, order_by: str = "createdAt"
    ) -> list[Activity]:
        return await DashboardQueries.activities(self, info, limit, order_by)

    # IDAM - Users
    @strawberry.field(description="사용자 조회 (ID)")
    async def user(self, info, id: strawberry.ID) -> "ManagerUser | None":
        return await ManagerUserQueries.user(self, info, id)

    @strawberry.field(description="사용자 목록 조회")
    async def users(
        self,
        info,
        limit: int = 20,
        offset: int = 0,
        user_type: str | None = None,
        status: str | None = None,
        search: str | None = None,
    ) -> "list[ManagerUser]":
        return await ManagerUserQueries.users(self, info, limit, offset, user_type, status, search)

    # IDAM - Sessions
    @strawberry.field(description="세션 조회 (ID)")
    async def session(self, info, id: strawberry.ID) -> "ManagerSession | None":
        return await ManagerSessionQueries.session(self, info, id)

    @strawberry.field(description="세션 목록 조회")
    async def sessions(
        self,
        info,
        limit: int = 20,
        offset: int = 0,
        user_id: strawberry.ID | None = None,
        status: str | None = None,
    ) -> "list[ManagerSession]":
        return await ManagerSessionQueries.sessions(self, info, limit, offset, user_id, status)

    # IDAM - Roles
    @strawberry.field(description="역할 조회 (ID)")
    async def role(self, info, id: strawberry.ID) -> "ManagerRole | None":
        return await ManagerRoleQueries.role(self, info, id)

    @strawberry.field(description="역할 목록 조회")
    async def roles(
        self,
        info,
        limit: int = 20,
        offset: int = 0,
        category: str | None = None,
        status: str | None = None,
        search: str | None = None,
    ) -> "list[ManagerRole]":
        return await ManagerRoleQueries.roles(self, info, limit, offset, category, status, search)

    # IDAM - Permissions
    @strawberry.field(description="권한 조회 (ID)")
    async def permission(self, info, id: strawberry.ID) -> "ManagerPermission | None":
        return await ManagerPermissionQueries.permission(self, info, id)

    @strawberry.field(description="권한 목록 조회")
    async def permissions(
        self,
        info,
        limit: int = 20,
        offset: int = 0,
        search: str | None = None,
        category: str | None = None,
        resource: str | None = None,
        action: str | None = None,
        scope: str | None = None,
        status: str | None = None,
        is_system: bool | None = None,
    ) -> "list[ManagerPermission]":
        return await ManagerPermissionQueries.permissions(
            self, info, limit, offset, search, category, resource, action, scope, status, is_system
        )

    # IDAM - Role Permissions
    @strawberry.field(description="역할-권한 조회 (ID)")
    async def role_permission(self, info, id: strawberry.ID) -> "ManagerRolePermission | None":
        return await ManagerRolePermissionQueries.role_permission(self, info, id)

    @strawberry.field(description="역할-권한 목록 조회")
    async def role_permissions(
        self, info, limit: int = 20, offset: int = 0
    ) -> "list[ManagerRolePermission]":
        return await ManagerRolePermissionQueries.role_permissions(self, info, limit, offset)

    @strawberry.field(description="역할별 권한 목록")
    async def permissions_by_role(self, info, role_id: strawberry.ID) -> "list[ManagerPermission]":
        return await ManagerRolePermissionQueries.permissions_by_role(self, info, role_id)

    @strawberry.field(description="권한별 역할 목록")
    async def roles_by_permission(self, info, permission_id: strawberry.ID) -> "list[ManagerRole]":
        return await ManagerRolePermissionQueries.roles_by_permission(self, info, permission_id)

    # IDAM - User Roles
    @strawberry.field(description="사용자-역할 조회 (ID)")
    async def user_role(self, info, id: strawberry.ID) -> "ManagerUserRole | None":
        return await ManagerUserRoleQueries.user_role(self, info, id)

    @strawberry.field(description="사용자-역할 목록 조회")
    async def user_roles(self, info, limit: int = 20, offset: int = 0) -> "list[ManagerUserRole]":
        return await ManagerUserRoleQueries.user_roles(self, info, limit, offset)

    @strawberry.field(description="사용자별 역할 목록")
    async def roles_by_user(self, info, user_id: strawberry.ID) -> "list[ManagerRole]":
        return await ManagerUserRoleQueries.roles_by_user(self, info, user_id)

    @strawberry.field(description="역할별 사용자 목록")
    async def users_by_role(self, info, role_id: strawberry.ID) -> "list[ManagerUser]":
        return await ManagerUserRoleQueries.users_by_role(self, info, role_id)


@strawberry.type(description="Manager 시스템 Mutation")
class ManagerMutation:
    """Manager 시스템 Mutation

    Manager 시스템의 모든 Mutation을 통합하여 제공합니다.
    각 모듈의 Mutation 클래스를 네임스페이스로 노출합니다.
    """

    @strawberry.field(description="인증 관련 Mutation")
    def auth(self) -> ManagerAuthMutations:
        """인증 관련 Mutation (회원가입, 로그인, 토큰 갱신 등)"""
        return ManagerAuthMutations()

    @strawberry.field(description="사용자 관련 Mutation")
    def users(self) -> ManagerUserMutations:
        """사용자 관련 Mutation (생성, 수정 등)"""
        return ManagerUserMutations()

    @strawberry.field(description="세션 관련 Mutation")
    def sessions(self) -> ManagerSessionMutations:
        """세션 관련 Mutation (수정, 폐기 등)"""
        return ManagerSessionMutations()

    @strawberry.field(description="역할 관련 Mutation")
    def roles(self) -> ManagerRoleMutations:
        """역할 관련 Mutation (생성, 수정 등)"""
        return ManagerRoleMutations()

    @strawberry.field(description="권한 관련 Mutation")
    def permissions(self) -> ManagerPermissionMutations:
        """권한 관련 Mutation (생성, 수정 등)"""
        return ManagerPermissionMutations()

    @strawberry.field(description="역할-권한 관련 Mutation")
    def role_permissions(self) -> ManagerRolePermissionMutations:
        """역할-권한 관련 Mutation (할당, 제거 등)"""
        return ManagerRolePermissionMutations()

    @strawberry.field(description="사용자-역할 관련 Mutation")
    def user_roles(self) -> ManagerUserRoleMutations:
        """사용자-역할 관련 Mutation (할당, 제거 등)"""
        return ManagerUserRoleMutations()


__all__ = ["ManagerQuery", "ManagerMutation"]
