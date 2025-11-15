/**
 * Dashboard GraphQL 타입 정의
 */

// 사용자 기본 정보
export interface User {
  id: string;
  username: string;
  fullName: string;
}

// 대시보드 통계
export interface DashboardStats {
  totalTenants: number;
  totalUsers: number;
  totalSessions: number;
  systemStatus: "HEALTHY" | "WARNING" | "CRITICAL";
  todayActivities: number;
}

// 테넌트 성장 데이터
export interface TenantGrowthData {
  date: string;
  count: number;
  newTenants: number;
}

// 최근 활동 로그
export interface Activity {
  id: string;
  action: string;
  description: string;
  actor: User;
  createdAt: string;
}

// 통계 카드 데이터 (UI 표시용)
export interface DashboardStatCard {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: "primary" | "success" | "warning" | "danger" | "default";
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
}

// Dashboard 응답
export interface DashboardResponse {
  dashboard: DashboardStats;
  tenantGrowth: TenantGrowthData[];
  activities: Activity[];
}
