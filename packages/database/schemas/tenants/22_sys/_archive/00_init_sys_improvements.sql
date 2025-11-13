-- =====================================================================================
-- SYS Schema Improvements - Unified Initialization Script
-- =====================================================================================
-- 목적: 세션, 사용자-역할, 권한 변경 이력 테이블을 생성하는 통합 초기화 스크립트
-- 생성일: 2024-10-26
-- 실행 순서: 스키마 확인 → 새 테이블 생성 → 데이터 마이그레이션
--
-- 주의사항:
-- 1. 이 스크립트는 완전히 독립적이며 기존 sys 스키마에 영향을 주지 않습니다
-- 2. 기존 테이블(users, roles, permissions 등)은 이미 생성되어 있어야 합니다
-- 3. 마이그레이션은 선택적이며, 필요시에만 실행하세요
-- =====================================================================================

\echo '======================================'
\echo 'SYS Schema Improvements Initialization'
\echo '======================================'

-- =====================================================================================
-- 1단계: 스키마 확인
-- =====================================================================================
\echo '1단계: sys 스키마 확인...'

-- sys 스키마가 존재하지 않으면 생성 (일반적으로 이미 존재)
CREATE SCHEMA IF NOT EXISTS sys;

\echo '✓ sys 스키마 확인 완료'

-- =====================================================================================
-- 2단계: 새 테이블 생성
-- =====================================================================================
\echo '2단계: 새 테이블 생성 중...'

-- sys.sessions 테이블 생성
\i '/home/itjee/workspace/cxg/packages/database/schemas/tenants/22_sys/13_sessions.sql'
\echo '✓ sys.sessions 테이블 생성 완료'

-- sys.user_roles 테이블 생성
\i '/home/itjee/workspace/cxg/packages/database/schemas/tenants/22_sys/14_user_roles.sql'
\echo '✓ sys.user_roles 테이블 생성 완료'

-- sys.role_permissions_history 테이블 생성 및 트리거
\i '/home/itjee/workspace/cxg/packages/database/schemas/tenants/22_sys/15_role_permissions_history.sql'
\echo '✓ sys.role_permissions_history 테이블 및 트리거 생성 완료'

-- =====================================================================================
-- 3단계: 데이터 마이그레이션 (선택적)
-- =====================================================================================
\echo '3단계: 데이터 마이그레이션 중...'

-- 주의: 마이그레이션 스크립트는 수동으로 검토하고 실행하는 것을 권장합니다
-- \i '/home/itjee/workspace/cxg/packages/database/schemas/tenants/22_sys/_archive/16_user_roles_migration.sql'

\echo '⚠️  데이터 마이그레이션은 수동 실행이 필요합니다'
\echo '    다음 명령으로 실행하세요:'
\echo '    psql -U user -d tenants_db -f _archive/16_user_roles_migration.sql'

-- =====================================================================================
-- 4단계: 검증
-- =====================================================================================
\echo '4단계: 생성된 테이블 검증 중...'

-- 테이블 생성 확인
SELECT
    table_name,
    'Table created ✓' as status
FROM information_schema.tables
WHERE table_schema = 'sys'
AND table_name IN ('sessions', 'user_roles', 'role_permissions_history')
ORDER BY table_name;

-- 인덱스 개수 확인
SELECT
    COUNT(*) as index_count
FROM pg_stat_user_indexes
WHERE schemaname = 'sys'
AND tablename IN ('sessions', 'user_roles', 'role_permissions_history');

-- 트리거 확인
SELECT
    trigger_name,
    'Trigger created ✓' as status
FROM information_schema.triggers
WHERE trigger_schema = 'sys'
AND trigger_name = 'trigger_record_role_permissions_change';

-- =====================================================================================
-- 완료 메시지
-- =====================================================================================
\echo '======================================'
\echo 'SYS Schema Improvements Complete!'
\echo '======================================'
\echo '✓ sys.sessions 테이블 생성'
\echo '✓ sys.user_roles 테이블 생성'
\echo '✓ sys.role_permissions_history 테이블 생성'
\echo '✓ trigger_record_role_permissions_change 트리거 생성'
\echo ''
\echo '다음 단계:'
\echo '1. 데이터 마이그레이션 (16_user_roles_migration.sql 실행)'
\echo '2. Python 백엔드 모델 업데이트'
\echo '3. 테스트 및 배포'
\echo '======================================'
