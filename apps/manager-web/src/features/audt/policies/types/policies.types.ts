export type PolicyType = 
  | 'PASSWORD' 
  | 'ACCESS_CONTROL' 
  | 'DATA_RETENTION' 
  | 'ENCRYPTION' 
  | 'AUTHENTICATION' 
  | 'NETWORK_SECURITY';

export type PolicyCategory = 
  | 'AUTHENTICATION' 
  | 'AUTHORIZATION' 
  | 'DATA_PROTECTION' 
  | 'MONITORING' 
  | 'INCIDENT_RESPONSE' 
  | 'COMPLIANCE';

export type EnforcementLevel = 
  | 'MANDATORY' 
  | 'RECOMMENDED' 
  | 'OPTIONAL';

export type PolicyStatus = 
  | 'DRAFT' 
  | 'PENDING_APPROVAL' 
  | 'ACTIVE' 
  | 'ARCHIVED';

export interface Policy {
  id: string;
  created_at: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  
  policy_name: string;
  policy_type: PolicyType;
  policy_category: PolicyCategory;
  
  description?: string;
  rules: Record<string, any>;
  
  apply_to_all_tenants: boolean;
  tenant_ids?: string[];
  
  effective_date: string;
  expiry_date?: string;
  enforcement_level: EnforcementLevel;
  
  version: string;
  previous_version_id?: string;
  
  approved_at?: string;
  approved_by?: string;
  
  status: PolicyStatus;
  deleted: boolean;
}

export interface PolicyListResponse {
  items: Policy[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface PolicyQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  policy_type?: PolicyType;
  policy_category?: PolicyCategory;
  status?: PolicyStatus;
  enforcement_level?: EnforcementLevel;
  start_date?: string;
  end_date?: string;
}

export interface CreatePolicyRequest {
  policy_name: string;
  policy_type: PolicyType;
  policy_category: PolicyCategory;
  description?: string;
  rules: Record<string, any>;
  apply_to_all_tenants: boolean;
  tenant_ids?: string[];
  effective_date: string;
  expiry_date?: string;
  enforcement_level: EnforcementLevel;
  version: string;
}

export interface UpdatePolicyRequest {
  policy_name?: string;
  description?: string;
  rules?: Record<string, any>;
  status?: PolicyStatus;
  enforcement_level?: EnforcementLevel;
  expiry_date?: string;
  approved_by?: string;
}
