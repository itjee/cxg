/**
 * Inventory Balance Types
 * 재고 현황 관련 타입 정의
 */

export interface InventoryBalance {
  id: string;
  warehouseId: string;
  locationId?: string;
  productId: string;
  variantId?: string;
  lotNo?: string;
  serialNo?: string;
  onHandQty: number;
  availableQty: number;
  reservedQty: number;
  avgCost: number;
  lastMoveAt?: string;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CreateInventoryBalanceRequest {
  warehouseId: string;
  locationId?: string;
  productId: string;
  variantId?: string;
  lotNo?: string;
  serialNo?: string;
  onHandQty?: number;
  avgCost?: number;
}

export interface UpdateInventoryBalanceRequest {
  locationId?: string;
  onHandQty?: number;
  avgCost?: number;
}

export interface InventoryBalanceListResponse {
  data: InventoryBalance[];
  total: number;
  page: number;
  pageSize: number;
}

export interface InventoryBalanceDetailResponse {
  data: InventoryBalance;
}

export type InventoryBalanceQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  warehouseId?: string;
  productId?: string;
  lotNo?: string;
};
