"""Manager IDAM Roles - Mutations

역할 생성 및 수정 Mutation 구현
공통 모듈을 사용한 표준화된 변경 로직
"""

from uuid import UUID

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import create_entity, update_entity
from src.models.manager.idam.role import Role as RoleModel

from .queries import role_to_graphql
from .types import Role, RoleCreateInput, RoleUpdateInput


async def create_role(db: AsyncSession, input_data: RoleCreateInput) -> Role:
    """
    Manager 역할 생성

    Args:
        db: 데이터베이스 세션
        input_data: 역할 생성 입력 데이터

    Returns:
        Role: 생성된 역할 객체
    """
    return await create_entity(
        db=db,
        model_class=RoleModel,
        input_data=input_data,
        to_graphql=role_to_graphql,
    )


async def update_role(
    db: AsyncSession, role_id: UUID, input_data: RoleUpdateInput
) -> Role | None:
    """
    Manager 역할 수정

    Args:
        db: 데이터베이스 세션
        role_id: 수정할 역할 ID
        input_data: 역할 수정 입력 데이터

    Returns:
        Role: 수정된 역할 객체 또는 None
    """
    return await update_entity(
        db=db,
        model_class=RoleModel,
        entity_id=role_id,
        input_data=input_data,
        to_graphql=role_to_graphql,
    )


@strawberry.type
class RoleMutations:
    """
    Manager IDAM Roles Mutation

    역할 생성 및 수정 관련 GraphQL Mutation을 제공합니다.
    """

    @strawberry.mutation(description="Manager 역할 생성")
    async def create_role(self, info, input: RoleCreateInput) -> Role:
        """
        새로운 역할 생성

        Args:
            input: 역할 생성 입력 데이터

        Returns:
            Role: 생성된 역할 객체

        Raises:
            Exception: 역할 코드 중복 등의 오류
        """
        db = info.context.manager_db_session
        return await create_role(db, input)

    @strawberry.mutation(description="Manager 역할 수정")
    async def update_role(
        self, info, id: strawberry.ID, input: RoleUpdateInput
    ) -> Role | None:
        """
        기존 역할 수정

        Args:
            id: 수정할 역할 ID
            input: 역할 수정 입력 데이터

        Returns:
            Role: 수정된 역할 객체 또는 None
        """
        db = info.context.manager_db_session
        return await update_role(db, UUID(id), input)
