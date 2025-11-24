/**
 * @file use-tenant-invoices.ts
 * @description Hook for fetching tenant invoices
 */

import { useQuery } from "@apollo/client";
import { GET_TENANT_INVOICES } from "../graphql/queries";
import type { Invoice } from "../types/tenant-portal.types";

interface GetTenantInvoicesResponse {
  tenantInvoices: Invoice[];
}

interface GetTenantInvoicesVariables {
  tenantId: string;
  limit?: number;
  offset?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Hook to fetch invoices for a tenant
 * @param tenantId - Tenant ID
 * @param variables - Query variables for filtering and pagination
 * @returns Query result with invoices list
 */
export function useTenantInvoices(
  tenantId: string,
  variables?: Omit<GetTenantInvoicesVariables, "tenantId">
) {
  return useQuery<GetTenantInvoicesResponse, GetTenantInvoicesVariables>(
    GET_TENANT_INVOICES,
    {
      variables: {
        tenantId,
        limit: 50,
        offset: 0,
        ...variables,
      },
      skip: !tenantId,
      errorPolicy: "all",
    }
  );
}
