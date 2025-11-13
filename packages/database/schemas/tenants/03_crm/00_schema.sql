-- ============================================================================
-- Customer Relationship Management Schema (crm)
-- ============================================================================
-- Description: 고객관계관리 스키마 (거래처, 담당자, 주소)
-- Database: tnnt_db (Tenant Database)
-- Schema: crm
-- Created: 2025-01-20
-- Modified: 2025-10-23 - partners 통합 관리로 전환
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS crm;

COMMENT ON SCHEMA crm IS 'CRM: 고객관계관리 스키마 (거래처, 담당자, 주소)';
