"""Manager IDAM Users - Field Resolvers

Type 필드의 복잡한 resolver 로직 구현
"""

from uuid import UUID

from sqlalchemy import select

from src.models.manager.idam.user_role import UserRole as UserRoleModel


async def resolve_manager_user_roles(user_id: UUID, info):
    """
    사용자에게 할당된 역할 목록 조회

    사용자가 가진 모든 활성(ACTIVE) 상태의 역할을 조회합니다.
    UserRole 중간 테이블을 통해 Role과 연결됩니다.

    Args:
        user_id: 조회할 사용자 ID
        info: GraphQL 실행 컨텍스트

    Returns:
        list[ManagerRole]: 역할 GraphQL 객체 리스트
    """
    db = info.context.manager_db_session

    # 1. Context에 등록된 전역 DataLoader 사용 시도 (최적화)
    loader = info.context.loaders.get("roles_by_user_loader")
    if loader:
        return await loader.load(user_id)

    # 2. Fallback: 전역 loader가 없으면 직접 DB 조회
    # ACTIVE 상태의 UserRole 조회
    from src.models.manager.idam.role import Role as RoleModel

    result = await db.execute(
        select(RoleModel)
        .join(UserRoleModel, UserRoleModel.role_id == RoleModel.id)
        .where(UserRoleModel.user_id == user_id, UserRoleModel.status == "ACTIVE")
        .order_by(RoleModel.priority)
    )
    roles = result.scalars().all()

    # 3. Import를 여기서 하여 순환 참조 방지
    from ..roles.queries import manager_role_to_graphql

    # 4. DB 모델을 GraphQL 타입으로 변환
    return [manager_role_to_graphql(role) for role in roles]


async def resolve_manager_user_sessions(user_id: UUID, info, status: str | None = None):
    """
    사용자의 세션 목록 조회

    사용자가 생성한 모든 세션을 조회합니다.
    선택적으로 상태별 필터링이 가능합니다.

    Args:
        user_id: 조회할 사용자 ID
        info: GraphQL 실행 컨텍스트
        status: 세션 상태 필터 (선택, 예: ACTIVE, EXPIRED, REVOKED)

    Returns:
        list[ManagerSession]: 세션 GraphQL 객체 리스트
    """
    db = info.context.manager_db_session

    from src.models.manager.idam.session import Session as SessionModel

    # 세션 조회 쿼리 구성
    query = select(SessionModel).where(SessionModel.user_id == user_id)

    if status:
        query = query.where(SessionModel.status == status)

    query = query.order_by(SessionModel.created_at.desc()).limit(100)

    result = await db.execute(query)
    sessions = result.scalars().all()

    # Import를 여기서 하여 순환 참조 방지
    from ..sessions.queries import manager_session_to_graphql

    # DB 모델을 GraphQL 타입으로 변환
    graphql_sessions = []
    for session in sessions:
        graphql_session = await manager_session_to_graphql(session, db)
        graphql_sessions.append(graphql_session)
    return graphql_sessions


async def resolve_manager_user_permissions(user_id: UUID, info):
    """
    사용자의 유효 권한 목록 조회

    사용자가 가진 모든 역할을 통해 부여된 권한들을 조회합니다.
    중복 권한은 제거하고 고유한 권한 목록을 반환합니다.

    Args:
        user_id: 조회할 사용자 ID
        info: GraphQL 실행 컨텍스트

    Returns:
        list[ManagerPermission]: 권한 GraphQL 객체 리스트
    """
    db = info.context.manager_db_session

    from src.models.manager.idam.permission import Permission as PermissionModel
    from src.models.manager.idam.role import Role as RoleModel
    from src.models.manager.idam.role_permission import RolePermission as RolePermissionModel

    # 사용자 → UserRole → Role → RolePermission → Permission 경로로 조회
    result = await db.execute(
        select(PermissionModel)
        .distinct()
        .join(RolePermissionModel, RolePermissionModel.permission_id == PermissionModel.id)
        .join(RoleModel, RoleModel.id == RolePermissionModel.role_id)
        .join(UserRoleModel, UserRoleModel.role_id == RoleModel.id)
        .where(UserRoleModel.user_id == user_id, UserRoleModel.status == "ACTIVE")
        .order_by(PermissionModel.category, PermissionModel.resource, PermissionModel.action)
    )
    permissions = result.scalars().all()

    # Import를 여기서 하여 순환 참조 방지
    from ..permissions.queries import manager_permission_to_graphql

    # DB 모델을 GraphQL 타입으로 변환
    return [manager_permission_to_graphql(permission) for permission in permissions]
