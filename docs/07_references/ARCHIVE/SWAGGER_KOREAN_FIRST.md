# Swagger 태그 한글 우선 표시 업데이트

**날짜**: 2025-10-17  
**작업**: Swagger UI에서 한글 설명을 주 타이틀로, 영문 경로를 괄호 안에 표시

## 개요

Swagger UI에서 API 태그를 한글 중심으로 표시하여 한국어 사용자의 이해도를 향상시켰습니다. 기존 영문 경로는 괄호 안에 참고용으로 표시됩니다.

## 변경사항

### 변경 전
```
태그명: Manager > IDAM > Permissions
설명: 관리자 시스템 - 권한 관리
```

### 변경 후
```
태그명: 관리자 시스템 - 인증관리 - 권한 (Manager > IDAM > Permissions)
설명: 권한 관리
```

## 패턴 구조

### 한글 우선 패턴
```
{시스템} - {스키마} - {엔티티} ({System} > {Schema} > {Entity})
```

### 예시

#### 관리자 시스템
- `관리자 시스템 - 인증 - 인증 (Manager > Auth > Auth)`
- `관리자 시스템 - 인증관리 - 사용자 (Manager > IDAM > Users)`
- `관리자 시스템 - 청구관리 - 청구서 (Manager > BILL > Invoices)`
- `관리자 시스템 - 모니터링 - 시스템메트릭 (Manager > MNTR > System Metrics)`

#### 테넌트 시스템
- `테넌트 시스템 - 관리 - 사용자 (Tenant > ADM > Users)`
- `테넌트 시스템 - 고객관리 - 고객 (Tenant > CSM > Customers)`
- `테넌트 시스템 - 재무관리 - 계정 (Tenant > FIM > Accounts)`
- `테넌트 시스템 - 재고관리 - 제품 (Tenant > IVM > Products)`

## 전체 태그 목록

### 관리자 시스템 (56개)

#### Auth (1개)
- 관리자 시스템 - 인증 - 인증 (Manager > Auth > Auth)

#### IDAM - 인증관리 (8개)
- 관리자 시스템 - 인증관리 - 사용자 (Manager > IDAM > Users)
- 관리자 시스템 - 인증관리 - 역할 (Manager > IDAM > Roles)
- 관리자 시스템 - 인증관리 - 권한 (Manager > IDAM > Permissions)
- 관리자 시스템 - 인증관리 - 사용자역할 (Manager > IDAM > User Roles)
- 관리자 시스템 - 인증관리 - 역할권한 (Manager > IDAM > Role Permissions)
- 관리자 시스템 - 인증관리 - 세션 (Manager > IDAM > Sessions)
- 관리자 시스템 - 인증관리 - 로그인로그 (Manager > IDAM > Login Logs)
- 관리자 시스템 - 인증관리 - API키 (Manager > IDAM > API Keys)

#### TNNT - 테넌트관리 (2개)
- 관리자 시스템 - 테넌트관리 - 테넌트 (Manager > TNNT > Tenants)
- 관리자 시스템 - 테넌트관리 - 구독 (Manager > TNNT > Subscriptions)

#### BILL - 청구관리 (3개)
- 관리자 시스템 - 청구관리 - 요금제 (Manager > BILL > Plans)
- 관리자 시스템 - 청구관리 - 청구서 (Manager > BILL > Invoices)
- 관리자 시스템 - 청구관리 - 거래내역 (Manager > BILL > Transactions)

#### IFRA - 인프라관리 (2개)
- 관리자 시스템 - 인프라관리 - 리소스 (Manager > IFRA > Resources)
- 관리자 시스템 - 인프라관리 - 사용량 (Manager > IFRA > Resource Usages)

#### MNTR - 모니터링 (3개)
- 관리자 시스템 - 모니터링 - 시스템메트릭 (Manager > MNTR > System Metrics)
- 관리자 시스템 - 모니터링 - 헬스체크 (Manager > MNTR > Health Checks)
- 관리자 시스템 - 모니터링 - 인시던트 (Manager > MNTR > Incidents)

#### AUDT - 감사관리 (3개)
- 관리자 시스템 - 감사관리 - 감사로그 (Manager > AUDT > Audit Logs)
- 관리자 시스템 - 감사관리 - 정책 (Manager > AUDT > Policies)
- 관리자 시스템 - 감사관리 - 컴플라이언스 (Manager > AUDT > Compliances)

#### BKUP - 백업관리 (3개)
- 관리자 시스템 - 백업관리 - 스케줄 (Manager > BKUP > Schedules)
- 관리자 시스템 - 백업관리 - 실행내역 (Manager > BKUP > Executions)
- 관리자 시스템 - 백업관리 - 복구계획 (Manager > BKUP > Recovery Plans)

#### CNFG - 설정관리 (4개)
- 관리자 시스템 - 설정관리 - 설정 (Manager > CNFG > Configurations)
- 관리자 시스템 - 설정관리 - 기능플래그 (Manager > CNFG > Feature Flags)
- 관리자 시스템 - 설정관리 - 테넌트기능 (Manager > CNFG > Tenant Features)
- 관리자 시스템 - 설정관리 - 서비스할당량 (Manager > CNFG > Service Quotas)

#### INTG - 통합관리 (3개)
- 관리자 시스템 - 통합관리 - 외부API (Manager > INTG > APIs)
- 관리자 시스템 - 통합관리 - 웹훅 (Manager > INTG > Webhooks)
- 관리자 시스템 - 통합관리 - API제한 (Manager > INTG > Rate Limits)

#### NOTI - 알림관리 (3개)
- 관리자 시스템 - 알림관리 - 알림 (Manager > NOTI > Notifications)
- 관리자 시스템 - 알림관리 - 템플릿 (Manager > NOTI > Templates)
- 관리자 시스템 - 알림관리 - 캠페인 (Manager > NOTI > Campaigns)

#### SUPT - 지원관리 (3개)
- 관리자 시스템 - 지원관리 - 티켓 (Manager > SUPT > Tickets)
- 관리자 시스템 - 지원관리 - 댓글 (Manager > SUPT > Ticket Comments)
- 관리자 시스템 - 지원관리 - 피드백 (Manager > SUPT > Feedbacks)

#### STAT - 통계관리 (2개)
- 관리자 시스템 - 통계관리 - 사용통계 (Manager > STAT > Usage Stats)
- 관리자 시스템 - 통계관리 - 테넌트통계 (Manager > STAT > Tenant Stats)

#### AUTO - 자동화관리 (3개)
- 관리자 시스템 - 자동화관리 - 워크플로우 (Manager > AUTO > Workflows)
- 관리자 시스템 - 자동화관리 - 작업 (Manager > AUTO > Tasks)
- 관리자 시스템 - 자동화관리 - 실행내역 (Manager > AUTO > Executions)

### 테넌트 시스템 (24개)

#### ADM - 관리 (1개)
- 테넌트 시스템 - 관리 - 사용자 (Tenant > ADM > Users)

#### CSM - 고객관리 (4개)
- 테넌트 시스템 - 고객관리 - 고객 (Tenant > CSM > Customers)
- 테넌트 시스템 - 고객관리 - 연락처 (Tenant > CSM > Contacts)
- 테넌트 시스템 - 고객관리 - 영업기회 (Tenant > CSM > Opportunities)
- 테넌트 시스템 - 고객관리 - 활동 (Tenant > CSM > Activities)

#### FIM - 재무관리 (4개)
- 테넌트 시스템 - 재무관리 - 계정 (Tenant > FIM > Accounts)
- 테넌트 시스템 - 재무관리 - 거래 (Tenant > FIM > Transactions)
- 테넌트 시스템 - 재무관리 - 예산 (Tenant > FIM > Budgets)
- 테넌트 시스템 - 재무관리 - 청구서 (Tenant > FIM > Invoices)

#### IVM - 재고관리 (4개)
- 테넌트 시스템 - 재고관리 - 제품 (Tenant > IVM > Products)
- 테넌트 시스템 - 재고관리 - 창고 (Tenant > IVM > Warehouses)
- 테넌트 시스템 - 재고관리 - 재고이동 (Tenant > IVM > Stock Movements)
- 테넌트 시스템 - 재고관리 - 재고조정 (Tenant > IVM > Adjustments)

#### PSM - 구매관리 (4개)
- 테넌트 시스템 - 구매관리 - 발주 (Tenant > PSM > Purchase Orders)
- 테넌트 시스템 - 구매관리 - 공급업체 (Tenant > PSM > Vendors)
- 테넌트 시스템 - 구매관리 - 구매요청 (Tenant > PSM > Requisitions)
- 테넌트 시스템 - 구매관리 - 입고 (Tenant > PSM > Receiving)

#### SRM - 판매관리 (4개)
- 테넌트 시스템 - 판매관리 - 주문 (Tenant > SRM > Sales Orders)
- 테넌트 시스템 - 판매관리 - 견적 (Tenant > SRM > Quotes)
- 테넌트 시스템 - 판매관리 - 고객 (Tenant > SRM > Customers)
- 테넌트 시스템 - 판매관리 - 판매활동 (Tenant > SRM > Sales Activities)

#### LWM - 워크플로우관리 (4개)
- 테넌트 시스템 - 워크플로우관리 - 워크플로우 (Tenant > LWM > Workflows)
- 테넌트 시스템 - 워크플로우관리 - 승인 (Tenant > LWM > Approvals)
- 테넌트 시스템 - 워크플로우관리 - 작업 (Tenant > LWM > Tasks)
- 테넌트 시스템 - 워크플로우관리 - 단계 (Tenant > LWM > Steps)

## 장점

### 1. 한글 우선 표시
- 한국어 사용자가 더 빠르게 이해 가능
- 태그명이 기능을 직접적으로 설명

### 2. 참조 경로 유지
- 괄호 안에 영문 경로를 표시하여 코드와의 매핑 용이
- 국제화 시 영문 경로 참조 가능

### 3. 일관된 패턴
- 모든 태그가 동일한 패턴 사용
- 시스템 - 스키마 - 엔티티 구조 명확

### 4. 검색 용이성
- 한글로 검색 시 빠른 탐색
- 영문 약어로도 검색 가능

## Swagger UI 표시 예시

```
기본 엔드포인트
  └─ GET /
  └─ GET /health

관리자 시스템 - 인증 - 인증 (Manager > Auth > Auth)
  └─ POST /api/v1/manager/auth/login
  └─ POST /api/v1/manager/auth/logout

관리자 시스템 - 청구관리 - 청구서 (Manager > BILL > Invoices)
  └─ GET /api/v1/manager/bill/invoices
  └─ POST /api/v1/manager/bill/invoices
  └─ ...

테넌트 시스템 - 고객관리 - 고객 (Tenant > CSM > Customers)
  └─ GET /api/v1/tenants/csm/customers
  └─ POST /api/v1/tenants/csm/customers
  └─ ...
```

## 수정된 파일

### 1. src/main.py
- 71개 태그의 name과 description 재구성
- name: 한글 중심 패턴 + 괄호 안 영문 경로
- description: 간략한 기능 설명

### 2. src/routers/manager/v1.py
- 43개 라우터 태그를 한글 우선 패턴으로 변경

### 3. src/routers/tenants/v1.py
- 24개 라우터 태그를 한글 우선 패턴으로 변경

## 비교표

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| 태그명 | Manager > BILL > Invoices | 관리자 시스템 - 청구관리 - 청구서 (Manager > BILL > Invoices) |
| 설명 | 관리자 시스템 - 청구서 관리 | 청구서 관리 |
| 주 표시 언어 | 영문 | 한글 |
| 경로 참조 | 태그명에만 | 태그명 괄호 안 |

## 사용자 경험 개선

### 한국어 사용자
1. **직관적 이해**: 태그명만 봐도 기능 파악 가능
2. **빠른 탐색**: 한글로 구조화되어 검색 용이
3. **명확한 계층**: 시스템 > 스키마 > 엔티티 구조가 한글로 표현

### 국제 사용자
1. **참조 경로**: 괄호 안 영문 경로로 코드와 매핑
2. **일관성**: 모든 태그가 동일한 패턴 사용
3. **확장성**: 다국어 지원 시 패턴 재사용 가능

## 테스트 방법

```bash
cd apps/backend-api
source .venv/bin/activate
uvicorn src.main:app --reload --port 8100
```

브라우저에서 http://localhost:8100/docs 접속 후 확인:
1. 좌측 태그 목록이 한글로 표시
2. 각 태그명 끝에 괄호 안 영문 경로 표시
3. 태그 클릭 시 설명 부분에 간략한 기능 설명

## 향후 개선 사항

1. **다국어 지원**: 언어별 태그명 자동 전환
2. **검색 최적화**: 한글/영문 모두 검색 지원
3. **태그 정렬**: 사용 빈도나 중요도에 따른 정렬 옵션
4. **아이콘 추가**: 각 스키마에 시각적 아이콘 표시

## 참고

이 변경은 **Swagger UI 표시 방식만 변경**하며, 실제 API 경로나 동작에는 영향 없음:
- ✅ API 경로: 변경 없음
- ✅ 요청/응답: 변경 없음
- ✅ 라우터 코드: 태그 문자열만 변경
- ✅ 기존 클라이언트: 영향 없음
