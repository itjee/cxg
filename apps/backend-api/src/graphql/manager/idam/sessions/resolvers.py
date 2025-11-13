"""Manager IDAM Sessions - Field Resolvers

Type 필드의 복잡한 resolver 로직 구현
"""

from uuid import UUID

from sqlalchemy import select

from src.models.manager.idam.user import User as UserModel


async def resolve_session_user(user_id: UUID, info):
    """
    세션의 사용자 정보 조회

    Args:
        user_id: 조회할 사용자 ID
        info: GraphQL 실행 컨텍스트

    Returns:
        ManagerUser: 사용자 GraphQL 객체 또는 None
    """
    db = info.context.manager_db_session

    # 1. Context에 등록된 전역 DataLoader 사용 시도 (최적화)
    loader = info.context.loaders.get("manager_user_loader")
    if loader:
        user = await loader.load(user_id)
        if user:
            from ..users.queries import user_to_graphql

            return user_to_graphql(user)
        return None

    # 2. Fallback: 전역 loader가 없으면 직접 DB 조회
    result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        return None

    # 3. Import를 여기서 하여 순환 참조 방지
    from ..users.queries import user_to_graphql

    # 4. DB 모델을 GraphQL 타입으로 변환
    return user_to_graphql(user)
