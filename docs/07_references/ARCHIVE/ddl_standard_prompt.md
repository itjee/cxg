# PostgreSQL DDL 작성 표준 프롬프트

## 목적
ConexGrow 프로젝트의 PostgreSQL 데이터베이스 스키마 DDL을 일관된 표준에 따라 작성하기 위한 가이드라인입니다.

## 기본 요구사항

PostgreSQL DDL 파일을 아래의 기준으로 작성해주세요:

### 1. 테이블 설명 주석
- 각 테이블 상단에 테이블의 용도와 역할을 명확히 설명하는 주석 블록 추가
- 작성일, 수정일 포함

### 2. 컬럼 형식 통일
**필수 표준 컬럼 (모든 테이블 공통):**
```sql
id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
created_by              UUID,
updated_at              TIMESTAMP WITH TIME ZONE,
updated_by              UUID,
```

**상태 관리 컬럼 (필요시):**
```sql
is_active               BOOLEAN                  NOT NULL DEFAULT true,
is_deleted              BOOLEAN                  NOT NULL DEFAULT false,
```

### 3. 컬럼 네이밍 규칙
- **짧은 네이밍 방식 사용** (현대적 트렌드)
  - ✅ `code`, `name`, `name_en` (권장)
  - ❌ `currency_code`, `currency_name` (지양)
- **예외:** 외래키는 명시적으로 - `currency_id`, `group_id`
- **다국어 지원:** `name`, `name_en` 패턴 사용
- **확장 속성:** `attribute1`, `attribute2`, `attribute3`

### 4. 줄 주석 및 정렬
- 각 컬럼 라인 끝에 `--` 주석으로 설명 추가
- 컬럼명, 데이터 타입, 제약조건, 주석의 위치를 수직으로 정렬
- 컬럼을 논리적 그룹으로 묶고 빈 줄과 섹션 주석으로 구분

**예시:**
```sql
-- 기본 식별자 및 감사 필드
id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 고유 식별자
created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
created_by              UUID,                                                            -- 등록자 UUID
updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
updated_by              UUID,                                                            -- 수정자 UUID

-- 통화 정보
code                    VARCHAR(3)               NOT NULL,                               -- 통화 코드 (ISO 4217)
name                    VARCHAR(100)             NOT NULL,                               -- 통화명
name_en                 VARCHAR(100),                                                    -- 영문 통화명 (추가 - 다국어 지원)
```

### 5. 제약조건 주석
- 모든 CHECK, FOREIGN KEY 제약조건에 주석 추가
- 제약조건 위에 별도의 주석 라인 추가

**예시:**
```sql
-- 통화 코드 형식 체크 (ISO 4217 - 3자리 영대문자)
CONSTRAINT ck_currencies__code                  CHECK (code ~ '^[A-Z]{3}$'),

-- 환율 양수 체크
CONSTRAINT ck_exchange_rates__rate              CHECK (rate > 0),

-- 기준통화와 대상통화 동일 방지
CONSTRAINT ck_exchange_rates__currencies        CHECK (from_currency <> to_currency)
```

### 6. COMMENT ON 문 작성
- 모든 테이블에 대한 주석
- 모든 컬럼에 대한 상세 주석
- 모든 제약조건(CONSTRAINT)에 대한 주석
- 모든 인덱스에 대한 주석

**예시:**
```sql
-- 테이블 주석
COMMENT ON TABLE  adm.currencies                         IS '통화 테이블 - ISO 4217 표준 통화 코드 관리';

-- 컬럼 주석
COMMENT ON COLUMN adm.currencies.id                      IS '통화 고유 식별자 (UUID)';
COMMENT ON COLUMN adm.currencies.code                    IS '통화 코드 (ISO 4217 - 3자리 영대문자, 예: KRW, USD, JPY)';
COMMENT ON COLUMN adm.currencies.name                    IS '통화명 (한글명, 예: 대한민국 원)';

-- 제약조건 주석
COMMENT ON CONSTRAINT fk_codes__group_id ON adm.codes IS '코드그룹 참조 외래키 (CASCADE 삭제)';

-- 인덱스 주석
COMMENT ON INDEX ux_currencies__code IS '통화 코드 유니크 제약';
```

### 7. 인덱스 및 UNIQUE 제약
**유니크 인덱스:**
- 논리 삭제를 사용하는 테이블은 `WHERE is_deleted = false` 조건 포함
- 인덱스명: `ux_{테이블명}__{컬럼명}`

**일반 인덱스:**
- 조회 성능을 위한 인덱스 추가
- 외래키 컬럼에 인덱스 추가
- 인덱스명: `ix_{테이블명}__{컬럼명}`
- 필요시 `WHERE` 조건절 포함

**예시:**
```sql
-- 유니크 인덱스
CREATE UNIQUE INDEX ux_currencies__code 
    ON adm.currencies (code);
COMMENT ON INDEX ux_currencies__code IS '통화 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_codes__group_id 
    ON adm.codes (group_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_codes__group_id IS '그룹별 코드 조회 인덱스';

-- 복합 인덱스
CREATE INDEX ix_exchange_rates__currencies_date 
    ON adm.exchange_rates (from_currency, to_currency, rate_date DESC);
COMMENT ON INDEX ix_exchange_rates__currencies_date IS '통화쌍 및 날짜별 환율 조회 인덱스 (최신순)';
```

### 8. 외래키 제약조건
- 참조 무결성 보장을 위한 외래키 추가
- 삭제 옵션 명시: `CASCADE`, `RESTRICT`, `SET NULL`
- 제약조건명: `fk_{테이블명}__{컬럼명}`
- 각 외래키에 주석 추가

**예시:**
```sql
-- 외래키 제약조건
-- 코드그룹 참조 (CASCADE 삭제)
ALTER TABLE adm.codes 
  ADD CONSTRAINT fk_codes__group_id
    FOREIGN KEY (group_id) 
    REFERENCES adm.code_groups(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_codes__group_id ON adm.codes IS '코드그룹 참조 외래키 (CASCADE 삭제)';

-- 기준 통화 참조 (RESTRICT 삭제)
ALTER TABLE adm.exchange_rates 
  ADD CONSTRAINT fk_exchange_rates__from_currency
    FOREIGN KEY (from_currency) 
    REFERENCES adm.currencies(code) 
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_exchange_rates__from_currency ON adm.exchange_rates IS '기준 통화 참조 외래키 (RESTRICT 삭제)';
```

### 9. 추가 컬럼 (트렌드 반영)
각 테이블의 용도에 따라 아래 컬럼을 추가해도 됩니다:

**공통 추가 컬럼:**
- `is_system`: 시스템 데이터 여부 (수정/삭제 제한)
- `is_encrypted`: 암호화 여부 (민감정보 표시)
- `sort_order`: 정렬 순서
- `description`: 설명

**다국어 지원:**
- `name_en`: 영문명
- `description_en`: 영문 설명

**계층 구조:**
- `parent_id`: 상위 항목 식별자
- `level`: 계층 레벨
- `path`: 계층 경로

**확장 속성:**
- `attribute1`, `attribute2`, `attribute3`: 동적 속성

**추가된 컬럼은 반드시 줄 주석에 "(추가)" 문구 작성:**
```sql
parent_group_id         UUID,                                                            -- 상위 그룹 식별자 (추가 - 계층구조 지원)
level                   INTEGER                  DEFAULT 1,                              -- 그룹 레벨 (추가 - 계층 레벨)
is_system               BOOLEAN                  NOT NULL DEFAULT false,                 -- 시스템 코드 여부 (추가 - 수정/삭제 제한)
```

### 10. 테이블 단위 작성 순서
각 테이블은 다음 순서로 작성:

1. 테이블 설명 주석 블록
2. CREATE TABLE 문 (컬럼 정의 + CHECK, PRIMARY KEY 제약)
3. 컬럼 COMMENT ON 문
4. UNIQUE 인덱스
5. 일반 인덱스
6. 외래키 제약조건 (ALTER TABLE)
7. 외래키 제약조건 주석

### 11. 파일 구조
```sql
-- ============================================================================
-- Schema Name (약어)
-- ============================================================================
-- Description: 스키마 설명
-- Database: tnnt_db (Tenant Database) 또는 mgmt_db (Manager Database)
-- Schema: 스키마명
-- Created: YYYY-MM-DD
-- Modified: YYYY-MM-DD - 변경 내역
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS schema_name;

COMMENT ON SCHEMA schema_name IS '스키마 설명';

-- =====================================================================================
-- 테이블: schema_name.table_name
-- 설명: 테이블 상세 설명
-- 작성일: YYYY-MM-DD
-- 수정일: YYYY-MM-DD
-- =====================================================================================

CREATE TABLE IF NOT EXISTS schema_name.table_name 
(
    -- 컬럼 정의
);

-- 주석 및 인덱스

-- =====================================================================================
-- 완료: schema_name 스키마의 모든 테이블 정의
-- =====================================================================================
```

## 제약조건 네이밍 규칙

- **Primary Key:** `{테이블명}_pkey` (PostgreSQL 자동 생성)
- **Foreign Key:** `fk_{테이블명}__{컬럼명}`
- **Check:** `ck_{테이블명}__{컬럼명}` 또는 `ck_{테이블명}__{설명}`
- **Unique Index:** `ux_{테이블명}__{컬럼명}`
- **Index:** `ix_{테이블명}__{컬럼명}`

## 데이터 타입 가이드

| 용도 | 타입 | 예시 |
|------|------|------|
| 고유 식별자 | UUID | `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` |
| 날짜시간 | TIMESTAMP WITH TIME ZONE | `created_at TIMESTAMP WITH TIME ZONE` |
| 날짜 | DATE | `birth_date DATE` |
| 짧은 문자열 | VARCHAR(n) | `code VARCHAR(50)`, `name VARCHAR(200)` |
| 긴 문자열 | TEXT | `description TEXT` |
| 불린 | BOOLEAN | `is_active BOOLEAN NOT NULL DEFAULT true` |
| 정수 | INTEGER, BIGINT | `sort_order INTEGER`, `count BIGINT` |
| 소수 (금액) | NUMERIC(p,s) | `amount NUMERIC(18,2)`, `rate NUMERIC(18,6)` |
| JSON | JSONB | `metadata JSONB` |

## 예시: 완성된 테이블

```sql
-- =====================================================================================
-- 테이블: adm.currencies
-- 설명: 통화 테이블 - ISO 4217 표준 통화 코드 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-01-22
-- =====================================================================================

CREATE TABLE IF NOT EXISTS adm.currencies 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 통화 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 통화 정보
    code                    VARCHAR(3)               NOT NULL,                               -- 통화 코드 (ISO 4217 - 3자리 영대문자)
    name                    VARCHAR(100)             NOT NULL,                               -- 통화명 (한글명)
    name_en                 VARCHAR(100),                                                    -- 통화명 (영문명) (추가 - 다국어 지원)
    symbol                  VARCHAR(10),                                                     -- 심볼 (¥, $, € 등)
    decimal_places          INTEGER                  DEFAULT 2,                              -- 소수점 자릿수 (추가 - 통화별 자릿수)
    
    -- 상태 관리
    is_active               BOOLEAN                  NOT NULL DEFAULT true,                  -- 활성 여부
    is_base_currency        BOOLEAN                  NOT NULL DEFAULT false,                 -- 기준 통화 여부 (추가 - 환율 기준)
    
    -- 통화 코드 형식 체크 (ISO 4217 - 3자리 영대문자)
    CONSTRAINT ck_currencies__code                  CHECK (code ~ '^[A-Z]{3}$'),
    
    -- 소수점 자릿수 체크 (0-4 범위)
    CONSTRAINT ck_currencies__decimal_places        CHECK (decimal_places >= 0 AND decimal_places <= 4)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  adm.currencies                         IS '통화 테이블 - ISO 4217 표준 통화 코드 관리';
COMMENT ON COLUMN adm.currencies.id                      IS '통화 고유 식별자 (UUID)';
COMMENT ON COLUMN adm.currencies.created_at              IS '등록 일시';
COMMENT ON COLUMN adm.currencies.created_by              IS '등록자 UUID';
COMMENT ON COLUMN adm.currencies.updated_at              IS '수정 일시';
COMMENT ON COLUMN adm.currencies.updated_by              IS '수정자 UUID';
COMMENT ON COLUMN adm.currencies.code                    IS '통화 코드 (ISO 4217 - 3자리 영대문자, 예: KRW, USD, JPY)';
COMMENT ON COLUMN adm.currencies.name                    IS '통화명 (한글명, 예: 대한민국 원)';
COMMENT ON COLUMN adm.currencies.name_en                 IS '통화명 (영문명, 예: South Korean Won)';
COMMENT ON COLUMN adm.currencies.symbol                  IS '심볼 (¥, $, € 등)';
COMMENT ON COLUMN adm.currencies.decimal_places          IS '소수점 자릿수 (통화별 자릿수, 0-4)';
COMMENT ON COLUMN adm.currencies.is_active               IS '활성 여부';
COMMENT ON COLUMN adm.currencies.is_base_currency        IS '기준 통화 여부 (환율 계산 기준)';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_currencies__code 
    ON adm.currencies (code);
COMMENT ON INDEX ux_currencies__code IS '통화 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_currencies__is_active 
    ON adm.currencies (is_active);
COMMENT ON INDEX ix_currencies__is_active IS '활성 통화 조회 인덱스';

CREATE INDEX ix_currencies__is_base_currency 
    ON adm.currencies (is_base_currency)
 WHERE is_base_currency = true;
COMMENT ON INDEX ix_currencies__is_base_currency IS '기준 통화 조회 인덱스';
```

## 체크리스트

작성 완료 후 아래 항목을 확인하세요:

- [ ] 모든 테이블에 설명 주석 블록 추가
- [ ] 표준 컬럼 형식 (id, created_at, created_by, updated_at, updated_by) 통일
- [ ] 짧은 네이밍 규칙 적용 (code, name, name_en)
- [ ] 모든 컬럼에 줄 주석 추가 및 정렬
- [ ] 모든 제약조건에 주석 추가
- [ ] 모든 테이블/컬럼에 COMMENT ON 문 작성
- [ ] 필요한 UNIQUE 인덱스 추가 및 주석 작성
- [ ] 필요한 일반 인덱스 추가 및 주석 작성
- [ ] 외래키 제약조건 추가 및 주석 작성
- [ ] 추가된 컬럼에 "(추가)" 표시
- [ ] 테이블 단위로 순서대로 작성 (DDL → 주석 → 인덱스 → 외래키)

## 참고 파일

ConexGrow 프로젝트의 DDL 표준 예시:
- `/packages/database/schemas/tenants/01_adm.sql`
