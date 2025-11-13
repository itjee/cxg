"""Manager IDAM Roles - Field Resolvers

Type 필드의 복잡한 resolver 로직 구현
"""

from uuid import UUID

from sqlalchemy import select

from src.models.manager.idam import Permission, RolePermission


async def resolve_role_permissions(role_id: UUID, info) -> list:
    """
    역할에 할당된 권한 목록 조회

    Args:
        role_id: 조회할 역할 ID
        info: GraphQL 실행 컨텍스트

    Returns:
        list[ManagerPermission]: 권한 GraphQL 객체 리스트
    """
    db = info.context.manager_db_session

    # 1. Context에 등록된 전역 DataLoader 사용 시도 (최적화)
    loader = info.context.loaders.get("permissions_by_role_loader")
    if loader:
        return await loader.load(role_id)

    # 2. Fallback: 전역 loader가 없으면 직접 DB 조회
    # RolePermission 중간 테이블을 통해 Permission 조회
    result = await db.execute(
        select(Permission)
        .join(RolePermission, RolePermission.permission_id == Permission.id)
        .where(RolePermission.role_id == role_id)
        .order_by(Permission.category, Permission.resource, Permission.action)
    )
    permissions = result.scalars().all()

    # 3. Import를 여기서 하여 순환 참조 방지
    from ..permissions.queries import permission_to_graphql

    # 4. DB 모델을 GraphQL 타입으로 변환
    return [permission_to_graphql(perm) for perm in permissions]
