/**
 * Service Work Types
 * A/S 작업 내역 관련 타입 정의
 */

export interface ServiceWork {
  id: string;
  serviceRequestId: string;
  workDate: string;
  technicianId: string;
  workDescription: string;
  workStartTime?: string;
  workEndTime?: string;
  laborHours: number;
  laborCost: number;
  partsCost: number;
  otherCost: number;
  totalCost: number;
  workResult?: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  resultNotes?: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  isDeleted: boolean;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CreateServiceWorkRequest {
  serviceRequestId: string;
  workDate: string;
  technicianId: string;
  workDescription: string;
  workStartTime?: string;
  workEndTime?: string;
  laborHours?: number;
  laborCost?: number;
  partsCost?: number;
  otherCost?: number;
}

export interface UpdateServiceWorkRequest {
  workDate?: string;
  technicianId?: string;
  workDescription?: string;
  workStartTime?: string;
  workEndTime?: string;
  laborHours?: number;
  laborCost?: number;
  partsCost?: number;
  otherCost?: number;
  workResult?: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  resultNotes?: string;
  status?: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface ServiceWorkListResponse {
  data: ServiceWork[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ServiceWorkDetailResponse {
  data: ServiceWork;
}

export type ServiceWorkQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  serviceRequestId?: string;
  technicianId?: string;
  status?: string;
  workResult?: string;
};
