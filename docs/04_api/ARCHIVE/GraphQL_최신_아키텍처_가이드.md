# GraphQL 최신 아키텍처 가이드 (2025)

> **Schema-First Design + Domain-Driven 구조**
> - 최신 GraphQL 트렌드 반영
> - {시스템}/{스키마}/{엔티티} 구조
> - Code Generation & Type Safety

---

## 📊 최신 GraphQL 트렌드 (2025)

### 1. Schema-First Design ✅ 권장
```graphql
# schema/sys/user.graphql
"""사용자 타입 정의"""
type User {
  id: ID!
  username: String!
  email: String!
  department: Department
  role: Role
}

# 먼저 스키마 정의 → 코드 생성
```

### 2. Code-First (현재 Strawberry) ⚠️ 유지 가능
```python
# types/sys/user.py
@strawberry.type
class User:
    id: UUID
    username: str
    email: str
```

### 3. Federation (마이크로서비스) 🚀 차세대
```graphql
# 각 서비스가 독립적인 서브그래프
type User @key(fields: "id") {
  id: ID!
  username: String!
}

# Apollo Federation Gateway가 통합
```

---

## 🏗 권장 디렉토리 구조: {시스템}/{스키마}/{엔티티}

### 현재 구조 (개선 필요)
```
src/graphql/
├── types/
│   └── tenants/user.py        # ❌ 시스템 구분 없음
├── queries/
│   └── tenants/user.py
└── mutations/
    └── tenants/user.py
```

### 개선된 구조 ✅
```
apps/backend-api/
├── src/
│   ├── graphql/
│   │   ├── schema.py                 # 메인 통합 스키마
│   │   ├── context.py
│   │   ├── loaders.py
│   │   ├── permissions.py
│   │   │
│   │   ├── schemas/                  # [신규] 스키마 정의 (선택사항)
│   │   │   ├── sys/                  # 시스템별
│   │   │   │   ├── user.graphql
│   │   │   │   ├── branch.graphql
│   │   │   │   └── role.graphql
│   │   │   ├── crm/
│   │   │   │   ├── customer.graphql
│   │   │   │   └── contact.graphql
│   │   │   └── hrm/
│   │   │       └── employee.graphql
│   │   │
│   │   ├── sys/                      # 시스템: SYS (시스템 관리)
│   │   │   ├── __init__.py
│   │   │   ├── schema.py             # SYS 통합 스키마
│   │   │   │
│   │   │   ├── user/                 # 엔티티: User
│   │   │   │   ├── __init__.py
│   │   │   │   ├── types.py          # GraphQL 타입
│   │   │   │   ├── queries.py        # Query 리졸버
│   │   │   │   ├── mutations.py      # Mutation 리졸버
│   │   │   │   ├── loaders.py        # DataLoader
│   │   │   │   └── permissions.py    # 권한 체크
│   │   │   │
│   │   │   ├── branch/               # 엔티티: Branch
│   │   │   │   ├── types.py
│   │   │   │   ├── queries.py
│   │   │   │   └── mutations.py
│   │   │   │
│   │   │   ├── role/                 # 엔티티: Role
│   │   │   │   ├── types.py
│   │   │   │   ├── queries.py
│   │   │   │   └── mutations.py
│   │   │   │
│   │   │   └── department/           # 엔티티: Department
│   │   │       ├── types.py
│   │   │       ├── queries.py
│   │   │       └── mutations.py
│   │   │
│   │   ├── crm/                      # 시스템: CRM (고객관리)
│   │   │   ├── __init__.py
│   │   │   ├── schema.py
│   │   │   │
│   │   │   ├── customer/             # 엔티티: Customer
│   │   │   │   ├── types.py
│   │   │   │   ├── queries.py
│   │   │   │   └── mutations.py
│   │   │   │
│   │   │   └── contact/              # 엔티티: Contact
│   │   │       ├── types.py
│   │   │       ├── queries.py
│   │   │       └── mutations.py
│   │   │
│   │   ├── hrm/                      # 시스템: HRM (인사관리)
│   │   │   ├── schema.py
│   │   │   │
│   │   │   ├── employee/
│   │   │   │   ├── types.py
│   │   │   │   ├── queries.py
│   │   │   │   └── mutations.py
│   │   │   │
│   │   │   └── attendance/
│   │   │       ├── types.py
│   │   │       └── queries.py
│   │   │
│   │   └── common/                   # 공통 (Base Types)
│   │       ├── __init__.py
│   │       ├── scalars.py            # UUID, DateTime 등
│   │       ├── interfaces.py         # Node, Edge 등
│   │       └── base_types.py         # PageInfo, Connection
│   │
│   └── services/                     # 비즈니스 로직 (변경 없음)
│       ├── sys/
│       │   ├── user_service.py
│       │   └── branch_service.py
│       └── crm/
│           └── customer_service.py
```

---

## 📝 구체적 구현 예시

### 1. 시스템별 스키마 통합 (sys/schema.py)

```python
"""SYS 시스템 GraphQL 스키마 통합"""

import strawberry

from .user.queries import UserQueries
from .user.mutations import UserMutations
from .branch.queries import BranchQueries
from .branch.mutations import BranchMutations
from .role.queries import RoleQueries
from .role.mutations import RoleMutations


@strawberry.type
class SysQuery(UserQueries, BranchQueries, RoleQueries):
    """SYS 시스템 Query 통합"""
    pass


@strawberry.type
class SysMutation(UserMutations, BranchMutations, RoleMutations):
    """SYS 시스템 Mutation 통합"""
    pass
```

### 2. 엔티티별 타입 정의 (sys/user/types.py)

```python
"""User 엔티티 GraphQL 타입"""

from datetime import datetime
from typing import Optional
from uuid import UUID

import strawberry
from strawberry import relay

from src.graphql.common.scalars import DateTimeScalar, UUIDScalar


@strawberry.type
class User(relay.Node):
    """
    사용자 타입
    
    SYS 시스템의 핵심 엔티티로, 인증 및 권한 관리의 주체입니다.
    """
    
    # 기본 필드
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
    
    # 선택 필드
    phone: Optional[str] = strawberry.field(
        default=None,
        description="전화번호"
    )
    position: Optional[str] = strawberry.field(
        default=None,
        description="직위"
    )
    
    # 관계 필드 (DataLoader 사용)
    @strawberry.field(description="소속 부서")
    async def department(self, info) -> Optional["Department"]:
        """부서 정보 (N+1 방지)"""
        if not self.department_id:
            return None
        return await info.context.loaders["sys.department"].load(self.department_id)
    
    @strawberry.field(description="사용자 역할")
    async def role(self, info) -> Optional["Role"]:
        """역할 정보 (N+1 방지)"""
        if not self.role_id:
            return None
        return await info.context.loaders["sys.role"].load(self.role_id)
    
    @strawberry.field(description="사용자가 속한 지점")
    async def branch(self, info) -> Optional["Branch"]:
        """지점 정보 (N+1 방지)"""
        if not self.branch_id:
            return None
        return await info.context.loaders["sys.branch"].load(self.branch_id)
    
    # 메타 필드
    is_active: bool = strawberry.field(
        description="활성 상태"
    )
    is_system_user: bool = strawberry.field(
        description="시스템 사용자 여부"
    )
    last_login_at: Optional[DateTimeScalar] = strawberry.field(
        default=None,
        description="마지막 로그인 시간"
    )
    created_at: DateTimeScalar = strawberry.field(
        description="생성 시간"
    )
    updated_at: Optional[DateTimeScalar] = strawberry.field(
        default=None,
        description="수정 시간"
    )


@strawberry.input
class UserCreateInput:
    """사용자 생성 입력"""
    
    username: str = strawberry.field(
        description="사용자명 (4-20자, 영문/숫자)"
    )
    email: str = strawberry.field(
        description="이메일 주소"
    )
    password: str = strawberry.field(
        description="비밀번호 (최소 8자)"
    )
    full_name: str = strawberry.field(
        description="전체 이름"
    )
    phone: Optional[str] = None
    department_id: Optional[UUIDScalar] = None
    branch_id: Optional[UUIDScalar] = None
    role_id: Optional[UUIDScalar] = None


@strawberry.input
class UserUpdateInput:
    """사용자 수정 입력"""
    
    email: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    position: Optional[str] = None
    department_id: Optional[UUIDScalar] = None
    branch_id: Optional[UUIDScalar] = None
    role_id: Optional[UUIDScalar] = None
    is_active: Optional[bool] = None


@strawberry.input
class UserFilterInput:
    """사용자 필터 입력"""
    
    search: Optional[str] = strawberry.field(
        default=None,
        description="검색어 (username, full_name, email)"
    )
    is_active: Optional[bool] = strawberry.field(
        default=None,
        description="활성 상태 필터"
    )
    department_id: Optional[UUIDScalar] = strawberry.field(
        default=None,
        description="부서 ID 필터"
    )
    branch_id: Optional[UUIDScalar] = strawberry.field(
        default=None,
        description="지점 ID 필터"
    )
    role_id: Optional[UUIDScalar] = strawberry.field(
        default=None,
        description="역할 ID 필터"
    )


# Relay Connection Types
@strawberry.type
class UserEdge(relay.Edge):
    """사용자 엣지"""
    node: User


@strawberry.type
class UserConnection(relay.Connection):
    """사용자 연결"""
    edges: list[UserEdge]
```

### 3. 엔티티별 Query (sys/user/queries.py)

```python
"""User 엔티티 Query 리졸버"""

from typing import Optional
from uuid import UUID

import strawberry
from strawberry import relay

from src.graphql.common.base_types import PageInfo
from .types import User, UserConnection, UserEdge, UserFilterInput
from .permissions import check_user_read_permission
from src.services.sys.user_service import UserService


@strawberry.type
class UserQueries:
    """User 관련 Query"""
    
    @strawberry.field(description="사용자 단건 조회")
    async def user(
        self,
        info,
        id: UUID,
    ) -> Optional[User]:
        """
        사용자 ID로 조회
        
        Args:
            id: 사용자 ID
        
        Returns:
            User 객체 또는 None
        
        Raises:
            PermissionDenied: 권한 없음
        """
        check_user_read_permission(info.context)
        
        db = info.context.db_session
        user_model = await UserService.get_by_id(db, id)
        
        if not user_model:
            return None
        
        return User.from_orm(user_model)
    
    @strawberry.field(description="사용자 목록 조회 (Relay 페이지네이션)")
    async def users(
        self,
        info,
        first: int = 20,
        after: Optional[str] = None,
        filter: Optional[UserFilterInput] = None,
    ) -> UserConnection:
        """
        사용자 목록 조회
        
        Args:
            first: 조회할 개수 (기본 20, 최대 100)
            after: 커서 (이전 페이지 마지막 커서)
            filter: 필터 조건
        
        Returns:
            UserConnection (Relay 스타일)
        """
        check_user_read_permission(info.context)
        
        # 최대 제한
        first = min(first, 100)
        
        db = info.context.db_session
        
        # 서비스 레이어 호출
        result = await UserService.get_list_with_pagination(
            db,
            first=first,
            after=after,
            filter=filter.to_dict() if filter else None
        )
        
        # Edge 생성
        edges = [
            UserEdge(
                cursor=relay.to_base64("User", str(user.id)),
                node=User.from_orm(user)
            )
            for user in result.items
        ]
        
        # PageInfo 생성
        page_info = PageInfo(
            has_next_page=result.has_next,
            has_previous_page=after is not None,
            start_cursor=edges[0].cursor if edges else None,
            end_cursor=edges[-1].cursor if edges else None,
            total_count=result.total_count,
        )
        
        return UserConnection(edges=edges, page_info=page_info)
    
    @strawberry.field(description="현재 로그인한 사용자")
    async def me(self, info) -> Optional[User]:
        """
        현재 사용자 정보 조회
        
        Returns:
            User 객체
        """
        user_id = UUID(info.context.user_id)
        db = info.context.db_session
        
        user_model = await UserService.get_by_id(db, user_id)
        if not user_model:
            return None
        
        return User.from_orm(user_model)
    
    @strawberry.field(description="사용자명으로 검색")
    async def search_users_by_username(
        self,
        info,
        username: str,
        limit: int = 10,
    ) -> list[User]:
        """
        사용자명으로 검색 (자동완성용)
        
        Args:
            username: 검색할 사용자명
            limit: 최대 결과 수
        
        Returns:
            User 목록
        """
        check_user_read_permission(info.context)
        
        db = info.context.db_session
        users = await UserService.search_by_username(db, username, limit)
        
        return [User.from_orm(user) for user in users]
```

### 4. 엔티티별 Mutation (sys/user/mutations.py)

```python
"""User 엔티티 Mutation 리졸버"""

from uuid import UUID

import strawberry

from .types import User, UserCreateInput, UserUpdateInput
from .permissions import check_user_write_permission, check_user_delete_permission
from src.graphql.common.base_types import SuccessResponse
from src.services.sys.user_service import UserService


@strawberry.type
class UserMutations:
    """User 관련 Mutation"""
    
    @strawberry.mutation(description="사용자 생성")
    async def create_user(
        self,
        info,
        input: UserCreateInput,
    ) -> User:
        """
        새 사용자 생성
        
        Args:
            input: 사용자 생성 데이터
        
        Returns:
            생성된 User
        
        Raises:
            PermissionDenied: 권한 없음
            ValidationError: 입력 검증 실패
        """
        check_user_write_permission(info.context)
        
        db = info.context.db_session
        creator_id = UUID(info.context.user_id)
        
        # 서비스 레이어 호출
        user_model = await UserService.create(
            db,
            data=input.to_dict(),
            created_by=creator_id
        )
        
        return User.from_orm(user_model)
    
    @strawberry.mutation(description="사용자 정보 수정")
    async def update_user(
        self,
        info,
        id: UUID,
        input: UserUpdateInput,
    ) -> User:
        """
        사용자 정보 수정
        
        Args:
            id: 사용자 ID
            input: 수정할 데이터
        
        Returns:
            수정된 User
        """
        check_user_write_permission(info.context)
        
        db = info.context.db_session
        updater_id = UUID(info.context.user_id)
        
        user_model = await UserService.update(
            db,
            user_id=id,
            data=input.to_dict(exclude_none=True),
            updated_by=updater_id
        )
        
        return User.from_orm(user_model)
    
    @strawberry.mutation(description="사용자 삭제")
    async def delete_user(
        self,
        info,
        id: UUID,
    ) -> SuccessResponse:
        """
        사용자 삭제 (소프트 삭제)
        
        Args:
            id: 사용자 ID
        
        Returns:
            성공 메시지
        """
        check_user_delete_permission(info.context)
        
        db = info.context.db_session
        deleter_id = UUID(info.context.user_id)
        
        await UserService.soft_delete(db, user_id=id, deleted_by=deleter_id)
        
        return SuccessResponse(
            success=True,
            message=f"사용자가 삭제되었습니다"
        )
    
    @strawberry.mutation(description="비밀번호 변경")
    async def change_password(
        self,
        info,
        current_password: str,
        new_password: str,
    ) -> SuccessResponse:
        """
        비밀번호 변경
        
        Args:
            current_password: 현재 비밀번호
            new_password: 새 비밀번호
        
        Returns:
            성공 메시지
        """
        db = info.context.db_session
        user_id = UUID(info.context.user_id)
        
        await UserService.change_password(
            db,
            user_id=user_id,
            current_password=current_password,
            new_password=new_password
        )
        
        return SuccessResponse(
            success=True,
            message="비밀번호가 변경되었습니다"
        )
```

### 5. 엔티티별 DataLoader (sys/user/loaders.py)

```python
"""User 엔티티 DataLoader"""

from typing import List
from uuid import UUID

from aiodataloader import DataLoader
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.sys import Users


class UserLoader(DataLoader):
    """
    User DataLoader (N+1 문제 해결)
    
    배치 로딩으로 성능 최적화
    """
    
    def __init__(self, db: AsyncSession):
        super().__init__()
        self.db = db
    
    async def batch_load_fn(self, keys: List[UUID]) -> List:
        """
        사용자 일괄 로딩
        
        Args:
            keys: 사용자 ID 목록
        
        Returns:
            사용자 목록 (키 순서대로)
        """
        stmt = select(Users).where(
            Users.id.in_(keys),
            Users.is_deleted == False
        )
        result = await self.db.execute(stmt)
        users = result.scalars().all()
        
        # ID로 매핑
        user_map = {user.id: user for user in users}
        
        # 키 순서대로 반환 (None 포함)
        return [user_map.get(key) for key in keys]


class UserByUsernameLoader(DataLoader):
    """사용자명으로 로딩"""
    
    def __init__(self, db: AsyncSession):
        super().__init__()
        self.db = db
    
    async def batch_load_fn(self, usernames: List[str]) -> List:
        """사용자명으로 일괄 로딩"""
        stmt = select(Users).where(
            Users.username.in_(usernames),
            Users.is_deleted == False
        )
        result = await self.db.execute(stmt)
        users = result.scalars().all()
        
        user_map = {user.username: user for user in users}
        return [user_map.get(username) for username in usernames]
```

### 6. 메인 스키마 통합 (graphql/schema.py)

```python
"""GraphQL 메인 스키마 - 모든 시스템 통합"""

import strawberry

from src.graphql.sys.schema import SysQuery, SysMutation
from src.graphql.crm.schema import CrmQuery, CrmMutation
from src.graphql.hrm.schema import HrmQuery, HrmMutation


@strawberry.type
class Query(SysQuery, CrmQuery, HrmQuery):
    """
    GraphQL Root Query
    
    모든 시스템의 Query 통합
    """
    
    @strawberry.field(description="API 버전 확인")
    def api_version(self) -> str:
        """API 버전"""
        return "2.0.0"
    
    @strawberry.field(description="서버 상태 확인")
    def health(self) -> str:
        """헬스 체크"""
        return "healthy"


@strawberry.type
class Mutation(SysMutation, CrmMutation, HrmMutation):
    """
    GraphQL Root Mutation
    
    모든 시스템의 Mutation 통합
    """
    pass


# 스키마 생성
schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    # Relay 스타일 ID 변환
    config=strawberry.Config(
        relay_max_results=100,
    )
)
```

---

## 🎯 최신 트렌드 반영 사항

### 1. ✅ Relay 스펙 완전 준수
```graphql
# Node 인터페이스
interface Node {
  id: ID!
}

# Connection 타입
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
}

# Edge 타입
type UserEdge {
  cursor: String!
  node: User!
}
```

### 2. ✅ DataLoader 패턴 (Facebook 권장)
```python
# 시스템.엔티티 네이밍
loaders = {
    "sys.user": UserLoader(db),
    "sys.department": DepartmentLoader(db),
    "sys.branch": BranchLoader(db),
    "crm.customer": CustomerLoader(db),
}
```

### 3. ✅ Input Type 패턴
```python
@strawberry.input
class UserCreateInput:
    """생성 전용 Input"""
    username: str
    password: str  # 생성 시만 필요

@strawberry.input
class UserUpdateInput:
    """수정 전용 Input (모든 필드 Optional)"""
    username: Optional[str] = None
    # password는 별도 Mutation

@strawberry.input
class UserFilterInput:
    """필터 전용 Input"""
    search: Optional[str] = None
    is_active: Optional[bool] = None
```

### 4. ✅ Field-level Documentation
```python
@strawberry.field(
    description="사용자 ID로 조회",
    deprecation_reason="user_by_id를 사용하세요 (v3에서 제거 예정)"
)
async def get_user(self, id: UUID) -> User:
    ...
```

### 5. ✅ Error Handling (Union Types)
```python
@strawberry.type
class UserNotFoundError:
    message: str
    user_id: UUID

@strawberry.type
class UserSuccess:
    user: User

UserResult = strawberry.union(
    "UserResult",
    (UserSuccess, UserNotFoundError)
)

@strawberry.field
async def user(self, id: UUID) -> UserResult:
    user = await get_user(id)
    if not user:
        return UserNotFoundError(
            message="사용자를 찾을 수 없습니다",
            user_id=id
        )
    return UserSuccess(user=user)
```

### 6. ✅ Directive 활용
```python
@strawberry.directive(
    locations=[DirectiveLocation.FIELD_DEFINITION]
)
def auth(permissions: list[str]):
    """인증 디렉티브"""
    pass

@strawberry.type
class User:
    email: str = strawberry.field(
        directives=[auth(permissions=["user:read_email"])]
    )
```

---

## 📊 마이그레이션 계획

### Phase 1: 구조 재조정 (1주)
```bash
# 기존 구조
src/graphql/types/tenants/user.py
src/graphql/queries/tenants/user.py
src/graphql/mutations/tenants/user.py

# 신규 구조
src/graphql/sys/user/types.py
src/graphql/sys/user/queries.py
src/graphql/sys/user/mutations.py
src/graphql/sys/user/loaders.py
```

### Phase 2: 타입 개선 (1주)
- Relay Connection 적용
- Input Type 분리
- Union Type 에러 처리

### Phase 3: DataLoader 네이밍 통일 (3일)
```python
# 기존
loaders["department"]

# 신규
loaders["sys.department"]  # 시스템.엔티티
```

### Phase 4: 문서화 강화 (3일)
- 모든 필드에 description 추가
- Deprecation 표시
- 예제 쿼리 작성

---

## 🚀 다음 단계

1. ✅ 구조 재조정 스크립트 실행
2. ✅ 시스템별 스키마 분리
3. ✅ Relay 스펙 적용
4. ✅ DataLoader 네이밍 통일
5. ✅ 문서 자동 생성 (graphql-code-generator)

---

**작성일:** 2025년 11월 11일  
**최신 GraphQL 트렌드 (2025) 완전 반영**
