-- =====================================================================================
-- Week 3: 데이터 일관성 - job_level, email, position 동기화
-- =====================================================================================
--
-- 목적: sys.users와 hrm.employees 간의 데이터 일관성을 보장하는
--      동기화 메커니즘 구축
--
-- 작성일: 2024-10-26
-- 변경사항:
-- 1. sys.users에 job_level 컬럼 추가 (선택사항: 이미 추가되었으면 스킵)
-- 2. job_level 동기화 트리거 추가
-- 3. email 동기화 트리거 추가
-- 4. position 동기화 뷰 생성
-- 5. 데이터 일관성 검증 뷰 생성
--
-- 주의: 트리거는 hrm.employees 업데이트 시 sys.users를 자동으로 동기화합니다.
--      실행 전에 반드시 백업을 수행하세요.
--
-- =====================================================================================

-- ============================================================
-- Step 1: job_level 컬럼 추가 (아직 추가 안 했다면)
-- ============================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'sys'
          AND table_name = 'users'
          AND column_name = 'job_level'
    ) THEN
        ALTER TABLE sys.users ADD COLUMN job_level VARCHAR(50);
        RAISE NOTICE '✅ job_level 컬럼이 추가되었습니다';
    ELSE
        RAISE NOTICE '⚠️ job_level 컬럼이 이미 존재합니다';
    END IF;
END $$;

-- ============================================================
-- Step 2: 초기 데이터 동기화 (EMAIL 기반)
-- ============================================================

-- job_level 동기화
UPDATE sys.users u
SET job_level = e.job_level
FROM hrm.employees e
WHERE e.user_id = u.id
  AND u.job_level IS NULL
  AND e.job_level IS NOT NULL
  AND u.is_deleted = false
  AND e.is_deleted = false;

RAISE NOTICE '✅ job_level 초기 동기화 완료';

-- email 동기화 (선택사항: 필요시 사용)
-- 주의: 이메일을 변경할 경우 데이터 무결성에 영향을 줄 수 있습니다
-- UPDATE sys.users u
-- SET email = e.email
-- FROM hrm.employees e
-- WHERE e.user_id = u.id
--   AND LOWER(u.email) != LOWER(e.email)
--   AND u.is_deleted = false
--   AND e.is_deleted = false;

-- ============================================================
-- Step 3: 동기화 트리거 함수 생성
-- ============================================================

-- 3.1 job_level 동기화 트리거 함수
CREATE OR REPLACE FUNCTION sync_user_job_level()
RETURNS TRIGGER AS $$
BEGIN
    -- user_id가 설정되어 있으면 sys.users의 job_level을 업데이트
    IF NEW.user_id IS NOT NULL THEN
        UPDATE sys.users
        SET job_level = NEW.job_level,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.user_id
          AND is_deleted = false;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION sync_user_job_level()
  IS '직원의 job_level이 변경되면 sys.users.job_level을 자동으로 동기화';

-- 3.2 email 동기화 트리거 함수
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
    -- user_id가 설정되어 있으면 sys.users의 email을 업데이트
    IF NEW.user_id IS NOT NULL AND NEW.email IS NOT NULL THEN
        UPDATE sys.users
        SET email = NEW.email,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.user_id
          AND is_deleted = false;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION sync_user_email()
  IS '직원의 email이 변경되면 sys.users.email을 자동으로 동기화';

-- 3.3 position 동기화 함수
CREATE OR REPLACE FUNCTION sync_user_position()
RETURNS TRIGGER AS $$
BEGIN
    -- user_id가 설정되어 있으면 sys.users의 position을 업데이트
    IF NEW.user_id IS NOT NULL AND NEW.job_title IS NOT NULL THEN
        UPDATE sys.users
        SET position = NEW.job_title,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.user_id
          AND is_deleted = false;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION sync_user_position()
  IS '직원의 job_title이 변경되면 sys.users.position을 자동으로 동기화';

-- ============================================================
-- Step 4: 동기화 트리거 생성
-- ============================================================

-- 4.1 job_level 동기화 트리거
DROP TRIGGER IF EXISTS trg_sync_user_job_level ON hrm.employees;
CREATE TRIGGER trg_sync_user_job_level
AFTER UPDATE OF job_level ON hrm.employees
FOR EACH ROW
WHEN (OLD.user_id IS NOT NULL AND OLD.job_level IS DISTINCT FROM NEW.job_level)
EXECUTE FUNCTION sync_user_job_level();

COMMENT ON TRIGGER trg_sync_user_job_level ON hrm.employees
  IS '직원의 job_level 변경 시 sys.users 동기화';

-- 4.2 email 동기화 트리거
DROP TRIGGER IF EXISTS trg_sync_user_email ON hrm.employees;
CREATE TRIGGER trg_sync_user_email
AFTER UPDATE OF email ON hrm.employees
FOR EACH ROW
WHEN (OLD.user_id IS NOT NULL AND OLD.email IS DISTINCT FROM NEW.email)
EXECUTE FUNCTION sync_user_email();

COMMENT ON TRIGGER trg_sync_user_email ON hrm.employees
  IS '직원의 email 변경 시 sys.users 동기화';

-- 4.3 position 동기화 트리거
DROP TRIGGER IF EXISTS trg_sync_user_position ON hrm.employees;
CREATE TRIGGER trg_sync_user_position
AFTER UPDATE OF job_title ON hrm.employees
FOR EACH ROW
WHEN (OLD.user_id IS NOT NULL AND OLD.job_title IS DISTINCT FROM NEW.job_title)
EXECUTE FUNCTION sync_user_position();

COMMENT ON TRIGGER trg_sync_user_position ON hrm.employees
  IS '직원의 job_title 변경 시 sys.users 동기화';

-- ============================================================
-- Step 5: 데이터 일관성 검증 뷰
-- ============================================================

-- 5.1 전체 필드 동기화 상태 뷰
CREATE OR REPLACE VIEW v_user_employee_sync_status AS
SELECT
    u.id as user_id,
    u.username,
    u.full_name as user_full_name,
    e.id as employee_id,
    e.code as employee_code,
    e.name as employee_name,
    -- Email 동기화 확인
    CASE
        WHEN LOWER(u.email) = LOWER(e.email) THEN '✓ 동기화'
        ELSE '⚠️ 불일치: ' || u.email || ' vs ' || e.email
    END as email_status,
    -- Job Level 동기화 확인
    CASE
        WHEN u.job_level = e.job_level THEN '✓ 동기화'
        WHEN u.job_level IS NULL AND e.job_level IS NOT NULL THEN '⚠️ 미동기: users는 NULL'
        WHEN u.job_level IS NOT NULL AND e.job_level IS NULL THEN '⚠️ 불일치: employees는 NULL'
        ELSE '⚠️ 불일치: ' || COALESCE(u.job_level, 'NULL') || ' vs ' || COALESCE(e.job_level, 'NULL')
    END as job_level_status,
    -- Position 동기화 확인
    CASE
        WHEN u.position = e.job_title THEN '✓ 동기화'
        WHEN u.position IS NULL AND e.job_title IS NOT NULL THEN '⚠️ 미동기: users는 NULL'
        ELSE '⚠️ 불일치: ' || COALESCE(u.position, 'NULL') || ' vs ' || COALESCE(e.job_title, 'NULL')
    END as position_status,
    -- 전체 일관성
    CASE
        WHEN LOWER(u.email) = LOWER(e.email)
         AND u.job_level = e.job_level
         AND u.position = e.job_title THEN '✓ 완전 동기화'
        ELSE '⚠️ 부분 불일치'
    END as overall_status,
    u.updated_at as user_updated_at,
    e.updated_at as employee_updated_at
FROM sys.users u
INNER JOIN hrm.employees e ON e.user_id = u.id
WHERE u.is_deleted = false
  AND e.is_deleted = false
ORDER BY overall_status, u.username;

COMMENT ON VIEW v_user_employee_sync_status
  IS '사용자-직원 필드 동기화 상태 검증 뷰';

-- 5.2 동기화되지 않은 항목만 조회
CREATE OR REPLACE VIEW v_user_employee_sync_issues AS
SELECT *
FROM v_user_employee_sync_status
WHERE overall_status != '✓ 완전 동기화';

COMMENT ON VIEW v_user_employee_sync_issues
  IS '동기화되지 않은 사용자-직원 항목';

-- ============================================================
-- Step 6: 검증 및 테스트
-- ============================================================

-- 동기화 상태 조회
SELECT * FROM v_user_employee_sync_status;

-- 동기화되지 않은 항목 확인
SELECT * FROM v_user_employee_sync_issues;

-- 통계: 동기화 상태
SELECT
    overall_status,
    COUNT(*) as count
FROM v_user_employee_sync_status
GROUP BY overall_status
ORDER BY count DESC;

-- ============================================================
-- Step 7: 트리거 테스트
-- ============================================================

-- 트리거 테스트: job_level 변경 시 자동 동기화 확인
-- BEGIN;
-- UPDATE hrm.employees
-- SET job_level = 'DIRECTOR'
-- WHERE id = (SELECT employee_id FROM v_user_employee_sync_status LIMIT 1);
--
-- -- 변경 확인
-- SELECT u.job_level, e.job_level
-- FROM sys.users u
-- INNER JOIN hrm.employees e ON e.user_id = u.id
-- WHERE u.id = (SELECT user_id FROM v_user_employee_sync_status LIMIT 1);
--
-- ROLLBACK;

-- ============================================================
-- 완료 메시지
-- ============================================================

DO $$
DECLARE
    v_job_level_trigger INT;
    v_email_trigger INT;
    v_position_trigger INT;
BEGIN
    SELECT COUNT(*) INTO v_job_level_trigger
    FROM pg_trigger
    WHERE tgname = 'trg_sync_user_job_level';

    SELECT COUNT(*) INTO v_email_trigger
    FROM pg_trigger
    WHERE tgname = 'trg_sync_user_email';

    SELECT COUNT(*) INTO v_position_trigger
    FROM pg_trigger
    WHERE tgname = 'trg_sync_user_position';

    IF v_job_level_trigger > 0
       AND v_email_trigger > 0
       AND v_position_trigger > 0 THEN
        RAISE NOTICE '✅ 주3 완료: 모든 동기화 트리거가 생성되었습니다';
        RAISE NOTICE '   - job_level 동기화 트리거';
        RAISE NOTICE '   - email 동기화 트리거';
        RAISE NOTICE '   - position 동기화 트리거';
    ELSE
        RAISE NOTICE '⚠️ 주3 실패: 트리거 생성을 확인하세요';
    END IF;
END $$;
