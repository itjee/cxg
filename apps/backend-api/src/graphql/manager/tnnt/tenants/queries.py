"""Manager - Tenants GraphQL Queries

테넌트 조회 Query 구현
공통 모듈을 사용한 표준화된 조회 로직
"""

from typing import Any
from uuid import UUID

import strawberry
from sqlalchemy import or_
from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import get_by_id, get_list
from src.models.manager.tnnt.tenant import Tenant as TenantModel

from .types import ManagerTenant


def manager_tenant_to_graphql(tenant: TenantModel) -> "ManagerTenant":
    """
    TenantModel(DB 모델)을 Tenant(GraphQL 타입)으로 변환

    Args:
        tenant: 데이터베이스 테넌트 모델

    Returns:
        ManagerTenant: GraphQL 테넌트 타입
    """
    return ManagerTenant(
        id=strawberry.ID(str(tenant.id)),
        created_at=tenant.created_at,
        created_by=strawberry.ID(str(tenant.created_by)) if tenant.created_by else None,
        updated_at=tenant.updated_at,
        updated_by=strawberry.ID(str(tenant.updated_by)) if tenant.updated_by else None,
        code=tenant.code,
        name=tenant.name,
        type=tenant.type,
        biz_no=tenant.biz_no,
        biz_name=tenant.biz_name,
        biz_type=tenant.biz_type,
        ceo_name=tenant.ceo_name,
        biz_kind=tenant.biz_kind,
        biz_item=tenant.biz_item,
        postcode=tenant.postcode,
        address1=tenant.address1,
        address2=tenant.address2,
        phone_no=tenant.phone_no,
        employee_count=tenant.employee_count,
        start_date=tenant.start_date,
        close_date=tenant.close_date,
        timezone=tenant.timezone,
        locale=tenant.locale,
        currency=tenant.currency,
        extra_data=tenant.extra_data,
        status=tenant.status,
        is_suspended=tenant.is_suspended,
        suspended_reason=tenant.suspended_reason,
        suspended_date=tenant.suspended_date,
        is_deleted=tenant.is_deleted,
    )


async def get_manager_tenant_by_id(db: AsyncSession, tenant_id: UUID) -> "ManagerTenant | None":
    """
    ID로 Manager 테넌트 단건 조회

    Args:
        db: 데이터베이스 세션
        tenant_id: 조회할 테넌트 ID

    Returns:
        Tenant: 테넌트 객체 또는 None
    """
    return await get_by_id(
        db=db,
        model_class=TenantModel,
        id_=tenant_id,
        to_graphql=manager_tenant_to_graphql,
        is_deleted=False,
    )


async def get_manager_tenants(
    db: AsyncSession,
    limit: int = 20,
    offset: int = 0,
    search: str | None = None,
    status: str | None = None,
    type: str | None = None,
    is_suspended: bool | None = None,
) -> "list[ManagerTenant]":
    """
    Manager 테넌트 목록 조회

    Args:
        db: 데이터베이스 세션
        limit: 조회 개수 (기본값: 20)
        offset: 건너뛸 개수 (페이징용)
        search: 테넌트 검색어 (code, name, biz_name 검색)
        status: 상태 필터 (선택)
        type: 테넌트 유형 필터 (선택)
        is_suspended: 중단 여부 필터 (선택)

    Returns:
        list[Tenant]: 테넌트 객체 리스트
    """
    # 필터 조건 구성
    filters: dict[str, Any] = {"is_deleted": False}
    if status:
        filters["status"] = status
    if type:
        filters["type"] = type
    if is_suspended is not None:
        filters["is_suspended"] = is_suspended

    # search 조건 (복잡한 OR 조건이므로 extra_conditions에서 처리)
    extra_conditions = []
    if search:
        search_pattern = f"%{search}%"
        extra_conditions.append(
            or_(
                TenantModel.code.ilike(search_pattern),
                TenantModel.name.ilike(search_pattern),
                TenantModel.biz_name.ilike(search_pattern),
            )
        )

    # 공통 모듈을 사용한 리스트 조회
    return await get_list(
        db=db,
        model_class=TenantModel,
        to_graphql=manager_tenant_to_graphql,
        limit=limit,
        offset=offset,
        order_by=TenantModel.created_at.desc(),  # 최신 순으로 정렬
        extra_conditions=extra_conditions if extra_conditions else None,
        **filters,
    )


@strawberry.type
class ManagerTenantQueries:
    """
    Manager TNNT Tenants Query

    테넌트 조회 관련 GraphQL 쿼리를 제공합니다.
    """

    @strawberry.field(description="Manager 테넌트 조회 (ID)")
    async def tenant(self, info, id: strawberry.ID) -> "ManagerTenant | None":
        """
        ID로 테넌트 단건 조회

        Args:
            id: 테넌트 ID

        Returns:
            Tenant: 테넌트 객체 또는 None
        """
        db = info.context.manager_db_session
        return await get_manager_tenant_by_id(db, UUID(id))

    @strawberry.field(description="Manager 테넌트 목록")
    async def tenants(
        self,
        info,
        limit: int = 20,
        offset: int = 0,
        search: str | None = None,
        status: str | None = None,
        type: str | None = None,
        is_suspended: bool | None = None,
    ) -> "list[ManagerTenant]":
        """
        테넌트 목록 조회 (페이징 및 필터링 지원)

        Args:
            limit: 조회 개수
            offset: 건너뛸 개수
            search: 테넌트 검색어 (code, name, biz_name 검색)
            status: 상태 필터
            type: 테넌트 유형 필터
            is_suspended: 중단 여부 필터

        Returns:
            list[Tenant]: 테넌트 객체 리스트
        """
        db = info.context.manager_db_session
        return await get_manager_tenants(
            db,
            limit,
            offset,
            search,
            status,
            type,
            is_suspended,
        )
