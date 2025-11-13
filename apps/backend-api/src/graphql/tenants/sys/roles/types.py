"""Tenants SYS Roles - GraphQL Types"""

from datetime import datetime
from typing import Optional

import strawberry

from src.graphql.common import Node


@strawberry.type(description="Tenant 역할")
class TenantRole(Node):
    """
    Tenant 시스템 역할
    
    테넌트 내 RBAC 역할 관리
    """
    
    id: strawberry.ID
    
    # 역할 정보
    code: str = strawberry.field(description="역할 코드")
    name: str = strawberry.field(description="역할 이름")
    description: Optional[str] = strawberry.field(default=None, description="설명")
    
    # 메타데이터
    is_system_role: bool = strawberry.field(description="시스템 역할 여부")
    is_active: bool = strawberry.field(description="활성 상태")
    is_deleted: bool = strawberry.field(description="삭제 여부")
    
    # 시스템 필드
    created_at: datetime = strawberry.field(description="생성일시")
    updated_at: Optional[datetime] = strawberry.field(default=None, description="수정일시")
    created_by: Optional[strawberry.ID] = strawberry.field(default=None, description="생성자 ID")
    updated_by: Optional[strawberry.ID] = strawberry.field(default=None, description="수정자 ID")


@strawberry.input(description="Tenant 역할 생성 입력")
class TenantRoleCreateInput:
    """Tenant 역할 생성"""
    
    code: str = strawberry.field(description="역할 코드")
    name: str = strawberry.field(description="역할 이름")
    description: Optional[str] = None
    is_system_role: bool = False


@strawberry.input(description="Tenant 역할 수정 입력")
class TenantRoleUpdateInput:
    """Tenant 역할 수정"""
    
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
