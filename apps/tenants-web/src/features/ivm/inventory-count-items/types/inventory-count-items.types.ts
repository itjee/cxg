/**
 * Inventory Count Item Types
 * 재고 실사 항목 관련 타입 정의
 */

export interface InventoryCountItem {
  id: string;
  countId: string;
  productId: string;
  variantId?: string;
  lotNo?: string;
  serialNo?: string;
  systemQty: number;
  countedQty: number;
  differenceQty: number;
  notes?: string;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CreateInventoryCountItemRequest {
  countId: string;
  productId: string;
  variantId?: string;
  lotNo?: string;
  serialNo?: string;
  systemQty: number;
  countedQty: number;
  notes?: string;
}

export interface UpdateInventoryCountItemRequest {
  countedQty?: number;
  notes?: string;
}

export interface InventoryCountItemListResponse {
  data: InventoryCountItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface InventoryCountItemDetailResponse {
  data: InventoryCountItem;
}

export type InventoryCountItemQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  countId?: string;
  productId?: string;
};
