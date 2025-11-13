/**
 * Inventory Movement Types
 * 재고 이동 내역 관련 타입 정의
 */

export interface InventoryMovement {
  id: string;
  movementCode: string;
  movementDate: string;
  movementType: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  warehouseId: string;
  locationId?: string;
  productId: string;
  variantId?: string;
  lotNo?: string;
  serialNo?: string;
  qty: number;
  unitCost: number;
  totalCost: number;
  refType?: string;
  refId?: string;
  refCode?: string;
  notes?: string;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CreateInventoryMovementRequest {
  movementDate: string;
  movementType: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  warehouseId: string;
  locationId?: string;
  productId: string;
  variantId?: string;
  lotNo?: string;
  serialNo?: string;
  qty: number;
  unitCost: number;
  refType?: string;
  refId?: string;
  refCode?: string;
  notes?: string;
}

export interface UpdateInventoryMovementRequest {
  notes?: string;
}

export interface InventoryMovementListResponse {
  data: InventoryMovement[];
  total: number;
  page: number;
  pageSize: number;
}

export interface InventoryMovementDetailResponse {
  data: InventoryMovement;
}

export type InventoryMovementQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  movementType?: string;
  warehouseId?: string;
  productId?: string;
};
