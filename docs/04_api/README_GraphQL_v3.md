# GraphQL API 개발 문서 (v3.0 - 3단계 구조)

> **{시스템명}/{스키마명}/{엔티티명}**
>
> - Manager / Tenants 시스템 완전 분리
> - IDAM, SYS, CRM 등 스키마 명확 구분
> - 2025년 최신 GraphQL 트렌드 완전 반영

---

## 🎯 v3.0 핵심 변경사항

### 3단계 구조 도입

```
{시스템명}/{스키마명}/{엔티티명}

예시:
- manager/idam/users       (Manager 시스템, IDAM 스키마, Users 엔티티)
- tenants/sys/users        (Tenants 시스템, SYS 스키마, Users 엔티티)
- tenants/crm/customers    (Tenants 시스템, CRM 스키마, Customers 엔티티)
```

### 버전별 비교

| 항목        | v1.0/v2.0             | v3.0 ✅                          |
| ----------- | --------------------- | -------------------------------- |
| 구조        | 2단계 (시스템/엔티티) | **3단계** (시스템/스키마/엔티티) |
| 예시        | `sys/users`           | `tenants/sys/users`              |
| 시스템 분리 | 불명확                | **Manager/Tenants 명확 분리**    |
| 스키마 분리 | ❌ 없음               | **IDAM/SYS/CRM 등 명확**         |
| DataLoader  | `sys.user`            | `tenants.sys.user`               |
| 충돌 가능성 | 높음                  | **제로** ✅                      |

---

## 📚 문서 목록

### 🆕 v3.0 핵심 문서 (최신)

1. **[v3.0 최신 아키텍처 가이드](./GraphQL_최신_아키텍처_가이드_v3.md)** ⭐ **필독**
   - 3단계 구조 완전 설명
   - Manager/Tenants 시스템 분리
   - IDAM/SYS/CRM 스키마 구분
   - 전체 디렉토리 구조
   - 구현 예시 (Manager/Tenants)
   - 마이그레이션 스크립트
   - **읽는 시간:** 1.5시간

### 📖 이전 버전 문서 (참고)

2. **[v2.0 아키텍처 가이드](./GraphQL_최신_아키텍처_가이드.md)**

   - 2단계 구조 (시스템/엔티티)
   - v3.0 마이그레이션 전 참고

3. **[구조 비교 및 업그레이드](./GraphQL_구조_비교_및_업그레이드.md)**

   - v1.0 → v2.0 비교
   - **v3.0 버전으로 업데이트 예정**

4. **[빠른 시작 가이드](./GraphQL_빠른시작.md)** 🚀

   - 5분 안에 시작
   - 기본 쿼리 실습

5. **[FAQ](./GraphQL_FAQ.md)** ❓
   - 자주 묻는 질문

---

## 🏗 v3.0 디렉토리 구조

```
src/graphql/
│
├── common/                      # 공통 모듈
│   ├── scalars.py
│   ├── interfaces.py
│   └── base_types.py
│
├── manager/                     # 🔷 시스템: Manager
│   ├── schema.py
│   │
│   ├── idam/                    # 📂 스키마: IDAM
│   │   ├── schema.py
│   │   ├── users/              # 📄 엔티티
│   │   ├── roles/
│   │   └── permissions/
│   │
│   └── tenant_mgmt/             # 📂 스키마: Tenant Management
│       ├── schema.py
│       ├── tenants/
│       └── subscriptions/
│
├── tenants/                     # 🔶 시스템: Tenants
│   ├── schema.py
│   │
│   ├── sys/                     # 📂 스키마: SYS
│   │   ├── schema.py
│   │   ├── users/
│   │   ├── branches/
│   │   ├── departments/
│   │   └── roles/
│   │
│   ├── crm/                     # 📂 스키마: CRM
│   │   ├── schema.py
│   │   ├── customers/
│   │   └── contacts/
│   │
│   ├── hrm/                     # 📂 스키마: HRM
│   │   ├── schema.py
│   │   └── employees/
│   │
│   └── scm/                     # 📂 스키마: SCM
│       ├── schema.py
│       └── products/
│
├── context.py                   # Context (멀티 DB)
├── loaders.py                   # DataLoader (3단계)
└── schema.py                    # 메인 통합
```

---

## 🎯 학습 경로

### 초급 개발자

```
1. 3단계 구조 개념 이해 (30분)
   ↓
2. v3.0 가이드 - 섹션 1-3 (1시간)
   ↓
3. manager/idam/users 예시 분석 (1시간)
   ↓
4. 실습: 엔티티 하나 구현
```

### 중급 개발자

```
1. v3.0 가이드 전체 (1.5시간) ⭐
   ↓
2. 스키마 통합 방법 학습 (1시간)
   ↓
3. 실습: 스키마 하나 완성
   ↓
4. DataLoader 3단계 네이밍 적용
```

### 시니어/리드

```
1. v2.0 → v3.0 마이그레이션 계획 (2시간)
   ↓
2. Context 멀티 DB 설계 검토
   ↓
3. 팀 교육 자료 준비
   ↓
4. 단계별 실행 및 모니터링
```

---

## 💡 3단계 구조 핵심 개념

### 1. 시스템 분리

```python
manager/     # Manager 앱 전용 (관리자 기능)
tenants/     # Tenant 앱 전용 (테넌트별 기능)
```

### 2. 스키마 분리

```python
manager/idam/          # Identity & Access Management
manager/tnnt/   # Tenant Management

tenants/sys/           # 시스템 관리
tenants/crm/           # 고객 관리
tenants/hrm/           # 인사 관리
tenants/scm/           # 공급망 관리
```

### 3. 엔티티 분리

```python
manager/idam/users/         # Manager 사용자
manager/idam/roles/         # Manager 역할

tenants/sys/users/          # Tenant 사용자
tenants/sys/branches/       # Tenant 지점
tenants/crm/customers/      # Tenant 고객
```

### 4. DataLoader 네이밍

```python
loaders = {
    "manager.idam.user": UserLoader(...),
    "manager.idam.role": RoleLoader(...),

    "tenants.sys.user": UserLoader(...),
    "tenants.sys.branch": BranchLoader(...),
    "tenants.crm.customer": CustomerLoader(...),
}
```

---

## 🚀 빠른 시작 (v3.0)

### 1. 구조 생성

```bash
bash scripts/migrate_to_3tier_structure.sh
```

### 2. Common 모듈 구현

```bash
# src/graphql/common/
- scalars.py
- interfaces.py
- base_types.py
```

### 3. Manager IDAM Users 구현

```bash
# manager/idam/users/
- types.py      (User, UserCreateInput 등)
- queries.py    (UserQueries)
- mutations.py  (UserMutations)
- loaders.py    (UserLoader)
- permissions.py
```

### 4. Tenants SYS Users 구현

```bash
# tenants/sys/users/
- types.py      (User, UserCreateInput 등)
- queries.py    (UserQueries)
- mutations.py  (UserMutations)
- loaders.py    (UserLoader)
- permissions.py
```

### 5. 스키마 통합

```bash
# 각 레벨별 schema.py 구현
manager/idam/schema.py        → ManagerIdamQuery/Mutation
manager/schema.py             → ManagerQuery/Mutation
tenants/sys/schema.py         → TenantsSysQuery/Mutation
tenants/schema.py             → TenantsQuery/Mutation
graphql/schema.py             → Query/Mutation (최종)
```

---

## 📊 마이그레이션 타임라인

### Week 1: 구조 생성 및 Common

- [ ] 3단계 구조 폴더 생성
- [ ] Common 모듈 구현

### Week 2: Manager IDAM

- [ ] users 엔티티 구현
- [ ] roles 엔티티 구현
- [ ] permissions 엔티티 구현
- [ ] IDAM 스키마 통합

### Week 3: Manager Tenant Management

- [ ] tenants 엔티티 구현
- [ ] subscriptions 엔티티 구현
- [ ] Manager 시스템 통합

### Week 4-5: Tenants SYS

- [ ] users 엔티티 구현
- [ ] branches 엔티티 구현
- [ ] departments 엔티티 구현
- [ ] roles 엔티티 구현
- [ ] SYS 스키마 통합

### Week 6-7: Tenants CRM/HRM

- [ ] CRM 스키마 구현
- [ ] HRM 스키마 구현
- [ ] Tenants 시스템 통합

### Week 8: 최종 통합 및 테스트

- [ ] 메인 스키마 통합
- [ ] Context 멀티 DB 적용
- [ ] DataLoader 3단계 네이밍 적용
- [ ] 통합 테스트
- [ ] 문서 업데이트

---

## 📈 v3.0 예상 효과

### 개발 생산성

- ✅ 시스템 분리 명확 → **충돌 제로**
- ✅ 스키마 도메인 분리 → **책임 명확**
- ✅ 팀별 병렬 작업 → **생산성 70% ↑**

### 코드 품질

- ✅ 명확한 네이밍 → **가독성 향상**
- ✅ 독립적 모듈 → **테스트 용이**
- ✅ 3단계 구조 → **유지보수 50% ↓**

### 확장성

- ✅ 신규 시스템 추가 용이
- ✅ 신규 스키마 추가 용이
- ✅ 마이크로서비스 전환 준비 완료
- ✅ Apollo Federation 적용 가능

---

## 🔗 주요 링크

### 필수 문서

- [v3.0 최신 아키텍처 가이드](./GraphQL_최신_아키텍처_가이드_v3.md) - **필독** ⭐

### 코드 예시

- Manager IDAM Users: `manager/idam/users/`
- Tenants SYS Users: `tenants/sys/users/`
- 스키마 통합: `*/schema.py`
- DataLoader: `graphql/loaders.py`

---

## 📝 변경 이력

| 버전     | 날짜       | 변경 내용                          |
| -------- | ---------- | ---------------------------------- |
| **v3.0** | 2025-11-11 | **3단계 구조 도입** ⭐             |
|          |            | - {시스템명}/{스키마명}/{엔티티명} |
|          |            | - Manager/Tenants 시스템 완전 분리 |
|          |            | - IDAM/SYS/CRM 스키마 명확 구분    |
|          |            | - DataLoader 3단계 네이밍          |
| v2.0     | 2025-11-11 | 2단계 구조 (시스템/엔티티)         |
| v1.0     | 2025-11-11 | REST → GraphQL 마이그레이션        |

---

## 📞 문의

- 📧 이메일: dev@cxg.com
- 💬 Slack: #graphql-api-v3
- 🐛 이슈: GitHub Issues (v3.0 label)
- 📖 Wiki: Confluence

---

## ✨ v3.0 주요 특징

### 1. 명확한 시스템 분리

```
Manager → 관리자 전용 기능
Tenants → 테넌트별 비즈니스 기능
```

### 2. 스키마 기반 도메인 분리

```
IDAM → 인증/권한
SYS → 시스템 관리
CRM → 고객 관리
HRM → 인사 관리
SCM → 공급망 관리
```

### 3. 충돌 없는 네이밍

```python
manager.idam.user   ≠  tenants.sys.user
→ 완전히 다른 엔티티, 충돌 없음!
```

### 4. 멀티 DB 지원

```python
context.manager_db_session    # Manager DB
context.tenant_db_session     # Tenant DB
```

---

**🎉 v3.0으로 더욱 명확하고 확장 가능한 GraphQL API를 경험하세요! 🚀**

**작성일:** 2025년 11월 11일  
**버전:** 3.0.0
