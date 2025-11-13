"""Manager IDAM Users - Mutations

사용자 생성 및 수정 Mutation 구현
공통 모듈을 사용한 표준화된 변경 로직
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
    """
    사용자 생성 데이터 준비

    비밀번호를 해싱하여 안전하게 저장할 수 있도록 데이터를 준비합니다.

    Args:
        input_data: 사용자 생성 입력 데이터

    Returns:
        dict: 데이터베이스에 저장할 준비된 데이터
    """
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


async def create_manager_user(db: AsyncSession, input_data: ManagerUserCreateInput) -> ManagerUser:
    """
    Manager 사용자 생성

    새로운 Manager 시스템 사용자를 생성합니다.
    비밀번호는 자동으로 해싱되어 안전하게 저장됩니다.

    Args:
        db: 데이터베이스 세션
        input_data: 사용자 생성 입력 데이터

    Returns:
        ManagerUser: 생성된 사용자 객체

    Raises:
        Exception: 중복된 username 또는 email 등의 오류
    """
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
    """
    Manager 사용자 수정

    기존 사용자의 정보를 업데이트합니다.
    비밀번호는 별도의 Mutation을 통해 변경해야 합니다.

    Args:
        db: 데이터베이스 세션
        user_id: 수정할 사용자 ID
        input_data: 사용자 수정 입력 데이터

    Returns:
        ManagerUser: 수정된 사용자 객체 또는 None
    """
    return await update_entity(
        db=db,
        model_class=UserModel,
        entity_id=user_id,
        input_data=input_data,
        to_graphql=user_to_graphql,
    )


@strawberry.type
class ManagerUserMutations:
    """
    Manager IDAM Users Mutation

    사용자 생성 및 수정 관련 GraphQL Mutation을 제공합니다.
    """

    @strawberry.mutation(description="Manager 사용자 생성")
    async def create_manager_user(self, info, input: ManagerUserCreateInput) -> ManagerUser:
        """
        새로운 Manager 사용자 생성

        Args:
            input: 사용자 생성 입력 데이터

        Returns:
            ManagerUser: 생성된 사용자 객체
        """
        db = info.context.manager_db_session
        return await create_manager_user(db, input)

    @strawberry.mutation(description="Manager 사용자 수정")
    async def update_manager_user(
        self, info, id: strawberry.ID, input: ManagerUserUpdateInput
    ) -> ManagerUser | None:
        """
        기존 Manager 사용자 수정

        Args:
            id: 수정할 사용자 ID
            input: 사용자 수정 입력 데이터

        Returns:
            ManagerUser: 수정된 사용자 객체 또는 None
        """
        db = info.context.manager_db_session
        return await update_manager_user(db, UUID(id), input)
