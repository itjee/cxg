# GraphQL 공통 모듈 가이드

## 개요

시스템/스키마/엔티티별로 반복되는 GraphQL 코드 패턴(loaders, mutations, queries, permissions, types)을 공통 모듈로 추상화하여 코드 중복을 줄이고 유지보수성을 향상시킵니다.

## 디렉토리 구조

```
src/graphql/common/
├── __init__.py              # 공통 모듈 export
├── base_loader.py           # DataLoader 베이스 클래스
├── base_queries.py          # Query 헬퍼 함수
├── base_mutations.py        # Mutation 헬퍼 함수
├── base_permissions.py      # Permission 베이스 클래스
├── converters.py            # 타입 변환 유틸리티
├── USAGE_EXAMPLE.py         # 사용 예제
└── README.md               # 이 문서
```

## 주요 기능

### 1. DataLoader (base_loader.py)

N+1 쿼리 문제를 해결하는 공통 DataLoader 클래스

#### BaseDataLoader

ID 기반 배치 로딩

```python
from src.graphql.common import BaseDataLoader
from src.models.manager.idam.user import User as UserModel

class UserLoader(BaseDataLoader[UserModel]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, UserModel)

# 사용
loader = UserLoader(db)
user = await loader.load("user-id")
users = await loader.load_many(["id1", "id2", "id3"])
```

#### BaseFieldLoader

특정 필드 기반 배치 로딩

```python
from src.graphql.common import BaseFieldLoader

class UserByEmailLoader(BaseFieldLoader[UserModel]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, UserModel, "email")

# 사용
loader = UserByEmailLoader(db)
user = await loader.load("user@example.com")
```

**이전 vs 이후 비교:**

```python
# 이전 (88줄)
class UserLoader:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def load_many(self, user_ids: list[str]) -> list[UserModel | None]:
        if not user_ids:
            return []
        uuids = [UUID(uid) for uid in user_ids]
        stmt = select(UserModel).where(UserModel.id.in_(uuids))
        result = await self.db.execute(stmt)
        users = result.scalars().all()
        user_map = {str(user.id): user for user in users}
        return [user_map.get(uid) for uid in user_ids]

    async def load(self, user_id: str) -> UserModel | None:
        result = await self.load_many([user_id])
        return result[0] if result else None

# 이후 (3줄)
class UserLoader(BaseDataLoader[UserModel]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, UserModel)
```

### 2. Query 헬퍼 (base_queries.py)

공통 조회 로직

#### get_by_id

단일 엔티티 조회

```python
from src.graphql.common import get_by_id

async def get_user_by_id(db: AsyncSession, user_id: UUID):
    return await get_by_id(
        db=db,
        model_class=UserModel,
        id_=user_id,
        to_graphql=user_to_graphql,
        is_deleted=False  # 추가 필터
    )
```

#### get_list

목록 조회 (페이징, 필터링, 정렬)

```python
from src.graphql.common import get_list

async def get_users(db: AsyncSession, status: str = None):
    return await get_list(
        db=db,
        model_class=UserModel,
        to_graphql=user_to_graphql,
        limit=20,
        offset=0,
        order_by=UserModel.created_at.desc(),
        status=status,  # 필터
        is_deleted=False
    )
```

#### get_count

개수 조회

```python
from src.graphql.common import get_count

count = await get_count(db, UserModel, is_deleted=False)
```

**이전 vs 이후 비교:**

```python
# 이전 (45줄)
async def get_user_by_id(db: AsyncSession, user_id: UUID):
    stmt = select(UserModel).where(UserModel.id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        return None

    return User(
        id=strawberry.ID(str(user.id)),
        user_type=user.user_type,
        full_name=user.full_name,
        # ... 20+ 필드 매핑
    )

# 이후 (7줄)
async def get_user_by_id(db: AsyncSession, user_id: UUID):
    return await get_by_id(
        db=db,
        model_class=UserModel,
        id_=user_id,
        to_graphql=user_to_graphql
    )
```

### 3. Mutation 헬퍼 (base_mutations.py)

공통 생성/수정/삭제 로직

#### create_entity

엔티티 생성

```python
from src.graphql.common import create_entity

async def create_user(db: AsyncSession, input_data):
    return await create_entity(
        db=db,
        model_class=UserModel,
        input_data=input_data,
        to_graphql=user_to_graphql,
        prepare_data=prepare_user_data,  # 선택적
        before_commit=hash_password_hook  # 선택적
    )
```

#### update_entity

엔티티 수정

```python
from src.graphql.common import update_entity

async def update_user(db: AsyncSession, user_id: UUID, input_data):
    return await update_entity(
        db=db,
        model_class=UserModel,
        entity_id=user_id,
        input_data=input_data,
        to_graphql=user_to_graphql,
        is_deleted=False  # 추가 필터
    )
```

#### delete_entity

엔티티 삭제

```python
from src.graphql.common import delete_entity

# 소프트 삭제
success = await delete_entity(
    db, UserModel, user_id, soft_delete=True
)

# 하드 삭제
success = await delete_entity(
    db, UserModel, user_id, soft_delete=False
)
```

**이전 vs 이후 비교:**

```python
# 이전 (59줄)
async def create_user(db: AsyncSession, input_data):
    password_hash = hash_password(input_data.password)

    user = UserModel(
        user_type=input_data.user_type,
        full_name=input_data.full_name,
        email=input_data.email,
        username=input_data.username,
        password=password_hash,
        # ... 더 많은 필드
    )

    db.add(user)
    await db.commit()
    await db.refresh(user)

    return User(
        id=strawberry.ID(str(user.id)),
        # ... 20+ 필드 매핑
    )

# 이후 (11줄)
def prepare_data(input_data):
    return {**input_data.__dict__,
            "password": hash_password(input_data.password)}

async def create_user(db: AsyncSession, input_data):
    return await create_entity(
        db=db,
        model_class=UserModel,
        input_data=input_data,
        to_graphql=user_to_graphql,
        prepare_data=prepare_data
    )
```

### 4. Permission 베이스 클래스 (base_permissions.py)

공통 권한 체크 로직

#### 기본 Permission 클래스

```python
from src.graphql.common import (
    CanView, CanCreate, CanUpdate, CanDelete, CanManage
)

# 베이스 클래스 상속
class CanViewUsers(CanView):
    resource = "users"
    message = "사용자를 조회할 권한이 없습니다"

class CanUsers(CanManage):
    resource = "users"
```

#### 동적 Permission 생성

```python
from src.graphql.common import create_permission_class

CanViewUsers = create_permission_class(
    resource="users",
    action="view",
    message="사용자를 조회할 권한이 없습니다"
)
```

#### 기타 Permission

```python
from src.graphql.common import IsAuthenticated, IsMaster

@strawberry.type
class Query:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def users(self, info) -> list[User]:
        ...

    @strawberry.field(permission_classes=[IsMaster])
    async def admin_users(self, info) -> list[User]:
        ...
```

**이전 vs 이후 비교:**

```python
# 이전 (각 엔티티마다 55줄 반복)
class CanViewUsers(BasePermission):
    message = "Manager 사용자 목록을 조회할 권한이 없습니다"

    async def has_permission(self, source, info, **kwargs):
        # TODO: 실제 권한 체크
        return True

class CanManageUsers(BasePermission):
    message = "Manager 사용자를 관리할 권한이 없습니다"

    async def has_permission(self, source, info, **kwargs):
        # TODO: 실제 권한 체크
        return True
# ... 3개 더

# 이후 (3줄)
class CanViewUsers(CanView):
    resource = "users"

class CanManageUsers(CanManage):
    resource = "users"
```

### 5. Converter 유틸리티 (converters.py)

타입 변환 헬퍼

```python
from src.graphql.common import (
    model_to_graphql_converter,
    safe_uuid_to_id,
    safe_id_to_uuid
)

# 자동 변환기 생성
to_graphql_user = model_to_graphql_converter(User)
user_graphql = to_graphql_user(user_model)

# UUID 변환
user_id = safe_id_to_uuid(strawberry_id)
id_field = safe_uuid_to_id(uuid_value)
```

## 전체 사용 예제

완전한 CRUD 구현 (이전 vs 이후)

### 이전 방식 (약 300+ 줄)

```python
# loaders.py (88줄)
class UserLoader:
    def __init__(self, db: AsyncSession):
        self.db = db
    async def load_many(self, user_ids: list[str]):
        # 35줄의 구현
    async def load(self, user_id: str):
        # 3줄의 구현

class UserByUsernameLoader:
    # 25줄 반복

class UserByEmailLoader:
    # 25줄 반복

# queries.py (97줄)
async def get_user_by_id(db, user_id):
    # 45줄 구현

async def get_users(db, limit, offset):
    # 35줄 구현

@strawberry.type
class UserQueries:
    # 17줄 래퍼

# mutations.py (133줄)
async def create_user(db, input_data):
    # 59줄 구현

async def update_user(db, user_id, input_data):
    # 54줄 구현

@strawberry.type
class UserMutations:
    # 20줄 래퍼

# permissions.py (55줄)
class CanViewUsers(BasePermission):
    # 10줄
class CanManageUsers(BasePermission):
    # 10줄
# ... 3개 더
```

### 이후 방식 (약 100 줄, **67% 감소**)

```python
# loaders.py (10줄)
from src.graphql.common import BaseDataLoader, BaseFieldLoader

class UserLoader(BaseDataLoader[UserModel]):
    def __init__(self, db): super().__init__(db, UserModel)

class UserByUsernameLoader(BaseFieldLoader[UserModel]):
    def __init__(self, db): super().__init__(db, UserModel, "username")

class UserByEmailLoader(BaseFieldLoader[UserModel]):
    def __init__(self, db): super().__init__(db, UserModel, "email")

# queries.py (35줄)
from src.graphql.common import get_by_id, get_list

def user_to_graphql(user):
    # 15줄 매핑

async def get_user_by_id(db, user_id):
    return await get_by_id(db, UserModel, user_id, user_to_graphql)

async def get_users(db, limit, offset):
    return await get_list(db, UserModel, user_to_graphql, limit, offset)

@strawberry.type
class UserQueries:
    # 10줄 래퍼

# mutations.py (40줄)
from src.graphql.common import create_entity, update_entity

def prepare_data(input_data):
    # 5줄

async def create_user(db, input_data):
    return await create_entity(db, UserModel, input_data,
                              user_to_graphql, prepare_data)

async def update_user(db, user_id, input_data):
    return await update_entity(db, UserModel, user_id,
                              input_data, user_to_graphql)

@strawberry.type
class UserMutations:
    # 15줄 래퍼

# permissions.py (15줄)
from src.graphql.common import CanView, CanManage

class CanViewUsers(CanView):
    resource = "users"

class CanManageUsers(CanManage):
    resource = "users"
```

## 코드 감소 효과

### 파일별 비교

| 파일           | 이전      | 이후      | 감소율    |
| -------------- | --------- | --------- | --------- |
| loaders.py     | 88줄      | 10줄      | 89% ↓     |
| queries.py     | 97줄      | 35줄      | 64% ↓     |
| mutations.py   | 133줄     | 40줄      | 70% ↓     |
| permissions.py | 55줄      | 15줄      | 73% ↓     |
| **합계**       | **373줄** | **100줄** | **73% ↓** |

### 전체 시스템 적용 시

현재 시스템에는 약 20개 이상의 엔티티가 있습니다:

- Manager: users, roles, permissions, sessions, login_logs, api_keys
- Tenants: users, roles, permissions, menus, departments, branches
- 기타: workflows, tasks, executions, resources, audit_logs, compliances, policies

**예상 효과:**

- 이전: 20 엔티티 × 373줄 = **7,460줄**
- 이후: 20 엔티티 × 100줄 = **2,000줄**
- **절감: 5,460줄 (73% 감소)**

## 적용 가이드

### 1단계: 기존 코드 확인

```bash
# 현재 엔티티 확인
find ./apps/backend-api/src/graphql -type d -name "users" -o -name "roles"
```

### 2단계: 점진적 마이그레이션

한 엔티티씩 마이그레이션하면서 테스트:

1. loaders 먼저 변경
2. queries 변경
3. mutations 변경
4. permissions 변경
5. 테스트 실행

### 3단계: 검증

```bash
# 테스트 실행
pytest apps/backend-api/tests/graphql/

# 타입 체크
mypy apps/backend-api/src/graphql/
```

## 주의사항

1. **타입 안정성**: Generic 타입을 활용하여 타입 안정성 유지
2. **커스터마이징**: 특수한 로직이 필요한 경우 `prepare_data`, `before_commit` 훅 사용
3. **성능**: DataLoader는 요청당 한 번만 생성되어야 함 (컨텍스트에서 관리)
4. **권한**: 실제 권한 체크 로직은 `has_permission` 메서드를 오버라이드하여 구현

## 확장 가능성

향후 추가 가능한 기능:

- [ ] Relay 스타일 페이지네이션 지원
- [ ] 필터링 DSL
- [ ] 정렬 헬퍼
- [ ] 검색 헬퍼
- [ ] 감사 로그 자동화
- [ ] 캐싱 통합

## 문의

질문이나 개선 제안은 팀 채널에서 논의해주세요.
