-- =====================================================================================
-- 문서: Manager DB idam 스키마 주석 업데이트
-- 설명: 운영자 전용 스키마임을 명확히 하기 위한 주석 업데이트
-- 작성일: 2025-01-26
-- =====================================================================================

-- 스키마 주석 업데이트
COMMENT ON SCHEMA idam IS 
'IDAM (Identity & Access Management): ConexGrow 플랫폼 운영자 전용 인증/인가 스키마.
운영자(MASTER) 계정만 관리하며, 테넌트 비즈니스 사용자는 Tenant DB의 sys 스키마에서 관리됨.
역할: 플랫폼 관리, 테넌트 관리, 빌링, 시스템 모니터링, 감사.';

-- users 테이블 주석 업데이트
COMMENT ON TABLE idam.users IS 
'ConexGrow 플랫폼 운영자 계정 관리 (MASTER 타입만 허용).
접근: manager-web 앱.
예시 역할: SUPER_ADMIN, TENANT_MANAGER, SUPPORT, BILLING_ADMIN, AUDITOR.
테넌트 사용자는 Tenant DB의 sys.users 테이블에서 관리.';

-- roles 테이블 주석 업데이트
COMMENT ON TABLE idam.roles IS 
'플랫폼 운영자 역할 정의.
예시: SUPER_ADMIN (모든 권한), TENANT_MANAGER (테넌트 관리), SUPPORT (지원), AUDITOR (감사 읽기 전용).
테넌트 비즈니스 역할은 Tenant DB의 sys.roles 테이블에서 관리.';

-- permissions 테이블 주석 업데이트
COMMENT ON TABLE idam.permissions IS 
'플랫폼 운영자 권한 정의.
예시: TENANT_CREATE, TENANT_DELETE, BILLING_VIEW, SYSTEM_MONITOR, AUDIT_VIEW.
테넌트 비즈니스 권한(PSM_ORDER_CREATE 등)은 Tenant DB의 sys.permissions 테이블에서 관리.';

-- role_permissions 테이블 주석 업데이트
COMMENT ON TABLE idam.role_permissions IS 
'플랫폼 운영자 역할-권한 매핑.
운영자 역할에 플랫폼 관리 권한을 할당.';

-- user_roles 테이블 주석 업데이트
COMMENT ON TABLE idam.user_roles IS 
'플랫폼 운영자-역할 매핑.
운영자 계정에 운영 역할을 할당.';

-- login_logs 테이블 주석 업데이트 (있는 경우)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'idam' AND table_name = 'login_logs') THEN
        EXECUTE 'COMMENT ON TABLE idam.login_logs IS ''플랫폼 운영자 로그인 이력 (보안 감사용)''';
    END IF;
END $$;

-- sessions 테이블 주석 업데이트 (있는 경우)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'idam' AND table_name = 'sessions') THEN
        EXECUTE 'COMMENT ON TABLE idam.sessions IS ''플랫폼 운영자 세션 관리''';
    END IF;
END $$;

-- api_keys 테이블 주석 업데이트 (있는 경우)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'idam' AND table_name = 'api_keys') THEN
        EXECUTE 'COMMENT ON TABLE idam.api_keys IS ''플랫폼 운영자 API 키 관리 (시스템 통합용)''';
    END IF;
END $$;
