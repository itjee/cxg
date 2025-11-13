"""Manager Auth - Queries

Manager 시스템 인증 관련 Query 구현
현재 로그인한 사용자의 정보를 조회합니다.
"""

from uuid import UUID

import strawberry
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.exceptions import NotFoundError, UnauthorizedError
from src.models.manager.idam import User

from .types import ManagerAuthUser


def user_to_graphql(user: User) -> ManagerAuthUser:
    """
    User 모델을 ManagerAuthUser GraphQL 타입으로 변환

    Args:
        user: 데이터베이스 User 모델

    Returns:
        ManagerAuthUser: GraphQL 타입
    """
    return ManagerAuthUser(
        id=strawberry.ID(str(user.id)),
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        user_type=user.user_type,
        status=user.status,
        created_at=user.created_at,
    )


async def get_current_user_info(db: AsyncSession, user_id: UUID) -> ManagerAuthUser:
    """
    현재 로그인한 사용자 정보 조회

    JWT 토큰에서 추출한 user_id로 사용자 정보를 조회합니다.
    비활성화된 계정은 접근을 거부합니다.

    Args:
        db: 데이터베이스 세션
        user_id: 사용자 ID (JWT 토큰에서 추출)

    Returns:
        ManagerAuthUser: 사용자 정보

    Raises:
        NotFoundError: 사용자를 찾을 수 없는 경우
        UnauthorizedError: 계정이 비활성화된 경우
    """
    # 사용자 조회
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise NotFoundError(message="사용자를 찾을 수 없습니다")

    # 계정 상태 확인
    if user.status != "ACTIVE":
        raise UnauthorizedError(message="비활성화된 계정입니다")

    return user_to_graphql(user)


@strawberry.type
class ManagerAuthQueries:
    """
    Manager Auth Queries

    Manager 시스템의 인증 관련 GraphQL Query들을 제공합니다.
    """

    @strawberry.field(description="현재 사용자 정보 조회")
    async def me(self, info) -> ManagerAuthUser:
        """
        현재 로그인한 사용자의 정보를 조회합니다.

        JWT 토큰이 필요하며, 토큰에서 추출한 user_id로 조회합니다.

        Returns:
            ManagerAuthUser: 로그인한 사용자 정보

        Raises:
            Exception: 데이터베이스 세션이 없는 경우
            NotFoundError: 사용자를 찾을 수 없는 경우
            UnauthorizedError: 계정이 비활성화된 경우
        """
        db = info.context.manager_db_session
        if not db:
            raise Exception("Manager database session not available")

        # JWT 토큰에서 user_id 추출
        user_id = UUID(info.context.user_id)
        return await get_current_user_info(db, user_id)
