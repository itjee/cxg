# Schema Alignment Action Plan

**Generated**: 2025-10-25
**Priority**: HIGH
**Estimated Time**: 4-6 hours

---

## Quick Summary

| Metric | Count | Priority |
|--------|-------|----------|
| Missing Models | 1 | 🔴 CRITICAL |
| Missing Modules | 13 | 🔴 CRITICAL |
| Extra Models | 2 | 🟡 MEDIUM |
| Extra Modules | 36 | 🟢 LOW |
| Fully Aligned | 117 | ✅ GOOD |
| Total Entities | 167 | - |

---

## Phase 1: Add Missing Models (CRITICAL)

### SRM Schema - Sales Invoices

```bash
# Create the missing model file
touch /home/itjee/workspace/cxg/apps/backend-api/src/models/tenants/srm/sales_invoices.py
```

**Template**: Copy from existing invoice model (e.g., `sales_invoice_items.py`) and refer to:
- SQL file: `/home/itjee/workspace/cxg/packages/database/schemas/tenants/12_srm/08_sales_invoices.sql`

---

## Phase 2: Add Missing Modules (CRITICAL)

### 2.1 HRM Schema (2 modules)

```bash
cd /home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/hrm

# Create employees module
mkdir -p employees
touch employees/__init__.py
touch employees/router.py
touch employees/service.py
touch employees/schema.py

# Create salary_structures module
mkdir -p salary_structures
touch salary_structures/__init__.py
touch salary_structures/router.py
touch salary_structures/service.py
touch salary_structures/schema.py
```

### 2.2 CRM Schema (3 modules)

```bash
cd /home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/crm

# Create contracts module
mkdir -p contracts
touch contracts/__init__.py
touch contracts/router.py
touch contracts/service.py
touch contracts/schema.py

# Create partner_addresses module
mkdir -p partner_addresses
touch partner_addresses/__init__.py
touch partner_addresses/router.py
touch partner_addresses/service.py
touch partner_addresses/schema.py

# Create partners module
mkdir -p partners
touch partners/__init__.py
touch partners/router.py
touch partners/service.py
touch partners/schema.py
```

### 2.3 SRM Schema (1 module)

```bash
cd /home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/srm

# Create sales_invoices module
mkdir -p sales_invoices
touch sales_invoices/__init__.py
touch sales_invoices/router.py
touch sales_invoices/service.py
touch sales_invoices/schema.py
```

### 2.4 ASM Schema (1 module)

```bash
cd /home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/asm

# Create service_requests module
mkdir -p service_requests
touch service_requests/__init__.py
touch service_requests/router.py
touch service_requests/service.py
touch service_requests/schema.py
```

### 2.5 FIM Schema (6 modules - CRITICAL for Finance)

```bash
cd /home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/fim

# Create accounts_payable module
mkdir -p accounts_payable
touch accounts_payable/__init__.py
touch accounts_payable/router.py
touch accounts_payable/service.py
touch accounts_payable/schema.py

# Create accounts_receivable module
mkdir -p accounts_receivable
touch accounts_receivable/__init__.py
touch accounts_receivable/router.py
touch accounts_receivable/service.py
touch accounts_receivable/schema.py

# Create business_documents module
mkdir -p business_documents
touch business_documents/__init__.py
touch business_documents/router.py
touch business_documents/service.py
touch business_documents/schema.py

# Create journal_entries module
mkdir -p journal_entries
touch journal_entries/__init__.py
touch journal_entries/router.py
touch journal_entries/service.py
touch journal_entries/schema.py

# Create payment_transactions module
mkdir -p payment_transactions
touch payment_transactions/__init__.py
touch payment_transactions/router.py
touch payment_transactions/service.py
touch payment_transactions/schema.py

# Create tax_invoices module
mkdir -p tax_invoices
touch tax_invoices/__init__.py
touch tax_invoices/router.py
touch tax_invoices/service.py
touch tax_invoices/schema.py
```

---

## Phase 3: Remove Extra Models (MEDIUM PRIORITY)

```bash
cd /home/itjee/workspace/cxg/apps/backend-api/src/models/tenants

# Delete duplicate/incorrect model files
rm lwm/approvals.py           # Should be in APM schema, not LWM
rm sys/code_rule.py           # Duplicate - use code_rules.py (plural)
```

**Before deleting**, verify these files are not referenced anywhere:

```bash
cd /home/itjee/workspace/cxg/apps/backend-api
grep -r "from.*lwm.*approvals" src/
grep -r "import.*lwm.*approvals" src/
grep -r "from.*sys.*code_rule" src/
grep -r "import.*sys.*code_rule" src/
```

---

## Phase 4: Remove Extra Modules (LOW PRIORITY)

### Complete Cleanup Script

```bash
cd /home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants

# ADM Schema - Remove modules moved to other schemas
rm -rf adm/departments        # Moved to HRM
rm -rf adm/employees          # Moved to HRM
rm -rf adm/positions          # Not in database
rm -rf adm/users              # Moved to SYS

# CRM Schema - Remove deprecated naming
rm -rf crm/contacts           # Use partner_contacts instead
rm -rf crm/customers          # Use partners instead

# IVM Schema - Remove duplicate naming
rm -rf ivm/adjustments        # Use inventory_adjustments instead
rm -rf ivm/products           # Products are in PIM schema
rm -rf ivm/stock_movements    # Use inventory_movements instead
rm -rf ivm/warehouses         # Warehouses are in WMS schema

# PSM Schema - Remove deprecated naming
rm -rf psm/receiving          # Use purchase_order_receipts instead
rm -rf psm/requisitions       # Use purchase_requisitions instead
rm -rf psm/vendors            # Vendors are partners in CRM

# SRM Schema - Remove deprecated naming
rm -rf srm/customers          # Customers are partners in CRM
rm -rf srm/quotes             # Use quotations instead
rm -rf srm/sales_activities   # Not in database schema

# ASM Schema - Remove misplaced asset modules
rm -rf asm/asset_assignments  # ASM is After-Sales, not Asset Management
rm -rf asm/asset_categories   # ASM is After-Sales, not Asset Management
rm -rf asm/assets             # Use FAM (Fixed Asset Management) instead
rm -rf asm/maintenance        # Not in database schema

# FIM Schema - Remove deprecated naming
rm -rf fim/budgets            # Not in database schema
rm -rf fim/invoices           # Use tax_invoices instead
rm -rf fim/transactions       # Use payment_transactions instead

# LWM Schema - Remove misplaced approval module
rm -rf lwm/approvals          # Approvals are in APM schema

# BIM Schema - Remove non-existent modules
rm -rf bim/dashboards         # Not in database schema
rm -rf bim/data_sources       # Not in database schema
rm -rf bim/metrics            # Not in database schema
rm -rf bim/reports            # Not in database schema

# COM Schema - Remove non-existent modules
rm -rf com/announcements      # Not in database schema
rm -rf com/channels           # Not in database schema
rm -rf com/messages           # Not in database schema
rm -rf com/threads            # Not in database schema

# SYS Schema - Remove non-existent modules
rm -rf sys/configurations     # Not in database schema
rm -rf sys/logs               # Not in database schema
rm -rf sys/preferences        # Not in database schema
rm -rf sys/settings           # Settings are in ADM schema
```

**IMPORTANT**: Before running the cleanup script:

1. **Backup first**:
   ```bash
   cd /home/itjee/workspace/cxg/apps/backend-api
   tar -czf modules_backup_$(date +%Y%m%d_%H%M%S).tar.gz src/modules/tenants/
   ```

2. **Check for references**:
   ```bash
   # Search for any imports or references to modules being deleted
   cd /home/itjee/workspace/cxg/apps/backend-api

   # Example: Check if 'adm/departments' is referenced anywhere
   grep -r "from.*adm.*departments" src/
   grep -r "import.*adm.*departments" src/
   ```

3. **Update routers** if any of these modules are registered in API routers

---

## Phase 5: Verification

### Run Alignment Check Again

```bash
cd /home/itjee/workspace/cxg/apps/backend-api
python analyze_schema_alignment.py
```

**Expected Output**:
```
Total missing models:   0
Total missing modules:  0
Total extra models:     0
Total extra modules:    0

✅ ALL SCHEMAS ARE FULLY ALIGNED!
```

### Generate New CSV Report

```bash
python schema_alignment.py
```

### Check for Import Errors

```bash
cd /home/itjee/workspace/cxg/apps/backend-api
python -m pytest --collect-only  # Should collect tests without errors
```

---

## Phase 6: Update Documentation

After completing all phases, update:

1. **Module README files** in each schema directory
2. **API documentation** for new endpoints
3. **Database schema documentation** if needed

---

## Recommended Execution Order

### Day 1: Critical Missing Items (2-3 hours)
1. ✅ Add missing model: `srm/sales_invoices.py`
2. ✅ Add 13 missing modules (starting with FIM - finance is critical)
3. ✅ Test basic CRUD operations for new modules

### Day 2: Cleanup (2-3 hours)
1. ✅ Remove 2 extra models
2. ✅ Remove 36 extra modules (after backing up and checking references)
3. ✅ Run full verification
4. ✅ Update documentation

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Breaking existing code when deleting modules | HIGH | 1. Backup first<br>2. Search for references<br>3. Run tests |
| Missing business logic in new modules | MEDIUM | Copy patterns from existing modules |
| Database migration issues | LOW | Models are being added, not schema changes |
| API endpoint conflicts | LOW | Follow existing naming conventions |

---

## Notes

1. **Missing Model Priority**: The `sales_invoices` model is critical as it's referenced by `sales_invoice_items`
2. **FIM Modules**: Finance modules (6 missing) should be prioritized as they're core business functionality
3. **Schema Naming**: Some modules use abbreviated names vs full table names - check SQL files for correct naming
4. **Module Templates**: Use existing modules as templates (e.g., copy structure from `sales_orders` for `sales_invoices`)

---

## Quick Reference: Schema Locations

```
Database Schemas:  /home/itjee/workspace/cxg/packages/database/schemas/tenants/
Models:           /home/itjee/workspace/cxg/apps/backend-api/src/models/tenants/
Modules:          /home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/
```

---

## Files Generated by This Analysis

1. `/home/itjee/workspace/cxg/apps/backend-api/analyze_schema_alignment.py` - Main analysis script
2. `/home/itjee/workspace/cxg/apps/backend-api/schema_alignment.py` - CSV generator script
3. `/home/itjee/workspace/cxg/apps/backend-api/schema_alignment_report.csv` - Detailed CSV report
4. `/home/itjee/workspace/cxg/apps/backend-api/SCHEMA_ALIGNMENT_DETAILED_REPORT.md` - This document
5. `/home/itjee/workspace/cxg/apps/backend-api/SCHEMA_ALIGNMENT_ACTION_PLAN.md` - Action plan with commands

---

**Last Updated**: 2025-10-25
**Status**: Ready for execution
**Approval**: Pending review
