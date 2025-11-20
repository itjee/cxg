"""모든 시스템의 DataLoader 생성"""

from sqlalchemy.ext.asyncio import AsyncSession


def create_loaders(manager_db: AsyncSession, tenant_db: AsyncSession | None) -> dict:
    """
    모든 DataLoader 생성

    네이밍 규칙: {시스템명}.{스키마명}.{엔티티명}

    예시:
    - manager.idam.user
    - manager.tenant_mgmt.tenant
    - tenants.sys.user
    - tenants.sys.branch
    - tenants.crm.customer

    Args:
        manager_db: Manager DB 세션
        tenant_db: Tenant DB 세션 (None 가능)

    Returns:
        DataLoader 딕셔너리
    """

    loaders = {}

    # Manager IDAM Loaders
    try:
        from src.graphql.manager.idam.roles.loaders import ManagerRoleLoader
        loaders["manager.idam.role"] = ManagerRoleLoader(manager_db)

        # roles_by_user_loader는 resolve_manager_user_roles에서 사용되므로
        # 별도로 등록하지 않음 (resolvers.py에서 fallback 처리)
    except ImportError:
        pass

    # TODO: Manager IDAM Users Loaders 구현
    # from src.graphql.manager.idam.users.loaders import ManagerUserLoader
    # loaders["manager.idam.user"] = ManagerUserLoader(manager_db)

    # TODO: Tenants SYS Loaders 구현 (tenant_db가 있을 때만)
    if tenant_db:
        # from src.graphql.tenants.sys.users.loaders import UserLoader
        # loaders["tenants.sys.user"] = UserLoader(tenant_db)
        pass

    return loaders
