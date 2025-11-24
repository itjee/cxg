/**
 * @file use-tenant-basic.ts
 * @description Hook for fetching basic tenant information
 */

import { useQuery } from "@apollo/client";
import { GET_TENANT_BASIC } from "../graphql/queries";
import type { Tenant } from "@/features/tnnt/tenants";

interface GetTenantBasicResponse {
  tenant: Tenant;
}

interface GetTenantBasicVariables {
  id: string;
}

/**
 * Hook to fetch basic tenant information
 * @param tenantId - Tenant ID to fetch
 * @returns Query result with tenant data
 */
export function useTenantBasic(tenantId: string) {
  return useQuery<GetTenantBasicResponse, GetTenantBasicVariables>(
    GET_TENANT_BASIC,
    {
      variables: { id: tenantId },
      skip: !tenantId,
      errorPolicy: "all",
    }
  );
}
