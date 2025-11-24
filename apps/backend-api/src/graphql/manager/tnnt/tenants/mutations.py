"""Manager TNNT Tenants - Mutations

테넌트 생성 및 수정 Mutation 구현
공통 모듈을 사용한 표준화된 변경 로직
"""

from uuid import UUID

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import create_entity, update_entity
from src.models.manager.tnnt.tenant import Tenant as TenantModel

from .queries import manager_tenant_to_graphql
from .types import (
    ManagerTenant,
    ManagerTenantCreateInput,
    ManagerTenantUpdateInput,
    DeleteResult,
)


def prepare_manager_tenant_create_data(input_data: ManagerTenantCreateInput) -> dict:
    """
    테넌트 생성 데이터 준비

    테넌트 생성 입력 데이터를 데이터베이스에 저장할 형식으로 변환합니다.

    Args:
        input_data: 테넌트 생성 입력 데이터

    Returns:
        dict: 데이터베이스에 저장할 준비된 데이터
    """
    return {
        "code": input_data.code,
        "name": input_data.name,
        "type": input_data.type,
        "start_date": input_data.start_date,
        "biz_no": input_data.biz_no,
        "biz_name": input_data.biz_name,
        "biz_type": input_data.biz_type,
        "ceo_name": input_data.ceo_name,
        "biz_kind": input_data.biz_kind,
        "biz_item": input_data.biz_item,
        "postcode": input_data.postcode,
        "address1": input_data.address1,
        "address2": input_data.address2,
        "phone_no": input_data.phone_no,
        "employee_count": input_data.employee_count,
        "close_date": input_data.close_date,
        "timezone": input_data.timezone,
        "locale": input_data.locale,
        "currency": input_data.currency,
        "extra_data": input_data.extra_data,
        "status": input_data.status or "ACTIVE",
        "is_suspended": input_data.is_suspended or False,
        "suspended_reason": input_data.suspended_reason,
        "suspended_date": input_data.suspended_date,
    }


async def create_manager_tenant(
    db: AsyncSession, input_data: ManagerTenantCreateInput
) -> ManagerTenant:
    """
    Manager 테넌트 생성

    새로운 Manager 시스템 테넌트를 생성합니다.

    Args:
        db: 데이터베이스 세션
        input_data: 테넌트 생성 입력 데이터

    Returns:
        Tenant: 생성된 테넌트 객체

    Raises:
        Exception: 중복된 code 또는 biz_no 등의 오류
    """
    return await create_entity(
        db=db,
        model_class=TenantModel,
        input_data=input_data,
        to_graphql=manager_tenant_to_graphql,
        prepare_data=prepare_manager_tenant_create_data,
    )


async def update_manager_tenant(
    db: AsyncSession, tenant_id: UUID, input_data: ManagerTenantUpdateInput
) -> ManagerTenant | None:
    """
    Manager 테넌트 수정

    기존 테넌트의 정보를 업데이트합니다.

    Args:
        db: 데이터베이스 세션
        tenant_id: 수정할 테넌트 ID
        input_data: 테넌트 수정 입력 데이터

    Returns:
        Tenant: 수정된 테넌트 객체 또는 None
    """
    # 빈 문자열을 None으로 변환 (선택적 문자열 필드)
    clean_data = ManagerTenantUpdateInput(
        code=input_data.code if input_data.code else None,
        name=input_data.name if input_data.name else None,
        type=input_data.type if input_data.type else None,
        biz_no=input_data.biz_no if input_data.biz_no else None,
        biz_name=input_data.biz_name if input_data.biz_name else None,
        biz_type=input_data.biz_type if input_data.biz_type else None,
        ceo_name=input_data.ceo_name if input_data.ceo_name else None,
        biz_kind=input_data.biz_kind if input_data.biz_kind else None,
        biz_item=input_data.biz_item if input_data.biz_item else None,
        postcode=input_data.postcode if input_data.postcode else None,
        address1=input_data.address1 if input_data.address1 else None,
        address2=input_data.address2 if input_data.address2 else None,
        phone_no=input_data.phone_no if input_data.phone_no else None,
        employee_count=input_data.employee_count,
        start_date=input_data.start_date,
        close_date=input_data.close_date,
        timezone=input_data.timezone if input_data.timezone else None,
        locale=input_data.locale if input_data.locale else None,
        currency=input_data.currency if input_data.currency else None,
        extra_data=input_data.extra_data,
        status=input_data.status if input_data.status else None,
        is_suspended=input_data.is_suspended,
        suspended_reason=input_data.suspended_reason if input_data.suspended_reason else None,
        suspended_date=input_data.suspended_date,
    )

    result = await update_entity(
        db=db,
        model_class=TenantModel,
        entity_id=tenant_id,
        input_data=clean_data,
        to_graphql=manager_tenant_to_graphql,
    )

    return result


async def delete_manager_tenant(
    db: AsyncSession, tenant_id: UUID
) -> dict:
    """
    Manager 테넌트 삭제

    기존 테넌트를 논리적으로 삭제합니다.

    Args:
        db: 데이터베이스 세션
        tenant_id: 삭제할 테넌트 ID

    Returns:
        dict: 삭제 결과 {success: bool, message: str}
    """
    try:
        # 테넌트 조회
        tenant = await db.get(TenantModel, tenant_id)
        if not tenant:
            return {"success": False, "message": "테넌트를 찾을 수 없습니다"}

        # 논리적 삭제 (is_deleted 플래그 설정)
        tenant.is_deleted = True
        await db.commit()

        return {"success": True, "message": "테넌트가 삭제되었습니다"}
    except Exception as e:
        await db.rollback()
        return {"success": False, "message": f"삭제 중 오류가 발생했습니다: {str(e)}"}


@strawberry.type
class ManagerTenantMutations:
    """
    Manager TNNT Tenants Mutation

    테넌트 생성, 수정, 삭제 관련 GraphQL Mutation을 제공합니다.
    """

    @strawberry.mutation(description="Manager 테넌트 생성")
    async def create_tenant(self, info, input: ManagerTenantCreateInput) -> ManagerTenant:
        """
        새로운 Manager 테넌트 생성

        Args:
            input: 테넌트 생성 입력 데이터

        Returns:
            Tenant: 생성된 테넌트 객체
        """
        db = info.context.manager_db_session
        return await create_manager_tenant(db, input)

    @strawberry.mutation(description="Manager 테넌트 수정")
    async def update_tenant(
        self, info, id: strawberry.ID, input: ManagerTenantUpdateInput
    ) -> ManagerTenant | None:
        """
        기존 Manager 테넌트 수정

        Args:
            id: 수정할 테넌트 ID
            input: 테넌트 수정 입력 데이터

        Returns:
            Tenant: 수정된 테넌트 객체 또는 None
        """
        db = info.context.manager_db_session
        return await update_manager_tenant(db, UUID(id), input)

    @strawberry.mutation(description="Manager 테넌트 삭제")
    async def delete_tenant(self, info, id: strawberry.ID) -> DeleteResult:
        """
        기존 Manager 테넌트 삭제

        Args:
            id: 삭제할 테넌트 ID

        Returns:
            DeleteResult: 삭제 결과
        """
        db = info.context.manager_db_session
        result = await delete_manager_tenant(db, UUID(id))
        return DeleteResult(
            success=result["success"],
            message=result["message"]
        )
