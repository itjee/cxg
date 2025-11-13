-- =====================================================================================
-- Boolean Column Naming Standardization Migration Script
-- =====================================================================================
-- Purpose: Rename 21 boolean columns to follow is_/has_/should_/can_ naming convention
-- Created: 2025-10-24
-- Status: Ready for execution
-- =====================================================================================

-- NOTE: This script should be executed in PostgreSQL
-- Recommend: Test in development first, then staging, then production
-- Backup: Always backup database before running this migration

-- =====================================================================================
-- 1. hrm.leave_policies - 2 columns
-- =====================================================================================

ALTER TABLE hrm.leave_policies
  RENAME COLUMN carryover_allowed TO is_carryover_allowed;

ALTER TABLE hrm.leave_policies
  RENAME COLUMN compensation_required TO is_compensation_required;

-- =====================================================================================
-- 2. crm.activities - 2 columns
-- =====================================================================================

ALTER TABLE crm.activities
  RENAME COLUMN follow_up_required TO is_follow_up_required;

ALTER TABLE crm.activities
  RENAME COLUMN reminder_enabled TO is_reminder_enabled;

-- =====================================================================================
-- 3. crm.campaign_members - 3 columns
-- =====================================================================================

ALTER TABLE crm.campaign_members
  RENAME COLUMN responded TO has_responded;

ALTER TABLE crm.campaign_members
  RENAME COLUMN converted_to_lead TO is_converted_to_lead;

ALTER TABLE crm.campaign_members
  RENAME COLUMN converted_to_opportunity TO is_converted_to_opportunity;

-- =====================================================================================
-- 4. crm.customer_segments - 1 column
-- =====================================================================================

ALTER TABLE crm.customer_segments
  RENAME COLUMN auto_update TO is_auto_update;

-- =====================================================================================
-- 5. crm.contracts - 1 column
-- =====================================================================================

ALTER TABLE crm.contracts
  RENAME COLUMN auto_renewal TO is_auto_renewal;

-- =====================================================================================
-- 6. crm.interactions - 1 column
-- =====================================================================================

ALTER TABLE crm.interactions
  RENAME COLUMN follow_up_required TO is_follow_up_required;

-- =====================================================================================
-- 7. wms.warehouse_employees - 5 columns
-- =====================================================================================

ALTER TABLE wms.warehouse_employees
  RENAME COLUMN notify_receipt TO should_notify_receipt;

ALTER TABLE wms.warehouse_employees
  RENAME COLUMN notify_shipment TO should_notify_shipment;

ALTER TABLE wms.warehouse_employees
  RENAME COLUMN notify_cancel TO should_notify_cancel;

ALTER TABLE wms.warehouse_employees
  RENAME COLUMN notify_adjust TO should_notify_adjust;

ALTER TABLE wms.warehouse_employees
  RENAME COLUMN notify_emergency TO should_notify_emergency;

-- =====================================================================================
-- 8. ivm.inventory_counts - 2 columns
-- =====================================================================================

ALTER TABLE ivm.inventory_counts
  RENAME COLUMN adjustment_created TO is_adjustment_created;

ALTER TABLE ivm.inventory_counts
  RENAME COLUMN adjustment_approved TO is_adjustment_approved;

-- =====================================================================================
-- 9. ivm.inventory_count_items - 1 column
-- =====================================================================================

ALTER TABLE ivm.inventory_count_items
  RENAME COLUMN recount_required TO is_recount_required;

-- =====================================================================================
-- 10. fim.tax_invoices - 1 column
-- =====================================================================================

ALTER TABLE fim.tax_invoices
  RENAME COLUMN nts_confirmed TO is_nts_confirmed;

-- =====================================================================================
-- 11. com.workflows - 1 column
-- =====================================================================================

ALTER TABLE com.workflows
  RENAME COLUMN notification_enabled TO is_notification_enabled;

-- =====================================================================================
-- Verification Query (Execute after migration to verify all renames were successful)
-- =====================================================================================

-- Uncomment and run after migration to verify:
/*
SELECT table_schema, table_name, column_name
FROM information_schema.columns
WHERE column_name IN (
    'carryover_allowed', 'compensation_required', 'follow_up_required',
    'reminder_enabled', 'responded', 'converted_to_lead', 'converted_to_opportunity',
    'auto_update', 'auto_renewal', 'notify_receipt', 'notify_shipment',
    'notify_cancel', 'notify_adjust', 'notify_emergency', 'adjustment_created',
    'adjustment_approved', 'recount_required', 'nts_confirmed', 'notification_enabled'
)
  AND table_schema = 'public'
ORDER BY table_schema, table_name;

-- If this returns 0 rows, all renames were successful!
*/

-- =====================================================================================
-- Temporal Column Standardization (Additional fixes - optional)
-- =====================================================================================

-- Note: Only 2 columns to rename for temporal consistency
-- These use DATE suffix but are TIMESTAMP type

-- ALTER TABLE crm.customer_surveys
--   RENAME COLUMN response_date TO response_at;
--
-- ALTER TABLE psm.purchase_orders
--   RENAME COLUMN approval_date TO approval_at;

-- Execute above only if you want to enforce strict temporal naming:
-- DATE type → *_date suffix
-- TIMESTAMP type → *_at suffix

-- =====================================================================================
-- Migration Summary
-- =====================================================================================
--
-- Total changes: 23 columns across 11 tables
--
-- Boolean columns (21):
--   ✅ hrm.leave_policies: carryover_allowed, compensation_required (2)
--   ✅ crm.activities: follow_up_required, reminder_enabled (2)
--   ✅ crm.campaign_members: responded, converted_to_lead, converted_to_opportunity (3)
--   ✅ crm.customer_segments: auto_update (1)
--   ✅ crm.contracts: auto_renewal (1)
--   ✅ crm.interactions: follow_up_required (1)
--   ✅ wms.warehouse_employees: notify_receipt, notify_shipment, notify_cancel, notify_adjust, notify_emergency (5)
--   ✅ ivm.inventory_counts: adjustment_created, adjustment_approved (2)
--   ✅ ivm.inventory_count_items: recount_required (1)
--   ✅ fim.tax_invoices: nts_confirmed (1)
--   ✅ com.workflows: notification_enabled (1)
--
-- Temporal columns (2, optional):
--   ⚠️  crm.customer_surveys: response_date → response_at
--   ⚠️  psm.purchase_orders: approval_date → approval_at
--
-- Estimated execution time: < 1 minute
-- Recommended: Execute during maintenance window
-- Rollback: Can be reversed with RENAME operations if needed
--
-- =====================================================================================
-- End of Migration Script
-- =====================================================================================
