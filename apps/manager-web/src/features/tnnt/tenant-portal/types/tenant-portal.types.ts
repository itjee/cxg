/**
 * @file tenant-portal.types.ts
 * @description Tenant Portal related TypeScript types
 */

import type { Tenant } from "@/features/tnnt/tenants";

/**
 * Tenant User relationship type
 */
export interface TenantUser {
  id: string;
  user_id?: string;
  userId?: string;
  tenant_id?: string;
  tenantId?: string;
  role?: string;
  department?: string;
  position?: string;
  employee_id?: string;
  start_date?: string;
  startDate?: string;
  close_date?: string;
  closeDate?: string;
  status?: string;
  is_primary?: boolean;
  isPrimary?: boolean;
  is_admin?: boolean;
  isAdmin?: boolean;
  // Related user data
  user?: {
    id: string;
    full_name?: string;
    fullName?: string;
    email: string;
    phone?: string;
    username?: string;
    status?: string;
    last_login_at?: string;
    lastLoginAt?: string;
  };
}

/**
 * Role type
 */
export interface TenantRole {
  id: string;
  code: string;
  name: string;
  description?: string;
  category?: string;
  level?: number;
  scope?: string;
  status?: string;
  is_system?: boolean;
  isSystem?: boolean;
  permission_count?: number;
  permissionCount?: number;
}

/**
 * Onboarding step type
 */
export interface OnboardingStep {
  id: string;
  tenant_id?: string;
  tenantId?: string;
  step_name?: string;
  stepName?: string;
  step_order?: number;
  stepOrder?: number;
  step_status?: string;
  stepStatus?: string;
  started_at?: string;
  startedAt?: string;
  completed_at?: string;
  completedAt?: string;
  retry_count?: number;
  retryCount?: number;
  error_message?: string;
  errorMessage?: string;
  step_data?: Record<string, unknown>;
  stepData?: Record<string, unknown>;
}

/**
 * Subscription type
 */
export interface TenantSubscription {
  id: string;
  tenant_id?: string;
  tenantId?: string;
  plan_id?: string;
  planId?: string;
  plan?: {
    id: string;
    code: string;
    name: string;
    type: string;
    base_price?: number;
    basePrice?: number;
    max_users?: number;
    maxUsers?: number;
    max_storage?: number;
    maxStorage?: number;
    max_api_calls?: number;
    maxApiCalls?: number;
  };
  start_date?: string;
  startDate?: string;
  close_date?: string;
  closeDate?: string;
  billing_cycle?: string;
  billingCycle?: string;
  max_users?: number;
  maxUsers?: number;
  max_storage?: number;
  maxStorage?: number;
  max_api_calls?: number;
  maxApiCalls?: number;
  base_amount?: number;
  baseAmount?: number;
  user_amount?: number;
  userAmount?: number;
  currency?: string;
  auto_renewal?: boolean;
  autoRenewal?: boolean;
  noti_renewal?: boolean;
  notiRenewal?: boolean;
  status?: string;
  is_deleted?: boolean;
  isDeleted?: boolean;
}

/**
 * Invoice type
 */
export interface Invoice {
  id: string;
  invoice_no?: string;
  invoiceNo?: string;
  tenant_id?: string;
  tenantId?: string;
  subscription_id?: string;
  subscriptionId?: string;
  invoice_date?: string;
  invoiceDate?: string;
  due_date?: string;
  dueDate?: string;
  start_date?: string;
  startDate?: string;
  close_date?: string;
  closeDate?: string;
  base_amount?: number;
  baseAmount?: number;
  usage_amount?: number;
  usageAmount?: number;
  discount_amount?: number;
  discountAmount?: number;
  tax_amount?: number;
  taxAmount?: number;
  total_amount?: number;
  totalAmount?: number;
  currency?: string;
  user_count?: number;
  userCount?: number;
  used_storage?: number;
  usedStorage?: number;
  api_calls?: number;
  apiCalls?: number;
  status?: string;
  paid_at?: string;
  paidAt?: string;
  payment_method?: string;
  paymentMethod?: string;
}

/**
 * Transaction type
 */
export interface Transaction {
  id: string;
  transaction_no?: string;
  transactionNo?: string;
  tenant_id?: string;
  tenantId?: string;
  invoice_id?: string;
  invoiceId?: string;
  amount: number;
  currency?: string;
  transaction_type?: string;
  transactionType?: string;
  payment_gateway?: string;
  paymentGateway?: string;
  payment_gateway_id?: string;
  paymentGatewayId?: string;
  payment_method?: string;
  paymentMethod?: string;
  card_digits?: string;
  cardDigits?: string;
  processed_at?: string;
  processedAt?: string;
  failed_at?: string;
  failedAt?: string;
  failure_reason?: string;
  failureReason?: string;
  status?: string;
}

/**
 * Tenant Portal Portal Queries Response
 */
export interface TenantPortalResponse {
  tenant: Tenant;
  users?: TenantUser[];
  roles?: TenantRole[];
  onboarding?: OnboardingStep[];
  subscriptions?: TenantSubscription[];
  invoices?: Invoice[];
  transactions?: Transaction[];
}

/**
 * Tab types
 */
export type TenantPortalTab =
  | "basic-info"
  | "users"
  | "roles"
  | "onboarding"
  | "subscriptions"
  | "billing"
  | "revenue";
