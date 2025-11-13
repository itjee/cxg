-- =====================================================================================
-- sys.user_roles 마이그레이션: sys.users.role_id → sys.user_roles
-- =====================================================================================
-- 목적: 기존 데이터를 새로운 테이블로 이전
-- 실행 시점: sys.user_roles 테이블이 생성된 직후 실행
-- 생성일: 2024-10-26
-- =====================================================================================

-- 1단계: 기존 데이터 마이그레이션 (sys.users.role_id → sys.user_roles)
-- 주의: role_id가 NULL이 아닌 사용자만 마이그레이션
INSERT INTO sys.user_roles (
    id,
    tenant_id,
    user_id,
    role_id,
    granted_at,
    granted_by,
    created_at,
    created_by,
    is_active
)
SELECT
    gen_random_uuid(),
    u.tenant_id,
    u.id,
    u.role_id,
    u.created_at,
    u.created_by,
    CURRENT_TIMESTAMP,
    u.created_by,
    TRUE
FROM sys.users u
WHERE u.role_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- 2단계: 마이그레이션 결과 검증
-- 마이그레이션된 행 수 확인
SELECT COUNT(*) as migrated_count FROM sys.user_roles WHERE is_active = TRUE;

-- 마이그레이션 전후 데이터 비교
SELECT
    u.id,
    u.tenant_id,
    u.username,
    u.role_id as old_role_id,
    ur.role_id as new_role_id,
    CASE WHEN u.role_id = ur.role_id THEN 'OK' ELSE 'MISMATCH' END as status
FROM sys.users u
LEFT JOIN sys.user_roles ur ON u.id = ur.user_id AND ur.is_active = TRUE
WHERE u.role_id IS NOT NULL
ORDER BY u.created_at;

-- 3단계: 마이그레이션 완료 후 sys.users.role_id 처리
-- 옵션 A: 컬럼 삭제 (이전 데이터 완전 제거)
-- ⚠️  주의: 이 작업은 복구 불가능합니다. 충분한 테스트 후 실행하세요.
-- ALTER TABLE sys.users DROP COLUMN role_id;

-- 옵션 B: deprecated 마크 (호환성 유지) - 권장
-- ALTER TABLE sys.users RENAME COLUMN role_id TO _deprecated_role_id;
--
-- ALTER TABLE sys.users
-- ADD CONSTRAINT ck_users__deprecated_role_id
--     CHECK (_deprecated_role_id IS NULL);

-- =====================================================================================
-- 마이그레이션 후 검증 체크리스트
-- =====================================================================================
-- 1. 테이블 생성 확인
SELECT
    COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'sys'
AND table_name IN ('user_roles');

-- 2. 데이터 일관성 확인
-- sys.user_roles에서 활성 역할의 개수
SELECT
    'sys.user_roles (활성)' as table_name,
    COUNT(*) as row_count
FROM sys.user_roles
WHERE is_active = TRUE

UNION ALL

-- sys.users에서 role_id가 있는 사용자의 개수
SELECT
    'sys.users (role_id 있음)' as table_name,
    COUNT(*) as row_count
FROM sys.users
WHERE role_id IS NOT NULL;

-- 3. 고아 레코드 확인 (user_roles에는 있지만 users에는 없는 경우)
SELECT
    ur.id,
    ur.user_id,
    ur.tenant_id,
    ur.role_id
FROM sys.user_roles ur
LEFT JOIN sys.users u ON ur.user_id = u.id
WHERE u.id IS NULL
AND ur.is_active = TRUE;

-- 4. 인덱스 생성 확인
SELECT
    indexname,
    tablename,
    indexdef
FROM pg_indexes
WHERE schemaname = 'sys'
AND tablename = 'user_roles'
ORDER BY indexname;

-- 5. 제약조건 확인
SELECT
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints
WHERE table_schema = 'sys'
AND table_name = 'user_roles'
ORDER BY constraint_name;

-- =====================================================================================
-- 마이그레이션 상태 로깅
-- =====================================================================================
-- 마이그레이션 완료 메시지
\echo '======================================'
\echo 'sys.user_roles 마이그레이션 완료!'
\echo '======================================'
\echo '✓ 기존 sys.users.role_id 데이터를 sys.user_roles로 이전'
\echo '✓ 마이그레이션 결과는 위의 쿼리 결과를 확인하세요'
\echo '✓ 다음 단계: sys.users.role_id 컬럼 처리 (삭제 또는 deprecated 마크)'
\echo '======================================'
