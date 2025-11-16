"""Manager IDAM Users - DataLoaders

공통 모듈을 사용한 DataLoader 구현
"""

from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import BaseDataLoader, BaseFieldLoader
from src.models.manager.idam.user import User as UserModel


class ManagerUserLoader(BaseDataLoader[UserModel]):
    """Manager 사용자 DataLoader (N+1 쿼리 최적화)"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, UserModel)


class ManagerUserByUsernameLoader(BaseFieldLoader[UserModel]):
    """Username으로 사용자 조회 DataLoader"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, UserModel, "username")


class ManagerUserByEmailLoader(BaseFieldLoader[UserModel]):
    """Email로 사용자 조회 DataLoader"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, UserModel, "email")
