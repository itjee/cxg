# GraphQL 최신 아키텍처 가이드 v3.0 (2025)

> **3단계 구조: {시스템명}/{스키마명}/{엔티티명}**
> - Manager / Tenants 시스템 분리
> - IDAM, SYS, CRM 등 스키마 구분
> - 최신 GraphQL 트렌드 (2025) 완전 반영

---

## 📊 3단계 구조 개요

### 구조 정의
```
{시스템명}/{스키마명}/{엔티티명}
```

### 예시
- `manager/idam/users` - Manager 시스템, IDAM 스키마, Users 엔티티
- `manager/idam/roles` - Manager 시스템, IDAM 스키마, Roles 엔티티
- `tenants/sys/users` - Tenants 시스템, SYS 스키마, Users 엔티티
- `tenants/sys/branches` - Tenants 시스템, SYS 스키마, Branches 엔티티
- `tenants/crm/customers` - Tenants 시스템, CRM 스키마, Customers 엔티티

---

## 🏗 완전한 디렉토리 구조

```
apps/backend-api/src/graphql/
│
├── common/                           # 공통 모듈
│   ├── __init__.py
│   ├── scalars.py                   # UUID, DateTime 스칼라
│   ├── interfaces.py                # Node, Edge (Relay)
│   └── base_types.py                # PageInfo, Connection
│
├── manager/                          # 🔷 시스템: Manager (관리자)
│   ├── __init__.py
│   ├── schema.py                    # Manager 시스템 통합 스키마
│   │
│   ├── idam/                         # 📂 스키마: IDAM (Identity & Access Management)
│   │   ├── __init__.py
│   │   ├── schema.py                # IDAM 스키마 통합
│   │   │
│   │   ├── users/                   # 📄 엔티티: Users
│   │   │   ├── __init__.py
│   │   │   ├── types.py             # GraphQL 타입 정의
│   │   │   ├── queries.py           # Query 리졸버
│   │   │   ├── mutations.py         # Mutation 리졸버
│   │   │   ├── loaders.py           # DataLoader
│   │   │   └── permissions.py       # 권한 체크
│   │   │
│   │   ├── roles/                   # 📄 엔티티: Roles
│   │   │   ├── types.py
│   │   │   ├── queries.py
│   │   │   ├── mutations.py
│   │   │   └── loaders.py
│   │   │
│   │   └── permissions/             # 📄 엔티티: Permissions
│   │       ├── types.py
│   │       ├── queries.py
│   │       └── mutations.py
│   │
│   └── tenant_mgmt/                  # 📂 스키마: Tenant Management
│       ├── __init__.py
│       ├── schema.py
│       │
│       ├── tenants/                 # 📄 엔티티: Tenants
│       │   ├── types.py
│       │   ├── queries.py
│       │   ├── mutations.py
│       │   └── loaders.py
│       │
│       └── subscriptions/           # 📄 엔티티: Subscriptions
│           ├── types.py
│           ├── queries.py
│           └── mutations.py
│
├── tenants/                          # 🔶 시스템: Tenants (테넌트별)
│   ├── __init__.py
│   ├── schema.py                    # Tenants 시스템 통합 스키마
│   │
│   ├── sys/                          # 📂 스키마: SYS (시스템 관리)
│   │   ├── __init__.py
│   │   ├── schema.py                # SYS 스키마 통합
│   │   │
│   │   ├── users/                   # 📄 엔티티: Users
│   │   │   ├── __init__.py
│   │   │   ├── types.py
│   │   │   ├── queries.py
│   │   │   ├── mutations.py
│   │   │   ├── loaders.py
│   │   │   └── permissions.py
│   │   │
│   │   ├── branches/                # 📄 엔티티: Branches
│   │   │   ├── types.py
│   │   │   ├── queries.py
│   │   │   ├── mutations.py
│   │   │   └── loaders.py
│   │   │
│   │   ├── departments/             # 📄 엔티티: Departments
│   │   │   ├── types.py
│   │   │   ├── queries.py
│   │   │   └── mutations.py
│   │   │
│   │   └── roles/                   # 📄 엔티티: Roles
│   │       ├── types.py
│   │       ├── queries.py
│   │       └── mutations.py
│   │
│   ├── crm/                          # 📂 스키마: CRM (고객관리)
│   │   ├── __init__.py
│   │   ├── schema.py
│   │   │
│   │   ├── customers/               # 📄 엔티티: Customers
│   │   │   ├── types.py
│   │   │   ├── queries.py
│   │   │   ├── mutations.py
│   │   │   └── loaders.py
│   │   │
│   │   ├── contacts/                # 📄 엔티티: Contacts
│   │   │   ├── types.py
│   │   │   ├── queries.py
│   │   │   └── mutations.py
│   │   │
│   │   └── leads/                   # 📄 엔티티: Leads
│   │       ├── types.py
│   │       └── queries.py
│   │
│   ├── hrm/                          # 📂 스키마: HRM (인사관리)
│   │   ├── __init__.py
│   │   ├── schema.py
│   │   │
│   │   ├── employees/               # 📄 엔티티: Employees
│   │   │   ├── types.py
│   │   │   ├── queries.py
│   │   │   └── mutations.py
│   │   │
│   │   └── attendance/              # 📄 엔티티: Attendance
│   │       ├── types.py
│   │       └── queries.py
│   │
│   └── scm/                          # 📂 스키마: SCM (공급망관리)
│       ├── __init__.py
│       ├── schema.py
│       │
│       ├── products/                # 📄 엔티티: Products
│       │   ├── types.py
│       │   ├── queries.py
│       │   └── mutations.py
│       │
│       └── inventory/               # 📄 엔티티: Inventory
│           ├── types.py
│           └── queries.py
│
├── context.py                        # GraphQL Context 팩토리
├── loaders.py                        # 모든 DataLoader 통합
└── schema.py                         # 메인 스키마 (Manager + Tenants 통합)
```

---

## 📝 구체적 구현 예시

### 1. Manager/IDAM/Users 엔티티

**manager/idam/users/types.py:**
```python
"""Manager IDAM Users 엔티티 타입"""

from typing import Optional
from uuid import UUID

import strawberry
from strawberry import relay

from src.graphql.common.scalars import DateTimeScalar, UUIDScalar


@strawberry.type
class ManagerUser(relay.Node):
    """
    Manager 시스템 사용자
    
    시스템: Manager
    스키마: IDAM (Identity & Access Management)
    엔티티: Users
    """
    
    id: UUIDScalar = strawberry.field(
        description="사용자 고유 식별자"
    )
    username: str = strawberry.field(
        description="사용자명 (로그인 ID)"
    )
    email: str = strawberry.field(
        description="이메일 주소"
    )
    full_name: str = strawberry.field(
        description="전체 이름"
    )
    
    # 관계 필드
    @strawberry.field(description="사용자 역할")
    async def role(self, info) -> Optional["ManagerRole"]:
        """역할 정보 (N+1 방지)"""
        if not self.role_id:
            return None
        return await info.context.loaders["manager.idam.role"].load(self.role_id)
    
    is_active: bool
    created_at: DateTimeScalar
    updated_at: Optional[DateTimeScalar] = None


@strawberry.input
class ManagerUserCreateInput:
    """Manager 사용자 생성 입력"""
    username: str
    email: str
    password: str
    full_name: str
    role_id: Optional[UUIDScalar] = None


@strawberry.input
class ManagerUserUpdateInput:
    """Manager 사용자 수정 입력"""
    email: Optional[str] = None
    full_name: Optional[str] = None
    role_id: Optional[UUIDScalar] = None
    is_active: Optional[bool] = None
```

**manager/idam/users/queries.py:**
```python
"""Manager IDAM Users Query 리졸버"""

from typing import Optional
from uuid import UUID

import strawberry

from .types import ManagerUser
from .permissions import check_manager_user_read_permission
from src.services.manager.idam.user_service import ManagerUserService


@strawberry.type
class ManagerUserQueries:
    """Manager IDAM Users Query"""
    
    @strawberry.field(description="Manager 사용자 단건 조회")
    async def manager_user(
        self,
        info,
        id: UUID,
    ) -> Optional[ManagerUser]:
        """
        Manager 사용자 조회
        
        경로: manager/idam/users
        """
        check_manager_user_read_permission(info.context)
        
        db = info.context.manager_db_session  # Manager DB 세션
        user = await ManagerUserService.get_by_id(db, id)
        
        if not user:
            return None
        
        return ManagerUser.from_orm(user)
    
    @strawberry.field(description="Manager 사용자 목록")
    async def manager_users(
        self,
        info,
        first: int = 20,
        after: Optional[str] = None,
    ) -> list[ManagerUser]:
        """Manager 사용자 목록"""
        check_manager_user_read_permission(info.context)
        
        db = info.context.manager_db_session
        users = await ManagerUserService.get_list(db, limit=first)
        
        return [ManagerUser.from_orm(u) for u in users]
```

---

### 2. Tenants/SYS/Users 엔티티

**tenants/sys/users/types.py:**
```python
"""Tenants SYS Users 엔티티 타입"""

from typing import Optional
from uuid import UUID

import strawberry
from strawberry import relay

from src.graphql.common.scalars import DateTimeScalar, UUIDScalar


@strawberry.type
class TenantUser(relay.Node):
    """
    Tenant 시스템 사용자
    
    시스템: Tenants
    스키마: SYS (시스템 관리)
    엔티티: Users
    """
    
    id: UUIDScalar
    username: str
    email: str
    full_name: str
    phone: Optional[str] = None
    
    # 관계 필드 (DataLoader 사용)
    @strawberry.field(description="소속 부서")
    async def department(self, info) -> Optional["TenantDepartment"]:
        """부서 정보"""
        if not self.department_id:
            return None
        return await info.context.loaders["tenants.sys.department"].load(
            self.department_id
        )
    
    @strawberry.field(description="소속 지점")
    async def branch(self, info) -> Optional["TenantBranch"]:
        """지점 정보"""
        if not self.branch_id:
            return None
        return await info.context.loaders["tenants.sys.branch"].load(
            self.branch_id
        )
    
    @strawberry.field(description="사용자 역할")
    async def role(self, info) -> Optional["TenantRole"]:
        """역할 정보"""
        if not self.role_id:
            return None
        return await info.context.loaders["tenants.sys.role"].load(
            self.role_id
        )
    
    is_active: bool
    created_at: DateTimeScalar


@strawberry.input
class TenantUserCreateInput:
    """Tenant 사용자 생성 입력"""
    username: str
    email: str
    password: str
    full_name: str
    department_id: Optional[UUIDScalar] = None
    branch_id: Optional[UUIDScalar] = None
    role_id: Optional[UUIDScalar] = None
```

---

### 3. 스키마별 통합

**manager/idam/schema.py:**
```python
"""Manager IDAM 스키마 통합"""

import strawberry

from .users.queries import ManagerUserQueries
from .users.mutations import ManagerUserMutations
from .roles.queries import ManagerRoleQueries
from .roles.mutations import ManagerRoleMutations


@strawberry.type
class ManagerIdamQuery(
    ManagerUserQueries,
    ManagerRoleQueries,
):
    """Manager IDAM 스키마 Query"""
    pass


@strawberry.type
class ManagerIdamMutation(
    ManagerUserMutations,
    ManagerRoleMutations,
):
    """Manager IDAM 스키마 Mutation"""
    pass
```

**manager/schema.py:**
```python
"""Manager 시스템 통합 스키마"""

import strawberry

from .idam.schema import ManagerIdamQuery, ManagerIdamMutation
from .tenant_mgmt.schema import TenantMgmtQuery, TenantMgmtMutation


@strawberry.type
class ManagerQuery(
    ManagerIdamQuery,
    TenantMgmtQuery,
):
    """Manager 시스템 Query 통합"""
    pass


@strawberry.type
class ManagerMutation(
    ManagerIdamMutation,
    TenantMgmtMutation,
):
    """Manager 시스템 Mutation 통합"""
    pass
```

---

**tenants/sys/schema.py:**
```python
"""Tenants SYS 스키마 통합"""

import strawberry

from .users.queries import TenantUserQueries
from .users.mutations import TenantUserMutations
from .branches.queries import TenantBranchQueries
from .departments.queries import TenantDepartmentQueries


@strawberry.type
class TenantsSysQuery(
    TenantUserQueries,
    TenantBranchQueries,
    TenantDepartmentQueries,
):
    """Tenants SYS 스키마 Query"""
    pass


@strawberry.type
class TenantsSysMutation(
    TenantUserMutations,
):
    """Tenants SYS 스키마 Mutation"""
    pass
```

**tenants/schema.py:**
```python
"""Tenants 시스템 통합 스키마"""

import strawberry

from .sys.schema import TenantsSysQuery, TenantsSysMutation
from .crm.schema import TenantsCrmQuery, TenantsCrmMutation
from .hrm.schema import TenantsHrmQuery, TenantsHrmMutation


@strawberry.type
class TenantsQuery(
    TenantsSysQuery,
    TenantsCrmQuery,
    TenantsHrmQuery,
):
    """Tenants 시스템 Query 통합"""
    pass


@strawberry.type
class TenantsMutation(
    TenantsSysMutation,
    TenantsCrmMutation,
    TenantsHrmMutation,
):
    """Tenants 시스템 Mutation 통합"""
    pass
```

---

### 4. 최종 메인 스키마

**graphql/schema.py:**
```python
"""GraphQL 메인 스키마 - Manager + Tenants 통합"""

import strawberry
from strawberry.extensions import QueryDepthLimiter

from src.core.config import settings
from src.graphql.manager.schema import ManagerQuery, ManagerMutation
from src.graphql.tenants.schema import TenantsQuery, TenantsMutation


@strawberry.type(description="GraphQL Root Query")
class Query(
    ManagerQuery,
    TenantsQuery,
):
    """
    루트 Query
    
    통합:
    - Manager 시스템 (IDAM, Tenant Management)
    - Tenants 시스템 (SYS, CRM, HRM, SCM)
    """
    
    @strawberry.field(description="API 버전")
    def version(self) -> str:
        return "3.0.0"
    
    @strawberry.field(description="서버 상태")
    def health(self) -> str:
        return "healthy"


@strawberry.type(description="GraphQL Root Mutation")
class Mutation(
    ManagerMutation,
    TenantsMutation,
):
    """
    루트 Mutation
    
    통합:
    - Manager 시스템
    - Tenants 시스템
    """
    pass


# 스키마 생성
schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    extensions=[
        QueryDepthLimiter(max_depth=settings.graphql_depth_limit),
    ],
)
```

---

### 5. DataLoader 네이밍 (3단계)

**graphql/loaders.py:**
```python
"""모든 시스템의 DataLoader 생성"""

from sqlalchemy.ext.asyncio import AsyncSession

# Manager 시스템
from src.graphql.manager.idam.users.loaders import ManagerUserLoader
from src.graphql.manager.idam.roles.loaders import ManagerRoleLoader
from src.graphql.manager.tenant_mgmt.tenants.loaders import TenantLoader

# Tenants 시스템
from src.graphql.tenants.sys.users.loaders import TenantUserLoader
from src.graphql.tenants.sys.branches.loaders import TenantBranchLoader
from src.graphql.tenants.sys.departments.loaders import TenantDepartmentLoader
from src.graphql.tenants.sys.roles.loaders import TenantRoleLoader
from src.graphql.tenants.crm.customers.loaders import CustomerLoader


def create_loaders(
    manager_db: AsyncSession,
    tenant_db: AsyncSession
) -> dict:
    """
    모든 DataLoader 생성
    
    네이밍 규칙: {시스템명}.{스키마명}.{엔티티명}
    
    예시:
    - manager.idam.user
    - tenants.sys.user
    - tenants.crm.customer
    
    Args:
        manager_db: Manager DB 세션
        tenant_db: Tenant DB 세션
    
    Returns:
        DataLoader 딕셔너리
    """
    return {
        # Manager 시스템 - IDAM 스키마
        "manager.idam.user": ManagerUserLoader(manager_db),
        "manager.idam.role": ManagerRoleLoader(manager_db),
        
        # Manager 시스템 - Tenant Management 스키마
        "manager.tenant_mgmt.tenant": TenantLoader(manager_db),
        
        # Tenants 시스템 - SYS 스키마
        "tenants.sys.user": TenantUserLoader(tenant_db),
        "tenants.sys.branch": TenantBranchLoader(tenant_db),
        "tenants.sys.department": TenantDepartmentLoader(tenant_db),
        "tenants.sys.role": TenantRoleLoader(tenant_db),
        
        # Tenants 시스템 - CRM 스키마
        "tenants.crm.customer": CustomerLoader(tenant_db),
        
        # Tenants 시스템 - HRM 스키마
        # "tenants.hrm.employee": EmployeeLoader(tenant_db),
    }
```

---

### 6. Context 업데이트

**graphql/context.py:**
```python
"""GraphQL Context with 3-tier structure"""

import strawberry
from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.auth import decode_token
from src.core.database import get_manager_db, get_tenant_db_by_key
from src.graphql.loaders import create_loaders


@strawberry.type
class GraphQLContext:
    """
    GraphQL 컨텍스트
    
    3단계 구조를 위한 멀티 DB 세션 지원
    """
    
    request: Request
    
    # 인증 정보
    user_id: str
    username: str
    role: str
    tenant_key: str | None
    
    # DB 세션
    manager_db_session: AsyncSession  # Manager DB
    tenant_db_session: AsyncSession | None  # Tenant DB (tenant_key 있을 때만)
    
    # DataLoaders (3단계 네이밍)
    loaders: dict


async def get_context(request: Request) -> GraphQLContext:
    """
    GraphQL Context 생성
    
    Manager/Tenants 시스템 모두 지원
    """
    # 1. JWT 토큰 파싱
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise Exception("Authorization required")
    
    token = auth_header.split(" ")[1]
    token_data = decode_token(token)
    
    # 2. Manager DB 세션 (항상 필요)
    manager_db = await get_manager_db()
    
    # 3. Tenant DB 세션 (tenant_key 있을 때만)
    tenant_db = None
    if token_data.get("tenant_key"):
        tenant_db = await get_tenant_db_by_key(token_data["tenant_key"])
    
    # 4. DataLoaders 생성 (3단계 구조)
    loaders = create_loaders(manager_db, tenant_db)
    
    return GraphQLContext(
        request=request,
        user_id=token_data["sub"],
        username=token_data.get("username", ""),
        role=token_data.get("role", ""),
        tenant_key=token_data.get("tenant_key"),
        manager_db_session=manager_db,
        tenant_db_session=tenant_db,
        loaders=loaders,
    )
```

---

## 🚀 마이그레이션 스크립트 (3단계 구조)

```bash
#!/bin/bash
# scripts/migrate_to_3tier_structure.sh

echo "🚀 3단계 GraphQL 구조 마이그레이션 시작"
echo "   {시스템명}/{스키마명}/{엔티티명}"
echo ""

# 1. common 폴더 생성
echo "📁 common 폴더 생성..."
mkdir -p src/graphql/common
touch src/graphql/common/{__init__,scalars,interfaces,base_types}.py

# 2. Manager 시스템 폴더 생성
echo "📁 Manager 시스템 생성..."
mkdir -p src/graphql/manager/{idam,tenant_mgmt}

# Manager > IDAM > 엔티티들
for entity in users roles permissions; do
    mkdir -p src/graphql/manager/idam/$entity
    touch src/graphql/manager/idam/$entity/{__init__,types,queries,mutations,loaders,permissions}.py
done

# Manager > Tenant Management > 엔티티들
for entity in tenants subscriptions; do
    mkdir -p src/graphql/manager/tenant_mgmt/$entity
    touch src/graphql/manager/tenant_mgmt/$entity/{__init__,types,queries,mutations,loaders}.py
done

touch src/graphql/manager/{__init__,schema}.py
touch src/graphql/manager/idam/{__init__,schema}.py
touch src/graphql/manager/tenant_mgmt/{__init__,schema}.py

# 3. Tenants 시스템 폴더 생성
echo "📁 Tenants 시스템 생성..."
mkdir -p src/graphql/tenants/{sys,crm,hrm,scm}

# Tenants > SYS > 엔티티들
for entity in users branches departments roles; do
    mkdir -p src/graphql/tenants/sys/$entity
    touch src/graphql/tenants/sys/$entity/{__init__,types,queries,mutations,loaders,permissions}.py
done

# Tenants > CRM > 엔티티들
for entity in customers contacts leads; do
    mkdir -p src/graphql/tenants/crm/$entity
    touch src/graphql/tenants/crm/$entity/{__init__,types,queries,mutations,loaders}.py
done

# Tenants > HRM > 엔티티들
for entity in employees attendance; do
    mkdir -p src/graphql/tenants/hrm/$entity
    touch src/graphql/tenants/hrm/$entity/{__init__,types,queries,mutations}.py
done

# Tenants > SCM > 엔티티들
for entity in products inventory; do
    mkdir -p src/graphql/tenants/scm/$entity
    touch src/graphql/tenants/scm/$entity/{__init__,types,queries,mutations}.py
done

touch src/graphql/tenants/{__init__,schema}.py
touch src/graphql/tenants/sys/{__init__,schema}.py
touch src/graphql/tenants/crm/{__init__,schema}.py
touch src/graphql/tenants/hrm/{__init__,schema}.py
touch src/graphql/tenants/scm/{__init__,schema}.py

echo ""
echo "✅ 3단계 구조 생성 완료!"
echo ""
echo "생성된 구조:"
echo "  manager/"
echo "    ├── idam/ (users, roles, permissions)"
echo "    └── tenant_mgmt/ (tenants, subscriptions)"
echo ""
echo "  tenants/"
echo "    ├── sys/ (users, branches, departments, roles)"
echo "    ├── crm/ (customers, contacts, leads)"
echo "    ├── hrm/ (employees, attendance)"
echo "    └── scm/ (products, inventory)"
echo ""
echo "다음 단계:"
echo "  1. common/ 모듈 구현"
echo "  2. manager/idam/users/ 부터 구현"
echo "  3. tenants/sys/users/ 구현"
echo "  4. 각 스키마별 schema.py 통합"
echo "  5. 시스템별 schema.py 통합"
echo "  6. 메인 schema.py 통합"


---

## 📊 구조 비교표

| 레벨 | v1.0/v2.0 (2단계) | v3.0 (3단계) ✅ |
|------|-------------------|-----------------|
| **1단계** | 시스템 (sys/crm) | **시스템명** (manager/tenants) |
| **2단계** | 엔티티 (user) | **스키마명** (idam/sys/crm) |
| **3단계** | - | **엔티티명** (users/branches) |
| **DataLoader** | `sys.user` | `tenants.sys.user` |
| **분리 수준** | 시스템+엔티티 | 시스템+스키마+엔티티 |
| **확장성** | 중간 | 매우 높음 ✅ |

---

## 🎯 3단계 구조의 장점

### 1. 명확한 시스템 분리
```
manager/    → Manager 앱 전용
tenants/    → Tenant 앱 전용
```

### 2. 스키마별 도메인 분리
```
tenants/sys/    → 시스템 관리
tenants/crm/    → 고객 관리
tenants/hrm/    → 인사 관리
tenants/scm/    → 공급망 관리
```

### 3. 명확한 네이밍
```python
# v2.0 (2단계) - 애매함
loaders["sys.user"]  # Manager의 user? Tenant의 user?

# v3.0 (3단계) - 명확함
loaders["manager.idam.user"]   # Manager 시스템, IDAM 스키마, User 엔티티
loaders["tenants.sys.user"]    # Tenants 시스템, SYS 스키마, User 엔티티
```

### 4. 팀별 작업 분리
```
팀 A: manager/idam/* 담당
팀 B: tenants/sys/* 담당
팀 C: tenants/crm/* 담당
→ 충돌 없이 병렬 개발 가능!
```

---

## 🚀 GraphQL 쿼리 예시

### Manager 사용자 조회
```graphql
query GetManagerUser {
  managerUser(id: "user-uuid") {
    id
    username
    email
    role {
      name
      permissions {
        code
      }
    }
  }
}
```

### Tenant 사용자 조회 (부서, 지점 포함)
```graphql
query GetTenantUser {
  tenantUser(id: "user-uuid") {
    id
    username
    fullName
    
    # tenants.sys.department loader
    department {
      name
      manager {
        fullName
      }
    }
    
    # tenants.sys.branch loader
    branch {
      branchCode
      branchName
      isMain
    }
    
    # tenants.sys.role loader
    role {
      name
    }
  }
}
```

### Manager와 Tenant 데이터 동시 조회
```graphql
query GetBothSystems {
  # Manager 시스템
  managerUser(id: "manager-user-id") {
    username
    role {
      name
    }
  }
  
  # Tenants 시스템
  tenantUser(id: "tenant-user-id") {
    username
    department {
      name
    }
  }
}
```

---

## 📋 마이그레이션 체크리스트

### Phase 1: 구조 생성 (1일)
- [ ] `scripts/migrate_to_3tier_structure.sh` 실행
- [ ] `common/` 모듈 파일 확인
- [ ] `manager/`, `tenants/` 폴더 확인

### Phase 2: Common 모듈 구현 (1일)
- [ ] `common/scalars.py` 구현
- [ ] `common/interfaces.py` 구현
- [ ] `common/base_types.py` 구현

### Phase 3: Manager/IDAM/Users 구현 (2일)
- [ ] `manager/idam/users/types.py`
- [ ] `manager/idam/users/queries.py`
- [ ] `manager/idam/users/mutations.py`
- [ ] `manager/idam/users/loaders.py`
- [ ] `manager/idam/users/permissions.py`
- [ ] 테스트 작성

### Phase 4: Tenants/SYS/Users 구현 (2일)
- [ ] `tenants/sys/users/types.py`
- [ ] `tenants/sys/users/queries.py`
- [ ] `tenants/sys/users/mutations.py`
- [ ] `tenants/sys/users/loaders.py`
- [ ] `tenants/sys/users/permissions.py`
- [ ] 테스트 작성

### Phase 5: 스키마 통합 (1주)
- [ ] `manager/idam/schema.py` 구현
- [ ] `manager/tenant_mgmt/schema.py` 구현
- [ ] `manager/schema.py` 통합
- [ ] `tenants/sys/schema.py` 구현
- [ ] `tenants/crm/schema.py` 구현
- [ ] `tenants/schema.py` 통합

### Phase 6: 메인 통합 및 테스트 (3일)
- [ ] `graphql/context.py` 업데이트
- [ ] `graphql/loaders.py` 3단계 네이밍 적용
- [ ] `graphql/schema.py` Manager+Tenants 통합
- [ ] 통합 테스트
- [ ] 문서 업데이트

---

## 💡 Best Practices

### 1. 파일 네이밍
```python
# ✅ 좋은 예
manager/idam/users/types.py         # ManagerUser
manager/idam/roles/types.py         # ManagerRole
tenants/sys/users/types.py          # TenantUser
tenants/sys/branches/types.py       # TenantBranch

# ❌ 나쁜 예
manager/idam/users/types.py         # User (충돌 가능!)
tenants/sys/users/types.py          # User (충돌!)
```

### 2. Import 경로
```python
# ✅ 명확한 import
from src.graphql.manager.idam.users.types import ManagerUser
from src.graphql.tenants.sys.users.types import TenantUser

# ❌ 애매한 import
from src.graphql.users.types import User  # 어느 시스템?
```

### 3. DataLoader 사용
```python
# ✅ 3단계 네이밍
department = await info.context.loaders["tenants.sys.department"].load(dept_id)
role = await info.context.loaders["manager.idam.role"].load(role_id)

# ❌ 2단계 네이밍 (충돌 가능)
department = await info.context.loaders["sys.department"].load(dept_id)
```

---

## 🎓 학습 경로

### 초급 개발자
1. 3단계 구조 개념 이해 (30분)
2. manager/idam/users 예시 코드 분석 (1시간)
3. tenants/sys/users 예시 코드 분석 (1시간)
4. 실습: 새 엔티티 추가

### 중급 개발자
1. 전체 구조 이해 (1시간)
2. 스키마 통합 방법 학습 (1시간)
3. DataLoader 3단계 네이밍 적용 (1시간)
4. 실습: 전체 스키마 구현

### 시니어/리드
1. v2.0 → v3.0 마이그레이션 계획 (2시간)
2. Context 멀티 DB 설계 검토 (1시간)
3. 팀 교육 자료 준비 (2시간)
4. 단계별 실행 관리

---

## 📈 예상 효과

### 코드 품질
- ✅ 시스템 분리 명확 → **유지보수 용이**
- ✅ 스키마별 도메인 분리 → **책임 명확화**
- ✅ 3단계 네이밍 → **충돌 제로**

### 개발 효율
- ✅ 팀별 병렬 작업 → **생산성 50% 향상**
- ✅ 명확한 구조 → **신규 개발자 온보딩 50% 단축**
- ✅ 독립적 배포 → **배포 리스크 감소**

### 확장성
- ✅ 신규 시스템 추가 용이
- ✅ 신규 스키마 추가 용이
- ✅ 마이크로서비스 전환 준비 완료

---

**작성일:** 2025년 11월 11일  
**버전:** 3.0.0  
**3단계 구조 ({시스템명}/{스키마명}/{엔티티명}) 완전 적용**
