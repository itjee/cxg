/**
 * FixedAssets Types
 * 고정자산 관련 타입 정의
 */

export interface FixedAssets {
  id: string;
  name: string;
  asset_code?: string;
  description?: string;
  acquisition_cost?: number;
  accumulated_depreciation?: number;
  book_value?: number;
  location?: string;
  status: 'ACTIVE' | 'DISPOSED' | 'MAINTENANCE';
  acquisition_date?: string;
  disposal_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateFixedAssetsRequest {
  name: string;
  asset_code?: string;
  description?: string;
  acquisition_cost?: number;
  location?: string;
  acquisition_date?: string;
}

export interface UpdateFixedAssetsRequest {
  name?: string;
  asset_code?: string;
  description?: string;
  acquisition_cost?: number;
  location?: string;
  status?: 'ACTIVE' | 'DISPOSED' | 'MAINTENANCE';
  disposal_date?: string;
}

export interface FixedAssetsListResponse {
  data: FixedAssets[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FixedAssetsDetailResponse {
  data: FixedAssets;
}

export type FixedAssetsQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'ACTIVE' | 'DISPOSED' | 'MAINTENANCE';
};
