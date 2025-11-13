"""Manager IDAM Sessions - Queries

세션 조회 Query 구현
공통 모듈을 사용한 표준화된 조회 로직
"""

from uuid import UUID

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import get_by_id, get_list
from src.models.manager.idam.session import Session as SessionModel

from .types import ManagerSession


def session_to_graphql(session: SessionModel) -> ManagerSession:
    """
    SessionModel(DB 모델)을 ManagerSession(GraphQL 타입)으로 변환

    Args:
        session: 데이터베이스 세션 모델

    Returns:
        ManagerSession: GraphQL 세션 타입
    """
    return ManagerSession(
        id=strawberry.ID(str(session.id)),
        session_id=session.session_id,
        user_id=session.user_id,
        tenant_context=session.tenant_context,
        session_type=session.session_type,
        fingerprint=session.fingerprint,
        user_agent=session.user_agent,
        ip_address=session.ip_address,
        country_code=session.country_code,
        city=session.city,
        status=session.status,
        expires_at=session.expires_at,
        last_activity_at=session.last_activity_at,
        mfa_verified=session.mfa_verified,
        mfa_verified_at=session.mfa_verified_at,
        created_at=session.created_at,
        updated_at=session.updated_at,
    )


async def get_manager_session_by_id(db: AsyncSession, session_id: UUID) -> ManagerSession | None:
    """
    ID로 Manager 세션 단건 조회

    Args:
        db: 데이터베이스 세션
        session_id: 조회할 세션 ID

    Returns:
        ManagerSession: 세션 객체 또는 None
    """
    return await get_by_id(
        db=db,
        model_class=SessionModel,
        id_=session_id,
        to_graphql=session_to_graphql,
    )


async def get_manager_sessions(
    db: AsyncSession,
    limit: int = 20,
    offset: int = 0,
    user_id: UUID | None = None,
    status: str | None = None,
) -> list[ManagerSession]:
    """
    Manager 세션 목록 조회

    Args:
        db: 데이터베이스 세션
        limit: 조회 개수 (기본값: 20)
        offset: 건너뛸 개수 (페이징용)
        user_id: 사용자 ID 필터 (선택)
        status: 상태 필터 (선택)

    Returns:
        list[ManagerSession]: 세션 객체 리스트
    """
    # 필터 조건 구성
    filters = {}
    if user_id:
        filters["user_id"] = user_id
    if status:
        filters["status"] = status

    # 공통 모듈을 사용한 리스트 조회
    return await get_list(
        db=db,
        model_class=SessionModel,
        to_graphql=session_to_graphql,
        limit=limit,
        offset=offset,
        order_by=SessionModel.created_at.desc(),  # 최신 순으로 정렬
        **filters,
    )


@strawberry.type
class ManagerSessionQueries:
    """
    Manager IDAM Sessions Query

    세션 조회 관련 GraphQL 쿼리를 제공합니다.
    """

    @strawberry.field(description="Manager 세션 조회 (ID)")
    async def manager_session(self, info, id: strawberry.ID) -> ManagerSession | None:
        """
        ID로 세션 단건 조회

        Args:
            id: 세션 ID

        Returns:
            ManagerSession: 세션 객체 또는 None
        """
        db = info.context.manager_db_session
        return await get_manager_session_by_id(db, UUID(id))

    @strawberry.field(description="Manager 세션 목록")
    async def manager_sessions(
        self,
        info,
        limit: int = 20,
        offset: int = 0,
        user_id: strawberry.ID | None = None,
        status: str | None = None,
    ) -> list[ManagerSession]:
        """
        세션 목록 조회 (페이징 및 필터링 지원)

        Args:
            limit: 조회 개수
            offset: 건너뛸 개수
            user_id: 사용자 ID 필터
            status: 상태 필터

        Returns:
            list[ManagerSession]: 세션 객체 리스트
        """
        db = info.context.manager_db_session
        user_uuid = UUID(user_id) if user_id else None
        return await get_manager_sessions(db, limit, offset, user_uuid, status)
