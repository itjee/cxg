"""관리자 시스템 모델"""

# IDAM (Identity & Access Management)
# AUDT (Audit)
from .audt import (
    AuditLogs,
    Compliances,
    Policies,
)

# AUTO (Automation)
from .auto import (
    Executions,
    Tasks,
    Workflows,
)

# BILL (Billing)
from .bill import (
    Invoices,
    Plans,
    Transactions,
)

# BKUP (Backup)
from .bkup import (
    Executions as BackupExecutions,
)
from .bkup import (
    RecoveryPlans,
    Schedules,
)

# CNFG (Configuration)
from .cnfg import (
    Configurations,
    FeatureFlags,
    ServiceQuotas,
    TenantFeatures,
)
from .idam import (
    ApiKey,
    LoginLog,
    Permission,
    Role,
    RolePermission,
    Session,
    User,
    UserRole,
)

# IFRA (Infrastructure)
from .ifra import (
    Resources,
    ResourceUsages,
)

# INTG (Integration)
from .intg import (
    Apis,
    RateLimits,
    Webhooks,
)

# MNTR (Monitoring)
from .mntr import (
    HealthChecks,
    Incidents,
    SystemMetrics,
)

# NOTI (Notification)
from .noti import (
    Campaigns,
    Notifications,
    Templates,
)

# STAT (Statistics)
from .stat import (
    TenantStats,
    UsageStats,
)

# SUPT (Support)
from .supt import (
    Feedbacks,
    TicketComments,
    Tickets,
)

# TNNT (Tenant Management)
from .tnnt import (
    Subscription,
    Tenant,
)


__all__ = [
    # IDAM
    "User",
    "Permission",
    "Role",
    "RolePermission",
    "UserRole",
    "ApiKey",
    "Session",
    "LoginLog",
    # TNNT
    "Tenant",
    "Subscription",
    # AUDT
    "AuditLogs",
    "Compliances",
    "Policies",
    # AUTO
    "Workflows",
    "Executions",
    "Tasks",
    # BILL
    "Plans",
    "Invoices",
    "Transactions",
    # BKUP
    "BackupExecutions",
    "Schedules",
    "RecoveryPlans",
    # CNFG
    "Configurations",
    "FeatureFlags",
    "TenantFeatures",
    "ServiceQuotas",
    # IFRA
    "Resources",
    "ResourceUsages",
    # INTG
    "Apis",
    "Webhooks",
    "RateLimits",
    # MNTR
    "HealthChecks",
    "Incidents",
    "SystemMetrics",
    # NOTI
    "Notifications",
    "Templates",
    "Campaigns",
    # STAT
    "TenantStats",
    "UsageStats",
    # SUPT
    "Tickets",
    "TicketComments",
    "Feedbacks",
]
