/**
 * @file use-tenant-transactions.ts
 * @description Hook for fetching tenant transactions
 */

import { useQuery } from "@apollo/client";
import { GET_TENANT_TRANSACTIONS } from "../graphql/queries";
import type { Transaction } from "../types/tenant-portal.types";

interface GetTenantTransactionsResponse {
  tenantTransactions: Transaction[];
}

interface GetTenantTransactionsVariables {
  tenantId: string;
  limit?: number;
  offset?: number;
  status?: string;
}

/**
 * Hook to fetch transactions for a tenant
 * @param tenantId - Tenant ID
 * @param variables - Query variables for filtering and pagination
 * @returns Query result with transactions list
 */
export function useTenantTransactions(
  tenantId: string,
  variables?: Omit<GetTenantTransactionsVariables, "tenantId">
) {
  return useQuery<GetTenantTransactionsResponse, GetTenantTransactionsVariables>(
    GET_TENANT_TRANSACTIONS,
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
