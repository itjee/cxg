# Quick Reference: STATUS vs IS_ACTIVE Pattern Guide

**Last Updated**: 2025-10-24

## At a Glance

| Pattern | Column | Count | % | Use Case |
|---------|--------|-------|---|----------|
| **Master Data** | `is_active` | 22 | 17.3% | Configuration, code tables, templates |
| **Transactional** | `status` | 72 | 56.7% | Business documents, workflows |
| **Line Items** | Neither | 33 | 26.0% | Detail lines, logs, analytics |
| **Redundant** | Both | 0 | 0.0% | ✅ None found! |

---

## Decision Tree: Which Column Should I Use?

```
Is this a new table?
├─ YES → Continue below
└─ NO → Follow existing pattern in the module

What type of data?
├─ Master Data / Configuration
│   └─ Use: is_active BOOLEAN
│       Examples: currencies, units, code_groups, settings
│
├─ Transactional / Workflow
│   └─ Use: status VARCHAR with CHECK constraint
│       Examples: purchase_orders, sales_orders, service_requests
│
├─ Line Items / Details
│   └─ Use: Neither (inherit parent status)
│       Examples: order_items, quotation_items, invoice_lines
│
└─ Historical Logs / Analytics
    └─ Use: Neither (immutable data)
        Examples: inventory_movements, approval_histories, analytics
```

---

## Pattern Templates

### Pattern 1: Master Data (is_active)

```sql
CREATE TABLE schema.table_name (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,

    -- Business columns here
    code                VARCHAR(50) NOT NULL,
    name                VARCHAR(200) NOT NULL,

    -- State management
    is_active           BOOLEAN NOT NULL DEFAULT true,
    is_deleted          BOOLEAN NOT NULL DEFAULT false
);
```

**Use when**: Configuration, master data, code tables, templates

### Pattern 2: Transactional Workflow (status)

```sql
CREATE TABLE schema.table_name (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,

    -- Business columns here
    document_no         VARCHAR(50) NOT NULL,

    -- State management
    status              VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    is_deleted          BOOLEAN NOT NULL DEFAULT false,

    -- Status constraint
    CONSTRAINT ck_table_name__status
        CHECK (status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'COMPLETED', 'CANCELLED'))
);

CREATE INDEX ix_table_name__status ON schema.table_name (status)
 WHERE is_deleted = false;
```

**Use when**: Business documents, processes with lifecycle, workflows

### Pattern 3: Line Items (neither)

```sql
CREATE TABLE schema.table_items (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,

    -- Parent reference
    header_id           UUID NOT NULL,

    -- Business columns here
    line_no             INTEGER NOT NULL,
    product_id          UUID NOT NULL,
    quantity            NUMERIC(18,4) NOT NULL,

    -- No status, no is_active - inherits from parent
    is_deleted          BOOLEAN NOT NULL DEFAULT false,

    FOREIGN KEY (header_id) REFERENCES schema.table_name(id)
);
```

**Use when**: Detail lines, items that inherit parent document status

### Pattern 4: Historical Logs (neither)

```sql
CREATE TABLE schema.table_history (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Business columns here
    entity_id           UUID NOT NULL,
    action              VARCHAR(50) NOT NULL,
    old_value           TEXT,
    new_value           TEXT,

    -- No status, no is_active - immutable log
    is_deleted          BOOLEAN NOT NULL DEFAULT false
);
```

**Use when**: Audit logs, transaction history, immutable records

---

## Common Status Values by Module

### Purchase Management (psm)
```
DRAFT → SUBMITTED → APPROVED → ORDERED → RECEIVING → COMPLETED
                     ↓
                  REJECTED
                  CANCELLED
```

### Sales Management (srm)
```
DRAFT → CONFIRMED → PROCESSING → SHIPPED → COMPLETED
         ↓
      CANCELLED
```

### Service Management (asm)
```
RECEIVED → DIAGNOSED → IN_PROGRESS → COMPLETED → CLOSED
                         ↓
                     CANCELLED
```

### Finance Management (fim)
```
DRAFT → PENDING → APPROVED → POSTED
         ↓          ↓
      REJECTED  CANCELLED
```

### HR Management (hrm)
```
Employees: ACTIVE, PROBATION, LEAVE, TERMINATED, RETIRED
Absences: DRAFT → SUBMITTED → APPROVED
                    ↓           ↓
                 REJECTED   CANCELLED
```

---

## Module-by-Module Quick Reference

| Module | Tables with is_active | Tables with status | Tables with neither |
|--------|----------------------|-------------------|---------------------|
| **adm** | 6 | 0 | 1 |
| **hrm** | 2 | 6 | 1 |
| **crm** | 1 | 15 | 3 |
| **pim** | 0 | 13 | 0 |
| **wms** | 0 | 6 | 2 |
| **apm** | 1 | 1 | 2 |
| **ivm** | 1 | 6 | 3 |
| **psm** | 0 | 5 | 5 |
| **srm** | 1 | 4 | 7 |
| **asm** | 0 | 5 | 3 |
| **fim** | 1 | 6 | 2 |
| **fam** | 0 | 1 | 2 |
| **bim** | 1 | 1 | 2 |
| **com** | 3 | 0 | 0 |
| **sys** | 5 | 0 | 0 |

---

## Validation Checklist

When creating a new table, verify:

- [ ] Only use `is_active` OR `status`, never both
- [ ] Master data tables → use `is_active`
- [ ] Workflow tables → use `status` with CHECK constraint
- [ ] Line item tables → use neither (inherit from parent)
- [ ] Log/history tables → use neither (immutable)
- [ ] All tables have `is_deleted` for soft delete
- [ ] Status columns have index: `CREATE INDEX ix_tablename__status ...`
- [ ] Status values documented in table comments

---

## Examples from Codebase

### Good: Master Data with is_active
```sql
-- adm.currencies - Simple enable/disable toggle
CREATE TABLE adm.currencies (
    code                VARCHAR(3) PRIMARY KEY,
    name                VARCHAR(100) NOT NULL,
    is_active           BOOLEAN NOT NULL DEFAULT true,
    is_deleted          BOOLEAN NOT NULL DEFAULT false
);
```

### Good: Workflow with status
```sql
-- psm.purchase_orders - Complex lifecycle
CREATE TABLE psm.purchase_orders (
    id                  UUID PRIMARY KEY,
    po_no               VARCHAR(50) NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    is_deleted          BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT ck_purchase_orders__status
        CHECK (status IN ('DRAFT', 'APPROVED', 'ORDERED', 'RECEIVING', 'COMPLETED', 'CANCELLED'))
);
```

### Good: Line items without status
```sql
-- psm.purchase_order_items - Inherits parent status
CREATE TABLE psm.purchase_order_items (
    id                  UUID PRIMARY KEY,
    po_id               UUID NOT NULL,
    product_id          UUID NOT NULL,
    quantity            NUMERIC(18,4) NOT NULL,
    is_deleted          BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY (po_id) REFERENCES psm.purchase_orders(id)
);
```

### Bad: Both columns (Not found in codebase!)
```sql
-- ❌ AVOID THIS - Redundant state management
CREATE TABLE bad_example (
    id                  UUID PRIMARY KEY,
    status              VARCHAR(20),     -- ❌ Redundant with is_active
    is_active           BOOLEAN,         -- ❌ Redundant with status
    is_deleted          BOOLEAN
);
```

---

## Common Mistakes to Avoid

❌ **Don't**: Use both `status` and `is_active` on the same table
✅ **Do**: Choose one based on complexity of state management

❌ **Don't**: Use `status` for simple on/off toggles
✅ **Do**: Use `is_active` for master data and configuration

❌ **Don't**: Add `status` to line item tables
✅ **Do**: Let line items inherit parent document status

❌ **Don't**: Use `status` without CHECK constraint
✅ **Do**: Always define valid status values with CHECK constraint

❌ **Don't**: Use custom column names like `state`, `status_code`, `active_flag`
✅ **Do**: Use standard names: `status` or `is_active`

---

## Quick Grep Commands

Find all tables with is_active:
```bash
grep -r "is_active.*BOOLEAN" packages/database/schemas/tenants/ --include="*.sql" | grep -v "_old\|backup"
```

Find all tables with status:
```bash
grep -r "status.*VARCHAR" packages/database/schemas/tenants/ --include="*.sql" | grep -v "_old\|backup"
```

Find tables with both (should return empty):
```bash
grep -l "is_active.*BOOLEAN" packages/database/schemas/tenants/**/*.sql | xargs grep -l "status.*VARCHAR"
```

---

## Related Documentation

- Full Audit Report: `STATUS_IS_ACTIVE_AUDIT_REPORT.md`
- Analysis Script: `analyze_status_columns.py`
- Database Schema Location: `packages/database/schemas/tenants/`

---

**Maintained by**: Database Architecture Team
**Next Review**: When adding new modules or refactoring existing schemas
