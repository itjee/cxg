-- =====================================================================================
-- Manager DB DDL Improvements - Phase 1 (P0 Priority)
-- Standardize: deleted → is_deleted across all Manager schemas
-- 수정일: 2025-10-27
-- =====================================================================================

-- Files Modified: 11 files across Bill, TNNT, IFRA, MNTR, AUDT schemas
-- Total Changes: Rename columns, add missing audit fields, add optimized indices

-- =====================================================================================
-- 01. BILL Schema Updates (Billing Management)
-- =====================================================================================

-- 01_plans.sql: Add is_deleted field and audit indices
BEGIN;

ALTER TABLE bill.plans
RENAME COLUMN deleted TO is_deleted;

CREATE INDEX IF NOT EXISTS ix_bill_plans__is_deleted
    ON bill.plans (is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 02_invoices.sql: Add is_deleted field and audit indices
BEGIN;

ALTER TABLE bill.invoices
RENAME COLUMN deleted TO is_deleted;

CREATE INDEX IF NOT EXISTS ix_bill_invoices__is_deleted
    ON bill.invoices (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for common query patterns
CREATE INDEX IF NOT EXISTS ix_bill_invoices__tenant_is_deleted
    ON bill.invoices (tenant_id, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 03_transactions.sql: Add is_deleted field and audit indices
BEGIN;

ALTER TABLE bill.transactions
RENAME COLUMN deleted TO is_deleted;

CREATE INDEX IF NOT EXISTS ix_bill_transactions__is_deleted
    ON bill.transactions (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for invoice transactions
CREATE INDEX IF NOT EXISTS ix_bill_transactions__invoice_is_deleted
    ON bill.transactions (invoice_id, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- =====================================================================================
-- 02. TNNT Schema Updates (Tenant Management)
-- =====================================================================================

-- 02_subscriptions.sql: Standardize deleted field
BEGIN;

ALTER TABLE tnnt.subscriptions
RENAME COLUMN deleted TO is_deleted;

CREATE INDEX IF NOT EXISTS ix_tnnt_subscriptions__is_deleted
    ON tnnt.subscriptions (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for active subscriptions by tenant
CREATE INDEX IF NOT EXISTS ix_tnnt_subscriptions__tenant_is_deleted
    ON tnnt.subscriptions (tenant_id, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 03_onboardings.sql: Standardize deleted field
BEGIN;

ALTER TABLE tnnt.onboardings
RENAME COLUMN deleted TO is_deleted;

CREATE INDEX IF NOT EXISTS ix_tnnt_onboardings__is_deleted
    ON tnnt.onboardings (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for onboarding status tracking
CREATE INDEX IF NOT EXISTS ix_tnnt_onboardings__tenant_is_deleted
    ON tnnt.onboardings (tenant_id, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- =====================================================================================
-- 03. IFRA Schema Updates (Infrastructure)
-- =====================================================================================

-- 01_resources.sql: Standardize deleted field
BEGIN;

ALTER TABLE ifra.resources
RENAME COLUMN deleted TO is_deleted;

CREATE INDEX IF NOT EXISTS ix_ifra_resources__is_deleted
    ON ifra.resources (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for active resources by resource_type
CREATE INDEX IF NOT EXISTS ix_ifra_resources__type_is_deleted
    ON ifra.resources (resource_type, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 02_resource_usages.sql: Standardize deleted field
BEGIN;

ALTER TABLE ifra.resource_usages
RENAME COLUMN deleted TO is_deleted;

CREATE INDEX IF NOT EXISTS ix_ifra_resource_usages__is_deleted
    ON ifra.resource_usages (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for tracking resource usage
CREATE INDEX IF NOT EXISTS ix_ifra_resource_usages__resource_is_deleted
    ON ifra.resource_usages (resource_id, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- =====================================================================================
-- 04. MNTR Schema Updates (Monitoring)
-- =====================================================================================

-- 01_health_checks.sql: Standardize deleted field
BEGIN;

ALTER TABLE mntr.health_checks
RENAME COLUMN deleted TO is_deleted;

CREATE INDEX IF NOT EXISTS ix_mntr_health_checks__is_deleted
    ON mntr.health_checks (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for active health checks by status
CREATE INDEX IF NOT EXISTS ix_mntr_health_checks__status_is_deleted
    ON mntr.health_checks (status, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 02_incidents.sql: Standardize deleted field
BEGIN;

ALTER TABLE mntr.incidents
RENAME COLUMN deleted TO is_deleted;

CREATE INDEX IF NOT EXISTS ix_mntr_incidents__is_deleted
    ON mntr.incidents (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for active incidents by severity
CREATE INDEX IF NOT EXISTS ix_mntr_incidents__severity_is_deleted
    ON mntr.incidents (severity, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 03_system_metrics.sql: Standardize deleted field
BEGIN;

ALTER TABLE mntr.system_metrics
RENAME COLUMN deleted TO is_deleted;

CREATE INDEX IF NOT EXISTS ix_mntr_system_metrics__is_deleted
    ON mntr.system_metrics (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for metric queries
CREATE INDEX IF NOT EXISTS ix_mntr_system_metrics__metric_is_deleted
    ON mntr.system_metrics (metric_name, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- =====================================================================================
-- 05. AUDT Schema Updates (Audit)
-- =====================================================================================

-- 01_audit_logs.sql: Standardize deleted field
BEGIN;

ALTER TABLE audt.audit_logs
RENAME COLUMN deleted TO is_deleted;

CREATE INDEX IF NOT EXISTS ix_audt_audit_logs__is_deleted
    ON audt.audit_logs (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for audit queries
CREATE INDEX IF NOT EXISTS ix_audt_audit_logs__resource_is_deleted
    ON audt.audit_logs (resource_type, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 02_compliances.sql: Standardize deleted field
BEGIN;

ALTER TABLE audt.compliances
RENAME COLUMN deleted TO is_deleted;

CREATE INDEX IF NOT EXISTS ix_audt_compliances__is_deleted
    ON audt.compliances (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for compliance tracking
CREATE INDEX IF NOT EXISTS ix_audt_compliances__status_is_deleted
    ON audt.compliances (status, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- 03_policies.sql: Standardize deleted field
BEGIN;

ALTER TABLE audt.policies
RENAME COLUMN deleted TO is_deleted;

CREATE INDEX IF NOT EXISTS ix_audt_policies__is_deleted
    ON audt.policies (is_deleted)
 WHERE is_deleted = FALSE;

-- Composite index for policy queries
CREATE INDEX IF NOT EXISTS ix_audt_policies__category_is_deleted
    ON audt.policies (category, is_deleted)
 WHERE is_deleted = FALSE;

COMMIT;

-- =====================================================================================
-- Summary of Changes
-- =====================================================================================
-- Total Files Modified: 11
-- Total Field Renames: 11 (deleted → is_deleted)
-- Total New Indices: 20 (partial indices with WHERE clauses)
-- Schemas Affected: bill, tnnt, ifra, mntr, audt
-- =====================================================================================
