"""Manager IDAM User Roles - DataLoaders

공통 모듈을 사용한 DataLoader 구현
"""

from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import BaseDataLoader
from src.models.manager.idam.user_role import UserRole as UserRoleModel


class ManagerUserRoleLoader(BaseDataLoader[UserRoleModel]):
    """Manager 사용자-역할 매핑 DataLoader (N+1 쿼리 최적화)"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, UserRoleModel)
