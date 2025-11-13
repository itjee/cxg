# 공통 모듈 마이그레이션 가이드

## 단계별 마이그레이션 체크리스트

### Phase 1: 준비 단계 ✓

- [x] 공통 모듈 생성
  - [x] base_loader.py
  - [x] base_queries.py
  - [x] base_mutations.py
  - [x] base_permissions.py
  - [x] converters.py
- [x] 사용 예제 작성
- [x] README 작성

### Phase 2: 파일럿 마이그레이션 (1개 엔티티)

추천: `manager/idam/roles` (비교적 단순)

#### Step 1: loaders.py 마이그레이션

**이전:**
```python
# apps/backend-api/src/graphql/manager/idam/roles/loaders.py
# 현재 파일이 비어있음 (1줄)
```

**이후:**
```python
from sqlalchemy.ext.asyncio import AsyncSession
from src.graphql.common import BaseDataLoader, BaseFieldLoader
from src.models.manager.idam.role import Role as RoleModel

class ManagerRoleLoader(BaseDataLoader[RoleModel]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, RoleModel)

class ManagerRoleByCodeLoader(BaseFieldLoader[RoleModel]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, RoleModel, "code")
```

**명령어:**
```bash
# 백업
cp apps/backend-api/src/graphql/manager/idam/roles/loaders.py \
   apps/backend-api/src/graphql/manager/idam/roles/loaders.py.bak

# 수정
vim apps/backend-api/src/graphql/manager/idam/roles/loaders.py
```

#### Step 2: queries.py 마이그레이션

**변경 전 (98줄):**
```python
# apps/backend-api/src/graphql/manager/idam/roles/queries.py
async def get_manager_role_by_id(db: AsyncSession, role_id: UUID):
    stmt = select(RoleModel).where(RoleModel.id == role_id)
    result = await db.execute(stmt)
    role = result.scalar_one_or_none()
    
    if not role:
        return None
    
    return ManagerRole(
        id=strawberry.ID(str(role.id)),
        code=role.code,
        name=role.name,
        # ... 나머지 필드들
    )
```

**변경 후 (약 40줄):**
```python
from src.graphql.common import get_by_id, get_list

def role_to_graphql(role: RoleModel) -> ManagerRole:
    """RoleModel을 ManagerRole로 변환"""
    return ManagerRole(
        id=strawberry.ID(str(role.id)),
        code=role.code,
        name=role.name,
        description=role.description,
        category=role.category,
        level=role.level,
        scope=role.scope,
        is_default=role.is_default,
        priority=role.priority,
        status=role.status,
        created_at=role.created_at,
        updated_at=role.updated_at,
    )

async def get_manager_role_by_id(db: AsyncSession, role_id: UUID):
    return await get_by_id(db, RoleModel, role_id, role_to_graphql)

async def get_manager_roles(db: AsyncSession, limit=20, offset=0, 
                           category=None, status=None):
    return await get_list(
        db=db,
        model_class=RoleModel,
        to_graphql=role_to_graphql,
        limit=limit,
        offset=offset,
        order_by=RoleModel.priority,
        category=category,
        status=status
    )

# Query 클래스는 그대로 유지
@strawberry.type
class ManagerRoleQueries:
    @strawberry.field(description="Manager 역할 조회 (ID)")
    async def manager_role(self, info, id: strawberry.ID):
        db = info.context.manager_db_session
        return await get_manager_role_by_id(db, UUID(id))
    
    @strawberry.field(description="Manager 역할 목록")
    async def manager_roles(self, info, limit: int = 20, offset: int = 0,
                           category: str = None, status: str = None):
        db = info.context.manager_db_session
        return await get_manager_roles(db, limit, offset, category, status)
```

#### Step 3: mutations.py 마이그레이션

**변경 전 (118줄):**
```python
async def create_manager_role(db: AsyncSession, input_data):
    role = RoleModel(
        code=input_data.code,
        name=input_data.name,
        # ... 많은 필드
    )
    db.add(role)
    await db.commit()
    await db.refresh(role)
    
    return ManagerRole(
        id=strawberry.ID(str(role.id)),
        # ... 모든 필드 매핑
    )
```

**변경 후 (약 50줄):**
```python
from src.graphql.common import create_entity, update_entity

async def create_manager_role(db: AsyncSession, input_data):
    return await create_entity(
        db=db,
        model_class=RoleModel,
        input_data=input_data,
        to_graphql=role_to_graphql
    )

async def update_manager_role(db: AsyncSession, role_id: UUID, input_data):
    return await update_entity(
        db=db,
        model_class=RoleModel,
        entity_id=role_id,
        input_data=input_data,
        to_graphql=role_to_graphql
    )

# Mutation 클래스는 그대로 유지
@strawberry.type
class ManagerRoleMutations:
    @strawberry.mutation(description="Manager 역할 생성")
    async def create_manager_role(self, info, input: ManagerRoleCreateInput):
        db = info.context.manager_db_session
        return await create_manager_role(db, input)
    
    @strawberry.mutation(description="Manager 역할 수정")
    async def update_manager_role(self, info, id: strawberry.ID, 
                                 input: ManagerRoleUpdateInput):
        db = info.context.manager_db_session
        return await update_manager_role(db, UUID(id), input)
```

#### Step 4: permissions.py 마이그레이션

**변경 전 (각 클래스마다 10-15줄, 총 50-70줄):**
```python
class CanViewManagerRoles(BasePermission):
    message = "Manager 역할 목록을 조회할 권한이 없습니다"
    
    async def has_permission(self, source, info, **kwargs):
        # TODO: 실제 권한 체크
        return True
```

**변경 후 (약 15줄):**
```python
from src.graphql.common import CanView, CanCreate, CanUpdate, CanDelete

class CanViewManagerRoles(CanView):
    resource = "manager_roles"
    message = "Manager 역할 목록을 조회할 권한이 없습니다"

class CanManageManagerRoles(CanCreate):
    resource = "manager_roles"
    message = "Manager 역할을 관리할 권한이 없습니다"

# 또는 동적 생성
from src.graphql.common import create_permission_class

CanViewManagerRoles = create_permission_class("manager_roles", "view")
CanManageManagerRoles = create_permission_class("manager_roles", "manage")
```

#### Step 5: 테스트

```bash
# GraphQL 서버 실행
cd apps/backend-api
python -m uvicorn src.main:app --reload

# GraphQL Playground에서 테스트
# http://localhost:8000/graphql

# Query 테스트
query {
  managerRoles(limit: 10) {
    id
    code
    name
  }
}

# Mutation 테스트
mutation {
  createManagerRole(input: {
    code: "TEST_ROLE"
    name: "테스트 역할"
    category: "SYSTEM"
    level: 1
    scope: "GLOBAL"
  }) {
    id
    code
    name
  }
}
```

### Phase 3: 나머지 엔티티 순차 마이그레이션

#### 우선순위

1. **Low Risk (간단한 CRUD)**
   - [ ] manager/idam/roles ← 파일럿
   - [ ] manager/idam/permissions
   - [ ] tenants/sys/departments
   - [ ] tenants/sys/branches
   - [ ] tenants/sys/menus

2. **Medium Risk (관계가 있는 엔티티)**
   - [ ] manager/idam/users
   - [ ] tenants/sys/users
   - [ ] tenants/sys/roles

3. **High Risk (복잡한 로직)**
   - [ ] manager/idam/sessions
   - [ ] manager/idam/login_logs
   - [ ] auto/workflows
   - [ ] auto/executions

#### 각 엔티티별 체크리스트 템플릿

```markdown
## [엔티티명] 마이그레이션

- [ ] loaders.py 백업
- [ ] loaders.py 마이그레이션
- [ ] queries.py 백업
- [ ] queries.py 마이그레이션
- [ ] mutations.py 백업
- [ ] mutations.py 마이그레이션
- [ ] permissions.py 백업
- [ ] permissions.py 마이그레이션
- [ ] 로컬 테스트
- [ ] PR 생성
- [ ] 코드 리뷰
- [ ] 배포
```

### Phase 4: 검증 및 모니터링

#### 검증 항목

```bash
# 1. 코드 품질
ruff check apps/backend-api/src/graphql/
black --check apps/backend-api/src/graphql/
mypy apps/backend-api/src/graphql/

# 2. 테스트
pytest apps/backend-api/tests/graphql/ -v

# 3. 커버리지
pytest --cov=src/graphql apps/backend-api/tests/graphql/

# 4. 성능 테스트
# N+1 쿼리 확인
# 응답 시간 측정
```

#### 롤백 계획

각 파일의 백업을 유지:
```bash
# 롤백 스크립트
./scripts/rollback-graphql-migration.sh [entity_name]
```

### Phase 5: 문서화 및 교육

- [ ] 팀 공유 세션
- [ ] 내부 위키 업데이트
- [ ] 베스트 프랙티스 문서화
- [ ] FAQ 작성

## 예상 일정

| Phase | 작업 | 예상 시간 | 담당 |
|-------|------|-----------|------|
| Phase 1 | 공통 모듈 생성 | ✓ 완료 | - |
| Phase 2 | 파일럿 (roles) | 2시간 | - |
| Phase 3 | Low Risk 5개 | 1일 | - |
| Phase 3 | Medium Risk 3개 | 1일 | - |
| Phase 3 | High Risk 3개 | 1일 | - |
| Phase 4 | 검증 및 QA | 0.5일 | - |
| Phase 5 | 문서화 | 0.5일 | - |
| **합계** | | **4일** | |

## 성공 지표

- [ ] 코드 라인 70% 이상 감소
- [ ] 모든 기존 테스트 통과
- [ ] 성능 저하 없음
- [ ] 타입 체크 오류 0개
- [ ] 팀원 만족도 80% 이상

## 리스크 관리

| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| 타입 호환성 문제 | 중 | Generic 타입 활용, 점진적 마이그레이션 |
| 성능 저하 | 중 | 벤치마크 테스트, 모니터링 |
| 기능 손실 | 고 | 철저한 테스트, 롤백 계획 |
| 팀원 학습 곡선 | 저 | 문서화, 예제 코드, 교육 세션 |

## 다음 단계

1. Phase 2 시작: `manager/idam/roles` 마이그레이션
2. 검증 및 팀 리뷰
3. Phase 3 계획 수립
