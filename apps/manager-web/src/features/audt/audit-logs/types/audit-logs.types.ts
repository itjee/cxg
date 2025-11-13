export type EventType = 
  | 'LOGIN' 
  | 'LOGOUT' 
  | 'API_CALL' 
  | 'DATA_ACCESS' 
  | 'ADMIN_ACTION' 
  | 'PASSWORD_CHANGE' 
  | 'PERMISSION_CHANGE';

export type EventCategory = 
  | 'AUTHENTICATION' 
  | 'AUTHORIZATION' 
  | 'DATA_MODIFICATION' 
  | 'SYSTEM_CHANGE' 
  | 'SECURITY_VIOLATION';

export type ResourceType = 
  | 'TABLE' 
  | 'API_ENDPOINT' 
  | 'FILE' 
  | 'CONFIGURATION' 
  | 'USER_ACCOUNT' 
  | 'TENANT_SETTINGS';

export type ActionPerformed = 
  | 'CREATE' 
  | 'READ' 
  | 'UPDATE' 
  | 'DELETE' 
  | 'EXECUTE' 
  | 'LOGIN' 
  | 'LOGOUT';

export type AuditResult = 'SUCCESS' | 'FAILURE' | 'BLOCKED';

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type AuditStatus = 'ACTIVE' | 'ARCHIVED' | 'PURGED';

export interface AuditLog {
  id: string;
  created_at: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  
  tenant_id?: string;
  user_id?: string;
  
  event_type: EventType;
  event_category: EventCategory;
  description: string;
  
  source_ip?: string;
  user_agent?: string;
  session_id?: string;
  
  resource?: ResourceType;
  resource_id?: string;
  action_performed?: ActionPerformed;
  
  result: AuditResult;
  failure_reason?: string;
  risk_level: RiskLevel;
  
  extra_data?: Record<string, any>;
  status: AuditStatus;
  deleted: boolean;
}

export interface AuditLogListResponse {
  items: AuditLog[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface AuditLogQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  event_type?: EventType;
  event_category?: EventCategory;
  result?: AuditResult;
  risk_level?: RiskLevel;
  tenant_id?: string;
  user_id?: string;
  start_date?: string;
  end_date?: string;
}
