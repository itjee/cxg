/**
 * @file use-tenants-selector.ts
 * @description Hook for fetching tenants list for selector dropdown
 */

import { useQuery } from "@apollo/client";
import { GET_TENANTS_FOR_SELECTOR } from "../graphql/queries";
import type { Tenant } from "@/features/tnnt/tenants";

interface GetTenantsForSelectorResponse {
  tenants: Tenant[];
}

interface GetTenantsForSelectorVariables {
  limit?: number;
  offset?: number;
  search?: string;
  status?: string;
}

/**
 * Hook to fetch tenants for dropdown selector
 * @param variables - Query variables for filtering
 * @returns Query result with tenants list
 */
export function useTenantsForSelector(
  variables?: GetTenantsForSelectorVariables
) {
  return useQuery<GetTenantsForSelectorResponse, GetTenantsForSelectorVariables>(
    GET_TENANTS_FOR_SELECTOR,
    {
      variables: {
        limit: 100,
        offset: 0,
        ...variables,
      },
      errorPolicy: "all",
    }
  );
}
