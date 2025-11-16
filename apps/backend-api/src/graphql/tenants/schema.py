"""Tenants 시스템 스키마"""

import strawberry

from .sys.users import (
    TenantsUser,
    TenantsUserCreateInput,
    TenantsUserMutations,
    TenantsUserQueries,
    TenantsUserUpdateInput,
)


@strawberry.type(description="Tenants Query")
class TenantsQuery:
    """Tenants 시스템 Query"""

    # ===== SYS - Users =====
    @strawberry.field(description="테넌트 사용자 조회 (ID)")
    async def user(self, info, id: strawberry.ID) -> TenantsUser | None:
        return await TenantsUserQueries.user(self, info, id)

    @strawberry.field(description="테넌트 사용자 목록 조회")
    async def users(self, info, limit: int = 20, offset: int = 0) -> list[TenantsUser]:
        return await TenantsUserQueries.users(self, info, limit, offset)


@strawberry.type(description="Tenants Mutation")
class TenantsMutation:
    """Tenants 시스템 Mutation"""

    # ===== SYS - Users =====
    @strawberry.mutation(description="테넌트 사용자 생성")
    async def create_user(self, info, input: TenantsUserCreateInput) -> TenantsUser:
        return await TenantsUserMutations.create_user(self, info, input)

    @strawberry.mutation(description="테넌트 사용자 수정")
    async def update_user(
        self, info, id: strawberry.ID, input: TenantsUserUpdateInput
    ) -> TenantsUser | None:
        return await TenantsUserMutations.update_user(self, info, id, input)


__all__ = ["TenantsQuery", "TenantsMutation"]
