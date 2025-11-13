# API Routes Quick Reference

## Pattern
```
/api/v1/{system}/{schema}/{entity}
```

## Manager System Routes

```
/api/v1/manager/
├── auth/                    # 인증
├── idam/                    # Identity & Access Management
│   ├── users
│   ├── roles
│   ├── permissions
│   ├── user-roles
│   ├── role-permissions
│   ├── sessions
│   ├── login-logs
│   └── api-keys
├── tnnt/                    # Tenant Management
│   ├── tenants
│   └── subscriptions
├── bill/                    # Billing
│   ├── plans
│   ├── invoices
│   └── transactions
├── ifra/                    # Infrastructure
│   ├── resources
│   └── resource-usages
├── mntr/                    # Monitoring
│   ├── system-metrics
│   ├── health-checks
│   └── incidents
├── audt/                    # Audit
│   ├── audit-logs
│   ├── policies
│   └── compliances
├── bkup/                    # Backup
│   ├── schedules
│   ├── executions
│   └── recovery-plans
├── cnfg/                    # Configuration
│   ├── configurations
│   ├── feature-flags
│   ├── tenant-features
│   └── service-quotas
├── intg/                    # Integration
│   ├── apis
│   ├── webhooks
│   └── rate-limits
├── noti/                    # Notification
│   ├── notifications
│   ├── templates
│   └── campaigns
├── supt/                    # Support
│   ├── tickets
│   ├── ticket-comments
│   └── feedbacks
├── stat/                    # Statistics
│   ├── usage-stats
│   └── tenant-stats
└── auto/                    # Automation
    ├── workflows
    ├── tasks
    └── executions
```

## Tenant System Routes

```
/api/v1/tenants/
├── adm/                     # Administration
│   └── users
├── csm/                     # Customer/CRM
│   ├── customers
│   ├── contacts
│   ├── opportunities
│   └── activities
├── fim/                     # Finance
│   ├── accounts
│   ├── transactions
│   ├── budgets
│   └── invoices
├── ivm/                     # Inventory
│   ├── products
│   ├── warehouses
│   ├── stock-movements
│   └── adjustments
├── psm/                     # Procurement
│   ├── purchase-orders
│   ├── vendors
│   ├── requisitions
│   └── receiving
├── srm/                     # Sales
│   ├── sales-orders
│   ├── quotes
│   ├── customers
│   └── sales-activities
└── lwm/                     # Workflow
    ├── workflows
    ├── approvals
    ├── tasks
    └── steps
```

## Schema Abbreviations

### Manager
- `auth` - Authentication
- `idam` - Identity & Access Management
- `tnnt` - Tenant
- `bill` - Billing
- `ifra` - Infrastructure
- `mntr` - Monitoring
- `audt` - Audit
- `bkup` - Backup
- `cnfg` - Configuration
- `intg` - Integration
- `noti` - Notification
- `supt` - Support
- `stat` - Statistics
- `auto` - Automation

### Tenant
- `adm` - Administration
- `csm` - Customer/CRM
- `fim` - Finance
- `ivm` - Inventory
- `psm` - Procurement
- `srm` - Sales
- `lwm` - Workflow

## Common Operations

### Authentication
```bash
POST /api/v1/manager/auth/login
POST /api/v1/manager/auth/logout
POST /api/v1/manager/auth/refresh
```

### CRUD Pattern
```bash
GET    /api/v1/{system}/{schema}/{entity}           # List
POST   /api/v1/{system}/{schema}/{entity}           # Create
GET    /api/v1/{system}/{schema}/{entity}/{id}      # Read
PUT    /api/v1/{system}/{schema}/{entity}/{id}      # Update
DELETE /api/v1/{system}/{schema}/{entity}/{id}      # Delete
```

## Documentation
- Swagger UI: http://localhost:8100/docs
- ReDoc: http://localhost:8100/redoc
