"""Manager IDAM Login Logs - DataLoaders

공통 모듈을 사용한 DataLoader 구현
"""

from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import BaseDataLoader, BaseFieldLoader
from src.models.manager.idam.login_log import LoginLog as LoginLogModel


class ManagerLoginLogLoader(BaseDataLoader[LoginLogModel]):
    """Manager 로그인 이력 DataLoader (N+1 쿼리 최적화)"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, LoginLogModel)


class ManagerLoginLogsByUserLoader(BaseFieldLoader[LoginLogModel]):
    """사용자별 로그인 이력 목록 조회 DataLoader"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, LoginLogModel, "user_id")


class ManagerLoginLogsBySessionLoader(BaseFieldLoader[LoginLogModel]):
    """세션별 로그인 이력 조회 DataLoader"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, LoginLogModel, "session_id")
