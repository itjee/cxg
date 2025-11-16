"""Manager IDAM Users - Queries

사용자 조회 Query 구현
공통 모듈을 사용한 표준화된 조회 로직
"""

from uuid import UUID

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import get_by_id, get_list
from src.models.manager.idam.user import User as UserModel

from .types import ManagerUser


def manager_user_to_graphql(user: UserModel) -> ManagerUser:
    """
    UserModel(DB 모델)을 User(GraphQL 타입)으로 변환

    Args:
        user: 데이터베이스 사용자 모델

    Returns:
        ManagerUser: GraphQL 사용자 타입
    """
    return ManagerUser(
        id=strawberry.ID(str(user.id)),
        user_type=user.user_type,
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        username=user.username,
        sso_provider=user.sso_provider,
        sso_subject=user.sso_subject,
        mfa_enabled=user.mfa_enabled,
        status=user.status,
        last_login_at=user.last_login_at,
        last_login_ip=str(user.last_login_ip) if user.last_login_ip else None,
        failed_login_attempts=user.failed_login_attempts,
        force_password_change=user.force_password_change,
        timezone=user.timezone or "UTC",
        locale=user.locale or "ko-KR",
        department=user.department,
        position=user.position,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )


async def get_manager_user_by_id(db: AsyncSession, user_id: UUID) -> "ManagerUser | None":
    """
    ID로 Manager 사용자 단건 조회

    Args:
        db: 데이터베이스 세션
        user_id: 조회할 사용자 ID

    Returns:
        User: 사용자 객체 또는 None
    """
    return await get_by_id(
        db=db,
        model_class=UserModel,
        id_=user_id,
        to_graphql=manager_user_to_graphql,
    )


async def get_manager_users(
    db: AsyncSession,
    limit: int = 20,
    offset: int = 0,
    user_type: str | None = None,
    status: str | None = None,
) -> "list[ManagerUser]":
    """
    Manager 사용자 목록 조회

    Args:
        db: 데이터베이스 세션
        limit: 조회 개수 (기본값: 20)
        offset: 건너뛸 개수 (페이징용)
        user_type: 사용자 타입 필터 (선택)
        status: 상태 필터 (선택)

    Returns:
        list[User]: 사용자 객체 리스트
    """
    # 필터 조건 구성
    filters = {}
    if user_type:
        filters["user_type"] = user_type
    if status:
        filters["status"] = status

    # 공통 모듈을 사용한 리스트 조회
    return await get_list(
        db=db,
        model_class=UserModel,
        to_graphql=manager_user_to_graphql,
        limit=limit,
        offset=offset,
        order_by=UserModel.created_at.desc(),  # 최신 순으로 정렬
        **filters,
    )


@strawberry.type
class ManagerUserQueries:
    """
    Manager IDAM Users Query

    사용자 조회 관련 GraphQL 쿼리를 제공합니다.
    """

    @strawberry.field(description="Manager 사용자 조회 (ID)")
    async def user(self, info, id: strawberry.ID) -> "ManagerUser | None":
        """
        ID로 사용자 단건 조회

        Args:
            id: 사용자 ID

        Returns:
            User: 사용자 객체 또는 None
        """
        db = info.context.manager_db_session
        return await get_manager_user_by_id(db, UUID(id))

    @strawberry.field(description="Manager 사용자 목록")
    async def users(
        self,
        info,
        limit: int = 20,
        offset: int = 0,
        user_type: str | None = None,
        status: str | None = None,
    ) -> "list[ManagerUser]":
        """
        사용자 목록 조회 (페이징 및 필터링 지원)

        Args:
            limit: 조회 개수
            offset: 건너뛸 개수
            user_type: 사용자 타입 필터
            status: 상태 필터

        Returns:
            list[User]: 사용자 객체 리스트
        """
        db = info.context.manager_db_session
        return await get_manager_users(db, limit, offset, user_type, status)
