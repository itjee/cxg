/**
 * Support Ticket Types
 * 고객 지원 티켓 관련 타입 정의
 */

export interface SupportTicket {
  id: string;
  ticketCode: string;
  customerId: string;
  subject: string;
  description: string;
  category?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'RESOLVED' | 'CLOSED';
  assignedTo?: string;
  resolvedAt?: string;
  resolution?: string;
  isDeleted: boolean;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CreateSupportTicketRequest {
  customerId: string;
  subject: string;
  description: string;
  category?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export interface UpdateSupportTicketRequest {
  subject?: string;
  description?: string;
  category?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'RESOLVED' | 'CLOSED';
  assignedTo?: string;
  resolution?: string;
}

export interface SupportTicketListResponse {
  data: SupportTicket[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SupportTicketDetailResponse {
  data: SupportTicket;
}

export type SupportTicketQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  customerId?: string;
  assignedTo?: string;
};
