"""Tenants 시스템 스키마"""

import strawberry

from .sys.users import (
    TenantsUser,
    TenantsUserMutations,
    TenantsUserQueries,
)


@strawberry.type(description="Tenants Query")
class TenantsQuery:
    """Tenants 시스템 Query"""

    # ===== SYS - Users =====
    @strawberry.field(description="테넌트 사용자 조회 (ID)")
    async def user(self, info, id: strawberry.ID) -> "TenantsUser | None":
        return await TenantsUserQueries.user(self, info, id)

    @strawberry.field(description="테넌트 사용자 목록 조회")
    async def users(self, info, limit: int = 20, offset: int = 0) -> "list[TenantsUser]":
        return await TenantsUserQueries.users(self, info, limit, offset)


@strawberry.type(description="Tenants Mutation")
class TenantsMutation:
    """Tenants 시스템 Mutation

    Tenants 시스템의 모든 Mutation을 통합하여 제공합니다.
    각 모듈의 Mutation 클래스를 네임스페이스로 노출합니다.
    """

    @strawberry.field(description="사용자 관련 Mutation")
    def users(self) -> TenantsUserMutations:
        """테넌트 사용자 관련 Mutation"""
        return TenantsUserMutations()


__all__ = ["TenantsQuery", "TenantsMutation"]
