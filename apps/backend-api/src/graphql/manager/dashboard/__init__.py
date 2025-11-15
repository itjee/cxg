"""Manager Dashboard Module

Dashboard 관련 GraphQL 컴포넌트를 제공합니다.
"""

from .queries import DashboardQueries
from .types import Activity, DashboardStats, TenantGrowthData, User

__all__ = [
    "DashboardQueries",
    "DashboardStats",
    "TenantGrowthData",
    "Activity",
    "User",
]
