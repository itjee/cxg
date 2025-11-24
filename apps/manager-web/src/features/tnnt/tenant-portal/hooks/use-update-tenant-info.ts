/**
 * @file use-update-tenant-info.ts
 * @description Hook for updating tenant information
 */

import { useMutation } from "@apollo/client";
import { UPDATE_TENANT_INFO } from "../graphql/mutations";
import { GET_TENANT_BASIC } from "../graphql/queries";
import type { Tenant } from "@/features/tnnt/tenants";

interface UpdateTenantInfoResponse {
  tenants: {
    updateTenant: Tenant;
  };
}

interface UpdateTenantInfoVariables {
  id: string;
  input: Record<string, any>;
}

/**
 * Hook to update tenant information
 * @returns Mutation function and loading/error states
 */
export function useUpdateTenantInfo() {
  return useMutation<UpdateTenantInfoResponse, UpdateTenantInfoVariables>(
    UPDATE_TENANT_INFO,
    {
      refetchQueries: [
        {
          query: GET_TENANT_BASIC,
          variables: { id: "" }, // Will be set dynamically
        },
      ],
      errorPolicy: "all",
    }
  );
}
