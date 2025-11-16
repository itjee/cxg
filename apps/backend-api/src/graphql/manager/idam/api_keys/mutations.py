"""Manager IDAM API Keys - Mutations

Manager 시스템 API 키 생성 및 수정 Mutation 구현
API 키 생성, 수정, 폐기 등의 기능을 제공합니다.
"""

from uuid import UUID

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.security import generate_api_key
from src.graphql.common import update_entity
from src.models.manager.idam.api_key import ApiKey as ApiKeyModel

from .queries import manager_api_key_to_graphql
from .types import (
    ManagerApiKey,
    ManagerApiKeyCreateInput,
    ManagerApiKeyCreateResponse,
    ManagerApiKeyUpdateInput,
)


async def create_manager_api_key(
    db: AsyncSession, input_data: ManagerApiKeyCreateInput
) -> tuple[ManagerApiKey, str]:
    """
    Manager API 키 생성

    API 키를 생성하고 해시화하여 저장합니다.
    실제 키 값은 반환 시 한 번만 제공되며, 이후에는 조회할 수 없습니다.

    Args:
        db: 데이터베이스 세션
        input_data: API 키 생성 입력 데이터

    Returns:
        tuple[ManagerApiKey, str]: (API 키 메타데이터, 전체 API 키 값)
        - ManagerApiKey: GraphQL 타입 (메타데이터만 포함)
        - full_api_key: 클라이언트에게 반환할 전체 키 (예: 'cxg_mgr_abc123...')

    Note:
        - full_api_key는 데이터베이스에 해시로 저장됨
        - key_id는 'cxg_mgr_{user_id}' 형식으로 생성
        - 생성 시 한 번만 반환되므로 클라이언트는 안전하게 보관해야 함
    """
    # 1. API 키 생성 (실제 키와 해시)
    # generate_api_key: (full_key, key_hash) 반환
    full_api_key, key_hash = generate_api_key("mgr")  # mgr = manager prefix

    # 2. Key ID 생성 (공개적으로 사용 가능)
    key_id = f"cxg_mgr_{input_data.user_id}"

    # 3. API 키 모델 생성
    api_key = ApiKeyModel(
        key_id=key_id,
        key_hash=key_hash,  # 해시만 저장 (원본 키는 저장하지 않음)
        key_name=input_data.key_name,
        user_id=input_data.user_id,
        tenant_context=input_data.tenant_context,
        service_account=input_data.service_account,
        scopes=input_data.scopes,
        allowed_ips=input_data.allowed_ips,
        rate_limit_per_minute=input_data.rate_limit_per_minute,
        rate_limit_per_hour=input_data.rate_limit_per_hour,
        rate_limit_per_day=input_data.rate_limit_per_day,
        expires_at=input_data.expires_at,
    )

    # 4. 데이터베이스에 저장
    db.add(api_key)
    await db.commit()
    await db.refresh(api_key)

    # 5. GraphQL 타입으로 변환하여 반환
    return manager_api_key_to_graphql(api_key), full_api_key


async def update_manager_api_key(
    db: AsyncSession, api_key_id: UUID, input_data: ManagerApiKeyUpdateInput
) -> ManagerApiKey:
    """
    Manager API 키 수정

    기존 API 키의 설정을 변경합니다.

    Args:
        db: 데이터베이스 세션
        api_key_id: 수정할 API 키 ID
        input_data: API 키 수정 입력 데이터

    Returns:
        ManagerApiKey: 수정된 API 키 객체

    Raises:
        Exception: API 키를 찾을 수 없는 경우

    Note:
        - key_id와 key_hash는 변경할 수 없습니다
        - 키를 재발급하려면 기존 키를 REVOKED로 변경하고 새로 생성해야 합니다
        - status를 'REVOKED'로 변경하면 해당 키는 더 이상 사용할 수 없습니다
    """
    result = await update_entity(
        db=db,
        model_class=ApiKeyModel,
        entity_id=api_key_id,
        input_data=input_data,
        to_graphql=manager_api_key_to_graphql,
    )

    if result is None:
        raise Exception(f"API key not found: {api_key_id}")

    return result


@strawberry.type
class ManagerApiKeyMutations:
    """
    Manager IDAM API Keys Mutation

    Manager 시스템의 API 키 관련 GraphQL Mutation들을 제공합니다.
    """

    @strawberry.field(description="Manager API 키 생성")
    async def create_api_key(
        self, info, input: ManagerApiKeyCreateInput
    ) -> ManagerApiKeyCreateResponse:
        """
        Manager API 키 생성

        새로운 API 키를 생성합니다.
        반환되는 full_api_key는 이 응답에서만 제공되므로 안전하게 보관해야 합니다.

        Args:
            input: API 키 생성 정보

        Returns:
            ManagerApiKeyCreateResponse: 생성된 API 키 정보 및 전체 키 값

        Important:
            full_api_key는 데이터베이스에 해시로 저장되므로,
            이 응답에서 받은 키를 잃어버리면 복구할 수 없습니다.
            분실 시 키를 폐기(REVOKED)하고 새로 발급받아야 합니다.

        사용 예:
            mutation {
              createManagerApiKey(input: {
                key_name: "Production API Key"
                user_id: "xxx"
                scopes: ["users:read", "orders:write"]
                allowed_ips: ["192.168.1.100"]
              }) {
                api_key { id key_id key_name }
                full_api_key  # 이 값을 안전하게 보관!
              }
            }
        """
        db = info.context.manager_db_session
        manager_api_key, full_api_key = await create_manager_api_key(db, input)

        return ManagerApiKeyCreateResponse(
            api_key=manager_api_key,
            full_api_key=full_api_key,
        )

    @strawberry.field(description="Manager API 키 수정")
    async def update_api_key(
        self, info, id: strawberry.ID, input: ManagerApiKeyUpdateInput
    ) -> ManagerApiKey:
        """
        Manager API 키 수정

        기존 API 키의 설정을 변경합니다.

        Args:
            id: 수정할 API 키 ID
            input: API 키 수정 정보

        Returns:
            ManagerApiKey: 수정된 API 키 객체

        Note:
            - 키 자체(key_id, key_hash)는 변경할 수 없습니다
            - status를 'REVOKED'로 변경하면 키가 폐기되어 사용할 수 없게 됩니다
            - Rate Limit 변경은 즉시 적용됩니다

        사용 예:
            mutation {
              updateManagerApiKey(
                id: "xxx"
                input: {
                  status: "REVOKED"  # 키 폐기
                }
              ) {
                id
                status
              }
            }
        """
        db = info.context.manager_db_session
        return await update_manager_api_key(db, UUID(id), input)
