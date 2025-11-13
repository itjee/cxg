# NOTI Schema - Notifications & Communications

**Created**: 2024-10-26
**Purpose**: Multi-channel notification and email campaign management for the ConexGrow platform

---

## Overview

The NOTI schema manages all notification and communication features in the Manager system. It supports multi-channel delivery (in-app, email, SMS, push notifications), template management with multi-language support, and email campaign analytics.

---

## Schema Structure

```
/12_noti/
├── 00_schema.sql              ← Schema initialization
├── 01_notifications.sql       ← Notification management (core table)
├── 02_templates.sql           ← Multi-language template management
├── 03_campaigns.sql           ← Email campaign management
└── README.md                  ← This file
```

---

## Tables

### 1. noti.notifications
**Purpose**: Manage all types of notifications sent to system users and tenants

**Key Features**:
- Multi-target support (USER, TENANT, ADMIN, SYSTEM)
- Multi-channel delivery (in-app, email, SMS, push, webhook)
- Action-required notifications with deadlines
- Delivery tracking and retry logic
- Read/acknowledged status tracking
- Automatic expiration management

**Key Columns**:
- `target_type`: User, Tenant, Admin, or System notification
- `notify_type`: System Alert, Billing Notice, Feature Update, Security Alert, etc.
- `channels`: Array of delivery channels (IN_APP, EMAIL, SMS, PUSH, WEBHOOK)
- `status`: PENDING, SENT, DELIVERED, FAILED, EXPIRED
- `priority`: LOW, MEDIUM, HIGH, URGENT
- `action_required`: Flag for notifications requiring user action
- `delivery_status`: JSON with per-channel delivery results

**Indexes** (15 total):
- User notifications (most frequent query)
- Tenant notifications
- Status management
- Scheduled delivery
- Notification type analysis
- Priority management
- Unread notifications
- Action-required tracking
- Expiration management
- Delivery failures
- Target type analysis
- Creation date sorting
- Unacknowledged notifications (with deadline)
- Channel array search (GIN)
- Delivery status JSON search (GIN)

---

### 2. noti.templates
**Purpose**: Manage reusable notification templates with multi-language and multi-version support

**Key Features**:
- Multi-channel template content (email, SMS, push, in-app)
- Multi-language support (locale-based)
- Version control and history tracking
- Template variables for dynamic content
- Test data for template validation
- Category and notification type classification

**Key Columns**:
- `template_code`: Unique identifier code (e.g., "BILLING_INVOICE_SENT")
- `template_name`: Human-readable name
- `category`: SYSTEM, BILLING, SECURITY, MARKETING, SUPPORT, MAINTENANCE, USER_ACCOUNT
- `notify_type`: Notification type reference
- `locale`: Language code (ko-KR, en-US, etc.)
- `version`: Semantic versioning (1.0, 1.1, etc.)
- `previous_version_id`: Reference to previous version for history
- `status`: DRAFT, ACTIVE, ARCHIVED
- `template_variables`: JSON defining available template variables
- `test_data`: Sample data for template testing

**Channel-specific Fields**:
- `email_subject`, `email_body`: HTML email content
- `sms_message`: SMS text (max 1000 chars)
- `push_title`, `push_body`: Push notification content
- `in_app_title`, `in_app_message`: In-app notification content

**Indexes** (13 total):
- Active template lookup by code (most frequent)
- Category management
- Notification type queries
- Locale-based queries (multi-language)
- Version history tracking
- Status management
- Template name search
- Creation date sorting
- Creator management
- Previous version tracking
- Draft management
- Template variables JSON search (GIN)
- Test data JSON search (GIN)

---

### 3. noti.campaigns
**Purpose**: Manage large-scale email campaigns for marketing, announcements, and newsletters

**Key Features**:
- Flexible targeting (all users, by tenant type, by role, custom lists)
- A/B testing support
- Comprehensive delivery statistics
- Open rate, click rate, bounce rate tracking
- Scheduled delivery with timezone support
- Campaign status workflow
- Content versioning (A/B variants)

**Key Columns**:
- `campaign_name`: Campaign identifier
- `campaign_type`: PROMOTIONAL, TRANSACTIONAL, NEWSLETTER, ANNOUNCEMENT, SURVEY, WELCOME
- `target_type`: ALL_USERS, users, ADMIN_USERS, CUSTOM_LIST
- `target_tenant_types`: Array of tenant types to target
- `target_user_roles`: Array of user roles to target
- `custom_recipients`: Array of specific user UUIDs
- `subject`, `html_content`, `text_content`: Email content
- `send_immediately`: Flag for immediate vs. scheduled sending
- `scheduled_send_at`: Scheduled send time
- `timezone`: Timezone for scheduled sends
- `is_ab_test`: Flag for A/B testing
- `ab_test_rate`: Percentage split for A/B testing (1-99%)
- `status`: DRAFT, SCHEDULED, SENDING, SENT, PAUSED, CANCELED

**Statistics Columns**:
- `total_recipients`: Total recipients count
- `sent_count`: Successfully sent count
- `delivered_count`: Successfully delivered count
- `opened_count`: Email open count
- `clicked_count`: Link click count
- `bounced_count`: Hard bounce count
- `unsubscribed_count`: Unsubscribe count

**Indexes** (18 total):
- Status management (most frequent)
- Campaign type analysis
- Scheduled delivery queries
- Performance analysis
- A/B test management
- Target type management
- Creator management
- Completed campaigns
- Campaign name search
- Creation date sorting
- Open rate analysis
- Click rate analysis
- Bounce rate monitoring
- Target tenant types array search (GIN)
- Target user roles array search (GIN)
- Custom recipients array search (GIN)

---

## Setup

### Required Dependencies

This schema depends on:
- Manager schema: `tnnt` (tenants table reference)
- Manager schema: `tnnt.users` (user reference) - Note: This may need adjustment if users are in a different schema

### Installation

```bash
cd /packages/database/schemas/manager

# Run in order
psql -U postgres -d mgmt_db -f 12_noti/00_schema.sql
psql -U postgres -d mgmt_db -f 12_noti/01_notifications.sql
psql -U postgres -d mgmt_db -f 12_noti/02_templates.sql
psql -U postgres -d mgmt_db -f 12_noti/03_campaigns.sql
```

Or use the unified initialization script:
```bash
psql -U postgres -d mgmt_db -f _00_init_all_schemas.sql
```

---

## Data Flow Examples

### Example 1: Send a System Alert Notification

```sql
-- 1. Create notification from template
INSERT INTO noti.notifications (
    tenant_id,
    user_id,
    target_type,
    notify_type,
    title,
    message,
    priority,
    channels,
    status,
    action_required,
    action_url,
    action_deadline
) VALUES (
    'tenant-123-uuid',
    'user-456-uuid',
    'USER',
    'SYSTEM_ALERT',
    'System Maintenance Scheduled',
    'Your system will be offline for 2 hours on Sunday at 2 AM',
    'HIGH',
    ARRAY['IN_APP', 'EMAIL', 'PUSH'],
    'PENDING',
    false,
    null,
    null
);

-- 2. Check delivery status
SELECT id, status, delivery_status, sent_at
FROM noti.notifications
WHERE id = 'notification-uuid'
ORDER BY updated_at DESC;
```

### Example 2: Use a Template to Create Notification

```sql
-- 1. Create notification using template variables
INSERT INTO noti.notifications (
    tenant_id,
    target_type,
    notify_type,
    title,
    message,
    priority,
    channels,
    status,
    deleted
) SELECT
    'tenant-123-uuid',
    'TENANT',
    t.notify_type,
    t.in_app_title,
    t.in_app_message,
    'MEDIUM',
    ARRAY['IN_APP', 'EMAIL'],
    'PENDING',
    false
FROM noti.templates t
WHERE t.template_code = 'BILLING_INVOICE_GENERATED'
  AND t.locale = 'ko-KR'
  AND t.status = 'ACTIVE';
```

### Example 3: Create Email Campaign

```sql
-- Create a promotional campaign for all users in Premium tenants
INSERT INTO noti.campaigns (
    campaign_name,
    campaign_type,
    description,
    target_type,
    target_tenant_types,
    subject,
    html_content,
    sender_name,
    sender_email,
    send_immediately,
    total_recipients,
    status
) VALUES (
    'Spring 2024 Promotion',
    'PROMOTIONAL',
    'Special features discount for Premium users',
    'users',
    ARRAY['PREMIUM'],
    'Exclusive Spring Offer - 30% Off Premium Features',
    '<html>...</html>',
    'ConexGrow Marketing',
    'marketing@conexgrow.com',
    false,
    150,
    'DRAFT'
);
```

### Example 4: Track Campaign Analytics

```sql
-- Get campaign performance metrics
SELECT
    id,
    campaign_name,
    status,
    total_recipients,
    sent_count,
    delivered_count,
    opened_count,
    clicked_count,
    ROUND(100.0 * opened_count / delivered_count, 2) as open_rate,
    ROUND(100.0 * clicked_count / opened_count, 2) as click_rate,
    ROUND(100.0 * bounced_count / sent_count, 2) as bounce_rate
FROM noti.campaigns
WHERE status = 'SENT'
  AND campaign_type = 'PROMOTIONAL'
ORDER BY completed_at DESC
LIMIT 10;
```

---

## Common Queries

### Get Unread Notifications for User

```sql
SELECT id, title, message, priority, notify_type, created_at
FROM noti.notifications
WHERE user_id = 'user-uuid'
  AND read_at IS NULL
  AND deleted = FALSE
ORDER BY priority DESC, created_at DESC
LIMIT 20;
```

### Get Action-Required Notifications by Deadline

```sql
SELECT id, title, action_url, action_deadline
FROM noti.notifications
WHERE action_required = TRUE
  AND action_deadline IS NOT NULL
  AND acknowledged_at IS NULL
  AND deleted = FALSE
ORDER BY action_deadline ASC;
```

### Get Active Templates by Locale and Type

```sql
SELECT id, template_name, template_code, version
FROM noti.templates
WHERE locale = 'ko-KR'
  AND notify_type = 'BILLING_NOTICE'
  AND status = 'ACTIVE'
  AND deleted = FALSE;
```

### Monitor Campaign Delivery Status

```sql
SELECT
    id,
    campaign_name,
    campaign_type,
    status,
    created_at,
    scheduled_send_at,
    sent_at,
    completed_at,
    total_recipients,
    sent_count,
    delivered_count
FROM noti.campaigns
WHERE created_at >= NOW() - INTERVAL '30 days'
  AND deleted = FALSE
ORDER BY created_at DESC;
```

---

## Performance Considerations

1. **Notification Cleanup**: Implement a periodic job to soft-delete expired notifications
2. **Campaign Archival**: Move completed campaigns to archive after 90 days
3. **Index Maintenance**: VACUUM and ANALYZE regularly
4. **JSON Optimization**: Keep `delivery_status` and `template_variables` reasonably sized

---

## Foreign Key Dependencies

- `noti.notifications.tenant_id` → `tnnt.tenants(id)` (ON DELETE CASCADE)
- `noti.notifications.user_id` → `tnnt.users(id)` (ON DELETE CASCADE)
- `noti.templates.previous_version_id` → `noti.templates(id)` (self-reference)

⚠️ **Warning**: The foreign key `noti.notifications.user_id` currently references `tnnt.users`. If your user management is different, adjust accordingly.

---

## Related Files

- Manager DB Schema Map: `/packages/database/schemas/manager/README.md`
- Unified Initialization: `/packages/database/schemas/manager/_00_init_all_schemas.sql`

---

**Last Updated**: 2024-10-26
