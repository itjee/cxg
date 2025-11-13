"""GraphQL 메인 스키마 - Manager + Tenants 통합"""

import strawberry

from .manager.schema import ManagerMutation, ManagerQuery
from .tenants.schema import TenantsMutation, TenantsQuery


@strawberry.type(description="GraphQL Root Query")
class Query:
    """
    루트 Query

    통합:
    - Manager 시스템 (IDAM, Tenant Management)
    - Tenants 시스템 (SYS, CRM, HRM)
    """

    @strawberry.field(description="API 버전")
    def version(self) -> str:
        """API 버전 정보"""
        return "3.0.0"

    @strawberry.field(description="서버 상태")
    def health(self) -> str:
        """헬스 체크"""
        return "healthy"

    # ===== Manager 시스템 =====
    # IDAM - Users
    manager_user = ManagerQuery.manager_user
    manager_users = ManagerQuery.manager_users

    # IDAM - Roles
    manager_role = ManagerQuery.manager_role
    manager_roles = ManagerQuery.manager_roles

    # IDAM - Permissions
    manager_permission = ManagerQuery.manager_permission
    manager_permissions = ManagerQuery.manager_permissions

    # IDAM - Role Permissions
    manager_role_permission = ManagerQuery.manager_role_permission
    manager_role_permissions = ManagerQuery.manager_role_permissions
    manager_permissions_by_role = ManagerQuery.manager_permissions_by_role
    manager_roles_by_permission = ManagerQuery.manager_roles_by_permission

    # ===== Tenants 시스템 =====
    # SYS - Users
    tenant_user = TenantsQuery.tenant_user
    tenant_users = TenantsQuery.tenant_users


@strawberry.type(description="GraphQL Root Mutation")
class Mutation:
    """
    루트 Mutation

    통합:
    - Manager 시스템
    - Tenants 시스템
    """

    # ===== Manager 시스템 =====
    # IDAM - Users
    create_manager_user = ManagerMutation.create_manager_user
    update_manager_user = ManagerMutation.update_manager_user

    # IDAM - Roles
    create_manager_role = ManagerMutation.create_manager_role
    update_manager_role = ManagerMutation.update_manager_role

    # IDAM - Permissions
    create_manager_permission = ManagerMutation.create_manager_permission
    update_manager_permission = ManagerMutation.update_manager_permission

    # IDAM - Role Permissions
    assign_permission_to_role = ManagerMutation.assign_permission_to_role
    remove_permission_from_role = ManagerMutation.remove_permission_from_role
    bulk_assign_permissions_to_role = ManagerMutation.bulk_assign_permissions_to_role
    bulk_remove_permissions_from_role = ManagerMutation.bulk_remove_permissions_from_role

    # ===== Tenants 시스템 =====
    # SYS - Users
    create_tenant_user = TenantsMutation.create_tenant_user
    update_tenant_user = TenantsMutation.update_tenant_user


# 스키마 생성
schema = strawberry.Schema(
    query=Query,
    # mutation=Mutation,  # TODO: Mutation 구현 필요
)
