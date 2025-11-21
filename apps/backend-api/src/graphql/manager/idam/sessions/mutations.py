"""Manager IDAM Sessions - Mutations

세션 폐기 및 삭제 Mutation 구현
공통 모듈을 사용한 표준화된 변경 로직
"""

from uuid import UUID

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import delete_entity, update_entity
from src.models.manager.idam.session import Session as SessionModel

from .queries import manager_session_to_graphql
from .types import ManagerSession


@strawberry.input
class UpdateSessionInput:
    """세션 수정 입력 타입"""
    status: str | None = strawberry.field(default=None, description="세션 상태")
    mfa_verified: bool | None = strawberry.field(default=None, description="MFA 검증 여부")


async def update_manager_session(
    db: AsyncSession, session_id: UUID, input_data: UpdateSessionInput
) -> ManagerSession | None:
    """
    Manager 세션 수정

    세션의 상태나 MFA 검증 상태를 업데이트합니다.

    Args:
        db: 데이터베이스 세션
        session_id: 수정할 세션 ID
        input_data: 수정할 데이터

    Returns:
        ManagerSession: 수정된 세션 객체 또는 None
    """
    # input_data를 dict로 변환하되, None 값은 제외
    update_dict = {}
    if input_data.status is not None:
        update_dict["status"] = input_data.status
    if input_data.mfa_verified is not None:
        update_dict["mfa_verified"] = input_data.mfa_verified

    # 수정할 필드가 없으면 early return
    if not update_dict:
        # 기존 세션 반환
        from .queries import get_manager_session_by_id
        return await get_manager_session_by_id(db, session_id)

    return await update_entity(
        db=db,
        model_class=SessionModel,
        entity_id=session_id,
        input_data=type('UpdateInput', (), update_dict)(),
        to_graphql=manager_session_to_graphql,
    )


async def revoke_manager_session(db: AsyncSession, session_id: UUID) -> ManagerSession | None:
    """
    Manager 세션 폐기 (로그아웃 처리)

    세션 상태를 REVOKED로 변경하여 더 이상 사용할 수 없게 만듭니다.
    실제 데이터는 삭제하지 않고 감사 목적으로 보존합니다.

    Args:
        db: 데이터베이스 세션
        session_id: 폐기할 세션 ID

    Returns:
        ManagerSession: 폐기된 세션 객체 또는 None
    """

    # 세션 조회 및 상태 업데이트를 위한 간단한 input 객체 생성
    class SessionRevokeInput:
        status = "REVOKED"

    return await update_entity(
        db=db,
        model_class=SessionModel,
        entity_id=session_id,
        input_data=SessionRevokeInput(),
        to_graphql=manager_session_to_graphql,
    )


async def delete_manager_session(db: AsyncSession, session_id: UUID) -> bool:
    """
    Manager 세션 완전 삭제

    세션 데이터를 데이터베이스에서 완전히 삭제합니다.
    일반적으로 폐기(revoke)를 사용하고, 삭제는 관리 목적으로만 사용합니다.

    Args:
        db: 데이터베이스 세션
        session_id: 삭제할 세션 ID

    Returns:
        bool: 삭제 성공 여부
    """
    return await delete_entity(
        db=db,
        model_class=SessionModel,
        entity_id=session_id,
        soft_delete=False,
    )


@strawberry.type
class ManagerSessionMutations:
    """
    Manager IDAM Sessions Mutation

    세션 폐기 및 삭제 관련 GraphQL Mutation을 제공합니다.
    """

    @strawberry.mutation(description="Manager 세션 수정")
    async def update_session(
        self, info, id: strawberry.ID, input: UpdateSessionInput
    ) -> ManagerSession | None:
        """
        세션 수정 (상태, MFA 검증 여부)

        Args:
            id: 수정할 세션 ID
            input: 수정할 데이터

        Returns:
            ManagerSession: 수정된 세션 객체 또는 None
        """
        db = info.context.manager_db_session
        return await update_manager_session(db, UUID(id), input)

    @strawberry.mutation(description="Manager 세션 폐기")
    async def revoke_session(self, info, id: strawberry.ID) -> ManagerSession | None:
        """
        세션 폐기 (로그아웃 처리)

        Args:
            id: 폐기할 세션 ID

        Returns:
            ManagerSession: 폐기된 세션 객체 또는 None
        """
        db = info.context.manager_db_session
        return await revoke_manager_session(db, UUID(id))

    @strawberry.mutation(description="Manager 세션 삭제")
    async def delete_session(self, info, id: strawberry.ID) -> bool:
        """
        세션 완전 삭제

        Args:
            id: 삭제할 세션 ID

        Returns:
            bool: 삭제 성공 여부
        """
        db = info.context.manager_db_session
        return await delete_manager_session(db, UUID(id))
