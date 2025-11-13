-- ============================================================================
-- ConexGrow Manager Database Initialization Script
-- ============================================================================
-- Description: 매니저 데이터베이스 생성, 사용자 생성, 스키마 초기화
-- Database: mgmt (Manager Database)
-- PostgreSQL Version: 15+
-- Created: 2024-10-20
-- Location: Korea (Asia/Seoul)
-- ============================================================================

-- ============================================================================
-- 1. 데이터베이스 생성
-- ============================================================================

DROP DATABASE IF EXISTS mgmt;

CREATE DATABASE mgmt
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'ko_KR.UTF-8'
    LC_CTYPE = 'ko_KR.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

COMMENT ON DATABASE mgmt IS 'ConexGrow Manager Database - 서비스 관리자 데이터베이스';

\c mgmt

-- ============================================================================
-- 2. 확장 기능 설치
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public VERSION "1.1";
COMMENT ON EXTENSION "uuid-ossp" IS 'UUID 생성 함수';

CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA public VERSION "1.3";
COMMENT ON EXTENSION "pgcrypto" IS '암호화 함수';

CREATE EXTENSION IF NOT EXISTS "pg_trgm" SCHEMA public VERSION "1.6";
COMMENT ON EXTENSION "pg_trgm" IS '유사도 검색 및 전문 검색';

CREATE EXTENSION IF NOT EXISTS "tablefunc" SCHEMA public VERSION "1.0";
COMMENT ON EXTENSION "tablefunc" IS '크로스탭 및 통계 함수';

-- ============================================================================
-- 3. 사용자(Role) 생성
-- ============================================================================

DROP ROLE IF EXISTS mgmt_app_user;
CREATE ROLE mgmt_app_user WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE INHERIT NOREPLICATION CONNECTION LIMIT -1 PASSWORD 'mgmt_app_pwd_change_me';
COMMENT ON ROLE mgmt_app_user IS 'ConexGrow 매니저 애플리케이션 사용자';

DROP ROLE IF EXISTS mgmt_readonly_user;
CREATE ROLE mgmt_readonly_user WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE INHERIT NOREPLICATION CONNECTION LIMIT -1 PASSWORD 'mgmt_readonly_pwd_change_me';
COMMENT ON ROLE mgmt_readonly_user IS 'ConexGrow 매니저 읽기 전용 사용자';

DROP ROLE IF EXISTS mgmt_backup_user;
CREATE ROLE mgmt_backup_user WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE INHERIT NOREPLICATION CONNECTION LIMIT -1 PASSWORD 'mgmt_backup_pwd_change_me';
COMMENT ON ROLE mgmt_backup_user IS 'ConexGrow 매니저 백업 사용자';

-- ============================================================================
-- 4. 스키마 생성
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS audt;
COMMENT ON SCHEMA audt IS 'AUDT: 감사 로그 스키마';

CREATE SCHEMA IF NOT EXISTS auto;
COMMENT ON SCHEMA auto IS 'AUTO: 자동화 스키마';

CREATE SCHEMA IF NOT EXISTS bill;
COMMENT ON SCHEMA bill IS 'BILL: 빌링/과금 스키마';

CREATE SCHEMA IF NOT EXISTS bkup;
COMMENT ON SCHEMA bkup IS 'BKUP: 백업 스키마';

CREATE SCHEMA IF NOT EXISTS cnfg;
COMMENT ON SCHEMA cnfg IS 'CNFG: 설정 스키마';

CREATE SCHEMA IF NOT EXISTS idam;
COMMENT ON SCHEMA idam IS 'IDAM: 인증/인가 스키마';

CREATE SCHEMA IF NOT EXISTS ifra;
COMMENT ON SCHEMA ifra IS 'IFRA: 인프라 스키마';

CREATE SCHEMA IF NOT EXISTS intg;
COMMENT ON SCHEMA intg IS 'INTG: 통합/연동 스키마';

CREATE SCHEMA IF NOT EXISTS mntr;
COMMENT ON SCHEMA mntr IS 'MNTR: 모니터링 스키마';

CREATE SCHEMA IF NOT EXISTS noti;
COMMENT ON SCHEMA noti IS 'NOTI: 알림 스키마';

CREATE SCHEMA IF NOT EXISTS stat;
COMMENT ON SCHEMA stat IS 'STAT: 통계 스키마';

CREATE SCHEMA IF NOT EXISTS supt;
COMMENT ON SCHEMA supt IS 'SUPT: 고객지원 스키마';

CREATE SCHEMA IF NOT EXISTS tnnt;
COMMENT ON SCHEMA tnnt IS 'TNNT: 테넌트 관리 스키마';

-- ============================================================================
-- 5. 기본 권한 설정
-- ============================================================================

-- 5.1. mgmt_app_user 권한
GRANT CONNECT ON DATABASE mgmt TO mgmt_app_user;
GRANT USAGE ON SCHEMA public, audt, auto, bill, bkup, cnfg, idam, ifra, intg, mntr, noti, stat, supt, tnnt TO mgmt_app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public, audt, auto, bill, bkup, cnfg, idam, ifra, intg, mntr, noti, stat, supt, tnnt TO mgmt_app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public, audt, auto, bill, bkup, cnfg, idam, ifra, intg, mntr, noti, stat, supt, tnnt TO mgmt_app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public, audt, auto, bill, bkup, cnfg, idam, ifra, intg, mntr, noti, stat, supt, tnnt GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO mgmt_app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public, audt, auto, bill, bkup, cnfg, idam, ifra, intg, mntr, noti, stat, supt, tnnt GRANT USAGE, SELECT ON SEQUENCES TO mgmt_app_user;

-- 5.2. mgmt_readonly_user 권한
GRANT CONNECT ON DATABASE mgmt TO mgmt_readonly_user;
GRANT USAGE ON SCHEMA public, audt, auto, bill, bkup, cnfg, idam, ifra, intg, mntr, noti, stat, supt, tnnt TO mgmt_readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public, audt, auto, bill, bkup, cnfg, idam, ifra, intg, mntr, noti, stat, supt, tnnt TO mgmt_readonly_user;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public, audt, auto, bill, bkup, cnfg, idam, ifra, intg, mntr, noti, stat, supt, tnnt TO mgmt_readonly_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public, audt, auto, bill, bkup, cnfg, idam, ifra, intg, mntr, noti, stat, supt, tnnt GRANT SELECT ON TABLES TO mgmt_readonly_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public, audt, auto, bill, bkup, cnfg, idam, ifra, intg, mntr, noti, stat, supt, tnnt GRANT SELECT ON SEQUENCES TO mgmt_readonly_user;

-- 5.3. mgmt_backup_user 권한
GRANT CONNECT ON DATABASE mgmt TO mgmt_backup_user;
GRANT USAGE ON SCHEMA public, audt, auto, bill, bkup, cnfg, idam, ifra, intg, mntr, noti, stat, supt, tnnt TO mgmt_backup_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public, audt, auto, bill, bkup, cnfg, idam, ifra, intg, mntr, noti, stat, supt, tnnt TO mgmt_backup_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public, audt, auto, bill, bkup, cnfg, idam, ifra, intg, mntr, noti, stat, supt, tnnt GRANT SELECT ON TABLES TO mgmt_backup_user;

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
-- 7. 초기 설정
-- ============================================================================

ANALYZE;
ALTER DATABASE mgmt SET timezone TO 'Asia/Seoul';
ALTER DATABASE mgmt SET client_encoding TO 'UTF8';
ALTER DATABASE mgmt SET default_transaction_isolation TO 'read committed';

\echo '============================================================================'
\echo 'ConexGrow Manager Database (mgmt) Initialization Complete!'
\echo '============================================================================'
