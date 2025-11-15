// Components
export * from "./components";

// Hooks
export { useDashboardStats, useTenantGrowth, useRecentActivities } from "./hooks";

// Stores
export { useDashboardStore } from "./stores";

// Types
export type {
  User,
  DashboardStats,
  TenantGrowthData,
  Activity,
  DashboardStatCard,
  DashboardResponse,
} from "./types";

// GraphQL
export {
  GET_DASHBOARD_STATS,
  GET_TENANT_GROWTH,
  GET_RECENT_ACTIVITIES,
  type GetDashboardStatsVariables,
  type GetTenantGrowthVariables,
  type GetRecentActivitiesVariables,
} from "./graphql";
