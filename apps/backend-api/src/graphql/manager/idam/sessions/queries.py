"""Manager IDAM Sessions - Queries

세션 조회 Query 구현
공통 모듈을 사용한 표준화된 조회 로직
"""

from uuid import UUID

import strawberry
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.manager.idam.session import Session as SessionModel
from src.models.manager.idam.user import User as UserModel

from .types import ManagerSession, ManagerSessionList


async def manager_session_to_graphql(session: SessionModel, db: AsyncSession) -> "ManagerSession":
    """
    SessionModel(DB 모델)을 ManagerSession(GraphQL 타입)으로 변환

    Args:
        session: 데이터베이스 세션 모델
        db: 데이터베이스 세션 (username 조회용)

    Returns:
        ManagerSession: GraphQL 세션 타입
    """
    # 사용자명 조회
    username = ""
    result = await db.execute(select(UserModel.username).where(UserModel.id == session.user_id))
    username = result.scalar_one_or_none() or ""

    return ManagerSession(
        id=strawberry.ID(str(session.id)),
        session_id=session.session_id,
        user_id=session.user_id,
        username=username,
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


async def get_manager_session_by_id(db: AsyncSession, session_id: UUID) -> "ManagerSession | None":
    """
    ID로 Manager 세션 단건 조회

    Args:
        db: 데이터베이스 세션
        session_id: 조회할 세션 ID

    Returns:
        ManagerSession: 세션 객체 또는 None
    """
    result = await db.execute(select(SessionModel).where(SessionModel.id == session_id))
    session = result.scalar_one_or_none()

    if not session:
        return None

    return await manager_session_to_graphql(session, db)


async def get_manager_sessions(
    db: AsyncSession,
    limit: int = 20,
    offset: int = 0,
    user_id: UUID | None = None,
    status: str | None = None,
    session_type: str | None = None,
) -> "tuple[list[ManagerSession], int]":
    """
    Manager 세션 목록 조회 (전체 개수 포함)

    Args:
        db: 데이터베이스 세션
        limit: 조회 개수 (기본값: 20)
        offset: 건너뛸 개수 (페이징용)
        user_id: 사용자 ID 필터 (선택)
        status: 상태 필터 (선택)
        session_type: 세션 타입 필터 (선택)

    Returns:
        tuple: (세션 객체 리스트, 전체 세션 개수)
    """
    # 필터 조건 구성
    base_query = select(SessionModel)
    if user_id:
        base_query = base_query.where(SessionModel.user_id == user_id)
    if status:
        base_query = base_query.where(SessionModel.status == status)
    if session_type:
        base_query = base_query.where(SessionModel.session_type == session_type)

    # 1. 전체 개수 조회
    count_query = select(func.count(SessionModel.id)).select_from(SessionModel)
    if user_id:
        count_query = count_query.where(SessionModel.user_id == user_id)
    if status:
        count_query = count_query.where(SessionModel.status == status)
    if session_type:
        count_query = count_query.where(SessionModel.session_type == session_type)

    count_result = await db.execute(count_query)
    total_count = count_result.scalar() or 0

    # 2. 페이징된 데이터 조회
    query = base_query.order_by(SessionModel.created_at.desc()).limit(limit).offset(offset)
    result = await db.execute(query)
    sessions = result.scalars().all()

    # 3. 각 세션을 GraphQL 타입으로 변환 (username 포함)
    graphql_sessions = [await manager_session_to_graphql(session, db) for session in sessions]

    return graphql_sessions, total_count


@strawberry.type
class ManagerSessionQueries:
    """
    Manager IDAM Sessions Query

    세션 조회 관련 GraphQL 쿼리를 제공합니다.
    """

    @strawberry.field(description="Manager 세션 조회 (ID)")
    async def session(self, info, id: strawberry.ID) -> "ManagerSession | None":
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
    async def sessions(
        self,
        info,
        limit: int = 20,
        offset: int = 0,
        user_id: strawberry.ID | None = None,
        status: str | None = None,
        session_type: str | None = None,
    ) -> "ManagerSessionList":
        """
        세션 목록 조회 (페이징 및 필터링 지원)

        Args:
            limit: 조회 개수
            offset: 건너뛸 개수
            user_id: 사용자 ID 필터
            status: 상태 필터
            session_type: 세션 타입 필터 (WEB, API, MOBILE)

        Returns:
            ManagerSessionList: 세션 목록과 전체 개수
        """
        db = info.context.manager_db_session
        user_uuid = UUID(user_id) if user_id else None
        sessions, total = await get_manager_sessions(
            db, limit, offset, user_uuid, status, session_type
        )
        return ManagerSessionList(items=sessions, total=total)
