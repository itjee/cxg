"""Manager IDAM Users - Queries

공통 모듈을 사용한 Query 구현
"""

from uuid import UUID

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import get_by_id, get_list
from src.models.manager.idam.user import User as UserModel

from .types import ManagerUser


def user_to_graphql(user: UserModel) -> ManagerUser:
    """UserModel을 ManagerUser GraphQL 타입으로 변환"""
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


async def get_manager_user_by_id(db: AsyncSession, user_id: UUID) -> ManagerUser | None:
    """ID로 Manager 사용자 조회"""
    return await get_by_id(
        db=db,
        model_class=UserModel,
        id_=user_id,
        to_graphql=user_to_graphql,
    )


async def get_manager_users(
    db: AsyncSession, limit: int = 20, offset: int = 0
) -> list[ManagerUser]:
    """Manager 사용자 목록 조회"""
    return await get_list(
        db=db,
        model_class=UserModel,
        to_graphql=user_to_graphql,
        limit=limit,
        offset=offset,
        order_by=UserModel.created_at.desc(),
    )


@strawberry.type
class ManagerUserQueries:
    """Manager IDAM Users Query"""

    @strawberry.field(description="Manager 사용자 조회 (ID)")
    async def manager_user(self, info, id: strawberry.ID) -> ManagerUser | None:
        """Manager 사용자 단건 조회"""
        db = info.context.manager_db_session
        return await get_manager_user_by_id(db, UUID(id))

    @strawberry.field(description="Manager 사용자 목록")
    async def manager_users(self, info, limit: int = 20, offset: int = 0) -> list[ManagerUser]:
        """Manager 사용자 목록 조회"""
        db = info.context.manager_db_session
        return await get_manager_users(db, limit, offset)
