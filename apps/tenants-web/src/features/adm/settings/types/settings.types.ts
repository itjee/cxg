/**
 * Setting Types
 * 설정정보 관련 타입 정의
 */

export type SettingValueType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';

export interface Setting {
  id: string;
  key: string;
  value: string;
  value_type: SettingValueType;
  default_value?: string;
  description?: string;
  category?: string;
  is_active: boolean;
  is_system?: boolean;
  is_encrypted?: boolean;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface CreateSettingRequest {
  key: string;
  value: string;
  value_type: SettingValueType;
  default_value?: string;
  description?: string;
  category?: string;
  is_active?: boolean;
  is_system?: boolean;
  is_encrypted?: boolean;
}

export interface UpdateSettingRequest {
  key?: string;
  value?: string;
  value_type?: SettingValueType;
  default_value?: string;
  description?: string;
  category?: string;
  is_active?: boolean;
  is_system?: boolean;
  is_encrypted?: boolean;
}

export interface SettingListResponse {
  items: Setting[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface SettingDetailResponse {
  data: Setting;
}

export type SettingQueryParams = {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  is_active?: boolean | null;
};

export interface SettingStats {
  total: number;
  active: number;
  inactive: number;
  byType: Record<SettingValueType, number>;
}
