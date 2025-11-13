# sys.users vs hrm.employees 통합 마이그레이션 - 완료

**프로젝트**: ConexGrow
**수정 대상**: Tenants Database (tnnt_db)
**상태**: ✅ 완료 (100%)
**날짜**: 2024-10-26

---

## 🎯 개요

ConexGrow Tenants DB의 `sys.users`(시스템 인증)와 `hrm.employees`(직원 정보) 간의
**중복 필드 문제를 해결**하기 위한 4주 마이그레이션 계획입니다.

### 문제점 분석

| 항목 | 문제 | 영향도 |
|------|------|--------|
| **관계** | 두 테이블 간 관계 없음 | 🔴 높음 |
| **department_id** | sys.users에 FK 제약 없음 | 🔴 높음 |
| **email** | 동일 인물도 다른 이메일 가능 | 🟠 중간 |
| **job_level** | 구조화된 직급 정보 sys.users에 없음 | 🟠 중간 |
| **position** | 이름만 다르고 같은 개념 | 🟠 중간 |
| **status** | 활성/비활성 정보 불일치 | 🟠 중간 |

### 해결책

```
BEFORE (분리된 상태)
├─ sys.users ────────────────── hrm.employees
│  (로그인, 권한)              (직원, 급여)
│  ❌ 관계 없음
│  ❌ FK 제약 없음
│  ❌ 데이터 불일치 위험

AFTER (통합된 상태)
├─ sys.users ◄─────user_id────► hrm.employees
│  (로그인, 권한)     (1:1)      (직원, 급여)
│  ✅ FK 제약
│  ✅ 자동 동기화
│  ✅ 통합 뷰
```

---

## 📁 생성된 파일 (총 8개)

### 마이그레이션 스크립트 (4개)

1. **WEEK1_add_department_fk.sql** (5.4 KB)
   - 위치: `packages/database/schemas/tenants/22_sys/`
   - 목표: sys.users.department_id FK 추가
   - 내용:
     - 고아 부서 참조 정리
     - FK 제약 추가 (ON DELETE SET NULL)
     - 검증 뷰 생성

2. **WEEK2_add_user_relationship.sql** (8.8 KB)
   - 위치: `packages/database/schemas/tenants/02_hrm/`
   - 목표: hrm.employees.user_id FK 추가
   - 내용:
     - user_id 컬럼 추가
     - EMAIL 기반 자동 매칭
     - 1:1 관계 FK 제약 추가
     - 유니크 인덱스 추가

3. **WEEK3_synchronize_fields.sql** (10 KB)
   - 위치: `packages/database/schemas/tenants/22_sys/`
   - 목표: job_level, email, position 자동 동기화
   - 내용:
     - job_level 컬럼 추가
     - 3개 동기화 트리거 함수
     - 3개 자동 동기화 트리거
     - 검증 뷰 생성

4. **WEEK4_create_unified_views.sql** (13 KB)
   - 위치: `packages/database/schemas/tenants/22_sys/`
   - 목표: 통합 조회 인터페이스 생성
   - 내용:
     - v_user_profile
     - v_user_auth_status
     - v_employee_directory
     - v_organization_chart
     - v_migration_progress

### 스키마 수정 파일 (2개)

5. **01_users.sql** (수정됨)
   - 위치: `packages/database/schemas/tenants/22_sys/`
   - 변경:
     - `job_level` 컬럼 추가
     - `job_level` 인덱스 추가
     - `department_id` FK 제약 추가

6. **02_employees.sql** (수정됨)
   - 위치: `packages/database/schemas/tenants/02_hrm/`
   - 변경:
     - `user_id` 컬럼 추가
     - `user_id` FK 제약 추가
     - `user_id` 유니크 인덱스 추가
     - `user_id` 조회 인덱스 추가

### 문서 파일 (2개)

7. **USER_EMPLOYEE_INTEGRATION_IMPLEMENTATION.md** (16 KB)
   - 위치: `packages/database/schemas/tenants/`
   - 내용: 상세한 구현 가이드 및 SQL 예제

8. **USER_EMPLOYEE_MIGRATION_README.md** (이 파일)
   - 위치: `/home/itjee/workspace/cxg/`
   - 내용: 프로젝트 개요 및 실행 가이드

---

## 🚀 실행 방법

### 순서대로 실행 (반드시 이 순서 준수)

```bash
# 1. 주1: 데이터 무결성 (약 2시간)
cd /home/itjee/workspace/cxg
psql -U postgres -d tnnt_db -f packages/database/schemas/tenants/22_sys/WEEK1_add_department_fk.sql

# 2. 주2: 관계 설정 (약 4시간)
psql -U postgres -d tnnt_db -f packages/database/schemas/tenants/02_hrm/WEEK2_add_user_relationship.sql

# 3. 주3: 데이터 일관성 (약 3시간)
psql -U postgres -d tnnt_db -f packages/database/schemas/tenants/22_sys/WEEK3_synchronize_fields.sql

# 4. 주4: 통합 인터페이스 (약 3시간)
psql -U postgres -d tnnt_db -f packages/database/schemas/tenants/22_sys/WEEK4_create_unified_views.sql
```

### 각 주차별 상세 설명

#### 주1: 데이터 무결성 (WEEK1_add_department_fk.sql)

**목표**: sys.users의 department_id 필드를 hrm.departments와 연결

**수행 작업**:
1. 존재하지 않는 부서를 참조하는 사용자 정리
2. FK 제약 추가: `sys.users.department_id` → `hrm.departments(id)`
3. 검증 뷰 생성: `v_user_department_validation`

**검증 쿼리**:
```sql
-- 데이터 무결성 확인 (결과: 0)
SELECT COUNT(*)
FROM sys.users u
LEFT JOIN hrm.departments d ON d.id = u.department_id
WHERE u.department_id IS NOT NULL AND d.id IS NULL;
```

---

#### 주2: 관계 설정 (WEEK2_add_user_relationship.sql)

**목표**: hrm.employees와 sys.users 간의 1:1 관계 설정

**수행 작업**:
1. `user_id` 컬럼 추가 (nullable - 계약자/외부인력 지원)
2. EMAIL 기반 자동 매칭
3. FK 제약 추가: `hrm.employees.user_id` → `sys.users(id)`
4. 유니크 인덱스 추가 (1:1 관계 강제)

**검증 쿼리**:
```sql
-- 매칭 현황 확인
SELECT
    COUNT(*) as total_employees,
    SUM(CASE WHEN user_id IS NOT NULL THEN 1 ELSE 0 END) as matched,
    ROUND(100.0 * SUM(CASE WHEN user_id IS NOT NULL THEN 1 ELSE 0 END) / COUNT(*), 1) as match_pct
FROM hrm.employees WHERE is_deleted = false;

-- 수동 매칭 필요 항목 확인
SELECT id, code, name, email
FROM hrm.employees
WHERE user_id IS NULL AND is_deleted = false AND status = 'ACTIVE';
```

---

#### 주3: 데이터 일관성 (WEEK3_synchronize_fields.sql)

**목표**: hrm.employees 업데이트 시 sys.users 자동 동기화

**수행 작업**:
1. `sys.users`에 `job_level` 컬럼 추가
2. 동기화 트리거 함수 3개 생성:
   - `sync_user_job_level()`: 직급 동기화
   - `sync_user_email()`: 이메일 동기화
   - `sync_user_position()`: 직책 동기화
3. 트리거 3개 생성

**동기화 메커니즘**:
```sql
-- hrm.employees의 job_level 변경 시 자동으로 sys.users 동기화
UPDATE hrm.employees SET job_level = 'DIRECTOR' WHERE id = '...';
-- → sys.users.job_level도 자동으로 'DIRECTOR'로 변경됨
```

**검증 뷰**:
```sql
-- 동기화 상태 확인
SELECT * FROM v_user_employee_sync_status;

-- 동기화되지 않은 항목만
SELECT * FROM v_user_employee_sync_issues;

-- 통계
SELECT overall_status, COUNT(*) FROM v_user_employee_sync_status GROUP BY overall_status;
```

---

#### 주4: 통합 인터페이스 (WEEK4_create_unified_views.sql)

**목표**: 통합 조회 뷰를 통해 쉬운 데이터 접근

**생성된 뷰 5개**:

1. **v_user_profile** - 사용자 + 직원 통합 정보
   ```sql
   SELECT * FROM v_user_profile WHERE username = 'john.doe';
   ```

2. **v_user_auth_status** - 권한 상태
   ```sql
   SELECT * FROM v_user_auth_status WHERE can_login = true;
   ```

3. **v_employee_directory** - 직원 디렉토리
   ```sql
   SELECT * FROM v_employee_directory WHERE department_name = 'Development';
   ```

4. **v_organization_chart** - 조직도 (계층 구조)
   ```sql
   SELECT tree_display FROM v_organization_chart WHERE level <= 3;
   ```

5. **v_migration_progress** - 마이그레이션 진행 상황
   ```sql
   SELECT * FROM v_migration_progress;
   ```

---

## 📊 마이그레이션 확인

### 완료 확인 체크리스트

```sql
-- ✅ FK 제약 확인
SELECT constraint_name FROM information_schema.table_constraints
WHERE table_schema = 'sys' AND table_name = 'users'
  AND constraint_name LIKE '%fk%';
-- 결과: fk_users__department_id, fk_users__role_id

SELECT constraint_name FROM information_schema.table_constraints
WHERE table_schema = 'hrm' AND table_name = 'employees'
  AND constraint_name LIKE '%fk%';
-- 결과: fk_employees__user_id, fk_employees__department_id, ...

-- ✅ 컬럼 확인
SELECT column_name FROM information_schema.columns
WHERE table_schema = 'sys' AND table_name = 'users'
  AND column_name = 'job_level';
-- 결과: job_level

SELECT column_name FROM information_schema.columns
WHERE table_schema = 'hrm' AND table_name = 'employees'
  AND column_name = 'user_id';
-- 결과: user_id

-- ✅ 트리거 확인
SELECT trigger_name FROM information_schema.triggers
WHERE trigger_schema = 'hrm' AND trigger_name LIKE '%sync%';
-- 결과: trg_sync_user_job_level, trg_sync_user_email, trg_sync_user_position

-- ✅ 뷰 확인
SELECT table_name FROM information_schema.views
WHERE table_schema IN ('sys', 'hrm') AND table_name LIKE 'v_%'
ORDER BY table_name;
-- 결과: v_employee_directory, v_migration_progress, v_organization_chart,
--       v_user_auth_status, v_user_profile, ...

-- ✅ 데이터 무결성 확인
SELECT COUNT(*) FROM sys.users WHERE is_deleted = false;
SELECT COUNT(*) FROM hrm.employees WHERE is_deleted = false;
SELECT COUNT(*) FROM hrm.employees WHERE user_id IS NOT NULL AND is_deleted = false;
```

---

## 🔧 API 엔드포인트 구현 (예시)

마이그레이션 후 FastAPI에서 다음과 같이 구현 가능:

### 사용자 프로필 조회
```python
# GET /api/v1/users/{user_id}
from fastapi import APIRouter, Depends
from sqlalchemy import text

@router.get("/users/{user_id}")
async def get_user_profile(user_id: str, db = Depends(get_db)):
    result = db.execute(text(
        "SELECT * FROM v_user_profile WHERE user_id = :user_id"
    ), {"user_id": user_id})
    return result.first()
```

### 직원 디렉토리 검색
```python
# GET /api/v1/employees?department=Sales&search=john
@router.get("/employees")
async def search_employees(department: str = None, search: str = None, db = Depends(get_db)):
    query = "SELECT * FROM v_employee_directory WHERE 1=1"
    params = {}

    if department:
        query += " AND department_name = :department"
        params["department"] = department

    if search:
        query += " AND (employee_name ILIKE :search OR email ILIKE :search)"
        params["search"] = f"%{search}%"

    return db.execute(text(query), params).fetchall()
```

### 마이그레이션 진행 상황
```python
# GET /api/v1/admin/migration-progress
@router.get("/admin/migration-progress")
async def get_migration_progress(db = Depends(get_db)):
    result = db.execute(text("SELECT * FROM v_migration_progress"))
    return {row.metric: float(row.percentage) for row in result.fetchall()}
```

---

## ⚠️ 주의사항

### 마이그레이션 전

1. **반드시 백업 수행**
   ```bash
   pg_dump -U postgres tnnt_db > tnnt_db_backup_20241026.sql
   ```

2. **영향받는 시스템 확인**
   - 로그인 인증 시스템
   - 직원 정보 시스템
   - 권한/권리 관리 시스템

3. **테스트 데이터로 먼저 검증**
   ```bash
   # 테스트 DB에서 먼저 실행
   psql -U postgres -d tnnt_db_test -f WEEK1_add_department_fk.sql
   ```

### 마이그레이션 중

1. **각 주차를 차례로 실행** (순서 중요!)
2. **각 단계 후 검증 쿼리 실행**
3. **오류 발생 시 롤백 (아래 참고)**

### 마이그레이션 후

1. **모든 뷰 생성 확인**
2. **데이터 일관성 확인**
3. **API 엔드포인트 테스트**
4. **프로덕션 배포**

---

## 🔄 롤백 방법

각 주차별 롤백 스크립트:

### 주1 롤백
```sql
ALTER TABLE sys.users DROP CONSTRAINT IF EXISTS fk_users__department_id;
DROP VIEW IF EXISTS v_user_department_validation CASCADE;
```

### 주2 롤백
```sql
ALTER TABLE hrm.employees DROP CONSTRAINT IF EXISTS fk_employees__user_id;
DROP INDEX IF EXISTS ux_employees__user_id;
ALTER TABLE hrm.employees DROP COLUMN IF EXISTS user_id;
```

### 주3 롤백
```sql
DROP TRIGGER IF EXISTS trg_sync_user_job_level ON hrm.employees;
DROP TRIGGER IF EXISTS trg_sync_user_email ON hrm.employees;
DROP TRIGGER IF EXISTS trg_sync_user_position ON hrm.employees;
DROP FUNCTION IF EXISTS sync_user_job_level();
DROP FUNCTION IF EXISTS sync_user_email();
DROP FUNCTION IF EXISTS sync_user_position();
ALTER TABLE sys.users DROP COLUMN IF EXISTS job_level;
```

### 주4 롤백
```sql
DROP VIEW IF EXISTS v_user_profile CASCADE;
DROP VIEW IF EXISTS v_user_auth_status CASCADE;
DROP VIEW IF EXISTS v_employee_directory CASCADE;
DROP VIEW IF EXISTS v_organization_chart CASCADE;
DROP VIEW IF EXISTS v_migration_progress CASCADE;
```

---

## 📈 기대 효과

### 데이터 품질 향상
- ✅ 존재하지 않는 부서 참조 제거
- ✅ 직원과 사용자 간 명확한 1:1 관계
- ✅ 자동 데이터 동기화로 불일치 방지

### 개발자 경험 개선
- ✅ 단순한 쿼리로 사용자+직원 통합 정보 조회
- ✅ 권한 검증 시 직급(job_level) 활용 가능
- ✅ 조직도 생성이 간단해짐

### 운영 효율화
- ✅ 직원 정보 변경 시 자동으로 시스템 사용자 정보 동기화
- ✅ 휴직/퇴직 직원 로그인 자동 제한 가능
- ✅ 조직 변경 사항 실시간 반영

---

## 📚 관련 문서

- `packages/database/schemas/tenants/USER_EMPLOYEE_INTEGRATION_IMPLEMENTATION.md`
  → 상세 구현 가이드 (348줄)

- `packages/database/schemas/tenants/22_sys/README.md`
  → sys 스키마 문서

- `packages/database/schemas/tenants/02_hrm/README.md`
  → hrm 스키마 문서

---

## ✅ 완료

**총 생성 파일**: 8개 (마이그레이션 4개 + 수정 2개 + 문서 2개)
**총 용량**: ~52 KB (SQL + 문서)
**예상 소요 시간**: 12시간 (4주)
**리스크 수준**: 🟢 낮음

**다음 단계**:
1. 마이그레이션 스크립트 실행
2. API 엔드포인트 구현
3. 통합 테스트 실행
4. 프로덕션 배포

---

**버전**: 1.0
**최종 수정**: 2024-10-26
**상태**: ✅ 완료
