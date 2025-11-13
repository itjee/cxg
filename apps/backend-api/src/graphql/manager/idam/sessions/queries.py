"""Manager IDAM Sessions - Queries

공통 모듈을 사용한 Query 구현
"""

from uuid import UUID

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import get_by_id, get_list
from src.models.manager.idam.session import Session as SessionModel

from .types import ManagerSession


def session_to_graphql(session: SessionModel) -> ManagerSession:
    """SessionModel을 ManagerSession GraphQL 타입으로 변환"""
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
    """ID로 Manager 세션 조회"""
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
    """Manager 세션 목록 조회"""
    filters = {}
    if user_id:
        filters["user_id"] = user_id
    if status:
        filters["status"] = status

    return await get_list(
        db=db,
        model_class=SessionModel,
        to_graphql=session_to_graphql,
        limit=limit,
        offset=offset,
        order_by=SessionModel.created_at.desc(),
        **filters,
    )


@strawberry.type
class ManagerSessionQueries:
    """Manager IDAM Sessions Query"""

    @strawberry.field(description="Manager 세션 조회 (ID)")
    async def manager_session(self, info, id: strawberry.ID) -> ManagerSession | None:
        """Manager 세션 단건 조회"""
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
        """Manager 세션 목록 조회"""
        db = info.context.manager_db_session
        user_uuid = UUID(user_id) if user_id else None
        return await get_manager_sessions(db, limit, offset, user_uuid, status)
