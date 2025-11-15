"""Manager 시스템 전용 GraphQL 루트 스키마

이 스키마는 Manager 시스템의 모든 Query와 Mutation을 통합합니다.
/graphql/manager 엔드포인트에서 사용됩니다.
"""

import strawberry

from .auth.mutations import ManagerAuthMutations
from .auth.queries import ManagerAuthQueries
from .auth.types import (
    ChangePasswordInput,
    ManagerAuthUser,
    MessageResponse,
    RefreshTokenInput,
    ResetPasswordConfirmInput,
    ResetPasswordInput,
    SigninInput,
    SignupInput,
    TokenResponse,
)
from .dashboard import Activity, DashboardQueries, DashboardStats, TenantGrowthData
from .schema import ManagerMutation, ManagerQuery
from .idam.users import User
from .idam.roles import Role
from .idam.permissions import Permission
from .idam.role_permissions import RolePermission
from .idam.user_roles import UserRole


@strawberry.type(description="Manager 시스템 GraphQL Query")
class Query:
    """
    Manager 시스템 Query

    Manager 앱의 모든 Query를 포함합니다:
    - 인증 (Auth)
    - Dashboard
    - IDAM (Identity & Access Management)
      - Users, Roles, Permissions, Role-Permissions, User-Roles
    - Tenant Management
    """

    # ===== System Info =====
    @strawberry.field(description="API 버전")
    def version(self) -> str:
        """API 버전 정보"""
        return "3.0.0"

    @strawberry.field(description="시스템 상태")
    def health(self) -> str:
        """헬스 체크"""
        return "healthy"

    # ===== Auth =====
    @strawberry.field(description="현재 사용자 정보 조회")
    async def me(self, info) -> ManagerAuthUser:
        """
        현재 로그인한 사용자의 정보를 조회합니다.
        JWT 토큰이 필요합니다.
        """
        auth_queries = ManagerAuthQueries()
        return await auth_queries.me(info)

    # ===== Dashboard =====
    @strawberry.field(description="Dashboard 통계 데이터 조회")
    async def dashboard(self) -> DashboardStats:
        """Dashboard 통계 데이터를 조회합니다."""
        dashboard_queries = DashboardQueries()
        return await dashboard_queries.dashboard()

    @strawberry.field(description="테넌트 성장 데이터 조회")
    async def tenant_growth(self, period: str = "month") -> list[TenantGrowthData]:
        """테넌트 성장 데이터를 조회합니다."""
        dashboard_queries = DashboardQueries()
        return await dashboard_queries.tenant_growth(period)

    @strawberry.field(description="최근 활동 로그 조회")
    async def activities(self, limit: int = 10, order_by: str = "createdAt") -> list[Activity]:
        """최근 활동 로그를 조회합니다."""
        dashboard_queries = DashboardQueries()
        return await dashboard_queries.activities(limit, order_by)

    # ===== IDAM - Users =====
    @strawberry.field(description="사용자 조회 (ID)")
    async def user(self, info, id: strawberry.ID) -> User | None:
        manager_query = ManagerQuery()
        return await manager_query.user(info, id)

    @strawberry.field(description="사용자 목록 조회")
    async def users(self, info, limit: int = 20, offset: int = 0, user_type: str | None = None, status: str | None = None) -> list[User]:
        manager_query = ManagerQuery()
        return await manager_query.users(info, limit, offset, user_type, status)

    # ===== IDAM - Roles =====
    @strawberry.field(description="역할 조회 (ID)")
    async def role(self, info, id: strawberry.ID) -> Role | None:
        manager_query = ManagerQuery()
        return await manager_query.role(info, id)

    @strawberry.field(description="역할 목록 조회")
    async def roles(self, info, limit: int = 20, offset: int = 0, category: str | None = None, status: str | None = None) -> list[Role]:
        manager_query = ManagerQuery()
        return await manager_query.roles(info, limit, offset, category, status)

    # ===== IDAM - Permissions =====
    @strawberry.field(description="권한 조회 (ID)")
    async def permission(self, info, id: strawberry.ID) -> Permission | None:
        manager_query = ManagerQuery()
        return await manager_query.permission(info, id)

    @strawberry.field(description="권한 목록 조회")
    async def permissions(self, info, limit: int = 20, offset: int = 0, category: str | None = None, resource: str | None = None) -> list[Permission]:
        manager_query = ManagerQuery()
        return await manager_query.permissions(info, limit, offset, category, resource)

    # ===== IDAM - Role Permissions =====
    @strawberry.field(description="역할-권한 조회 (ID)")
    async def role_permission(self, info, id: strawberry.ID) -> RolePermission | None:
        manager_query = ManagerQuery()
        return await manager_query.role_permission(info, id)

    @strawberry.field(description="역할-권한 목록 조회")
    async def role_permissions(self, info, limit: int = 20, offset: int = 0) -> list[RolePermission]:
        manager_query = ManagerQuery()
        return await manager_query.role_permissions(info, limit, offset)

    @strawberry.field(description="역할별 권한 목록")
    async def permissions_by_role(self, info, role_id: strawberry.ID) -> list[Permission]:
        manager_query = ManagerQuery()
        return await manager_query.permissions_by_role(info, role_id)

    @strawberry.field(description="권한별 역할 목록")
    async def roles_by_permission(self, info, permission_id: strawberry.ID) -> list[Role]:
        manager_query = ManagerQuery()
        return await manager_query.roles_by_permission(info, permission_id)

    # ===== IDAM - User Roles =====
    @strawberry.field(description="사용자-역할 조회 (ID)")
    async def user_role(self, info, id: strawberry.ID) -> UserRole | None:
        manager_query = ManagerQuery()
        return await manager_query.user_role(info, id)

    @strawberry.field(description="사용자-역할 목록 조회")
    async def user_roles(self, info, limit: int = 20, offset: int = 0) -> list[UserRole]:
        manager_query = ManagerQuery()
        return await manager_query.user_roles(info, limit, offset)

    @strawberry.field(description="사용자별 역할 목록")
    async def roles_by_user(self, info, user_id: strawberry.ID) -> list[Role]:
        manager_query = ManagerQuery()
        return await manager_query.roles_by_user(info, user_id)

    @strawberry.field(description="역할별 사용자 목록")
    async def users_by_role(self, info, role_id: strawberry.ID) -> list[User]:
        manager_query = ManagerQuery()
        return await manager_query.users_by_role(info, role_id)


@strawberry.type(description="Manager 시스템 GraphQL Mutation")
class Mutation:
    """
    Manager 시스템 Mutation

    Manager 앱의 모든 Mutation을 포함합니다:
    - 인증 (Auth)
    - IDAM
      - Users, Roles, Permissions, Role-Permissions, User-Roles
    """

    # ===== Auth =====
    @strawberry.mutation(description="로그인")
    async def signin(self, info, input: SigninInput) -> TokenResponse:
        """로그인"""
        auth_mutations = ManagerAuthMutations()
        return await auth_mutations.signin(info, input)

    @strawberry.mutation(description="회원가입")
    async def signup(self, info, input: SignupInput) -> ManagerAuthUser:
        """회원가입"""
        auth_mutations = ManagerAuthMutations()
        return await auth_mutations.signup(info, input)

    @strawberry.mutation(description="토큰 갱신")
    async def refresh_token(self, info, input: RefreshTokenInput) -> TokenResponse:
        """토큰 갱신"""
        auth_mutations = ManagerAuthMutations()
        return await auth_mutations.refresh_token(info, input)

    @strawberry.mutation(description="로그아웃")
    async def logout(self, info) -> MessageResponse:
        """로그아웃"""
        auth_mutations = ManagerAuthMutations()
        return await auth_mutations.logout(info)

    @strawberry.mutation(description="비밀번호 변경")
    async def change_password(self, info, input: ChangePasswordInput) -> MessageResponse:
        """비밀번호 변경"""
        auth_mutations = ManagerAuthMutations()
        return await auth_mutations.change_password(info, input)

    @strawberry.mutation(description="비밀번호 찾기")
    async def forgot_password(self, info, input: ResetPasswordInput) -> MessageResponse:
        """비밀번호 찾기"""
        auth_mutations = ManagerAuthMutations()
        return await auth_mutations.forgot_password(info, input)

    @strawberry.mutation(description="비밀번호 재설정")
    async def reset_password(self, info, input: ResetPasswordConfirmInput) -> MessageResponse:
        """비밀번호 재설정"""
        auth_mutations = ManagerAuthMutations()
        return await auth_mutations.reset_password(info, input)

    # ===== IDAM - Users =====
    create_user = ManagerMutation.create_user
    update_user = ManagerMutation.update_user

    # ===== IDAM - Roles =====
    create_role = ManagerMutation.create_role
    update_role = ManagerMutation.update_role

    # ===== IDAM - Permissions =====
    create_permission = ManagerMutation.create_permission
    update_permission = ManagerMutation.update_permission

    # ===== IDAM - Role Permissions =====
    assign_permission_to_role = ManagerMutation.assign_permission_to_role
    remove_permission_from_role = ManagerMutation.remove_permission_from_role
    bulk_assign_permissions_to_role = ManagerMutation.bulk_assign_permissions_to_role
    bulk_remove_permissions_from_role = ManagerMutation.bulk_remove_permissions_from_role

    # ===== IDAM - User Roles =====
    assign_role_to_user = ManagerMutation.assign_role_to_user
    update_user_role = ManagerMutation.update_user_role
    revoke_role_from_user = ManagerMutation.revoke_role_from_user
    delete_user_role = ManagerMutation.delete_user_role
    bulk_assign_roles_to_user = ManagerMutation.bulk_assign_roles_to_user
    bulk_revoke_roles_from_user = ManagerMutation.bulk_revoke_roles_from_user


# Manager 시스템 전용 스키마
manager_schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
)
