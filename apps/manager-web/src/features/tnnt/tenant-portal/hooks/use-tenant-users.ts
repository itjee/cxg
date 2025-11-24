/**
 * @file use-tenant-users.ts
 * @description Hook for fetching tenant users
 */

import { useQuery } from "@apollo/client";
import { GET_TENANT_USERS } from "../graphql/queries";
import type { TenantUser } from "../types/tenant-portal.types";

interface GetTenantUsersResponse {
  tenantUsers: TenantUser[];
}

interface GetTenantUsersVariables {
  tenantId: string;
  limit?: number;
  offset?: number;
  status?: string;
}

/**
 * Hook to fetch users connected to a tenant
 * @param tenantId - Tenant ID
 * @param variables - Query variables for filtering and pagination
 * @returns Query result with users list
 */
export function useTenantUsers(
  tenantId: string,
  variables?: Omit<GetTenantUsersVariables, "tenantId">
) {
  return useQuery<GetTenantUsersResponse, GetTenantUsersVariables>(
    GET_TENANT_USERS,
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
