/**
 * @file use-tenant-onboarding.ts
 * @description Hook for fetching tenant onboarding status
 */

import { useQuery } from "@apollo/client";
import { GET_TENANT_ONBOARDING } from "../graphql/queries";
import type { OnboardingStep } from "../types/tenant-portal.types";

interface GetTenantOnboardingResponse {
  tenantOnboarding: OnboardingStep[];
}

interface GetTenantOnboardingVariables {
  tenantId: string;
}

/**
 * Hook to fetch onboarding process steps for a tenant
 * @param tenantId - Tenant ID
 * @returns Query result with onboarding steps
 */
export function useTenantOnboarding(tenantId: string) {
  return useQuery<GetTenantOnboardingResponse, GetTenantOnboardingVariables>(
    GET_TENANT_ONBOARDING,
    {
      variables: { tenantId },
      skip: !tenantId,
      errorPolicy: "all",
    }
  );
}
