/**
 * @file use-tenant-subscriptions.ts
 * @description Hook for fetching tenant subscriptions
 */

import { useQuery } from "@apollo/client";
import { GET_TENANT_SUBSCRIPTIONS } from "../graphql/queries";
import type { TenantSubscription } from "../types/tenant-portal.types";

interface GetTenantSubscriptionsResponse {
  tenantSubscriptions: TenantSubscription[];
}

interface GetTenantSubscriptionsVariables {
  tenantId: string;
  limit?: number;
  offset?: number;
}

/**
 * Hook to fetch subscriptions for a tenant
 * @param tenantId - Tenant ID
 * @param variables - Query variables for pagination
 * @returns Query result with subscriptions list
 */
export function useTenantSubscriptions(
  tenantId: string,
  variables?: Omit<GetTenantSubscriptionsVariables, "tenantId">
) {
  return useQuery<GetTenantSubscriptionsResponse, GetTenantSubscriptionsVariables>(
    GET_TENANT_SUBSCRIPTIONS,
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
