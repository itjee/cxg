-- =====================================================================================
-- Week 2: 관계 설정 - hrm.employees에 sys.users 관계 추가
-- =====================================================================================
--
-- 목적: hrm.employees 테이블에 user_id 필드를 추가하여 직원과 시스템 사용자 간의
--      명확한 1:1 관계를 설정
--
-- 작성일: 2024-10-26
-- 변경사항:
-- 1. user_id 컬럼 추가 (nullable - 계약자/외부인력용)
-- 2. user_id FK 제약 추가: hrm.employees.user_id → sys.users(id)
-- 3. user_id 유니크 인덱스 추가 (1:1 관계 강제)
-- 4. 기존 직원-사용자 매칭
-- 5. 검증 뷰 생성
--
-- 주의: 이 스크립트는 매칭 전략에 따라 커스터마이징이 필요할 수 있습니다.
--      실행 전에 반드시 백업을 수행하세요.
--
-- =====================================================================================

-- ============================================================
-- Step 1: user_id 컬럼 추가 (아직 추가 안 했다면)
-- ============================================================

-- 컬럼 추가 여부 확인
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'hrm'
          AND table_name = 'employees'
          AND column_name = 'user_id'
    ) THEN
        ALTER TABLE hrm.employees ADD COLUMN user_id UUID;
        RAISE NOTICE '✅ user_id 컬럼이 추가되었습니다';
    ELSE
        RAISE NOTICE '⚠️ user_id 컬럼이 이미 존재합니다';
    END IF;
END $$;

-- ============================================================
-- Step 2: 기존 직원-사용자 매칭 (EMAIL 기반)
-- ============================================================
--
-- 전략: 같은 이메일을 가진 직원과 사용자를 매칭
--       이메일이 일치하는 경우만 매칭 (안전함)

-- 매칭 전 상태 확인
CREATE TEMPORARY VIEW v_matching_candidates AS
SELECT
    e.id as employee_id,
    e.code as employee_code,
    e.name as employee_name,
    e.email as employee_email,
    e.user_id as current_user_id,
    u.id as matched_user_id,
    u.username as matched_username,
    u.full_name as matched_full_name,
    u.email as matched_user_email,
    CASE
        WHEN e.user_id IS NOT NULL AND e.user_id = u.id THEN '이미 매칭됨'
        WHEN e.user_id IS NOT NULL AND e.user_id != u.id THEN '⚠️ 다른 사용자로 매칭됨'
        WHEN e.user_id IS NULL AND u.id IS NOT NULL THEN '매칭 가능'
        ELSE '⚠️ 매칭 불가'
    END as match_status
FROM hrm.employees e
LEFT JOIN sys.users u ON LOWER(e.email) = LOWER(u.email)
WHERE e.is_deleted = false
  AND u.is_deleted = false;

-- 매칭 가능한 케이스 확인
SELECT * FROM v_matching_candidates
WHERE match_status = '매칭 가능';

-- EMAIL 기반 자동 매칭 실행
UPDATE hrm.employees e
SET user_id = u.id
FROM sys.users u
WHERE LOWER(e.email) = LOWER(u.email)
  AND e.user_id IS NULL
  AND e.is_deleted = false
  AND u.is_deleted = false;

-- 매칭 결과 확인
SELECT COUNT(*) as matched_count
FROM hrm.employees
WHERE user_id IS NOT NULL
  AND is_deleted = false;

-- ============================================================
-- Step 3: 수동 매칭 필요 항목 확인
-- ============================================================
--
-- 이메일로 매칭되지 않은 직원 확인
-- 이 경우 수동으로 user_id를 설정해야 합니다.

CREATE TEMPORARY VIEW v_unmatched_employees AS
SELECT
    e.id,
    e.code,
    e.name,
    e.email,
    e.user_id,
    '수동 매칭 필요' as note
FROM hrm.employees e
WHERE e.user_id IS NULL
  AND e.is_deleted = false
  AND e.status = 'ACTIVE';

-- 수동 매칭 필요 항목 조회
SELECT * FROM v_unmatched_employees;

-- 수동 매칭 예시 (필요시 실행)
-- UPDATE hrm.employees
-- SET user_id = '00000000-0000-0000-0000-000000000000'::UUID
-- WHERE id = '00000000-0000-0000-0000-000000000000'::UUID
--   AND is_deleted = false;

-- ============================================================
-- Step 4: FK 제약 조건 추가
-- ============================================================

-- FK 제약 여부 확인
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE table_schema = 'hrm'
          AND table_name = 'employees'
          AND constraint_name = 'fk_employees__user_id'
    ) THEN
        ALTER TABLE hrm.employees
          ADD CONSTRAINT fk_employees__user_id
            FOREIGN KEY (user_id)
            REFERENCES sys.users(id)
            ON DELETE SET NULL;
        RAISE NOTICE '✅ FK 제약이 추가되었습니다';
    ELSE
        RAISE NOTICE '⚠️ FK 제약이 이미 존재합니다';
    END IF;
END $$;

-- ============================================================
-- Step 5: 유니크 인덱스 추가 (1:1 관계 강제)
-- ============================================================

-- 유니크 인덱스 여부 확인
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE schemaname = 'hrm'
          AND tablename = 'employees'
          AND indexname = 'ux_employees__user_id'
    ) THEN
        CREATE UNIQUE INDEX ux_employees__user_id
            ON hrm.employees (user_id)
         WHERE user_id IS NOT NULL
           AND is_deleted = false;
        RAISE NOTICE '✅ 유니크 인덱스가 추가되었습니다';
    ELSE
        RAISE NOTICE '⚠️ 유니크 인덱스가 이미 존재합니다';
    END IF;
END $$;

-- ============================================================
-- Step 6: 조회 인덱스 추가
-- ============================================================

-- user_id 조회 인덱스
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE schemaname = 'hrm'
          AND tablename = 'employees'
          AND indexname = 'ix_employees__user_id'
    ) THEN
        CREATE INDEX ix_employees__user_id
            ON hrm.employees (user_id)
         WHERE user_id IS NOT NULL
           AND is_deleted = false;
        RAISE NOTICE '✅ 조회 인덱스가 추가되었습니다';
    ELSE
        RAISE NOTICE '⚠️ 조회 인덱스가 이미 존재합니다';
    END IF;
END $$;

-- ============================================================
-- Step 7: 검증 뷰 생성
-- ============================================================

-- 사용자-직원 관계 검증 뷰
CREATE OR REPLACE VIEW v_user_employee_relationship AS
SELECT
    u.id as user_id,
    u.username,
    u.full_name as user_full_name,
    u.email as user_email,
    u.is_active,
    e.id as employee_id,
    e.code as employee_code,
    e.name as employee_name,
    e.email as employee_email,
    e.status as employment_status,
    CASE
        WHEN e.id IS NULL THEN '⚠️ 시스템 사용자만 존재'
        WHEN u.id IS NULL THEN '⚠️ 직원 정보 없음'
        WHEN LOWER(u.email) = LOWER(e.email) THEN '✓ 이메일 일치'
        ELSE '⚠️ 이메일 불일치'
    END as verification_status
FROM sys.users u
LEFT JOIN hrm.employees e ON e.user_id = u.id AND e.is_deleted = false
WHERE u.is_deleted = false
ORDER BY verification_status, u.created_at DESC;

COMMENT ON VIEW v_user_employee_relationship
  IS '사용자-직원 관계 검증 뷰 (1:1 관계 확인)';

-- ============================================================
-- Step 8: 검증 및 테스트
-- ============================================================

-- 관계 검증 뷰 조회
SELECT * FROM v_user_employee_relationship;

-- 통계: 매칭된 직원 수
SELECT
    COUNT(*) as total_employees,
    SUM(CASE WHEN user_id IS NOT NULL THEN 1 ELSE 0 END) as matched_employees,
    SUM(CASE WHEN user_id IS NULL THEN 1 ELSE 0 END) as unmatched_employees,
    ROUND(100.0 * SUM(CASE WHEN user_id IS NOT NULL THEN 1 ELSE 0 END) / COUNT(*), 1) as match_percentage
FROM hrm.employees
WHERE is_deleted = false;

-- FK 제약 테스트: 존재하지 않는 사용자로 UPDATE 시도 (실패해야 함)
-- BEGIN;
-- UPDATE hrm.employees
-- SET user_id = 'invalid-user-id'::UUID
-- WHERE id = (SELECT id FROM hrm.employees WHERE user_id IS NOT NULL LIMIT 1);
-- ROLLBACK;

-- ============================================================
-- 완료 메시지
-- ============================================================

DO $$
DECLARE
    v_fk_exists INT;
    v_matched_count INT;
BEGIN
    SELECT COUNT(*) INTO v_fk_exists
    FROM pg_constraint
    WHERE conname = 'fk_employees__user_id';

    SELECT COUNT(*) INTO v_matched_count
    FROM hrm.employees
    WHERE user_id IS NOT NULL
      AND is_deleted = false;

    IF v_fk_exists > 0 THEN
        RAISE NOTICE '✅ 주2 완료: hrm.employees.user_id FK가 성공적으로 추가되었습니다';
        RAISE NOTICE '   - 매칭된 직원: % 명', v_matched_count;
    ELSE
        RAISE NOTICE '⚠️ 주2 실패: FK 제약 추가를 확인하세요';
    END IF;
END $$;
