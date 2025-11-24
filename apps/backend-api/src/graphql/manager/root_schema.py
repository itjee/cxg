"""Manager 시스템 전용 GraphQL 루트 스키마

이 스키마는 Manager 시스템의 모든 Query와 Mutation을 통합합니다.
/graphql/manager 엔드포인트에서 사용됩니다.
"""

import strawberry

from .schema import ManagerMutation, ManagerQuery


# Query와 Mutation을 schema.py에서 정의된 것을 직접 사용
Query = ManagerQuery
Mutation = ManagerMutation

# Manager 시스템 전용 스키마
# Strawberry의 기본값(auto_camel_case=True)을 사용하여
# Python의 snake_case를 GraphQL의 camelCase로 자동 변환
manager_schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
)
