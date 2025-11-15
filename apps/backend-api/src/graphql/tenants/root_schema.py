"""Tenants 시스템 전용 GraphQL 루트 스키마

이 스키마는 Tenants 시스템의 모든 Query와 Mutation을 통합합니다.
/graphql/tenants 엔드포인트에서 사용됩니다.
"""

import strawberry

from .schema import TenantsMutation, TenantsQuery
from .sys.users.types import User, UserCreateInput, UserUpdateInput
from .sys.users.queries import UserQueries


@strawberry.type(description="Tenants System GraphQL Query")
class Query:
    """
    Tenants 시스템 Query

    Tenants 앱의 모든 Query를 포함합니다:
    - System (SYS)
      - Users
    - CRM (Customer Relationship Management)
    - HRM (Human Resource Management)
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

    # ===== SYS - Users =====
    @strawberry.field(description="Tenant 사용자 조회 (ID)")
    async def user(self, info, id: strawberry.ID) -> User | None:
        user_queries = UserQueries()
        return await user_queries.user(info, id)

    @strawberry.field(description="Tenant 사용자 목록 조회")
    async def users(self, info, limit: int = 20, offset: int = 0) -> list[User]:
        user_queries = UserQueries()
        return await user_queries.users(info, limit, offset)


@strawberry.type(description="Tenants 시스템 GraphQL Mutation")
class Mutation:
    """
    Tenants 시스템 Mutation

    Tenants 앱의 모든 Mutation을 포함합니다:
    - System (SYS)
      - Users
    - CRM (Customer Relationship Management)
    - HRM (Human Resource Management)
    """

    # ===== SYS - Users =====
    @strawberry.mutation(description="Tenant 사용자 생성")
    async def create_user(self, info, input: UserCreateInput) -> User:
        """Tenant 사용자 생성"""
        tenant_mutations = TenantsMutation()
        return await tenant_mutations.create_user(info, input)

    @strawberry.mutation(description="Tenant 사용자 수정")
    async def update_user(
        self, info, id: strawberry.ID, input: UserUpdateInput
    ) -> User | None:
        """Tenant 사용자 수정"""
        tenant_mutations = TenantsMutation()
        return await tenant_mutations.update_user(info, id, input)


# Tenants 시스템 전용 스키마
tenants_schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
)
