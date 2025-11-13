-- ============================================================================
-- Business Intelligence & Analytics Schema (bim)
-- ============================================================================
-- Description: BI/분석 스키마 (KPI, 목표, 판매분석, 구매분석)
-- Database: tnnt_db (Tenant Database)
-- Schema: bim
-- Created: 2025-01-20
-- Modified: 2025-10-23 - 표준 형식 적용 및 테이블 분리
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS bim;

COMMENT ON SCHEMA bim IS 'BIM: BI/분석 스키마 (KPI, 목표, 판매분석, 구매분석)';
