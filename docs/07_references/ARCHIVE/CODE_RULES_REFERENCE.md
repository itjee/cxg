# 코드 규칙 관리 테이블 (sys_code_rules)

## 개요

엔티티별 자동 생성 코드의 Prefix와 일련번호를 관리하는 시스템 테이블입니다.

## 데이터베이스 정보

- **데이터베이스**: `tnnt_db` (Tenant Database)
- **테이블명**: `sys_code_rules`
- **스키마**: sys (시스템 관리)

## DDL 실행 방법

### 1. PostgreSQL에서 직접 실행

```bash
# 테넌트 데이터베이스에 연결
psql -U postgres -d tnnt_db

# DDL 파일 실행
\i packages/database/scripts/sys_code_rules.sql
```

### 2. psql 명령어로 실행

```bash
psql -U postgres -d tnnt_db -f packages/database/scripts/sys_code_rules.sql
```

## 테이블 구조

### 컬럼 정보

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | BIGSERIAL | PRIMARY KEY | 기본키 |
| entity_name | VARCHAR(100) | NOT NULL | 엔티티명 (한글) |
| entity_code | VARCHAR(50) | NOT NULL, UNIQUE | 엔티티 코드 (영문) |
| prefix | CHAR(3) | NOT NULL | 코드 Prefix (3자리 영문 대문자) |
| current_number | INTEGER | NOT NULL, DEFAULT 0 | 현재 일련번호 |
| digit_length | SMALLINT | NOT NULL, DEFAULT 4 | 일련번호 자릿수 (2-10) |
| description | VARCHAR(500) | NULL | 규칙 설명 |
| example_code | VARCHAR(20) | NULL | 코드 형식 예시 |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'active' | 상태 (active/inactive) |
| created_by | BIGINT | NULL | 생성자 ID |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 생성일시 |
| updated_by | BIGINT | NULL | 수정자 ID |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 수정일시 |

### 제약 조건

1. **chk_prefix_format**: Prefix는 3자리 영문 대문자만 허용 (정규식: `^[A-Z]{3}$`)
2. **chk_digit_length**: 자릿수는 2~10 사이
3. **chk_current_number**: 일련번호는 0 이상
4. **chk_status**: 상태는 'active' 또는 'inactive'만 허용

### 인덱스

- `idx_sys_code_rules_entity_code`: entity_code 인덱스
- `idx_sys_code_rules_status`: status 인덱스
- `idx_sys_code_rules_created_at`: created_at 인덱스

## 제공 함수

### 1. generate_next_code(entity_code)

다음 코드를 생성하고 일련번호를 자동으로 증가시킵니다.

```sql
-- 사용 예시
SELECT generate_next_code('PARTNER');  -- 결과: MBP0001
SELECT generate_next_code('PARTNER');  -- 결과: MBP0002
SELECT generate_next_code('PRODUCT');  -- 결과: MPD00001
```

**특징**:
- 트랜잭션 내에서 FOR UPDATE 락으로 동시성 제어
- 호출 시마다 current_number가 자동 증가
- 규칙이 없거나 비활성 상태면 에러 발생

### 2. preview_next_code(entity_code)

다음 코드를 미리보기합니다 (일련번호 증가 안함).

```sql
-- 사용 예시
SELECT preview_next_code('WAREHOUSE');  -- 결과: MWH01
SELECT preview_next_code('WAREHOUSE');  -- 결과: MWH01 (동일)
```

**특징**:
- 일련번호를 증가시키지 않음
- 단순 조회용
- 규칙이 없으면 NULL 반환

### 3. get_current_number(entity_code)

현재 일련번호를 조회합니다.

```sql
-- 사용 예시
SELECT get_current_number('PARTNER');  -- 결과: 15
```

## 초기 데이터

DDL 실행 시 자동으로 다음 데이터가 삽입됩니다:

| 엔티티명 | 엔티티 코드 | Prefix | 자릿수 | 예시 코드 |
|---------|------------|--------|--------|----------|
| 회사 | COMPANY | MCO | 3 | MCO001, MCO002 |
| 부서 | DEPARTMENT | MDP | 3 | MDP001, MDP002 |
| 거래처 | PARTNER | MBP | 4 | MBP0001, MBP0002 |
| 제품 | PRODUCT | MPD | 5 | MPD00001, MPD00002 |
| 창고 | WAREHOUSE | MWH | 2 | MWH01, MWH02 |
| 사원 | EMPLOYEE | MEM | 4 | MEM0001, MEM0002 |

## 사용 예시

### 코드 규칙 조회

```sql
-- 모든 활성 규칙 조회
SELECT 
    entity_name,
    entity_code,
    prefix,
    current_number,
    digit_length,
    prefix || LPAD((current_number + 1)::TEXT, digit_length, '0') AS next_code,
    status
FROM sys_code_rules
WHERE status = 'active'
ORDER BY entity_code;
```

### 코드 규칙 추가

```sql
INSERT INTO sys_code_rules (
    entity_name, 
    entity_code, 
    prefix, 
    current_number, 
    digit_length, 
    description
)
VALUES (
    '고객', 
    'CUSTOMER', 
    'CU', 
    0, 
    4, 
    '고객 코드 자동 생성'
);
```

### 코드 규칙 수정

```sql
-- 자릿수 변경
UPDATE sys_code_rules
SET digit_length = 5,
    description = '제품 코드 자동 생성 (5자리)'
WHERE entity_code = 'PRODUCT';

-- Prefix 변경
UPDATE sys_code_rules
SET prefix = 'VN'
WHERE entity_code = 'PARTNER';
```

### 일련번호 초기화

```sql
-- 주의: 중복 코드 발생 가능
UPDATE sys_code_rules
SET current_number = 0
WHERE entity_code = 'PARTNER';
```

### 코드 규칙 비활성화

```sql
UPDATE sys_code_rules
SET status = 'inactive'
WHERE entity_code = 'OLD_ENTITY';
```

### 트랜잭션 예시

```sql
BEGIN;

-- 거래처 코드 생성
SELECT generate_next_code('PARTNER') INTO :partner_code;

-- 거래처 등록
INSERT INTO partners (code, name, ...)
VALUES (:partner_code, '새 거래처', ...);

COMMIT;
```

## 애플리케이션 통합

### Python (SQLAlchemy)

```python
from models.tenants.sys import CodeRule
from sqlalchemy import text

# 1. 다음 코드 생성
def generate_partner_code(db: Session) -> str:
    result = db.execute(
        text("SELECT generate_next_code('PARTNER')")
    )
    return result.scalar()

# 2. 코드 미리보기
def preview_product_code(db: Session) -> str:
    result = db.execute(
        text("SELECT preview_next_code('PRODUCT')")
    )
    return result.scalar()

# 3. 모델을 통한 조회
def get_code_rule(db: Session, entity_code: str) -> CodeRule:
    return db.query(CodeRule).filter(
        CodeRule.entity_code == entity_code,
        CodeRule.status == 'active'
    ).first()
```

### TypeScript/JavaScript

```typescript
// 1. 다음 코드 생성
async function generateNextCode(entityCode: string): Promise<string> {
  const result = await db.query(
    'SELECT generate_next_code($1)',
    [entityCode]
  );
  return result.rows[0].generate_next_code;
}

// 2. 코드 미리보기
async function previewNextCode(entityCode: string): Promise<string> {
  const result = await db.query(
    'SELECT preview_next_code($1)',
    [entityCode]
  );
  return result.rows[0].preview_next_code;
}
```

## 주의사항

1. **동시성**: `generate_next_code()` 함수는 FOR UPDATE 락을 사용하여 동시성을 제어합니다.
2. **트랜잭션**: 코드 생성과 데이터 삽입은 반드시 같은 트랜잭션 내에서 실행해야 합니다.
3. **일련번호 초기화**: 일련번호를 초기화하면 이미 사용된 코드와 중복될 수 있으므로 주의가 필요합니다.
4. **Prefix 변경**: Prefix를 변경하면 기존 데이터와 일관성이 깨질 수 있습니다.
5. **백업**: 프로덕션 환경에서 규칙을 변경하기 전에 반드시 백업을 수행하세요.

## 마이그레이션

### Alembic 마이그레이션 생성

```bash
cd apps/backend-api

# 마이그레이션 파일 생성
alembic revision --autogenerate -m "add_sys_code_rules_table"

# 마이그레이션 실행
alembic upgrade head
```

## 문제 해결

### 코드 중복 발생 시

```sql
-- 현재 최대 코드 확인
SELECT MAX(code) FROM partners WHERE code LIKE 'MBP%';

-- 일련번호를 최대값+1로 설정
UPDATE sys_code_rules
SET current_number = (
    SELECT CAST(SUBSTRING(MAX(code), 4) AS INTEGER)
    FROM partners 
    WHERE code LIKE 'MBP%'
)
WHERE entity_code = 'PARTNER';
```

### 락 대기 시간 초과 시

```sql
-- 세션 타임아웃 조정
SET lock_timeout = '10s';

-- 또는 트랜잭션 분리
```

## 관련 문서

- [코드 규칙 관리 페이지 사용법](../../../docs/user-guide/sys-code-rules.md)
- [SQLAlchemy 모델](../../../apps/backend-api/src/models/tenants/sys/code_rule.py)
- [코드 자동 생성 유틸리티](../../../apps/tenants-web/src/lib/code-generator.ts)
