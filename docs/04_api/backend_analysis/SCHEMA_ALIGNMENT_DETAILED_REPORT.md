# Schema Alignment Detailed Report

**Generated**: 2025-10-25
**Analysis Type**: Database Schemas vs Models vs Modules Alignment

## Executive Summary

- **Total Schemas Analyzed**: 16
- **Total Missing Models**: 1
- **Total Missing Modules**: 13
- **Total Extra Models**: 2
- **Total Extra Modules**: 36

### Status Overview

| Schema | SQL Tables | Models | Modules | Missing Models | Missing Modules | Extra Models | Extra Modules | Status |
|--------|------------|--------|---------|----------------|-----------------|--------------|---------------|--------|
| ADM    | 7          | 7      | 11      | 0              | 0               | 0            | 4             | ⚠️     |
| HRM    | 9          | 9      | 7       | 0              | 2               | 0            | 0             | ⚠️     |
| CRM    | 19         | 19     | 18      | 0              | 3               | 0            | 2             | ⚠️     |
| PIM    | 16         | 16     | 16      | 0              | 0               | 0            | 0             | ✅     |
| WMS    | 8          | 8      | 8       | 0              | 0               | 0            | 0             | ✅     |
| APM    | 4          | 4      | 4       | 0              | 0               | 0            | 0             | ✅     |
| IVM    | 10         | 10     | 14      | 0              | 0               | 0            | 4             | ⚠️     |
| PSM    | 10         | 10     | 13      | 0              | 0               | 0            | 3             | ⚠️     |
| SRM    | 12         | 11     | 14      | 1              | 1               | 0            | 3             | ❌     |
| ASM    | 8          | 8      | 11      | 0              | 1               | 0            | 4             | ⚠️     |
| FIM    | 9          | 9      | 6       | 0              | 6               | 0            | 3             | ⚠️     |
| FAM    | 3          | 3      | 3       | 0              | 0               | 0            | 0             | ✅     |
| LWM    | 3          | 4      | 4       | 0              | 0               | 1            | 1             | ⚠️     |
| BIM    | 4          | 4      | 8       | 0              | 0               | 0            | 4             | ⚠️     |
| COM    | 3          | 3      | 7       | 0              | 0               | 0            | 4             | ⚠️     |
| SYS    | 5          | 6      | 9       | 0              | 0               | 1            | 4             | ⚠️     |

**Legend**: ✅ Fully Aligned | ⚠️ Minor Issues | ❌ Critical Issues

---

## Detailed Action Items

### 1. CRITICAL: Add Missing Models (1 file)

#### SRM Schema
- [ ] **CREATE** `/home/itjee/workspace/cxg/apps/backend-api/src/models/tenants/srm/sales_invoices.py`
  - Source: `packages/database/schemas/tenants/12_srm/08_sales_invoices.sql`
  - Priority: HIGH

---

### 2. CRITICAL: Add Missing Modules (13 directories)

#### HRM Schema (2 modules)
- [ ] **CREATE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/hrm/employees/`
  - Source: `packages/database/schemas/tenants/02_hrm/05_employees.sql`
- [ ] **CREATE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/hrm/salary_structures/`
  - Source: `packages/database/schemas/tenants/02_hrm/08_salary_structures.sql`

#### CRM Schema (3 modules)
- [ ] **CREATE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/crm/contracts/`
  - Source: `packages/database/schemas/tenants/03_crm/04_contracts.sql`
- [ ] **CREATE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/crm/partner_addresses/`
  - Source: `packages/database/schemas/tenants/03_crm/11_partner_addresses.sql`
- [ ] **CREATE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/crm/partners/`
  - Source: `packages/database/schemas/tenants/03_crm/10_partners.sql`

#### SRM Schema (1 module)
- [ ] **CREATE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/srm/sales_invoices/`
  - Source: `packages/database/schemas/tenants/12_srm/08_sales_invoices.sql`
  - Priority: HIGH (missing both model and module)

#### ASM Schema (1 module)
- [ ] **CREATE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/asm/service_requests/`
  - Source: `packages/database/schemas/tenants/13_asm/05_service_requests.sql`

#### FIM Schema (6 modules)
- [ ] **CREATE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/fim/accounts_payable/`
  - Source: `packages/database/schemas/tenants/14_fim/02_accounts_payable.sql`
- [ ] **CREATE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/fim/accounts_receivable/`
  - Source: `packages/database/schemas/tenants/14_fim/03_accounts_receivable.sql`
- [ ] **CREATE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/fim/business_documents/`
  - Source: `packages/database/schemas/tenants/14_fim/04_business_documents.sql`
- [ ] **CREATE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/fim/journal_entries/`
  - Source: `packages/database/schemas/tenants/14_fim/05_journal_entries.sql`
- [ ] **CREATE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/fim/payment_transactions/`
  - Source: `packages/database/schemas/tenants/14_fim/07_payment_transactions.sql`
- [ ] **CREATE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/fim/tax_invoices/`
  - Source: `packages/database/schemas/tenants/14_fim/09_tax_invoices.sql`

---

### 3. Remove Extra Models (2 files)

- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/models/tenants/lwm/approvals.py`
  - Reason: No corresponding SQL table in `packages/database/schemas/tenants/16_lwm/`

- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/models/tenants/sys/code_rule.py`
  - Reason: Duplicate (should use `code_rules.py` - plural form matches SQL)

---

### 4. Remove Extra Modules (36 directories)

#### ADM Schema (4 modules)
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/adm/departments/`
  - Reason: Moved to HRM schema
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/adm/employees/`
  - Reason: Moved to HRM schema
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/adm/positions/`
  - Reason: Not in database schema
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/adm/users/`
  - Reason: Moved to SYS schema

#### CRM Schema (2 modules)
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/crm/contacts/`
  - Reason: Use `partner_contacts` instead
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/crm/customers/`
  - Reason: Use `partners` instead

#### IVM Schema (4 modules)
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/ivm/adjustments/`
  - Reason: Use `inventory_adjustments` instead
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/ivm/products/`
  - Reason: Products are in PIM schema
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/ivm/stock_movements/`
  - Reason: Use `inventory_movements` instead
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/ivm/warehouses/`
  - Reason: Warehouses are in WMS schema

#### PSM Schema (3 modules)
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/psm/receiving/`
  - Reason: Use `purchase_order_receipts` instead
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/psm/requisitions/`
  - Reason: Use `purchase_requisitions` instead
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/psm/vendors/`
  - Reason: Vendors are partners in CRM schema

#### SRM Schema (3 modules)
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/srm/customers/`
  - Reason: Customers are partners in CRM schema
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/srm/quotes/`
  - Reason: Use `quotations` instead
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/srm/sales_activities/`
  - Reason: Not in database schema

#### ASM Schema (4 modules)
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/asm/asset_assignments/`
  - Reason: Not in ASM schema (After-Sales Management, not Asset Management)
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/asm/asset_categories/`
  - Reason: Not in ASM schema
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/asm/assets/`
  - Reason: Not in ASM schema (use FAM for Fixed Assets)
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/asm/maintenance/`
  - Reason: Not in database schema

#### FIM Schema (3 modules)
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/fim/budgets/`
  - Reason: Not in database schema
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/fim/invoices/`
  - Reason: Use `tax_invoices` instead
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/fim/transactions/`
  - Reason: Use `payment_transactions` instead

#### LWM Schema (1 module)
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/lwm/approvals/`
  - Reason: Approvals are in APM schema (Approval Management)

#### BIM Schema (4 modules)
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/bim/dashboards/`
  - Reason: Not in database schema
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/bim/data_sources/`
  - Reason: Not in database schema
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/bim/metrics/`
  - Reason: Not in database schema
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/bim/reports/`
  - Reason: Not in database schema

#### COM Schema (4 modules)
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/com/announcements/`
  - Reason: Not in database schema
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/com/channels/`
  - Reason: Not in database schema
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/com/messages/`
  - Reason: Not in database schema
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/com/threads/`
  - Reason: Not in database schema

#### SYS Schema (4 modules)
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/sys/configurations/`
  - Reason: Not in database schema
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/sys/logs/`
  - Reason: Not in database schema
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/sys/preferences/`
  - Reason: Not in database schema
- [ ] **DELETE** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/sys/settings/`
  - Reason: Settings are in ADM schema

---

## Schemas Fully Aligned (4) ✅

The following schemas are perfectly aligned with no action required:

1. **PIM** (Product Information Management) - 16/16 tables aligned
2. **WMS** (Warehouse Management System) - 8/8 tables aligned
3. **APM** (Approval Management) - 4/4 tables aligned
4. **FAM** (Fixed Asset Management) - 3/3 tables aligned

---

## Priority Order for Fixes

### Phase 1: Critical Fixes (Missing Models/Modules)
1. Add missing model: `srm/sales_invoices.py` ⚠️ HIGH
2. Add missing module: `srm/sales_invoices/` ⚠️ HIGH
3. Add 6 missing FIM modules (finance is critical)
4. Add 3 missing CRM modules
5. Add 2 missing HRM modules
6. Add 1 missing ASM module

### Phase 2: Remove Extra Models
1. Delete `lwm/approvals.py`
2. Delete `sys/code_rule.py` (duplicate)

### Phase 3: Clean Up Extra Modules
1. Clean up ADM schema (4 modules)
2. Clean up IVM schema (4 modules)
3. Clean up BIM schema (4 modules)
4. Clean up COM schema (4 modules)
5. Clean up SYS schema (4 modules)
6. Clean up ASM schema (4 modules)
7. Clean up PSM schema (3 modules)
8. Clean up SRM schema (3 modules)
9. Clean up FIM schema (3 modules)
10. Clean up CRM schema (2 modules)
11. Clean up LWM schema (1 module)

---

## Schema Abbreviation Reference

| Code | Full Name | Description |
|------|-----------|-------------|
| ADM  | Administration | User Management & Common Settings |
| HRM  | Human Resources | Employee, Department, Payroll |
| CRM  | Customer Relationship | Partners, Leads, Opportunities |
| PIM  | Product Information | Products, Categories, Variants |
| WMS  | Warehouse Management | Warehouses, Receiving, Shipping |
| APM  | Approval Management | Workflow Approvals |
| IVM  | Inventory Management | Stock, Movements, Adjustments |
| PSM  | Procurement/Purchasing | Purchase Orders, Requisitions |
| SRM  | Sales/Revenue | Sales Orders, Invoices, Deliveries |
| ASM  | After-Sales Management | Service Requests, Support Tickets |
| FIM  | Finance/Accounting | GL Accounts, Journal Entries |
| FAM  | Fixed Asset Management | Assets, Depreciation |
| LWM  | Workflow Management | Workflows, Tasks, Steps |
| BIM  | BI/Analytics | KPIs, Analytics, Dashboards |
| COM  | Communication | Code Groups, Codes, Workflows |
| SYS  | System Configuration | Users, Roles, Permissions |

---

## Notes

1. **Naming Convention**: All table names should use `snake_case` and match exactly between SQL, models, and modules
2. **Model Files**: Each SQL table should have corresponding `.py` file in models
3. **Module Directories**: Each SQL table should have corresponding subdirectory in modules with CRUD operations
4. **Schema Consolidation**: Some entities were moved between schemas (e.g., users from ADM to SYS, departments from ADM to HRM)

---

## Validation Command

To re-run this analysis:

```bash
cd /home/itjee/workspace/cxg/apps/backend-api
python analyze_schema_alignment.py
```

---

**Report Generated**: 2025-10-25
**Script**: `/home/itjee/workspace/cxg/apps/backend-api/analyze_schema_alignment.py`
