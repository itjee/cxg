/**
 * Inventory Transfer Types
 * 재고 이동 요청 관련 타입 정의
 */

export interface InventoryTransfer {
  id: string;
  transferCode: string;
  transferDate: string;
  fromWarehouseId: string;
  fromLocationId?: string;
  toWarehouseId: string;
  toLocationId?: string;
  productId: string;
  lotNo?: string;
  serialNo?: string;
  qty: number;
  startedAt?: string;
  completedAt?: string;
  reason?: string;
  notes?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CreateInventoryTransferRequest {
  transferDate: string;
  fromWarehouseId: string;
  fromLocationId?: string;
  toWarehouseId: string;
  toLocationId?: string;
  productId: string;
  lotNo?: string;
  serialNo?: string;
  qty: number;
  reason?: string;
  notes?: string;
}

export interface UpdateInventoryTransferRequest {
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startedAt?: string;
  completedAt?: string;
  notes?: string;
}

export interface InventoryTransferListResponse {
  data: InventoryTransfer[];
  total: number;
  page: number;
  pageSize: number;
}

export interface InventoryTransferDetailResponse {
  data: InventoryTransfer;
}

export type InventoryTransferQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  productId?: string;
};
