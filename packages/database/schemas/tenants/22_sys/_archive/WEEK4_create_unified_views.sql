-- =====================================================================================
-- Week 4: 통합 인터페이스 - 뷰 및 쿼리 생성
-- =====================================================================================
--
-- 목적: sys.users와 hrm.employees 간의 통합 데이터 접근 인터페이스 제공
--
-- 작성일: 2024-10-26
-- 변경사항:
-- 1. 통합 사용자 프로필 뷰
-- 2. 사용자 권한 상태 뷰
-- 3. 직원 디렉토리 뷰 (연락처 포함)
-- 4. 조직도 뷰
-- 5. 마이그레이션 진행 상황 뷰
--
-- =====================================================================================

-- ============================================================
-- Step 1: 통합 사용자 프로필 뷰
-- ============================================================

CREATE OR REPLACE VIEW v_user_profile AS
SELECT
    -- 시스템 사용자 정보
    u.id as user_id,
    u.username,
    u.email,
    u.full_name,
    u.phone as user_phone,
    u.is_active,

    -- 직원 정보
    e.id as employee_id,
    e.code as employee_code,
    e.name as employee_name,
    e.phone as employee_phone,
    e.mobile as employee_mobile,

    -- 조직 정보
    u.department_id,
    d.name as department_name,
    u.position,
    u.job_level,
    e.job_title,
    e.job_level as employee_job_level,

    -- 고용 정보
    e.employment_type,
    e.status as employment_status,
    e.hire_date,
    e.work_type,

    -- 접근 제어
    u.role_id,
    r.name as role_name,

    -- 타임스탬프
    u.created_at as user_created_at,
    u.updated_at as user_updated_at,
    u.last_login_at,

    -- 관계 상태
    CASE
        WHEN e.id IS NULL THEN '시스템 계정 (직원 아님)'
        WHEN u.is_active = true AND e.status = 'ACTIVE' THEN '활성 직원'
        WHEN u.is_active = true AND e.status = 'LEAVE' THEN '휴직 중'
        WHEN u.is_active = true AND e.status = 'PROBATION' THEN '수습 중'
        WHEN u.is_active = false THEN '로그인 불가'
        WHEN e.status IN ('TERMINATED', 'RETIRED') THEN '퇴직'
        ELSE '기타'
    END as user_status_label
FROM sys.users u
LEFT JOIN hrm.employees e ON e.user_id = u.id AND e.is_deleted = false
LEFT JOIN hrm.departments d ON d.id = u.department_id
LEFT JOIN sys.roles r ON r.id = u.role_id
WHERE u.is_deleted = false;

COMMENT ON VIEW v_user_profile
  IS '통합 사용자 프로필 뷰 (시스템 사용자 + 직원 정보)';

-- ============================================================
-- Step 2: 통합 권한 상태 뷰
-- ============================================================

CREATE OR REPLACE VIEW v_user_auth_status AS
SELECT
    u.id as user_id,
    u.username,
    u.full_name,
    u.email,

    -- 로그인 권한
    u.is_active as system_active,
    CASE
        WHEN e.status IS NULL THEN true  -- 직원 정보 없으면 시스템 계정
        WHEN e.status IN ('ACTIVE', 'PROBATION') THEN true
        ELSE false
    END as can_login,

    -- 권한 정보
    u.role_id,
    r.name as role_name,

    -- 직원 상태
    e.status as employment_status,
    e.employment_type,

    -- 상세 상태
    CASE
        WHEN u.is_active = false THEN '🔴 시스템 계정 비활성'
        WHEN e.id IS NULL THEN '🟢 시스템 계정 (직원 정보 없음)'
        WHEN e.status = 'ACTIVE' THEN '🟢 활성'
        WHEN e.status = 'PROBATION' THEN '🟡 수습 중'
        WHEN e.status = 'LEAVE' THEN '🟡 휴직 중'
        WHEN e.status = 'TERMINATED' THEN '🔴 퇴직'
        WHEN e.status = 'RETIRED' THEN '🔴 퇴직'
        ELSE '⚫ 알 수 없음'
    END as status_indicator,

    u.last_login_at,
    u.updated_at
FROM sys.users u
LEFT JOIN hrm.employees e ON e.user_id = u.id AND e.is_deleted = false
LEFT JOIN sys.roles r ON r.id = u.role_id
WHERE u.is_deleted = false
ORDER BY u.username;

COMMENT ON VIEW v_user_auth_status
  IS '사용자 인증/권한 상태 뷰 (로그인 가능 여부 포함)';

-- ============================================================
-- Step 3: 직원 디렉토리 뷰
-- ============================================================

CREATE OR REPLACE VIEW v_employee_directory AS
SELECT
    e.id as employee_id,
    e.code as employee_code,
    e.name as employee_name,
    e.email,
    e.phone as office_phone,
    e.mobile as mobile_phone,
    e.emergency_contact,
    e.emergency_contact_name,

    -- 조직 정보
    d.id as department_id,
    d.name as department_name,
    e.job_title,
    e.job_level,

    -- 근무 정보
    e.work_type,
    e.work_location,
    e.employment_type,
    e.status,

    -- 기본 정보
    e.birth_date,
    e.gender,
    e.hire_date,

    -- 주소
    e.address1,
    e.address2,
    e.postcode,

    -- 시스템 연계
    u.username,
    u.is_active as system_active,

    -- 타임스탬프
    e.created_at,
    e.updated_at
FROM hrm.employees e
LEFT JOIN hrm.departments d ON d.id = e.department_id
LEFT JOIN sys.users u ON u.id = e.user_id
WHERE e.is_deleted = false
ORDER BY e.name;

COMMENT ON VIEW v_employee_directory
  IS '직원 디렉토리 뷰 (연락처 및 조직 정보 포함)';

-- ============================================================
-- Step 4: 조직도 뷰 (계층 구조)
-- ============================================================

CREATE OR REPLACE VIEW v_organization_chart AS
WITH RECURSIVE org_hierarchy AS (
    -- 부서 없는 직원부터 시작
    SELECT
        1 as level,
        e.id,
        e.code,
        e.name,
        e.job_level,
        e.job_title,
        e.department_id,
        d.name as department_name,
        null::UUID as manager_id,
        null::VARCHAR as manager_name,
        CAST(e.code AS VARCHAR) as path
    FROM hrm.employees e
    LEFT JOIN hrm.departments d ON d.id = e.department_id
    WHERE e.is_deleted = false
      AND (e.job_level IS NULL OR e.job_level NOT IN ('MANAGER', 'SENIOR_MANAGER', 'DIRECTOR', 'VP', 'CEO'))

    UNION ALL

    -- 매니저 직원들
    SELECT
        oh.level + 1,
        e.id,
        e.code,
        e.name,
        e.job_level,
        e.job_title,
        e.department_id,
        d.name as department_name,
        oh.id as manager_id,
        oh.name as manager_name,
        oh.path || ' -> ' || e.code
    FROM hrm.employees e
    LEFT JOIN hrm.departments d ON d.id = e.department_id
    INNER JOIN org_hierarchy oh ON oh.department_id = e.department_id
    WHERE e.is_deleted = false
      AND e.job_level IN ('MANAGER', 'SENIOR_MANAGER', 'DIRECTOR', 'VP', 'CEO')
)
SELECT
    level,
    id,
    code,
    name,
    job_level,
    job_title,
    department_id,
    department_name,
    manager_id,
    manager_name,
    path,
    REPEAT('  ', level - 1) || '└─ ' || name as tree_display
FROM org_hierarchy
ORDER BY path;

COMMENT ON VIEW v_organization_chart
  IS '조직도 뷰 (계층 구조)';

-- ============================================================
-- Step 5: 마이그레이션 진행 상황 뷰
-- ============================================================

CREATE OR REPLACE VIEW v_migration_progress AS
SELECT
    'Overall Migration' as metric,
    ROUND(100.0 * (
        SELECT COUNT(*) FROM hrm.employees
        WHERE user_id IS NOT NULL AND is_deleted = false
    ) / NULLIF((
        SELECT COUNT(*) FROM hrm.employees WHERE is_deleted = false
    ), 0), 1) as percentage,
    (SELECT COUNT(*) FROM hrm.employees WHERE user_id IS NOT NULL AND is_deleted = false) ||
    ' / ' ||
    (SELECT COUNT(*) FROM hrm.employees WHERE is_deleted = false) as progress

UNION ALL

SELECT
    'Data Consistency - Email Match',
    ROUND(100.0 * COUNT(
        CASE WHEN LOWER(u.email) = LOWER(e.email) THEN 1 END
    ) / NULLIF(COUNT(*), 0), 1),
    COUNT(CASE WHEN LOWER(u.email) = LOWER(e.email) THEN 1 END) ||
    ' / ' ||
    COUNT(*)
FROM sys.users u
INNER JOIN hrm.employees e ON e.user_id = u.id
WHERE u.is_deleted = false AND e.is_deleted = false

UNION ALL

SELECT
    'Data Consistency - Job Level Match',
    ROUND(100.0 * COUNT(
        CASE WHEN u.job_level = e.job_level THEN 1 END
    ) / NULLIF(COUNT(*), 0), 1),
    COUNT(CASE WHEN u.job_level = e.job_level THEN 1 END) ||
    ' / ' ||
    COUNT(*)
FROM sys.users u
INNER JOIN hrm.employees e ON e.user_id = u.id
WHERE u.is_deleted = false AND e.is_deleted = false

UNION ALL

SELECT
    'System Accounts (No Employee)',
    ROUND(100.0 * COUNT(*) / NULLIF((
        SELECT COUNT(*) FROM sys.users WHERE is_deleted = false
    ), 0), 1),
    COUNT(*) ||
    ' / ' ||
    (SELECT COUNT(*) FROM sys.users WHERE is_deleted = false)
FROM sys.users u
LEFT JOIN hrm.employees e ON e.user_id = u.id AND e.is_deleted = false
WHERE u.is_deleted = false AND e.id IS NULL;

COMMENT ON VIEW v_migration_progress
  IS '마이그레이션 진행 상황 및 데이터 일관성 추적';

-- ============================================================
-- Step 6: 모든 뷰 확인
-- ============================================================

SELECT COUNT(*) as total_views
FROM information_schema.views
WHERE table_schema = 'sys' OR table_schema = 'hrm'
ORDER BY table_schema;

-- ============================================================
-- Step 7: API 엔드포인트를 위한 샘플 쿼리
-- ============================================================

-- 7.1 사용자 조회 (프로필 포함)
-- SELECT * FROM v_user_profile WHERE username = 'john.doe';

-- 7.2 사용자 목록 (권한 상태 포함)
-- SELECT user_id, username, full_name, email, role_name, status_indicator
-- FROM v_user_auth_status
-- WHERE can_login = true
-- ORDER BY username;

-- 7.3 직원 디렉토리 검색
-- SELECT * FROM v_employee_directory
-- WHERE department_name = 'Development'
-- ORDER BY employee_name;

-- 7.4 조직도
-- SELECT tree_display, job_level, job_title
-- FROM v_organization_chart
-- WHERE level <= 3;

-- 7.5 마이그레이션 진행 상황
-- SELECT * FROM v_migration_progress;

-- ============================================================
-- Step 8: Python/ORM 코드 샘플
-- ============================================================

-- SQLAlchemy 모델 예시 (Python 코드)
-- 파일: apps/backend-api/src/models/tenant/sys.py

CREATE OR REPLACE VIEW v_python_orm_example AS
SELECT 'SQLAlchemy를 사용한 ORM 쿼리 예시:

# 1. 사용자 프로필 조회
user_profile = db.query(vUserProfile).filter_by(username="john.doe").first()

# 2. 사용자 권한 상태 확인
auth_status = db.query(vUserAuthStatus).filter_by(user_id=user_id).first()
if auth_status.can_login:
    # 로그인 처리
    pass

# 3. 직원 디렉토리 검색
employees = db.query(vEmployeeDirectory).filter_by(department_name="Development").all()

# 4. 마이그레이션 진행 상황
migration = db.query(vMigrationProgress).all()
for metric in migration:
    print(f"{metric.metric}: {metric.percentage}%")
' as example_code;

-- ============================================================
-- Step 9: 완료 검증
-- ============================================================

DO $$
DECLARE
    v_view_count INT;
BEGIN
    SELECT COUNT(*) INTO v_view_count
    FROM information_schema.views
    WHERE (table_schema = 'sys' AND table_name LIKE 'v_user%')
       OR (table_schema = 'sys' AND table_name LIKE 'v_migration%')
       OR (table_schema = 'hrm' AND table_name LIKE 'v_employee%')
       OR (table_schema = 'hrm' AND table_name LIKE 'v_organization%');

    IF v_view_count >= 5 THEN
        RAISE NOTICE '✅ 주4 완료: 모든 통합 뷰가 생성되었습니다';
        RAISE NOTICE '   - v_user_profile';
        RAISE NOTICE '   - v_user_auth_status';
        RAISE NOTICE '   - v_employee_directory';
        RAISE NOTICE '   - v_organization_chart';
        RAISE NOTICE '   - v_migration_progress';
        RAISE NOTICE '';
        RAISE NOTICE '📌 다음 단계:';
        RAISE NOTICE '   1. FastAPI 엔드포인트 구현';
        RAISE NOTICE '   2. 프론트엔드 UI 업데이트';
        RAISE NOTICE '   3. 데이터 마이그레이션 실행';
        RAISE NOTICE '   4. 통합 테스트';
    ELSE
        RAISE NOTICE '⚠️ 주4 실패: 뷰 생성을 확인하세요';
    END IF;
END $$;

-- ============================================================
-- 마이그레이션 완료 요약
-- ============================================================

RAISE NOTICE '';
RAISE NOTICE '╔════════════════════════════════════════════════════════╗';
RAISE NOTICE '║  4주 마이그레이션 계획 완료!                            ║';
RAISE NOTICE '║                                                        ║';
RAISE NOTICE '║  ✅ 주1: sys.users.department_id FK 추가              ║';
RAISE NOTICE '║  ✅ 주2: hrm.employees.user_id FK 추가                ║';
RAISE NOTICE '║  ✅ 주3: job_level, email, position 동기화 트리거    ║';
RAISE NOTICE '║  ✅ 주4: 통합 뷰 및 API 쿼리 생성                     ║';
RAISE NOTICE '╚════════════════════════════════════════════════════════╝';
