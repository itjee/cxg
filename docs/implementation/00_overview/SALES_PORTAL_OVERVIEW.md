# Sales Portal 프로젝트 개요

**작성일**: 2025-11-01
**프로젝트명**: ConexGrow Sales Portal (영업사원 포탈)
**상태**: ✅ 계획 완료 / 🚀 구현 준비 완료

---

## 📋 프로젝트 개요

ConexGrow에 **영업사원 포탈 (Sales Portal)** 애플리케이션을 추가합니다. 이는 기존 거래처 포탈(tenants-web)과 같은 방식으로 구축되며, **Salesforce Sales Cloud의 대시보드와 유사한 구성**으로 영업사원이 자신의 성과를 실시간으로 추적하고 거래처, 기회, 활동을 효과적으로 관리할 수 있는 통합 플랫폼입니다.

### 핵심 목표
1. **개인 맞춤형 대시보드**: 영업사원이 로그인 시 자신의 성과와 다음 액션을 즉시 확인
2. **효율적인 거래처/기회 관리**: 직관적인 UI로 파이프라인 관리
3. **협업 및 지식공유**: 팀 간 소통과 모범 사례 공유
4. **데이터 기반 의사결정**: 분석 리포트와 예측 기능

---

## 📚 문서 구조

프로젝트의 상세 구현 계획은 다음 3개의 주요 문서로 분류되어 있습니다:

### 1️⃣ 백엔드 API 구현 계획
📄 **문서**: `01_backend_api/SALES_PORTAL_API_IMPLEMENTATION.md`

**주요 내용**:
- FastAPI 백엔드 구조 설계
- 전체 RESTful API 엔드포인트 상세 정의
- 데이터 검증 및 에러 처리 전략
- JWT 인증 및 RBAC 권한 관리
- 테스트 전략 (Unit, Integration)

**API 모듈**:
- 📊 Dashboard API (`/api/v1/sales/dashboard`)
- 🏢 Accounts API (`/api/v1/sales/accounts`)
- 💼 Opportunities API (`/api/v1/sales/opportunities`)
- ✅ Activities API (`/api/v1/sales/activities`)
- 📚 Resources API (`/api/v1/sales/resources`)
- 🤝 Collaboration API (`/api/v1/sales/collaboration`)

**예상 소요 시간**: 2-3주

---

### 2️⃣ 데이터베이스 스키마 설계
📄 **문서**: `03_database_schema/SALES_PORTAL_DATABASE_SCHEMA.md`

**주요 내용**:
- 9개의 새로운 테이블 상세 정의
- 인덱싱 및 제약 조건 설정
- Alembic 마이그레이션 전략
- 샘플 데이터 초기화
- 최적화된 쿼리 예제

**새로운 테이블**:
1. `sales.sales_targets` - 영업 목표
2. `sales.sales_activities` - 영업 활동 기록
3. `sales.sales_forecasts` - 영업 예측
4. `sales.sales_metrics` - 영업 지표 (집계)
5. `sales.sales_leaderboard` - 순위표
6. `sales.sales_documents` - 영업 자료
7. `collaboration.feeds` - 협업 피드
8. `collaboration.comments` - 댓글
9. `collaboration.approvals` - 승인 요청

**예상 소요 시간**: 1주

---

### 3️⃣ 프론트엔드 애플리케이션 설계
📄 **문서**: `02_frontend/SALES_PORTAL_IMPLEMENTATION_PLAN.md`

**주요 내용**:
- Next.js 기반 프론트엔드 전체 구조
- 3개의 주요 섹션별 페이지 설계
- 컴포넌트 아키텍처 및 폴더 구조
- 기술 스택 및 라이브러리
- 구현 일정 (Phase별)

**주요 페이지**:

#### 1. 홈 대시보드 (Sales Activity & Performance Dashboard)
- 핵심 성과 지표 (Metrics)
- 파이프라인 요약 (Pipeline)
- 활동 및 작업 (Activities)
- 거래처 및 기회 (Accounts & Opportunities)
- 경쟁 및 인정 (Leaderboard)

#### 2. 거래처 및 기회 관리 (Account & Opportunity Management)
- 나의 거래처 (My Accounts)
- 기회 관리 (Opportunities) - Kanban, Table, Analytics 뷰
- 연락처 및 관계도 (Contacts & Relationship Map)

#### 3. 리소스 및 협업 (Resources & Collaboration)
- 영업 자료실 (Sales Collateral)
- 지식 베이스 (Knowledge Base)
- 내부 소통 (Chatter / Collaboration)

**예상 소요 시간**: 3-4주

---

## 🏗️ 프로젝트 구조

### 새로운 앱 생성

```
apps/
├── backend-api/              # 기존 (확장 필요)
│   └── src/api/
│       ├── v1/routers/
│       │   ├── sales/        # ← 새로운 영업 라우터
│       │   └── collaboration/# ← 새로운 협업 라우터
│       ├── models/
│       │   ├── sales/        # ← 새로운 모델
│       │   └── collaboration/# ← 새로운 모델
│       └── services/
│           ├── sales/        # ← 새로운 서비스
│           └── collaboration/# ← 새로운 서비스
│
├── manager-web/              # 기존 (변경 없음)
│
├── tenants-web/              # 기존 (변경 없음)
│
└── sales-web/                # ← 새로운 앱
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/
    │   │   └── (main)/
    │   │       ├── dashboard/
    │   │       ├── accounts/
    │   │       ├── opportunities/
    │   │       ├── resources/
    │   │       ├── collaboration/
    │   │       └── settings/
    │   ├── components/
    │   ├── features/
    │   │   ├── sales/
    │   │   └── collaboration/
    │   ├── lib/
    │   ├── styles/
    │   ├── types/
    │   └── middleware.ts
    ├── public/
    └── package.json
```

---

## 🔄 데이터 흐름 및 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                     Sales Portal App                         │
│                    (Next.js Frontend)                        │
│                                                               │
│  Dashboard │ Accounts │ Opportunities │ Resources │ Collab   │
└─────────────────────────────────────────────────────────────┘
                          ↓ (REST API)
┌─────────────────────────────────────────────────────────────┐
│                    Backend API (FastAPI)                     │
│                                                               │
│  Dashboard │ Accounts │ Opportunities │ Activities │ Collab  │
│  Services  │ Services │  Services     │ Services   │Service  │
└─────────────────────────────────────────────────────────────┘
                          ↓ (SQL Queries)
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL Database (Tenant DB)                 │
│                                                               │
│  CRM Module  │ Sales Module  │ Collaboration │ Other Modules│
│  (existing)  │  (new)        │  (new)        │ (existing)   │
└─────────────────────────────────────────────────────────────┘
```

### 데이터 소스 매핑

```
Frontend            API Endpoint           Database Table(s)
──────────────────────────────────────────────────────────────
Dashboard Metrics   GET /dashboard/metrics sales_targets,
                                           sales_metrics,
                                           opportunities

Account List        GET /accounts          accounts,
                                           partner_managers

Opportunity Kanban  GET /opportunities     opportunities,
                                           accounts,
                                           sales_activities

Activities          GET /activities        sales_activities,
                                           tasks

Resources           GET /resources         sales_documents

Collaboration       GET /feeds             feeds,
                    GET /approvals         approvals,
                                           comments
```

---

## 📊 구현 일정

### Phase 1: 기초 설정 (1주)
- [x] 프로젝트 계획 및 설계 완료
- [ ] 새 `sales-web` Next.js 앱 생성
- [ ] 기본 레이아웃 및 네비게이션 구성
- [ ] 인증 통합 (tenants-web 참고)
- [ ] 환경 설정 및 API 클라이언트 구성

### Phase 2: 데이터베이스 & 백엔드 (2주)
- [ ] 데이터베이스 마이그레이션 실행
- [ ] 9개 테이블 생성 및 인덱싱
- [ ] FastAPI 라우터 구현
- [ ] Service 클래스 구현
- [ ] Pydantic 스키마 정의
- [ ] 권한 관리 (RBAC) 적용

### Phase 3: 대시보드 개발 (2주)
- [ ] 메트릭 API 구현
- [ ] 메트릭 컴포넌트 개발
- [ ] 차트 통합 (Recharts)
- [ ] 파이프라인 요약
- [ ] 활동 및 작업 패널
- [ ] 거래처 및 기회 패널
- [ ] 순위표

### Phase 4: 거래처/기회 관리 (2주)
- [ ] 계정 목록 페이지 및 API
- [ ] 계정 상세 페이지
- [ ] 기회 Kanban 보드 및 API
- [ ] 기회 테이블 뷰
- [ ] 기회 상세 페이지
- [ ] 연락처 및 관계도

### Phase 5: 리소스 & 협업 (1주)
- [ ] 자료실 페이지 및 API
- [ ] 지식베이스 검색 및 API
- [ ] 협업 피드 및 API
- [ ] 댓글 기능
- [ ] 승인 요청 기능

### Phase 6: 최적화 및 배포 (1주)
- [ ] 성능 최적화
- [ ] 테스트 작성 (Unit, Integration)
- [ ] 문서화
- [ ] 보안 검수
- [ ] 배포 준비

**총 예상 기간**: 8-10주

---

## 🛠️ 기술 스택 요약

### Frontend
```
Framework:        Next.js 15 (App Router)
UI Library:       React 19
Styling:          Tailwind CSS 4
Components:       shadcn/ui
State:            Zustand
Data Fetching:    TanStack Query (React Query)
Charts:           Recharts
Tables:           TanStack Table
Forms:            React Hook Form + Zod
Date:             date-fns
HTTP:             Axios
Type Safety:      TypeScript
```

### Backend
```
Framework:        FastAPI
Database:         PostgreSQL 15+
ORM:              SQLAlchemy 2.0
Auth:             JWT + RBAC
Validation:       Pydantic v2
Migration:        Alembic
Testing:          pytest
Documentation:    OpenAPI/Swagger
```

---

## 📈 성능 목표

| 메트릭 | 목표 | 설명 |
|--------|------|------|
| **응답시간 (Dashboard)** | < 500ms | 메트릭 로드 시간 |
| **응답시간 (List API)** | < 1s | 페이징된 목록 조회 |
| **캐시 히트율** | > 80% | Redis 캐싱 효율 |
| **동시 사용자** | 1,000+ | 동시 접속 성능 |
| **API 처리량** | 10,000 req/min | 초당 요청 수 |
| **아이콘 로드 시간** | < 3s | 초기 페이지 로드 |
| **DB 쿼리 시간** | < 200ms | 단일 쿼리 평균 |

---

## 🔐 보안 고려사항

1. **인증**: JWT 기반 토큰 인증
2. **권한**: RBAC를 통한 세분화된 권한 관리
3. **데이터 격리**: 테넌트별 완전한 데이터 격리
4. **입력 검증**: Pydantic 스키마를 통한 자동 검증
5. **에러 메시지**: 민감 정보 노출 방지
6. **CORS**: 허용된 도메인만 API 접근
7. **Rate Limiting**: API 남용 방지
8. **로깅**: 모든 중요한 액션 기록

---

## 📋 관련 기존 문서

프로젝트를 이해하기 위해 다음 문서를 참고하세요:

1. **Project Manifest**
   - 📖 `docs/02_architecture/PROJECT_MANIFEST.md`
   - 전체 프로젝트 구조 및 모듈 설명

2. **Frontend Structure**
   - 📖 `docs/02_architecture/FRONTEND_STRUCTURE.md`
   - Next.js 앱 구조 및 패턴

3. **RBAC 아키텍처**
   - 📖 `docs/04_api/인증권한_아키텍처분석_20251027.md`
   - 인증 및 권한 시스템 상세 설명

4. **마이그레이션 가이드**
   - 📖 `docs/03_database/MIGRATION_EXECUTION_GUIDE.md`
   - 데이터베이스 마이그레이션 방법

5. **빠른 명령어**
   - 📖 `docs/07_references/README.md`
   - 자주 사용되는 명령어 모음

---

## ✅ 구현 체크리스트

### Phase 1: 기초 설정
- [ ] sales-web 앱 생성
- [ ] 레이아웃 및 라우팅 구성
- [ ] 인증 통합
- [ ] API 클라이언트 설정

### Phase 2: 데이터베이스 & 백엔드
- [ ] 마이그레이션 파일 생성
- [ ] 9개 테이블 생성
- [ ] 인덱스 및 제약 생성
- [ ] 모든 API 라우터 구현
- [ ] Service 클래스 구현
- [ ] 권한 검증 추가

### Phase 3-5: 페이지 & 컴포넌트
- [ ] 모든 페이지 구현
- [ ] 모든 컴포넌트 개발
- [ ] 차트 및 시각화 추가
- [ ] API 통합 완료
- [ ] 에러 처리 추가

### Phase 6: 최적화 & 배포
- [ ] Unit 테스트 작성 (>80% coverage)
- [ ] Integration 테스트 실행
- [ ] 성능 테스트 및 최적화
- [ ] 보안 검수
- [ ] 문서 완성
- [ ] 프로덕션 배포

---

## 📞 다음 단계

### 1. 즉시 시작 (이번 주)
```bash
# 1. sales-web 앱 생성
cd apps
npx create-next-app@latest sales-web --typescript

# 2. 레이아웃 구성
# tenants-web의 (auth), (main) 디렉토리 구조 참고

# 3. 환경 변수 설정
# .env.local 파일 생성
```

### 2. 데이터베이스 준비 (2-3일)
```bash
# 1. 마이그레이션 파일 생성
alembic revision --autogenerate -m "sales_portal_schema"

# 2. 마이그레이션 실행 (개발 DB)
alembic upgrade head

# 3. 샘플 데이터 로드
python scripts/seed_sales_data.py
```

### 3. 백엔드 API 개발 (1주)
```bash
# 1. 라우터 디렉토리 구성
mkdir -p src/api/v1/routers/sales
mkdir -p src/api/v1/routers/collaboration

# 2. Service 클래스 작성
# 3. API 엔드포인트 구현
# 4. Pydantic 스키마 정의
# 5. 권한 검증 추가
```

### 4. 프론트엔드 개발 (3-4주)
```bash
# 1. 페이지 구조 생성
# 2. 공통 컴포넌트 개발
# 3. 페이지별 컴포넌트 개발
# 4. API 통합
# 5. 테스트
```

---

## 📚 문서 파일 위치

| 문서 | 경로 |
|------|------|
| **이 문서** | `docs/implementation/00_overview/SALES_PORTAL_OVERVIEW.md` |
| **백엔드 API** | `docs/implementation/01_backend_api/SALES_PORTAL_API_IMPLEMENTATION.md` |
| **프론트엔드** | `docs/implementation/02_frontend/SALES_PORTAL_IMPLEMENTATION_PLAN.md` |
| **데이터베이스** | `docs/implementation/03_database_schema/SALES_PORTAL_DATABASE_SCHEMA.md` |

---

## 🎯 성공 기준

프로젝트는 다음 기준을 충족할 때 완료된 것으로 봅니다:

✅ **기능 완성**
- [ ] 모든 페이지 구현
- [ ] 모든 API 엔드포인트 동작
- [ ] 데이터베이스 통합 완료

✅ **품질 보증**
- [ ] Unit 테스트 커버리지 > 80%
- [ ] Integration 테스트 모두 통과
- [ ] 성능 목표 달성
- [ ] 보안 검수 완료

✅ **문서화**
- [ ] API 문서 완성 (Swagger)
- [ ] 기능별 사용자 가이드
- [ ] 개발자 가이드

✅ **배포**
- [ ] 프로덕션 데이터베이스 마이그레이션
- [ ] 프로덕션 배포 완료
- [ ] 모니터링 설정
- [ ] 롤백 계획 수립

---

## 📞 문의 및 지원

프로젝트 관련 질문이나 요청사항:

1. **기술적 질문**: 팀 슬랙 `#engineering` 채널
2. **문서 피드백**: GitHub Issues
3. **구현 진행 상황**: 주간 회의
4. **버그 보고**: GitHub Issues

---

**문서 작성**: Claude Code
**최종 수정**: 2025-11-01
**버전**: 1.0.0
**상태**: ✅ 준비 완료

---

## 🚀 준비 완료!

세 가지 상세 문서와 이 개요 문서를 통해 **Sales Portal 프로젝트의 전체 구현 계획**이 완성되었습니다.

- ✅ 백엔드 API 설계 완료
- ✅ 데이터베이스 스키마 설계 완료
- ✅ 프론트엔드 아키텍처 설계 완료
- ✅ 구현 일정 수립 완료

**이제 실제 개발을 시작할 준비가 되었습니다!** 🎉

각 문서를 참고하여 순차적으로 구현을 진행하면 됩니다.
