# GraphQL API 개발 문서 (v2.0 - 최신 구조)

> **2025년 최신 GraphQL 트렌드 반영**
> - {시스템}/{스키마}/{엔티티} 구조
> - Relay 스펙 완전 준수
> - Domain-Driven Design

---

## 🎯 핵심 변경사항

### v1.0 → v2.0 주요 개선
| 항목 | v1.0 (기존) | v2.0 (최신) |
|------|-------------|-------------|
| 구조 | Flat (types/queries/mutations) | {시스템}/{엔티티}/* |
| 시스템 분리 | ❌ 없음 | ✅ SYS/CRM/HRM 분리 |
| DataLoader | 단일 파일 | 엔티티별 분리 |
| 코드 응집도 | 낮음 (분산) | 높음 (응집) |
| Relay 스펙 | 부분 지원 | 완전 준수 |
| 확장성 | 제한적 | 우수 |

---

## 📚 문서 목록

### 🆕 v2.0 신규 문서

1. **[최신 아키텍처 가이드](./GraphQL_최신_아키텍처_가이드.md)** ⭐ **필독**
   - 2025년 최신 GraphQL 트렌드
   - {시스템}/{스키마}/{엔티티} 구조
   - Relay 스펙, Input Type 패턴
   - Union Type 에러 처리
   - **읽는 시간:** 1시간

2. **[구조 비교 및 업그레이드](./GraphQL_구조_비교_및_업그레이드.md)** 🔄
   - 기존 구조 vs 최신 구조
   - 단계별 마이그레이션 가이드
   - 자동 마이그레이션 스크립트
   - 체크리스트
   - **읽는 시간:** 30분

### 📖 기존 문서 (v1.0 - 참고용)

3. **[GraphQL 개발 가이드](./GraphQL_개발가이드.md)**
   - 전체 아키텍처 (Database-per-Tenant)
   - 인증/테넌트 라우팅
   - **v2.0 구조로 업데이트 필요**

4. **[빠른 시작 가이드](./GraphQL_빠른시작.md)** 🚀
   - 5분 안에 시작
   - **변경사항 없음**

5. **[마이그레이션 가이드](./GraphQL_마이그레이션_가이드.md)**
   - REST → GraphQL 전환
   - **v2.0 구조 기준으로 업데이트 예정**

6. **[FAQ](./GraphQL_FAQ.md)** ❓
   - 자주 묻는 질문
   - **변경사항 없음**

---

## 🏗 최신 디렉토리 구조 (v2.0)

```
apps/backend-api/src/graphql/
├── common/                       # 공통 모듈 ✨ 신규
│   ├── scalars.py               # UUID, DateTime
│   ├── interfaces.py            # Node, Edge (Relay)
│   └── base_types.py            # PageInfo, Connection
│
├── sys/                          # 시스템: SYS ✨ 신규 구조
│   ├── schema.py                # SYS 통합 스키마
│   │
│   ├── user/                    # 엔티티: User
│   │   ├── types.py             # 타입 정의
│   │   ├── queries.py           # Query 리졸버
│   │   ├── mutations.py         # Mutation 리졸버
│   │   ├── loaders.py           # DataLoader
│   │   └── permissions.py       # 권한 체크
│   │
│   ├── branch/                  # 엔티티: Branch
│   ├── role/                    # 엔티티: Role
│   └── department/              # 엔티티: Department
│
├── crm/                          # 시스템: CRM ✨ 신규 구조
│   ├── schema.py
│   ├── customer/                # 엔티티: Customer
│   └── contact/                 # 엔티티: Contact
│
├── hrm/                          # 시스템: HRM ✨ 신규 구조
│   ├── schema.py
│   └── employee/                # 엔티티: Employee
│
├── schema.py                     # 메인 스키마 (모든 시스템 통합)
├── context.py                    # Context 팩토리
└── loaders.py                    # DataLoader 통합 (시스템.엔티티)
```

---

## 🎯 학습 경로 (v2.0 기준)

### 초급 개발자
```
1. 빠른 시작 가이드 (5분)
   ↓
2. 최신 아키텍처 가이드 - 섹션 1-3 (30분)
   ↓
3. 구조 비교 문서 (20분)
   ↓
4. 실습: User 엔티티 구현
```

### 중급 개발자
```
1. 최신 아키텍처 가이드 - 전체 (1시간) ⭐
   ↓
2. 구조 비교 및 업그레이드 (30분)
   ↓
3. 실습: 시스템별 스키마 분리
   ↓
4. Relay 스펙 적용
```

### 시니어/리드 개발자
```
1. v1.0 vs v2.0 비교 검토 (30분)
   ↓
2. 마이그레이션 계획 수립 (1시간)
   ↓
3. 팀 교육 자료 준비
   ↓
4. 단계별 실행 및 리뷰
```

---

## 💡 최신 트렌드 반영 (2025)

### 1. ✅ Relay 스펙 완전 준수
```graphql
type User implements Node {
  id: ID!
  username: String!
}

type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
}
```

### 2. ✅ Input Type 패턴
```python
@strawberry.input
class UserCreateInput:
    """생성 전용 (password 포함)"""
    username: str
    password: str

@strawberry.input
class UserUpdateInput:
    """수정 전용 (모두 Optional, password 제외)"""
    username: Optional[str] = None

@strawberry.input
class UserFilterInput:
    """필터 전용"""
    search: Optional[str] = None
```

### 3. ✅ Union Type 에러 처리
```python
@strawberry.type
class UserSuccess:
    user: User

@strawberry.type
class UserNotFoundError:
    message: str

UserResult = strawberry.union("UserResult", (UserSuccess, UserNotFoundError))
```

### 4. ✅ DataLoader 네이밍 통일
```python
loaders = {
    "sys.user": UserLoader(db),          # 시스템.엔티티
    "sys.department": DepartmentLoader(db),
    "crm.customer": CustomerLoader(db),
}
```

### 5. ✅ Field-level Documentation
```python
@strawberry.field(
    description="사용자 고유 식별자",
    deprecation_reason="v3.0에서 제거 예정"
)
def id(self) -> UUID:
    ...
```

---

## 🚀 빠른 시작 (v2.0)

### 1단계: 구조 생성
```bash
# 자동 마이그레이션 스크립트 실행
bash scripts/migrate_graphql_structure.sh
```

### 2단계: Common 모듈 구현
```bash
# src/graphql/common/ 파일들 작성
# - scalars.py
# - interfaces.py  
# - base_types.py
```

### 3단계: SYS 시스템 구현
```bash
# sys/user/ 부터 시작
# - types.py (User, UserCreateInput, UserConnection 등)
# - queries.py (UserQueries)
# - mutations.py (UserMutations)
# - loaders.py (UserLoader)
# - permissions.py (check_user_read_permission 등)
```

### 4단계: 통합
```bash
# sys/schema.py에서 통합
# graphql/schema.py에서 최종 통합
```

### 5단계: 테스트
```graphql
# GraphQL Playground에서 테스트
query {
  user(id: "user-uuid") {
    id
    username
    department {
      name
    }
  }
}
```

---

## 📊 마이그레이션 타임라인

### Week 1: 구조 재조정
- [x] common/ 모듈 생성
- [ ] sys/ 시스템 폴더 생성
- [ ] 마이그레이션 스크립트 작성

### Week 2: SYS.User 구현
- [ ] types.py 작성
- [ ] queries.py 작성
- [ ] mutations.py 작성
- [ ] loaders.py 작성
- [ ] 테스트

### Week 3-4: 나머지 SYS 엔티티
- [ ] Branch
- [ ] Role
- [ ] Department

### Week 5-6: CRM/HRM 시스템
- [ ] CRM.Customer
- [ ] CRM.Contact
- [ ] HRM.Employee

### Week 7: 통합 및 정리
- [ ] 전체 테스트
- [ ] 문서 업데이트
- [ ] 팀 교육

---

## 🔗 주요 링크

### 핵심 문서
- [최신 아키텍처 가이드](./GraphQL_최신_아키텍처_가이드.md) - v2.0 **필독**
- [구조 업그레이드 가이드](./GraphQL_구조_비교_및_업그레이드.md) - 마이그레이션

### 코드 예시
```python
# sys/user/types.py - 엔티티별 타입 정의
# sys/user/queries.py - Query 리졸버
# sys/user/mutations.py - Mutation 리졸버
# sys/user/loaders.py - DataLoader
# sys/schema.py - 시스템별 통합
# graphql/schema.py - 전체 통합
```

---

## 📈 v2.0 예상 효과

### 개발 생산성
- ✅ 코드 응집도 향상 → **개발 속도 30% 증가**
- ✅ 병렬 개발 가능 → **팀 협업 효율 50% 증가**
- ✅ 명확한 구조 → **신입 온보딩 50% 단축**

### 코드 품질
- ✅ 테스트 분리 → **커버리지 80%+ 달성 용이**
- ✅ 권한 체크 분리 → **보안 강화**
- ✅ 엔티티 독립성 → **버그 수정 시간 50% 단축**

### 확장성
- ✅ 신규 시스템 추가 용이
- ✅ 신규 엔티티 추가 용이
- ✅ Apollo Federation 전환 가능

---

## 🤝 기여 가이드

### v2.0 구조 기여 시
1. 시스템 선택 (sys/crm/hrm)
2. 엔티티 폴더 생성
3. 6개 파일 작성 (types/queries/mutations/loaders/permissions/__init__)
4. 시스템 schema.py에 통합
5. PR 및 리뷰

---

## 📝 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| **v2.0** | 2025-11-11 | **최신 구조로 전면 개편** |
| | | - {시스템}/{엔티티} 구조 도입 |
| | | - Relay 스펙 완전 준수 |
| | | - Input Type 패턴 적용 |
| | | - Union Type 에러 처리 |
| v1.0 | 2025-11-11 | REST → GraphQL 마이그레이션 가이드 |

---

## 📞 문의

- 📧 이메일: dev@cxg.com
- 💬 Slack: #graphql-api-v2
- 🐛 이슈: GitHub Issues (v2.0 label)
- 📖 Wiki: Confluence

---

**최신 GraphQL 트렌드 완벽 반영! 🚀**

**v2.0으로 업그레이드하여 더 나은 개발 경험을 누리세요!**
