"""GraphQL 메인 스키마 - Manager + Tenants 통합"""

import strawberry

from .manager.auth.mutations import ManagerAuthMutations
from .manager.auth.queries import ManagerAuthQueries
from .manager.auth.types import (
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
from .manager.dashboard import Activity, DashboardQueries, DashboardStats, TenantGrowthData
from .manager.idam.users import ManagerUser, ManagerUserQueries
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
    # Auth
    @strawberry.field(description="현재 사용자 정보 조회")
    async def me(self, info) -> ManagerAuthUser:
        """
        현재 로그인한 사용자의 정보를 조회합니다.
        JWT 토큰이 필요합니다.
        """
        auth_queries = ManagerAuthQueries()
        return await auth_queries.me(info)

    # Dashboard
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

    # IDAM - Users
    @strawberry.field(description="Manager 사용자 조회 (ID)")
    async def manager_user(self, info, id: strawberry.ID) -> ManagerUser | None:
        """Manager 사용자 단건 조회"""
        manager_queries = ManagerUserQueries()
        return await manager_queries.manager_user(info, id)

    @strawberry.field(description="Manager 사용자 목록")
    async def manager_users(
        self,
        info,
        limit: int = 20,
        offset: int = 0,
        user_type: str | None = None,
        status: str | None = None,
    ) -> list[ManagerUser]:
        """Manager 사용자 목록 조회 (페이징 및 필터링 지원)"""
        manager_queries = ManagerUserQueries()
        return await manager_queries.manager_users(info, limit, offset, user_type, status)

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

    # ===== Manager 시스템 - Auth =====
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


# 스키마 생성
schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
)
