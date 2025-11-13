"""Manager IDAM API Keys - DataLoaders

공통 모듈을 사용한 DataLoader 구현
"""

from sqlalchemy.ext.asyncio import AsyncSession

from graphql.common.base_loader import BaseFieldLoader
from src.graphql.common import BaseDataLoader
from src.models.manager.idam.api_key import ApiKey as ApiKeyModel


class ManagerApiKeyLoader(BaseDataLoader[ApiKeyModel]):
    """Manager API 키 DataLoader (N+1 쿼리 최적화)"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, ApiKeyModel)


class ManagerApiKeyByKeyIdLoader(BaseFieldLoader[ApiKeyModel]):
    """key_id로 API 키 조회 DataLoader"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, ApiKeyModel, "key_id")


class ManagerApiKeysByUserLoader(BaseFieldLoader[ApiKeyModel]):
    """사용자별 API 키 목록 조회 DataLoader"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, ApiKeyModel, "user_id")
