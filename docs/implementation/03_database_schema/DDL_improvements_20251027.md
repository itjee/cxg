# ConexGrow DDL (Data Definition Language) 개선 가이드

**작성일**: 2025-10-27
**작성자**: Claude Code DDL 분석 시스템
**문서 버전**: v1.0
**범위**: Manager DB + Tenant DB 전체 스키마

---

## 📋 목차

1. [DDL 개선 개요](#ddl-개선-개요)
2. [핵심 개선 원칙](#핵심-개선-원칙)
3. [Manager DB 개선사항](#manager-db-개선사항)
4. [Tenant DB 개선사항](#tenant-db-개선사항)
5. [컬럼명 정규화 가이드](#컬럼명-정규화-가이드)
6. [마이그레이션 스크립트](#마이그레이션-스크립트)
7. [수정된 테이블 전체 리스트](#수정된-테이블-전체-리스트)

---

## DDL 개선 개요

### 현황 분석

```
분석 대상:
├─ Manager DB: 13개 스키마, ~45개 테이블
└─ Tenant DB: 16개 모듈, ~150개 테이블

발견된 이슈 (우선순위별):
┌──────────────────────────────────────────────────────┐
│ P0 (긴급)                                            │
├──────────────────────────────────────────────────────┤
│ 1. 컬럼명 불일치: role_code, permission_code 등    │
│ 2. 누락 컬럼: variant_id in inventory_balances       │
│ 3. 데이터 타입 일관성: VARCHAR 길이 정의 불명확    │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ P1 (높음)                                            │
├──────────────────────────────────────────────────────┤
│ 1. 인덱스 최적화: 부분 인덱스 추가                   │
│ 2. 외래키 관계: 누락된 FK 추가                       │
│ 3. 감사 필드: is_deleted vs deleted 혼용            │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ P2 (중간)                                            │
├──────────────────────────────────────────────────────┤
│ 1. CHECK 제약: 추가 검증 조건                        │
│ 2. 테이블 구조: 논리적 재정리                        │
│ 3. 주석: 불완전한 COMMENT 추가                      │
└──────────────────────────────────────────────────────┘
```

### 개선 영향도

```
총 수정 테이블: 45개
├─ Manager DB: 18개
└─ Tenant DB: 27개

수정 내용:
├─ 컬럼 추가: 12개
├─ 컬럼 수정: 18개  (이름, 타입, 제약)
├─ 컬럼 제거: 4개   (중복)
├─ 인덱스 추가: 16개
├─ 인덱스 수정: 8개
├─ FK 추가: 6개
└─ 새 테이블: 3개
```

---

## 핵심 개선 원칙

### 1. 컬럼명 정규화

**원칙**: 테이블 이름이 컨텍스트를 제공하므로, 컬럼명은 짧게

```sql
-- ❌ 현재 (불필요한 반복)
idam.roles.role_code
idam.roles.role_name
idam.roles.role_type
idam.roles.role_status

idam.permissions.permission_code
idam.permissions.permission_name

sys.roles.code         -- 혼합
sys.permissions.code   -- 혼합

-- ✅ 개선 (일관성)
idam.roles.code        -- 테이블명 'roles'가 이미 컨텍스트 제공
idam.roles.name
idam.roles.type
idam.roles.status

idam.permissions.code
idam.permissions.name

sys.roles.code         -- 일관적
sys.permissions.code   -- 일관적
```

**상황별 가이드**:

| 상황 | 규칙 | 예시 |
|------|------|------|
| **마스터 테이블** | `code` + `name` | product.code, product.name |
| **구분자** | `type`, `status`, `kind` | user.type, order.status |
| **참조 ID** | `{table}_id` | customer_id, warehouse_id |
| **시간** | `{event}_at`, `{event}_by` | created_at, approved_by |
| **수량/금액** | `{metric}_{unit}` | on_hand_qty, avg_cost |

### 2. 감시 필드 표준화

**Manager DB 표준**:
```sql
created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
created_by    UUID
updated_at    TIMESTAMP WITH TIME ZONE
updated_by    UUID
deleted       BOOLEAN NOT NULL DEFAULT FALSE
```

**Tenant DB 표준** (더 간단):
```sql
created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
created_by    UUID
updated_at    TIMESTAMP WITH TIME ZONE
updated_by    UUID
is_deleted    BOOLEAN NOT NULL DEFAULT FALSE  -- 명확성
```

**통일 방향**: `deleted` → `is_deleted` (Tenant DB 기준)

### 3. 데이터 타입 표준화

```sql
-- 비즈니스 코드 (짧은 코드)
code            VARCHAR(50)      -- 예: ADMIN, PSM, SKU-001

-- 이름/표시명
name            VARCHAR(200)     -- 예: 관리자, 구매 관리, 상품명

-- 설명/설명문
description     TEXT             -- 여러 줄 허용

-- 금액/비용
amount          NUMERIC(18,4)    -- 18자리 정수, 4자리 소수
cost            NUMERIC(18,4)
price           NUMERIC(18,4)

-- 통화
currency        CHAR(3)          -- ISO 4217 (USD, KRW, JPY)

-- 상태/상태값
status          VARCHAR(50)      -- 상태 목록: ACTIVE, DRAFT, COMPLETED

-- 수량
qty             INTEGER          -- 정수, 음수 불가
quantity        INTEGER

-- 열거형
type            VARCHAR(50)      -- 타입 목록: CUSTOMER, SUPPLIER, BOTH

-- 긴 텍스트
content         TEXT             -- 여러 줄, 제약 없음
notes           TEXT

-- 제약 기간
is_active       BOOLEAN          -- 활성 여부
is_system       BOOLEAN          -- 시스템 기본 데이터 여부
```

### 4. 외래키 관계 원칙

```sql
-- CASCADE: 부모 삭제 → 자식 삭제 (의미상 종속)
FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE

-- RESTRICT: 부모 참조하는 자식 있으면 부모 삭제 불가
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT

-- SET NULL: 부모 삭제 → 자식의 FK는 NULL (선택적 참조)
FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
```

**선택 기준**:
- CASCADE: 라인 항목 (자체로 의미 없음)
- RESTRICT: 마스터 데이터 (참조하는 거래 많음)
- SET NULL: 선택적 참조 (승인자, 담당자 등)

### 5. 인덱스 최적화 원칙

```sql
-- 부분 인덱스: 소프트 삭제된 레코드 제외
CREATE INDEX ix_roles__status
    ON roles (status)
 WHERE is_deleted = false;

-- 복합 인덱스: 자주 함께 조회되는 컬럼
CREATE INDEX ix_orders__customer_status
    ON orders (customer_id, status, created_at DESC)
 WHERE is_deleted = false;

-- 유니크 인덱스: 비즈니스 키
CREATE UNIQUE INDEX ux_products__code
    ON products (code)
 WHERE is_deleted = false;

-- GIN 인덱스: JSONB 필드
CREATE INDEX ix_logs__extra_data
    ON audit_logs USING GIN (extra_data);
```

---

## Manager DB 개선사항

### 01_TNNT (테넌트 관리)

#### `tenants` 테이블 개선

**변경 내용**:

```sql
-- 추가 컬럼
│ ├─ deleted → is_deleted (일관성)
│ ├─ is_suspended (일시 중단 상태)
│ └─ suspended_reason (중단 사유)
│
-- 수정 컬럼
│ └─ max_users: INTEGER → max_users: INTEGER (유지, 검증 추가)
│
-- 삭제 컬럼
│ └─ (없음)
│
-- 인덱스 추가
│ ├─ (tenant_code, is_deleted)
│ └─ (status, created_at DESC)
```

**마이그레이션 SQL**:

```sql
-- 1. 컬럼 수정 및 추가
ALTER TABLE tnnt.tenants
    RENAME COLUMN deleted TO is_deleted;

ALTER TABLE tnnt.tenants
    ADD COLUMN is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN suspended_reason TEXT,
    ADD COLUMN suspension_date TIMESTAMP WITH TIME ZONE;

-- 2. CHECK 제약 추가
ALTER TABLE tnnt.tenants
    ADD CONSTRAINT ck_tenants__max_users
        CHECK (max_users > 0);

-- 3. 인덱스 추가
CREATE INDEX ix_tenants__status_created
    ON tnnt.tenants (status, created_at DESC)
 WHERE is_deleted = false;

-- 4. 주석 업데이트
COMMENT ON COLUMN tnnt.tenants.is_deleted IS '논리 삭제 플래그';
COMMENT ON COLUMN tnnt.tenants.is_suspended IS '테넌트 일시 중단 상태';
```

### 02_IDAM (인증/권한)

#### `roles` 테이블 개선

**현재**:
```sql
role_code    VARCHAR(100)
role_name    VARCHAR(100)
role_type    VARCHAR(50)
scope        VARCHAR(20)
is_default   BOOLEAN
priority     INTEGER
status       VARCHAR(20)
```

**개선 방향**:
```sql
-- 컬럼명 정규화: role_code → code
code         VARCHAR(100)   -- 대소문자 혼합, 의미 있는 코드
name         VARCHAR(100)   -- 표시명
type         VARCHAR(50)    -- 역할 타입
scope        VARCHAR(20)    -- 범위 (유지)
is_default   BOOLEAN        -- 기본 역할 여부 (유지)
priority     INTEGER        -- 우선순위 (유지)
status       VARCHAR(20)    -- 상태 (유지)

-- 추가: 감시 필드
deleted      BOOLEAN        -- 소프트 삭제 (추가)
```

**마이그레이션 SQL**:

```sql
-- 1. 컬럼명 변경
ALTER TABLE idam.roles
    RENAME COLUMN role_code TO code;

ALTER TABLE idam.roles
    RENAME COLUMN role_name TO name;

ALTER TABLE idam.roles
    RENAME COLUMN role_type TO type;

-- 2. 감사 필드 추가
ALTER TABLE idam.roles
    ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT FALSE;

-- 3. 유니크 제약 수정
DROP INDEX IF EXISTS uk_roles__role_code;
CREATE UNIQUE INDEX ux_roles__code
    ON idam.roles (code)
 WHERE deleted = false;

-- 4. 기타 인덱스 수정
DROP INDEX IF EXISTS ix_roles__role_type;
CREATE INDEX ix_roles__type
    ON idam.roles (type)
 WHERE deleted = false;

-- 5. 주석 업데이트
COMMENT ON COLUMN idam.roles.code IS '역할 코드 (super_admin, tenant_admin, support)';
COMMENT ON COLUMN idam.roles.name IS '역할 명칭';
COMMENT ON COLUMN idam.roles.type IS '역할 타입';
COMMENT ON COLUMN idam.roles.deleted IS '논리 삭제 플래그';
```

#### `permissions` 테이블 개선

**현재**:
```sql
permission_code     VARCHAR(100)   NOT NULL
permission_name     VARCHAR(100)   NOT NULL
category            VARCHAR(50)    NOT NULL
resource_type       VARCHAR(50)    NOT NULL
action              VARCHAR(50)    NOT NULL
```

**개선**:
```sql
-- 컬럼명 정규화
code                VARCHAR(100)   -- permission_code → code
name                VARCHAR(100)   -- permission_name → name

-- 개선: 더 명확한 컬럼명
category            VARCHAR(50)    -- 유지 (tenant, system, billing, monitoring)
resource            VARCHAR(50)    -- resource_type → resource (간단)
action              VARCHAR(50)    -- 유지

-- 추가: 설정
is_hidden           BOOLEAN        -- UI에서 숨김 여부
deleted             BOOLEAN        -- 소프트 삭제
```

**마이그레이션 SQL**:

```sql
-- 1. 컬럼명 변경
ALTER TABLE idam.permissions
    RENAME COLUMN permission_code TO code;

ALTER TABLE idam.permissions
    RENAME COLUMN permission_name TO name;

ALTER TABLE idam.permissions
    RENAME COLUMN resource_type TO resource;

-- 2. 컬럼 추가
ALTER TABLE idam.permissions
    ADD COLUMN is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT FALSE;

-- 3. 유니크 제약 수정
DROP INDEX IF EXISTS uk_permissions__permission_code;
CREATE UNIQUE INDEX ux_permissions__code
    ON idam.permissions (code)
 WHERE deleted = false;

-- 4. 기존 인덱스 수정
DROP INDEX IF EXISTS ix_permissions__permission_code;
CREATE INDEX ix_permissions__code
    ON idam.permissions (code)
 WHERE deleted = false;

DROP INDEX IF EXISTS ix_permissions__resource_type;
CREATE INDEX ix_permissions__resource
    ON idam.permissions (resource)
 WHERE deleted = false;

-- 5. 새 인덱스 추가
CREATE INDEX ix_permissions__category_action_code
    ON idam.permissions (category, action, code)
 WHERE deleted = false;

-- 6. 주석 업데이트
COMMENT ON COLUMN idam.permissions.code IS '권한 코드';
COMMENT ON COLUMN idam.permissions.name IS '권한 명칭';
COMMENT ON COLUMN idam.permissions.resource IS '리소스 타입';
COMMENT ON COLUMN idam.permissions.is_hidden IS 'UI에서 숨김 여부';
COMMENT ON COLUMN idam.permissions.deleted IS '논리 삭제 플래그';
```

### 03_BILL (요금/청구)

#### `invoices` 테이블 개선

**현재 상태**: 기본 구조 양호, 소폭 개선

**개선 사항**:

```sql
-- 추가 컬럼
│ ├─ invoice_number: VARCHAR(50) (UNIQUE, 비즈니스 키)
│ ├─ due_date: 명시적 추가
│ ├─ paid_date: TIMESTAMP (실제 결제일)
│ └─ payment_method: VARCHAR(50) (결제 수단)
│
-- 수정
│ └─ amount_due: NUMERIC(18,4) vs amount: NUMERIC(18,4) 정리
│
-- 인덱스
│ ├─ (tenant_id, status, due_date)
│ └─ (invoice_number)
```

---

## Tenant DB 개선사항

### 01_ADM (관리)

#### `glossary` 테이블 개선

**현재**: 구조 양호

**개선**:

```sql
-- 추가
│ ├─ category: VARCHAR(50) (용어 분류)
│ └─ usage_count: INTEGER (사용 빈도, 캐시)
│
-- 수정
│ └─ tags TEXT[] → tags: VARCHAR(500) (JSON 문자열로 변경, 인덱싱 용이)
```

### 02_HRM (인사)

#### `employees` 테이블 개선

**변경 내용**:

```sql
-- 추가 컬럼
│ ├─ id_number_encrypted: BYTEA (개인정보 보호)
│ ├─ phone_encrypted: BYTEA
│ ├─ email_hash: VARCHAR(255) (조회용 해시)
│ ├─ employee_status: VARCHAR(50) (ACTIVE, INACTIVE, RETIRED, ON_LEAVE)
│ └─ retirement_date: DATE
│
-- 수정
│ ├─ job_title: VARCHAR(100) → job_title: VARCHAR(100) (유지)
│ ├─ salary_level: VARCHAR(50) 추가
│ └─ is_deleted → is_deleted 명확히
│
-- 제거
│ └─ encrypted 필드명 모호한 경우
│
-- 인덱스
│ ├─ (department_id, employee_status, is_deleted)
│ ├─ (email_hash)
│ └─ (code) (직원 코드)
```

**마이그레이션 SQL**:

```sql
-- 1. 암호화 필드 추가
ALTER TABLE hrm.employees
    ADD COLUMN id_number_encrypted BYTEA,
    ADD COLUMN phone_encrypted BYTEA,
    ADD COLUMN email_hash VARCHAR(255);

-- 2. 상태 필드 추가
ALTER TABLE hrm.employees
    ADD COLUMN employee_status VARCHAR(50) DEFAULT 'ACTIVE',
    ADD COLUMN retirement_date DATE;

-- 3. CHECK 제약 추가
ALTER TABLE hrm.employees
    ADD CONSTRAINT ck_employees__status CHECK (
        employee_status IN ('ACTIVE', 'INACTIVE', 'RETIRED', 'ON_LEAVE', 'TERMINATED')
    );

-- 4. 인덱스 추가
CREATE INDEX ix_employees__department_status
    ON hrm.employees (department_id, employee_status)
 WHERE is_deleted = false;

CREATE INDEX ix_employees__email_hash
    ON hrm.employees (email_hash)
 WHERE is_deleted = false;

-- 5. 기존 데이터 암호화 (별도 배치)
-- UPDATE hrm.employees
-- SET id_number_encrypted = pgp_sym_encrypt(id_number, current_setting('app.encryption_key'))
-- WHERE id_number IS NOT NULL;
```

### 10_IVM (재고)

#### `inventory_balances` 테이블 개선 (P0 긴급)

**문제**: 제품 변형(variant) 지원 부재

**현재 구조**:
```sql
warehouse_id    UUID    NOT NULL
location_id     UUID
product_id      UUID    NOT NULL
lot_number      VARCHAR(100)
serial_number   VARCHAR(100)
```

**개선 구조**:
```sql
warehouse_id    UUID    NOT NULL
location_id     UUID
product_id      UUID    NOT NULL
variant_id      UUID                -- ⭐ 추가 (변형 지원)
lot_number      VARCHAR(100)
serial_number   VARCHAR(100)
```

**마이그레이션 SQL**:

```sql
-- 1. 컬럼 추가
ALTER TABLE ivm.inventory_balances
    ADD COLUMN variant_id UUID;

-- 2. 외래키 추가
ALTER TABLE ivm.inventory_balances
    ADD CONSTRAINT fk_inventory_balances__variant_id
        FOREIGN KEY (variant_id) REFERENCES pim.product_variants(id)
        ON DELETE RESTRICT;

-- 3. 유니크 인덱스 수정
DROP INDEX IF EXISTS ux_inventory_balances__item_location;

CREATE UNIQUE INDEX ux_inventory_balances__item_location
    ON ivm.inventory_balances (
        warehouse_id,
        product_id,
        COALESCE(variant_id::TEXT, ''),
        COALESCE(lot_number, ''),
        COALESCE(serial_number, '')
    );

-- 4. 일반 인덱스 추가
CREATE INDEX ix_inventory_balances__variant_id
    ON ivm.inventory_balances (variant_id)
 WHERE variant_id IS NOT NULL AND available_qty > 0;

-- 5. 주석 추가
COMMENT ON COLUMN ivm.inventory_balances.variant_id IS
    '제품 변형 식별자 - 옵션 조합별 재고 추적 (NULL: 변형 없는 제품)';
```

### 14_FIM (재무)

#### `journal_entries` 테이블 개선

**개선 사항**:

```sql
-- 추가 컬럼
│ ├─ is_locked: BOOLEAN (posting 후 수정 불가)
│ ├─ posted_at: TIMESTAMP (결산 확정 일시)
│ ├─ reference_doc_type: VARCHAR(50) (원본 문서 타입)
│ ├─ reference_doc_id: UUID (원본 문서 ID)
│ └─ memo: TEXT (비고)
│
-- 수정
│ └─ status: DRAFT, POSTED, REVERSED, CANCELLED (명확화)
│
-- CHECK 추가
│ ├─ total_debit = total_credit 검증
│ └─ post_date >= entry_date
```

**마이그레이션 SQL**:

```sql
-- 1. 컬럼 추가
ALTER TABLE fim.journal_entries
    ADD COLUMN is_locked BOOLEAN DEFAULT FALSE,
    ADD COLUMN posted_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN reference_doc_type VARCHAR(50),
    ADD COLUMN reference_doc_id UUID,
    ADD COLUMN memo TEXT;

-- 2. CHECK 제약 강화
ALTER TABLE fim.journal_entries
    ADD CONSTRAINT ck_je__total_balance CHECK (total_debit = total_credit),
    ADD CONSTRAINT ck_je__post_date CHECK (post_date >= entry_date);

-- 3. 인덱스 추가
CREATE INDEX ix_journal_entries__posted_date
    ON fim.journal_entries (posted_at DESC)
 WHERE status = 'POSTED';

CREATE INDEX ix_journal_entries__reference
    ON fim.journal_entries (reference_doc_type, reference_doc_id)
 WHERE reference_doc_id IS NOT NULL;

-- 4. 주석 추가
COMMENT ON COLUMN fim.journal_entries.is_locked IS '결산 후 수정 불가 플래그';
COMMENT ON COLUMN fim.journal_entries.posted_at IS '결산 확정 일시';
COMMENT ON COLUMN fim.journal_entries.reference_doc_type IS '원본 문서 타입';
COMMENT ON COLUMN fim.journal_entries.reference_doc_id IS '원본 문서 ID';
COMMENT ON COLUMN fim.journal_entries.memo IS '비고';
```

### 22_SYS (시스템)

#### `users` 테이블 개선

**변경 내용**:

```sql
-- 추가 컬럼 (현재 누락)
│ ├─ created_by: UUID (누락)
│ ├─ is_system_user: BOOLEAN (시스템 사용자 여부)
│ ├─ last_login_at: TIMESTAMP (마지막 로그인)
│ ├─ last_login_ip: INET (마지막 로그인 IP)
│ └─ failed_login_attempts: INTEGER (실패 횟수)
│
-- 수정
│ ├─ is_deleted 명확화
│ └─ 기존 필드 유지
│
-- 인덱스
│ ├─ (email)
│ └─ (last_login_at DESC)
```

**마이그레이션 SQL**:

```sql
-- 1. created_by 컬럼 추가 (감시 필드)
ALTER TABLE sys.users
    ADD COLUMN created_by UUID;

-- 2. 추가 메타데이터
ALTER TABLE sys.users
    ADD COLUMN is_system_user BOOLEAN DEFAULT FALSE,
    ADD COLUMN last_login_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN last_login_ip INET,
    ADD COLUMN failed_login_attempts INTEGER DEFAULT 0;

-- 3. 인덱스 추가
CREATE INDEX ix_users__email
    ON sys.users (email)
 WHERE is_deleted = false;

CREATE INDEX ix_users__last_login
    ON sys.users (last_login_at DESC)
 WHERE is_deleted = false;

-- 4. 주석 업데이트
COMMENT ON COLUMN sys.users.created_by IS '사용자 생성자 UUID';
COMMENT ON COLUMN sys.users.is_system_user IS '시스템 자동 생성 사용자 여부';
COMMENT ON COLUMN sys.users.last_login_at IS '마지막 로그인 일시';
COMMENT ON COLUMN sys.users.last_login_ip IS '마지막 로그인 IP 주소';
COMMENT ON COLUMN sys.users.failed_login_attempts IS '실패한 로그인 시도 횟수';
```

#### `roles` 테이블 (Tenant DB) 개선

**현재 구조** (이미 개선됨):
```sql
code      VARCHAR(50)    ✅ 올바름
name      VARCHAR(100)   ✅ 올바름
```

**추가 개선**:

```sql
-- 추가 컬럼
│ └─ is_system: BOOLEAN (시스템 기본 역할)
│
-- 인덱스
│ └─ 복합 인덱스 추가
```

#### `permissions` 테이블 (Tenant DB) 개선

**현재 구조** (이미 개선됨):
```sql
code          VARCHAR(100)    ✅ 올바름
name          VARCHAR(200)    ✅ 올바름
module_code   VARCHAR(50)     ✅ 올바름
resource      VARCHAR(100)    ✅ 올바름
action        VARCHAR(50)     ✅ 올바름
```

**추가 개선**:

```sql
-- 추가 컬럼
│ ├─ is_active: BOOLEAN (활성 여부) - 이미 있음 ✅
│ └─ description: TEXT (권한 설명) - 확인 필요
│
-- 인덱스
│ └─ (module_code, resource, action)
```

---

## 컬럼명 정규화 가이드

### Manager DB 컬럼명 규칙

```sql
-- ❌ 현재 (중복)              ✅ 개선 (권장)
idam.roles.role_code    →    idam.roles.code
idam.roles.role_name    →    idam.roles.name
idam.roles.role_type    →    idam.roles.type

idam.permissions.permission_code    →    idam.permissions.code
idam.permissions.permission_name    →    idam.permissions.name

idam.users.user_id      →    idam.users.id (이미 올바름)

-- 테이블명이 컨텍스트 제공하므로 반복 제거
```

### Tenant DB 컬럼명 규칙 (이미 준수)

```sql
-- ✅ 현재 (올바름)
sys.roles.code              -- 테이블명이 이미 'roles'
sys.permissions.code        -- 테이블명이 이미 'permissions'
hrm.departments.code
crm.partners.code
pim.products.code
```

### 컬럼명 스타일 가이드

```
식별자:
    code          VARCHAR(50)      비즈니스 코드 (마스터 테이블)
    id            UUID             기술 식별자
    {table}_id    UUID             외래키

표시명:
    name          VARCHAR(200)     이름
    title         VARCHAR(200)     제목
    label         VARCHAR(100)     레이블

설명:
    description   TEXT             상세 설명
    notes         TEXT             비고
    memo          TEXT             메모
    reason        TEXT             사유

시간:
    {event}_at    TIMESTAMP        이벤트 발생 시간
    {event}_by    UUID             이벤트 발생자

상태:
    status        VARCHAR(50)      상태값 (ACTIVE, DRAFT 등)
    type          VARCHAR(50)      분류 (고객, 공급업체 등)
    is_{attr}     BOOLEAN          속성 여부

수량/금액:
    qty           INTEGER          수량
    amount        NUMERIC(18,4)    금액
    cost          NUMERIC(18,4)    원가
    price         NUMERIC(18,4)    가격
    rate          NUMERIC(18,4)    비율/환율

기타:
    currency      CHAR(3)          통화 코드 (USD, KRW)
    country_code  CHAR(2)          국가 코드 (KR, US)
    email         VARCHAR(255)     이메일
    phone         VARCHAR(20)      전화번호
    address       TEXT             주소
    url           VARCHAR(500)     URL
    json_data     JSONB            JSON 데이터
```

---

## 마이그레이션 스크립트

### Phase 1: Manager DB 긴급 마이그레이션

```sql
-- /scripts/migration_phase1_manager_db_20251027.sql

BEGIN TRANSACTION;

-- 1. IDAM.ROLES 개선
ALTER TABLE idam.roles
    RENAME COLUMN role_code TO code;

ALTER TABLE idam.roles
    RENAME COLUMN role_name TO name;

ALTER TABLE idam.roles
    RENAME COLUMN role_type TO type;

ALTER TABLE idam.roles
    ADD COLUMN IF NOT EXISTS deleted BOOLEAN NOT NULL DEFAULT FALSE;

-- 기존 인덱스 제거
DROP INDEX IF EXISTS uk_roles__role_code;
DROP INDEX IF EXISTS ix_roles__role_type;

-- 새 인덱스 생성
CREATE UNIQUE INDEX ux_roles__code
    ON idam.roles (code)
 WHERE deleted = false;

CREATE INDEX ix_roles__type
    ON idam.roles (type)
 WHERE deleted = false;

-- 2. IDAM.PERMISSIONS 개선
ALTER TABLE idam.permissions
    RENAME COLUMN permission_code TO code;

ALTER TABLE idam.permissions
    RENAME COLUMN permission_name TO name;

ALTER TABLE idam.permissions
    RENAME COLUMN resource_type TO resource;

ALTER TABLE idam.permissions
    ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS deleted BOOLEAN NOT NULL DEFAULT FALSE;

-- 기존 인덱스 제거
DROP INDEX IF EXISTS uk_permissions__permission_code;
DROP INDEX IF EXISTS ix_permissions__permission_code;
DROP INDEX IF EXISTS ix_permissions__resource_type;

-- 새 인덱스 생성
CREATE UNIQUE INDEX ux_permissions__code
    ON idam.permissions (code)
 WHERE deleted = false;

CREATE INDEX ix_permissions__code
    ON idam.permissions (code)
 WHERE deleted = false;

CREATE INDEX ix_permissions__resource
    ON idam.permissions (resource)
 WHERE deleted = false;

-- 3. TNNT.TENANTS 개선
ALTER TABLE tnnt.tenants
    ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS suspended_reason TEXT,
    ADD COLUMN IF NOT EXISTS suspension_date TIMESTAMP WITH TIME ZONE;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS ix_tenants__status_created
    ON tnnt.tenants (status, created_at DESC)
 WHERE is_deleted = false;

COMMIT;
```

### Phase 2: Tenant DB 긴급 마이그레이션

```sql
-- /scripts/migration_phase2_tenant_db_20251027.sql

BEGIN TRANSACTION;

-- 1. IVM.INVENTORY_BALANCES variant_id 추가 (P0 우선)
ALTER TABLE ivm.inventory_balances
    ADD COLUMN IF NOT EXISTS variant_id UUID;

-- 외래키 추가
ALTER TABLE ivm.inventory_balances
    ADD CONSTRAINT fk_inventory_balances__variant_id
        FOREIGN KEY (variant_id) REFERENCES pim.product_variants(id)
        ON DELETE RESTRICT;

-- 유니크 인덱스 재생성
DROP INDEX IF EXISTS ux_inventory_balances__item_location;

CREATE UNIQUE INDEX ux_inventory_balances__item_location
    ON ivm.inventory_balances (
        warehouse_id,
        product_id,
        COALESCE(variant_id::TEXT, ''),
        COALESCE(lot_number, ''),
        COALESCE(serial_number, '')
    );

-- 조회 인덱스 추가
CREATE INDEX IF NOT EXISTS ix_inventory_balances__variant_id
    ON ivm.inventory_balances (variant_id)
 WHERE variant_id IS NOT NULL AND available_qty > 0;

-- 2. SYS.USERS 감시 필드 추가
ALTER TABLE sys.users
    ADD COLUMN IF NOT EXISTS created_by UUID,
    ADD COLUMN IF NOT EXISTS is_system_user BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS last_login_ip INET,
    ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS ix_users__email
    ON sys.users (email)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_users__last_login
    ON sys.users (last_login_at DESC)
 WHERE is_deleted = false;

COMMIT;
```

### Phase 3: 롤백 스크립트

```sql
-- /scripts/rollback_migration_20251027.sql

BEGIN TRANSACTION;

-- Manager DB 롤백
ALTER TABLE idam.roles
    RENAME COLUMN code TO role_code;

ALTER TABLE idam.roles
    RENAME COLUMN name TO role_name;

ALTER TABLE idam.roles
    RENAME COLUMN type TO role_type;

ALTER TABLE idam.roles
    DROP COLUMN IF EXISTS deleted;

-- ... (다른 테이블도 유사하게)

COMMIT;
```

---

## 수정된 테이블 전체 리스트

### Manager DB (18개 테이블 수정)

| # | 스키마 | 테이블명 | 변경 유형 | 주요 변경사항 |
|---|--------|---------|---------|-------------|
| 1 | 01_tnnt | tenants | 컬럼 추가 | is_suspended, suspended_reason, suspension_date + 인덱스 |
| 2 | 01_tnnt | subscriptions | 컬럼 추가 | created_by, updated_by (감시 필드) |
| 3 | 02_idam | roles | 컬럼명 변경 | role_code→code, role_name→name, role_type→type, +deleted |
| 4 | 02_idam | permissions | 컬럼명 변경 | permission_code→code, permission_name→name, resource_type→resource, +is_hidden, +deleted |
| 5 | 02_idam | role_permissions | 인덱스 추가 | (role_id, permission_id) 복합 인덱스 |
| 6 | 02_idam | users | 컬럼 추가 | deleted (이미 is_deleted 있음, 통일) |
| 7 | 02_idam | sessions | 구조 검토 | 기존 구조 유지 |
| 8 | 02_idam | login_logs | 인덱스 추가 | (user_id, created_at DESC) |
| 9 | 03_bill | plans | 컬럼 추가 | created_by (감시 필드) |
| 10 | 03_bill | invoices | 컬럼 추가/수정 | invoice_number (UNIQUE), paid_date, payment_method, 인덱스 |
| 11 | 03_bill | transactions | 인덱스 추가 | (invoice_id, status, created_at) |
| 12 | 04_ifra | resources | 감시 필드 | created_by, updated_by |
| 13 | 05_stat | tenant_stats | 감시 필드 | is_deleted 추가 |
| 14 | 06_mntr | incidents | 인덱스 추가 | (tenant_id, severity, created_at DESC) |
| 15 | 09_audt | audit_logs | 파티셔닝 검토 | (논의: 월별 파티셔닝) |
| 16 | 11_cnfg | configurations | 인덱스 추가 | (key) UNIQUE |
| 17 | 12_noti | notifications | 감시 필드 | is_deleted |
| 18 | 13_bkup | executions | 인덱스 추가 | (schedule_id, created_at DESC) |

### Tenant DB (27개 테이블 수정)

| # | 모듈 | 테이블명 | 변경 유형 | 주요 변경사항 |
|---|------|---------|---------|-------------|
| 1 | 01_adm | glossary | 컬럼 추가 | category, usage_count |
| 2 | 02_hrm | employees | 컬럼 추가 | id_number_encrypted, phone_encrypted, email_hash, employee_status, retirement_date, 인덱스 |
| 3 | 02_hrm | salary_structures | 인덱스 추가 | (employee_id, effective_from DESC) |
| 4 | 03_crm | partners | 컬럼 추가 | credit_usage (캐시), credit_rating (신용등급) |
| 5 | 03_crm | partner_contacts | 인덱스 추가 | (partner_id, is_primary) |
| 6 | 04_pim | products | 컬럼 수정 | 데이터 타입 검토, 인덱스 추가 |
| 7 | 04_pim | product_variants | 인덱스 추가 | (product_id, is_active) |
| 8 | 04_pim | product_price_history | effective_from/to 추가 | 가격 이력 시간 범위 |
| 9 | 05_wms | warehouses | 인덱스 추가 | (code) UNIQUE |
| 10 | 06_apm | approval_requests | 상태 추가 | 승인 상태 머신 검증 |
| 11 | 10_ivm | inventory_balances | ⭐ variant_id 추가 | 제품 변형 지원, 유니크 인덱스 수정, FK 추가 |
| 12 | 10_ivm | inventory_movements | 인덱스 추가 | (product_id, created_at DESC) |
| 13 | 11_psm | purchase_orders | 인덱스 추가 | (supplier_id, status, created_at DESC) |
| 14 | 12_srm | sales_orders | 인덱스 추가 | (customer_id, status, created_at DESC) |
| 15 | 14_fim | journal_entries | 컬럼 추가 | is_locked, posted_at, reference_doc_type/id, memo, CHECK 제약 강화 |
| 16 | 14_fim | accounts | 인덱스 추가 | (code) UNIQUE, (account_type) |
| 17 | 14_fim | accounts_receivable | 인덱스 추가 | (customer_id, due_date) |
| 18 | 14_fim | accounts_payable | 인덱스 추가 | (supplier_id, due_date) |
| 19 | 16_lwm | workflows | 상태 관리 | status 머신 추가 |
| 20 | 20_bim | kpi_definitions | 인덱스 추가 | (module_code) |
| 21 | 22_sys | users | 컬럼 추가 | created_by, is_system_user, last_login_at/ip, failed_login_attempts, 인덱스 |
| 22 | 22_sys | roles | 인덱스 확인 | 기존 구조 양호 |
| 23 | 22_sys | permissions | 인덱스 확인 | 기존 구조 양호 |
| 24 | 22_sys | user_roles | 제약 강화 | (user_id, role_id) UNIQUE |
| 25 | 22_sys | sessions | 구조 확인 | 기본 구조 양호 (개선안 #1 완료) |
| 26 | 22_sys | role_permissions_history | ⭐ 신규 생성 | 권한 변경 이력 추적 (개선안 #2) |
| 27 | 21_com | (메시징 모듈) | TBD | 스키마 구체화 필요 |

### 신규 테이블 (3개)

| 스키마 | 테이블명 | 목적 | 상태 |
|--------|---------|------|------|
| manager/01_tnnt | data_retention_policies | 데이터 보관 정책 (개선안 #15) | 계획 |
| tenant/22_sys | role_permissions_history | 권한 변경 이력 (개선안 #2) | 계획 |
| tenant/22_sys | sessions | 테넌트 사용자 세션 (개선안 #1) | 계획 |

---

## 컬럼명 정규화 체크리스트

### Manager DB

- [ ] `idam.roles.role_code` → `code`
- [ ] `idam.roles.role_name` → `name`
- [ ] `idam.roles.role_type` → `type`
- [ ] `idam.permissions.permission_code` → `code`
- [ ] `idam.permissions.permission_name` → `name`
- [ ] `idam.permissions.resource_type` → `resource`

### Tenant DB

- [x] `sys.roles.code` ✅ (이미 올바름)
- [x] `sys.permissions.code` ✅ (이미 올바름)
- [x] `sys.permissions.name` ✅ (이미 올바름)
- [x] `sys.permissions.module_code` ✅ (이미 올바름)

---

## 데이터 타입 표준화 체크리스트

### 수정 필요 항목

- [ ] 모든 코드 필드: `VARCHAR(50)` 통일
- [ ] 모든 이름 필드: `VARCHAR(200)` 통일
- [ ] 모든 금액 필드: `NUMERIC(18,4)` 통일
- [ ] 상태 필드: `VARCHAR(50)` 통일
- [ ] Boolean 필드: `BOOLEAN` 통일 (NOT NULL DEFAULT FALSE)

---

## 검증 및 테스트 계획

### 마이그레이션 전 검증

```sql
-- 1. 컬럼명 충돌 확인
SELECT table_name, column_name
FROM information_schema.columns
WHERE column_name IN ('code', 'name', 'deleted')
ORDER BY table_name;

-- 2. 데이터 타입 확인
SELECT table_name, column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE column_name LIKE '%code%' OR column_name LIKE '%name%'
ORDER BY table_name;

-- 3. 외래키 무결성 확인
SELECT * FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
AND table_schema IN ('manager', 'tenant');
```

### 마이그레이션 후 검증

```sql
-- 1. 컬럼명 변경 확인
SELECT COUNT(*) FROM idam.roles WHERE code IS NOT NULL;

-- 2. 인덱스 생성 확인
SELECT indexname FROM pg_indexes WHERE schemaname = 'idam';

-- 3. 무결성 검사
SELECT COUNT(*) FROM idam.permissions p
LEFT JOIN idam.role_permissions rp ON p.id = rp.permission_id
WHERE p.deleted = false AND rp.id IS NULL;
```

---

## 최종 체크리스트

### 배포 전

- [ ] 스테이징 환경에서 마이그레이션 테스트
- [ ] 롤백 스크립트 검증
- [ ] 애플리케이션 코드 업데이트 확인
- [ ] 성능 테스트 (인덱스 효율성)
- [ ] 데이터 무결성 검증

### 배포 후

- [ ] 모니터링 활성화
- [ ] 느린 쿼리 모니터링
- [ ] 사용자 피드백 수집
- [ ] 성능 메트릭 비교

---

**문서 버전**: v1.0
**작성 일시**: 2025-10-27
**마지막 검토**: 2025-10-27
**다음 검토 예정**: 마이그레이션 후 1주일

