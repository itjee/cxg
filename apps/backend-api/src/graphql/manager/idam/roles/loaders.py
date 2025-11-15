"""Manager IDAM Roles - DataLoaders

공통 모듈을 사용한 DataLoader 구현
"""

from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import BaseDataLoader, BaseFieldLoader
from src.models.manager.idam.role import Role as RoleModel


class RoleLoader(BaseDataLoader[RoleModel]):
    """Manager 역할 DataLoader (N+1 쿼리 최적화)"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, RoleModel)


class RoleByCodeLoader(BaseFieldLoader[RoleModel]):
    """Code로 역할 조회 DataLoader"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, RoleModel, "code")
