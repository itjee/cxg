"""Manager 시스템 스키마"""

import strawberry

from .auth.mutations import ManagerAuthMutations
from .dashboard import DashboardQueries
from .idam.permissions import PermissionMutations, PermissionQueries
from .idam.role_permissions import (
    RolePermissionMutations,
    RolePermissionQueries,
)
from .idam.roles import RoleMutations, RoleQueries
from .idam.user_roles import UserRoleMutations, UserRoleQueries
from .idam.users import UserMutations, UserQueries


# NOTE: ManagerRoleMutations, ManagerPermissionMutations, ManagerRolePermissionMutations, and UserRoleMutations
# were renamed to RoleMutations, PermissionMutations, RolePermissionMutations, and UserRoleMutations respectively


@strawberry.type(description="Manager Query")
class ManagerQuery:
    """Manager 시스템 Query"""

    # Dashboard
    dashboard = DashboardQueries.dashboard
    tenant_growth = DashboardQueries.tenant_growth
    activities = DashboardQueries.activities

    # IDAM - Users
    user = UserQueries.user
    users = UserQueries.users

    # IDAM - Roles
    role = RoleQueries.role
    roles = RoleQueries.roles

    # IDAM - Permissions
    permission = PermissionQueries.permission
    permissions = PermissionQueries.permissions

    # IDAM - Role Permissions
    role_permission = RolePermissionQueries.role_permission
    role_permissions = RolePermissionQueries.role_permissions
    permissions_by_role = RolePermissionQueries.permissions_by_role
    roles_by_permission = RolePermissionQueries.roles_by_permission

    # IDAM - User Roles
    user_role = UserRoleQueries.user_role
    user_roles = UserRoleQueries.user_roles
    roles_by_user = UserRoleQueries.roles_by_user
    users_by_role = UserRoleQueries.users_by_role


@strawberry.type(description="Manager Mutation")
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
    create_user = UserMutations.create_user
    update_user = UserMutations.update_user

    # IDAM - Roles
    create_role = RoleMutations.create_role
    update_role = RoleMutations.update_role

    # IDAM - Permissions
    create_permission = PermissionMutations.create_permission
    update_permission = PermissionMutations.update_permission

    # IDAM - Role Permissions
    assign_permission_to_role = RolePermissionMutations.assign_permission_to_role
    remove_permission_from_role = RolePermissionMutations.remove_permission_from_role
    bulk_assign_permissions_to_role = RolePermissionMutations.bulk_assign_permissions_to_role
    bulk_remove_permissions_from_role = RolePermissionMutations.bulk_remove_permissions_from_role

    # IDAM - User Roles
    assign_role_to_user = UserRoleMutations.assign_role_to_user
    update_user_role = UserRoleMutations.update_user_role
    revoke_role_from_user = UserRoleMutations.revoke_role_from_user
    delete_user_role = UserRoleMutations.delete_user_role
    bulk_assign_roles_to_user = UserRoleMutations.bulk_assign_roles_to_user
    bulk_revoke_roles_from_user = UserRoleMutations.bulk_revoke_roles_from_user


__all__ = ["ManagerQuery", "ManagerMutation"]
