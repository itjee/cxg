/**
 * AssetDepreciation Types
 * 감가상각 관련 타입 정의
 */

export interface AssetDepreciation {
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

export interface CreateAssetDepreciationRequest {
  name: string;
  asset_code?: string;
  description?: string;
  acquisition_cost?: number;
  location?: string;
  acquisition_date?: string;
}

export interface UpdateAssetDepreciationRequest {
  name?: string;
  asset_code?: string;
  description?: string;
  acquisition_cost?: number;
  location?: string;
  status?: 'ACTIVE' | 'DISPOSED' | 'MAINTENANCE';
  disposal_date?: string;
}

export interface AssetDepreciationListResponse {
  data: AssetDepreciation[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AssetDepreciationDetailResponse {
  data: AssetDepreciation;
}

export type AssetDepreciationQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'ACTIVE' | 'DISPOSED' | 'MAINTENANCE';
};
