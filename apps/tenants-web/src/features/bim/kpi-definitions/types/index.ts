/**
 * KpiDefinitions Types
 * KPI 정의 관련 타입 정의
 */

export interface KpiDefinitions {
  id: string;
  name: string;
  description?: string;
  value?: number;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateKpiDefinitionsRequest {
  name: string;
  description?: string;
  value?: number;
}

export interface UpdateKpiDefinitionsRequest {
  name?: string;
  description?: string;
  value?: number;
  active?: boolean;
}

export interface KpiDefinitionsListResponse {
  data: KpiDefinitions[];
  total: number;
  page: number;
  pageSize: number;
}

export interface KpiDefinitionsDetailResponse {
  data: KpiDefinitions;
}

export type KpiDefinitionsQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  active?: boolean;
};
