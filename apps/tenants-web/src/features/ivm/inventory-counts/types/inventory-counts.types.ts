/**
 * Inventory Count Types
 * 재고 실사 관련 타입 정의
 */

export interface InventoryCount {
  id: string;
  countCode: string;
  countDate: string;
  countType: 'FULL' | 'CYCLE' | 'SPOT';
  warehouseId: string;
  locationId?: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startedAt?: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CreateInventoryCountRequest {
  countDate: string;
  countType: 'FULL' | 'CYCLE' | 'SPOT';
  warehouseId: string;
  locationId?: string;
  notes?: string;
}

export interface UpdateInventoryCountRequest {
  status?: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startedAt?: string;
  completedAt?: string;
  notes?: string;
}

export interface InventoryCountListResponse {
  data: InventoryCount[];
  total: number;
  page: number;
  pageSize: number;
}

export interface InventoryCountDetailResponse {
  data: InventoryCount;
}

export type InventoryCountQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  countType?: string;
  status?: string;
  warehouseId?: string;
};
