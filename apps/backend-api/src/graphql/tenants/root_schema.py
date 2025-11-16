"""Tenants 시스템 전용 GraphQL 루트 스키마

이 스키마는 Tenants 시스템의 모든 Query와 Mutation을 통합합니다.
/graphql/tenants 엔드포인트에서 사용됩니다.
"""

import strawberry

from .schema import TenantsMutation, TenantsQuery


# Query와 Mutation을 schema.py에서 정의된 것을 직접 사용
Query = TenantsQuery
Mutation = TenantsMutation

# Tenants 시스템 전용 스키마
tenants_schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
)
