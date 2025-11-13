# 레거시 테이블 마이그레이션 스크립트

**생성일시**: 2025-10-20 21:46:05 KST
**생성 도구**: `generate_migration_from_legacy.py`

## 📋 개요

레거시 MSSQL 기반 ERP 시스템의 298개 테이블을 현대적인 PostgreSQL 스키마로 변환한 마이그레이션 스크립트입니다.

### 소스
- **레거시 시스템**: MSSQL 기반 50인 미만 사업자용 ERP/CRM/전자결재 통합 시스템
- **레거시 테이블 위치**: `packages/database/schemas/tmp_old_tables/`
- **총 파일 수**: 298개

### 타겟
- **현대 시스템**: PostgreSQL 15+ 기반 ConexGrow Workspace
- **현재 스키마 위치**: `packages/database/schemas/tenants/`
- **멀티테넌트 아키텍처**: Schema-per-tenant 패턴

## 📊 마이그레이션 통계

### 전체 처리 결과
- **처리됨**: 282개 테이블
  - **신규 테이블 생성**: 275개
  - **기존 테이블 컬럼 추가**: 7개
- **스킵됨**: 15개 테이블 (매핑 불가)
  - TMP_* (임시 테이블)
  - EMP_MAP, TLE_* (매핑 정의 없음)

### 스키마별 분류

| 스키마 | 레거시 Prefix | 용도 | 테이블 수 | 파일 크기 |
|--------|--------------|------|----------|----------|
| **adm** | TBS_ | Administration (기준정보) | ~50 | 146KB |
| **srm** | TSD_, TSR_ | Sales/Revenue (판매) | ~100 | 206KB |
| **psm** | TMM_ | Procurement (구매) | ~35 | 96KB |
| **lwm** | TEA_ | Workflow (전자결재) | ~70 | 207KB |
| **fim** | TFI_ | Finance (재무) | ~15 | 28KB |
| **ivm** | TIV_ | Inventory (재고) | ~25 | 73KB |
| **bim** | TCO_ | BI/Analytics (원가/분석) | ~15 | 40KB |
| **sys** | TSS_ | System (시스템 설정) | ~20 | 49KB |

## 🔄 변환 규칙

### 1. 테이블명 변환

#### Prefix 매핑
```
TBS_ → adm  (Base/Master data → Administration)
TSD_ → srm  (Sales Data → Sales/Revenue Management)
TMM_ → psm  (Material Management → Procurement)
TIV_ → ivm  (Inventory → Inventory Management)
TFI_ → fim  (Finance → Finance Management)
TEA_ → lwm  (Electronic Approval → Workflow)
TCO_ → bim  (Cost → BI/Analytics)
TSR_ → srm  (Sales Rental → Sales/Revenue)
TSS_ → sys  (System → System Configuration)
```

#### 접미사 변환
```
_MST → s (Master → Plural)
_TRN → _transactions
_SUM → _summaries
_DTL → _details
_HIST → _history
```

#### 약어 확장
```
DEPT → department
EMPY → employee
CUST → customer
PRDT → product
WHSE → warehouse
CTGR → category
MAKR → maker
BRND → brand
VNDR → vendor
```

### 2. 컬럼명 변환

#### 표준 컬럼 매핑
```
ID         → id (UUID)
CREATE_ON  → created_at (TIMESTAMP WITH TIME ZONE)
CREATE_BY  → created_by_name (참고용)
CREATE_ID  → created_by (UUID 참조)
UPDATE_ON  → updated_at
UPDATE_BY  → updated_by_name
UPDATE_ID  → updated_by
USE_YN     → is_active
NOTES      → description
```

#### 접미사 변환
```
_CD  → _code
_NM  → _name
_TP  → _type
_YN  → _flag
_DT  → _date
_NO  → _number
_SEQ → _order
```

### 3. 데이터 타입 변환

#### MSSQL → PostgreSQL
```
int          → INTEGER
bigint       → BIGINT
smallint     → SMALLINT
tinyint      → SMALLINT
bit          → BOOLEAN
decimal(p,s) → NUMERIC(p,s)
money        → NUMERIC(19,4)
datetime     → TIMESTAMP WITH TIME ZONE
date         → DATE
char(n)      → CHAR(n)
varchar(n)   → VARCHAR(n)
varchar(max) → TEXT
nvarchar(n)  → VARCHAR(n)
uniqueid     → UUID
```

### 4. 추가되는 표준 컬럼

모든 신규 테이블에 자동으로 추가:
```sql
-- 기본 식별자 및 감사 필드
id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
created_by          UUID,
updated_at          TIMESTAMP WITH TIME ZONE,
updated_by          UUID,

-- 상태 관리 (하단)
is_deleted          BOOLEAN                  DEFAULT false
```

### 5. 기본 인덱스

모든 테이블에 기본 인덱스 추가:
```sql
CREATE INDEX IF NOT EXISTS ix_{table_name}__is_deleted
    ON {schema}.{table_name} (is_deleted)
 WHERE is_deleted = false;
```

## 📝 생성된 파일

### 마이그레이션 스크립트

1. **migration_adm_20251020_214605.sql** (146KB)
   - 기준정보 관리 (회사, 부서, 사원, 거래처, 제품, 브랜드, 카테고리, 창고 등)
   - 컬럼 추가: 7개 테이블
   - 신규 테이블: ~43개

2. **migration_srm_20251020_214605.sql** (206KB)
   - 판매/매출 관리 (판매, 수금, 렌탈, 반품 등)
   - 신규 테이블: ~100개

3. **migration_psm_20251020_214605.sql** (96KB)
   - 구매/조달 관리 (발주, 입고, 반품, 지급 등)
   - 신규 테이블: ~35개

4. **migration_lwm_20251020_214605.sql** (207KB)
   - 워크플로우/전자결재 (문서, 결재선, 양식 등)
   - 신규 테이블: ~70개

5. **migration_fim_20251020_214605.sql** (28KB)
   - 재무/회계 관리 (세금계산서 등)
   - 신규 테이블: ~15개

6. **migration_ivm_20251020_214605.sql** (73KB)
   - 재고 관리 (재고, 수불 등)
   - 신규 테이블: ~25개

7. **migration_bim_20251020_214605.sql** (40KB)
   - BI/분석 (원가, 계획, 리베이트 등)
   - 신규 테이블: ~15개

8. **migration_sys_20251020_214605.sql** (49KB)
   - 시스템 설정 (코드, 마감, 사전, 도움말, 뷰 설정 등)
   - 신규 테이블: ~20개

## 🔍 주요 변경 사항

### 기존 테이블에 컬럼 추가

#### 1. adm.brands (브랜드)
- `created_by_name`, `updated_by_name`: 생성/수정자 이름 (참고용)
- `brnd_name`: 브랜드명
- `sort_order`: 정렬 순서
- `is_active`: 활성 상태

#### 2. adm.customers (거래처)
- 29개 컬럼 추가
- 거래처 상세 정보, 사업자 정보, 연락처 등

#### 3. adm.departments (부서)
- 17개 컬럼 추가
- 부서 상세 정보, 계층 구조 등

#### 4. adm.employees (사원)
- 10개 컬럼 추가
- 사원 상세 정보, 재직 정보 등

#### 5. adm.makers (제조사)
- 6개 컬럼 추가
- 제조사 기본 정보

#### 6. adm.products (제품)
- 51개 컬럼 추가
- 제품 상세 정보, 가격, 분류, 관리 정보 등

#### 7. adm.warehouses (창고)
- 9개 컬럼 추가
- 창고 상세 정보, 위치 정보 등

### 주요 신규 테이블 카테고리

#### ADM (기준정보)
- 캘린더, 휴일, 계약, 파일, 환율, 거래처 상세(주소, 은행, 담당자 등)

#### SRM (판매)
- 판매주문, 판매, 수금, 렌탈, 반품, 할인, 예치금, 채권관리

#### PSM (구매)
- 구매요청, 구매주문, 구매입고, 반품, RMA, 지급관리

#### LWM (워크플로우)
- 전자문서, 결재선, 양식, 계정, 게시판

#### FIM (재무)
- 세금계산서 (판매/구매)

#### IVM (재고)
- 재고현황, 수불, 재고조정, LOT 관리, 시리얼 관리

#### BIM (분석)
- 원가분석, 판매계획, 구매계획, 리베이트

#### SYS (시스템)
- 코드관리, 마감처리, 사전관리, 도움말, 뷰설정, 권한

## ⚠️ 주의사항

### 1. 검토 필요 사항

#### 중복 컬럼
일부 테이블에서 `created_at`, `updated_at` 등이 중복 정의됨:
```sql
created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 표준
created_at          TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
```
→ **수동 검토 및 제거 필요**

#### 인덱스 정의
레거시의 인덱스 컬럼이 일반 컬럼으로 추가됨:
```sql
ix_tbs_cust_mst__cust_code     TEXT  -- [LEGACY] IX_TBS_CUST_MST__CUST_CD
```
→ **실제 인덱스로 재정의 필요**

### 2. 데이터 마이그레이션

이 스크립트는 **스키마 마이그레이션**만 포함합니다. 실제 데이터 마이그레이션은 별도 작업 필요:

1. **데이터 타입 변환**
   - CHAR(8) 날짜 → DATE 변환
   - IDENTITY → UUID 변환
   - 'Y'/'N' → BOOLEAN 변환

2. **참조 무결성**
   - 레거시 ID (INTEGER) → UUID 매핑 테이블 생성
   - 외래 키 재설정

3. **데이터 정제**
   - NULL 값 처리
   - 기본값 설정
   - 제약 조건 위반 데이터 정리

### 3. 성능 최적화

#### 필수 작업
```sql
-- 1. 적절한 인덱스 추가
CREATE INDEX idx_table_frequently_used_column ON schema.table(column);

-- 2. 외래 키 추가
ALTER TABLE schema.child_table 
ADD CONSTRAINT fk_parent FOREIGN KEY (parent_id) REFERENCES schema.parent(id);

-- 3. CHECK 제약 추가
ALTER TABLE schema.table 
ADD CONSTRAINT ck_table_status CHECK (status IN ('ACTIVE', 'INACTIVE'));

-- 4. UNIQUE 제약 추가
CREATE UNIQUE INDEX ux_table_code ON schema.table(code) WHERE is_deleted = false;

-- 5. 통계 업데이트
ANALYZE schema.table;
```

### 4. 불필요한 테이블 식별

다음 테이블들은 현대 시스템에서 불필요할 수 있음:

#### 임시/백업 테이블
- `*_BACK`, `*_TEMP`, `*_LOG` (일부)

#### 레거시 특화 테이블
- `TEA_DOC_MST_*` (문서 타입별 개별 테이블 → 통합 가능)
- `*_UPLOAD` (업로드 임시 테이블)
- `*_WEB_LOG` (구형 웹 로그)

#### 시스템 특화
- `TSS_VIEW_*`, `TSS_HELP_*` (UI 설정 → 프론트엔드로 이관)

## 🚀 적용 방법

### 1. 검토 단계
```bash
# 각 스키마별 스크립트 검토
cat migration_adm_20251020_214605.sql | less
cat migration_srm_20251020_214605.sql | less
# ... 기타 스크립트
```

### 2. 테스트 환경 적용
```bash
# PostgreSQL 테스트 DB 접속
psql -h localhost -U postgres -d test_tnnt_db

# 스키마별 적용
\i migration_adm_20251020_214605.sql
\i migration_srm_20251020_214605.sql
\i migration_psm_20251020_214605.sql
\i migration_lwm_20251020_214605.sql
\i migration_fim_20251020_214605.sql
\i migration_ivm_20251020_214605.sql
\i migration_bim_20251020_214605.sql
\i migration_sys_20251020_214605.sql
```

### 3. 검증
```sql
-- 테이블 생성 확인
SELECT schemaname, tablename, tableowner
FROM pg_tables
WHERE schemaname IN ('adm', 'srm', 'psm', 'lwm', 'fim', 'ivm', 'bim', 'sys')
ORDER BY schemaname, tablename;

-- 컬럼 확인
SELECT table_schema, table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema IN ('adm', 'srm', 'psm', 'lwm', 'fim', 'ivm', 'bim', 'sys')
ORDER BY table_schema, table_name, ordinal_position;

-- 인덱스 확인
SELECT schemaname, tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname IN ('adm', 'srm', 'psm', 'lwm', 'fim', 'ivm', 'bim', 'sys')
ORDER BY schemaname, tablename, indexname;
```

### 4. 수동 보완 작업
```sql
-- 중복 컬럼 제거 예시
ALTER TABLE adm.cldrs DROP COLUMN IF EXISTS created_at CASCADE;  -- 중복된 레거시 컬럼

-- 인덱스 재정의 예시
CREATE INDEX IF NOT EXISTS ix_customers__code 
    ON adm.customers (customer_code) 
 WHERE is_deleted = false;

-- 외래 키 추가 예시
ALTER TABLE adm.products
ADD CONSTRAINT fk_products_category 
FOREIGN KEY (category_id) REFERENCES adm.categories(id);

-- CHECK 제약 추가 예시
ALTER TABLE adm.customers
ADD CONSTRAINT ck_customers__type 
CHECK (customer_type IN ('B2B', 'B2C', 'PARTNER'));
```

### 5. 운영 환경 적용
```bash
# 백업
pg_dump -h localhost -U postgres -d prod_tnnt_db > backup_before_migration.sql

# 트랜잭션으로 적용
psql -h localhost -U postgres -d prod_tnnt_db <<EOF
BEGIN;
\i migration_adm_20251020_214605.sql
-- ... 기타 스크립트
COMMIT;
EOF

# 롤백 필요 시
-- ROLLBACK;
```

## 📚 참고 문서

### 관련 문서
- [현재 스키마 정의](../../schemas/tenants/)
- [레거시 테이블 정의](../../schemas/tmp_old_tables/)
- [데이터베이스 가이드](../../../docs/guides/08-DATABASE-GUIDE.md)

### 생성 도구
- **스크립트**: `generate_migration_from_legacy.py`
- **실행 명령**: `python3 generate_migration_from_legacy.py`
- **로그**: 터미널 출력 참조

## 🤝 기여

마이그레이션 스크립트 개선 사항:

1. **인덱스 컬럼 제거**: 레거시 인덱스 컬럼을 실제 인덱스로 변환
2. **중복 컬럼 처리**: 표준 컬럼과 레거시 컬럼 중복 해결
3. **데이터 타입 최적화**: 비즈니스 로직에 맞는 타입 조정
4. **제약 조건 추가**: CHECK, FOREIGN KEY, UNIQUE 정의
5. **불필요한 테이블 제거**: 사용하지 않는 레거시 테이블 식별

## 📞 문의

마이그레이션 관련 문의사항은 개발팀에 문의하세요.

---

**마지막 업데이트**: 2025-10-20 21:46:05 KST
