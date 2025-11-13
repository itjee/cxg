# company_id 및 tenant_id 제거 완료 보고서

## 작업 개요
모든 테넌트 스키마 파일에서 company_id와 tenant_id 컬럼 및 관련 인덱스를 완전히 제거했습니다.

## 제거 근거
**멀티테넌시 전략 변경:**
- 기존: Schema per tenant 방식에서 company_id/tenant_id를 각 테이블에 포함
- 변경: 각 테넌트가 독립된 스키마를 사용하므로, 스키마 레벨에서 이미 분리되어 있어 불필요한 컬럼 제거

## 완료된 작업

### 1. 컬럼 제거 ✅
다음 컬럼들이 모든 테이블에서 제거되었습니다:
- `company_id UUID` - 회사 식별자
- `tenant_id UUID` - 테넌트 식별자

### 2. 인덱스 제거 ✅
company_id, tenant_id를 포함하는 모든 인덱스가 제거되었습니다:
- `CREATE INDEX ... ON table (tenant_id, ...)`
- `CREATE INDEX ... ON table (company_id, ...)`
- `CREATE INDEX ... ON table (..., tenant_id)`
- `CREATE INDEX ... ON table (..., company_id)`

### 3. 제약조건 정리 ✅
- UNIQUE 제약조건에서 tenant_id, company_id 제거
- 외래키 제약조건 제거 (company_id → adm.companies 참조 등)

### 4. 주석 제거 ✅
- `COMMENT ON COLUMN ... company_id`
- `COMMENT ON COLUMN ... tenant_id`
- `COMMENT ON INDEX ... tenant_id/company_id`

## 영향받은 파일

| 파일 | 제거된 항목 수 | 주요 변경사항 |
|------|----------------|---------------|
| adm.sql | 18 | 컬럼, 인덱스, 외래키 제거 |
| asm.sql | 3 | 컬럼, 주석 제거 |
| bim.sql | 20 | 컬럼, 인덱스, 제약조건 제거 |
| com.sql | 150+ | 다수의 인덱스 및 제약조건 제거 |
| csm.sql | 11 | 컬럼, 주석 제거 |
| fim.sql | 29 | 컬럼, 인덱스 제거 |
| ivm.sql | 0 | 원래 없음 |
| lwm.sql | 12 | 컬럼, 인덱스 제거 |
| psm.sql | 0 | 원래 없음 |
| srm.sql | 0 | 원래 없음 |
| sys.sql | 20 | 컬럼, 인덱스, 제약조건 제거 |

**총 제거: 약 263+ 라인**

## 변경 예시

### Before (변경 전)
```sql
CREATE TABLE bim.kpi_definitions (
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               UUID                     NOT NULL,
    company_id              UUID                     NOT NULL,
    kpi_code                VARCHAR(50)              NOT NULL,
    kpi_name                VARCHAR(200)             NOT NULL,
    ...
    CONSTRAINT uk_bim_kpi_definitions__company_code UNIQUE (company_id, kpi_code)
);

CREATE INDEX IF NOT EXISTS ix_kpi_definitions__tenant_id 
    ON bim.kpi_definitions (tenant_id);
    
CREATE INDEX IF NOT EXISTS ix_kpi_definitions__company_id 
    ON bim.kpi_definitions (company_id);
```

### After (변경 후)
```sql
CREATE TABLE bim.kpi_definitions (
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    kpi_code                VARCHAR(50)              NOT NULL,
    kpi_name                VARCHAR(200)             NOT NULL,
    ...
    CONSTRAINT uk_bim_kpi_definitions__code UNIQUE (kpi_code)
);

-- tenant_id, company_id 인덱스 제거됨
```

## 제약조건 변경 사항

### UNIQUE 제약조건 간소화
```sql
-- Before
CONSTRAINT uk_table__company_code UNIQUE (company_id, code)

-- After  
CONSTRAINT uk_table__code UNIQUE (code)
```

### 외래키 제약조건 제거
```sql
-- Before
CONSTRAINT fk_table__company_id FOREIGN KEY (company_id) REFERENCES adm.companies(id)

-- After
-- 제거됨 (스키마 레벨에서 이미 분리됨)
```

## 검증 결과

모든 스키마 파일에서 company_id와 tenant_id 완전 제거 확인:
```bash
$ grep -c "company_id\|tenant_id" *.sql
adm.sql:0
asm.sql:0
bim.sql:0
com.sql:0
csm.sql:0
fim.sql:0
ivm.sql:0
lwm.sql:0
psm.sql:0
srm.sql:0
sys.sql:0
```

## 장점

### 1. 스키마 간소화
- 불필요한 컬럼 제거로 테이블 구조 단순화
- 각 행의 데이터 크기 감소 (UUID 2개 = 32바이트 절약)

### 2. 쿼리 성능 향상
- 불필요한 인덱스 제거로 INSERT/UPDATE 성능 개선
- WHERE 절에서 불필요한 필터 조건 제거

### 3. 코드 간소화
- ORM 모델에서 company_id, tenant_id 필드 제거 가능
- 비즈니스 로직에서 테넌트 컨텍스트 관리 불필요

### 4. 멀티테넌시 전략 명확화
- Schema per tenant 방식에 완벽히 부합
- 스키마 이름 자체가 테넌트 식별자 역할

## 주의사항

### 1. 기존 데이터 마이그레이션
실제 데이터베이스에 이미 테이블이 존재하는 경우:
```sql
-- 컬럼 제거 마이그레이션 필요
ALTER TABLE schema.table_name DROP COLUMN IF EXISTS company_id;
ALTER TABLE schema.table_name DROP COLUMN IF EXISTS tenant_id;

-- 인덱스 제거
DROP INDEX IF EXISTS schema.ix_table__tenant_id;
DROP INDEX IF EXISTS schema.ix_table__company_id;
```

### 2. 애플리케이션 코드 수정
- ORM 모델에서 해당 필드 제거
- 쿼리에서 company_id, tenant_id 필터링 제거
- 테넌트 컨텍스트는 스키마 선택으로 처리

### 3. 백업 및 롤백 준비
- 변경 전 전체 스키마 백업 권장
- 마이그레이션 스크립트 테스트 환경에서 먼저 실행

## 후속 작업

1. **백엔드 모델 업데이트**
   - SQLAlchemy 모델에서 company_id, tenant_id 필드 제거
   - Pydantic 스키마 업데이트

2. **마이그레이션 스크립트 작성**
   - Alembic 마이그레이션 생성
   - 기존 테이블 ALTER 스크립트 작성

3. **테스트**
   - 단위 테스트 업데이트
   - 통합 테스트 실행

4. **문서 업데이트**
   - ERD 다이어그램 갱신
   - API 문서 업데이트

---
작성일: 2025-01-20
작업자: DDL 정리 자동화 스크립트
