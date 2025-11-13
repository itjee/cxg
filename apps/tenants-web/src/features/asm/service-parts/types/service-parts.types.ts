/**
 * Service Part Types
 * A/S 부품 사용 내역 관련 타입 정의
 */

export interface ServicePart {
  id: string;
  serviceRequestId: string;
  productId: string;
  partName?: string;
  partCode?: string;
  serialNo?: string;
  qty: number;
  unitCost: number;
  totalCost: number;
  partCondition?: 'NEW' | 'REFURBISHED' | 'USED';
  warrantyMonths?: number;
  notes?: string;
  isDeleted: boolean;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CreateServicePartRequest {
  serviceRequestId: string;
  productId: string;
  partName?: string;
  partCode?: string;
  serialNo?: string;
  qty: number;
  unitCost: number;
  partCondition?: 'NEW' | 'REFURBISHED' | 'USED';
  warrantyMonths?: number;
  notes?: string;
}

export interface UpdateServicePartRequest {
  productId?: string;
  partName?: string;
  partCode?: string;
  serialNo?: string;
  qty?: number;
  unitCost?: number;
  partCondition?: 'NEW' | 'REFURBISHED' | 'USED';
  warrantyMonths?: number;
  notes?: string;
}

export interface ServicePartListResponse {
  data: ServicePart[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ServicePartDetailResponse {
  data: ServicePart;
}

export type ServicePartQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  serviceRequestId?: string;
  productId?: string;
  partCondition?: string;
};
