"""Manager IDAM Permissions - GraphQL Types

Manager 시스템 권한 관련 GraphQL 타입 정의
RBAC(Role-Based Access Control) 시스템의 권한을 정의합니다.
"""

from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

import strawberry

from src.graphql.common import Node


if TYPE_CHECKING:
    from ..roles.types import ManagerRole


@strawberry.type(description="Manager 권한")
class ManagerPermission(Node):
    """
    Manager 시스템 권한

    RBAC(Role-Based Access Control) 시스템에서 사용되는 세밀한 권한을 정의합니다.
    권한은 역할(Role)에 할당되고, 사용자는 역할을 통해 권한을 부여받습니다.

    권한 구조:
        - code: 고유 식별자 (예: "users.create", "tenants.manage")
        - category: 권한 그룹화 (예: "사용자 관리", "시스템 설정")
        - resource: 대상 리소스 (예: "users", "roles", "tenants")
        - action: 수행 동작 (CREATE, READ, UPDATE, DELETE, LIST, MANAGE)

    권한 계층:
        1. GLOBAL 범위 - 전체 시스템에 적용
        2. TENANT 범위 - 특정 테넌트에만 적용

    사용 예:
        - users.create: 사용자 생성 권한
        - tenants.manage: 테넌트 관리 권한 (생성, 수정, 삭제 모두 포함)
        - billing.read: 청구 정보 조회 권한
    """

    id: strawberry.ID

    # 권한 기본 정보
    code: str = strawberry.field(
        description="권한 코드 (고유 식별자, 예: 'users.create', 'tenants.manage')"
    )
    name: str = strawberry.field(description="권한 이름 (표시용, 예: '사용자 생성')")
    description: str | None = strawberry.field(
        default=None, description="권한 설명 (권한의 목적과 범위)"
    )

    # 권한 분류
    category: str = strawberry.field(
        description="권한 카테고리 (그룹화용, 예: '사용자 관리', '시스템 설정', '청구')"
    )
    resource: str = strawberry.field(
        description="대상 리소스 (예: 'users', 'roles', 'tenants', 'billing')"
    )
    action: str = strawberry.field(
        description="수행 동작 (CREATE: 생성, READ: 조회, UPDATE: 수정, DELETE: 삭제, "
        "LIST: 목록 조회, MANAGE: 전체 관리)"
    )

    # 권한 범위 및 적용 대상
    scope: str = strawberry.field(description="권한 범위 (GLOBAL: 전역, TENANT: 테넌트별)")
    applies_to: str = strawberry.field(
        description="적용 대상 사용자 타입 (ALL: 모두, MASTER: 마스터만, "
        "TENANT: 테넌트 사용자만, SYSTEM: 시스템만)"
    )

    # 메타데이터
    is_system: bool = strawberry.field(
        description="시스템 권한 여부 (True: 시스템 예약 권한으로 수정/삭제 불가)"
    )
    status: str = strawberry.field(description="권한 상태 (ACTIVE: 활성, INACTIVE: 비활성)")

    # 시스템 필드
    created_at: datetime = strawberry.field(description="생성일시")
    updated_at: datetime | None = strawberry.field(default=None, description="수정일시")

    @strawberry.field(description="이 권한을 가진 역할 목록")
    async def roles(self, info) -> list["ManagerRole"]:
        """
        권한에 할당된 역할 목록 조회

        이 권한이 어떤 역할들에 할당되어 있는지 확인할 수 있습니다.
        역할을 통해 간접적으로 사용자에게 권한이 부여됩니다.

        Returns:
            list[ManagerRole]: 이 권한을 가진 역할 목록
        """
        from .resolvers import resolve_permission_roles

        return await resolve_permission_roles(UUID(self.id), info)


@strawberry.input(description="Manager 권한 생성 입력")
class ManagerPermissionCreateInput:
    """
    Manager 권한 생성 입력 타입

    새로운 권한을 생성하기 위한 정보입니다.

    권한 코드 명명 규칙:
        - {resource}.{action} 형식 사용
        - 예: users.create, tenants.manage, billing.read
        - 소문자와 점(.)만 사용

    Note:
        시스템 권한(is_system=True)은 수정/삭제가 불가능하므로 신중하게 설정해야 합니다.
    """

    code: str = strawberry.field(description="권한 코드 (예: 'users.create')")
    name: str = strawberry.field(description="권한 이름 (예: '사용자 생성')")
    description: str | None = None
    category: str = strawberry.field(description="권한 카테고리 (예: '사용자 관리')")
    resource: str = strawberry.field(description="리소스 (예: 'users')")
    action: str = strawberry.field(description="액션 (CREATE, READ, UPDATE, DELETE, LIST, MANAGE)")
    scope: str = "GLOBAL"
    applies_to: str = "ALL"
    is_system: bool = False


@strawberry.input(description="Manager 권한 수정 입력")
class ManagerPermissionUpdateInput:
    """
    Manager 권한 수정 입력 타입

    기존 권한의 정보를 수정합니다.
    모든 필드는 선택적이며, 제공된 필드만 업데이트됩니다.

    제약사항:
        - code, resource, action은 변경할 수 없습니다
        - is_system=True인 권한은 수정할 수 없습니다
        - 이미 사용 중인 권한의 scope나 applies_to 변경 시 주의 필요
    """

    name: str | None = None
    description: str | None = None
    status: str | None = None
