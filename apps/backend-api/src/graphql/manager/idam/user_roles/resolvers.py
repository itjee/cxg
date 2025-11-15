"""Manager IDAM UserRoles - Field Resolvers

Type 필드의 복잡한 resolver 로직 구현
"""

from uuid import UUID

from sqlalchemy import select

from src.models.manager.idam.role import Role as RoleModel
from src.models.manager.idam.user import User as UserModel


async def resolve_user_role_user(user_id: UUID, info):
    """
    사용자-역할 매핑의 사용자 정보 조회

    Args:
        user_id: 조회할 사용자 ID
        info: GraphQL 실행 컨텍스트

    Returns:
        User: 사용자 GraphQL 객체 또는 None
    """
    db = info.context.manager_db_session

    # 1. Context에 등록된 전역 DataLoader 사용 시도 (최적화)
    loader = info.context.loaders.get("user_loader")
    if loader:
        user_model = await loader.load(user_id)
        if user_model:
            from ..users.queries import user_to_graphql

            return user_to_graphql(user_model)
        return None

    # 2. Fallback: 전역 loader가 없으면 직접 DB 조회
    result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    user_model = result.scalar_one_or_none()

    if not user_model:
        return None

    # 3. Import를 여기서 하여 순환 참조 방지
    from ..users.queries import user_to_graphql

    # 4. DB 모델을 GraphQL 타입으로 변환
    return user_to_graphql(user_model)


async def resolve_user_role_role(role_id: UUID, info):
    """
    사용자-역할 매핑의 역할 정보 조회

    Args:
        role_id: 조회할 역할 ID
        info: GraphQL 실행 컨텍스트

    Returns:
        ManagerRole: 역할 GraphQL 객체 또는 None
    """
    db = info.context.manager_db_session

    # 1. Context에 등록된 전역 DataLoader 사용 시도 (최적화)
    loader = info.context.loaders.get("role_loader")
    if loader:
        role_model = await loader.load(role_id)
        if role_model:
            from ..roles.queries import role_to_graphql

            return role_to_graphql(role_model)
        return None

    # 2. Fallback: 전역 loader가 없으면 직접 DB 조회
    result = await db.execute(select(RoleModel).where(RoleModel.id == role_id))
    role_model = result.scalar_one_or_none()

    if not role_model:
        return None

    # 3. Import를 여기서 하여 순환 참조 방지
    from ..roles.queries import role_to_graphql

    # 4. DB 모델을 GraphQL 타입으로 변환
    return role_to_graphql(role_model)


async def resolve_granted_by_user(granted_by_id: UUID, info):
    """
    역할 부여자 정보 조회

    Args:
        granted_by_id: 조회할 부여자(사용자) ID
        info: GraphQL 실행 컨텍스트

    Returns:
        User: 부여자 GraphQL 객체 또는 None
    """
    # granted_by도 사용자이므로 같은 로직 사용
    return await resolve_user_role_user(granted_by_id, info)
