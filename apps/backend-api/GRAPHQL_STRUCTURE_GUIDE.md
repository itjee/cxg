# GraphQL 모듈 구조 가이드

## 📁 표준 파일 구조

각 GraphQL 엔티티 모듈은 다음 6개 파일로 구성됩니다:

```
entity_name/
├── __init__.py      # 모듈 exports
├── types.py         # GraphQL 타입 정의
├── queries.py       # Query 구현
├── mutations.py     # Mutation 구현
├── resolvers.py     # Field Resolvers (복잡한 경우)
├── loaders.py       # DataLoader 구현
└── permissions.py   # 권한 검증 데코레이터
```

---

## 📄 파일별 역할

### 1. `types.py` - GraphQL 타입 정의

**역할**: GraphQL 스키마의 타입과 Input 정의

```python
import strawberry
from src.graphql.common import Node

@strawberry.type(description="사용자")
class User(Node):
    """사용자 타입"""
    id: strawberry.ID
    username: str = strawberry.field(description="사용자명")
    email: str = strawberry.field(description="이메일")
    
    # 간단한 field resolver는 여기에
    @strawberry.field(description="전체 이름")
    def full_name(self) -> str:
        """간단한 계산 필드"""
        return f"{self.first_name} {self.last_name}"
    
    # 복잡한 field resolver는 resolvers.py에서 import
    @strawberry.field(description="사용자 역할")
    async def roles(self, info) -> list["Role"]:
        """복잡한 필드는 resolvers.py로 위임"""
        from .resolvers import resolve_user_roles
        return await resolve_user_roles(self.id, info)

@strawberry.input(description="사용자 생성 입력")
class UserCreateInput:
    """사용자 생성 Input"""
    username: str
    email: str
    password: str
```

**규칙**:
- Type과 Input 정의만 포함
- 간단한 field resolver (동기, 계산만)는 여기에 구현
- 복잡한 field resolver는 `resolvers.py`로 분리

---

### 2. `queries.py` - Query 구현

**역할**: GraphQL Query 엔드포인트 구현

```python
import strawberry
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from .types import User

async def get_user(db: AsyncSession, user_id: UUID) -> User:
    """사용자 조회 (헬퍼 함수)"""
    # 실제 DB 조회 로직
    pass

@strawberry.type
class UserQueries:
    """User Query"""
    
    @strawberry.field(description="사용자 조회")
    async def user(self, info, id: strawberry.ID) -> User:
        """사용자 단건 조회"""
        db = info.context.manager_db_session
        return await get_user(db, UUID(id))
    
    @strawberry.field(description="사용자 목록")
    async def users(self, info, limit: int = 20) -> list[User]:
        """사용자 목록 조회"""
        db = info.context.manager_db_session
        # 구현...
        pass
```

**규칙**:
- 조회(Query) 로직만 포함
- 헬퍼 함수와 Query 클래스로 구성
- 비즈니스 로직은 최소화 (간단한 CRUD만)

---

### 3. `mutations.py` - Mutation 구현

**역할**: GraphQL Mutation 엔드포인트 구현

```python
import strawberry
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from .types import User, UserCreateInput

async def create_user(db: AsyncSession, data: UserCreateInput) -> User:
    """사용자 생성 (헬퍼 함수)"""
    # 실제 생성 로직
    pass

@strawberry.type
class UserMutations:
    """User Mutation"""
    
    @strawberry.mutation(description="사용자 생성")
    async def create_user(self, info, input: UserCreateInput) -> User:
        """새 사용자 생성"""
        db = info.context.manager_db_session
        return await create_user(db, input)
```

**규칙**:
- 변경(Mutation) 로직만 포함
- 헬퍼 함수와 Mutation 클래스로 구성
- 복잡한 비즈니스 로직 구현

---

### 4. `resolvers.py` - Field Resolvers ⭐ (중요!)

**역할**: Type 필드의 복잡한 resolver 로직 구현

```python
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

async def resolve_user_roles(user_id: UUID, info) -> list["Role"]:
    """사용자의 역할 목록 조회 (복잡한 로직)"""
    db = info.context.manager_db_session
    
    # DataLoader 사용
    loader = info.context.loaders.get("role_by_user_loader")
    if loader:
        return await loader.load(user_id)
    
    # 직접 조회
    from src.models.manager.idam import UserRole, Role
    result = await db.execute(
        select(Role)
        .join(UserRole)
        .where(UserRole.user_id == user_id)
    )
    return result.scalars().all()

async def resolve_user_permissions(user_id: UUID, info) -> list[str]:
    """사용자의 권한 목록 조회"""
    # 복잡한 권한 계산 로직
    pass
```

**규칙**:
- **비동기** field resolver만 포함
- DB 조회가 필요한 필드
- 복잡한 계산이 필요한 필드
- DataLoader와 연계

---

### 5. `loaders.py` - DataLoader 구현

**역할**: N+1 문제 해결을 위한 DataLoader

```python
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from strawberry.dataloader import DataLoader

async def load_roles_by_user_ids(
    db: AsyncSession, user_ids: list[UUID]
) -> list[list["Role"]]:
    """여러 사용자의 역할 일괄 조회"""
    from src.models.manager.idam import UserRole, Role
    
    result = await db.execute(
        select(UserRole, Role)
        .join(Role)
        .where(UserRole.user_id.in_(user_ids))
    )
    
    # 결과를 user_id별로 그룹화
    roles_by_user = {}
    for user_role, role in result:
        if user_role.user_id not in roles_by_user:
            roles_by_user[user_role.user_id] = []
        roles_by_user[user_role.user_id].append(role)
    
    # 순서 유지
    return [roles_by_user.get(uid, []) for uid in user_ids]

def create_role_by_user_loader(db: AsyncSession) -> DataLoader:
    """Role by User DataLoader 생성"""
    async def load_fn(keys: list[UUID]) -> list[list["Role"]]:
        return await load_roles_by_user_ids(db, keys)
    
    return DataLoader(load_fn=load_fn)
```

**규칙**:
- N+1 쿼리 문제 해결
- 일괄 조회 함수 구현
- DataLoader 팩토리 함수 제공

---

### 6. `permissions.py` - 권한 검증

**역할**: 필드/Query/Mutation의 권한 검증

```python
from functools import wraps
from src.core.exceptions import UnauthorizedError

def require_authentication(func):
    """인증 필수"""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        info = kwargs.get("info") or args[1]
        if not info.context.user_id:
            raise UnauthorizedError("인증이 필요합니다")
        return await func(*args, **kwargs)
    return wrapper

def require_role(*required_roles: str):
    """특정 역할 필수"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            info = kwargs.get("info") or args[1]
            user_role = info.context.role
            if user_role not in required_roles:
                raise UnauthorizedError("권한이 없습니다")
            return await func(*args, **kwargs)
        return wrapper
    return decorator
```

**규칙**:
- 데코레이터 형태로 구현
- Query/Mutation에 적용
- Field resolver에도 적용 가능

---

## 🎯 파일 사용 패턴 정리

| 파일 | 주요 용도 | 구현 내용 |
|------|-----------|-----------|
| `types.py` | 타입 정의 | Type, Input, 간단한 field |
| `queries.py` | 조회 | Query 엔드포인트 |
| `mutations.py` | 변경 | Mutation 엔드포인트 |
| **`resolvers.py`** | **필드 조회** | **복잡한 field resolver** ⭐ |
| `loaders.py` | 최적화 | DataLoader (N+1 해결) |
| `permissions.py` | 보안 | 권한 검증 데코레이터 |

---

## 📝 현재 프로젝트 상태

### ✅ 현재 구현된 것:
- `types.py`, `queries.py`, `mutations.py` ✅
- `loaders.py`, `permissions.py` (일부 구현) ✅

### ❌ 누락된 것:
- **`resolvers.py`** ❌ (대부분 모듈에서 누락)
- Field resolver가 `types.py`에 섞여 있음
- 복잡한 로직 분리 필요

---

## 🔧 개선 방안

### 1. `resolvers.py` 추가
모든 엔티티 모듈에 `resolvers.py` 추가하여:
- 복잡한 field resolver 분리
- types.py 간결화
- 로직 재사용성 향상

### 2. types.py 리팩토링
```python
# Before: types.py에 모든 것
@strawberry.type
class User(Node):
    @strawberry.field
    async def roles(self, info) -> list["Role"]:
        # 복잡한 로직이 여기에...
        loader = info.context.loaders.get("role_loader")
        return await loader.load(self.id)

# After: resolvers.py로 분리
@strawberry.type
class User(Node):
    @strawberry.field
    async def roles(self, info) -> list["Role"]:
        from .resolvers import resolve_user_roles
        return await resolve_user_roles(self.id, info)
```

### 3. 파일 역할 명확화
- **types.py**: 타입 정의만
- **resolvers.py**: 필드 조회 로직
- **queries.py**: Query 엔드포인트
- **mutations.py**: Mutation 엔드포인트

---

## 🎓 Best Practices

1. **간단한 것은 types.py에**
   - 동기 함수
   - 간단한 계산 (문자열 조합 등)

2. **복잡한 것은 resolvers.py에**
   - 비동기 함수
   - DB 조회
   - 복잡한 비즈니스 로직

3. **DataLoader와 연계**
   - N+1 문제 발생 시 loaders.py 구현
   - resolvers.py에서 활용

4. **권한 검증 일관성**
   - permissions.py에 데코레이터 정의
   - 모든 엔드포인트에 일관되게 적용

---

## 📚 참고

- Strawberry GraphQL: https://strawberry.rocks/
- DataLoader: https://github.com/graphql/dataloader
- GraphQL Best Practices: https://graphql.org/learn/best-practices/
