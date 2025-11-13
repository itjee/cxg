"""Manager IDAM Sessions - Mutations

공통 모듈을 사용한 Mutation 구현
"""

from uuid import UUID

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import delete_entity, update_entity
from src.models.manager.idam.session import Session as SessionModel

from .queries import session_to_graphql
from .types import ManagerSession


async def revoke_manager_session(db: AsyncSession, session_id: UUID) -> ManagerSession | None:
    """Manager 세션 폐기 (상태를 REVOKED로 변경)"""

    # 세션 조회 및 상태 업데이트를 위한 간단한 input 객체 생성
    class SessionRevokeInput:
        status = "REVOKED"

    return await update_entity(
        db=db,
        model_class=SessionModel,
        entity_id=session_id,
        input_data=SessionRevokeInput(),
        to_graphql=session_to_graphql,
    )


async def delete_manager_session(db: AsyncSession, session_id: UUID) -> bool:
    """Manager 세션 삭제 (실제 삭제)"""
    return await delete_entity(
        db=db,
        model_class=SessionModel,
        entity_id=session_id,
        soft_delete=False,
    )


@strawberry.type
class ManagerSessionMutations:
    """Manager IDAM Sessions Mutation"""

    @strawberry.mutation(description="Manager 세션 폐기")
    async def revoke_manager_session(self, info, id: strawberry.ID) -> ManagerSession | None:
        """Manager 세션 폐기 (로그아웃)"""
        db = info.context.manager_db_session
        return await revoke_manager_session(db, UUID(id))

    @strawberry.mutation(description="Manager 세션 삭제")
    async def delete_manager_session(self, info, id: strawberry.ID) -> bool:
        """Manager 세션 완전 삭제"""
        db = info.context.manager_db_session
        return await delete_manager_session(db, UUID(id))
