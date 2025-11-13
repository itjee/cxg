/**
 * Inventory Serial Types
 * 재고 시리얼 관련 타입 정의
 */

export interface InventorySerial {
  id: string;
  serialNo: string;
  productId: string;
  variantId?: string;
  lotNo?: string;
  warehouseId?: string;
  locationId?: string;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'DEFECTIVE';
  notes?: string;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CreateInventorySerialRequest {
  serialNo: string;
  productId: string;
  variantId?: string;
  lotNo?: string;
  warehouseId?: string;
  locationId?: string;
  notes?: string;
}

export interface UpdateInventorySerialRequest {
  status?: 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'DEFECTIVE';
  warehouseId?: string;
  locationId?: string;
  notes?: string;
}

export interface InventorySerialListResponse {
  data: InventorySerial[];
  total: number;
  page: number;
  pageSize: number;
}

export interface InventorySerialDetailResponse {
  data: InventorySerial;
}

export type InventorySerialQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  productId?: string;
  status?: string;
  warehouseId?: string;
};
