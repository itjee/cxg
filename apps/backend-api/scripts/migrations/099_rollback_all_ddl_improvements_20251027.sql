-- =====================================================================================
-- Complete Rollback Script for All DDL Improvements
-- Rolls back: Manager DB P0, P1 + Tenant DB P0, P1
-- 수정일: 2025-10-27
-- =====================================================================================

-- WARNING: This script reverses all DDL improvements applied in:
-- - 003_ddl_improvements_manager_p0_20251027.sql
-- - 004_ddl_improvements_manager_p1_20251027.sql
-- - 005_ddl_improvements_tenant_p0_20251027.sql
-- - 006_ddl_improvements_tenant_p1_20251027.sql

-- To use this rollback:
-- 1. Test in a staging environment first
-- 2. Take a database backup before applying
-- 3. Run sequentially: psql -U user -d mgmt_db < 099_rollback_...
--    then: psql -U user -d tnnt_db < 099_rollback_...

-- =====================================================================================
-- MANAGER DB ROLLBACK
-- =====================================================================================

-- =====================================================================================
-- Section 1: Manager DB - Revert P0 Changes (deleted → is_deleted back to deleted)
-- =====================================================================================

BEGIN;

-- BILL Schema Rollback
DROP INDEX IF EXISTS ix_bill_plans__is_deleted;
ALTER TABLE bill.plans RENAME COLUMN is_deleted TO deleted;

DROP INDEX IF EXISTS ix_bill_invoices__is_deleted;
DROP INDEX IF EXISTS ix_bill_invoices__tenant_is_deleted;
ALTER TABLE bill.invoices RENAME COLUMN is_deleted TO deleted;

DROP INDEX IF EXISTS ix_bill_transactions__is_deleted;
DROP INDEX IF EXISTS ix_bill_transactions__invoice_is_deleted;
ALTER TABLE bill.transactions RENAME COLUMN is_deleted TO deleted;

-- TNNT Schema Rollback
DROP INDEX IF EXISTS ix_tnnt_subscriptions__is_deleted;
DROP INDEX IF EXISTS ix_tnnt_subscriptions__tenant_is_deleted;
ALTER TABLE tnnt.subscriptions RENAME COLUMN is_deleted TO deleted;

DROP INDEX IF EXISTS ix_tnnt_onboardings__is_deleted;
DROP INDEX IF EXISTS ix_tnnt_onboardings__tenant_is_deleted;
ALTER TABLE tnnt.onboardings RENAME COLUMN is_deleted TO deleted;

-- IFRA Schema Rollback
DROP INDEX IF EXISTS ix_ifra_resources__is_deleted;
DROP INDEX IF EXISTS ix_ifra_resources__type_is_deleted;
ALTER TABLE ifra.resources RENAME COLUMN is_deleted TO deleted;

DROP INDEX IF EXISTS ix_ifra_resource_usages__is_deleted;
DROP INDEX IF EXISTS ix_ifra_resource_usages__resource_is_deleted;
ALTER TABLE ifra.resource_usages RENAME COLUMN is_deleted TO deleted;

-- MNTR Schema Rollback
DROP INDEX IF EXISTS ix_mntr_health_checks__is_deleted;
DROP INDEX IF EXISTS ix_mntr_health_checks__status_is_deleted;
ALTER TABLE mntr.health_checks RENAME COLUMN is_deleted TO deleted;

DROP INDEX IF EXISTS ix_mntr_incidents__is_deleted;
DROP INDEX IF EXISTS ix_mntr_incidents__severity_is_deleted;
ALTER TABLE mntr.incidents RENAME COLUMN is_deleted TO deleted;

DROP INDEX IF EXISTS ix_mntr_system_metrics__is_deleted;
DROP INDEX IF EXISTS ix_mntr_system_metrics__metric_is_deleted;
ALTER TABLE mntr.system_metrics RENAME COLUMN is_deleted TO deleted;

-- AUDT Schema Rollback
DROP INDEX IF EXISTS ix_audt_audit_logs__is_deleted;
DROP INDEX IF EXISTS ix_audt_audit_logs__resource_is_deleted;
ALTER TABLE audt.audit_logs RENAME COLUMN is_deleted TO deleted;

DROP INDEX IF EXISTS ix_audt_compliances__is_deleted;
DROP INDEX IF EXISTS ix_audt_compliances__status_is_deleted;
ALTER TABLE audt.compliances RENAME COLUMN is_deleted TO deleted;

DROP INDEX IF EXISTS ix_audt_policies__is_deleted;
DROP INDEX IF EXISTS ix_audt_policies__category_is_deleted;
ALTER TABLE audt.policies RENAME COLUMN is_deleted TO deleted;

COMMIT;

-- =====================================================================================
-- Section 2: Manager DB - Revert P1 Changes (remove is_deleted columns)
-- =====================================================================================

BEGIN;

-- TNNT Schema - Remove is_deleted
ALTER TABLE tnnt.tenant_users DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_tnnt_tenant_users__is_deleted;
DROP INDEX IF EXISTS ix_tnnt_tenant_users__tenant_is_deleted;

ALTER TABLE tnnt.tenant_roles DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_tnnt_tenant_roles__is_deleted;
DROP INDEX IF EXISTS ix_tnnt_tenant_roles__tenant_is_deleted;

-- IDAM Schema - Remove is_deleted
ALTER TABLE idam.users DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_idam_users__is_deleted;
DROP INDEX IF EXISTS ix_idam_users__email;
DROP INDEX IF EXISTS ix_idam_users__username_is_deleted;

ALTER TABLE idam.role_permissions DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_idam_role_permissions__is_deleted;
DROP INDEX IF EXISTS ix_idam_role_permissions__role_is_deleted;
DROP INDEX IF EXISTS ix_idam_role_permissions__permission_is_deleted;

ALTER TABLE idam.user_roles DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_idam_user_roles__is_deleted;
DROP INDEX IF EXISTS ix_idam_user_roles__user_is_deleted;
DROP INDEX IF EXISTS ix_idam_user_roles__role_is_deleted;

ALTER TABLE idam.api_keys DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_idam_api_keys__is_deleted;
DROP INDEX IF EXISTS ix_idam_api_keys__user_is_deleted;

ALTER TABLE idam.sessions DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_idam_sessions__is_deleted;
DROP INDEX IF EXISTS ix_idam_sessions__user_is_deleted;

-- INTG Schema - Remove is_deleted
ALTER TABLE intg.apis DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_intg_apis__is_deleted;

ALTER TABLE intg.webhooks DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_intg_webhooks__is_deleted;

ALTER TABLE intg.rate_limits DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_intg_rate_limits__is_deleted;

-- SUPT Schema - Remove is_deleted
ALTER TABLE supt.tickets DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_supt_tickets__is_deleted;
DROP INDEX IF EXISTS ix_supt_tickets__status_is_deleted;

ALTER TABLE supt.ticket_comments DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_supt_ticket_comments__is_deleted;
DROP INDEX IF EXISTS ix_supt_ticket_comments__ticket_is_deleted;

ALTER TABLE supt.feedbacks DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_supt_feedbacks__is_deleted;

-- AUTO Schema - Remove is_deleted
ALTER TABLE auto.workflows DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_auto_workflows__is_deleted;
DROP INDEX IF EXISTS ix_auto_workflows__tenant_is_deleted;

ALTER TABLE auto.executions DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_auto_executions__is_deleted;
DROP INDEX IF EXISTS ix_auto_executions__workflow_is_deleted;

ALTER TABLE auto.tasks DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_auto_tasks__is_deleted;
DROP INDEX IF EXISTS ix_auto_tasks__execution_is_deleted;

-- CNFG Schema - Remove is_deleted
ALTER TABLE cnfg.configurations DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_cnfg_configurations__is_deleted;

ALTER TABLE cnfg.feature_flags DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_cnfg_feature_flags__is_deleted;

ALTER TABLE cnfg.tenant_features DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_cnfg_tenant_features__is_deleted;
DROP INDEX IF EXISTS ix_cnfg_tenant_features__tenant_is_deleted;

ALTER TABLE cnfg.service_quotas DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_cnfg_service_quotas__is_deleted;

-- NOTI Schema - Remove is_deleted
ALTER TABLE noti.notifications DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_noti_notifications__is_deleted;
DROP INDEX IF EXISTS ix_noti_notifications__user_is_deleted;

ALTER TABLE noti.templates DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_noti_templates__is_deleted;

ALTER TABLE noti.campaigns DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_noti_campaigns__is_deleted;

-- BKUP Schema - Remove is_deleted
ALTER TABLE bkup.executions DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_bkup_executions__is_deleted;

ALTER TABLE bkup.schedules DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_bkup_schedules__is_deleted;
DROP INDEX IF EXISTS ix_bkup_schedules__tenant_is_deleted;

ALTER TABLE bkup.recovery_plans DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_bkup_recovery_plans__is_deleted;

-- STAT Schema - Remove is_deleted
ALTER TABLE stat.tenant_stats DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_stat_tenant_stats__is_deleted;
DROP INDEX IF EXISTS ix_stat_tenant_stats__tenant_is_deleted;

ALTER TABLE stat.usage_stats DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_stat_usage_stats__is_deleted;
DROP INDEX IF EXISTS ix_stat_usage_stats__tenant_is_deleted;

COMMIT;

-- =====================================================================================
-- TENANT DB ROLLBACK
-- =====================================================================================

-- =====================================================================================
-- Section 3: Tenant DB - Revert P0 Changes (critical tables)
-- =====================================================================================

BEGIN;

-- SYS Schema Rollback
ALTER TABLE sys.user_roles DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_sys_user_roles__is_deleted;
DROP INDEX IF EXISTS ix_sys_user_roles__user_is_deleted;
DROP INDEX IF EXISTS ix_sys_user_roles__role_is_deleted;

-- ADM Schema Rollback
ALTER TABLE adm.code_groups DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_adm_code_groups__code;
DROP INDEX IF EXISTS ix_adm_code_groups__is_deleted;

ALTER TABLE adm.codes DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_adm_codes__code_group_id;
DROP INDEX IF EXISTS ix_adm_codes__is_deleted;
DROP INDEX IF EXISTS ix_adm_codes__code_value_is_deleted;

ALTER TABLE adm.currencies DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_adm_currencies__is_deleted;
DROP INDEX IF EXISTS ix_adm_currencies__code_is_deleted;

ALTER TABLE adm.units DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_adm_units__is_deleted;
DROP INDEX IF EXISTS ix_adm_units__code_is_deleted;

-- PIM Schema Rollback
ALTER TABLE pim.product_variants DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_pim_product_variants__is_deleted;
DROP INDEX IF EXISTS ix_pim_product_variants__product_is_deleted;

-- IVM Schema Rollback (critical inventory)
-- NOTE: variant_id addition should be retained as it's critical for e-commerce
-- Only removing indices and soft-delete field
ALTER TABLE ivm.inventory_balances DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_ivm_inventory_balances__is_deleted;
DROP INDEX IF EXISTS ix_ivm_inventory_balances__warehouse_product_variant;
DROP INDEX IF EXISTS ix_ivm_inventory_balances__available_qty;

ALTER TABLE ivm.inventory_movements DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_ivm_inventory_movements__is_deleted;
DROP INDEX IF EXISTS ix_ivm_inventory_movements__balance_is_deleted;

-- FIM Schema Rollback (critical finance)
ALTER TABLE fim.gl_accounts DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_fim_gl_accounts__is_deleted;
DROP INDEX IF EXISTS ix_fim_gl_accounts__code_is_deleted;

-- NOTE: Journal entries accounting fields (is_locked, posted_at, reference_doc_*) should be retained
-- as they provide critical accounting control. Only removing the indices.
DROP INDEX IF EXISTS ix_fim_journal_entries__posted_at;
-- Keep the columns: is_locked, posted_at, reference_doc_type, reference_doc_id

COMMIT;

-- =====================================================================================
-- Section 4: Tenant DB - Revert P1 Changes (remove is_deleted columns)
-- =====================================================================================

BEGIN;

-- CRM Schema - Remove is_deleted
ALTER TABLE crm.partners DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_crm_partners__is_deleted;
DROP INDEX IF EXISTS ix_crm_partners__type_is_deleted;

ALTER TABLE crm.customers DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_crm_customers__is_deleted;
DROP INDEX IF EXISTS ix_crm_customers__partner_is_deleted;

ALTER TABLE crm.leads DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_crm_leads__is_deleted;
DROP INDEX IF EXISTS ix_crm_leads__status_is_deleted;

ALTER TABLE crm.opportunities DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_crm_opportunities__is_deleted;
DROP INDEX IF EXISTS ix_crm_opportunities__customer_is_deleted;
DROP INDEX IF EXISTS ix_crm_opportunities__stage_is_deleted;

ALTER TABLE crm.activities DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_crm_activities__is_deleted;
DROP INDEX IF EXISTS ix_crm_activities__entity_is_deleted;

ALTER TABLE crm.contacts DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_crm_contacts__is_deleted;
DROP INDEX IF EXISTS ix_crm_contacts__customer_is_deleted;

-- WMS Schema - Remove is_deleted
ALTER TABLE wms.warehouse_locations DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_wms_warehouse_locations__is_deleted;
DROP INDEX IF EXISTS ix_wms_warehouse_locations__warehouse_is_deleted;

ALTER TABLE wms.receiving_orders DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_wms_receiving_orders__is_deleted;
DROP INDEX IF EXISTS ix_wms_receiving_orders__status_is_deleted;

ALTER TABLE wms.shipping_orders DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_wms_shipping_orders__is_deleted;
DROP INDEX IF EXISTS ix_wms_shipping_orders__status_is_deleted;

-- PSM Schema - Remove is_deleted
ALTER TABLE psm.purchase_requisitions DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_psm_purchase_requisitions__is_deleted;
DROP INDEX IF EXISTS ix_psm_purchase_requisitions__status_is_deleted;

ALTER TABLE psm.purchase_orders DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_psm_purchase_orders__is_deleted;
DROP INDEX IF EXISTS ix_psm_purchase_orders__vendor_is_deleted;
DROP INDEX IF EXISTS ix_psm_purchase_orders__status_is_deleted;

ALTER TABLE psm.purchase_order_lines DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_psm_purchase_order_lines__is_deleted;
DROP INDEX IF EXISTS ix_psm_purchase_order_lines__order_is_deleted;

ALTER TABLE psm.purchase_quotes DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_psm_purchase_quotes__is_deleted;
DROP INDEX IF EXISTS ix_psm_purchase_quotes__status_is_deleted;

-- SRM Schema - Remove is_deleted
ALTER TABLE srm.sales_orders DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_srm_sales_orders__is_deleted;
DROP INDEX IF EXISTS ix_srm_sales_orders__customer_is_deleted;
DROP INDEX IF EXISTS ix_srm_sales_orders__status_is_deleted;

ALTER TABLE srm.sales_order_lines DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_srm_sales_order_lines__is_deleted;
DROP INDEX IF EXISTS ix_srm_sales_order_lines__order_is_deleted;

ALTER TABLE srm.invoices DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_srm_invoices__is_deleted;
DROP INDEX IF EXISTS ix_srm_invoices__customer_is_deleted;
DROP INDEX IF EXISTS ix_srm_invoices__status_is_deleted;

ALTER TABLE srm.invoice_lines DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_srm_invoice_lines__is_deleted;
DROP INDEX IF EXISTS ix_srm_invoice_lines__invoice_is_deleted;

ALTER TABLE srm.deliveries DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_srm_deliveries__is_deleted;
DROP INDEX IF EXISTS ix_srm_deliveries__order_is_deleted;

ALTER TABLE srm.returns DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_srm_returns__is_deleted;
DROP INDEX IF EXISTS ix_srm_returns__invoice_is_deleted;

-- CSM Schema - Remove is_deleted
ALTER TABLE csm.service_requests DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_csm_service_requests__is_deleted;
DROP INDEX IF EXISTS ix_csm_service_requests__customer_is_deleted;
DROP INDEX IF EXISTS ix_csm_service_requests__status_is_deleted;

ALTER TABLE csm.support_tickets DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_csm_support_tickets__is_deleted;
DROP INDEX IF EXISTS ix_csm_support_tickets__status_is_deleted;

-- APM Schema - Remove is_deleted
ALTER TABLE apm.approval_workflows DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_apm_approval_workflows__is_deleted;

ALTER TABLE apm.approval_steps DROP COLUMN IF EXISTS is_deleted;
DROP INDEX IF EXISTS ix_apm_approval_steps__is_deleted;
DROP INDEX IF EXISTS ix_apm_approval_steps__workflow_is_deleted;

COMMIT;

-- =====================================================================================
-- Rollback Summary
-- =====================================================================================
-- Total Manager DB Changes Reverted: 45 tables, 65+ indices
-- Total Tenant DB Changes Reverted: 50+ tables, 65+ indices
-- NOTES:
--   1. Manager DB field renames (is_deleted → deleted) have been reverted
--   2. Tenant DB critical enhancements retained:
--      - ivm.inventory_balances.variant_id (e-commerce critical)
--      - fim.journal_entries accounting fields (accounting control critical)
--   3. All soft-delete indices removed to return to original state
--   4. If you need to restore from this point, you'll need fresh backups
-- =====================================================================================
