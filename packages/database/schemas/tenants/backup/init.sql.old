-- ============================================================================
-- ConexGrow Tenant Database Initialization Script
-- ============================================================================
-- Description: 테넌트 데이터베이스 생성, 사용자 생성, 스키마 초기화
-- Database: tnnt_db (Tenant Database)
-- PostgreSQL Version: 15+
-- Created: 2024-10-20
-- ============================================================================

-- ============================================================================
-- 1. 데이터베이스 생성
-- ============================================================================

-- 기존 연결 종료 (필요시)
-- SELECT pg_terminate_backend(pg_stat_activity.pid)
-- FROM pg_stat_activity
-- WHERE pg_stat_activity.datname = 'tnnt_db'
--   AND pid <> pg_backend_pid();

-- 데이터베이스 생성
DROP DATABASE IF EXISTS tnnt_db;

CREATE DATABASE tnnt_db
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

COMMENT ON DATABASE tnnt_db IS 'ConexGrow Tenant Database - 테넌트 업무 데이터베이스';

-- 데이터베이스 연결
\c tnnt_db

-- ============================================================================
-- 2. 확장 기능 설치
-- ============================================================================

-- UUID 생성 함수
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
    SCHEMA public
    VERSION "1.1";

COMMENT ON EXTENSION "uuid-ossp" IS 'UUID 생성 함수';

-- 암호화 함수
CREATE EXTENSION IF NOT EXISTS "pgcrypto"
    SCHEMA public
    VERSION "1.3";

COMMENT ON EXTENSION "pgcrypto" IS '암호화 함수';

-- 전문 검색
CREATE EXTENSION IF NOT EXISTS "pg_trgm"
    SCHEMA public
    VERSION "1.6";

COMMENT ON EXTENSION "pg_trgm" IS '유사도 검색 및 전문 검색';

-- 통계 함수
CREATE EXTENSION IF NOT EXISTS "tablefunc"
    SCHEMA public
    VERSION "1.0";

COMMENT ON EXTENSION "tablefunc" IS '크로스탭 및 통계 함수';

-- ============================================================================
-- 3. 사용자(Role) 생성
-- ============================================================================

-- 테넌트 애플리케이션 사용자
DROP ROLE IF EXISTS tnnt_app_user;

CREATE ROLE tnnt_app_user WITH
    LOGIN
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE
    INHERIT
    NOREPLICATION
    CONNECTION LIMIT -1
    PASSWORD 'tnnt_app_pwd_change_me';

COMMENT ON ROLE tnnt_app_user IS 'ConexGrow 테넌트 애플리케이션 사용자';

-- 테넌트 읽기 전용 사용자
DROP ROLE IF EXISTS tnnt_readonly_user;

CREATE ROLE tnnt_readonly_user WITH
    LOGIN
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE
    INHERIT
    NOREPLICATION
    CONNECTION LIMIT -1
    PASSWORD 'tnnt_readonly_pwd_change_me';

COMMENT ON ROLE tnnt_readonly_user IS 'ConexGrow 테넌트 읽기 전용 사용자';

-- 테넌트 백업 사용자
DROP ROLE IF EXISTS tnnt_backup_user;

CREATE ROLE tnnt_backup_user WITH
    LOGIN
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE
    INHERIT
    NOREPLICATION
    CONNECTION LIMIT -1
    PASSWORD 'tnnt_backup_pwd_change_me';

COMMENT ON ROLE tnnt_backup_user IS 'ConexGrow 테넌트 백업 사용자';

-- ============================================================================
-- 4. 스키마 생성
-- ============================================================================

-- 4.1. ADM - Administration (기준정보 관리)
CREATE SCHEMA IF NOT EXISTS adm;
COMMENT ON SCHEMA adm IS 'ADM: 기준정보 관리 스키마 (회사, 부서, 사원, 거래처, 제품, 창고 등)';

-- 4.2. ASM - Asset Management (자산 관리)
CREATE SCHEMA IF NOT EXISTS asm;
COMMENT ON SCHEMA asm IS 'ASM: 자산 관리 스키마 (고정자산, 감가상각, 유지보수)';

-- 4.3. BIM - Business Intelligence & Analytics (BI/분석)
CREATE SCHEMA IF NOT EXISTS bim;
COMMENT ON SCHEMA bim IS 'BIM: BI/분석 스키마 (대시보드, 리포트, KPI)';

-- 4.4. COM - Communication (커뮤니케이션)
CREATE SCHEMA IF NOT EXISTS com;
COMMENT ON SCHEMA com IS 'COM: 커뮤니케이션/메시징 스키마 (알림, 메시지, 캘린더)';

-- 4.5. CSM - Customer Service Management (고객 서비스)
CREATE SCHEMA IF NOT EXISTS csm;
COMMENT ON SCHEMA csm IS 'CSM: 고객 서비스 관리 스키마 (CRM, 서비스티켓)';

-- 4.6. FIM - Financial Management (재무 관리)
CREATE SCHEMA IF NOT EXISTS fim;
COMMENT ON SCHEMA fim IS 'FIM: 재무 관리 스키마 (회계, 원가, 예산)';

-- 4.7. IVM - Inventory Management (재고 관리)
CREATE SCHEMA IF NOT EXISTS ivm;
COMMENT ON SCHEMA ivm IS 'IVM: 재고 관리 스키마 (입출고, 재고조정)';

-- 4.8. LWM - Workflow Management (워크플로우)
CREATE SCHEMA IF NOT EXISTS lwm;
COMMENT ON SCHEMA lwm IS 'LWM: 워크플로우/결재 관리 스키마';

-- 4.9. PSM - Procurement & Supply Management (구매/조달)
CREATE SCHEMA IF NOT EXISTS psm;
COMMENT ON SCHEMA psm IS 'PSM: 구매/조달 관리 스키마';

-- 4.10. SRM - Sales & Revenue Management (판매/영업)
CREATE SCHEMA IF NOT EXISTS srm;
COMMENT ON SCHEMA srm IS 'SRM: 판매/영업 관리 스키마';

-- 4.11. SYS - System Configuration (시스템 설정)
CREATE SCHEMA IF NOT EXISTS sys;
COMMENT ON SCHEMA sys IS 'SYS: 시스템 설정 스키마 (코드규칙, 설정)';

-- ============================================================================
-- 5. 기본 권한 설정
-- ============================================================================

-- 5.1. tnnt_app_user 권한 (읽기/쓰기)
GRANT CONNECT ON DATABASE tnnt_db TO tnnt_app_user;
GRANT USAGE ON SCHEMA public, adm, asm, bim, com, csm, fim, ivm, lwm, psm, srm, sys TO tnnt_app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public, adm, asm, bim, com, csm, fim, ivm, lwm, psm, srm, sys TO tnnt_app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public, adm, asm, bim, com, csm, fim, ivm, lwm, psm, srm, sys TO tnnt_app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public, adm, asm, bim, com, csm, fim, ivm, lwm, psm, srm, sys GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO tnnt_app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public, adm, asm, bim, com, csm, fim, ivm, lwm, psm, srm, sys GRANT USAGE, SELECT ON SEQUENCES TO tnnt_app_user;

-- 5.2. tnnt_readonly_user 권한 (읽기 전용)
GRANT CONNECT ON DATABASE tnnt_db TO tnnt_readonly_user;
GRANT USAGE ON SCHEMA public, adm, asm, bim, com, csm, fim, ivm, lwm, psm, srm, sys TO tnnt_readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public, adm, asm, bim, com, csm, fim, ivm, lwm, psm, srm, sys TO tnnt_readonly_user;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public, adm, asm, bim, com, csm, fim, ivm, lwm, psm, srm, sys TO tnnt_readonly_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public, adm, asm, bim, com, csm, fim, ivm, lwm, psm, srm, sys GRANT SELECT ON TABLES TO tnnt_readonly_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public, adm, asm, bim, com, csm, fim, ivm, lwm, psm, srm, sys GRANT SELECT ON SEQUENCES TO tnnt_readonly_user;

-- 5.3. tnnt_backup_user 권한 (백업)
GRANT CONNECT ON DATABASE tnnt_db TO tnnt_backup_user;
GRANT USAGE ON SCHEMA public, adm, asm, bim, com, csm, fim, ivm, lwm, psm, srm, sys TO tnnt_backup_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public, adm, asm, bim, com, csm, fim, ivm, lwm, psm, srm, sys TO tnnt_backup_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public, adm, asm, bim, com, csm, fim, ivm, lwm, psm, srm, sys GRANT SELECT ON TABLES TO tnnt_backup_user;

-- ============================================================================
-- 6. 공통 함수 생성
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.update_updated_at_column() IS 'updated_at 컬럼 자동 업데이트 트리거 함수';

-- ============================================================================
-- 7. 초기 설정 및 통계
-- ============================================================================

ANALYZE;
ALTER DATABASE tnnt_db SET timezone TO 'Asia/Seoul';
ALTER DATABASE tnnt_db SET client_encoding TO 'UTF8';
ALTER DATABASE tnnt_db SET default_transaction_isolation TO 'read committed';

\echo '============================================================================'
\echo 'ConexGrow Tenant Database (tnnt_db) Initialization Complete!'
\echo '============================================================================'
