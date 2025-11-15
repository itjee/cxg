import { useQuery } from "@apollo/client";
import {
  GET_DASHBOARD_STATS,
  GET_TENANT_GROWTH,
  GET_RECENT_ACTIVITIES,
  type GetDashboardStatsVariables,
  type GetTenantGrowthVariables,
  type GetRecentActivitiesVariables,
} from "../graphql";
import type { DashboardStats, TenantGrowthData, Activity } from "../types";

/**
 * 대시보드 통계 데이터 조회
 */
export function useDashboardStats(variables?: GetDashboardStatsVariables) {
  return useQuery<{ dashboard: DashboardStats }, GetDashboardStatsVariables>(
    GET_DASHBOARD_STATS,
    {
      variables,
      fetchPolicy: "cache-and-network",
    }
  );
}

/**
 * 테넌트 성장 데이터 조회
 */
export function useTenantGrowth(variables?: GetTenantGrowthVariables) {
  return useQuery<{ tenantGrowth: TenantGrowthData[] }, GetTenantGrowthVariables>(
    GET_TENANT_GROWTH,
    {
      variables: {
        period: "month",
        ...variables,
      },
      fetchPolicy: "cache-and-network",
    }
  );
}

/**
 * 최근 활동 로그 조회
 */
export function useRecentActivities(variables?: GetRecentActivitiesVariables) {
  return useQuery<{ activities: Activity[] }, GetRecentActivitiesVariables>(
    GET_RECENT_ACTIVITIES,
    {
      variables: {
        limit: 10,
        ...variables,
      },
      fetchPolicy: "network-only",
    }
  );
}
