# SQL vs Model Audit - Quick Reference

**Date**: 2025-10-25
**Total Issues**: 2,634 (367 critical, 2,027 important, 240 minor)

---

## Issue Count by Schema

| Schema | Critical | Important | Minor | Total | Tables | Priority |
|--------|----------|-----------|-------|-------|--------|----------|
| **CRM** | 50 | High | Medium | ~150+ | 17 | 🔴 HIGH |
| **PIM** | 47 | High | Medium | ~150+ | 16 | 🔴 HIGH |
| **SRM** | 35 | High | Medium | ~120+ | 12 | 🔴 HIGH |
| **PSM** | 29 | Medium | Medium | ~100+ | 10 | 🟡 MEDIUM |
| **IVM** | 29 | Medium | Medium | ~100+ | 10 | 🟡 MEDIUM |
| **HRM** | 26 | Medium | Medium | ~90+ | 9 | 🟡 MEDIUM |
| **FIM** | 26 | Medium | Medium | ~90+ | 9 | 🟡 MEDIUM |
| **ASM** | 23 | Medium | Medium | ~80+ | 8 | 🟡 MEDIUM |
| **ADM** | 20 | Low | Low | ~50+ | 7 | 🟢 LOW |
| **SYS** | 14 | Low | Low | ~40+ | 5 | 🟢 LOW |
| **WMS** | 11 | Low | Low | ~35+ | 4 | 🟢 LOW |
| **APM** | 11 | Low | Low | ~35+ | 4 | 🟢 LOW |
| **BIM** | 11 | Low | Low | ~35+ | 4 | 🟢 LOW |
| **COM** | 8 | Low | Low | ~25+ | 3 | 🟢 LOW |
| **LWM** | 8 | Low | Low | ~25+ | 3 | 🟢 LOW |
| **FAM** | 8 | Low | Low | ~25+ | 3 | 🟢 LOW |

Note: "Critical" counts are base model inheritance false positives (not real issues)

---

## Common Issues

### 1. Base Model Fields (367 false positives)
**All schemas affected**: `id`, `created_at`, `updated_at` appear missing

**Root Cause**: Inherited from `TenantBaseModel` but parser can't detect

**Action**: None - working as intended

---

### 2. Audit Fields (240 issues across all schemas)
**Fields**: `created_by`, `updated_by`

**Root Cause**: SQL has these fields, but `TenantBaseModel` doesn't inherit `UserTrackingMixin`

**Action**: Add `UserTrackingMixin` to `TenantBaseModel`:
```python
class TenantBaseModel(Base, TimestampMixin, UserTrackingMixin, TenantMixin):
    __abstract__ = True
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
```

**Impact**: Resolves 240 issues instantly

---

### 3. Real Discrepancies (~2,027 issues)

#### Type Mismatches
**Example**: SQL has `VARCHAR(50)`, Model has `Integer`

**Action**: Review each case, update SQL or model to match

#### Missing Columns in SQL
**Example**: Model has field, SQL table doesn't

**Action**: Add column to SQL DDL file

#### Extra Columns in SQL
**Example**: SQL has column, model doesn't

**Action**: Remove from SQL or add to model

#### Nullable Mismatches
**Example**: SQL `NOT NULL`, Model `nullable=True`

**Action**: Align constraints

---

## How to Fix Issues

### Step 1: Fix Base Model (Immediate)
```bash
cd /home/itjee/workspace/cxg/apps/backend-api

# Edit src/models/base.py
# Change line 59:
# FROM: class TenantBaseModel(Base, TimestampMixin, TenantMixin):
# TO:   class TenantBaseModel(Base, TimestampMixin, UserTrackingMixin, TenantMixin):
```

### Step 2: Review Detailed Report
```bash
# Open full report
code SQL_MODEL_AUDIT_DETAILED.md

# Or search for specific issues
grep "Schema: CRM" SQL_MODEL_AUDIT_DETAILED.md -A 20
```

### Step 3: Fix Schema by Schema
```bash
# Priority order:
1. CRM (Customer Management) - Highest business impact
2. PIM (Product Catalog) - Core data
3. SRM (Sales) - Revenue critical
4. PSM (Procurement) - Operations
5. IVM (Inventory) - Stock management
6. Others - As time permits
```

---

## Quick Commands

### Re-run Audit
```bash
cd /home/itjee/workspace/cxg/apps/backend-api
python audit_sql_models_v2.py
```

### Check Specific Schema
```bash
# SQL files location
ls -la /home/itjee/workspace/cxg/packages/database/schemas/tenants/03_crm/

# Python models location
ls -la /home/itjee/workspace/cxg/apps/backend-api/src/models/tenants/crm/
```

### Compare Single Table
```bash
# Example: Compare CRM partners table
cat /home/itjee/workspace/cxg/packages/database/schemas/tenants/03_crm/partners.sql
cat /home/itjee/workspace/cxg/apps/backend-api/src/models/tenants/crm/partners.py
```

---

## Issue Type Reference

| Issue Type | Severity | Count | Description |
|------------|----------|-------|-------------|
| Missing Critical Column in Model | 🔴 Critical | 367 | Base fields not detected (false positive) |
| Missing SQL Column | 🟡 Important | ~600 | Model has field, SQL doesn't |
| Extra SQL Column | 🟡 Important | ~800 | SQL has column, model doesn't |
| Type Mismatch | 🟡 Important | ~300 | Incompatible data types |
| Nullable Mismatch | 🟡 Important | ~300 | Different nullable constraints |
| Extra SQL Column (audit) | 🟢 Minor | 240 | created_by, updated_by fields |

---

## Files Generated

1. **audit_sql_models_v2.py** - Audit script
2. **SQL_MODEL_AUDIT_DETAILED.md** (836 KB) - Full report with all 2,634 issues
3. **SQL_MODEL_AUDIT_SUMMARY.md** - Executive summary and action plan
4. **SQL_MODEL_AUDIT_QUICKREF.md** (this file) - Quick reference

---

## Timeline Recommendation

| Phase | Duration | Task | Status |
|-------|----------|------|--------|
| Phase 0 | 1 hour | Review audit reports | ⏳ Pending |
| Phase 1 | 1 day | Fix TenantBaseModel (add UserTrackingMixin) | ⏳ Pending |
| Phase 2A | 3 days | Fix CRM schema (50 tables, highest priority) | ⏳ Pending |
| Phase 2B | 2 days | Fix PIM schema (16 tables, core data) | ⏳ Pending |
| Phase 2C | 2 days | Fix SRM schema (12 tables, revenue) | ⏳ Pending |
| Phase 2D | 5 days | Fix PSM, IVM, HRM, FIM schemas | ⏳ Pending |
| Phase 2E | 3 days | Fix remaining schemas | ⏳ Pending |
| Phase 3 | Ongoing | CI/CD integration, automated checks | ⏳ Pending |

**Total Estimated**: 16-20 working days

---

## Success Criteria

- ✅ TenantBaseModel includes UserTrackingMixin
- ✅ All SQL tables have matching Python models
- ✅ All model fields have matching SQL columns
- ✅ All data types are compatible
- ✅ All nullable constraints match
- ✅ Audit script runs clean (0 important/critical issues)
- ✅ Audit integrated into CI/CD pipeline

---

## Contact & Resources

- **Audit Script**: `/home/itjee/workspace/cxg/apps/backend-api/audit_sql_models_v2.py`
- **Full Report**: `/home/itjee/workspace/cxg/apps/backend-api/SQL_MODEL_AUDIT_DETAILED.md`
- **Summary**: `/home/itjee/workspace/cxg/apps/backend-api/SQL_MODEL_AUDIT_SUMMARY.md`
- **SQL Location**: `/home/itjee/workspace/cxg/packages/database/schemas/tenants/`
- **Models Location**: `/home/itjee/workspace/cxg/apps/backend-api/src/models/tenants/`
