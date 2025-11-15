"""Manager IDAM API Keys - Field Resolvers

API 키 관련 필드의 resolver 로직 구현
연관된 엔티티(사용자 등)를 조회하는 함수들을 제공합니다.
"""

from uuid import UUID

from sqlalchemy import select

from src.models.manager.idam import User


async def resolve_api_key_user(user_id: UUID, info):
    """
    API 키 소유자 정보 조회

    API 키에 연결된 사용자 정보를 조회합니다.
    DataLoader를 우선 사용하여 N+1 쿼리 문제를 방지합니다.

    Args:
        user_id: 조회할 사용자 ID
        info: GraphQL 실행 컨텍스트

    Returns:
        User: 사용자 GraphQL 객체 또는 None

    Note:
        - Context에 user_by_id_loader가 등록되어 있으면 사용
        - 없으면 직접 DB 조회
        - 사용자가 삭제되었거나 없는 경우 None 반환
    """
    db = info.context.manager_db_session

    # 1. DataLoader 사용 시도 (N+1 쿼리 최적화)
    loader = info.context.loaders.get("user_by_id_loader")
    if loader:
        return await loader.load(user_id)

    # 2. Fallback: 직접 조회
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        return None

    # 3. Import를 여기서 하여 순환 참조 방지
    from ..users.queries import user_to_graphql

    # 4. DB 모델을 GraphQL 타입으로 변환
    return user_to_graphql(user)
