"""Manager IDAM Sessions - DataLoaders

공통 모듈을 사용한 DataLoader 구현
"""

from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import BaseDataLoader, BaseFieldLoader
from src.models.manager.idam.session import Session as SessionModel


class ManagerSessionLoader(BaseDataLoader[SessionModel]):
    """Manager 세션 DataLoader (N+1 쿼리 최적화)"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, SessionModel)


class ManagerSessionBySessionIdLoader(BaseFieldLoader[SessionModel]):
    """Session ID로 세션 조회 DataLoader"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, SessionModel, "session_id")


class ManagerSessionByUserIdLoader(BaseFieldLoader[SessionModel]):
    """User ID로 세션 조회 DataLoader"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, SessionModel, "user_id")
