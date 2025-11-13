"""GraphQL Context - 멀티 DB 지원"""

from typing import Optional

import strawberry
from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_manager_db_session, get_tenant_db_session
from src.core.security import decode_access_token


@strawberry.type
class GraphQLContext:
    """
    GraphQL 컨텍스트
    
    3단계 구조를 위한 멀티 DB 세션 지원:
    - Manager DB: manager.idam, manager.tenant_mgmt
    - Tenant DB: tenants.sys, tenants.crm, tenants.hrm
    """
    
    request: strawberry.Private[Request]
    
    # 인증 정보
    user_id: str
    username: str
    role: str
    tenant_key: Optional[str] = None
    
    # DB 세션
    manager_db_session: strawberry.Private[AsyncSession]
    tenant_db_session: strawberry.Private[Optional[AsyncSession]] = None
    
    # DataLoaders (3단계 네이밍: 시스템.스키마.엔티티)
    loaders: strawberry.Private[dict]


async def get_context(request: Request) -> GraphQLContext:
    """
    GraphQL Context 생성
    
    Manager/Tenants 시스템 모두 지원
    """
    # 1. JWT 토큰 파싱
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise Exception("Authorization required")
    
    try:
        token = auth_header.split(" ")[1] if " " in auth_header else auth_header
        token_data = decode_access_token(token)
    except Exception as e:
        raise Exception(f"Invalid token: {str(e)}") from e
    
    # 2. Manager DB 세션 (항상 필요)
    manager_db = await get_manager_db_session()
    
    # 3. Tenant DB 세션 (tenant_key 있을 때만)
    tenant_db = None
    tenant_key = token_data.get("tenant_key")
    if tenant_key:
        tenant_db = await get_tenant_db_session(tenant_key)
    
    # 4. DataLoaders 생성 (TODO: 구현 필요)
    from .loaders import create_loaders
    loaders = create_loaders(manager_db, tenant_db)
    
    return GraphQLContext(
        request=request,
        user_id=str(token_data.get("sub", "")),
        username=token_data.get("username", ""),
        role=token_data.get("role", ""),
        tenant_key=tenant_key,
        manager_db_session=manager_db,
        tenant_db_session=tenant_db,
        loaders=loaders,
    )
