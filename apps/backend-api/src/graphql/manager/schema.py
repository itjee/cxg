"""Manager 시스템 스키마"""

import strawberry

from .auth.mutations import ManagerAuthMutations
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
from .idam.user_roles import ManagerUserRole, ManagerUserRoleMutations, ManagerUserRoleQueries
from .idam.users import ManagerUser, ManagerUserMutations, ManagerUserQueries


# NOTE: ManagerRoleMutations, ManagerPermissionMutations, ManagerRolePermissionMutations, and UserRoleMutations
# were renamed to RoleMutations, PermissionMutations, RolePermissionMutations, and UserRoleMutations respectively


@strawberry.type(description="Manager 시스템 Query")
class ManagerQuery:
    """Manager 시스템 Query"""

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
    ) -> "list[ManagerUser]":
        return await ManagerUserQueries.users(self, info, limit, offset, user_type, status)

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
    ) -> "list[ManagerRole]":
        return await ManagerRoleQueries.roles(self, info, limit, offset, category, status)

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
        category: str | None = None,
        resource: str | None = None,
    ) -> "list[ManagerPermission]":
        return await ManagerPermissionQueries.permissions(
            self, info, limit, offset, category, resource
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
    """Manager 시스템 Mutation"""

    # ===== Auth =====
    # Authentication
    signin = ManagerAuthMutations.signin
    signup = ManagerAuthMutations.signup
    refresh_token = ManagerAuthMutations.refresh_token
    logout = ManagerAuthMutations.logout
    change_password = ManagerAuthMutations.change_password
    forgot_password = ManagerAuthMutations.forgot_password
    reset_password = ManagerAuthMutations.reset_password

    # ===== IDAM - Users =====
    create_user = ManagerUserMutations.create_user
    update_user = ManagerUserMutations.update_user

    # ===== IDAM - Roles =====
    create_role = ManagerRoleMutations.create_role
    update_role = ManagerRoleMutations.update_role

    # ===== IDAM - Permissions =====
    create_permission = ManagerPermissionMutations.create_permission
    update_permission = ManagerPermissionMutations.update_permission

    # ===== IDAM - Role Permissions =====
    assign_permission_to_role = ManagerRolePermissionMutations.assign_permission_to_role
    remove_permission_from_role = ManagerRolePermissionMutations.remove_permission_from_role
    bulk_assign_permissions_to_role = ManagerRolePermissionMutations.bulk_assign_permissions_to_role
    bulk_remove_permissions_from_role = (
        ManagerRolePermissionMutations.bulk_remove_permissions_from_role
    )

    # ===== IDAM - User Roles =====
    assign_role_to_user = ManagerUserRoleMutations.assign_role_to_user
    update_user_role = ManagerUserRoleMutations.update_user_role
    revoke_role_from_user = ManagerUserRoleMutations.revoke_role_from_user
    delete_user_role = ManagerUserRoleMutations.delete_user_role
    bulk_assign_roles_to_user = ManagerUserRoleMutations.bulk_assign_roles_to_user
    bulk_revoke_roles_from_user = ManagerUserRoleMutations.bulk_revoke_roles_from_user


__all__ = ["ManagerQuery", "ManagerMutation"]
