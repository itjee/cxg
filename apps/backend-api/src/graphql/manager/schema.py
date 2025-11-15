"""Manager 시스템 스키마"""

import strawberry

from .auth.mutations import ManagerAuthMutations
from .auth.queries import ManagerAuthQueries
from .dashboard import DashboardQueries
from .idam.permissions import ManagerPermissionMutations, ManagerPermissionQueries
from .idam.role_permissions import (
    ManagerRolePermissionMutations,
    ManagerRolePermissionQueries,
)
from .idam.roles import ManagerRoleMutations, ManagerRoleQueries
from .idam.user_roles import ManagerUserRoleMutations, ManagerUserRoleQueries
from .idam.users import ManagerUserMutations, ManagerUserQueries


@strawberry.type(description="Manager Query")
class ManagerQuery:
    """Manager 시스템 Query"""

    # Dashboard
    dashboard = DashboardQueries.dashboard
    tenant_growth = DashboardQueries.tenant_growth
    activities = DashboardQueries.activities

    # IDAM - Users
    manager_user = ManagerUserQueries.manager_user
    manager_users = ManagerUserQueries.manager_users

    # IDAM - Roles
    manager_role = ManagerRoleQueries.manager_role
    manager_roles = ManagerRoleQueries.manager_roles

    # IDAM - Permissions
    manager_permission = ManagerPermissionQueries.manager_permission
    manager_permissions = ManagerPermissionQueries.manager_permissions

    # IDAM - Role Permissions
    manager_role_permission = ManagerRolePermissionQueries.manager_role_permission
    manager_role_permissions = ManagerRolePermissionQueries.manager_role_permissions
    manager_permissions_by_role = ManagerRolePermissionQueries.manager_permissions_by_role
    manager_roles_by_permission = ManagerRolePermissionQueries.manager_roles_by_permission

    # IDAM - User Roles
    manager_user_role = ManagerUserRoleQueries.manager_user_role
    manager_user_roles = ManagerUserRoleQueries.manager_user_roles
    manager_roles_by_user = ManagerUserRoleQueries.manager_roles_by_user
    manager_users_by_role = ManagerUserRoleQueries.manager_users_by_role


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
    create_manager_user = ManagerUserMutations.create_manager_user
    update_manager_user = ManagerUserMutations.update_manager_user

    # IDAM - Roles
    create_manager_role = ManagerRoleMutations.create_manager_role
    update_manager_role = ManagerRoleMutations.update_manager_role

    # IDAM - Permissions
    create_manager_permission = ManagerPermissionMutations.create_manager_permission
    update_manager_permission = ManagerPermissionMutations.update_manager_permission

    # IDAM - Role Permissions
    assign_permission_to_role = ManagerRolePermissionMutations.assign_permission_to_role
    remove_permission_from_role = ManagerRolePermissionMutations.remove_permission_from_role
    bulk_assign_permissions_to_role = ManagerRolePermissionMutations.bulk_assign_permissions_to_role
    bulk_remove_permissions_from_role = (
        ManagerRolePermissionMutations.bulk_remove_permissions_from_role
    )

    # IDAM - User Roles
    assign_role_to_user = ManagerUserRoleMutations.assign_role_to_user
    update_user_role = ManagerUserRoleMutations.update_user_role
    revoke_role_from_user = ManagerUserRoleMutations.revoke_role_from_user
    delete_user_role = ManagerUserRoleMutations.delete_user_role
    bulk_assign_roles_to_user = ManagerUserRoleMutations.bulk_assign_roles_to_user
    bulk_revoke_roles_from_user = ManagerUserRoleMutations.bulk_revoke_roles_from_user


__all__ = ["ManagerQuery", "ManagerMutation"]
