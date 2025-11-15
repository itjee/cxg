"""Manager IDAM Permissions - DataLoaders

공통 모듈을 사용한 DataLoader 구현
"""

from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import BaseDataLoader, BaseFieldLoader
from src.models.manager.idam.permission import Permission as PermissionModel


class PermissionLoader(BaseDataLoader[PermissionModel]):
    """Manager 권한 DataLoader (N+1 쿼리 최적화)"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, PermissionModel)


class PermissionByCodeLoader(BaseFieldLoader[PermissionModel]):
    """Code로 권한 조회 DataLoader"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, PermissionModel, "code")
