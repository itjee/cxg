-- =====================================================================================
-- Week 1: 데이터 무결성 개선 - sys.users.department_id FK 추가
-- =====================================================================================
--
-- 목적: sys.users 테이블의 department_id 필드에 FK 제약을 추가하여
--      존재하지 않는 부서를 참조하지 못하도록 강제
--
-- 작성일: 2024-10-26
-- 변경사항:
-- 1. 고아 부서 참조 (orphaned reference) 정리
-- 2. FK 제약 조건 추가: sys.users.department_id → hrm.departments(id)
-- 3. 검증 뷰 생성
--
-- 주의: 이 스크립트는 hrm.departments 테이블이 존재해야 합니다.
--      실행 전에 반드시 백업을 수행하세요.
--
-- =====================================================================================

-- ============================================================
-- Step 1: 현재 상태 진단
-- ============================================================

-- 고아 부서 참조 확인 (department_id는 있지만 해당 부서가 존재하지 않음)
CREATE TEMPORARY VIEW v_orphaned_users AS
SELECT
    u.id,
    u.username,
    u.full_name,
    u.department_id,
    CASE WHEN d.id IS NULL THEN '존재하지 않는 부서' ELSE d.name END as department_name,
    u.created_at
FROM sys.users u
LEFT JOIN hrm.departments d ON d.id = u.department_id
WHERE u.is_deleted = false
  AND u.department_id IS NOT NULL
  AND d.id IS NULL;  -- 부서가 없는 경우

-- 진단 결과 조회
SELECT * FROM v_orphaned_users;

-- ============================================================
-- Step 2: 고아 부서 참조 정리 (선택 사항)
-- ============================================================
--
-- 고아 부서 참조가 있는 경우, 다음 중 하나를 선택:
--
-- 옵션 A: 올바른 부서로 수정 (권장)
-- UPDATE sys.users
-- SET department_id = (SELECT id FROM hrm.departments WHERE name = 'Default Department')
-- WHERE id IN (SELECT id FROM v_orphaned_users);

-- 옵션 B: NULL로 설정
-- UPDATE sys.users
-- SET department_id = NULL
-- WHERE id IN (SELECT id FROM v_orphaned_users);

-- 이 스크립트에서는 옵션 B(NULL)를 사용합니다 (안전함)
UPDATE sys.users
SET department_id = NULL
WHERE is_deleted = false
  AND department_id IS NOT NULL
  AND department_id NOT IN (SELECT id FROM hrm.departments);

-- 정리 결과 확인
SELECT COUNT(*) as orphaned_count
FROM v_orphaned_users;

-- ============================================================
-- Step 3: FK 제약 조건 추가
-- ============================================================

ALTER TABLE sys.users
  ADD CONSTRAINT fk_users__department_id
    FOREIGN KEY (department_id)
    REFERENCES hrm.departments(id)
    ON DELETE SET NULL;

COMMENT ON CONSTRAINT fk_users__department_id ON sys.users
  IS '부서 참조 외래키 (SET NULL 삭제 - 부서 삭제 시 사용자의 부서만 NULL로 변경)';

-- ============================================================
-- Step 4: 검증 뷰 생성
-- ============================================================

-- 사용자-부서 관계 검증 뷰
CREATE OR REPLACE VIEW v_user_department_validation AS
SELECT
    u.id as user_id,
    u.username,
    u.full_name,
    d.id as department_id,
    d.name as department_name,
    CASE
        WHEN u.department_id IS NULL THEN '부서 미정'
        WHEN d.id IS NULL THEN '⚠️ 오류: 존재하지 않는 부서'
        ELSE '✓ 정상'
    END as validation_status,
    u.created_at
FROM sys.users u
LEFT JOIN hrm.departments d ON d.id = u.department_id
WHERE u.is_deleted = false
ORDER BY validation_status, u.created_at DESC;

COMMENT ON VIEW v_user_department_validation
  IS '사용자-부서 관계 검증 뷰 (데이터 무결성 확인용)';

-- ============================================================
-- Step 5: 검증 및 테스트
-- ============================================================

-- 검증 뷰 조회
SELECT * FROM v_user_department_validation;

-- FK 제약 테스트: 존재하지 않는 부서로 UPDATE 시도 (실패해야 함)
-- BEGIN;
-- UPDATE sys.users
-- SET department_id = 'invalid-department-id'::UUID
-- WHERE id = (SELECT id FROM sys.users LIMIT 1);
-- ROLLBACK;

-- 성공 케이스: 유효한 부서로 UPDATE (성공해야 함)
-- BEGIN;
-- UPDATE sys.users
-- SET department_id = (SELECT id FROM hrm.departments LIMIT 1)
-- WHERE id = (SELECT id FROM sys.users LIMIT 1);
-- ROLLBACK;

-- ============================================================
-- Step 6: 인덱스 최적화 (이미 존재하지만 재확인)
-- ============================================================

-- department_id 인덱스 확인
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'users'
  AND schemaname = 'sys'
  AND indexname LIKE '%department%';

-- ============================================================
-- 완료 메시지
-- ============================================================

DO $$
DECLARE
    v_orphaned_count INT;
BEGIN
    SELECT COUNT(*) INTO v_orphaned_count
    FROM pg_constraint
    WHERE conname = 'fk_users__department_id';

    IF v_orphaned_count > 0 THEN
        RAISE NOTICE '✅ 주1 완료: sys.users.department_id FK 제약이 성공적으로 추가되었습니다';
    ELSE
        RAISE NOTICE '⚠️ 주1 실패: FK 제약 추가를 확인하세요';
    END IF;
END $$;
