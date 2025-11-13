/**
 * Inventory Lot Types
 * 재고 로트 관련 타입 정의
 */

export interface InventoryLot {
  id: string;
  lotNo: string;
  productId: string;
  variantId?: string;
  manufactureDate?: string;
  expiryDate?: string;
  receivedDate?: string;
  supplierId?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CreateInventoryLotRequest {
  lotNo: string;
  productId: string;
  variantId?: string;
  manufactureDate?: string;
  expiryDate?: string;
  receivedDate?: string;
  supplierId?: string;
  notes?: string;
}

export interface UpdateInventoryLotRequest {
  manufactureDate?: string;
  expiryDate?: string;
  notes?: string;
  isActive?: boolean;
}

export interface InventoryLotListResponse {
  data: InventoryLot[];
  total: number;
  page: number;
  pageSize: number;
}

export interface InventoryLotDetailResponse {
  data: InventoryLot;
}

export type InventoryLotQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  productId?: string;
  isActive?: boolean;
};
