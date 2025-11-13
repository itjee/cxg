"""Manager IDAM Users - Mutations

공통 모듈을 사용한 Mutation 구현
"""

from uuid import UUID

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.security import hash_password
from src.graphql.common import create_entity, update_entity
from src.models.manager.idam.user import User as UserModel

from .queries import user_to_graphql
from .types import ManagerUser, ManagerUserCreateInput, ManagerUserUpdateInput


def prepare_user_create_data(input_data: ManagerUserCreateInput) -> dict:
    """사용자 생성 데이터 준비 (비밀번호 해싱)"""
    return {
        "user_type": input_data.user_type,
        "full_name": input_data.full_name,
        "email": input_data.email,
        "username": input_data.username,
        "password": hash_password(input_data.password),
        "phone": input_data.phone,
        "department": input_data.department,
        "position": input_data.position,
    }


async def create_manager_user(
    db: AsyncSession, input_data: ManagerUserCreateInput
) -> ManagerUser:
    """Manager 사용자 생성"""
    return await create_entity(
        db=db,
        model_class=UserModel,
        input_data=input_data,
        to_graphql=user_to_graphql,
        prepare_data=prepare_user_create_data,
    )


async def update_manager_user(
    db: AsyncSession, user_id: UUID, input_data: ManagerUserUpdateInput
) -> ManagerUser | None:
    """Manager 사용자 수정"""
    return await update_entity(
        db=db,
        model_class=UserModel,
        entity_id=user_id,
        input_data=input_data,
        to_graphql=user_to_graphql,
    )


@strawberry.type
class ManagerUserMutations:
    """Manager IDAM Users Mutation"""

    @strawberry.mutation(description="Manager 사용자 생성")
    async def create_manager_user(self, info, input: ManagerUserCreateInput) -> ManagerUser:
        """Manager 사용자 생성"""
        db = info.context.manager_db_session
        return await create_manager_user(db, input)

    @strawberry.mutation(description="Manager 사용자 수정")
    async def update_manager_user(
        self, info, id: strawberry.ID, input: ManagerUserUpdateInput
    ) -> ManagerUser | None:
        """Manager 사용자 수정"""
        db = info.context.manager_db_session
        return await update_manager_user(db, UUID(id), input)
