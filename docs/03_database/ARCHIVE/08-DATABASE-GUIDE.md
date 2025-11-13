# 데이터베이스 가이드

## 설계 원칙

### 1. 멀티테넌시 전략

- **Database Per Tenant**: 테넌트별 독립 데이터베이스
- **관리자 DB** (mgmt_db): 테넌트 메타데이터, 청구 정보
- **테넌트 DB** (tenant_N_db): 각 테넌트의 업무 데이터
- **장점**: 보안성, 확장성, 독립적 백업/복구

### 2. 정규화

- 기본적으로 3NF (Third Normal Form) 적용
- 성능이 중요한 경우에만 의도적 비정규화
- 중복 데이터는 명확한 이유와 함께 문서화

### 3. 데이터 무결성

- Primary Key, Foreign Key 필수 정의
- NOT NULL 제약 조건 적극 활용
- CHECK 제약 조건으로 데이터 품질 보장
- Unique 제약으로 중복 방지

### 4. 감사 추적

- 모든 테이블에 생성/수정 정보 기록
- Soft Delete 패턴 적용 (물리 삭제 최소화)
- 중요 테이블은 이력 테이블 별도 관리

## 필수 컬럼

### 모든 테이블에 포함되어야 하는 컬럼

```sql
-- 기본 식별자 (최상위 배치)
id UUID PRIMARY KEY DEFAULT gen_random_uuid()

-- 생성 정보 (필수)
created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
created_by UUID

-- 수정 정보 (선택)
updated_at TIMESTAMP WITH TIME ZONE
updated_by UUID

-- 테넌트 ID (테넌트 DB만)
tenant_id UUID NOT NULL

-- Soft Delete (선택)
is_deleted BOOLEAN DEFAULT FALSE
deleted_at TIMESTAMP WITH TIME ZONE
deleted_by UUID

-- 상태 (선택)
status VARCHAR(20) DEFAULT 'ACTIVE'

-- 비즈니스 컬럼들...
```

### 컬럼 배치 순서

1. id (Primary Key)
2. created_at, created_by
3. updated_at, updated_by
4. tenant_id (테넌트 DB만)
5. is_deleted, deleted_at, deleted_by
6. status
7. 비즈니스 컬럼들 (중요도/사용빈도 순)

## 데이터 타입

### ID

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id UUID REFERENCES user(id)
```

### 날짜/시간

```sql
-- 타임존 포함 타임스탬프
created_at TIMESTAMP WITH TIME ZONE NOT NULL

-- 날짜만
doc_date DATE                    -- 문서 일자
posting_date DATE                -- 전기 일자
due_date DATE                    -- 만기 일자
```

### 수량

```sql
-- 정수 (기본)
qty INTEGER

-- 소수점 필요 시
qty NUMERIC(18,4)
unit_qty NUMERIC(18,4)
```

### 금액

```sql
-- 금액은 항상 NUMERIC + 통화코드 쌍으로
amount NUMERIC(18,4) NOT NULL
currency CHAR(3) NOT NULL DEFAULT 'KRW'
```

### 문자열

```sql
-- 고정 길이
code CHAR(10)                    -- 고정 길이 코드
currency CHAR(3)                 -- ISO 통화 코드

-- 가변 길이
name VARCHAR(100)                -- 이름
email VARCHAR(255)               -- 이메일
phone VARCHAR(50)                -- 전화번호

-- 긴 텍스트
description TEXT
remarks TEXT
```

### Boolean

```sql
is_active BOOLEAN DEFAULT TRUE
is_deleted BOOLEAN DEFAULT FALSE
is_approved BOOLEAN DEFAULT FALSE
```

### 상태값

```sql
status VARCHAR(20) DEFAULT 'ACTIVE'

-- 표준 상태값
-- DRAFT: 작성 중
-- SUBMITTED: 제출됨
-- PENDING_APPROVAL: 승인 대기
-- APPROVED: 승인됨
-- REJECTED: 거부됨
-- POSTED: 전기됨
-- REVERSED: 취소됨
-- CANCELED: 취소됨
-- VOID: 무효
```

## 인덱스 전략

### 인덱스 생성 대상

```sql
-- 1. Primary Key (자동 생성)
-- 2. Unique 제약조건 (자동 생성)

-- 3. Foreign Key 컬럼 (수동 생성 필요)
CREATE INDEX ix_sales_order_customer_id ON sales_order(customer_id);

-- 4. 자주 검색되는 컬럼
CREATE INDEX ix_user_email ON user(email);
CREATE INDEX ix_customer_code ON customer(code);

-- 5. 정렬/필터링에 사용되는 컬럼
CREATE INDEX ix_sales_order_doc_date ON sales_order(doc_date);
CREATE INDEX ix_user_created_at ON user(created_at);

-- 6. WHERE 절에 자주 사용되는 컬럼
CREATE INDEX ix_user_is_active ON user(is_active);
CREATE INDEX ix_sales_order_status ON sales_order(status);

-- 7. 테넌트 ID (테넌트 DB의 모든 테이블)
CREATE INDEX ix_sales_order_tenant_id ON sales_order(tenant_id);

-- 8. 복합 인덱스 (자주 함께 검색되는 컬럼)
CREATE INDEX ix_sales_order_customer_date
  ON sales_order(customer_id, doc_date);
```

### 인덱스 생성 주의사항

- 쓰기 성능에 영향을 주므로 필요한 것만 생성
- 복합 인덱스는 선택도가 높은 컬럼을 앞에 배치
- 인덱스 사용률을 주기적으로 모니터링
- 사용하지 않는 인덱스는 삭제

## 제약조건

### Primary Key

```sql
CONSTRAINT pk_user PRIMARY KEY (id)
```

### Foreign Key

```sql
CONSTRAINT fk_sales_order___customer
  FOREIGN KEY (customer_id)
  REFERENCES customer(id)
  ON DELETE RESTRICT

-- 옵션
-- ON DELETE RESTRICT: 참조되는 레코드 삭제 불가 (기본)
-- ON DELETE CASCADE: 참조하는 레코드도 함께 삭제
-- ON DELETE SET NULL: 참조 컬럼을 NULL로 설정
```

### Unique

```sql
-- 단일 컬럼
CONSTRAINT uk_user___email UNIQUE (email)

-- 복합 유니크
CONSTRAINT uk_customer___tenant_code UNIQUE (tenant_id, code)
```

### Check

```sql
-- 상태값 검증
CONSTRAINT ck_user___status
  CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED'))

-- 금액 검증
CONSTRAINT ck_sales_order___amount
  CHECK (total_amount >= 0)

-- 날짜 검증
CONSTRAINT ck_sales_order___dates
  CHECK (due_date >= doc_date)
```

### Not Null

```sql
name VARCHAR(100) NOT NULL
email VARCHAR(255) NOT NULL
created_at TIMESTAMP WITH TIME ZONE NOT NULL
```

## 스키마 구성

### 관리자 DB (mgmt_db) 스키마

```sql
CREATE DATABASE mgmt_db;

-- 테넌트 관리
CREATE SCHEMA IF NOT EXISTS tnnt;

-- 인프라 관리
CREATE SCHEMA IF NOT EXISTS ifra;

-- 사용자/권한 관리
CREATE SCHEMA IF NOT EXISTS idam;

-- 청구 관리
CREATE SCHEMA IF NOT EXISTS bill;

-- 모니터링
CREATE SCHEMA IF NOT EXISTS mntr;

-- 보안/감사
CREATE SCHEMA IF NOT EXISTS audt;

-- 분석/통계
CREATE SCHEMA IF NOT EXISTS stat;

-- 지원
CREATE SCHEMA IF NOT EXISTS supt;

-- 설정
CREATE SCHEMA IF NOT EXISTS cnfg;

-- 백업/복구
CREATE SCHEMA IF NOT EXISTS bkup;

-- 알림
CREATE SCHEMA IF NOT EXISTS noti;

-- 외부 연동
CREATE SCHEMA IF NOT EXISTS intg;

-- 자동화
CREATE SCHEMA IF NOT EXISTS auto;
```

### 테넌트 DB (tenant_N_db) 스키마

```sql
CREATE DATABASE tenant_1_db;

-- 기준정보
CREATE SCHEMA IF NOT EXISTS adm;

-- 구매/조달
CREATE SCHEMA IF NOT EXISTS psm;

-- 영업/매출
CREATE SCHEMA IF NOT EXISTS srm;
-- 재고/자재
CREATE SCHEMA IF NOT EXISTS ivm;
-- 물류/창고
CREATE SCHEMA IF NOT EXISTS lwm;
-- 고객지원
CREATE SCHEMA IF NOT EXISTS csm;
-- A/S 관리
CREATE SCHEMA IF NOT EXISTS asm;
-- 재무/회계
CREATE SCHEMA IF NOT EXISTS fim;
-- 경영분석
CREATE SCHEMA IF NOT EXISTS bim;
-- 공통/지원
CREATE SCHEMA IF NOT EXISTS com;
-- 시스템 관리
CREATE SCHEMA IF NOT EXISTS sys;
```

## 테이블 설계 패턴

### 마스터 테이블 패턴

```sql
CREATE TABLE idam.user (
    -- 필수 컬럼
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by UUID,

    -- 비즈니스 컬럼
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,

    -- 제약조건
    CONSTRAINT pk_user PRIMARY KEY (id),
    CONSTRAINT uk_user___username UNIQUE (username),
    CONSTRAINT uk_user___email UNIQUE (email)
);

-- 인덱스
CREATE INDEX ix_user_email ON idam.user(email);
CREATE INDEX ix_user_is_active ON idam.user(is_active);
```

### 트랜잭션 테이블 패턴

```sql
CREATE TABLE srm.sales_order (
    -- 필수 컬럼
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by UUID,
    tenant_id UUID NOT NULL,

    -- 문서 정보
    order_no VARCHAR(50) NOT NULL,
    doc_date DATE NOT NULL,
    due_date DATE,

    -- 참조 정보
    customer_id UUID NOT NULL,
    company_id UUID NOT NULL,

    -- 금액 정보
    total_amount NUMERIC(18,4) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(18,4) NOT NULL DEFAULT 0,
    net_amount NUMERIC(18,4) NOT NULL DEFAULT 0,
    currency CHAR(3) DEFAULT 'KRW',

    -- 상태
    status VARCHAR(20) DEFAULT 'DRAFT',

    -- 기타
    remarks TEXT,

    -- 제약조건
    CONSTRAINT pk_sales_order PRIMARY KEY (id),
    CONSTRAINT uk_sales_order___order_no UNIQUE (tenant_id, order_no),
    CONSTRAINT fk_sales_order___customer FOREIGN KEY (customer_id)
        REFERENCES adm.customer(id),
    CONSTRAINT ck_sales_order___status CHECK (
        status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'POSTED', 'CANCELED')
    ),
    CONSTRAINT ck_sales_order___dates CHECK (due_date >= doc_date)
);

-- 인덱스
CREATE INDEX ix_sales_order_tenant_id ON srm.sales_order(tenant_id);
CREATE INDEX ix_sales_order_customer_id ON srm.sales_order(customer_id);
CREATE INDEX ix_sales_order_doc_date ON srm.sales_order(doc_date);
CREATE INDEX ix_sales_order_status ON srm.sales_order(status);
```

### 상세 테이블 패턴

```sql
CREATE TABLE srm.sales_order_line (
    -- 필수 컬럼
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by UUID,
    tenant_id UUID NOT NULL,

    -- 헤더 참조
    sales_order_id UUID NOT NULL,
    line_no INTEGER NOT NULL,

    -- 제품 정보
    product_id UUID NOT NULL,
    product_name VARCHAR(200) NOT NULL,

    -- 수량/단가
    qty INTEGER NOT NULL,
    unit_price NUMERIC(18,4) NOT NULL,
    amount NUMERIC(18,4) NOT NULL,

    -- 제약조건
    CONSTRAINT pk_sales_order_line PRIMARY KEY (id),
    CONSTRAINT uk_sales_order_line___order_line
        UNIQUE (sales_order_id, line_no),
    CONSTRAINT fk_sales_order_line___order FOREIGN KEY (sales_order_id)
        REFERENCES srm.sales_order(id) ON DELETE CASCADE,
    CONSTRAINT ck_sales_order_line___qty CHECK (qty > 0)
);

-- 인덱스
CREATE INDEX ix_sales_order_line_tenant_id ON srm.sales_order_line(tenant_id);
CREATE INDEX ix_sales_order_line_order_id ON srm.sales_order_line(sales_order_id);
```

### N:M 관계 테이블 패턴

```sql
CREATE TABLE idam.user_role (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,

    user_id UUID NOT NULL,
    role_id UUID NOT NULL,

    -- 제약조건
    CONSTRAINT pk_user_role PRIMARY KEY (id),
    CONSTRAINT uk_user_role___user_role UNIQUE (user_id, role_id),
    CONSTRAINT fk_user_role___user FOREIGN KEY (user_id)
        REFERENCES idam.user(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_role___role FOREIGN KEY (role_id)
        REFERENCES idam.role(id) ON DELETE CASCADE
);

-- 인덱스
CREATE INDEX ix_user_role_user_id ON idam.user_role(user_id);
CREATE INDEX ix_user_role_role_id ON idam.user_role(role_id);
```

## 이력 관리

### Soft Delete 패턴

```sql
-- is_deleted 플래그 사용
CREATE TABLE adm.customer (
    id UUID PRIMARY KEY,
    -- ... 기타 컬럼
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID
);

-- 조회 시 항상 필터링
SELECT * FROM adm.customer WHERE is_deleted = FALSE;
```

### 이력 테이블 패턴

```sql
-- 원본 테이블
CREATE TABLE adm.employee (
    id UUID PRIMARY KEY,
    name VARCHAR(100),
    department_id UUID,
    -- ...
);

-- 이력 테이블
CREATE TABLE adm.employee_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    name VARCHAR(100),
    department_id UUID,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_to TIMESTAMP WITH TIME ZONE,
    changed_by UUID,

    CONSTRAINT fk_employee_history___employee
        FOREIGN KEY (employee_id) REFERENCES adm.employee(id)
);

-- 이력 조회 (특정 시점)
SELECT * FROM adm.employee_history
WHERE employee_id = '...'
  AND valid_from <= '2025-01-01'
  AND (valid_to IS NULL OR valid_to > '2025-01-01');
```

## 마이그레이션

### Alembic 마이그레이션 파일 구조

```python
"""Add user table

Revision ID: 001
Revises:
Create Date: 2025-01-15 10:00:00.000000
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '001'
down_revision = None

def upgrade() -> None:
    """업그레이드 로직"""
    # 스키마 생성
    op.execute('CREATE SCHEMA IF NOT EXISTS idam')

    # 테이블 생성
    op.create_table(
        'user',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('username', sa.String(50), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        schema='idam'
    )

    # 인덱스 생성
    op.create_index('ix_user_email', 'user', ['email'], unique=True, schema='idam')

def downgrade() -> None:
    """다운그레이드 로직"""
    op.drop_index('ix_user_email', table_name='user', schema='idam')
    op.drop_table('user', schema='idam')
```

### 마이그레이션 전략

- **Expand-Migrate-Contract**: 컬럼 추가 → 데이터 마이그레이션 → 기존 컬럼 제거
- **Zero Downtime**: 서비스 중단 없이 마이그레이션
- **Rollback Plan**: 항상 롤백 가능하도록 설계

## 성능 최적화

### 쿼리 최적화

```sql
-- EXPLAIN ANALYZE로 쿼리 분석
EXPLAIN ANALYZE
SELECT * FROM srm.sales_order
WHERE customer_id = '...'
  AND doc_date >= '2025-01-01';

-- 필요한 컬럼만 조회
SELECT id, order_no, total_amount
FROM srm.sales_order
WHERE ...;

-- JOIN 최소화, 필요한 경우에만 사용
```

### 파티셔닝

```sql
-- 날짜 기반 파티셔닝
CREATE TABLE srm.sales_order (
    id UUID,
    doc_date DATE NOT NULL,
    -- ...
) PARTITION BY RANGE (doc_date);

-- 파티션 생성
CREATE TABLE srm.sales_order_2025_01
    PARTITION OF srm.sales_order
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE srm.sales_order_2025_02
    PARTITION OF srm.sales_order
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
```

### Connection Pooling

```sql
-- pgBouncer 설정
[databases]
cxg_db = host=localhost port=5432 dbname=cxg_db

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 20
```

## 백업 및 복구

### 백업 전략

```bash
# 전체 백업 (일일)
pg_dump -h localhost -U postgres -d mgmt_db > backup_mgmt_$(date +%Y%m%d).sql

# 스키마만 백업
pg_dump -h localhost -U postgres -d mgmt_db --schema-only > schema_mgmt.sql

# 특정 테이블만 백업
pg_dump -h localhost -U postgres -d mgmt_db -t idam.user > backup_user.sql
```

### 복구

```bash
# 전체 복구
psql -h localhost -U postgres -d mgmt_db < backup_mgmt_20250115.sql

# 특정 테이블만 복구
psql -h localhost -U postgres -d mgmt_db < backup_user.sql
```

## 보안

### Row Level Security (RLS)

```sql
-- RLS 활성화
ALTER TABLE srm.sales_order ENABLE ROW LEVEL SECURITY;

-- 정책 생성
CREATE POLICY tenant_isolation ON srm.sales_order
    USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- 세션에서 테넌트 ID 설정
SET app.tenant_id = 'tenant-uuid-here';
```

### 민감 데이터 암호화

```sql
-- pgcrypto 확장 설치
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 데이터 암호화
INSERT INTO user (email_encrypted)
VALUES (pgp_sym_encrypt('user@example.com', 'encryption-key'));

-- 데이터 복호화
SELECT pgp_sym_decrypt(email_encrypted, 'encryption-key') AS email
FROM user;
```

## 모니터링

### 쿼리 성능 모니터링

```sql
-- 느린 쿼리 확인
SELECT pid, now() - query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active'
  AND now() - query_start > interval '1 second'
ORDER BY duration DESC;

-- 인덱스 사용률 확인
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY schemaname, tablename;

-- 테이블 크기 확인
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Vacuum 및 Analyze

```sql
-- 자동 Vacuum 설정 확인
SHOW autovacuum;

-- 수동 Vacuum
VACUUM ANALYZE srm.sales_order;

-- Full Vacuum (테이블 잠금 발생)
VACUUM FULL srm.sales_order;
```

## 베스트 프랙티스

### DO ✅

- 모든 테이블에 필수 컬럼 포함
- UUID를 Primary Key로 사용
- Foreign Key 제약 조건 정의
- 인덱스는 필요한 컬럼에만 생성
- Soft Delete 패턴 사용
- 트랜잭션으로 데이터 무결성 보장
- 정규화 원칙 준수
- 마이그레이션으로 스키마 관리

### DON'T ❌

- 복수형 테이블명 사용
- 컬럼명에 테이블명 포함
- NULL 값 과다 사용
- 과도한 인덱스 생성
- 물리적 삭제 남용
- Raw SQL 직접 실행 (ORM 사용)
- 비정규화 남용
- 수동 스키마 변경

## 체크리스트

새로운 테이블 추가 시:

- [ ] 스키마 선택 (adm, psm, srm 등)
- [ ] 테이블명은 snake_case, 단수형
- [ ] 필수 컬럼 포함 (id, created_at 등)
- [ ] Primary Key 정의
- [ ] Foreign Key 제약 조건 정의
- [ ] Unique 제약 조건 정의
- [ ] Check 제약 조건 정의
- [ ] 인덱스 생성 (FK, 검색 컬럼)
- [ ] 테넌트 ID 포함 (테넌트 DB만)
- [ ] Alembic 마이그레이션 파일 작성
- [ ] 마이그레이션 테스트
- [ ] ORM 모델 작성
