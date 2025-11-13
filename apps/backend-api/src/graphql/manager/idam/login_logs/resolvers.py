"""Manager IDAM Login Logs - Field Resolvers

로그인 이력 관련 필드의 resolver 로직 구현
연관된 엔티티(사용자 등)를 조회하는 함수들을 제공합니다.
"""

from uuid import UUID

from sqlalchemy import select

from src.models.manager.idam import User


async def resolve_login_log_user(user_id: UUID | None, info):
    """
    로그인 이력 사용자 정보 조회

    로그인 이력에 연결된 사용자 정보를 조회합니다.
    DataLoader를 우선 사용하여 N+1 쿼리 문제를 방지합니다.

    Args:
        user_id: 조회할 사용자 ID (None일 수 있음)
        info: GraphQL 실행 컨텍스트

    Returns:
        ManagerUser: 사용자 GraphQL 객체 또는 None

    Note:
        - user_id가 None이면 즉시 None 반환 (로그인 실패 시)
        - Context에 user_by_id_loader가 등록되어 있으면 사용
        - 없으면 직접 DB 조회
        - 사용자가 삭제되었거나 없는 경우 None 반환

    사용 시나리오:
        1. 로그인 성공: user_id 있음 → 사용자 정보 반환
        2. 로그인 실패 (사용자 없음): user_id 없음 → None 반환
        3. 로그인 실패 (비밀번호 오류): user_id 있음 → 사용자 정보 반환 (추가 보안 체크 필요)
    """
    # 1. user_id가 None이면 즉시 None 반환
    if user_id is None:
        return None

    db = info.context.manager_db_session

    # 2. DataLoader 사용 시도 (N+1 쿼리 최적화)
    loader = info.context.loaders.get("user_by_id_loader")
    if loader:
        return await loader.load(user_id)

    # 3. Fallback: 직접 조회
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        return None

    # 4. Import를 여기서 하여 순환 참조 방지
    from ..users.queries import user_to_graphql

    # 5. DB 모델을 GraphQL 타입으로 변환
    return user_to_graphql(user)
