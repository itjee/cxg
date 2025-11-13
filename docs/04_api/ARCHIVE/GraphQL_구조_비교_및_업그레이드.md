# GraphQL 구조 비교 및 업그레이드 가이드

> 기존 구조 → 최신 {시스템}/{스키마}/{엔티티} 구조로 업그레이드

---

## 📊 구조 비교

### ❌ 기존 구조 (Flat)
```
src/graphql/
├── types/
│   ├── base.py
│   └── tenants/
│       ├── user.py         # 모든 타입이 한 파일에
│       └── branch.py
├── queries/
│   └── tenants/
│       ├── user.py         # Query만
│       └── branch.py
├── mutations/
│   └── tenants/
│       ├── user.py         # Mutation만
│       └── branch.py
└── loaders.py              # 모든 DataLoader가 한 파일에
```

**문제점:**
- ❌ 시스템 구분 없음 (SYS, CRM, HRM 섞임)
- ❌ 파일이 비대해짐
- ❌ 관련 코드가 분산됨
- ❌ 확장성 부족

---

### ✅ 최신 구조 (Domain-Driven)
```
src/graphql/
├── common/                        # 공통 모듈
│   ├── scalars.py
│   ├── interfaces.py
│   └── base_types.py
│
├── sys/                           # 시스템: SYS
│   ├── __init__.py
│   ├── schema.py                  # SYS 통합 스키마
│   │
│   ├── user/                      # 엔티티: User
│   │   ├── __init__.py
│   │   ├── types.py               # 타입 + Input + Connection
│   │   ├── queries.py             # Query 리졸버
│   │   ├── mutations.py           # Mutation 리졸버
│   │   ├── loaders.py             # User 전용 DataLoader
│   │   └── permissions.py         # User 전용 권한
│   │
│   ├── branch/                    # 엔티티: Branch
│   │   ├── types.py
│   │   ├── queries.py
│   │   ├── mutations.py
│   │   └── loaders.py
│   │
│   └── role/                      # 엔티티: Role
│       ├── types.py
│       ├── queries.py
│       └── mutations.py
│
├── crm/                           # 시스템: CRM
│   ├── schema.py
│   │
│   ├── customer/                  # 엔티티: Customer
│   │   ├── types.py
│   │   ├── queries.py
│   │   └── mutations.py
│   │
│   └── contact/                   # 엔티티: Contact
│       └── ...
│
└── hrm/                           # 시스템: HRM
    ├── schema.py
    └── employee/
        └── ...
```

**장점:**
- ✅ 시스템별 명확한 분리
- ✅ 엔티티별 관련 코드 응집
- ✅ 확장 용이
- ✅ 팀별 작업 분리 가능

---

## �� 단계별 마이그레이션

### Step 1: common 모듈 생성

```bash
mkdir -p src/graphql/common
```

**src/graphql/common/scalars.py:**
```python
"""공통 스칼라 타입"""

from datetime import datetime
from uuid import UUID
import strawberry


@strawberry.scalar(
    serialize=lambda v: str(v),
    parse_value=lambda v: UUID(v),
    description="UUID 스칼라"
)
class UUIDScalar(UUID):
    pass


@strawberry.scalar(
    serialize=lambda v: v.isoformat() if v else None,
    parse_value=lambda v: datetime.fromisoformat(v) if v else None,
    description="DateTime 스칼라 (ISO 8601)"
)
class DateTimeScalar(datetime):
    pass
```

**src/graphql/common/interfaces.py:**
```python
"""공통 인터페이스 (Relay 스펙)"""

import strawberry
from strawberry import relay


@strawberry.interface
class Node(relay.Node):
    """
    Relay Node 인터페이스
    
    모든 엔티티가 구현해야 하는 기본 인터페이스
    """
    id: relay.NodeID[str]
```

**src/graphql/common/base_types.py:**
```python
"""공통 Base Types"""

import strawberry
from typing import Generic, TypeVar


@strawberry.type
class PageInfo:
    """페이지네이션 정보 (Relay 스펙)"""
    
    has_next_page: bool = strawberry.field(
        description="다음 페이지 존재 여부"
    )
    has_previous_page: bool = strawberry.field(
        description="이전 페이지 존재 여부"
    )
    start_cursor: str | None = strawberry.field(
        default=None,
        description="첫 번째 아이템의 커서"
    )
    end_cursor: str | None = strawberry.field(
        default=None,
        description="마지막 아이템의 커서"
    )
    total_count: int = strawberry.field(
        description="전체 아이템 수"
    )


@strawberry.type
class SuccessResponse:
    """성공 응답"""
    
    success: bool = strawberry.field(description="성공 여부")
    message: str | None = strawberry.field(
        default=None,
        description="메시지"
    )


@strawberry.type
class ErrorResponse:
    """에러 응답"""
    
    code: str = strawberry.field(description="에러 코드")
    message: str = strawberry.field(description="에러 메시지")
    field: str | None = strawberry.field(
        default=None,
        description="에러 발생 필드"
    )
```

---

### Step 2: SYS 시스템 생성

```bash
mkdir -p src/graphql/sys/user
mkdir -p src/graphql/sys/branch
mkdir -p src/graphql/sys/role
```

**src/graphql/sys/user/__init__.py:**
```python
"""User 엔티티 모듈"""

from .types import (
    User,
    UserCreateInput,
    UserUpdateInput,
    UserFilterInput,
    UserConnection,
    UserEdge,
)
from .queries import UserQueries
from .mutations import UserMutations
from .loaders import UserLoader, UserByUsernameLoader

__all__ = [
    # Types
    "User",
    "UserCreateInput",
    "UserUpdateInput",
    "UserFilterInput",
    "UserConnection",
    "UserEdge",
    # Resolvers
    "UserQueries",
    "UserMutations",
    # Loaders
    "UserLoader",
    "UserByUsernameLoader",
]
```

**src/graphql/sys/schema.py:**
```python
"""SYS 시스템 스키마 통합"""

import strawberry

from .user import UserQueries, UserMutations
from .branch import BranchQueries, BranchMutations
from .role import RoleQueries, RoleMutations


@strawberry.type
class SysQuery(
    UserQueries,
    BranchQueries,
    RoleQueries,
):
    """SYS 시스템 Query 통합"""
    pass


@strawberry.type
class SysMutation(
    UserMutations,
    BranchMutations,
    RoleMutations,
):
    """SYS 시스템 Mutation 통합"""
    pass
```

---

### Step 3: Context 및 Loader 통합 업데이트

**src/graphql/loaders.py:**
```python
"""모든 시스템의 DataLoader 생성"""

from sqlalchemy.ext.asyncio import AsyncSession

# SYS 시스템 Loaders
from src.graphql.sys.user.loaders import UserLoader, UserByUsernameLoader
from src.graphql.sys.branch.loaders import BranchLoader
from src.graphql.sys.role.loaders import RoleLoader
from src.graphql.sys.department.loaders import DepartmentLoader

# CRM 시스템 Loaders
from src.graphql.crm.customer.loaders import CustomerLoader
from src.graphql.crm.contact.loaders import ContactLoader


def create_loaders(db: AsyncSession) -> dict:
    """
    모든 DataLoader 생성
    
    네이밍 규칙: {시스템}.{엔티티}
    예: sys.user, crm.customer
    
    Args:
        db: 데이터베이스 세션
    
    Returns:
        DataLoader 딕셔너리
    """
    return {
        # SYS 시스템
        "sys.user": UserLoader(db),
        "sys.user_by_username": UserByUsernameLoader(db),
        "sys.branch": BranchLoader(db),
        "sys.role": RoleLoader(db),
        "sys.department": DepartmentLoader(db),
        
        # CRM 시스템
        "crm.customer": CustomerLoader(db),
        "crm.contact": ContactLoader(db),
        
        # HRM 시스템
        # "hrm.employee": EmployeeLoader(db),
    }
```

---

### Step 4: 메인 스키마 업데이트

**src/graphql/schema.py:**
```python
"""GraphQL 메인 스키마 - v2.0"""

import strawberry
from strawberry.extensions import QueryDepthLimiter

from src.core.config import settings

# 시스템별 스키마 import
from src.graphql.sys.schema import SysQuery, SysMutation
from src.graphql.crm.schema import CrmQuery, CrmMutation
# from src.graphql.hrm.schema import HrmQuery, HrmMutation


@strawberry.type(description="GraphQL Root Query")
class Query(
    SysQuery,
    CrmQuery,
    # HrmQuery,
):
    """
    루트 Query
    
    모든 시스템의 Query를 통합합니다.
    - SYS: 시스템 관리 (사용자, 권한, 지점 등)
    - CRM: 고객 관리
    - HRM: 인사 관리
    """
    
    @strawberry.field(description="API 버전")
    def version(self) -> str:
        """API 버전 정보"""
        return "2.0.0"
    
    @strawberry.field(description="서버 상태")
    def health(self) -> str:
        """헬스 체크"""
        return "healthy"


@strawberry.type(description="GraphQL Root Mutation")
class Mutation(
    SysMutation,
    CrmMutation,
    # HrmMutation,
):
    """
    루트 Mutation
    
    모든 시스템의 Mutation을 통합합니다.
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

## 🚀 자동 마이그레이션 스크립트

```bash
#!/bin/bash
# scripts/migrate_graphql_structure.sh

echo "🚀 GraphQL 구조 마이그레이션 시작"

# 1. common 폴더 생성
echo "📁 common 폴더 생성..."
mkdir -p src/graphql/common
touch src/graphql/common/__init__.py
touch src/graphql/common/scalars.py
touch src/graphql/common/interfaces.py
touch src/graphql/common/base_types.py

# 2. SYS 시스템 폴더 생성
echo "📁 SYS 시스템 폴더 생성..."
mkdir -p src/graphql/sys/{user,branch,role,department}

for entity in user branch role department; do
    touch src/graphql/sys/$entity/__init__.py
    touch src/graphql/sys/$entity/types.py
    touch src/graphql/sys/$entity/queries.py
    touch src/graphql/sys/$entity/mutations.py
    touch src/graphql/sys/$entity/loaders.py
    touch src/graphql/sys/$entity/permissions.py
done

touch src/graphql/sys/__init__.py
touch src/graphql/sys/schema.py

# 3. CRM 시스템 폴더 생성
echo "📁 CRM 시스템 폴더 생성..."
mkdir -p src/graphql/crm/{customer,contact}

for entity in customer contact; do
    touch src/graphql/crm/$entity/__init__.py
    touch src/graphql/crm/$entity/types.py
    touch src/graphql/crm/$entity/queries.py
    touch src/graphql/crm/$entity/mutations.py
    touch src/graphql/crm/$entity/loaders.py
done

touch src/graphql/crm/__init__.py
touch src/graphql/crm/schema.py

# 4. 기존 파일 백업
echo "💾 기존 파일 백업..."
if [ -d "src/graphql/types" ]; then
    mv src/graphql/types src/graphql/types.backup
    mv src/graphql/queries src/graphql/queries.backup
    mv src/graphql/mutations src/graphql/mutations.backup
fi

echo "✅ 마이그레이션 완료!"
echo ""
echo "다음 단계:"
echo "1. common/ 파일들 구현"
echo "2. sys/user/ 부터 순차적으로 구현"
echo "3. 기존 backup 폴더의 코드 참고하여 이전"
echo "4. 테스트 후 backup 폴더 삭제"
```

---

## �� 체크리스트

### Phase 1: 구조 생성 (1일)
- [ ] `src/graphql/common/` 생성
- [ ] `src/graphql/sys/` 생성
- [ ] `src/graphql/crm/` 생성
- [ ] 마이그레이션 스크립트 실행

### Phase 2: User 엔티티 이전 (2일)
- [ ] `sys/user/types.py` 구현
- [ ] `sys/user/queries.py` 구현
- [ ] `sys/user/mutations.py` 구현
- [ ] `sys/user/loaders.py` 구현
- [ ] `sys/user/permissions.py` 구현
- [ ] 테스트 작성 및 검증

### Phase 3: 나머지 SYS 엔티티 (1주)
- [ ] Branch 이전
- [ ] Role 이전
- [ ] Department 이전
- [ ] 통합 테스트

### Phase 4: CRM 시스템 (1주)
- [ ] Customer 이전
- [ ] Contact 이전

### Phase 5: 정리 (2일)
- [ ] 기존 backup 폴더 삭제
- [ ] 문서 업데이트
- [ ] 팀 교육

---

## 🎯 예상 효과

### 개발 생산성
- ✅ 관련 코드 응집 → **개발 속도 30% 향상**
- ✅ 시스템별 분리 → **병렬 개발 가능**
- ✅ 명확한 구조 → **신입 온보딩 시간 50% 단축**

### 유지보수성
- ✅ 엔티티별 독립성 → **버그 수정 용이**
- ✅ 테스트 분리 → **테스트 커버리지 향상**
- ✅ 확장성 → **신규 시스템 추가 용이**

---

**작성일:** 2025년 11월 11일  
**최신 구조로 업그레이드!**
