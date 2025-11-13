/**
 * Unit Types
 * 단위 관련 타입 정의
 */

export interface Unit {
  id: string;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateUnitRequest {
  code: string;
  name: string;
  description?: string;
}

export interface UpdateUnitRequest {
  code?: string;
  name?: string;
  description?: string;
  is_active?: boolean;
}

export interface UnitListResponse {
  data: Unit[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UnitDetailResponse {
  data: Unit;
}

export type UnitQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
};

export interface UnitStats {
  total: number;
  active: number;
  inactive: number;
  unitCount: number;
}
