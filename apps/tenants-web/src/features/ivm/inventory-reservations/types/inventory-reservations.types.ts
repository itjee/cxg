/**
 * Inventory Reservation Types
 * 재고 예약 관련 타입 정의
 */

export interface InventoryReservation {
  id: string;
  reservationCode: string;
  reservationDate: string;
  warehouseId: string;
  locationId?: string;
  productId: string;
  variantId?: string;
  lotNo?: string;
  serialNo?: string;
  reservedQty: number;
  refType?: string;
  refId?: string;
  refCode?: string;
  expiresAt?: string;
  releasedAt?: string;
  notes?: string;
  status: 'ACTIVE' | 'RELEASED' | 'EXPIRED';
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CreateInventoryReservationRequest {
  reservationDate: string;
  warehouseId: string;
  locationId?: string;
  productId: string;
  variantId?: string;
  lotNo?: string;
  serialNo?: string;
  reservedQty: number;
  refType?: string;
  refId?: string;
  refCode?: string;
  expiresAt?: string;
  notes?: string;
}

export interface UpdateInventoryReservationRequest {
  status?: 'ACTIVE' | 'RELEASED' | 'EXPIRED';
  releasedAt?: string;
  notes?: string;
}

export interface InventoryReservationListResponse {
  data: InventoryReservation[];
  total: number;
  page: number;
  pageSize: number;
}

export interface InventoryReservationDetailResponse {
  data: InventoryReservation;
}

export type InventoryReservationQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  warehouseId?: string;
  productId?: string;
};
