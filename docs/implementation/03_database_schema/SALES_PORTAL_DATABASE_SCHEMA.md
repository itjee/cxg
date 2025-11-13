# Sales Portal 데이터베이스 스키마 및 마이그레이션 계획

**작성일**: 2025-11-01
**상태**: 스키마 설계 단계

---

## 📋 목차

1. [스키마 개요](#스키마-개요)
2. [테이블 정의](#테이블-정의)
3. [인덱스 및 제약](#인덱스-및-제약)
4. [마이그레이션 전략](#마이그레이션-전략)
5. [데이터 초기화](#데이터-초기화)
6. [쿼리 예제](#쿼리-예제)

---

## 스키마 개요

### ERD (Entity Relationship Diagram)

```
┌──────────────┐
│ employees    │
│ (from hrm)   │
└──────┬───────┘
       │
       ├─────────────────┬────────────────┬─────────────────┐
       │                 │                │                 │
       v                 v                v                 v
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│sales_targets │  │sales_metrics │  │sales_forecasts│  │sales_activities
│              │  │              │  │              │  │(many-to-one)
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐
│opportunities │
│ (from crm)   │
└──────┬───────┘
       │
       ├──────────────────┬──────────────┐
       │                  │              │
       v                  v              v
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   contacts   │  │   accounts   │  │ quotations   │
│(from crm)    │  │ (from crm)   │  │(from srm)    │
└──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐
│collaboration │
│    feeds     │
├──────────────┤
│   comments   │
│ approvals    │
└──────────────┘
```

---

## 테이블 정의

### 1. sales.sales_targets (영업 목표)

```sql
CREATE TABLE IF NOT EXISTS sales.sales_targets (
    sales_target_id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    fiscal_year INT NOT NULL,
    fiscal_quarter INT CHECK (fiscal_quarter BETWEEN 1 AND 4),
    fiscal_period VARCHAR(20), -- e.g., 'Q1', 'Q2', 'FY2025'

    -- Target Information
    target_amount DECIMAL(15,2) NOT NULL CHECK (target_amount >= 0),
    achieved_amount DECIMAL(15,2) DEFAULT 0 CHECK (achieved_amount >= 0),
    target_weight DECIMAL(5,2) DEFAULT 100, -- Weighting factor for composite targets

    -- Metrics
    pipeline_value DECIMAL(15,2) DEFAULT 0,
    won_value DECIMAL(15,2) DEFAULT 0,

    -- Status & Metadata
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    notes TEXT,

    -- Audit Columns
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES hrm.employees(employee_id) ON DELETE RESTRICT,

    -- Constraints
    UNIQUE(tenant_id, employee_id, fiscal_year, fiscal_quarter),
    CONSTRAINT check_achieved_not_exceed_target CHECK (achieved_amount <= target_amount OR target_amount = 0)
);

-- Indexes
CREATE INDEX idx_sales_targets_tenant_id ON sales.sales_targets(tenant_id);
CREATE INDEX idx_sales_targets_employee_id ON sales.sales_targets(employee_id);
CREATE INDEX idx_sales_targets_fiscal ON sales.sales_targets(fiscal_year, fiscal_quarter);
CREATE INDEX idx_sales_targets_status ON sales.sales_targets(status);
CREATE INDEX idx_sales_targets_created_at ON sales.sales_targets(created_at DESC);
```

### 2. sales.sales_activities (영업 활동)

```sql
CREATE TABLE IF NOT EXISTS sales.sales_activities (
    sales_activity_id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    sales_person_id BIGINT NOT NULL,

    -- Related Entities (Foreign Keys)
    opportunity_id BIGINT,
    account_id BIGINT,
    contact_id BIGINT,
    task_id BIGINT,

    -- Activity Details
    activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN
        ('call', 'email', 'meeting', 'task', 'demo', 'proposal', 'other')),
    subject VARCHAR(255),
    description TEXT,

    -- Scheduling
    scheduled_date TIMESTAMP,
    scheduled_duration_minutes INT CHECK (scheduled_duration_minutes > 0),

    -- Completion
    completed_date TIMESTAMP,
    actual_duration_minutes INT CHECK (actual_duration_minutes > 0),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN
        ('pending', 'completed', 'cancelled', 'overdue')),

    -- Outcome
    outcome VARCHAR(255),
    notes TEXT,
    attachments JSONB, -- Array of file paths/URLs

    -- Metrics
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date TIMESTAMP,

    -- Audit
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    FOREIGN KEY (sales_person_id) REFERENCES hrm.employees(employee_id) ON DELETE RESTRICT,
    FOREIGN KEY (opportunity_id) REFERENCES crm.opportunities(opportunity_id) ON DELETE SET NULL,
    FOREIGN KEY (account_id) REFERENCES crm.accounts(account_id) ON DELETE SET NULL,
    FOREIGN KEY (contact_id) REFERENCES crm.contacts(contact_id) ON DELETE SET NULL,
    FOREIGN KEY (task_id) REFERENCES lwm.tasks(task_id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_sales_activities_tenant_id ON sales.sales_activities(tenant_id);
CREATE INDEX idx_sales_activities_sales_person_id ON sales.sales_activities(sales_person_id);
CREATE INDEX idx_sales_activities_opportunity_id ON sales.sales_activities(opportunity_id);
CREATE INDEX idx_sales_activities_account_id ON sales.sales_activities(account_id);
CREATE INDEX idx_sales_activities_contact_id ON sales.sales_activities(contact_id);
CREATE INDEX idx_sales_activities_type ON sales.sales_activities(activity_type);
CREATE INDEX idx_sales_activities_status ON sales.sales_activities(status);
CREATE INDEX idx_sales_activities_scheduled_date ON sales.sales_activities(scheduled_date);
CREATE INDEX idx_sales_activities_completed_date ON sales.sales_activities(completed_date);
CREATE INDEX idx_sales_activities_created_at ON sales.sales_activities(created_at DESC);
```

### 3. sales.sales_forecasts (영업 예측)

```sql
CREATE TABLE IF NOT EXISTS sales.sales_forecasts (
    forecast_id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    sales_person_id BIGINT NOT NULL,

    -- Forecast Period
    fiscal_year INT NOT NULL,
    fiscal_quarter INT CHECK (fiscal_quarter BETWEEN 1 AND 4),
    fiscal_period VARCHAR(20), -- e.g., 'Q1 2025'

    -- Forecast Values
    forecast_amount DECIMAL(15,2) NOT NULL CHECK (forecast_amount >= 0),
    best_case DECIMAL(15,2) CHECK (best_case IS NULL OR best_case >= forecast_amount),
    worst_case DECIMAL(15,2) CHECK (worst_case IS NULL OR worst_case <= forecast_amount),

    -- Confidence & Weight
    confidence_level INT DEFAULT 50 CHECK (confidence_level BETWEEN 0 AND 100),
    weighting INT DEFAULT 100 CHECK (weighting BETWEEN 0 AND 100),

    -- Breakdown
    closed_amount DECIMAL(15,2) DEFAULT 0,
    pipeline_amount DECIMAL(15,2) DEFAULT 0,

    -- Comments & Status
    comments TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'revised', 'final', 'archived')),

    -- Audit
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    FOREIGN KEY (sales_person_id) REFERENCES hrm.employees(employee_id) ON DELETE RESTRICT,

    -- Constraints
    UNIQUE(tenant_id, sales_person_id, fiscal_year, fiscal_quarter)
);

-- Indexes
CREATE INDEX idx_sales_forecasts_tenant_id ON sales.sales_forecasts(tenant_id);
CREATE INDEX idx_sales_forecasts_sales_person_id ON sales.sales_forecasts(sales_person_id);
CREATE INDEX idx_sales_forecasts_fiscal ON sales.sales_forecasts(fiscal_year, fiscal_quarter);
CREATE INDEX idx_sales_forecasts_created_at ON sales.sales_forecasts(created_at DESC);
```

### 4. sales.sales_metrics (영업 지표 - 집계)

```sql
CREATE TABLE IF NOT EXISTS sales.sales_metrics (
    metric_id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    sales_person_id BIGINT NOT NULL,
    metric_date DATE NOT NULL,

    -- Pipeline Metrics
    pipeline_value DECIMAL(15,2) DEFAULT 0,
    won_value DECIMAL(15,2) DEFAULT 0,
    lost_value DECIMAL(15,2) DEFAULT 0,
    opportunity_count INT DEFAULT 0,

    -- Activity Metrics
    call_count INT DEFAULT 0,
    email_count INT DEFAULT 0,
    meeting_count INT DEFAULT 0,
    task_count INT DEFAULT 0,
    activity_count INT DEFAULT 0,

    -- Performance Metrics
    avg_deal_size DECIMAL(15,2),
    win_rate DECIMAL(5,2), -- percentage
    days_to_close INT,
    quota_achievement DECIMAL(5,2), -- percentage

    -- Calculated
    activities_per_day DECIMAL(5,2),
    revenue_per_activity DECIMAL(15,2),

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    FOREIGN KEY (sales_person_id) REFERENCES hrm.employees(employee_id) ON DELETE RESTRICT,

    -- Constraints
    UNIQUE(tenant_id, sales_person_id, metric_date)
);

-- Indexes
CREATE INDEX idx_sales_metrics_tenant_id ON sales.sales_metrics(tenant_id);
CREATE INDEX idx_sales_metrics_sales_person_id ON sales.sales_metrics(sales_person_id);
CREATE INDEX idx_sales_metrics_metric_date ON sales.sales_metrics(metric_date DESC);
CREATE INDEX idx_sales_metrics_composite ON sales.sales_metrics(tenant_id, sales_person_id, metric_date);
```

### 5. sales.sales_leaderboard (영업 순위표 - 뷰/캐시)

```sql
CREATE TABLE IF NOT EXISTS sales.sales_leaderboard (
    leaderboard_id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    sales_person_id BIGINT NOT NULL,

    -- Period
    fiscal_period VARCHAR(20), -- e.g., 'Q1 2025'
    fiscal_year INT NOT NULL,
    fiscal_quarter INT CHECK (fiscal_quarter BETWEEN 1 AND 4),

    -- Ranking & Achievement
    rank INT CHECK (rank > 0),
    quota_achievement DECIMAL(5,2),
    ytd_revenue DECIMAL(15,2),
    deal_count INT,
    avg_deal_size DECIMAL(15,2),

    -- Performance Indicators
    win_rate DECIMAL(5,2),
    activity_score INT, -- Based on activity count

    -- Metadata
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    FOREIGN KEY (sales_person_id) REFERENCES hrm.employees(employee_id) ON DELETE RESTRICT,

    -- Constraints
    UNIQUE(tenant_id, sales_person_id, fiscal_period)
);

-- Indexes
CREATE INDEX idx_sales_leaderboard_tenant_id ON sales.sales_leaderboard(tenant_id);
CREATE INDEX idx_sales_leaderboard_fiscal ON sales.sales_leaderboard(fiscal_year, fiscal_quarter);
CREATE INDEX idx_sales_leaderboard_rank ON sales.sales_leaderboard(rank);
CREATE INDEX idx_sales_leaderboard_updated_at ON sales.sales_leaderboard(updated_at DESC);
```

### 6. sales.sales_documents (영업 자료)

```sql
CREATE TABLE IF NOT EXISTS sales.sales_documents (
    document_id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,

    -- Document Metadata
    document_type VARCHAR(50) CHECK (document_type IN (
        'brochure', 'pricing', 'presentation', 'case_study',
        'technical_spec', 'proposal_template', 'roi_calculator', 'other'
    )),
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- File Information
    file_url VARCHAR(500) NOT NULL,
    file_size INT, -- in bytes
    file_type VARCHAR(20), -- pdf, ppt, doc, etc.
    version VARCHAR(20) DEFAULT '1.0',

    -- Categorization
    industry VARCHAR(50),
    product_line VARCHAR(100),
    keywords VARCHAR(500), -- comma-separated

    -- Metrics
    download_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    last_downloaded TIMESTAMP,

    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deprecated')),
    is_featured BOOLEAN DEFAULT FALSE,

    -- Audit
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_sales_documents_tenant_id ON sales.sales_documents(tenant_id);
CREATE INDEX idx_sales_documents_type ON sales.sales_documents(document_type);
CREATE INDEX idx_sales_documents_industry ON sales.sales_documents(industry);
CREATE INDEX idx_sales_documents_status ON sales.sales_documents(status);
CREATE INDEX idx_sales_documents_created_at ON sales.sales_documents(created_at DESC);
CREATE INDEX idx_sales_documents_search ON sales.sales_documents(title, keywords);
```

### 7. collaboration.feeds (협업 피드)

```sql
CREATE TABLE IF NOT EXISTS collaboration.feeds (
    feed_id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,

    -- Feed Metadata
    feed_type VARCHAR(50) NOT NULL CHECK (feed_type IN (
        'team_update', 'sales_win', 'question', 'announcement',
        'best_practice', 'approval_request', 'general'
    )),

    -- Content
    title VARCHAR(255),
    content TEXT NOT NULL,
    excerpt VARCHAR(500),

    -- Author
    created_by BIGINT NOT NULL,

    -- Related Entity
    related_entity_type VARCHAR(50), -- 'opportunity', 'account', 'task', etc.
    related_entity_id BIGINT,

    -- Visibility & Access
    visibility VARCHAR(20) DEFAULT 'team' CHECK (visibility IN ('personal', 'team', 'department', 'company')),
    visibility_scope JSONB, -- Array of department IDs if visibility='department'

    -- Engagement
    comment_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    share_count INT DEFAULT 0,

    -- Status
    is_pinned BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    archived_at TIMESTAMP,

    -- Foreign Keys
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES hrm.employees(employee_id) ON DELETE RESTRICT
);

-- Indexes
CREATE INDEX idx_feeds_tenant_id ON collaboration.feeds(tenant_id);
CREATE INDEX idx_feeds_created_by ON collaboration.feeds(created_by);
CREATE INDEX idx_feeds_type ON collaboration.feeds(feed_type);
CREATE INDEX idx_feeds_visibility ON collaboration.feeds(visibility);
CREATE INDEX idx_feeds_created_at ON collaboration.feeds(created_at DESC);
CREATE INDEX idx_feeds_related_entity ON collaboration.feeds(related_entity_type, related_entity_id);
```

### 8. collaboration.comments (댓글)

```sql
CREATE TABLE IF NOT EXISTS collaboration.comments (
    comment_id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    feed_id BIGINT NOT NULL,

    -- Author
    created_by BIGINT NOT NULL,

    -- Content
    content TEXT NOT NULL,
    mentions JSONB, -- Array of mentioned user IDs
    attachments JSONB, -- Array of file paths

    -- Engagement
    like_count INT DEFAULT 0,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP, -- soft delete

    -- Foreign Keys
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    FOREIGN KEY (feed_id) REFERENCES collaboration.feeds(feed_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES hrm.employees(employee_id) ON DELETE RESTRICT
);

-- Indexes
CREATE INDEX idx_comments_tenant_id ON collaboration.comments(tenant_id);
CREATE INDEX idx_comments_feed_id ON collaboration.comments(feed_id);
CREATE INDEX idx_comments_created_by ON collaboration.comments(created_by);
CREATE INDEX idx_comments_created_at ON collaboration.comments(created_at DESC);
```

### 9. collaboration.approvals (승인 요청)

```sql
CREATE TABLE IF NOT EXISTS collaboration.approvals (
    approval_id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,

    -- Requester & Approver
    created_by BIGINT NOT NULL,
    approver_id BIGINT NOT NULL,

    -- Approval Type
    approval_type VARCHAR(50) NOT NULL CHECK (approval_type IN (
        'discount', 'exception', 'deal_split', 'credit_limit',
        'special_pricing', 'contract_term', 'other'
    )),

    -- Related Entity
    related_entity_type VARCHAR(50), -- 'opportunity', 'quotation', etc.
    related_entity_id BIGINT,

    -- Request Details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    request_amount DECIMAL(15,2),
    request_percentage DECIMAL(5,2), -- percentage discount, etc.

    -- Business Justification
    business_reason TEXT,
    competitive_situation TEXT,
    customer_feedback TEXT,

    -- Status & Timeline
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'approved', 'rejected', 'cancelled'
    )),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    resolved_at TIMESTAMP,

    -- Approver Comments
    approver_comments TEXT,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES hrm.employees(employee_id) ON DELETE RESTRICT,
    FOREIGN KEY (approver_id) REFERENCES hrm.employees(employee_id) ON DELETE RESTRICT
);

-- Indexes
CREATE INDEX idx_approvals_tenant_id ON collaboration.approvals(tenant_id);
CREATE INDEX idx_approvals_created_by ON collaboration.approvals(created_by);
CREATE INDEX idx_approvals_approver_id ON collaboration.approvals(approver_id);
CREATE INDEX idx_approvals_status ON collaboration.approvals(status);
CREATE INDEX idx_approvals_type ON collaboration.approvals(approval_type);
CREATE INDEX idx_approvals_created_at ON collaboration.approvals(created_at DESC);
CREATE INDEX idx_approvals_related ON collaboration.approvals(related_entity_type, related_entity_id);
```

---

## 인덱스 및 제약

### 성능 최적화 인덱스

```sql
-- Composite indexes for common queries
CREATE INDEX idx_sales_activities_person_date ON sales.sales_activities(
    sales_person_id, completed_date DESC
) WHERE status = 'completed';

CREATE INDEX idx_sales_metrics_person_range ON sales.sales_metrics(
    sales_person_id, metric_date DESC
);

CREATE INDEX idx_feeds_visibility_date ON collaboration.feeds(
    visibility, created_at DESC
) WHERE is_archived = FALSE;

-- Full-text search indexes (PostgreSQL)
CREATE INDEX idx_sales_documents_full_text ON sales.sales_documents
USING gin(to_tsvector('korean', title || ' ' || description));

CREATE INDEX idx_feeds_full_text ON collaboration.feeds
USING gin(to_tsvector('korean', title || ' ' || content));
```

### 외래 키 제약

```sql
-- Cascading deletes for tenants
ALTER TABLE sales.sales_targets
    ADD CONSTRAINT fk_sales_targets_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE;

-- Restrict deletes for employees (prevent orphaned records)
ALTER TABLE sales.sales_activities
    ADD CONSTRAINT fk_sales_activities_employee
    FOREIGN KEY (sales_person_id) REFERENCES hrm.employees(employee_id) ON DELETE RESTRICT;

-- Set null for optional related entities
ALTER TABLE sales.sales_activities
    ADD CONSTRAINT fk_sales_activities_opportunity
    FOREIGN KEY (opportunity_id) REFERENCES crm.opportunities(opportunity_id) ON DELETE SET NULL;
```

---

## 마이그레이션 전략

### Migration 1: 스키마 생성

**파일**: `alembic/versions/001_create_sales_schema.py`

```python
"""Create sales portal schema"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    # Create schema
    op.execute('CREATE SCHEMA IF NOT EXISTS sales')
    op.execute('CREATE SCHEMA IF NOT EXISTS collaboration')

    # Create tables
    op.create_table(
        'sales_targets',
        sa.Column('sales_target_id', sa.BigInteger, primary_key=True),
        sa.Column('tenant_id', sa.BigInteger, nullable=False),
        sa.Column('employee_id', sa.BigInteger, nullable=False),
        # ... (all columns)
        schema='sales'
    )

    # Create indexes
    op.create_index('idx_sales_targets_employee_id', 'sales_targets', ['employee_id'], schema='sales')
    # ... (all indexes)

def downgrade():
    # Drop tables in reverse order
    op.drop_table('sales_leaderboard', schema='sales')
    op.drop_table('sales_documents', schema='sales')
    # ... (all tables)

    # Drop schemas
    op.execute('DROP SCHEMA IF EXISTS sales CASCADE')
    op.execute('DROP SCHEMA IF EXISTS collaboration CASCADE')
```

### Migration 2: 데이터 초기화

**파일**: `alembic/versions/002_initialize_sales_data.py`

```python
"""Initialize sales data for existing tenants"""
def upgrade():
    # Create default targets for all employees
    op.execute("""
        INSERT INTO sales.sales_targets
        (tenant_id, employee_id, fiscal_year, fiscal_quarter, target_amount, status)
        SELECT
            e.tenant_id, e.employee_id,
            EXTRACT(YEAR FROM CURRENT_DATE)::INT,
            EXTRACT(QUARTER FROM CURRENT_DATE)::INT,
            1000000.00, 'active'
        FROM hrm.employees e
        WHERE e.status = 'active'
        ON CONFLICT DO NOTHING
    """)

def downgrade():
    op.execute('DELETE FROM sales.sales_targets')
```

### Migration 3: 뷰 및 함수 생성

**파일**: `alembic/versions/003_create_views_and_functions.py`

```python
"""Create views and functions for sales portal"""

def upgrade():
    # Create leaderboard view
    op.execute("""
        CREATE OR REPLACE VIEW sales.v_sales_leaderboard AS
        SELECT
            ROW_NUMBER() OVER (PARTITION BY st.tenant_id, st.fiscal_period ORDER BY st.achieved_amount DESC) as rank,
            st.tenant_id,
            st.employee_id,
            st.fiscal_period,
            st.fiscal_year,
            st.fiscal_quarter,
            st.achieved_amount,
            CASE WHEN st.target_amount > 0
                THEN (st.achieved_amount / st.target_amount * 100)
                ELSE 0
            END as quota_achievement
        FROM sales.sales_targets st
        WHERE st.status = 'active'
    """)

    # Create metrics aggregation function
    op.execute("""
        CREATE OR REPLACE FUNCTION sales.refresh_sales_metrics()
        RETURNS void AS $$
        BEGIN
            -- Aggregate metrics from activities
            MERGE INTO sales.sales_metrics sm
            USING (
                SELECT
                    sa.tenant_id,
                    sa.sales_person_id,
                    DATE(sa.completed_date) as metric_date,
                    COUNT(*) as activity_count,
                    COUNT(CASE WHEN sa.activity_type = 'call' THEN 1 END) as call_count
                FROM sales.sales_activities sa
                WHERE sa.status = 'completed' AND sa.completed_date IS NOT NULL
                GROUP BY sa.tenant_id, sa.sales_person_id, DATE(sa.completed_date)
            ) src
            ON sm.tenant_id = src.tenant_id
                AND sm.sales_person_id = src.sales_person_id
                AND sm.metric_date = src.metric_date
            WHEN MATCHED THEN
                UPDATE SET activity_count = src.activity_count, call_count = src.call_count
            WHEN NOT MATCHED THEN
                INSERT (tenant_id, sales_person_id, metric_date, activity_count, call_count)
                VALUES (src.tenant_id, src.sales_person_id, src.metric_date, src.activity_count, src.call_count);
        END;
        $$ LANGUAGE plpgsql;
    """)

def downgrade():
    op.execute('DROP VIEW IF EXISTS sales.v_sales_leaderboard')
    op.execute('DROP FUNCTION IF EXISTS sales.refresh_sales_metrics()')
```

---

## 데이터 초기화

### Sample Data Insertion

```sql
-- 1. 영업 목표 데이터
INSERT INTO sales.sales_targets (
    tenant_id, employee_id, fiscal_year, fiscal_quarter, fiscal_period,
    target_amount, target_weight, status, created_by
)
SELECT
    e.tenant_id,
    e.employee_id,
    2025,
    1,
    'Q1 2025',
    1000000.00,
    100,
    'active',
    1
FROM hrm.employees e
WHERE e.position LIKE '%Sales%' AND e.status = 'active'
ON CONFLICT (tenant_id, employee_id, fiscal_year, fiscal_quarter) DO NOTHING;

-- 2. 영업 활동 기록
INSERT INTO sales.sales_activities (
    tenant_id, sales_person_id, opportunity_id, account_id,
    activity_type, subject, status, completed_date, created_by
)
SELECT
    o.tenant_id,
    pm.employee_id,
    o.opportunity_id,
    o.account_id,
    'email',
    'Follow-up email sent',
    'completed',
    CURRENT_TIMESTAMP,
    pm.employee_id
FROM crm.opportunities o
JOIN crm.partner_managers pm ON o.account_id = pm.account_id
WHERE o.status NOT IN ('won', 'lost')
LIMIT 100;

-- 3. 협업 피드 생성
INSERT INTO collaboration.feeds (
    tenant_id, feed_type, title, content, created_by, visibility, created_at
)
VALUES
(1, 'announcement', 'Q1 Sales Kickoff', 'Welcome to Q1! Let''s crush our targets!', 1, 'company', CURRENT_TIMESTAMP),
(1, 'best_practice', 'Successful Deal Closing Tips', 'Here are our top tips for closing deals...', 2, 'team', CURRENT_TIMESTAMP);
```

---

## 쿼리 예제

### Dashboard Metrics

```sql
-- Get current quarter metrics for a salesperson
SELECT
    st.target_amount,
    st.achieved_amount,
    ROUND((st.achieved_amount / NULLIF(st.target_amount, 0) * 100), 2) as quota_achievement,
    (SELECT COUNT(*) FROM crm.opportunities o
     WHERE o.account_id IN (
        SELECT account_id FROM crm.partner_managers
        WHERE employee_id = $1
     ) AND o.stage != 'won') as pipeline_count,
    (SELECT COALESCE(SUM(amount), 0) FROM crm.opportunities o
     WHERE o.account_id IN (
        SELECT account_id FROM crm.partner_managers
        WHERE employee_id = $1
     ) AND o.stage != 'won') as pipeline_value
FROM sales.sales_targets st
WHERE st.employee_id = $1
    AND st.fiscal_year = EXTRACT(YEAR FROM CURRENT_DATE)
    AND st.fiscal_quarter = EXTRACT(QUARTER FROM CURRENT_DATE);
```

### Activity Summary

```sql
-- Get activity summary for today
SELECT
    activity_type,
    COUNT(*) as count,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
FROM sales.sales_activities
WHERE sales_person_id = $1
    AND DATE(COALESCE(completed_date, scheduled_date)) = CURRENT_DATE
    AND tenant_id = $2
GROUP BY activity_type;
```

### Leaderboard

```sql
-- Get sales leaderboard for current period
SELECT
    ROW_NUMBER() OVER (ORDER BY st.achieved_amount DESC) as rank,
    e.name,
    e.employee_id,
    st.target_amount,
    st.achieved_amount,
    ROUND((st.achieved_amount / NULLIF(st.target_amount, 0) * 100), 2) as quota_achievement,
    (SELECT COUNT(*) FROM crm.opportunities o
     WHERE o.account_id IN (
        SELECT account_id FROM crm.partner_managers
        WHERE employee_id = e.employee_id
     ) AND o.stage = 'won') as deals_won
FROM sales.sales_targets st
JOIN hrm.employees e ON st.employee_id = e.employee_id
WHERE st.tenant_id = $1
    AND st.fiscal_year = EXTRACT(YEAR FROM CURRENT_DATE)
    AND st.fiscal_quarter = EXTRACT(QUARTER FROM CURRENT_DATE)
    AND st.status = 'active'
ORDER BY st.achieved_amount DESC
LIMIT 50;
```

---

## 배포 체크리스트

- [ ] 데이터베이스 백업
- [ ] 마이그레이션 스크립트 테스트 (개발 환경)
- [ ] 인덱스 성능 검증
- [ ] 샘플 데이터 로드
- [ ] 쿼리 성능 테스트
- [ ] 전체 통합 테스트
- [ ] 프로덕션 배포
- [ ] 모니터링 및 검증

---

**문서 작성자**: Claude Code
**버전**: 1.0.0
**마지막 수정**: 2025-11-01
