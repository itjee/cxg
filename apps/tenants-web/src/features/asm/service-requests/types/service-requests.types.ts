/**
 * Service Request Types
 * A/S 요청 관련 타입 정의
 */

export interface ServiceRequest {
  id: string;
  srCode: string;
  customerId: string;
  productId?: string;
  serialNo?: string;
  purchaseDate?: string;
  warrantyEndDate?: string;
  isWarranty: boolean;
  issueDescription: string;
  issueCategory?: string;
  serviceType: 'REPAIR' | 'REPLACE' | 'MAINTENANCE' | 'INSPECTION';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'RECEIVED' | 'DIAGNOSED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED' | 'CANCELLED';
  assignedTechnicianId?: string;
  scheduledDate?: string;
  expectedCompletionDate?: string;
  completedAt?: string;
  estimatedCost: number;
  actualCost: number;
  currency: string;
  customerNotes?: string;
  technicianNotes?: string;
  isDeleted: boolean;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CreateServiceRequestRequest {
  customerId: string;
  productId?: string;
  serialNo?: string;
  purchaseDate?: string;
  warrantyEndDate?: string;
  issueDescription: string;
  issueCategory?: string;
  serviceType?: 'REPAIR' | 'REPLACE' | 'MAINTENANCE' | 'INSPECTION';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  customerNotes?: string;
}

export interface UpdateServiceRequestRequest {
  customerId?: string;
  productId?: string;
  serialNo?: string;
  issueDescription?: string;
  issueCategory?: string;
  serviceType?: 'REPAIR' | 'REPLACE' | 'MAINTENANCE' | 'INSPECTION';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: 'RECEIVED' | 'DIAGNOSED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED' | 'CANCELLED';
  assignedTechnicianId?: string;
  scheduledDate?: string;
  expectedCompletionDate?: string;
  estimatedCost?: number;
  actualCost?: number;
  customerNotes?: string;
  technicianNotes?: string;
}

export interface ServiceRequestListResponse {
  data: ServiceRequest[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ServiceRequestDetailResponse {
  data: ServiceRequest;
}

export type ServiceRequestQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  serviceType?: string;
  priority?: string;
  customerId?: string;
  assignedTechnicianId?: string;
};
