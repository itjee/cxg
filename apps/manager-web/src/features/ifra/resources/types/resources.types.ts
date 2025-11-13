// ========== ENTITY ==========
export interface Resource {
  // System fields
  id: string;
  created_at: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;

  // Tenant connection
  tenant_id?: string;

  // Resource basic info
  resource: ResourceType;
  resource_name: string;
  resource_arn?: string;
  resource_id: string;

  // Location info
  region: string;
  availability_zone?: string;

  // Spec info
  instance_type?: string;
  cpu_cores?: number;
  memory_size?: number;
  storage_size?: number;

  // Cost management
  hourly_cost?: number;
  monthly_cost?: number;
  currency: Currency;

  // Metadata
  tags?: Record<string, unknown>;
  configuration?: Record<string, unknown>;

  // Status
  status: ResourceStatus;
  deleted: boolean;
  is_active: boolean;
}

// ========== STATUS & TYPE ENUMS ==========
export type ResourceType =
  | "DATABASE"
  | "STORAGE"
  | "COMPUTE"
  | "NETWORK"
  | "CACHE"
  | "LOAD_BALANCER"
  | "CDN";

export type ResourceStatus =
  | "PROVISIONING"
  | "RUNNING"
  | "STOPPED"
  | "TERMINATED"
  | "ERROR"
  | "MAINTENANCE";

export type Currency = "USD" | "KRW" | "EUR" | "JPY";

// ========== REQUEST DTO ==========
export interface CreateResourceRequest {
  resource: ResourceType;
  resource_name: string;
  resource_id: string;
  region?: string;
  currency?: Currency;

  // Optional fields
  tenant_id?: string;
  resource_arn?: string;
  availability_zone?: string;
  instance_type?: string;
  cpu_cores?: number;
  memory_size?: number;
  storage_size?: number;
  hourly_cost?: number;
  monthly_cost?: number;
  tags?: Record<string, unknown>;
  configuration?: Record<string, unknown>;
  status?: ResourceStatus;
}

export interface UpdateResourceRequest {
  resource_name?: string;
  resource_arn?: string;
  region?: string;
  availability_zone?: string;
  instance_type?: string;
  cpu_cores?: number;
  memory_size?: number;
  storage_size?: number;
  hourly_cost?: number;
  monthly_cost?: number;
  currency?: Currency;
  tags?: Record<string, unknown>;
  configuration?: Record<string, unknown>;
  status?: ResourceStatus;
}

// ========== RESPONSE DTO ==========
export interface ResourceListResponse {
  items: Resource[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// ========== QUERY PARAMETERS ==========
export interface ResourceQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  resource?: ResourceType;
  status?: ResourceStatus;
  tenant_id?: string;
  region?: string;
}
