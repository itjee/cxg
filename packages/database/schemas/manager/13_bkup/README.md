# BKUP Schema - Backup & Disaster Recovery

**Created**: 2024-10-26
**Purpose**: Manage backup operations and disaster recovery planning for the ConexGrow platform

---

## Overview

The BKUP schema manages all backup and disaster recovery functionality. It provides comprehensive backup scheduling, execution tracking, and recovery plan management with RTO/RPO objectives.

---

## Schema Structure

```
/13_bkup/
├── 00_schema.sql              ← Schema initialization
├── 01_executions.sql          ← Backup execution tracking (core table)
├── 02_schedules.sql           ← Backup schedule management
├── 03_recovery_plans.sql      ← Disaster recovery planning
└── README.md                  ← This file
```

---

## Tables

### 1. bkup.executions
**Purpose**: Track and manage backup job executions with detailed status and metrics

**Key Features**:
- Multiple backup types (FULL_SYSTEM, TENANT_DATA, DATABASE, FILES, CONFIGURATION)
- Multiple backup methods (AUTOMATED, MANUAL, SCHEDULED)
- Comprehensive metrics (size, duration, compression rate, checksum)
- Retention management with automatic expiration
- Failure tracking with retry counts
- 10 indexes for optimal performance

**Key Columns**:
- `backup_type`: Type of backup being executed
- `backup_method`: AUTOMATED, MANUAL, or SCHEDULED
- `backup_format`: COMPRESSED, UNCOMPRESSED, or ENCRYPTED
- `status`: PENDING, RUNNING, COMPLETED, FAILED, CANCELED
- `backup_size`: Size of backup file in bytes
- `backup_checksum`: Integrity verification hash
- `compression_rate`: Compression ratio as percentage
- `retention_days`: Days to retain backup before expiration
- `error_message`: Failure details for troubleshooting

---

### 2. bkup.schedules
**Purpose**: Define automated backup schedules with flexible targeting and notification

**Key Features**:
- Flexible scheduling (DAILY, WEEKLY, MONTHLY, QUARTERLY)
- Multiple target scopes (ALL_TENANTS, SPECIFIC_TENANTS, SYSTEM_ONLY)
- Parallel job execution control
- Email notifications for success/failure
- Timezone support for global deployments
- 11 indexes including GIN indexes for array searches

**Key Columns**:
- `frequency`: Execution frequency (DAILY, WEEKLY, MONTHLY, QUARTERLY)
- `schedule_time`: Time of day to run backup (HH:MM)
- `schedule_days`: Day(s) of week/month to run (1-7 or 1-31)
- `target_scope`: Scope of backup target
- `target_tenants`: Array of tenant UUIDs for SPECIFIC_TENANTS scope
- `target_databases`: Array of database names to backup
- `max_parallel_jobs`: Maximum concurrent backup jobs
- `notify_success`: Send email on success
- `notify_failure`: Send email on failure
- `next_run_at`: Calculated next execution time
- `enabled`: Schedule active/inactive status

---

### 3. bkup.recovery_plans
**Purpose**: Define disaster recovery procedures with RTO/RPO objectives and testing schedules

**Key Features**:
- RTO (Recovery Time Objective) and RPO (Recovery Point Objective) management
- Multi-step recovery procedures (automated + manual)
- Recovery plan types (FULL_RECOVERY, PARTIAL_RECOVERY, TENANT_RECOVERY)
- Compliance and approval workflows
- Test scheduling and result tracking
- Escalation contact management
- 16 indexes including GIN for JSON and array searches

**Key Columns**:
- `plan_type`: Type of recovery plan
- `recovery_scope`: Scope of recovery (ALL_SYSTEMS, SPECIFIC_SERVICES, TENANT_DATA)
- `recovery_time`: RTO in minutes
- `recovery_point`: RPO in minutes
- `recovery_steps`: JSON with detailed step-by-step recovery procedures
- `automated_steps`: JSON array of automated recovery steps
- `manual_steps`: JSON array of manual recovery steps
- `required_backup_types`: Array of backup types needed for recovery
- `minimum_backup_age`: Minimum backup retention hours
- `test_frequency_days`: How often to test the recovery plan
- `last_tested_at`: When plan was last tested
- `test_results`: JSON with detailed test results
- `status`: DRAFT, PENDING_APPROVAL, APPROVED, ARCHIVED
- `primary_contact`: First contact during disaster
- `escalation_contacts`: Emergency escalation contacts

---

## Setup

### Required Dependencies

This schema depends on:
- Manager schema: `tnnt` (tenants table reference)

### Installation

```bash
cd /packages/database/schemas/manager

# Run in order
psql -U postgres -d mgmt_db -f 13_bkup/00_schema.sql
psql -U postgres -d mgmt_db -f 13_bkup/01_executions.sql
psql -U postgres -d mgmt_db -f 13_bkup/02_schedules.sql
psql -U postgres -d mgmt_db -f 13_bkup/03_recovery_plans.sql
```

Or use the unified initialization script:
```bash
psql -U postgres -d mgmt_db -f _00_init_all_schemas.sql
```

---

## Data Flow Examples

### Example 1: Create a Daily Backup Schedule

```sql
-- Create schedule for daily full system backup at 2 AM
INSERT INTO bkup.schedules (
    schedule_name,
    backup_type,
    target_scope,
    frequency,
    schedule_time,
    timezone,
    backup_format,
    retention_days,
    notify_failure,
    notify_emails,
    enabled
) VALUES (
    'Daily Full System Backup',
    'FULL_SYSTEM',
    'ALL_TENANTS',
    'DAILY',
    '02:00:00',
    'Asia/Seoul',
    'COMPRESSED',
    30,
    true,
    ARRAY['devops@example.com', 'sre@example.com'],
    true
);
```

### Example 2: Track Backup Execution

```sql
-- Record backup execution
INSERT INTO bkup.executions (
    backup_type,
    backup_name,
    backup_method,
    backup_format,
    status,
    scheduled_at,
    started_at,
    completed_at,
    duration,
    backup_size,
    original_size,
    compression_rate,
    backup_file,
    backup_checksum,
    retention_days
) VALUES (
    'FULL_SYSTEM',
    'Daily Full System Backup - 2024-10-26',
    'AUTOMATED',
    'COMPRESSED',
    'COMPLETED',
    NOW(),
    NOW(),
    NOW() + INTERVAL '1 hour',
    3600,
    5368709120,  -- 5 GB
    10737418240, -- 10 GB
    50.0,
    '/backups/2024/10/26/full_system.tar.gz',
    'abc123def456...',
    30
);
```

### Example 3: Define a Disaster Recovery Plan

```sql
-- Create a full system recovery plan
INSERT INTO bkup.recovery_plans (
    plan_name,
    plan_type,
    description,
    recovery_scope,
    recovery_time,      -- 4 hours in minutes (240)
    recovery_point,     -- 1 hour in minutes (60)
    recovery_steps,
    required_backup_types,
    minimum_backup_age,
    test_frequency_days,
    primary_contact,
    status,
    approved_by
) VALUES (
    'Full System Disaster Recovery Plan',
    'FULL_RECOVERY',
    'Complete system recovery procedure for all services and tenants',
    'ALL_SYSTEMS',
    240,
    60,
    jsonb_build_array(
        jsonb_build_object('step', 1, 'description', 'Assess damage and current state'),
        jsonb_build_object('step', 2, 'description', 'Restore from latest backup'),
        jsonb_build_object('step', 3, 'description', 'Verify data integrity'),
        jsonb_build_object('step', 4, 'description', 'Resume services')
    ),
    ARRAY['FULL_SYSTEM', 'DATABASE'],
    24,
    90,
    'ops-lead@example.com',
    'APPROVED',
    'cto@example.com'
);
```

---

## Common Queries

### Get Recent Backup Status

```sql
SELECT id, backup_name, backup_type, status, started_at, completed_at
FROM bkup.executions
WHERE deleted = FALSE
ORDER BY started_at DESC
LIMIT 20;
```

### Find Active Schedules

```sql
SELECT id, schedule_name, frequency, schedule_time, next_run_at
FROM bkup.schedules
WHERE enabled = TRUE
  AND deleted = FALSE
ORDER BY next_run_at ASC;
```

### Check Backup Success Rate

```sql
SELECT
    backup_type,
    COUNT(*) as total,
    SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as successful,
    ROUND(100.0 * SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
FROM bkup.executions
WHERE deleted = FALSE
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY backup_type;
```

### Get Pending Approvals

```sql
SELECT id, plan_name, plan_type, created_at
FROM bkup.recovery_plans
WHERE status IN ('DRAFT', 'PENDING_APPROVAL')
  AND deleted = FALSE
ORDER BY created_at DESC;
```

### Find Plans Needing Testing

```sql
SELECT id, plan_name, last_tested_at, test_frequency_days,
       LAST_TESTED_AT + (TEST_FREQUENCY_DAYS || ' days')::INTERVAL as due_for_testing
FROM bkup.recovery_plans
WHERE status = 'APPROVED'
  AND deleted = FALSE
  AND (last_tested_at IS NULL OR last_tested_at + (test_frequency_days || ' days')::INTERVAL <= NOW())
ORDER BY last_tested_at ASC NULLS FIRST;
```

---

## Performance Considerations

1. **Backup Cleanup**: Implement a periodic job to clean up expired backups and delete soft-deleted records
2. **Index Maintenance**: Regular VACUUM and ANALYZE on heavily used indexes
3. **Archive Old Records**: Move completed backups older than retention period to archive tables
4. **Monitoring**: Monitor disk space used by backup_file paths

---

## Foreign Key Dependencies

- `bkup.executions.backup_tenant_id` → `tnnt.tenants(id)` (ON DELETE CASCADE)

---

## Backup Strategy Recommendations

1. **Full System Backups**: Daily at 2 AM with 30-day retention
2. **Database Backups**: Hourly during business hours with 7-day retention
3. **Tenant Data**: Weekly with 90-day retention for compliance
4. **Configuration**: Before any system changes with indefinite retention
5. **Testing**: Monthly DR plan testing to ensure recovery procedures work

---

## Related Files

- Manager DB Schema Map: `/packages/database/schemas/manager/README.md`
- Unified Initialization: `/packages/database/schemas/manager/_00_init_all_schemas.sql`

---

**Last Updated**: 2024-10-26
