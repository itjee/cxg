"""Tenants SYS Roles - GraphQL Types"""

from datetime import datetime

import strawberry

from src.graphql.common import Node


@strawberry.type(description="Tenant 역할")
class TenantsRole(Node):
    """
    Tenant 시스템 역할

    테넌트 내 RBAC 역할 관리
    """

    id: strawberry.ID

    # 역할 정보
    code: str = strawberry.field(description="역할 코드")
    name: str = strawberry.field(description="역할 이름")
    description: str | None = strawberry.field(default=None, description="설명")

    # 메타데이터
    is_system_role: bool = strawberry.field(description="시스템 역할 여부")
    is_active: bool = strawberry.field(description="활성 상태")
    is_deleted: bool = strawberry.field(description="삭제 여부")

    # 시스템 필드
    created_at: datetime = strawberry.field(description="생성일시")
    updated_at: datetime | None = strawberry.field(default=None, description="수정일시")
    created_by: strawberry.ID | None = strawberry.field(default=None, description="생성자 ID")
    updated_by: strawberry.ID | None = strawberry.field(default=None, description="수정자 ID")


@strawberry.input(description="Tenant 역할 생성 입력")
class TenantsRoleCreateInput:
    """Tenant 역할 생성"""

    code: str = strawberry.field(description="역할 코드")
    name: str = strawberry.field(description="역할 이름")
    description: str | None = None
    is_system_role: bool = False


@strawberry.input(description="Tenant 역할 수정 입력")
class TenantsRoleUpdateInput:
    """Tenant 역할 수정"""

    name: str | None = None
    description: str | None = None
    is_active: bool | None = None
