# Comprehensive Audit Report: STATUS vs IS_ACTIVE Columns
# Tenant Database Schemas Analysis

**Date**: 2025-10-24
**Scope**: All active SQL files in `/home/itjee/workspace/cxg/packages/database/schemas/tenants/`
**Excluded**: `_old` and `backup` folders

---

## Executive Summary

### Overall Statistics

| Category | Count | Percentage | Description |
|----------|-------|------------|-------------|
| **Category A** (Both) | 0 | 0.0% | Tables with both STATUS and IS_ACTIVE (redundancy) |
| **Category B** (IS_ACTIVE only) | 22 | 17.3% | Tables with simple active/inactive toggle |
| **Category C** (STATUS only) | 72 | 56.7% | Tables with complex lifecycle management |
| **Category D** (Neither) | 33 | 26.0% | Tables without state management |
| **Total** | **127** | **100.0%** | Total tables analyzed |

**Key Finding**: **NO REDUNDANCY DETECTED** - Zero tables have both STATUS and IS_ACTIVE columns, indicating excellent database design with clear separation of concerns.

---

## CATEGORY A: Both STATUS and IS_ACTIVE (Potential Redundancy)

**Count**: 0 tables

✅ **EXCELLENT** - No tables have redundant state management columns. This indicates:
- Clear design decisions
- No conflicting state management patterns
- Proper separation between simple toggles and complex workflows

---

## CATEGORY B: Only IS_ACTIVE (Pure Active/Inactive Toggle)

**Count**: 22 tables (17.3%)

These tables use a simple boolean toggle for enabling/disabling records. They represent **configuration data** or **master data** that don't require complex lifecycle management.

### Administration (adm) - 6 tables

| Table | File Path | Purpose |
|-------|-----------|---------|
| `adm.code_groups` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/01_adm/01_code_groups.sql` | Common code groups (master data) |
| `adm.codes` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/01_adm/02_codes.sql` | Common codes (master data) |
| `adm.settings` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/01_adm/03_settings.sql` | System settings (configuration) |
| `adm.currencies` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/01_adm/04_currencies.sql` | Currency master data |
| `adm.units` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/01_adm/06_units.sql` | Unit of measure master data |
| `adm.payment_terms` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/01_adm/07_payment_terms.sql` | Payment terms configuration |

### Human Resources (hrm) - 2 tables

| Table | File Path | Purpose |
|-------|-----------|---------|
| `hrm.salary_structures` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/02_hrm/05_salary_structures.sql` | Salary structure templates |
| `hrm.leave_policies` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/02_hrm/09_leave_policies.sql` | Leave policy configuration |

### Customer Relationship Management (crm) - 1 table

| Table | File Path | Purpose |
|-------|-----------|---------|
| `crm.customer_segment_members` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/03_crm/14_customer_segment_members.sql` | Customer segment membership |

### Approval Management (apm) - 1 table

| Table | File Path | Purpose |
|-------|-----------|---------|
| `apm.approval_lines` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/06_apm/01_approval_lines.sql` | Approval line configuration |

### Inventory Management (ivm) - 1 table

| Table | File Path | Purpose |
|-------|-----------|---------|
| `ivm.inventory_cycle_counts` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/10_ivm/10_inventory_cycle_counts.sql` | Cycle count schedules |

### Sales & Revenue (srm) - 1 table

| Table | File Path | Purpose |
|-------|-----------|---------|
| `srm.promotions` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/12_srm/12_promotions.sql` | Promotion campaigns |

### Finance Management (fim) - 1 table

| Table | File Path | Purpose |
|-------|-----------|---------|
| `fim.accounts` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/14_fim/01_accounts.sql` | Chart of accounts |

### Business Intelligence (bim) - 1 table

| Table | File Path | Purpose |
|-------|-----------|---------|
| `bim.kpi_definitions` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/20_bim/01_kpi_definitions.sql` | KPI definition master data |

### Common/Workflow (com) - 3 tables

| Table | File Path | Purpose |
|-------|-----------|---------|
| `com.code_groups` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/21_com/01_code_groups.sql` | Common code groups |
| `com.codes` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/21_com/02_codes.sql` | Common codes |
| `com.workflows` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/21_com/03_workflows.sql` | Workflow definitions |

### System (sys) - 5 tables

| Table | File Path | Purpose |
|-------|-----------|---------|
| `sys.users` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/22_sys/01_users.sql` | System users |
| `sys.roles` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/22_sys/02_roles.sql` | User roles |
| `sys.permissions` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/22_sys/03_permissions.sql` | System permissions |
| `sys.role_permissions` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/22_sys/04_role_permissions.sql` | Role-permission mapping |
| `sys.code_rules` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/22_sys/05_code_rules.sql` | Code generation rules |

**Pattern**: These tables represent **configuration**, **master data**, or **templates** that can be toggled on/off but don't have complex workflows.

---

## CATEGORY C: Only STATUS (Complex Lifecycle)

**Count**: 72 tables (56.7%)

These tables use STATUS to manage **complex business workflows** with multiple states. They represent transactional data with distinct lifecycle stages.

### Human Resources (hrm) - 6 tables

| Table | Status Values | File Path |
|-------|---------------|-----------|
| `hrm.departments` | ACTIVE, INACTIVE, CLOSED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/02_hrm/01_departments.sql` |
| `hrm.employees` | ACTIVE, PROBATION, LEAVE, TERMINATED, RETIRED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/02_hrm/02_employees.sql` |
| `hrm.department_histories` | PENDING, APPROVED, REJECTED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/02_hrm/03_department_histories.sql` |
| `hrm.employee_histories` | PENDING, APPROVED, REJECTED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/02_hrm/04_employee_histories.sql` |
| `hrm.attendances` | NORMAL, LATE, EARLY_LEAVE, ABSENT, APPROVED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/02_hrm/07_attendances.sql` |
| `hrm.absences` | DRAFT, SUBMITTED, APPROVED, REJECTED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/02_hrm/08_absences.sql` |

### Customer Relationship Management (crm) - 15 tables

| Table | Status Values | File Path |
|-------|---------------|-----------|
| `crm.partners` | ACTIVE, INACTIVE, SUSPENDED, CLOSED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/03_crm/01_partners.sql` |
| `crm.partner_contacts` | ACTIVE, INACTIVE | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/03_crm/02_partner_contacts.sql` |
| `crm.partner_addresses` | ACTIVE, SUSPENDED, INACTIVE | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/03_crm/03_partner_addresses.sql` |
| `crm.partner_managers` | ACTIVE, TERMINATED, EXPIRED, INACTIVE | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/03_crm/04_partner_managers.sql` |
| `crm.partner_banks` | ACTIVE, INACTIVE, SUSPENDED, CLOSED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/03_crm/05_partner_banks.sql` |
| `crm.leads` | NEW, CONTACTED, QUALIFIED, CONVERTED, LOST | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/03_crm/06_leads.sql` |
| `crm.opportunities` | OPEN, WON, LOST, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/03_crm/07_opportunities.sql` |
| `crm.activities` | PLANNED, IN_PROGRESS, COMPLETED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/03_crm/08_activities.sql` |
| `crm.campaigns` | PLANNED, IN_PROGRESS, COMPLETED, ON_HOLD, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/03_crm/10_campaigns.sql` |
| `crm.sales_targets` | ACTIVE, COMPLETED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/03_crm/12_sales_targets.sql` |
| `crm.customer_segments` | ACTIVE, INACTIVE, ARCHIVED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/03_crm/13_customer_segments.sql` |
| `crm.customer_surveys` | SENT, PENDING, RESPONDED, EXPIRED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/03_crm/15_customer_surveys.sql` |
| `crm.email_templates` | DRAFT, ACTIVE, ARCHIVED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/03_crm/16_email_templates.sql` |
| `crm.rfqs` | DRAFT, SUBMITTED, IN_REVIEW, QUOTED, DECLINED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/03_crm/17_rfqs.sql` |
| `crm.contracts` | DRAFT, ACTIVE, SUSPENDED, EXPIRED, TERMINATED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/03_crm/19_contracts.sql` |

### Product Information Management (pim) - 13 tables

| Table | Status Values | File Path |
|-------|---------------|-----------|
| `pim.makers` | PENDING, ACTIVE, INACTIVE, DISCONTINUED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/04_pim/01_makers.sql` |
| `pim.brands` | PENDING, ACTIVE, INACTIVE, DISCONTINUED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/04_pim/02_brands.sql` |
| `pim.categories` | PENDING, ACTIVE, INACTIVE, DISCONTINUED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/04_pim/03_categories.sql` |
| `pim.category_managers` | ACTIVE, TERMINATED, EXPIRED, INACTIVE | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/04_pim/04_category_managers.sql` |
| `pim.products` | PENDING, ACTIVE, INACTIVE, DISCONTINUED, EOL | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/04_pim/05_products.sql` |
| `pim.product_managers` | ACTIVE, TERMINATED, EXPIRED, INACTIVE | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/04_pim/06_product_managers.sql` |
| `pim.product_images` | PENDING, ACTIVE, INACTIVE | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/04_pim/07_product_images.sql` |
| `pim.product_suppliers` | ACTIVE, INACTIVE, SUSPENDED, TERMINATED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/04_pim/08_product_suppliers.sql` |
| `pim.product_price_history` | ACTIVE, INACTIVE, EXPIRED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/04_pim/09_product_price_history.sql` |
| `pim.product_options` | ACTIVE, INACTIVE | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/04_pim/10_product_options.sql` |
| `pim.product_option_values` | ACTIVE, INACTIVE, OUT_OF_STOCK | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/04_pim/11_product_option_values.sql` |
| `pim.product_variants` | ACTIVE, INACTIVE, OUT_OF_STOCK, DISCONTINUED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/04_pim/12_product_variants.sql` |
| `pim.product_units` | ACTIVE, INACTIVE | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/04_pim/13_product_units.sql` |
| `pim.product_unit_conversions` | ACTIVE, INACTIVE | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/04_pim/14_product_unit_conversions.sql` |
| `pim.product_relations` | ACTIVE, INACTIVE | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/04_pim/15_product_relations.sql` |
| `pim.product_tags` | ACTIVE, INACTIVE, EXPIRED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/04_pim/16_product_tags.sql` |

### Warehouse Management (wms) - 6 tables

| Table | Status Values | File Path |
|-------|---------------|-----------|
| `wms.warehouses` | ACTIVE, INACTIVE, SUSPENDED, MAINTENANCE, CLOSED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/05_wms/01_warehouses.sql` |
| `wms.warehouse_employees` | ACTIVE, INACTIVE, SUSPENDED, TERMINATED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/05_wms/02_warehouse_employees.sql` |
| `wms.warehouse_locations` | ACTIVE, INACTIVE, BLOCKED, DAMAGED, MAINTENANCE, RESERVED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/05_wms/03_warehouse_locations.sql` |
| `wms.receiving` | DRAFT, CONFIRMED, COMPLETED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/05_wms/04_receiving.sql` |
| `wms.shipping` | DRAFT, CONFIRMED, COMPLETED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/05_wms/06_shipping.sql` |
| `wms.inventory` | ACTIVE, INACTIVE, LOCKED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/05_wms/08_inventory.sql` |

### Approval Management (apm) - 1 table

| Table | Status Values | File Path |
|-------|---------------|-----------|
| `apm.approval_requests` | PENDING, IN_PROGRESS, APPROVED, REJECTED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/06_apm/03_approval_requests.sql` |

### Inventory Management (ivm) - 7 tables

| Table | Status Values | File Path |
|-------|---------------|-----------|
| `ivm.inventory_transfers` | PENDING, IN_TRANSIT, COMPLETED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/10_ivm/03_inventory_transfers.sql` |
| `ivm.inventory_adjustments` | PENDING, APPROVED, REJECTED, COMPLETED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/10_ivm/04_inventory_adjustments.sql` |
| `ivm.inventory_reservations` | ACTIVE, FULFILLED, RELEASED, EXPIRED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/10_ivm/05_inventory_reservations.sql` |
| `ivm.inventory_lots` | ACTIVE, QUARANTINE, EXPIRED, RECALLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/10_ivm/06_inventory_lots.sql` |
| `ivm.inventory_serial_numbers` | AVAILABLE, RESERVED, SHIPPED, SOLD, IN_SERVICE, RETURNED, SCRAPPED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/10_ivm/07_inventory_serial_numbers.sql` |
| `ivm.inventory_counts` | PLANNED, IN_PROGRESS, COMPLETED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/10_ivm/08_inventory_counts.sql` |

### Procurement/Purchase Management (psm) - 5 tables

| Table | Status Values | File Path |
|-------|---------------|-----------|
| `psm.purchase_requisitions` | DRAFT, SUBMITTED, APPROVED, REJECTED, ORDERED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/11_psm/01_purchase_requisitions.sql` |
| `psm.purchase_orders` | DRAFT, APPROVED, ORDERED, RECEIVING, COMPLETED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/11_psm/03_purchase_orders.sql` |
| `psm.purchase_quotations` | DRAFT, SUBMITTED, REVIEWED, SELECTED, REJECTED, EXPIRED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/11_psm/05_purchase_quotations.sql` |
| `psm.purchase_price_agreements` | DRAFT, ACTIVE, EXPIRED, TERMINATED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/11_psm/07_purchase_price_agreements.sql` |
| `psm.purchase_order_receipts` | DRAFT, IN_PROGRESS, INSPECTING, COMPLETED, REJECTED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/11_psm/09_purchase_order_receipts.sql` |

### Sales & Revenue Management (srm) - 4 tables

| Table | Status Values | File Path |
|-------|---------------|-----------|
| `srm.quotations` | DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/12_srm/01_quotations.sql` |
| `srm.sales_orders` | DRAFT, CONFIRMED, PROCESSING, SHIPPED, COMPLETED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/12_srm/03_sales_orders.sql` |
| `srm.sales_deliveries` | DRAFT, CONFIRMED, PACKED, SHIPPED, DELIVERED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/12_srm/05_sales_deliveries.sql` |
| `srm.sales_returns` | DRAFT, CONFIRMED, RECEIVED, REFUNDED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/12_srm/09_sales_returns.sql` |

### After-Sales Management (asm) - 5 tables

| Table | Status Values | File Path |
|-------|---------------|-----------|
| `asm.service_requests` | RECEIVED, DIAGNOSED, IN_PROGRESS, COMPLETED, CLOSED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/13_asm/01_service_requests.sql` |
| `asm.service_works` | IN_PROGRESS, COMPLETED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/13_asm/02_service_works.sql` |
| `asm.support_tickets` | OPEN, IN_PROGRESS, RESOLVED, CLOSED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/13_asm/04_support_tickets.sql` |
| `asm.customer_feedback` | NEW, REVIEWED, RESPONDED, CLOSED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/13_asm/07_customer_feedback.sql` |
| `asm.nps_surveys` | SENT, PENDING, RESPONDED, CLOSED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/13_asm/08_nps_surveys.sql` |

### Finance Management (fim) - 6 tables

| Table | Status Values | File Path |
|-------|---------------|-----------|
| `fim.journal_entries` | DRAFT, POSTED, CANCELLED, REVERSED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/14_fim/02_journal_entries.sql` |
| `fim.accounts_receivable` | OPEN, PARTIAL, PAID, OVERDUE, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/14_fim/04_accounts_receivable.sql` |
| `fim.accounts_payable` | OPEN, PARTIAL, PAID, OVERDUE, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/14_fim/05_accounts_payable.sql` |
| `fim.payment_transactions` | PENDING, COMPLETED, FAILED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/14_fim/06_payment_transactions.sql` |
| `fim.business_documents` | DRAFT, PENDING, APPROVED, POSTED, REJECTED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/14_fim/07_business_documents.sql` |
| `fim.tax_invoices` | DRAFT, ISSUED, CONFIRMED, SENT, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/14_fim/08_tax_invoices.sql` |

### Fixed Asset Management (fam) - 1 table

| Table | Status Values | File Path |
|-------|---------------|-----------|
| `fam.fixed_assets` | IN_USE, IDLE, UNDER_MAINTENANCE, LOST, DISPOSED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/15_fam/01_fixed_assets.sql` |

### Business Intelligence (bim) - 1 table

| Table | Status Values | File Path |
|-------|---------------|-----------|
| `bim.kpi_targets` | NOT_STARTED, IN_PROGRESS, ACHIEVED, NOT_ACHIEVED, EXCEEDED, CANCELLED | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/20_bim/02_kpi_targets.sql` |

**Pattern**: These tables represent **transactional data** with distinct lifecycle stages requiring workflow management (Draft → Submitted → Approved → Completed, etc.).

---

## CATEGORY D: Neither STATUS nor IS_ACTIVE (Configuration/Static)

**Count**: 33 tables (26.0%)

These tables don't require state management because they represent **immutable records**, **line items**, **historical logs**, or **analytical data**.

### By Module

| Module | Count | Tables |
|--------|-------|--------|
| **adm** | 1 | exchange_rates |
| **hrm** | 1 | payroll_records |
| **crm** | 3 | interactions, campaign_members, rfq_items |
| **wms** | 2 | receiving_items, shipping_items |
| **apm** | 2 | approval_line_items, approval_histories |
| **ivm** | 3 | inventory_balances, inventory_movements, inventory_count_items |
| **psm** | 5 | purchase_requisition_items, purchase_order_items, purchase_quotation_items, purchase_order_pr_links, purchase_order_receipt_items |
| **srm** | 7 | quotation_items, sales_order_items, sales_delivery_items, sales_invoices (VIEW), sales_invoice_items, sales_return_items, promotion_usage |
| **asm** | 3 | service_parts, ticket_comments, faqs |
| **fim** | 2 | journal_entry_lines, tax_invoice_lines |
| **fam** | 2 | asset_depreciation, asset_disposals |
| **bim** | 2 | sales_analytics, purchase_analytics |

### Full List

| Table | File Path | Reason |
|-------|-----------|--------|
| `adm.exchange_rates` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/01_adm/05_exchange_rates.sql` | Historical rate data |
| `hrm.payroll_records` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/02_hrm/06_payroll_records.sql` | Historical payroll data |
| `crm.interactions` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/03_crm/09_interactions.sql` | Historical activity log |
| `crm.campaign_members` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/03_crm/11_campaign_members.sql` | Campaign membership (junction table) |
| `crm.rfq_items` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/03_crm/18_rfq_items.sql` | Line items (inherit parent status) |
| `wms.receiving_items` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/05_wms/05_receiving_items.sql` | Line items (inherit parent status) |
| `wms.shipping_items` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/05_wms/07_shipping_items.sql` | Line items (inherit parent status) |
| `apm.approval_line_items` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/06_apm/02_approval_line_items.sql` | Approval configuration detail |
| `apm.approval_histories` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/06_apm/04_approval_histories.sql` | Immutable history log |
| `ivm.inventory_balances` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/10_ivm/01_inventory_balances.sql` | Snapshot/balance data |
| `ivm.inventory_movements` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/10_ivm/02_inventory_movements.sql` | Movement transaction log |
| `ivm.inventory_count_items` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/10_ivm/09_inventory_count_items.sql` | Line items (inherit parent status) |
| `psm.purchase_requisition_items` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/11_psm/02_purchase_requisition_items.sql` | Line items (inherit parent status) |
| `psm.purchase_order_items` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/11_psm/04_purchase_order_items.sql` | Line items (inherit parent status) |
| `psm.purchase_quotation_items` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/11_psm/06_purchase_quotation_items.sql` | Line items (inherit parent status) |
| `psm.purchase_order_pr_links` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/11_psm/08_purchase_order_pr_links.sql` | Junction/link table |
| `psm.purchase_order_receipt_items` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/11_psm/10_purchase_order_receipt_items.sql` | Line items (inherit parent status) |
| `srm.quotation_items` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/12_srm/02_quotation_items.sql` | Line items (inherit parent status) |
| `srm.sales_order_items` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/12_srm/04_sales_order_items.sql` | Line items (inherit parent status) |
| `srm.sales_delivery_items` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/12_srm/06_sales_delivery_items.sql` | Line items (inherit parent status) |
| `srm.vw_sales_invoices` (VIEW) | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/12_srm/07_sales_invoices.sql` | View (not a table) |
| `srm.sales_invoice_items` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/12_srm/08_sales_invoice_items.sql` | Line items (inherit parent status) |
| `srm.sales_return_items` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/12_srm/10_sales_return_items.sql` | Line items (inherit parent status) |
| `srm.promotion_usage` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/12_srm/13_promotion_usage.sql` | Usage transaction log |
| `asm.service_parts` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/13_asm/03_service_parts.sql` | Line items (inherit parent status) |
| `asm.ticket_comments` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/13_asm/05_ticket_comments.sql` | Comments/thread data |
| `asm.faqs` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/13_asm/06_faqs.sql` | Knowledge base content |
| `fim.journal_entry_lines` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/14_fim/03_journal_entry_lines.sql` | Line items (inherit parent status) |
| `fim.tax_invoice_lines` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/14_fim/09_tax_invoice_lines.sql` | Line items (inherit parent status) |
| `fam.asset_depreciation` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/15_fam/02_asset_depreciation.sql` | Historical depreciation records |
| `fam.asset_disposals` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/15_fam/03_asset_disposals.sql` | Disposal transaction records |
| `bim.sales_analytics` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/20_bim/03_sales_analytics.sql` | Analytical/aggregated data |
| `bim.purchase_analytics` | `/home/itjee/workspace/cxg/packages/database/schemas/tenants/20_bim/04_purchase_analytics.sql` | Analytical/aggregated data |

**Pattern**: These tables represent **immutable transactions**, **line items** (status inherited from parent), **historical logs**, **snapshots**, or **analytical data** that don't require their own state management.

---

## Design Patterns Observed

### 1. Master Data Pattern (IS_ACTIVE)
**Used for**: Configuration, code tables, master data, templates
- **Columns**: `is_active BOOLEAN`, `is_deleted BOOLEAN`
- **Purpose**: Simple enable/disable toggle
- **Examples**: code_groups, codes, currencies, units, settings

### 2. Transactional Workflow Pattern (STATUS)
**Used for**: Business documents, process flows, lifecycle management
- **Columns**: `status VARCHAR`, `is_deleted BOOLEAN`
- **Purpose**: Complex workflow with multiple states
- **Examples**: purchase_orders, sales_orders, service_requests

### 3. Line Item Pattern (Neither)
**Used for**: Detail/line items that inherit parent status
- **Columns**: Just `is_deleted BOOLEAN`
- **Purpose**: Line items follow parent document status
- **Examples**: purchase_order_items, sales_order_items, quotation_items

### 4. Historical Log Pattern (Neither)
**Used for**: Immutable transaction logs, history tables
- **Columns**: Just `is_deleted BOOLEAN` (or sometimes none)
- **Purpose**: Append-only historical records
- **Examples**: approval_histories, inventory_movements, interactions

### 5. Analytical Data Pattern (Neither)
**Used for**: Aggregated data, analytics, snapshots
- **Columns**: Minimal state columns
- **Purpose**: Read-only analytical data
- **Examples**: sales_analytics, purchase_analytics, inventory_balances

---

## Recommendations

### ✅ Strengths

1. **Zero Redundancy**: No tables have both STATUS and IS_ACTIVE
2. **Clear Separation**: Distinct patterns for master data vs transactional data
3. **Consistent Naming**: All use `status` (not status_code, state, etc.)
4. **Consistent Soft Delete**: All tables use `is_deleted BOOLEAN`

### 📋 Standards to Maintain

1. **Master Data**: Use `is_active BOOLEAN` for simple toggles
2. **Transactional Data**: Use `status VARCHAR` with CHECK constraints
3. **Line Items**: Inherit parent status (no dedicated status column)
4. **History/Logs**: No state columns needed (immutable data)

### 🔍 Areas for Consideration

1. **Status Value Documentation**: Consider creating a centralized documentation of all status values and their meanings for each module
2. **Status Transitions**: Document valid status transitions for workflow tables
3. **Status Indexing**: Ensure all status columns have appropriate indexes for query performance
4. **Consistency Check**: Some similar tables use different status values (e.g., ACTIVE/INACTIVE in some PIM tables could be simplified to use is_active)

---

## Appendix: File Analysis Details

### Total Files Analyzed
- **SQL files found**: 142
- **Schema files (skipped)**: 15 (00_schema.sql files)
- **Tables analyzed**: 127
- **Views found**: 1 (srm.vw_sales_invoices)

### Files Excluded from Analysis
- All files in `_old/` directories
- All files in `backup/` directories
- Schema initialization files (`00_schema.sql`)

### Schema Coverage

| Schema | Code | Tables Analyzed | Notes |
|--------|------|-----------------|-------|
| Administration | adm | 6 | Master data & configuration |
| Human Resources | hrm | 9 | Employee & attendance management |
| Customer Relationship | crm | 19 | Partner & sales pipeline |
| Product Information | pim | 16 | Product catalog & variants |
| Warehouse Management | wms | 8 | Warehouse & inventory operations |
| Approval Management | apm | 4 | Workflow approvals |
| Inventory Management | ivm | 10 | Inventory tracking & movements |
| Procurement/Purchase | psm | 10 | Purchase requisitions & orders |
| Sales & Revenue | srm | 12 | Sales orders & invoices (1 is view) |
| After-Sales Management | asm | 8 | Service requests & support |
| Finance Management | fim | 9 | Accounting & finance |
| Fixed Asset Management | fam | 3 | Asset lifecycle |
| Business Intelligence | bim | 4 | KPIs & analytics |
| Common/Workflow | com | 3 | Common workflow definitions |
| System | sys | 5 | Users & permissions |

---

**Report Generated**: 2025-10-24
**Analysis Script**: `/home/itjee/workspace/cxg/analyze_status_columns.py`
**Total Execution Time**: < 1 second
