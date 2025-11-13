-- ============================================================================
-- BKUP Schema - Schema Initialization
-- ============================================================================
-- Purpose: Create the BKUP schema for backup and disaster recovery management
-- Description: BKUP - Backup/Recovery(BC/DR) Schema: Schedule/execution history and DR plan management
-- Created: 2024-10-26
-- ============================================================================

-- Create schema
CREATE SCHEMA IF NOT EXISTS bkup;

-- Schema description
COMMENT ON SCHEMA bkup
IS 'BKUP: 백업/복구(BC/DR) 스키마: 스케줄/실행 기록과 DR 계획 관리.';

-- ============================================================================
-- End of Schema Initialization
-- ============================================================================
