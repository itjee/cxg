# API 라우팅 리팩토링 완료 보고서

**날짜**: 2025-10-16  
**작업**: API 라우팅을 스키마 단위로 재구성 및 Swagger 그룹화

## 작업 개요

CXG Platform API의 라우팅 구조를 스키마 약어 기반으로 변경하고, Swagger 문서를 시스템과 스키마 단위로 그룹화했습니다.

## 주요 변경사항

### 1. 라우팅 패턴 표준화

**변경 전**:
```
/api/v1/manager/billing/invoices
/api/v1/manager/tenants
/api/v1/tenants/crm/customers
/api/v1/tenants/finance/accounts
```

**변경 후**:
```
/api/v1/manager/{schema}/{entity}
/api/v1/tenants/{schema}/{entity}
```

예시:
- `/api/v1/manager/bill/invoices`
- `/api/v1/manager/tnnt/tenants`
- `/api/v1/tenants/csm/customers`
- `/api/v1/tenants/fim/accounts`

### 2. 스키마 약어 적용

모든 경로에서 스키마 약어를 사용하도록 통일:

#### 관리자 시스템
- `billing` → `bill`
- `infrastructure` → `ifra`
- `monitoring` → `mntr`
- `audit` → `audt`
- `backup` → `bkup`
- `config` → `cnfg`
- `integration` → `intg`
- `notifications` → `noti`
- `support` → `supt`
- `statistics` → `stat`
- `automation` → `auto`

#### 테넌트 시스템
- `crm` → `csm`
- `finance` → `fim`
- `inventory` → `ivm`
- `procurement` → `psm`
- `sales` → `srm`
- `workflow` → `lwm`
- `adm` (그대로 유지)

### 3. Swagger 태그 그룹화

**변경 전**:
- 단순한 3개 그룹: "기본", "관리자 시스템", "테넌트 시스템"

**변경 후**:
- 시스템 > 스키마 계층 구조:
  - Manager > Auth
  - Manager > IDAM
  - Manager > TNNT
  - Manager > BILL
  - Manager > IFRA
  - Manager > MNTR
  - Manager > AUDT
  - Manager > BKUP
  - Manager > CNFG
  - Manager > INTG
  - Manager > NOTI
  - Manager > SUPT
  - Manager > STAT
  - Manager > AUTO
  - Tenant > ADM
  - Tenant > CSM
  - Tenant > FIM
  - Tenant > IVM
  - Tenant > PSM
  - Tenant > SRM
  - Tenant > LWM

## 수정된 파일

1. **src/main.py**
   - OpenAPI 태그 메타데이터를 시스템/스키마 기반으로 재구성
   - API 설명 섹션에 새로운 경로 패턴 추가

2. **src/routers/manager/v1.py**
   - 모든 라우터 prefix를 스키마 약어로 변경
   - 모든 라우터 tags를 "Manager > {SCHEMA}" 형식으로 변경

3. **src/routers/tenants/v1.py**
   - 모든 라우터 prefix를 스키마 약어로 변경
   - 모든 라우터 tags를 "Tenant > {SCHEMA}" 형식으로 변경

4. **docs/API_ROUTING.md** (신규)
   - 새로운 라우팅 구조 상세 문서
   - 스키마별 경로 목록
   - 마이그레이션 가이드

## 예시 경로 변경

### 관리자 시스템

| 기능 | 변경 전 | 변경 후 |
|------|---------|---------|
| 청구서 목록 | `/api/v1/manager/billing/invoices` | `/api/v1/manager/bill/invoices` |
| 요금제 | `/api/v1/manager/billing/plans` | `/api/v1/manager/bill/plans` |
| 테넌트 | `/api/v1/manager/tenants` | `/api/v1/manager/tnnt/tenants` |
| 구독 | `/api/v1/manager/subscriptions` | `/api/v1/manager/tnnt/subscriptions` |
| 메트릭 | `/api/v1/manager/monitoring/metrics` | `/api/v1/manager/mntr/system-metrics` |
| 리소스 | `/api/v1/manager/infrastructure/resources` | `/api/v1/manager/ifra/resources` |
| 감사로그 | `/api/v1/manager/audit/logs` | `/api/v1/manager/audt/audit-logs` |

### 테넌트 시스템

| 기능 | 변경 전 | 변경 후 |
|------|---------|---------|
| 고객 | `/api/v1/tenants/crm/customers` | `/api/v1/tenants/csm/customers` |
| 연락처 | `/api/v1/tenants/crm/contacts` | `/api/v1/tenants/csm/contacts` |
| 계정 | `/api/v1/tenants/finance/accounts` | `/api/v1/tenants/fim/accounts` |
| 거래 | `/api/v1/tenants/finance/transactions` | `/api/v1/tenants/fim/transactions` |
| 제품 | `/api/v1/tenants/inventory/products` | `/api/v1/tenants/ivm/products` |
| 창고 | `/api/v1/tenants/inventory/warehouses` | `/api/v1/tenants/ivm/warehouses` |
| 발주 | `/api/v1/tenants/procurement/purchase-orders` | `/api/v1/tenants/psm/purchase-orders` |
| 판매주문 | `/api/v1/tenants/sales/sales-orders` | `/api/v1/tenants/srm/sales-orders` |
| 워크플로우 | `/api/v1/tenants/workflow/workflows` | `/api/v1/tenants/lwm/workflows` |

## 장점

1. **일관성**: 모든 경로가 스키마 약어를 사용하여 일관된 패턴 유지
2. **간결성**: 긴 단어 대신 약어 사용으로 URL 길이 단축
3. **명확성**: 시스템 > 스키마 > 엔티티 계층이 명확함
4. **문서화**: Swagger에서 스키마별로 그룹화되어 탐색이 용이
5. **확장성**: 새로운 스키마 추가 시 동일한 패턴 적용 가능

## 하위 호환성

이 변경은 **Breaking Change**입니다. 기존 클라이언트는 새로운 경로로 업데이트해야 합니다.

### 마이그레이션 체크리스트

- [ ] 프론트엔드 API 클라이언트 업데이트
- [ ] 모바일 앱 API 엔드포인트 변경
- [ ] 외부 통합 웹훅 URL 업데이트
- [ ] API 문서 및 예제 코드 업데이트
- [ ] 테스트 코드의 URL 수정
- [ ] Postman/Insomnia 컬렉션 업데이트

## 테스트 방법

1. 백엔드 서버 시작:
   ```bash
   cd apps/backend-api
   source .venv/bin/activate
   uvicorn src.main:app --reload --port 8100
   ```

2. Swagger 문서 확인:
   ```
   http://localhost:8100/docs
   ```

3. 새로운 경로 테스트:
   ```bash
   # 헬스체크
   curl http://localhost:8100/health
   
   # 로그인 (예시)
   curl -X POST http://localhost:8100/api/v1/manager/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username": "admin", "password": "admin123"}'
   ```

## 다음 단계

1. 프론트엔드 팀에 API 변경사항 공유
2. 통합 테스트 실행
3. 스테이징 환경에 배포 및 검증
4. 프로덕션 배포 계획 수립

## 참고 문서

- [API 라우팅 구조](../backend-api/docs/API_ROUTING.md)
- [스키마 약어 참조](../../docs/guides/05-NAMING-CONVENTIONS.md)
- [API 명세](../../docs/guides/09-API-SPECIFICATION.md)
