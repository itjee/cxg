"""Tenants SYS Users - GraphQL Types"""

from datetime import datetime
from typing import Optional
from uuid import UUID

import strawberry

from src.graphql.common import Node


@strawberry.type(description="Tenant 사용자")
class TenantUser(Node):
    """
    Tenant 시스템 사용자
    
    각 테넌트 내의 사용자 계정
    """
    
    id: strawberry.ID
    
    # 기본 정보
    user_code: str = strawberry.field(description="사용자 코드")
    username: str = strawberry.field(description="사용자명")
    email: str = strawberry.field(description="이메일")
    first_name: Optional[str] = strawberry.field(default=None, description="이름")
    last_name: Optional[str] = strawberry.field(default=None, description="성")
    phone: Optional[str] = strawberry.field(default=None, description="전화번호")
    
    # 조직 정보
    department_id: Optional[strawberry.ID] = strawberry.field(default=None, description="부서 ID")
    position: Optional[str] = strawberry.field(default=None, description="직급/직책")
    role_id: Optional[strawberry.ID] = strawberry.field(default=None, description="역할 ID")
    
    # 보안 정보
    failed_login_attempts: int = strawberry.field(description="로그인 실패 횟수")
    locked_until: Optional[datetime] = strawberry.field(default=None, description="잠금 해제 시간")
    last_login_at: Optional[datetime] = strawberry.field(default=None, description="마지막 로그인 시간")
    last_login_ip: Optional[str] = strawberry.field(default=None, description="마지막 로그인 IP")
    
    # 상태
    is_system_user: bool = strawberry.field(description="시스템 사용자 여부")
    is_active: bool = strawberry.field(description="활성 상태")
    is_deleted: bool = strawberry.field(description="삭제 여부")
    
    # 시스템 필드
    created_at: datetime = strawberry.field(description="생성일시")
    updated_at: Optional[datetime] = strawberry.field(default=None, description="수정일시")
    created_by: Optional[strawberry.ID] = strawberry.field(default=None, description="생성자 ID")
    updated_by: Optional[strawberry.ID] = strawberry.field(default=None, description="수정자 ID")
    
    @strawberry.field(description="부서 정보")
    async def department(self, info) -> Optional["TenantDepartment"]:
        """부서 정보"""
        if not self.department_id:
            return None
        # TODO: DataLoader로 구현
        return None
    
    @strawberry.field(description="역할 정보")
    async def role(self, info) -> Optional["TenantRole"]:
        """역할 정보"""
        if not self.role_id:
            return None
        # TODO: DataLoader로 구현
        return None


@strawberry.input(description="Tenant 사용자 생성 입력")
class TenantUserCreateInput:
    """Tenant 사용자 생성"""
    
    user_code: str = strawberry.field(description="사용자 코드")
    username: str = strawberry.field(description="사용자명")
    email: str = strawberry.field(description="이메일")
    password: str = strawberry.field(description="비밀번호")
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    department_id: Optional[strawberry.ID] = None
    position: Optional[str] = None
    role_id: Optional[strawberry.ID] = None


@strawberry.input(description="Tenant 사용자 수정 입력")
class TenantUserUpdateInput:
    """Tenant 사용자 수정"""
    
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    department_id: Optional[strawberry.ID] = None
    position: Optional[str] = None
    role_id: Optional[strawberry.ID] = None
    is_active: Optional[bool] = None


@strawberry.type(description="Tenant Department (placeholder)")
class TenantDepartment:
    """Tenant 부서"""
    id: strawberry.ID
    name: str


@strawberry.type(description="Tenant Role (placeholder)")
class TenantRole:
    """Tenant 역할"""
    id: strawberry.ID
    name: str
