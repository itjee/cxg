# 영업사원 포탈(Sales Portal) 구현 계획서

**작성일**: 2025-11-01
**프로젝트**: ConexGrow Sales Portal
**상태**: 계획 수립 단계

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [아키텍처 설계](#아키텍처-설계)
3. [페이지 구조](#페이지-구조)
4. [데이터베이스 설계](#데이터베이스-설계)
5. [API 엔드포인트](#api-엔드포인트)
6. [프론트엔드 구조](#프론트엔드-구조)
7. [구현 일정](#구현-일정)
8. [기술 스택](#기술-스택)

---

## 프로젝트 개요

### 목적
기존 거래처 포탈(tenants-web)과 같이 영업사원 포탈 애플리케이션을 구축합니다. Salesforce CRM의 대시보드와 유사한 구성으로 영업사원이 자신의 성과를 실시간으로 확인하고, 거래처 및 기회를 관리할 수 있는 통합 플랫폼을 제공합니다.

### 주요 사용자
- **영업사원** (Salesperson): 자신의 성과, 거래처, 기회 관리
- **영업관리자** (Sales Manager): 팀 성과 모니터링, 부하 직원 관리
- **임원진** (Executive): 전사 영업 성과 분석

### 목표
1. **개인 맞춤형 대시보드**: 실시간 성과 추적
2. **효율적인 거래처/기회 관리**: 직관적인 UI/UX
3. **협업 및 지식공유**: 팀 간 소통 플랫폼
4. **데이터 기반 의사결정**: 분석 및 리포트

---

## 아키텍처 설계

### 시스템 구성

```
┌─────────────────────────────────────────────────────────┐
│                    Sales Portal App                      │
│                    (sales-web)                           │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Next.js 15 (Frontend)                             │  │
│  │  - App Router                                      │  │
│  │  - React 19 + Tailwind CSS                         │  │
│  │  - shadcn/ui Components                            │  │
│  └────────────────────────────────────────────────────┘  │
│           ↓ (API Calls)                                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Backend API (FastAPI)                             │  │
│  │  - Sales endpoints                                 │  │
│  │  - Analytics endpoints                             │  │
│  │  - Account/Opportunity CRUD                        │  │
│  └────────────────────────────────────────────────────┘  │
│           ↓ (Queries)                                    │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Tenant Database (PostgreSQL)                      │  │
│  │  - Sales data                                      │  │
│  │  - Account/Contact/Opportunity                     │  │
│  │  - Activities/Tasks                                │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 멀티테넌트 아키텍처
- 기존 tenants-web과 동일한 다중 테넌트 구조 활용
- 각 테넌트별 독립적인 영업 데이터 관리
- JWT 기반 인증 및 RBAC 권한관리

---

## 페이지 구조

### 1. 홈 대시보드 (Sales Activity & Performance Dashboard)

#### 1-1. 핵심 성과 지표 (Metrics Card)
```
┌─────────────────────────────────────┐
│  Sales Performance Metrics           │
├─────────────────────────────────────┤
│  Pipeline Total (This Month)         │  $2,450,000
│  Quota Achievement Rate (Gauge)      │  [████████░░] 85%
│  Average Deal Size                   │  $125,000
│  Win Rate                            │  68%
│  Days to Close (Avg)                 │  28 days
└─────────────────────────────────────┘
```

**데이터 소스**:
- `sales_targets` - 목표 정보
- `sales_orders` - 판매 주문
- `opportunities` - 기회 데이터
- `quotations` - 견적서

**컴포넌트**:
- `MetricCard` - 개별 지표 표시
- `GaugeChart` - 달성률 시각화 (Recharts)
- `StatTrend` - 추이 표시

#### 1-2. 파이프라인 요약 (Pipeline Summary)
```
┌─────────────────────────────────────┐
│  Pipeline Summary                   │
├─────────────────────────────────────┤
│  Funnel Chart                        │
│  ├─ Lead: 50                         │
│  ├─ Proposal: 35                     │
│  ├─ Negotiation: 12                  │
│  └─ Closing: 4                       │
│                                      │
│  Upcoming Closures (This Week)       │
│  [Table: 3 opportunities]            │
│                                      │
│  Pipeline Trend (Last 6 Months)      │
│  [Line Chart]                        │
└─────────────────────────────────────┘
```

**컴포넌트**:
- `FunnelChart` - Recharts Funnel
- `UpcomingOpportunitiesTable` - 마감일 임박 기회 목록
- `PipelineTrendChart` - 추이 분석 차트

#### 1-3. 활동 및 작업 (Activities)
```
┌─────────────────────────────────────┐
│  Today's Activities                 │
├─────────────────────────────────────┤
│  Tasks (6)        Meetings (2)       │
│  [Task List]      [Calendar View]    │
│  Overdue (1)      Pending (5)        │
└─────────────────────────────────────┘
```

**데이터 소스**:
- `tasks` - 작업 정보
- `activities` - 활동 기록
- `meetings` - 회의 일정

**컴포넌트**:
- `TaskList` - 우선순위별 작업 목록
- `ActivityCalendar` - 일정 뷰
- `OverdueActivities` - 미결 활동 알림

#### 1-4. 거래처 및 기회 (Accounts & Opportunities)
```
┌─────────────────────────────────────┐
│  At-Risk & Key Accounts             │
├─────────────────────────────────────┤
│  No Recent Activity (10)             │
│  [Account List with last activity]   │
│                                      │
│  My Top Accounts (5)                 │
│  [Tier Badge] [Revenue] [Status]     │
└─────────────────────────────────────┘
```

**컴포넌트**:
- `AccountList` - 거래처 목록
- `AccountCard` - 거래처 상세 카드
- `RiskIndicator` - 위험도 표시

#### 1-5. 경쟁 및 인정 (Competition & Recognition)
```
┌─────────────────────────────────────┐
│  Sales Leaderboard                  │
├─────────────────────────────────────┤
│  Rank  Name           Quota  YTD %   │
│  1.    John Smith    $500K   95%     │
│  2.    Jane Doe      $450K   87%     │
│  3.    You           $500K   85%     │
│  ...                                  │
│                                      │
│  Recent Wins                         │
│  [Won deals timeline]                │
└─────────────────────────────────────┘
```

**컴포넌트**:
- `LeaderboardTable` - 순위표
- `WinLossRatio` - 성공/실패 비율
- `RecentClosingsTimeline` - 최근 클로징 타임라인

---

### 2. 거래처 및 기회 관리 (Account & Opportunity Management)

#### 2-1. 나의 거래처 (My Accounts)
```
URL: /sales/accounts
Features:
  - 자신이 담당하는 모든 Account 조회
  - 필터링 (Tier, Industry, Status)
  - 정렬 (Revenue, Last Activity, Name)
  - 일괄 액션 (Export, Tag, Assign)

Table Columns:
  - Account Name [Link to Detail]
  - Tier (Badge: Gold/Silver/Bronze)
  - Industry
  - Total Revenue (YTD)
  - Last Activity Date
  - Next Action
  - Status (Active/Inactive)

Detail Page:
  /sales/accounts/[accountId]
  - Account Profile
  - Contact Map (Relationship Map)
  - Opportunity List
  - Activity Timeline
  - Files & Documents
```

**데이터 소스**:
- `crm.accounts` - 거래처
- `crm.partner_managers` - 거래처 담당자
- `crm.contacts` - 연락처
- `crm.opportunities` - 기회

#### 2-2. 거래 관리 (Opportunities)
```
URL: /sales/opportunities
Features:
  - 파이프라인 뷰 (Kanban)
  - 리스트 뷰 (Table)
  - 맵 뷰 (Sales Stage 별)
  - 분석 뷰 (Probability, Revenue)

Kanban Board:
  Col 1: Lead (50)
  Col 2: Proposal (35)
  Col 3: Negotiation (12)
  Col 4: Closing (4)
  Col 5: Won (125)
  Col 6: Lost (18)

Detail Page:
  /sales/opportunities/[opportunityId]
  - Opportunity Profile
  - Probability & Amount
  - Next Steps
  - Activity History
  - Related Contacts
  - Files & Attachments
  - Deal Timeline
```

**데이터 소스**:
- `crm.opportunities` - 기회
- `crm.contacts` (related) - 관련 연락처
- `activities` - 활동 기록
- `quotations` - 견적서

#### 2-3. 연락처 및 관계도 (Contacts & Relationship Map)
```
URL: /sales/accounts/[accountId]/contacts
Features:
  - 계층적 조직도 표시
  - 주요 의사결정자 강조
  - 영향도 분석
  - 커뮤니케이션 이력

Display:
  Contact Card:
    - Name, Title, Department
    - Phone, Email
    - Last Contact Date
    - Influence Level (Badge)
    - Communication Frequency

  Relationship Map:
    - Network visualization
    - Connection strength
    - Influence mapping
```

---

### 3. 리소스 및 협업 (Resources & Collaboration)

#### 3-1. 영업 자료실 (Sales Collateral)
```
URL: /sales/resources
Features:
  - 제품 브로슈어, 가격표, 프레젠테이션
  - 경쟁사 분석 자료
  - Case Studies
  - ROI 계산기
  - 제안서 템플릿

Filtering:
  - By Type (Brochure, Pricing, Presentation, etc.)
  - By Product Line
  - By Industry
  - Sorting (Most Used, Recently Updated, etc.)

Document Actions:
  - Download
  - Share with contact
  - Add to deal
  - Preview
  - Version history
```

**데이터 소스**:
- `cms.resources` - 영업 자료
- `cms.documents` - 문서

#### 3-2. 지식 베이스 (Knowledge Base)
```
URL: /sales/knowledge
Features:
  - FAQ 검색
  - 제품 사양 검색
  - 기술 Q&A
  - Best practices

Search:
  - Full-text search
  - Category browse
  - Tag based
  - Recently viewed

Content:
  - FAQ
  - Product specs
  - Technical guides
  - Sales tips
```

**데이터 소스**:
- `cms.knowledge_base` - 지식 기사
- `cms.faqs` - FAQ

#### 3-3. 내부 소통 (Internal Collaboration / Chatter)
```
URL: /sales/collaboration
Features:
  - 팀 피드 (Team Feed)
  - 질문 & 답변 (Q&A)
  - 노하우 공유 (Best Practices)
  - 승인 요청 (Approval Requests)

Feed Types:
  1. Team Updates
  2. Sales Wins
  3. Customer Feedback
  4. Discount Approvals
  5. Manager Guidance

Comments:
  - Real-time updates
  - @mention
  - File attachments
  - Reactions (👍, ❤️, etc.)

Notifications:
  - New comments
  - @mentions
  - Approval requests
  - Due dates
```

**데이터 소스**:
- `collaboration.feeds` - 피드
- `collaboration.comments` - 댓글
- `collaboration.approvals` - 승인 요청

---

## 데이터베이스 설계

### 필요한 테이블 분석

#### 기존 테이블 (활용)
```sql
-- HRM 모듈
- hrm.employees (employee_id, name, department_id, position, status)
- hrm.departments (department_id, name, manager_id)

-- CRM 모듈
- crm.accounts (account_id, name, tier, industry, revenue, status)
- crm.partner_managers (partner_manager_id, account_id, employee_id, role)
- crm.contacts (contact_id, account_id, name, title, email, phone, influence_level)
- crm.opportunities (opportunity_id, account_id, name, amount, stage, probability, close_date)
- crm.activities (activity_id, assigned_to, type, date, description)

-- SRM 모듈
- srm.quotations (quotation_id, opportunity_id, sales_person_id, amount, status)
- srm.sales_orders (sales_order_id, account_id, sales_person_id, amount, date)

-- General
- tasks (task_id, assigned_to, due_date, status, priority)
```

#### 새로운 테이블 (필요)
```sql
-- Sales Analytics
CREATE TABLE sales.sales_targets (
    sales_target_id BIGINT PRIMARY KEY,
    employee_id BIGINT UNIQUE NOT NULL,
    fiscal_year INT NOT NULL,
    fiscal_quarter INT,
    target_amount DECIMAL(15,2) NOT NULL,
    achieved_amount DECIMAL(15,2) DEFAULT 0,
    target_weight DECIMAL(5,2) DEFAULT 100,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES hrm.employees(employee_id)
);

-- Sales Activities
CREATE TABLE sales.sales_activities (
    sales_activity_id BIGINT PRIMARY KEY,
    sales_person_id BIGINT NOT NULL,
    opportunity_id BIGINT,
    account_id BIGINT,
    contact_id BIGINT,
    activity_type VARCHAR(50) NOT NULL, -- 'call', 'email', 'meeting', 'task'
    subject VARCHAR(255),
    description TEXT,
    scheduled_date TIMESTAMP,
    completed_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    duration_minutes INT,
    outcome VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Sales Forecasts
CREATE TABLE sales.sales_forecasts (
    forecast_id BIGINT PRIMARY KEY,
    sales_person_id BIGINT NOT NULL,
    fiscal_period VARCHAR(20), -- 'Q1', 'Q2', etc.
    fiscal_year INT NOT NULL,
    forecast_amount DECIMAL(15,2) NOT NULL,
    best_case DECIMAL(15,2),
    worst_case DECIMAL(15,2),
    confidence_level INT, -- 0-100
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Sales Documents
CREATE TABLE sales.sales_documents (
    document_id BIGINT PRIMARY KEY,
    document_type VARCHAR(50), -- 'brochure', 'pricing', 'presentation', etc.
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(500),
    industry VARCHAR(50),
    product_line VARCHAR(100),
    version VARCHAR(20),
    download_count INT DEFAULT 0,
    last_updated TIMESTAMP,
    created_at TIMESTAMP
);

-- Sales Metrics (Aggregated)
CREATE TABLE sales.sales_metrics (
    metric_id BIGINT PRIMARY KEY,
    sales_person_id BIGINT NOT NULL,
    metric_date DATE NOT NULL,
    pipeline_value DECIMAL(15,2),
    won_value DECIMAL(15,2),
    lost_value DECIMAL(15,2),
    opportunity_count INT,
    call_count INT,
    email_count INT,
    meeting_count INT,
    avg_deal_size DECIMAL(15,2),
    win_rate DECIMAL(5,2),
    days_to_close INT,
    UNIQUE(sales_person_id, metric_date)
);

-- Sales Leaderboard (View/Cache)
CREATE TABLE sales.sales_leaderboard (
    leaderboard_id BIGINT PRIMARY KEY,
    sales_person_id BIGINT NOT NULL,
    rank INT,
    fiscal_period VARCHAR(20),
    fiscal_year INT,
    quota_achievement DECIMAL(5,2),
    ytd_revenue DECIMAL(15,2),
    deal_count INT,
    updated_at TIMESTAMP
);

-- Collaboration Feeds
CREATE TABLE collaboration.feeds (
    feed_id BIGINT PRIMARY KEY,
    feed_type VARCHAR(50), -- 'team_update', 'sales_win', 'question', 'approval'
    created_by BIGINT NOT NULL,
    title VARCHAR(255),
    content TEXT,
    related_entity_type VARCHAR(50), -- 'opportunity', 'account', etc.
    related_entity_id BIGINT,
    visibility VARCHAR(20) DEFAULT 'team', -- 'personal', 'team', 'company'
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE collaboration.comments (
    comment_id BIGINT PRIMARY KEY,
    feed_id BIGINT NOT NULL,
    created_by BIGINT NOT NULL,
    content TEXT,
    mentions JSONB, -- Array of user IDs
    attachments JSONB,
    created_at TIMESTAMP,
    FOREIGN KEY (feed_id) REFERENCES collaboration.feeds(feed_id)
);

CREATE TABLE collaboration.approvals (
    approval_id BIGINT PRIMARY KEY,
    created_by BIGINT NOT NULL,
    approval_type VARCHAR(50), -- 'discount', 'exception', 'deal_split'
    related_entity_type VARCHAR(50),
    related_entity_id BIGINT,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    approver_id BIGINT,
    request_amount DECIMAL(15,2),
    comments TEXT,
    created_at TIMESTAMP,
    approved_at TIMESTAMP
);
```

### FK 관계 정리
```
sales_targets
  └─ employee_id → hrm.employees

sales_activities
  ├─ sales_person_id → hrm.employees
  ├─ opportunity_id → crm.opportunities
  ├─ account_id → crm.accounts
  └─ contact_id → crm.contacts

sales_forecasts
  └─ sales_person_id → hrm.employees

sales_metrics
  └─ sales_person_id → hrm.employees

sales_leaderboard
  └─ sales_person_id → hrm.employees

collaboration.feeds
  └─ created_by → hrm.employees

collaboration.comments
  ├─ feed_id → collaboration.feeds
  └─ created_by → hrm.employees

collaboration.approvals
  ├─ created_by → hrm.employees
  └─ approver_id → hrm.employees
```

---

## API 엔드포인트

### 1. 대시보드 API

```
GET /api/sales/dashboard/metrics
  Query: date_range, period (month, quarter, year)
  Response: {
    pipeline_total: number,
    quota_achievement: percentage,
    avg_deal_size: number,
    win_rate: percentage,
    days_to_close: number
  }

GET /api/sales/dashboard/pipeline
  Response: {
    funnel: [{ stage: string, count: number, value: number }],
    upcoming_closures: Opportunity[],
    trend: [{ period: string, value: number }]
  }

GET /api/sales/dashboard/activities
  Response: {
    tasks: Task[],
    meetings: Meeting[],
    overdue: Activity[],
    pending: Activity[]
  }

GET /api/sales/dashboard/accounts
  Query: limit, include_risk
  Response: {
    at_risk: Account[],
    top_accounts: Account[]
  }

GET /api/sales/dashboard/leaderboard
  Query: period, limit
  Response: {
    leaderboard: LeaderboardEntry[],
    your_rank: number,
    your_quota_achievement: percentage
  }
```

### 2. 거래처 API

```
GET /api/sales/accounts
  Query: tier, industry, status, sort, limit, offset
  Response: Account[]

GET /api/sales/accounts/:accountId
  Response: Account (with relations)

GET /api/sales/accounts/:accountId/contacts
  Response: Contact[]

GET /api/sales/accounts/:accountId/opportunities
  Response: Opportunity[]

GET /api/sales/accounts/:accountId/activities
  Response: Activity[]

PUT /api/sales/accounts/:accountId
  Request: Account (updates)
  Response: Account

POST /api/sales/accounts/:accountId/assign
  Request: { employee_id: number }
  Response: { success: boolean }
```

### 3. 기회 API

```
GET /api/sales/opportunities
  Query: stage, sort, filter, limit, offset
  Response: Opportunity[]

GET /api/sales/opportunities/:opportunityId
  Response: Opportunity (with relations)

POST /api/sales/opportunities
  Request: CreateOpportunityDTO
  Response: Opportunity

PUT /api/sales/opportunities/:opportunityId
  Request: UpdateOpportunityDTO
  Response: Opportunity

PATCH /api/sales/opportunities/:opportunityId/stage
  Request: { stage: string }
  Response: Opportunity

DELETE /api/sales/opportunities/:opportunityId
  Response: { success: boolean }

GET /api/sales/opportunities/:opportunityId/related-contacts
  Response: Contact[]

POST /api/sales/opportunities/:opportunityId/activities
  Request: CreateActivityDTO
  Response: Activity
```

### 4. 리소스 API

```
GET /api/sales/resources
  Query: type, product_line, industry, sort
  Response: Document[]

GET /api/sales/resources/:documentId
  Response: Document

POST /api/sales/resources/:documentId/download
  Response: { download_url: string }

GET /api/sales/knowledge
  Query: search, category, tag
  Response: KnowledgeArticle[]

GET /api/sales/knowledge/:articleId
  Response: KnowledgeArticle
```

### 5. 협업 API

```
GET /api/sales/feeds
  Query: type, limit, offset
  Response: Feed[]

POST /api/sales/feeds
  Request: CreateFeedDTO
  Response: Feed

GET /api/sales/feeds/:feedId/comments
  Response: Comment[]

POST /api/sales/feeds/:feedId/comments
  Request: { content: string, mentions: number[] }
  Response: Comment

GET /api/sales/approvals
  Query: status, type
  Response: Approval[]

POST /api/sales/approvals/:approvalId/approve
  Request: { comments: string }
  Response: Approval

POST /api/sales/approvals/:approvalId/reject
  Request: { comments: string }
  Response: Approval
```

---

## 프론트엔드 구조

### 디렉토리 구조

```
apps/sales-web/
├── src/
│   ├── app/
│   │   ├── (auth)/                  # Authentication pages
│   │   │   ├── login/page.tsx
│   │   │   ├── logout/page.tsx
│   │   │   └── unauthorized/page.tsx
│   │   │
│   │   └── (main)/                  # Main app pages
│   │       ├── layout.tsx           # Main layout
│   │       ├── dashboard/
│   │       │   └── page.tsx
│   │       ├── accounts/
│   │       │   ├── page.tsx         # My Accounts list
│   │       │   ├── [accountId]/
│   │       │   │   ├── page.tsx     # Account detail
│   │       │   │   ├── contacts/page.tsx
│   │       │   │   └── opportunities/page.tsx
│   │       │   └── new/page.tsx
│   │       ├── opportunities/
│   │       │   ├── page.tsx         # Opportunities kanban
│   │       │   ├── list/page.tsx    # Table view
│   │       │   ├── analytics/page.tsx
│   │       │   ├── [opportunityId]/
│   │       │   │   ├── page.tsx
│   │       │   │   └── edit/page.tsx
│   │       │   └── new/page.tsx
│   │       ├── resources/
│   │       │   ├── page.tsx         # Resources/Collateral
│   │       │   └── [resourceId]/page.tsx
│   │       ├── knowledge/
│   │       │   ├── page.tsx         # Knowledge base
│   │       │   └── [articleId]/page.tsx
│   │       ├── collaboration/
│   │       │   ├── page.tsx         # Feeds
│   │       │   ├── feed/[feedId]/page.tsx
│   │       │   └── approvals/page.tsx
│   │       └── settings/
│   │           ├── page.tsx
│   │           ├── profile/page.tsx
│   │           └── preferences/page.tsx
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── MetricCard.tsx
│   │   │   ├── PipelineSummary.tsx
│   │   │   ├── ActivityPanel.tsx
│   │   │   ├── AccountsPanel.tsx
│   │   │   └── LeaderboardPanel.tsx
│   │   ├── accounts/
│   │   │   ├── AccountList.tsx
│   │   │   ├── AccountCard.tsx
│   │   │   ├── AccountDetailView.tsx
│   │   │   ├── ContactList.tsx
│   │   │   └── RelationshipMap.tsx
│   │   ├── opportunities/
│   │   │   ├── OpportunityKanban.tsx
│   │   │   ├── OpportunityTable.tsx
│   │   │   ├── OpportunityCard.tsx
│   │   │   ├── OpportunityDetailView.tsx
│   │   │   └── DealTimeline.tsx
│   │   ├── resources/
│   │   │   ├── ResourceList.tsx
│   │   │   ├── ResourceCard.tsx
│   │   │   └── DocumentPreview.tsx
│   │   ├── collaboration/
│   │   │   ├── FeedList.tsx
│   │   │   ├── FeedItem.tsx
│   │   │   ├── CommentSection.tsx
│   │   │   ├── ApprovalRequest.tsx
│   │   │   └── ApprovalTable.tsx
│   │   └── common/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       ├── Breadcrumb.tsx
│   │       └── filters/
│   │           ├── DateRangeFilter.tsx
│   │           ├── StatusFilter.tsx
│   │           └── MultiSelectFilter.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── usePermissions.ts
│   │   │   ├── services/
│   │   │   │   └── authService.ts
│   │   │   ├── stores/
│   │   │   │   └── authStore.ts
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   │
│   │   ├── sales/
│   │   │   ├── dashboard/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useDashboardMetrics.ts
│   │   │   │   ├── services/
│   │   │   │   │   └── dashboardService.ts
│   │   │   │   ├── stores/
│   │   │   │   │   └── dashboardStore.ts
│   │   │   │   └── types/
│   │   │   │       └── dashboard.types.ts
│   │   │   │
│   │   │   ├── accounts/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useAccounts.ts
│   │   │   │   ├── services/
│   │   │   │   │   └── accountService.ts
│   │   │   │   ├── stores/
│   │   │   │   │   └── accountStore.ts
│   │   │   │   └── types/
│   │   │   │       └── account.types.ts
│   │   │   │
│   │   │   ├── opportunities/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useOpportunities.ts
│   │   │   │   ├── services/
│   │   │   │   │   └── opportunityService.ts
│   │   │   │   ├── stores/
│   │   │   │   │   └── opportunityStore.ts
│   │   │   │   └── types/
│   │   │   │       └── opportunity.types.ts
│   │   │   │
│   │   │   ├── resources/
│   │   │   │   ├── services/
│   │   │   │   │   └── resourceService.ts
│   │   │   │   └── types/
│   │   │   │       └── resource.types.ts
│   │   │   │
│   │   │   └── collaboration/
│   │   │       ├── components/
│   │   │       ├── hooks/
│   │   │       │   └── useFeeds.ts
│   │   │       ├── services/
│   │   │       │   └── collaborationService.ts
│   │   │       └── types/
│   │   │           └── collaboration.types.ts
│   │   │
│   │   └── common/
│   │       ├── hooks/
│   │       │   ├── useQuery.ts (custom)
│   │       │   └── useLocalStorage.ts
│   │       ├── services/
│   │       │   └── apiService.ts
│   │       └── types/
│   │           ├── api.types.ts
│   │           └── common.types.ts
│   │
│   ├── lib/
│   │   ├── api.ts                 # API client config
│   │   ├── auth.ts                # Auth utilities
│   │   ├── format.ts              # Format utilities
│   │   ├── validation.ts          # Validation schemas
│   │   └── constants.ts           # App constants
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── variables.css
│   │
│   ├── types/
│   │   ├── api.ts
│   │   ├── sales.ts
│   │   └── common.ts
│   │
│   └── middleware.ts
│
├── public/
│   ├── icons/
│   └── logos/
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

### 핵심 컴포넌트 및 기능

#### Dashboard Page (`/dashboard`)
```tsx
// app/(main)/dashboard/page.tsx
- MetricsCard 섹션 (Performance KPIs)
- PipelineSummary 섹션 (Funnel + Trends)
- ActivityPanel 섹션 (Tasks, Meetings, Overdue)
- AccountsPanel 섹션 (At-risk, Top)
- LeaderboardPanel 섹션 (Rankings)

Features:
  - Real-time metrics
  - Customizable widgets
  - Export capabilities
  - Date range filtering
```

#### Accounts Page (`/accounts`)
```tsx
// app/(main)/accounts/page.tsx
- Account list with filters
- Search functionality
- Column sorting
- Bulk actions (export, tag)
- Account detail sidebar/modal

Detail Page:
  - Account profile
  - Contact hierarchy
  - Opportunity timeline
  - Activity history
  - Files & attachments
```

#### Opportunities Page (`/opportunities`)
```tsx
// app/(main)/opportunities/page.tsx
Views:
  1. Kanban board (by stage)
  2. Table view (with sorting/filtering)
  3. Analytics view (charts)
  4. Map view (account-centric)

Features:
  - Drag-and-drop stage changes
  - Quick edit capabilities
  - Inline probability/amount adjustment
  - Activity logging
```

#### Resources Page (`/resources`)
```tsx
// app/(main)/resources/page.tsx
- Document library browser
- Filter by type, industry, product
- Search functionality
- Download tracking
- Share capabilities
- Version management
```

#### Collaboration Page (`/collaboration`)
```tsx
// app/(main)/collaboration/page.tsx
Tabs:
  1. Team Feed
  2. Questions & Answers
  3. Approval Requests
  4. Best Practices

Features:
  - @mention notifications
  - File attachments
  - Rich text editor
  - Real-time updates
  - Comment threading
```

---

## 기술 스택

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts
- **Tables**: TanStack Table (React Table)
- **Forms**: React Hook Form + Zod
- **Date Handling**: date-fns
- **HTTP Client**: Axios
- **Type Safety**: TypeScript

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy 2.0
- **Auth**: JWT + RBAC
- **Cache**: Redis (optional)
- **Validation**: Pydantic

### Key Libraries
- **UI Components**: lucide-react (icons)
- **Utilities**: clsx, tailwind-merge
- **Testing**: Jest, React Testing Library
- **Linting**: ESLint, Prettier

---

## 구현 일정

### Phase 1: 기초 설정 (1주)
- [ ] 새 Next.js 프로젝트 생성 (`sales-web`)
- [ ] 기본 레이아웃 및 네비게이션 구성
- [ ] 인증 통합 (tenants-web 참고)
- [ ] 환경 설정 및 API 클라이언트 구성

### Phase 2: 대시보드 개발 (2주)
- [ ] 메트릭 컴포넌트 개발
- [ ] 차트 통합 (Recharts)
- [ ] API 엔드포인트 연동
- [ ] 대시보드 레이아웃 최적화

### Phase 3: 거래처/기회 관리 (2주)
- [ ] 계정 목록 페이지
- [ ] 계정 상세 페이지
- [ ] 기회 Kanban 보드
- [ ] 기회 상세 페이지
- [ ] 연락처 및 관계도

### Phase 4: 리소스 및 협업 (1주)
- [ ] 리소스/자료실 페이지
- [ ] 지식베이스 검색
- [ ] 협업 피드
- [ ] 승인 요청 기능

### Phase 5: 고급 기능 (1주)
- [ ] 실시간 업데이트 (WebSocket)
- [ ] 알림 시스템
- [ ] 내보내기 기능 (CSV/PDF)
- [ ] 맞춤형 필터 저장

### Phase 6: 최적화 및 배포 (1주)
- [ ] 성능 최적화
- [ ] 테스트 작성
- [ ] 문서화
- [ ] 배포 준비

**총 예상 소요 시간**: 8주

---

## 참고사항

### 기존 프로젝트 참고
- `tenants-web` - 포탈 구조 및 레이아웃 참고
- `manager-web` - 대시보드 및 분석 기능 참고
- API 인증/권한 시스템 - 기존 RBAC 활용

### 추후 개선사항
- AI 기반 거래 추천
- 예측 분석 (ML 모델)
- 음성 일정 기록
- 모바일 앱
- 앱 스토어 통합
- 외부 데이터 소스 연동

---

**문서 작성자**: Claude Code
**버전**: 1.0.0
**마지막 수정**: 2025-11-01
