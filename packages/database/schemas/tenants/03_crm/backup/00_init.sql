-- ============================================================================
-- Customer Relationship Management Schema (crm) - Initialization
-- ============================================================================
-- Description: CRM 스키마 초기화 및 기본 설정
-- Database: tnnt_db (Tenant Database)
-- Schema: crm
-- Created: 2025-01-20
-- Modified: 2025-01-22 - 파일 분리
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS crm;

COMMENT ON SCHEMA crm IS 'CRM: 고객관계관리 스키마 (거래처, 고객, 연락처)';
