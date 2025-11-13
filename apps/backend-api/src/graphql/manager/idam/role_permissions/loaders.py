"""Manager IDAM Role Permissions - DataLoaders

공통 모듈을 사용한 DataLoader 구현

DataLoader는 GraphQL 쿼리 실행 중 발생하는 N+1 쿼리 문제를 해결합니다.
여러 번의 개별 조회를 하나의 배치 조회로 최적화하여 DB 부하를 줄입니다.
"""

from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import BaseDataLoader
from src.models.manager.idam.role_permission import RolePermission as RolePermissionModel


class ManagerRolePermissionLoader(BaseDataLoader[RolePermissionModel]):
    """Manager 역할-권한 매핑 DataLoader

    N+1 쿼리 문제 해결:
    - 여러 RolePermission을 조회할 때 개별 쿼리 대신 배치 쿼리 사용
    - BaseDataLoader를 상속하여 공통 배치 로딩 로직 활용
    """

    def __init__(self, db: AsyncSession):
        super().__init__(db, RolePermissionModel)
