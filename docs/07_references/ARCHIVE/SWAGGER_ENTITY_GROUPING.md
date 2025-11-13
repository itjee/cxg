# Swagger 엔티티 그룹화 업데이트

**날짜**: 2025-10-16  
**작업**: Swagger 문서에 엔티티 레벨 그룹화 추가

## 개요

Swagger UI에서 API를 **시스템 > 스키마 > 엔티티** 3단계 계층 구조로 그룹화하여 더욱 명확한 구조를 제공합니다.

## 그룹화 구조

### 변경 전 (2단계)
```
Manager > BILL
  ├─ GET /api/v1/manager/bill/plans
  ├─ GET /api/v1/manager/bill/invoices
  └─ GET /api/v1/manager/bill/transactions
```

### 변경 후 (3단계)
```
Manager > BILL > Plans
  └─ GET /api/v1/manager/bill/plans

Manager > BILL > Invoices
  └─ GET /api/v1/manager/bill/invoices

Manager > BILL > Transactions
  └─ GET /api/v1/manager/bill/transactions
```

## 전체 태그 구조

### Manager System (56개 엔티티 태그)

#### Auth (1개)
- Manager > Auth > Auth

#### IDAM (8개)
- Manager > IDAM > Users
- Manager > IDAM > Roles
- Manager > IDAM > Permissions
- Manager > IDAM > User Roles
- Manager > IDAM > Role Permissions
- Manager > IDAM > Sessions
- Manager > IDAM > Login Logs
- Manager > IDAM > API Keys

#### TNNT (2개)
- Manager > TNNT > Tenants
- Manager > TNNT > Subscriptions

#### BILL (3개)
- Manager > BILL > Plans
- Manager > BILL > Invoices
- Manager > BILL > Transactions

#### IFRA (2개)
- Manager > IFRA > Resources
- Manager > IFRA > Resource Usages

#### MNTR (3개)
- Manager > MNTR > System Metrics
- Manager > MNTR > Health Checks
- Manager > MNTR > Incidents

#### AUDT (3개)
- Manager > AUDT > Audit Logs
- Manager > AUDT > Policies
- Manager > AUDT > Compliances

#### BKUP (3개)
- Manager > BKUP > Schedules
- Manager > BKUP > Executions
- Manager > BKUP > Recovery Plans

#### CNFG (4개)
- Manager > CNFG > Configurations
- Manager > CNFG > Feature Flags
- Manager > CNFG > Tenant Features
- Manager > CNFG > Service Quotas

#### INTG (3개)
- Manager > INTG > APIs
- Manager > INTG > Webhooks
- Manager > INTG > Rate Limits

#### NOTI (3개)
- Manager > NOTI > Notifications
- Manager > NOTI > Templates
- Manager > NOTI > Campaigns

#### SUPT (3개)
- Manager > SUPT > Tickets
- Manager > SUPT > Ticket Comments
- Manager > SUPT > Feedbacks

#### STAT (2개)
- Manager > STAT > Usage Stats
- Manager > STAT > Tenant Stats

#### AUTO (3개)
- Manager > AUTO > Workflows
- Manager > AUTO > Tasks
- Manager > AUTO > Executions

### Tenant System (24개 엔티티 태그)

#### ADM (1개)
- Tenant > ADM > Users

#### CSM (4개)
- Tenant > CSM > Customers
- Tenant > CSM > Contacts
- Tenant > CSM > Opportunities
- Tenant > CSM > Activities

#### FIM (4개)
- Tenant > FIM > Accounts
- Tenant > FIM > Transactions
- Tenant > FIM > Budgets
- Tenant > FIM > Invoices

#### IVM (4개)
- Tenant > IVM > Products
- Tenant > IVM > Warehouses
- Tenant > IVM > Stock Movements
- Tenant > IVM > Adjustments

#### PSM (4개)
- Tenant > PSM > Purchase Orders
- Tenant > PSM > Vendors
- Tenant > PSM > Requisitions
- Tenant > PSM > Receiving

#### SRM (4개)
- Tenant > SRM > Sales Orders
- Tenant > SRM > Quotes
- Tenant > SRM > Customers
- Tenant > SRM > Sales Activities

#### LWM (4개)
- Tenant > LWM > Workflows
- Tenant > LWM > Approvals
- Tenant > LWM > Tasks
- Tenant > LWM > Steps

## 통계

- **총 태그 수**: 71개 (기본 1 + Manager 56 + Tenant 24)
- **Manager 스키마**: 14개
- **Tenant 스키마**: 7개
- **Manager 엔티티**: 56개
- **Tenant 엔티티**: 24개
- **총 엔티티**: 80개

## 장점

### 1. 명확한 계층 구조
- System → Schema → Entity 3단계로 명확하게 구분
- 각 엔티티가 독립적인 그룹으로 표시

### 2. 향상된 탐색성
- Swagger UI에서 특정 엔티티 빠르게 찾기 가능
- 각 엔티티의 모든 작업(CRUD)이 함께 그룹화됨

### 3. 문서화 개선
- 각 엔티티에 명확한 설명 제공
- 한국어 설명으로 이해도 향상

### 4. 확장성
- 새로운 엔티티 추가 시 일관된 패턴 적용
- 스키마 내 엔티티 관리 용이

## 수정된 파일

### 1. src/main.py
- 22개 → 71개 태그로 확장
- 각 엔티티에 대한 상세 설명 추가
- 3단계 계층 구조: System > Schema > Entity

### 2. src/routers/manager/v1.py
- 43개 라우터의 tags를 엔티티 레벨로 세분화
- 예: `["Manager > BILL"]` → `["Manager > BILL > Invoices"]`

### 3. src/routers/tenants/v1.py
- 24개 라우터의 tags를 엔티티 레벨로 세분화
- 예: `["Tenant > CSM"]` → `["Tenant > CSM > Customers"]`

## Swagger UI 표시 예시

```
기본
  └─ GET / (루트)
  └─ GET /health (헬스체크)

Manager > Auth > Auth
  └─ POST /api/v1/manager/auth/login
  └─ POST /api/v1/manager/auth/logout
  └─ POST /api/v1/manager/auth/refresh

Manager > BILL > Plans
  └─ GET /api/v1/manager/bill/plans
  └─ POST /api/v1/manager/bill/plans
  └─ GET /api/v1/manager/bill/plans/{id}
  └─ PUT /api/v1/manager/bill/plans/{id}
  └─ DELETE /api/v1/manager/bill/plans/{id}

Manager > BILL > Invoices
  └─ GET /api/v1/manager/bill/invoices
  └─ POST /api/v1/manager/bill/invoices
  └─ GET /api/v1/manager/bill/invoices/{id}
  ...

Tenant > CSM > Customers
  └─ GET /api/v1/tenants/csm/customers
  └─ POST /api/v1/tenants/csm/customers
  └─ GET /api/v1/tenants/csm/customers/{id}
  ...
```

## 사용자 경험 개선

### 개발자 관점
1. **빠른 검색**: Swagger UI에서 Ctrl+F로 엔티티명 검색
2. **명확한 범위**: 각 엔티티의 모든 작업이 하나의 그룹에 집중
3. **이해 용이**: 한국어 설명으로 기능 파악 빠름

### API 소비자 관점
1. **직관적 탐색**: 시스템 → 스키마 → 엔티티 순으로 탐색
2. **일관된 패턴**: 모든 엔티티가 동일한 구조
3. **완전한 문서**: 각 엔티티 그룹에 설명 포함

## 테스트

서버를 실행하고 Swagger UI에서 확인:

```bash
cd apps/backend-api
source .venv/bin/activate
uvicorn src.main:app --reload --port 8100
```

브라우저에서 http://localhost:8100/docs 접속 후:
1. 좌측 태그 목록에서 3단계 계층 구조 확인
2. "Manager > BILL > Invoices" 클릭하여 청구서 관련 API만 표시
3. 검색 기능으로 특정 엔티티 빠르게 찾기

## 마이그레이션 영향

이 변경은 **Swagger UI 표시 방식만 변경**하며, 실제 API 경로나 동작에는 영향 없음:
- ✅ API 경로: 변경 없음
- ✅ 요청/응답: 변경 없음
- ✅ 인증: 변경 없음
- ✅ 기존 클라이언트: 영향 없음

## 향후 개선 사항

1. **자동 생성**: 라우터에서 자동으로 태그 생성하는 헬퍼 함수
2. **다국어 지원**: 영어/한국어 설명 동시 제공
3. **태그 순서**: 알파벳순 대신 논리적 순서로 정렬
4. **그룹 아이콘**: 각 스키마에 시각적 아이콘 추가 (ReDoc)

## 참고

- [FastAPI 태그 문서](https://fastapi.tiangolo.com/tutorial/metadata/#metadata-for-tags)
- [OpenAPI 태그 객체](https://swagger.io/specification/#tag-object)
