/**
 * @file page.tsx
 * @description Tenant Portal main page
 */

"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

// Components
import {
  TenantHeaderSection,
  TenantPortalStats,
  TenantPortalTabs,
} from "@/features/tnnt/tenant-portal";

// Hooks
import {
  useTenantBasic,
  useTenantsForSelector,
  useTenantUsers,
  useTenantRoles,
  useTenantOnboarding,
  useTenantSubscriptions,
  useTenantInvoices,
  useTenantTransactions,
  useTenantRevenue,
} from "@/features/tnnt/tenant-portal";

// Store
import { useTenantPortalStore } from "@/features/tnnt/tenant-portal";

// Types
import type { TenantPortalTab } from "@/features/tnnt/tenant-portal";

export default function TenantPortalPage() {
  const searchParams = useSearchParams();

  // Store state
  const { selectedTenantId, activeTab, setSelectedTenantId, setActiveTab } =
    useTenantPortalStore();

  // Initialize tenant from URL query parameter
  useEffect(() => {
    const tenantId = searchParams.get("tenantId");
    if (tenantId && tenantId !== selectedTenantId) {
      setSelectedTenantId(tenantId);
    }
  }, [searchParams, selectedTenantId, setSelectedTenantId]);

  // Fetch all tenants
  const {
    data: tenantsData,
    loading: tenantsLoading,
    error: tenantsError,
  } = useTenantsForSelector();

  // Fetch selected tenant details
  const {
    data: tenantData,
    loading: tenantLoading,
    error: tenantError,
  } = useTenantBasic(selectedTenantId || "");

  // Fetch related data
  const { data: usersData, loading: usersLoading } = useTenantUsers(
    selectedTenantId || ""
  );

  const { data: rolesData, loading: rolesLoading } = useTenantRoles(
    selectedTenantId || ""
  );

  const { data: onboardingData, loading: onboardingLoading } =
    useTenantOnboarding(selectedTenantId || "");

  const { data: subscriptionsData, loading: subscriptionsLoading } =
    useTenantSubscriptions(selectedTenantId || "");

  const { data: invoicesData, loading: invoicesLoading } = useTenantInvoices(
    selectedTenantId || ""
  );

  const { data: transactionsData, loading: transactionsLoading } =
    useTenantTransactions(selectedTenantId || "");

  const { data: revenueData, loading: revenueLoading } = useTenantRevenue(
    selectedTenantId || ""
  );

  // Handlers
  const handleTenantChange = (tenantId: string) => {
    setSelectedTenantId(tenantId);
    toast.success("테넌트가 변경되었습니다");
  };

  const handleTabChange = (tab: TenantPortalTab) => {
    setActiveTab(tab);
  };

  // Error handling
  if (tenantsError) {
    return (
      <div className="p-6">
        <div className="text-center text-destructive">
          테넌트 목록을 불러오지 못했습니다. 다시 시도해주세요.
        </div>
      </div>
    );
  }

  if (selectedTenantId && tenantError) {
    return (
      <div className="p-6">
        <div className="text-center text-destructive">
          테넌트 정보를 불러오지 못했습니다. 다시 시도해주세요.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectedTenantId ? (
        <>
          {/* Tenant Header Section */}
          <TenantHeaderSection
            tenant={tenantData?.tenant}
            isLoading={tenantLoading}
            onTenantChange={handleTenantChange}
          />

          <TenantPortalStats
            tenant={tenantData?.tenant}
            isLoading={tenantLoading}
          />

          {/* Tenant Portal Tabs */}
          <TenantPortalTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            tenant={tenantData?.tenant}
            isLoadingTenant={tenantLoading}
            users={usersData?.tenantUsers}
            isLoadingUsers={usersLoading}
            roles={rolesData?.tenantRoles}
            isLoadingRoles={rolesLoading}
            onboardingSteps={onboardingData?.tenantOnboarding}
            isLoadingOnboarding={onboardingLoading}
            subscriptions={subscriptionsData?.tenantSubscriptions}
            isLoadingSubscriptions={subscriptionsLoading}
            invoices={invoicesData?.tenantInvoices}
            transactions={transactionsData?.tenantTransactions}
            isLoadingInvoices={invoicesLoading}
            isLoadingTransactions={transactionsLoading}
            revenueData={revenueData?.tenantRevenue}
            isLoadingRevenue={revenueLoading}
          />
        </>
      ) : (
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-12">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">테넌트를 선택해주세요</p>
            <p className="text-sm mt-1">
              테넌트 목록에서 테넌트를 선택하면
              <br />
              해당 테넌트의 상세 정보를 조회할 수 있습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
