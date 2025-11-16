"""Manager IDAM RolePermissions - Field Resolvers

Type 필드의 복잡한 resolver 로직 구현
"""

from uuid import UUID


async def resolve_manager_role_permission_role(role_id: UUID, info):
    """
    역할 정보 조회

    Args:
        role_id: 조회할 역할 ID
        info: GraphQL 실행 컨텍스트

    Returns:
        ManagerRole: 역할 GraphQL 객체 또는 None
    """
    db = info.context.manager_db_session

    # 1. Context에 등록된 전역 DataLoader 사용 시도 (최적화)
    loader = info.context.loaders.get("role_by_id_loader")
    if loader:
        role_model = await loader.load(role_id)
    else:
        # 2. Fallback: 전역 loader가 없으면 직접 loader 생성
        from ..roles.loaders import ManagerRoleLoader

        loader = ManagerRoleLoader(db)
        role_model = await loader.load(str(role_id))

    # 3. 조회 결과가 없으면 None 반환
    if not role_model:
        return None

    # 4. DB 모델을 GraphQL 타입으로 변환
    from ..roles.queries import manager_role_to_graphql

    return manager_role_to_graphql(role_model)


async def resolve_manager_role_permission_permission(permission_id: UUID, info):
    """
    권한 정보 조회

    Args:
        permission_id: 조회할 권한 ID
        info: GraphQL 실행 컨텍스트

    Returns:
        ManagerPermission: 권한 GraphQL 객체 또는 None
    """
    db = info.context.manager_db_session

    # 1. Context에 등록된 전역 DataLoader 사용 시도 (최적화)
    loader = info.context.loaders.get("permission_by_id_loader")
    if loader:
        permission_model = await loader.load(permission_id)
    else:
        # 2. Fallback: 전역 loader가 없으면 직접 loader 생성
        from ..permissions.loaders import ManagerPermissionLoader

        loader = ManagerPermissionLoader(db)
        permission_model = await loader.load(str(permission_id))

    # 3. 조회 결과가 없으면 None 반환
    if not permission_model:
        return None

    # 4. DB 모델을 GraphQL 타입으로 변환
    from ..permissions.queries import manager_permission_to_graphql

    return manager_permission_to_graphql(permission_model)
