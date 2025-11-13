# 🎯 하이브리드 GraphQL 아키텍처 가이드

## 📋 개요

코드 생성(Code Generation) + 추상화 레이어(Abstract Layer)를 결합한 하이브리드 방식으로 GraphQL API를 구현합니다.

### 핵심 원칙

1. **단순 CRUD** → 스키마 정의 후 자동 생성
2. **복잡한 로직** → 커스텀 코드 작성
3. **일관된 표준** → 팀 전체가 동일한 패턴 사용
4. **점진적 적용** → 기존 코드 유지하며 새 방식 도입

---

## 🏗️ 디렉토리 구조

```
apps/backend-api/src/
├── schemas/                    # ✨ 스키마 정의 (Source of Truth)
│   ├── manager/
│   │   └── idam/
│   │       ├── user.schema.yaml
│   │       ├── role.schema.yaml
│   │       └── permission.schema.yaml
│   └── tenants/
│       └── sys/
│           ├── user.schema.yaml
│           └── role.schema.yaml
│
├── graphql/
│   ├── common/                 # 공통 모듈 (현재)
│   │   ├── base_loader.py
│   │   ├── base_queries.py
│   │   ├── base_mutations.py
│   │   └── generators/         # ✨ 코드 생성기
│   │       ├── schema_loader.py
│   │       ├── type_generator.py
│   │       └── query_generator.py
│   │
│   ├── generated/              # ✨ 자동 생성 코드
│   │   └── manager/
│   │       └── idam/
│   │           ├── user/
│   │           │   ├── types.py
│   │           │   ├── queries.py
│   │           │   └── mutations.py
│   │           └── role/
│   │
│   ├── custom/                 # ✨ 커스텀 로직
│   │   └── manager/
│   │       └── idam/
│   │           └── users/
│   │               ├── complex_queries.py
│   │               └── business_logic.py
│   │
│   └── manager/                # 기존 코드 (점진적 마이그레이션)
│       └── idam/
│
└── scripts/
    └── codegen.py              # ✨ 코드 생성 스크립트
```

---

## 📝 스키마 정의 방법

### 1. 단순 CRUD 엔티티 (Role 예시)

`schemas/manager/idam/role.schema.yaml`:

```yaml
entity:
  name: Role
  database: manager
  schema: idam
  model_class: src.models.manager.idam.role.Role
  
  graphql:
    type_name: ManagerRole
    description: "Manager 역할"
    
  fields:
    - name: id
      type: uuid
      graphql_type: ID!
      
    - name: code
      type: string
      graphql_type: String!
      
    - name: name
      type: string
      graphql_type: String!
      
    - name: status
      type: string
      graphql_type: String!
      default: "ACTIVE"

  operations:
    queries:
      - name: get_by_id
        enabled: true
        
      - name: list
        enabled: true
        filters: [status]
        
    mutations:
      - name: create
        enabled: true
        
      - name: update
        enabled: true
        
  permissions:
    view: CanViewManagerRoles
    manage: CanManageManagerRoles
    
  custom:
    enabled: false  # 단순 CRUD이므로 불필요
```

### 2. 복잡한 엔티티 (User 예시)

`schemas/manager/idam/user.schema.yaml`:

```yaml
entity:
  name: User
  # ... 기본 설정 ...
  
  operations:
    queries:
      - name: get_by_id
        enabled: true
        
      - name: list
        enabled: true
        
      # 복잡한 검색은 custom에서 구현
      
    mutations:
      - name: create
        enabled: true
        hooks:
          before_commit: hash_password  # 자동 호출
          
      - name: update
        enabled: true
        
  custom:
    enabled: true  # 복잡한 로직은 여기서
    path: src.graphql.custom.manager.idam.users
```

---

## 🚀 개발 워크플로우

### Phase 1: 스키마 정의

```bash
# 1. 스키마 파일 생성
vim schemas/manager/idam/role.schema.yaml

# 2. 필드, 작업, 권한 정의
```

### Phase 2: 코드 자동 생성

```bash
# 전체 생성
python scripts/codegen.py

# 특정 스키마만
python scripts/codegen.py --schema Role

# 결과:
# ✓ generated/manager/idam/role/types.py
# ✓ generated/manager/idam/role/queries.py
# ✓ generated/manager/idam/role/mutations.py
```

### Phase 3: 커스텀 로직 추가 (필요시)

```python
# custom/manager/idam/users/complex_queries.py

from sqlalchemy import select
from src.models.manager.idam.user import User

async def search_users_by_criteria(
    db, 
    query: str,
    filters: dict
):
    """복잡한 검색 로직"""
    stmt = select(User)
    
    # 여러 필드에서 검색
    if query:
        stmt = stmt.where(
            or_(
                User.full_name.ilike(f"%{query}%"),
                User.email.ilike(f"%{query}%"),
                User.username.ilike(f"%{query}%")
            )
        )
    
    # 복잡한 필터링
    # ...
    
    return stmt
```

### Phase 4: 스키마에 통합

```python
# generated 코드는 자동 생성
# custom 코드는 명시적으로 import

from src.graphql.generated.manager.idam.user import (
    ManagerUserQueries,  # 기본 CRUD
    ManagerUserMutations
)
from src.graphql.custom.manager.idam.users import (
    search_users_by_criteria  # 복잡한 로직
)

# 둘다 사용 가능
```

---

## 📊 엔티티 분류 기준

### ⚡ 자동 생성 (Generated)

다음 조건을 **모두** 만족하면 자동 생성:

- [x] 단순 CRUD 작업만 필요
- [x] 복잡한 비즈니스 로직 없음
- [x] 표준 필터링/정렬로 충분
- [x] 다른 엔티티와 복잡한 관계 없음

**예시**: Role, Permission, Department, Branch, Menu

### 🛠️ 하이브리드 (Generated + Custom)

다음 중 **하나라도** 해당하면 하이브리드:

- [ ] 복잡한 검색 로직
- [ ] 비즈니스 규칙 검증
- [ ] 여러 테이블 조인
- [ ] 트랜잭션 처리
- [ ] 이벤트 발행

**예시**: User, Subscription, Workflow, Execution

### 🎨 완전 커스텀 (Custom)

다음 경우 완전 커스텀 구현:

- [ ] 매우 복잡한 도메인 로직
- [ ] 레거시 시스템 연동
- [ ] 특수한 최적화 필요
- [ ] 외부 API 호출

**예시**: Analytics, Reporting, Integration

---

## 🎯 현재 엔티티 분류

### Manager Schema

| 엔티티 | 분류 | 이유 |
|--------|------|------|
| User | 하이브리드 | 비밀번호 해싱, 복잡한 검색 |
| Role | 자동 생성 | 단순 CRUD |
| Permission | 자동 생성 | 단순 CRUD |
| Session | 하이브리드 | 세션 관리 로직 |
| LoginLog | 자동 생성 | 읽기 전용 로그 |
| ApiKey | 하이브리드 | 키 생성 로직 |

### Tenants Schema

| 엔티티 | 분류 | 이유 |
|--------|------|------|
| User | 하이브리드 | 복잡한 권한 체크 |
| Role | 자동 생성 | 단순 CRUD |
| Permission | 자동 생성 | 단순 CRUD |
| Department | 자동 생성 | 단순 계층 구조 |
| Branch | 자동 생성 | 단순 CRUD |
| Menu | 자동 생성 | 단순 계층 구조 |

---

## 💡 개발 가이드라인

### ✅ DO

1. **스키마 파일을 Single Source of Truth로**
   - 모든 변경은 스키마에서 시작
   - 코드 생성 후 확인

2. **자동 생성 코드는 절대 수정 금지**
   - 주석에 경고 표시
   - 스키마 수정 후 재생성

3. **커스텀 로직은 별도 디렉토리에**
   - generated/와 custom/ 명확히 분리
   - import 경로로 구분

4. **일관된 네이밍 규칙**
   - 스키마: `entity_name.schema.yaml`
   - 타입: `{Database}{Entity}`
   - 함수: `{action}_{entity}_...`

### ❌ DON'T

1. **자동 생성 코드 직접 수정**
   → 재생성 시 덮어씌워짐

2. **generated/에 커스텀 로직 추가**
   → custom/ 디렉토리 사용

3. **스키마 없이 직접 코드 작성**
   → 일관성 깨짐

4. **복잡한 로직을 억지로 자동화**
   → custom으로 명시적으로 작성

---

## 🔄 마이그레이션 전략

### 기존 코드 → 새 방식

```
1. 새 엔티티는 무조건 새 방식 적용
2. 기존 엔티티는 점진적 마이그레이션:
   
   Week 1-2: 스키마 정의 작성 (5개)
   Week 3-4: 코드 생성 및 검증 (5개)
   Week 5-6: 나머지 마이그레이션 (13개)
   Week 7-8: 통합 테스트 및 정리
```

### 우선순위

1. **Low Risk** (단순 CRUD): roles, permissions, departments
2. **Medium Risk** (일부 로직): menus, branches
3. **High Risk** (복잡한 로직): users, sessions

---

## 📚 참고 자료

- `schemas/manager/idam/user.schema.yaml` - 복잡한 엔티티 예시
- `schemas/manager/idam/role.schema.yaml` - 단순 엔티티 예시
- `scripts/codegen.py` - 코드 생성 스크립트
- `graphql/common/generators/` - 생성기 구현

---

## 🎓 다음 단계

1. ✅ 스키마 정의 완료
2. ✅ 코드 생성기 구현
3. ⏳ 2개 엔티티로 파일럿 (Role, User)
4. ⏳ 팀 교육 및 문서화
5. ⏳ 전체 마이그레이션 계획

---

**작성일**: 2024-11-12  
**버전**: 1.0.0  
**상태**: ✅ 설계 완료, 구현 준비
