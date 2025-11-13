"""Manager IDAM Role Permissions - DataLoaders

공통 모듈을 사용한 DataLoader 구현
"""

from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import BaseDataLoader
from src.models.manager.idam.role_permission import RolePermission as RolePermissionModel


class ManagerRolePermissionLoader(BaseDataLoader[RolePermissionModel]):
    """Manager 역할-권한 매핑 DataLoader (N+1 쿼리 최적화)"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, RolePermissionModel)
