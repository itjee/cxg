/**
 * Inventory Adjustment Types
 * 재고 조정 관련 타입 정의
 */

export interface InventoryAdjustment {
  id: string;
  adjustmentCode: string;
  adjustmentDate: string;
  adjustmentType: 'INCREASE' | 'DECREASE' | 'CORRECTION';
  warehouseId: string;
  locationId?: string;
  productId: string;
  variantId?: string;
  lotNo?: string;
  serialNo?: string;
  qtyBefore: number;
  qtyAdjusted: number;
  qtyAfter: number;
  reason?: string;
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CreateInventoryAdjustmentRequest {
  adjustmentDate: string;
  adjustmentType: 'INCREASE' | 'DECREASE' | 'CORRECTION';
  warehouseId: string;
  locationId?: string;
  productId: string;
  variantId?: string;
  lotNo?: string;
  serialNo?: string;
  qtyAdjusted: number;
  reason?: string;
  notes?: string;
}

export interface UpdateInventoryAdjustmentRequest {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes?: string;
}

export interface InventoryAdjustmentListResponse {
  data: InventoryAdjustment[];
  total: number;
  page: number;
  pageSize: number;
}

export interface InventoryAdjustmentDetailResponse {
  data: InventoryAdjustment;
}

export type InventoryAdjustmentQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  adjustmentType?: string;
  status?: string;
  warehouseId?: string;
  productId?: string;
};
