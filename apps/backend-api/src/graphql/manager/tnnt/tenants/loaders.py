"""Manager TNNT Tenants - DataLoaders

공통 모듈을 사용한 DataLoader 구현
"""

from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import BaseDataLoader, BaseFieldLoader
from src.models.manager.tnnt.tenant import Tenant as TenantModel


class ManagerTenantLoader(BaseDataLoader[TenantModel]):
    """Manager 테넌트 DataLoader (N+1 쿼리 최적화)"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, TenantModel)


class ManagerTenantByCodeLoader(BaseFieldLoader[TenantModel]):
    """테넌트 코드로 테넌트 조회 DataLoader"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, TenantModel, "code")


class ManagerTenantByBizNoLoader(BaseFieldLoader[TenantModel]):
    """사업자등록번호로 테넌트 조회 DataLoader"""

    def __init__(self, db: AsyncSession):
        super().__init__(db, TenantModel, "biz_no")
