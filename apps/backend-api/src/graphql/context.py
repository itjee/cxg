"""GraphQL Context - 멀티 DB 지원"""

import strawberry
from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession
from strawberry.fastapi import BaseContext

from src.core.database import get_manager_db_session, get_tenant_db_session
from src.core.security import decode_access_token


@strawberry.type
class GraphQLContext(BaseContext):
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
    tenant_key: str | None = None

    # DB 세션
    manager_db_session: strawberry.Private[AsyncSession]
    tenant_db_session: strawberry.Private[AsyncSession | None] = None

    # DataLoaders (3단계 네이밍: 시스템.스키마.엔티티)
    loaders: strawberry.Private[dict]


async def get_context(request: Request) -> GraphQLContext:
    """
    GraphQL Context 생성

    Manager/Tenants 시스템 모두 지원

    인증이 필요 없는 쿼리/뮤테이션:
    - signup: 회원가입
    - signin: 로그인
    - forgot_password: 비밀번호 찾기
    - reset_password: 비밀번호 재설정
    """
    # Manager DB 세션 (항상 필요)
    manager_db = await get_manager_db_session()

    # 1. JWT 토큰 파싱 (선택적)
    auth_header = request.headers.get("Authorization")
    user_id = ""
    username = ""
    role = ""
    tenant_key = None

    if auth_header:
        try:
            token = auth_header.split(" ")[1] if " " in auth_header else auth_header
            token_data = decode_access_token(token)
            user_id = str(token_data.get("sub", ""))
            username = token_data.get("username", "")
            role = token_data.get("role", "")
            tenant_key = token_data.get("tenant_key")
        except Exception:
            # 토큰 파싱 실패 시 무시 (인증 필요 없는 작업용)
            pass

    # 2. Tenant DB 세션 (tenant_key 있을 때만)
    tenant_db = None
    if tenant_key:
        tenant_db = await get_tenant_db_session(tenant_key)

    # 3. DataLoaders 생성
    from .loaders import create_loaders

    loaders = create_loaders(manager_db, tenant_db)

    return GraphQLContext(
        request=request,
        user_id=user_id,
        username=username,
        role=role,
        tenant_key=tenant_key,
        manager_db_session=manager_db,
        tenant_db_session=tenant_db,
        loaders=loaders,
    )
