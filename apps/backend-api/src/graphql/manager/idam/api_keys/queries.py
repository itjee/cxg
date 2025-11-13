"""Manager IDAM API Keys - Queries

Manager 시스템 API 키 조회 Query 구현
공통 모듈을 사용한 표준화된 조회 로직을 제공합니다.
"""

from uuid import UUID

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import get_by_id, get_list
from src.models.manager.idam.api_key import ApiKey as ApiKeyModel

from .types import ManagerApiKey


def api_key_to_graphql(api_key: ApiKeyModel) -> ManagerApiKey:
    """
    ApiKeyModel(DB 모델)을 ManagerApiKey(GraphQL 타입)으로 변환

    Args:
        api_key: 데이터베이스 API 키 모델

    Returns:
        ManagerApiKey: GraphQL 타입

    Note:
        - allowed_ips는 IP 객체 리스트를 문자열 리스트로 변환
        - last_used_ip도 IP 객체를 문자열로 변환
    """
    return ManagerApiKey(
        id=strawberry.ID(str(api_key.id)),
        key_id=api_key.key_id,
        key_name=api_key.key_name,
        user_id=api_key.user_id,
        tenant_context=api_key.tenant_context,
        service_account=api_key.service_account,
        scopes=api_key.scopes,
        allowed_ips=[str(ip) for ip in api_key.allowed_ips] if api_key.allowed_ips else None,
        rate_limit_per_minute=api_key.rate_limit_per_minute,
        rate_limit_per_hour=api_key.rate_limit_per_hour,
        rate_limit_per_day=api_key.rate_limit_per_day,
        status=api_key.status,
        expires_at=api_key.expires_at,
        last_used_at=api_key.last_used_at,
        last_used_ip=str(api_key.last_used_ip) if api_key.last_used_ip else None,
        usage_count=api_key.usage_count,
        created_at=api_key.created_at,
        updated_at=api_key.updated_at,
    )


async def get_manager_api_key_by_id(db: AsyncSession, api_key_id: UUID) -> ManagerApiKey | None:
    """
    ID로 Manager API 키 단건 조회

    Args:
        db: 데이터베이스 세션
        api_key_id: 조회할 API 키 ID

    Returns:
        ManagerApiKey: API 키 객체 또는 None
    """
    return await get_by_id(
        db=db,
        model_class=ApiKeyModel,
        id_=api_key_id,
        to_graphql=api_key_to_graphql,
    )


async def get_manager_api_keys(
    db: AsyncSession,
    limit: int = 20,
    offset: int = 0,
    user_id: UUID | None = None,
    status: str | None = None,
) -> list[ManagerApiKey]:
    """
    Manager API 키 목록 조회

    Args:
        db: 데이터베이스 세션
        limit: 조회 개수 제한 (기본값: 20)
        offset: 건너뛸 개수 (페이징용)
        user_id: 사용자 ID 필터 (특정 사용자의 키만 조회)
        status: 상태 필터 (ACTIVE, INACTIVE, REVOKED)

    Returns:
        list[ManagerApiKey]: API 키 객체 리스트

    Note:
        최신 생성 순으로 정렬됩니다.
    """
    # 필터 조건 구성
    filters = {}
    if user_id:
        filters["user_id"] = user_id
    if status:
        filters["status"] = status

    return await get_list(
        db=db,
        model_class=ApiKeyModel,
        to_graphql=api_key_to_graphql,
        limit=limit,
        offset=offset,
        order_by=ApiKeyModel.created_at.desc(),  # 최신 생성 순
        **filters,
    )


@strawberry.type
class ManagerApiKeyQueries:
    """
    Manager IDAM API Keys Query

    Manager 시스템의 API 키 조회 관련 GraphQL Query들을 제공합니다.
    """

    @strawberry.field(description="Manager API 키 조회 (ID)")
    async def manager_api_key(self, info, id: strawberry.ID) -> ManagerApiKey | None:
        """
        ID로 API 키 단건 조회

        Args:
            id: API 키 ID

        Returns:
            ManagerApiKey: API 키 객체 또는 None

        Note:
            full_api_key(실제 키 값)는 반환되지 않습니다.
            키 생성 시에만 한 번 반환됩니다.
        """
        db = info.context.manager_db_session
        return await get_manager_api_key_by_id(db, UUID(id))

    @strawberry.field(description="Manager API 키 목록")
    async def manager_api_keys(
        self,
        info,
        limit: int = 20,
        offset: int = 0,
        user_id: UUID | None = None,
        status: str | None = None,
    ) -> list[ManagerApiKey]:
        """
        API 키 목록 조회 (페이징 및 필터링 지원)

        Args:
            limit: 조회 개수
            offset: 건너뛸 개수
            user_id: 사용자 ID 필터 (선택)
            status: 상태 필터 (선택)

        Returns:
            list[ManagerApiKey]: API 키 객체 리스트

        사용 예:
            # 특정 사용자의 활성 키 조회
            manager_api_keys(user_id: "xxx", status: "ACTIVE")
        """
        db = info.context.manager_db_session
        return await get_manager_api_keys(db, limit, offset, user_id, status)
