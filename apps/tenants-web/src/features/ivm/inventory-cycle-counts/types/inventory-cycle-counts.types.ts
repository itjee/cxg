/**
 * Inventory Cycle Count Types
 * 순환 재고 실사 관련 타입 정의
 */

export interface InventoryCycleCount {
  id: string;
  cycleCode: string;
  cycleName: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  warehouseId: string;
  locationId?: string;
  productCategory?: string;
  lastCountDate?: string;
  nextCountDate?: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CreateInventoryCycleCountRequest {
  cycleName: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  warehouseId: string;
  locationId?: string;
  productCategory?: string;
  nextCountDate?: string;
  notes?: string;
}

export interface UpdateInventoryCycleCountRequest {
  cycleName?: string;
  frequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  nextCountDate?: string;
  isActive?: boolean;
  notes?: string;
}

export interface InventoryCycleCountListResponse {
  data: InventoryCycleCount[];
  total: number;
  page: number;
  pageSize: number;
}

export interface InventoryCycleCountDetailResponse {
  data: InventoryCycleCount;
}

export type InventoryCycleCountQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  frequency?: string;
  warehouseId?: string;
  isActive?: boolean;
};
