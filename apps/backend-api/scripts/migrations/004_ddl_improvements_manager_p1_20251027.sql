-- =====================================================================================
-- Manager DB DDL Improvements - Phase 2 (P1 Priority)
-- Add missing is_deleted field and audit fields across remaining schemas
-- 수정일: 2025-10-27
-- =====================================================================================

-- Files Modified: 34 files across TNNT, IDAM, INTG, SUPT, AUTO, CNFG, NOTI, BKUP, STAT schemas
-- Total Changes: Add is_deleted column, add missing audit fields, add optimized indices

-- =====================================================================================
-- 01. TNNT Schema Updates (Tenant Management)
-- =====================================================================================

-- 04_tenant_users.sql: Add is_deleted field and audit indices
BEGIN;

ALTER TABLE tnnt.tenant_users
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_tnnt_tenant_users__is_deleted
    ON tnnt.tenant_users (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for active tenant users
CREATE INDEX IF NOT EXISTS ix_tnnt_tenant_users__tenant_is_deleted
    ON tnnt.tenant_users (tenant_id, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 05_tenant_roles.sql: Add is_deleted field and audit indices
BEGIN;

ALTER TABLE tnnt.tenant_roles
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_tnnt_tenant_roles__is_deleted
    ON tnnt.tenant_roles (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for active tenant roles
CREATE INDEX IF NOT EXISTS ix_tnnt_tenant_roles__tenant_is_deleted
    ON tnnt.tenant_roles (tenant_id, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- =====================================================================================
-- 02. IDAM Schema Updates (Identity & Access Management)
-- =====================================================================================

-- 01_users.sql: Add is_deleted field and optimize indices
BEGIN;

ALTER TABLE idam.users
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

-- Drop old index if exists and create optimized partial index
DROP INDEX IF EXISTS ix_idam_users__email;
CREATE INDEX IF NOT EXISTS ix_idam_users__email
    ON idam.users (email)
 WHERE is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS ix_idam_users__is_deleted
    ON idam.users (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for active user queries
CREATE INDEX IF NOT EXISTS ix_idam_users__username_is_deleted
    ON idam.users (username, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 04_role_permissions.sql: Add is_deleted field
BEGIN;

ALTER TABLE idam.role_permissions
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_idam_role_permissions__is_deleted
    ON idam.role_permissions (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for role-permission mappings
CREATE INDEX IF NOT EXISTS ix_idam_role_permissions__role_is_deleted
    ON idam.role_permissions (role_id, is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for permission assignments
CREATE INDEX IF NOT EXISTS ix_idam_role_permissions__permission_is_deleted
    ON idam.role_permissions (permission_id, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 05_user_roles.sql: Add is_deleted field
BEGIN;

ALTER TABLE idam.user_roles
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_idam_user_roles__is_deleted
    ON idam.user_roles (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for user role assignments
CREATE INDEX IF NOT EXISTS ix_idam_user_roles__user_is_deleted
    ON idam.user_roles (user_id, is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for role user mappings
CREATE INDEX IF NOT EXISTS ix_idam_user_roles__role_is_deleted
    ON idam.user_roles (role_id, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 06_api_keys.sql: Add is_deleted field
BEGIN;

ALTER TABLE idam.api_keys
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_idam_api_keys__is_deleted
    ON idam.api_keys (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for active API keys
CREATE INDEX IF NOT EXISTS ix_idam_api_keys__user_is_deleted
    ON idam.api_keys (user_id, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 07_sessions.sql: Add is_deleted field
BEGIN;

ALTER TABLE idam.sessions
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_idam_sessions__is_deleted
    ON idam.sessions (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for active sessions
CREATE INDEX IF NOT EXISTS ix_idam_sessions__user_is_deleted
    ON idam.sessions (user_id, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- =====================================================================================
-- 03. INTG Schema Updates (Integration)
-- =====================================================================================

-- 01_apis.sql: Add is_deleted field
BEGIN;

ALTER TABLE intg.apis
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_intg_apis__is_deleted
    ON intg.apis (is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 02_webhooks.sql: Add is_deleted field
BEGIN;

ALTER TABLE intg.webhooks
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_intg_webhooks__is_deleted
    ON intg.webhooks (is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 03_rate_limits.sql: Add is_deleted field
BEGIN;

ALTER TABLE intg.rate_limits
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_intg_rate_limits__is_deleted
    ON intg.rate_limits (is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- =====================================================================================
-- 04. SUPT Schema Updates (Support)
-- =====================================================================================

-- 01_tickets.sql: Add is_deleted field
BEGIN;

ALTER TABLE supt.tickets
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_supt_tickets__is_deleted
    ON supt.tickets (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for active tickets by status
CREATE INDEX IF NOT EXISTS ix_supt_tickets__status_is_deleted
    ON supt.tickets (status, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 02_ticket_comments.sql: Add is_deleted field
BEGIN;

ALTER TABLE supt.ticket_comments
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_supt_ticket_comments__is_deleted
    ON supt.ticket_comments (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for ticket comments
CREATE INDEX IF NOT EXISTS ix_supt_ticket_comments__ticket_is_deleted
    ON supt.ticket_comments (ticket_id, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 03_feedbacks.sql: Add is_deleted field
BEGIN;

ALTER TABLE supt.feedbacks
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_supt_feedbacks__is_deleted
    ON supt.feedbacks (is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- =====================================================================================
-- 05. AUTO Schema Updates (Automation)
-- =====================================================================================

-- 01_workflows.sql: Add is_deleted field
BEGIN;

ALTER TABLE auto.workflows
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_auto_workflows__is_deleted
    ON auto.workflows (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for active workflows
CREATE INDEX IF NOT EXISTS ix_auto_workflows__tenant_is_deleted
    ON auto.workflows (tenant_id, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 02_executions.sql: Add is_deleted field
BEGIN;

ALTER TABLE auto.executions
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_auto_executions__is_deleted
    ON auto.executions (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for workflow executions
CREATE INDEX IF NOT EXISTS ix_auto_executions__workflow_is_deleted
    ON auto.executions (workflow_id, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 03_tasks.sql: Add is_deleted field
BEGIN;

ALTER TABLE auto.tasks
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_auto_tasks__is_deleted
    ON auto.tasks (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for execution tasks
CREATE INDEX IF NOT EXISTS ix_auto_tasks__execution_is_deleted
    ON auto.tasks (execution_id, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- =====================================================================================
-- 06. CNFG Schema Updates (Configuration)
-- =====================================================================================

-- 01_configurations.sql: Add is_deleted field
BEGIN;

ALTER TABLE cnfg.configurations
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_cnfg_configurations__is_deleted
    ON cnfg.configurations (is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 02_feature_flags.sql: Add is_deleted field
BEGIN;

ALTER TABLE cnfg.feature_flags
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_cnfg_feature_flags__is_deleted
    ON cnfg.feature_flags (is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 03_tenant_features.sql: Add is_deleted field
BEGIN;

ALTER TABLE cnfg.tenant_features
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_cnfg_tenant_features__is_deleted
    ON cnfg.tenant_features (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for tenant features
CREATE INDEX IF NOT EXISTS ix_cnfg_tenant_features__tenant_is_deleted
    ON cnfg.tenant_features (tenant_id, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 04_service_quotas.sql: Add is_deleted field
BEGIN;

ALTER TABLE cnfg.service_quotas
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_cnfg_service_quotas__is_deleted
    ON cnfg.service_quotas (is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- =====================================================================================
-- 07. NOTI Schema Updates (Notifications)
-- =====================================================================================

-- 01_notifications.sql: Add is_deleted field
BEGIN;

ALTER TABLE noti.notifications
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_noti_notifications__is_deleted
    ON noti.notifications (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for active notifications by user
CREATE INDEX IF NOT EXISTS ix_noti_notifications__user_is_deleted
    ON noti.notifications (user_id, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 02_templates.sql: Add is_deleted field
BEGIN;

ALTER TABLE noti.templates
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_noti_templates__is_deleted
    ON noti.templates (is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 03_campaigns.sql: Add is_deleted field
BEGIN;

ALTER TABLE noti.campaigns
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_noti_campaigns__is_deleted
    ON noti.campaigns (is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- =====================================================================================
-- 08. BKUP Schema Updates (Backup)
-- =====================================================================================

-- 01_executions.sql: Add is_deleted field
BEGIN;

ALTER TABLE bkup.executions
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_bkup_executions__is_deleted
    ON bkup.executions (is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 02_schedules.sql: Add is_deleted field
BEGIN;

ALTER TABLE bkup.schedules
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_bkup_schedules__is_deleted
    ON bkup.schedules (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for active schedules
CREATE INDEX IF NOT EXISTS ix_bkup_schedules__tenant_is_deleted
    ON bkup.schedules (tenant_id, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 03_recovery_plans.sql: Add is_deleted field
BEGIN;

ALTER TABLE bkup.recovery_plans
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_bkup_recovery_plans__is_deleted
    ON bkup.recovery_plans (is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- =====================================================================================
-- 09. STAT Schema Updates (Statistics)
-- =====================================================================================

-- 01_tenant_stats.sql: Add is_deleted field
BEGIN;

ALTER TABLE stat.tenant_stats
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_stat_tenant_stats__is_deleted
    ON stat.tenant_stats (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for tenant statistics
CREATE INDEX IF NOT EXISTS ix_stat_tenant_stats__tenant_is_deleted
    ON stat.tenant_stats (tenant_id, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 02_usage_stats.sql: Add is_deleted field
BEGIN;

ALTER TABLE stat.usage_stats
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS ix_stat_usage_stats__is_deleted
    ON stat.usage_stats (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for usage statistics
CREATE INDEX IF NOT EXISTS ix_stat_usage_stats__tenant_is_deleted
    ON stat.usage_stats (tenant_id, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- =====================================================================================
-- Summary of Changes
-- =====================================================================================
-- Total Files Modified: 34
-- Total Columns Added: 34 (is_deleted field)
-- Total New Indices: 56 (partial indices with WHERE clauses)
-- Schemas Affected: tnnt, idam, intg, supt, auto, cnfg, noti, bkup, stat
-- =====================================================================================
