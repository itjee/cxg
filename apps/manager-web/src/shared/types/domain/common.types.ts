// Common types used across the application

export interface EnvelopeResponse<T> {
  success: boolean;
  data: T | null;
  error: ErrorDetail | null;
}

export interface ErrorDetail {
  code: string;
  message: string;
  detail?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Tenant {
  id: string;
  name: string;
  code: string;
  status: TenantStatus;
  subscriptionTier: string;
  createdAt: string;
  updatedAt?: string;
}

export type TenantStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "TRIAL";

export interface DashboardPanel {
  id: string;
  title: string;
  type: PanelType;
  gridPos: GridPosition;
  data?: unknown;
}

export type PanelType = "graph" | "stat" | "table" | "gauge" | "heatmap";

export interface GridPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  children?: MenuItem[];
  badge?: string | number;
}
