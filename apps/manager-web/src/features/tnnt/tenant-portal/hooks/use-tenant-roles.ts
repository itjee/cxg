/**
 * @file use-tenant-roles.ts
 * @description Hook for fetching tenant roles
 */

import { useQuery } from "@apollo/client";
import { GET_TENANT_ROLES } from "../graphql/queries";
import type { TenantRole } from "../types/tenant-portal.types";

interface GetTenantRolesResponse {
  tenantRoles: TenantRole[];
}

interface GetTenantRolesVariables {
  tenantId: string;
  limit?: number;
  offset?: number;
}

/**
 * Hook to fetch roles used in a tenant
 * @param tenantId - Tenant ID
 * @param variables - Query variables for pagination
 * @returns Query result with roles list
 */
export function useTenantRoles(
  tenantId: string,
  variables?: Omit<GetTenantRolesVariables, "tenantId">
) {
  return useQuery<GetTenantRolesResponse, GetTenantRolesVariables>(
    GET_TENANT_ROLES,
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
