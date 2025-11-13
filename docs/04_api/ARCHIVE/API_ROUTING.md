# API 라우팅 구조

## 개요

CXG Platform API는 시스템과 스키마 단위로 구조화된 RESTful API를 제공합니다.

## 라우팅 패턴

### 기본 패턴
```
/api/v1/{system}/{schema}/{entity}
```

- **system**: `manager` (관리자 시스템) 또는 `tenants` (테넌트 시스템)
- **schema**: 데이터베이스 스키마 약어 (bill, idam, csm 등)
- **entity**: 리소스 엔티티 (invoices, users, customers 등)

## 관리자 시스템 (Manager)

### 경로 예시

| 스키마 | 설명 | 경로 예시 |
|--------|------|-----------|
| **auth** | 인증 | `/api/v1/manager/auth/login` |
| **idam** | Identity & Access Management | `/api/v1/manager/idam/users` |
| **tnnt** | Tenant Management | `/api/v1/manager/tnnt/tenants` |
| **bill** | Billing | `/api/v1/manager/bill/invoices` |
| **ifra** | Infrastructure | `/api/v1/manager/ifra/resources` |
| **mntr** | Monitoring | `/api/v1/manager/mntr/system-metrics` |
| **audt** | Audit | `/api/v1/manager/audt/audit-logs` |
| **bkup** | Backup | `/api/v1/manager/bkup/schedules` |
| **cnfg** | Configuration | `/api/v1/manager/cnfg/configurations` |
| **intg** | Integration | `/api/v1/manager/intg/apis` |
| **noti** | Notification | `/api/v1/manager/noti/notifications` |
| **supt** | Support | `/api/v1/manager/supt/tickets` |
| **stat** | Statistics | `/api/v1/manager/stat/usage-stats` |
| **auto** | Automation | `/api/v1/manager/auto/workflows` |

### 스키마별 상세 경로

#### IDAM (Identity & Access Management)
- `/api/v1/manager/idam/users`
- `/api/v1/manager/idam/roles`
- `/api/v1/manager/idam/permissions`
- `/api/v1/manager/idam/user-roles`
- `/api/v1/manager/idam/role-permissions`
- `/api/v1/manager/idam/sessions`
- `/api/v1/manager/idam/login-logs`
- `/api/v1/manager/idam/api-keys`

#### BILL (Billing)
- `/api/v1/manager/bill/plans`
- `/api/v1/manager/bill/invoices`
- `/api/v1/manager/bill/transactions`

#### TNNT (Tenant Management)
- `/api/v1/manager/tnnt/tenants`
- `/api/v1/manager/tnnt/subscriptions`

## 테넌트 시스템 (Tenants)

### 경로 예시

| 스키마 | 설명 | 경로 예시 |
|--------|------|-----------|
| **adm** | Administration | `/api/v1/tenants/adm/users` |
| **csm** | Customer/CRM | `/api/v1/tenants/csm/customers` |
| **fim** | Finance | `/api/v1/tenants/fim/accounts` |
| **ivm** | Inventory | `/api/v1/tenants/ivm/products` |
| **psm** | Procurement | `/api/v1/tenants/psm/purchase-orders` |
| **srm** | Sales | `/api/v1/tenants/srm/sales-orders` |
| **lwm** | Workflow | `/api/v1/tenants/lwm/workflows` |

### 스키마별 상세 경로

#### CSM (Customer/CRM)
- `/api/v1/tenants/csm/customers`
- `/api/v1/tenants/csm/contacts`
- `/api/v1/tenants/csm/opportunities`
- `/api/v1/tenants/csm/activities`

#### FIM (Finance)
- `/api/v1/tenants/fim/accounts`
- `/api/v1/tenants/fim/transactions`
- `/api/v1/tenants/fim/budgets`
- `/api/v1/tenants/fim/invoices`

#### IVM (Inventory)
- `/api/v1/tenants/ivm/products`
- `/api/v1/tenants/ivm/warehouses`
- `/api/v1/tenants/ivm/stock-movements`
- `/api/v1/tenants/ivm/adjustments`

#### PSM (Procurement)
- `/api/v1/tenants/psm/purchase-orders`
- `/api/v1/tenants/psm/vendors`
- `/api/v1/tenants/psm/requisitions`
- `/api/v1/tenants/psm/receiving`

#### SRM (Sales)
- `/api/v1/tenants/srm/sales-orders`
- `/api/v1/tenants/srm/quotes`
- `/api/v1/tenants/srm/customers`
- `/api/v1/tenants/srm/sales-activities`

#### LWM (Workflow)
- `/api/v1/tenants/lwm/workflows`
- `/api/v1/tenants/lwm/approvals`
- `/api/v1/tenants/lwm/tasks`
- `/api/v1/tenants/lwm/steps`

## Swagger 문서 그룹화

Swagger UI에서 API는 **시스템 > 스키마 > 엔티티** 3단계 계층으로 그룹화됩니다.

### 그룹화 예시

```
Manager > BILL > Plans
Manager > BILL > Invoices
Manager > BILL > Transactions

Tenant > CSM > Customers
Tenant > CSM > Contacts
Tenant > CSM > Opportunities
Tenant > CSM > Activities
```

### 관리자 시스템 (56개 엔티티)
- **Manager > Auth** (1): Auth
- **Manager > IDAM** (8): Users, Roles, Permissions, User Roles, Role Permissions, Sessions, Login Logs, API Keys
- **Manager > TNNT** (2): Tenants, Subscriptions
- **Manager > BILL** (3): Plans, Invoices, Transactions
- **Manager > IFRA** (2): Resources, Resource Usages
- **Manager > MNTR** (3): System Metrics, Health Checks, Incidents
- **Manager > AUDT** (3): Audit Logs, Policies, Compliances
- **Manager > BKUP** (3): Schedules, Executions, Recovery Plans
- **Manager > CNFG** (4): Configurations, Feature Flags, Tenant Features, Service Quotas
- **Manager > INTG** (3): APIs, Webhooks, Rate Limits
- **Manager > NOTI** (3): Notifications, Templates, Campaigns
- **Manager > SUPT** (3): Tickets, Ticket Comments, Feedbacks
- **Manager > STAT** (2): Usage Stats, Tenant Stats
- **Manager > AUTO** (3): Workflows, Tasks, Executions

### 테넌트 시스템 (24개 엔티티)
- **Tenant > ADM** (1): Users
- **Tenant > CSM** (4): Customers, Contacts, Opportunities, Activities
- **Tenant > FIM** (4): Accounts, Transactions, Budgets, Invoices
- **Tenant > IVM** (4): Products, Warehouses, Stock Movements, Adjustments
- **Tenant > PSM** (4): Purchase Orders, Vendors, Requisitions, Receiving
- **Tenant > SRM** (4): Sales Orders, Quotes, Customers, Sales Activities
- **Tenant > LWM** (4): Workflows, Approvals, Tasks, Steps

**총 71개 태그** (기본 1 + Manager 56 + Tenant 24)

## 스키마 약어 참조

### 관리자 시스템
- `audt` - Audit (감사)
- `auto` - Automation (자동화)
- `bill` - Billing (청구)
- `bkup` - Backup (백업)
- `cnfg` - Configuration (설정)
- `idam` - Identity & Access Management (인증/권한)
- `ifra` - Infrastructure (인프라)
- `intg` - Integration (통합)
- `mntr` - Monitoring (모니터링)
- `noti` - Notification (알림)
- `stat` - Statistics (통계)
- `supt` - Support (지원)
- `tnnt` - Tenant (테넌트)

### 테넌트 시스템
- `adm` - Administration (관리)
- `csm` - Customer/CRM (고객관계관리)
- `fim` - Finance (재무)
- `ivm` - Inventory (재고)
- `lwm` - Workflow (워크플로우)
- `psm` - Procurement (구매)
- `srm` - Sales (판매)

## 예시 요청

### 관리자 시스템

```bash
# 로그인
POST /api/v1/manager/auth/login

# 청구서 목록 조회
GET /api/v1/manager/bill/invoices

# 테넌트 생성
POST /api/v1/manager/tnnt/tenants

# 사용자 목록 조회
GET /api/v1/manager/idam/users
```

### 테넌트 시스템

```bash
# 고객 목록 조회
GET /api/v1/tenants/csm/customers

# 재무 계정 생성
POST /api/v1/tenants/fim/accounts

# 판매 주문 조회
GET /api/v1/tenants/srm/sales-orders

# 재고 제품 목록
GET /api/v1/tenants/ivm/products
```

## 마이그레이션 가이드

### 변경 전 → 변경 후

#### 관리자 시스템
- `/api/v1/manager/billing/invoices` → `/api/v1/manager/bill/invoices`
- `/api/v1/manager/tenants` → `/api/v1/manager/tnnt/tenants`
- `/api/v1/manager/monitoring/metrics` → `/api/v1/manager/mntr/system-metrics`
- `/api/v1/manager/infrastructure/resources` → `/api/v1/manager/ifra/resources`
- `/api/v1/manager/audit/logs` → `/api/v1/manager/audt/audit-logs`

#### 테넌트 시스템
- `/api/v1/tenants/crm/customers` → `/api/v1/tenants/csm/customers`
- `/api/v1/tenants/finance/accounts` → `/api/v1/tenants/fim/accounts`
- `/api/v1/tenants/inventory/products` → `/api/v1/tenants/ivm/products`
- `/api/v1/tenants/procurement/purchase-orders` → `/api/v1/tenants/psm/purchase-orders`
- `/api/v1/tenants/sales/sales-orders` → `/api/v1/tenants/srm/sales-orders`
- `/api/v1/tenants/workflow/workflows` → `/api/v1/tenants/lwm/workflows`

## 문서

- Swagger UI: `http://localhost:8100/docs`
- ReDoc: `http://localhost:8100/redoc`
