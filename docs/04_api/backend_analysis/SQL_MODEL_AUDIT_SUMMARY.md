# SQL DDL vs Python Models - Audit Summary

**Date**: 2025-10-25
**Audited**: Tenant schemas (ADM, APM, ASM, BIM, COM, CRM, FAM, FIM, HRM, IVM, LWM, PIM, PSM, SRM, SYS, WMS)
**Full Report**: `SQL_MODEL_AUDIT_DETAILED.md` (836 KB, 2,634 issues)

---

## Executive Summary

### Issue Breakdown
- **Total Issues**: 2,634
- **🔴 Critical**: 367 (14%) - Base model fields missing in Python models
- **🟡 Important**: 2,027 (77%) - Column mismatches, missing columns
- **🟢 Minor**: 240 (9%) - Audit fields (created_by, updated_by)

### Key Findings

#### 1. **CRITICAL: Base Model Fields Not Detected (367 issues)**

**Root Cause**: The audit script cannot detect inherited fields from `TenantBaseModel`.

All Python models inherit from `TenantBaseModel` which provides:
- `id` (UUID, primary key)
- `created_at` (TIMESTAMP WITH TIME ZONE, NOT NULL)
- `updated_at` (TIMESTAMP WITH TIME ZONE, nullable)
- `tenant_id` (UUID, NOT NULL, indexed)

**Impact**: These 367 "critical" issues are FALSE POSITIVES. The base class provides these fields, but the parser cannot see inheritance.

**Affected Schemas**: All 16 schemas
- ADM: 20 issues (id, created_at, updated_at across 7 tables)
- APM: 11 issues
- ASM: 23 issues
- BIM: 11 issues
- COM: 8 issues
- CRM: 50 issues
- FAM: 8 issues
- FIM: 26 issues
- HRM: 26 issues
- IVM: 29 issues
- LWM: 8 issues
- PIM: 47 issues
- PSM: 29 issues
- SRM: 35 issues
- SYS: 14 issues
- WMS: 11 issues

**Resolution**: No action needed. These fields exist via inheritance.

---

#### 2. **MINOR: Audit Fields in SQL but Not in Models (240 issues)**

**Affected Fields**:
- `created_by` (UUID)
- `updated_by` (UUID)

**Root Cause**: SQL DDL files include `created_by` and `updated_by` columns, but the Python `TenantBaseModel` does NOT inherit `UserTrackingMixin`.

**Current State**:
```python
# src/models/base.py
class TenantBaseModel(Base, TimestampMixin, TenantMixin):
    """테넌트 모델 클래스 (테넌트 DB용)"""
    __abstract__ = True
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
```

**UserTrackingMixin** is defined but NOT used:
```python
class UserTrackingMixin:
    """사용자 추적 Mixin"""
    created_by: Mapped[UUID | None] = mapped_column(nullable=True)
    updated_by: Mapped[UUID | None] = mapped_column(nullable=True)
```

**Recommendation**:
1. **Option A (Recommended)**: Add `UserTrackingMixin` to `TenantBaseModel`:
   ```python
   class TenantBaseModel(Base, TimestampMixin, UserTrackingMixin, TenantMixin):
   ```
   This makes all models track who created/updated records.

2. **Option B**: Remove `created_by` and `updated_by` from all SQL DDL files if user tracking is not needed.

---

#### 3. **IMPORTANT: Real Discrepancies (2,027 issues)**

These are actual mismatches between SQL and Python models. Categories include:

##### A. Missing Columns in SQL
Tables exist in Python models but columns are missing from SQL DDL.

**Examples**:
- Multiple tables have model fields not reflected in SQL
- Need systematic review schema by schema

##### B. Extra Columns in SQL
SQL has columns that don't exist in Python models.

**Examples**:
- Legacy columns that should be removed
- Columns added to SQL but not to models

##### C. Type Mismatches
SQL and Python use incompatible types.

**Examples**:
- SQL: `VARCHAR(50)` vs Model: `Integer`
- SQL: `NUMERIC` vs Model: `String`

##### D. Nullable Mismatches
Different nullable constraints between SQL and models.

**Examples**:
- SQL: `NOT NULL` vs Model: `nullable=True`
- SQL: `NULL` vs Model: `nullable=False`

---

## Recommended Action Plan

### Phase 1: Fix Base Model (High Priority)
**Timeline**: Immediate

1. **Update TenantBaseModel** to include `UserTrackingMixin`:
   ```python
   class TenantBaseModel(Base, TimestampMixin, UserTrackingMixin, TenantMixin):
       """테넌트 모델 클래스 (테넌트 DB용)"""
       __abstract__ = True
       id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
   ```

2. **Verify** all SQL DDL files have `created_by` and `updated_by` columns:
   ```sql
   created_by  UUID,  -- 등록자 UUID
   updated_by  UUID,  -- 수정자 UUID
   ```

**Impact**: Resolves all 240 minor issues + aligns audit tracking across all tables.

---

### Phase 2: Schema-by-Schema Review (Medium Priority)
**Timeline**: 1-2 weeks

For each schema, systematically fix the ~2,027 important issues:

#### Priority Order (by number of issues):
1. **CRM** (highest business impact) - ~50 critical + many important
2. **PIM** (product catalog) - ~47 critical + many important
3. **SRM** (sales) - ~35 critical + many important
4. **PSM** (procurement) - ~29 critical + many important
5. **IVM** (inventory) - ~29 critical + many important
6. **HRM** (HR) - ~26 critical + many important
7. **FIM** (finance) - ~26 critical + many important
8. **ASM** (after-sales) - ~23 critical + many important
9. Other schemas - remaining issues

#### Review Process per Schema:
1. Read detailed report section for schema
2. For each table, compare SQL DDL with Python model
3. Fix discrepancies:
   - Add missing columns to SQL or model
   - Remove extra columns
   - Align data types
   - Fix nullable constraints
4. Test with sample migrations
5. Document changes

---

### Phase 3: Automated Validation (Low Priority)
**Timeline**: After Phase 1-2 complete

1. **Improve audit script** to:
   - Detect inherited fields from base classes
   - Reduce false positives
   - Generate migration scripts automatically

2. **Add to CI/CD pipeline**:
   - Run audit on every PR
   - Fail if critical mismatches detected

---

## Schema-Specific Summary

### ADM (Administration) - 20 critical + issues
- **Critical**: All base field false positives
- **Important**: TBD (need manual review of detailed report)
- **Tables**: code_groups, codes, currencies, exchange_rates, payment_terms, settings, units

### APM (Approval Management) - 11 critical + issues
- **Critical**: All base field false positives
- **Tables**: approval_histories, approval_line_items, approval_lines, approval_requests

### ASM (After-Sales Management) - 23 critical + issues
- **Critical**: All base field false positives
- **Tables**: customer_feedback, faqs, nps_surveys, service_parts, service_requests, service_works, support_tickets, ticket_comments

### BIM (Business Intelligence) - 11 critical + issues
- **Critical**: All base field false positives
- **Tables**: kpi_definitions, kpi_targets, purchase_analytics, sales_analytics

### COM (Communication) - 8 critical + issues
- **Critical**: All base field false positives
- **Tables**: code_groups, codes, workflows

### CRM (Customer Relationship) - 50 critical + many important
- **Critical**: All base field false positives
- **Tables**: activities, contracts, customer_segment_members, customer_segments, customer_surveys, email_templates, interactions, leads, opportunities, partner_addresses, partner_banks, partner_contacts, partner_managers, partners, rfq_items, rfqs, sales_targets

### FAM (Fixed Asset Management) - 8 critical + issues
- **Critical**: All base field false positives
- **Tables**: asset_depreciation, asset_disposals, fixed_assets

### FIM (Financial Management) - 26 critical + issues
- **Critical**: All base field false positives
- **Tables**: accounts, accounts_payable, accounts_receivable, business_documents, journal_entries, journal_entry_lines, payment_transactions, tax_invoice_lines, tax_invoices

### HRM (Human Resources) - 26 critical + issues
- **Critical**: All base field false positives
- **Tables**: absences, attendances, department_histories, departments, employee_histories, employees, leave_policies, payroll_records, salary_structures

### IVM (Inventory Management) - 29 critical + issues
- **Critical**: All base field false positives
- **Tables**: inventory_adjustments, inventory_balances, inventory_count_items, inventory_counts, inventory_cycle_counts, inventory_lots, inventory_movements, inventory_reservations, inventory_serial_numbers, inventory_transfers

### LWM (Workflow Management) - 8 critical + issues
- **Critical**: All base field false positives
- **Tables**: steps, tasks, workflows

### PIM (Product Information) - 47 critical + many important
- **Critical**: All base field false positives
- **Tables**: brands, categories, category_managers, makers, product_images, product_managers, product_option_values, product_options, product_price_history, product_relations, product_suppliers, product_tags, product_unit_conversions, product_units, product_variants, products

### PSM (Procurement) - 29 critical + issues
- **Critical**: All base field false positives
- **Tables**: purchase_order_items, purchase_order_pr_links, purchase_order_receipt_items, purchase_order_receipts, purchase_orders, purchase_price_agreements, purchase_quotation_items, purchase_quotations, purchase_requisition_items, purchase_requisitions

### SRM (Sales & Revenue) - 35 critical + issues
- **Critical**: All base field false positives
- **Tables**: promotion_usage, promotions, quotation_items, quotations, sales_deliveries, sales_delivery_items, sales_invoice_items, sales_invoices, sales_order_items, sales_orders, sales_return_items, sales_returns

### SYS (System Configuration) - 14 critical + issues
- **Critical**: All base field false positives
- **Tables**: code_rules, permissions, role_permissions, roles, users

### WMS (Warehouse Management) - 11 critical + issues
- **Critical**: All base field false positives
- **Tables**: inventory, warehouse_employees, warehouse_locations, warehouses

---

## How to Use the Detailed Report

The full audit report (`SQL_MODEL_AUDIT_DETAILED.md`) contains 2,634 line-by-line issues.

### Structure:
```
## CRITICAL Issues (367)
  ### Schema: ADM (20 issues)
    #### Missing Critical Column in Model (20)
      - Individual issue with SQL line, Model line, Description, Fix

## IMPORTANT Issues (2,027)
  ### Schema: ADM
    #### Extra SQL Column
    #### Missing SQL Column
    #### Type Mismatch
    #### Nullable Mismatch

## MINOR Issues (240)
  ### Schema: ADM
    #### Extra SQL Column (audit fields)
```

### Filtering:
```bash
# Find all issues for a specific schema
grep -A 5 "Schema: CRM" SQL_MODEL_AUDIT_DETAILED.md

# Find all type mismatches
grep -A 5 "Type Mismatch" SQL_MODEL_AUDIT_DETAILED.md

# Find all missing columns
grep -A 5 "Missing SQL Column" SQL_MODEL_AUDIT_DETAILED.md
```

---

## Tools Created

### 1. `audit_sql_models_v2.py`
- **Location**: `/home/itjee/workspace/cxg/apps/backend-api/audit_sql_models_v2.py`
- **Purpose**: Compare SQL DDL files with Python SQLAlchemy models
- **Output**: Detailed markdown report with 2,634 issues
- **Run**: `python audit_sql_models_v2.py`

### 2. Generated Reports
- **SQL_MODEL_AUDIT_DETAILED.md** (836 KB): Full line-by-line comparison
- **SQL_MODEL_AUDIT_SUMMARY.md** (this file): Executive summary and action plan

---

## Next Steps

1. **Immediate**: Review this summary with the team
2. **This Week**: Implement Phase 1 (fix base model)
3. **Next 2 Weeks**: Execute Phase 2 (schema-by-schema fixes)
4. **Ongoing**: Run audit script before each deployment

---

## Notes

- **False Positives**: 367 "critical" issues are not real - they're inherited from base class
- **Real Issues**: ~2,267 actual discrepancies (2,027 important + 240 minor)
- **Focus Areas**: CRM, PIM, SRM have the most issues and highest business impact
- **Base Model Fix**: Single change to `TenantBaseModel` will resolve 240 issues instantly

---

## Contact

For questions about this audit:
- **Audit Script**: `/home/itjee/workspace/cxg/apps/backend-api/audit_sql_models_v2.py`
- **Detailed Report**: `/home/itjee/workspace/cxg/apps/backend-api/SQL_MODEL_AUDIT_DETAILED.md`
- **SQL Schemas**: `/home/itjee/workspace/cxg/packages/database/schemas/tenants/`
- **Python Models**: `/home/itjee/workspace/cxg/apps/backend-api/src/models/tenants/`
