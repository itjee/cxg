# GraphQL 공통 모듈 - 프로젝트 요약

## 📋 개요

시스템/스키마/엔티티별로 반복되는 GraphQL 패턴(loaders, mutations, queries, permissions, types)을 공통 모듈로 추상화하여 코드 중복을 제거하고 유지보수성을 향상시키는 프로젝트입니다.

## ✅ 완료된 작업

### 1. 공통 모듈 구현 (546줄)

```
apps/backend-api/src/graphql/common/
├── base_loader.py          # DataLoader 베이스 클래스 (80줄)
├── base_queries.py         # Query 헬퍼 함수 (116줄)
├── base_mutations.py       # Mutation 헬퍼 함수 (162줄)
├── base_permissions.py     # Permission 베이스 클래스 (114줄)
├── converters.py           # 타입 변환 유틸리티 (74줄)
├── __init__.py             # 모듈 export
├── README.md               # 상세 사용 가이드 (11.7KB)
├── MIGRATION_GUIDE.md      # 마이그레이션 가이드 (8.2KB)
└── USAGE_EXAMPLE.py        # 사용 예제 (6.9KB)
```

### 2. 검증 도구

```
scripts/
└── verify-graphql-common.sh    # 자동 검증 스크립트
```

## 🎯 주요 기능

### 1. BaseDataLoader - N+1 쿼리 해결

**이전 (88줄):**
```python
class ManagerUserLoader:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def load_many(self, user_ids: list[str]):
        # 35줄의 반복 코드
        ...
```

**이후 (3줄):**
```python
class ManagerUserLoader(BaseDataLoader[UserModel]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, UserModel)
```

### 2. Query 헬퍼 - 조회 로직 단순화

**이전 (45줄):**
```python
async def get_manager_user_by_id(db, user_id):
    stmt = select(UserModel).where(UserModel.id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    if not user:
        return None
    return ManagerUser(...)  # 20+ 필드 매핑
```

**이후 (7줄):**
```python
async def get_manager_user_by_id(db, user_id):
    return await get_by_id(
        db, UserModel, user_id, user_to_graphql
    )
```

### 3. Mutation 헬퍼 - CUD 로직 단순화

**이전 (59줄):**
```python
async def create_manager_user(db, input_data):
    user = UserModel(
        field1=input_data.field1,
        # ... 많은 필드
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return ManagerUser(...)  # 20+ 필드 매핑
```

**이후 (11줄):**
```python
async def create_manager_user(db, input_data):
    return await create_entity(
        db, UserModel, input_data,
        user_to_graphql, prepare_data
    )
```

### 4. Permission 베이스 클래스 - 권한 체크 표준화

**이전 (55줄 - 5개 클래스):**
```python
class CanViewUsers(BasePermission):
    message = "..."
    async def has_permission(self, ...):
        return True
# ... 4개 더
```

**이후 (6줄):**
```python
class CanViewUsers(CanView):
    resource = "users"

class CanManageUsers(CanManage):
    resource = "users"
```

## 📊 현재 상태 분석

### 검증 스크립트 실행 결과

```bash
$ ./scripts/verify-graphql-common.sh

✅ 모든 검증 통과
- 파일 존재: 8/8 ✓
- Python 구문: 6/6 ✓
- Import 테스트: ✓
- 공통 모듈 코드: 546줄
- 기존 엔티티: 23개
- 기존 총 코드: 2,436줄
```

### 엔티티별 현황

#### 구현 완료된 엔티티 (8개)
- ✅ manager/idam/users (369줄)
- ✅ manager/idam/roles (214줄)
- ✅ manager/idam/permissions (354줄)
- ✅ manager/idam/api_keys (415줄)
- ✅ manager/idam/login_logs (338줄)
- ✅ manager/idam/sessions (98줄)
- ✅ tenants/sys/users (431줄)
- ✅ tenants/sys/roles (217줄)

#### 미구현 엔티티 (15개)
- ⏳ manager/idam/role_permissions
- ⏳ manager/idam/user_roles
- ⏳ manager/tenant_mgmt/subscriptions
- ⏳ manager/tenant_mgmt/tenants
- ⏳ tenants/sys/departments
- ⏳ tenants/sys/branches
- ⏳ tenants/sys/menus
- ⏳ tenants/sys/permissions
- ⏳ tenants/crm/contacts
- ⏳ tenants/crm/customers
- ⏳ tenants/crm/leads
- ⏳ tenants/hrm/employees
- ⏳ tenants/hrm/attendance
- 기타...

## 🚀 적용 효과 (예상)

### 파일별 코드 감소율

| 파일 | 이전 | 이후 | 감소율 |
|-----|------|------|--------|
| loaders.py | 88줄 | 10줄 | **89% ↓** |
| queries.py | 97줄 | 35줄 | **64% ↓** |
| mutations.py | 133줄 | 40줄 | **70% ↓** |
| permissions.py | 55줄 | 15줄 | **73% ↓** |
| **엔티티당 합계** | **373줄** | **100줄** | **73% ↓** |

### 전체 시스템 적용 시 (23개 엔티티)

현재 구현된 8개 엔티티 평균: **305줄/엔티티**

```
이전 총 코드: 23 엔티티 × 305줄 = 7,015줄
이후 예상:   23 엔티티 × 100줄 = 2,300줄
─────────────────────────────────────
절감 효과:   4,715줄 (67% 감소)
```

## 📚 문서

### 1. README.md (상세 가이드)
- 각 모듈별 사용법
- 이전 vs 이후 코드 비교
- 전체 사용 예제
- 주의사항 및 확장 가능성

### 2. MIGRATION_GUIDE.md (마이그레이션)
- Phase별 마이그레이션 계획
- 단계별 체크리스트
- 파일럿 프로젝트 (roles)
- 리스크 관리 및 롤백 계획

### 3. USAGE_EXAMPLE.py (실전 예제)
- 완전한 CRUD 구현 예제
- 각 모듈 사용법 데모
- 주석으로 설명

## 🎓 사용법

### Quick Start

1. **문서 읽기**
```bash
cat apps/backend-api/src/graphql/common/README.md
```

2. **검증 실행**
```bash
./scripts/verify-graphql-common.sh
```

3. **예제 확인**
```bash
cat apps/backend-api/src/graphql/common/USAGE_EXAMPLE.py
```

4. **마이그레이션 가이드**
```bash
cat apps/backend-api/src/graphql/common/MIGRATION_GUIDE.md
```

### 새 엔티티 작성 예제

```python
# 1. Loader (3줄)
class UserLoader(BaseDataLoader[UserModel]):
    def __init__(self, db): 
        super().__init__(db, UserModel)

# 2. Converter (15줄)
def user_to_graphql(user): 
    return User(id=..., name=...)

# 3. Query (7줄)
async def get_user(db, id):
    return await get_by_id(db, UserModel, id, user_to_graphql)

# 4. Mutation (11줄)
async def create_user(db, input_data):
    return await create_entity(
        db, UserModel, input_data, user_to_graphql
    )

# 5. Permission (3줄)
class CanViewUsers(CanView):
    resource = "users"
```

**총: 약 40줄** (이전 대비 **90% 감소**)

## 🔄 다음 단계

### Phase 2: 파일럿 마이그레이션 (예상 2시간)
1. ✅ 공통 모듈 구현
2. ⏳ manager/idam/roles 마이그레이션
3. ⏳ 테스트 및 검증
4. ⏳ 팀 리뷰

### Phase 3: 전체 적용 (예상 3일)
1. ⏳ Low Risk 엔티티 5개 (1일)
2. ⏳ Medium Risk 엔티티 3개 (1일)  
3. ⏳ High Risk 엔티티 3개 (1일)

### Phase 4: 안정화 (예상 1일)
1. ⏳ 통합 테스트
2. ⏳ 성능 테스트
3. ⏳ 문서 업데이트

## ✨ 주요 이점

1. **코드 중복 제거**: 73% 코드 감소
2. **유지보수 향상**: 공통 로직 중앙화
3. **일관성 확보**: 표준화된 패턴
4. **타입 안정성**: Generic 활용
5. **학습 곡선 완화**: 명확한 패턴
6. **확장성**: 쉬운 기능 추가

## 🛠️ 기술 스택

- Python 3.12+
- Strawberry GraphQL
- SQLAlchemy 2.0
- AsyncIO
- Generic Types

## 📝 참고사항

### 커스터마이징

특수한 로직이 필요한 경우:
- `prepare_data`: 입력 데이터 전처리
- `before_commit`: 커밋 전 후킹
- `update_fields`: 업데이트 필드 제한
- 커스텀 필터: `**filters` 파라미터

### 성능 최적화

- DataLoader는 요청당 1회 생성 (컨텍스트 관리)
- 배치 로딩으로 N+1 쿼리 해결
- 인덱스 활용 권장

## 🤝 기여

개선 아이디어나 버그는 팀 채널에서 논의해주세요.

## 📞 문의

- 기술 문의: 개발팀 채널
- 문서 개선: PR 환영

---

**작성일**: 2025-11-12  
**버전**: 1.0.0  
**상태**: ✅ 구현 완료, 마이그레이션 준비
