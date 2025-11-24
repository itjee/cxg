# Tenant Portal Architecture

## Overview

The Tenant Portal is a comprehensive management interface for viewing and managing tenant-related data. It provides a unified dashboard for monitoring connected users, roles, onboarding progress, subscriptions, billing, and revenue data.

## Directory Structure

```
tenant-portal/
├── components/           # UI Components
│   ├── tenant-portal-header.tsx       # Header with tenant selector
│   ├── tenant-info-section.tsx        # Business info display
│   ├── tenant-portal-tabs.tsx         # Main tab container
│   ├── tabs/
│   │   ├── users-tab.tsx              # Connected users list
│   │   ├── roles-tab.tsx              # User roles
│   │   ├── onboarding-tab.tsx         # Onboarding process steps
│   │   ├── subscriptions-tab.tsx      # Subscription details
│   │   ├── billing-tab.tsx            # Invoices & transactions
│   │   └── revenue-tab.tsx            # Revenue & sales metrics
│   └── index.ts
├── hooks/                # GraphQL Hooks
│   ├── use-tenant-basic.ts
│   ├── use-tenants-selector.ts
│   ├── use-tenant-users.ts
│   ├── use-tenant-roles.ts
│   ├── use-tenant-onboarding.ts
│   ├── use-tenant-subscriptions.ts
│   ├── use-tenant-invoices.ts
│   ├── use-tenant-transactions.ts
│   ├── use-tenant-revenue.ts
│   ├── use-update-tenant-info.ts
│   └── index.ts
├── graphql/              # GraphQL Queries & Mutations
│   ├── queries.ts        # GET_ queries
│   ├── mutations.ts      # UPDATE_ mutations
│   └── index.ts
├── stores/               # Zustand State Management
│   ├── tenant-portal.store.ts
│   └── index.ts
├── types/                # TypeScript Types
│   ├── tenant-portal.types.ts
│   └── index.ts
├── index.ts              # Barrel export
└── ARCHITECTURE.md       # This file
```

## Page Location

**Route**: `/tenant-portal`
**File**: `/apps/manager-web/src/app/(main)/tenant-portal/page.tsx`

## Key Features

### 1. Tenant Selector
- Dropdown to switch between tenants
- Shows tenant name and code
- All data updates when tenant changes
- Maintains selection in Zustand store

### 2. Tenant Information Section
- Displays comprehensive business information:
  - Tenant name and code
  - Business name (상호) and registration number (사업자번호)
  - Representative name (대표자명)
  - Business type (구분: 법인/개인)
  - Address and phone number
  - Contract period (시작일/종료일)
  - Employee count
  - Tenant type (TRIAL/STANDARD/PREMIUM/ENTERPRISE)

### 3. Tabbed Interface

#### Users Tab
- Connected users overview
- Shows user details: name, email, phone, username
- Displays roles, departments, positions
- Indicators for primary users and admin status
- User status badges (ACTIVE/INACTIVE/SUSPENDED/LEFT)

#### Roles Tab
- List of roles used in tenant
- Shows role code, name, description
- Displays permission count
- Category and level information
- System role indicators

#### Onboarding Tab
- Onboarding process step tracking
- Visual status indicators:
  - ✓ Completed
  - ⟳ In Progress
  - ⏱️ Pending
  - ⚠️ Failed
  - ⊘ Skipped
- Step timing (started_at, completed_at)
- Retry counts and error messages
- Step data display

#### Subscriptions Tab
- Active subscription details
- Plan name, type, and description
- Billing cycle and pricing
- Usage limits with visual progress bars:
  - Max users
  - Max storage (GB)
  - Max API calls
- Auto-renewal settings
- Subscription status

#### Billing Tab
- **Invoices Sub-Tab**:
  - Invoice list with detailed breakdown
  - Shows base amount, usage amount, taxes
  - Invoice status (PENDING/SENT/PAID/OVERDUE)
  - Billing period information
  - Payment date tracking

- **Transactions Sub-Tab**:
  - Payment transaction history
  - Gateway integration details (Stripe, PayPal, etc.)
  - Payment method (card, bank transfer, etc.)
  - Transaction status and failure reasons
  - Processed date tracking

#### Revenue Tab
- Revenue statistics cards:
  - Total revenue
  - Total paid
  - Pending payments
  - Overdue amounts
- Invoice statistics:
  - Total invoices
  - Paid invoice count with completion rate
  - Overdue invoice count
  - Average invoice amount
- Revenue summary:
  - Collection rate percentage
  - Accounts receivable
  - Overdue amounts

## State Management

### Zustand Store (`tenant-portal.store.ts`)

```typescript
interface TenantPortalStore {
  // State
  selectedTenantId: string | null;
  activeTab: TenantPortalTab;
  expandedSections: Record<string, boolean>;

  // Actions
  setSelectedTenantId: (tenantId: string) => void;
  setActiveTab: (tab: TenantPortalTab) => void;
  toggleSection: (sectionId: string) => void;
  expandSection: (sectionId: string) => void;
  collapseSection: (sectionId: string) => void;
  reset: () => void;
}
```

**Usage**:
```typescript
const { selectedTenantId, activeTab, setSelectedTenantId, setActiveTab } =
  useTenantPortalStore();
```

## GraphQL Integration

### Queries

1. **GET_TENANT_BASIC** - Single tenant details
2. **GET_TENANTS_FOR_SELECTOR** - All tenants for dropdown
3. **GET_TENANT_USERS** - Connected users
4. **GET_TENANT_ROLES** - Tenant roles
5. **GET_TENANT_ONBOARDING** - Onboarding steps
6. **GET_TENANT_SUBSCRIPTIONS** - Subscription details
7. **GET_TENANT_INVOICES** - Invoice history
8. **GET_TENANT_TRANSACTIONS** - Payment transactions
9. **GET_TENANT_REVENUE** - Revenue metrics

### Mutations

1. **UPDATE_TENANT_INFO** - Update tenant information
2. **ADD_TENANT_USER** - Add user to tenant
3. **UPDATE_TENANT_USER** - Update tenant user
4. **REMOVE_TENANT_USER** - Remove user from tenant
5. **UPDATE_TENANT_SUBSCRIPTION** - Update subscription
6. **UPDATE_INVOICE_STATUS** - Mark invoice as paid
7. **UPDATE_ONBOARDING_STEP** - Update onboarding step

## Hook Usage

### Fetching Data

```typescript
// Basic tenant info
const { data: tenantData, loading } = useTenantBasic(tenantId);

// All tenants for selector
const { data: tenantsData } = useTenantsForSelector();

// Users connected to tenant
const { data: usersData } = useTenantUsers(tenantId);

// Invoices with filtering
const { data: invoicesData } = useTenantInvoices(tenantId, {
  status: "PAID",
  startDate: "2024-01-01"
});
```

### Updating Data

```typescript
const [updateTenant, { loading }] = useUpdateTenantInfo();

await updateTenant({
  variables: {
    id: tenantId,
    input: { name: "New Name" }
  }
});
```

## Data Flow

```
┌─────────────────────────────────────────────────┐
│   Tenant Portal Page (page.tsx)                 │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  Store: selectedTenantId, activeTab      │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│   TenantPortalHeader (Dropdown)                 │
│   → Triggers setSelectedTenantId()              │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│   All Hooks Re-run with new tenantId            │
│   ├─ useTenantBasic()                           │
│   ├─ useTenantUsers()                           │
│   ├─ useTenantRoles()                           │
│   ├─ useTenantSubscriptions()                   │
│   ├─ useTenantInvoices()                        │
│   └─ useTenantRevenue()                         │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│   Components Re-render with New Data            │
│   ├─ TenantInfoSection                          │
│   ├─ TenantPortalTabs                           │
│   └─ All Tab Components                         │
└─────────────────────────────────────────────────┘
```

## Type Definitions

All types are defined in `types/tenant-portal.types.ts`:

- `TenantPortalTab` - Union type for tab names
- `TenantUser` - User-tenant relationship
- `TenantRole` - Role information
- `OnboardingStep` - Onboarding process step
- `TenantSubscription` - Subscription details
- `Invoice` - Invoice record
- `Transaction` - Payment transaction
- `TenantPortalResponse` - Aggregated response type

## Error Handling

The page includes error handling for:
- Failed tenant list fetch
- Failed tenant detail fetch
- GraphQL errors for each data type
- Missing or null data states

Error states display user-friendly messages with suggestions to retry.

## Loading States

Each component and data section shows appropriate loading indicators:
- Skeleton loaders for card-based layouts
- Animated pulse effects for text areas
- Loading states in tabs

## Performance Considerations

1. **Selective Data Fetching**: Only fetch data for the selected tenant
2. **Memoization**: Components memoized where appropriate
3. **Skip on Empty ID**: Hooks skip execution when tenant ID is not set
4. **Error Policy**: Apollo error policy set to "all" for graceful handling

## Future Enhancements

1. **Inline Editing**: Edit tenant info directly in portal
2. **Export Data**: Export invoices and reports
3. **Advanced Filtering**: Filter by date ranges, status, etc.
4. **Real-time Updates**: WebSocket subscriptions for live data
5. **Analytics Charts**: Visual charts for revenue trends
6. **User Management Actions**: Add/remove users from portal
7. **Role Management**: Create/edit roles in portal
8. **Subscription Upgrade/Downgrade**: Change plans from portal

## Testing

### Unit Tests
- Component rendering tests
- Hook functionality tests
- Store actions tests

### Integration Tests
- Tab switching
- Tenant selection
- Data fetching and updates
- Error state handling

### E2E Tests
- Full user flow from tenant selection to data viewing
- Filter and sorting operations
- Navigation between tabs

## Related Documentation

- See `/features/tnnt/tenants/` for tenant management
- See `/features/idam/` for user and role management
- See `/features/bill/` for billing and invoice details
