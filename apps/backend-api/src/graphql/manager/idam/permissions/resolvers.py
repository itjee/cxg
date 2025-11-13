"""Manager IDAM Permissions - Field Resolvers

권한 관련 필드의 resolver 로직 구현
권한과 연관된 엔티티(역할 등)를 조회하는 함수들을 제공합니다.
"""

from uuid import UUID

from sqlalchemy import select

from src.models.manager.idam import Role, RolePermission


async def resolve_permission_roles(permission_id: UUID, info) -> list:
    """
    권한에 할당된 역할 목록 조회

    특정 권한이 어떤 역할들에 할당되어 있는지 조회합니다.
    권한의 영향 범위를 파악하거나, 권한을 가진 사용자를 추적할 때 사용됩니다.

    Args:
        permission_id: 조회할 권한 ID
        info: GraphQL 실행 컨텍스트

    Returns:
        list[ManagerRole]: 이 권한을 가진 역할 목록

    Note:
        - DataLoader를 우선 사용하여 N+1 쿼리 방지
        - 역할명(name) 기준으로 정렬됩니다
        - 비활성 역할도 포함됩니다 (필요시 필터링)

    사용 시나리오:
        1. 권한 영향 분석: 이 권한을 변경하면 어떤 역할에 영향을 주는가?
        2. 역할 추적: 특정 권한을 가진 역할 목록 확인
        3. 권한 할당 현황: 어떤 역할들이 이 권한을 사용하고 있는가?

    예시:
        - "users.create" 권한 → ["관리자", "사용자 관리자"] 역할
        - "billing.read" 권한 → ["관리자", "재무 담당자"] 역할
    """
    db = info.context.manager_db_session

    # 1. DataLoader 사용 시도 (N+1 쿼리 최적화)
    loader = info.context.loaders.get("roles_by_permission_loader")
    if loader:
        return await loader.load(permission_id)

    # 2. Fallback: 직접 조회
    # RolePermission 중간 테이블을 통해 Role 조회
    result = await db.execute(
        select(Role)
        .join(RolePermission, RolePermission.role_id == Role.id)
        .where(RolePermission.permission_id == permission_id)
        .order_by(Role.name)  # 역할명 기준 정렬
    )
    roles = result.scalars().all()

    # 3. Import를 여기서 하여 순환 참조 방지
    from ..roles.queries import role_to_graphql

    # 4. DB 모델을 GraphQL 타입으로 변환
    return [role_to_graphql(role) for role in roles]
