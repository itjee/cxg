-- ============================================================================
-- Approval Management Schema (apm)
-- ============================================================================
-- Description: 전자결재 관리 (결재선, 결재진행, 워크플로우 설정)
-- Database: tnnt_db (Tenant Database)
-- Schema: apm
-- Created: 2025-01-20
-- Modified: 2025-10-27 - com.workflows 통합, approval_workflow_configs 추가
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS apm;

COMMENT ON SCHEMA apm IS 'APM: 전자결재 관리 스키마 (결재선, 결재진행, 워크플로우 설정)';

-- ============================================================================
-- APM: 전자결재 관리 (Approval Management)
-- - approval_lines: 결재선 정의
-- - approval_line_items: 결재자 정의
-- - approval_requests: 결재 요청/진행
-- - approval_histories: 결재 이력
-- - approval_workflow_configs: 워크플로우 설정 (금액조건, 에스컬레이션 등)
-- ============================================================================
