/**
 * @file use-tenant-revenue.ts
 * @description Hook for fetching tenant revenue data
 */

import { useQuery } from "@apollo/client";
import { GET_TENANT_REVENUE } from "../graphql/queries";

interface RevenueData {
  totalRevenue: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  currency: string;
  invoiceCount: number;
  paidInvoiceCount: number;
  overdueInvoiceCount: number;
  averageInvoiceAmount: number;
  lastInvoiceDate?: string;
}

interface GetTenantRevenueResponse {
  tenantRevenue: RevenueData;
}

interface GetTenantRevenueVariables {
  tenantId: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Hook to fetch revenue/sales data for a tenant
 * @param tenantId - Tenant ID
 * @param variables - Query variables for date range filtering
 * @returns Query result with revenue data
 */
export function useTenantRevenue(
  tenantId: string,
  variables?: Omit<GetTenantRevenueVariables, "tenantId">
) {
  return useQuery<GetTenantRevenueResponse, GetTenantRevenueVariables>(
    GET_TENANT_REVENUE,
    {
      variables: {
        tenantId,
        ...variables,
      },
      skip: !tenantId,
      errorPolicy: "all",
    }
  );
}
