"""공통 GraphQL CRUD 모듈 사용 예제

이 파일은 공통 모듈을 사용하여 GraphQL CRUD를 간단하게 구현하는 방법을 보여줍니다.
"""

from uuid import UUID

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import (
    BaseDataLoader,
    BaseFieldLoader,
    create_entity,
    get_by_id,
    get_list,
    update_entity,
)
from src.models.manager.idam.user import User as UserModel


# ============================================================================
# 1. Types 정의 (기존 방식 유지)
# ============================================================================


@strawberry.type(description="Manager 사용자")
class User:
    """Manager 시스템 사용자"""

    id: strawberry.ID
    user_type: str
    full_name: str
    email: str
    username: str
    # ... 기타 필드


@strawberry.input
class UserCreateInput:
    """Manager 사용자 생성 입력"""

    user_type: str
    full_name: str
    email: str
    username: str
    password: str


@strawberry.input
class UserUpdateInput:
    """Manager 사용자 수정 입력"""

    full_name: str | None = None
    email: str | None = None
    # ... 기타 필드


# ============================================================================
# 2. Loaders (공통 베이스 클래스 사용)
# ============================================================================


class UserLoader(BaseDataLoader[UserModel]):
    """Manager 사용자 DataLoader"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, UserModel)


class UserByUsernameLoader(BaseFieldLoader[UserModel]):
    """Username으로 사용자 조회 DataLoader"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, UserModel, "username")


class UserByEmailLoader(BaseFieldLoader[UserModel]):
    """Email로 사용자 조회 DataLoader"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, UserModel, "email")


# ============================================================================
# 3. Converter 함수
# ============================================================================


def user_model_to_graphql(user: UserModel) -> User:
    """UserModel을 User GraphQL 타입으로 변환"""
    return User(
        id=strawberry.ID(str(user.id)),
        user_type=user.user_type,
        full_name=user.full_name,
        email=user.email,
        username=user.username,
        # ... 기타 필드 매핑
    )


# 또는 자동 변환 사용
# to_graphql_user = model_to_graphql_converter(User)


# ============================================================================
# 4. Queries (공통 헬퍼 함수 사용)
# ============================================================================


async def get_user_by_id_v2(db: AsyncSession, user_id: UUID) -> User | None:
    """ID로 Manager 사용자 조회 (공통 함수 사용)"""
    return await get_by_id(
        db=db, model_class=UserModel, id_=user_id, to_graphql=user_model_to_graphql
    )


async def get_users_v2(db: AsyncSession, limit: int = 20, offset: int = 0) -> list[User]:
    """Manager 사용자 목록 조회 (공통 함수 사용)"""
    return await get_list(
        db=db,
        model_class=UserModel,
        to_graphql=user_model_to_graphql,
        limit=limit,
        offset=offset,
        order_by=UserModel.created_at.desc(),
    )


@strawberry.type
class UserQueriesV2:
    """Manager IDAM Users Query (공통 모듈 사용 버전)"""

    @strawberry.field(description="Manager 사용자 조회 (ID)")
    async def user_v2(self, info, id: strawberry.ID) -> User | None:
        """Manager 사용자 단건 조회"""
        db = info.context.manager_db_session
        return await get_user_by_id_v2(db, UUID(id))

    @strawberry.field(description="Manager 사용자 목록")
    async def users_v2(self, info, limit: int = 20, offset: int = 0) -> list[User]:
        """Manager 사용자 목록 조회"""
        db = info.context.manager_db_session
        return await get_users_v2(db, limit, offset)


# ============================================================================
# 5. Mutations (공통 헬퍼 함수 사용)
# ============================================================================


def prepare_user_create_data(input_data: UserCreateInput) -> dict:
    """생성 데이터 준비 (비밀번호 해싱 등)"""
    from src.core.security import hash_password

    return {
        "user_type": input_data.user_type,
        "full_name": input_data.full_name,
        "email": input_data.email,
        "username": input_data.username,
        "password": hash_password(input_data.password),
    }


async def create_user_v2(db: AsyncSession, input_data: UserCreateInput) -> User:
    """Manager 사용자 생성 (공통 함수 사용)"""
    return await create_entity(
        db=db,
        model_class=UserModel,
        input_data=input_data,
        to_graphql=user_model_to_graphql,
        prepare_data=prepare_user_create_data,
    )


async def update_user_v2(
    db: AsyncSession, user_id: UUID, input_data: UserUpdateInput
) -> User | None:
    """Manager 사용자 수정 (공통 함수 사용)"""
    return await update_entity(
        db=db,
        model_class=UserModel,
        entity_id=user_id,
        input_data=input_data,
        to_graphql=user_model_to_graphql,
    )


@strawberry.type
class UserMutationsV2:
    """Manager IDAM Users Mutation (공통 모듈 사용 버전)"""

    @strawberry.mutation(description="Manager 사용자 생성")
    async def create_user_v2(self, info, input: UserCreateInput) -> User:
        """Manager 사용자 생성"""
        db = info.context.manager_db_session
        return await create_user_v2(db, input)

    @strawberry.mutation(description="Manager 사용자 수정")
    async def update_user_v2(self, info, id: strawberry.ID, input: UserUpdateInput) -> User | None:
        """Manager 사용자 수정"""
        db = info.context.manager_db_session
        return await update_user_v2(db, UUID(id), input)


# ============================================================================
# 6. Permissions (공통 베이스 클래스 사용)
# ============================================================================

from src.graphql.common import CanManage, CanView, create_permission_class


# 방법 1: 베이스 클래스 상속
class CanViewUsers(CanView):
    """Manager 사용자 목록 조회 권한"""

    resource = "users"
    message = "Manager 사용자 목록을 조회할 권한이 없습니다"


class CanManageUsers(CanManage):
    """Manager 사용자 관리 권한"""

    resource = "users"
    message = "Manager 사용자를 관리할 권한이 없습니다"


# 방법 2: 동적 생성
CanViewUsersDynamic = create_permission_class(
    resource="users", action="view", message="Manager 사용자 목록을 조회할 권한이 없습니다"
)
