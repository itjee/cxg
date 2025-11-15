import { gql } from "@apollo/client";

/**
 * Dashboard 통계 데이터 조회
 */
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboard {
      totalTenants
      totalUsers
      totalSessions
      systemStatus
      todayActivities
    }
  }
`;

/**
 * 테넌트 성장 데이터 조회 (차트용)
 */
export const GET_TENANT_GROWTH = gql`
  query GetTenantGrowth($period: String = "month") {
    tenantGrowth(period: $period) {
      date
      count
      newTenants
    }
  }
`;

/**
 * 최근 활동 로그 조회
 */
export const GET_RECENT_ACTIVITIES = gql`
  query GetRecentActivities($limit: Int = 10) {
    activities(limit: $limit, orderBy: "createdAt") {
      id
      action
      description
      actor {
        id
        username
        fullName
      }
      createdAt
    }
  }
`;

/**
 * 쿼리 변수 타입
 */
export interface GetDashboardStatsVariables {}

export interface GetTenantGrowthVariables {
  period?: "day" | "week" | "month" | "year";
}

export interface GetRecentActivitiesVariables {
  limit?: number;
}
