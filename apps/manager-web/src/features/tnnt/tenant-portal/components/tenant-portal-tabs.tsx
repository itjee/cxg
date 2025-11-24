/**
 * @file tenant-portal-tabs.tsx
 * @description Main tab container for tenant portal
 */

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Users,
  Shield,
  Zap,
  Package,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { BasicInfoTab } from "./tenant-portal-tabs-basic-info";
import { UsersTab } from "./tenant-portal-tabs-users";
import { RolesTab } from "./tenant-portal-tabs-roles";
import { OnboardingTab } from "./tenant-portal-tabs-onboarding";
import { SubscriptionsTab } from "./tenant-portal-tabs-subscriptions";
import { BillingTab } from "./tenant-portal-tabs-billing";
import { RevenueTab } from "./tenant-portal-tabs-revenue";
import type { TenantPortalTab } from "../types/tenant-portal.types";
import type { Tenant } from "@/features/tnnt/tenants";
import type {
  TenantUser,
  TenantRole,
  OnboardingStep,
  TenantSubscription,
  Invoice,
  Transaction,
} from "../types/tenant-portal.types";

interface TenantPortalTabsProps {
  activeTab: TenantPortalTab;
  onTabChange: (tab: TenantPortalTab) => void;

  // Tenant data
  tenant?: Tenant;
  isLoadingTenant?: boolean;

  // Data props
  users?: TenantUser[];
  roles?: TenantRole[];
  onboardingSteps?: OnboardingStep[];
  subscriptions?: TenantSubscription[];
  invoices?: Invoice[];
  transactions?: Transaction[];
  revenueData?: {
    totalRevenue: number;
    totalPaid: number;
    totalPending: number;
    totalOverdue: number;
    currency: string;
    invoiceCount: number;
    paidInvoiceCount: number;
    overdueInvoiceCount: number;
    averageInvoiceAmount: number;
    lastInvoiceDate?: string;
  };

  // Loading states
  isLoadingUsers?: boolean;
  isLoadingRoles?: boolean;
  isLoadingOnboarding?: boolean;
  isLoadingSubscriptions?: boolean;
  isLoadingInvoices?: boolean;
  isLoadingTransactions?: boolean;
  isLoadingRevenue?: boolean;
}

export function TenantPortalTabs({
  activeTab,
  onTabChange,
  tenant,
  isLoadingTenant,
  users,
  roles,
  onboardingSteps,
  subscriptions,
  invoices,
  transactions,
  revenueData,
  isLoadingUsers,
  isLoadingRoles,
  isLoadingOnboarding,
  isLoadingSubscriptions,
  isLoadingInvoices,
  isLoadingTransactions,
  isLoadingRevenue,
}: TenantPortalTabsProps) {
  const tabs = [
    {
      value: "basic-info" as const,
      label: "기본정보",
      icon: FileText,
      description: "테넌트 기본 정보",
    },
    {
      value: "users" as const,
      label: "사용자",
      icon: Users,
      description: "연결된 사용자 현황",
    },
    {
      value: "roles" as const,
      label: "역할",
      icon: Shield,
      description: "역할 관리",
    },
    {
      value: "onboarding" as const,
      label: "온보딩",
      icon: Zap,
      description: "온보딩 프로세스",
    },
    {
      value: "subscriptions" as const,
      label: "구독",
      icon: Package,
      description: "구독 현황",
    },
    {
      value: "billing" as const,
      label: "청구",
      icon: CreditCard,
      description: "청구 및 결제",
    },
    {
      value: "revenue" as const,
      label: "매출",
      icon: TrendingUp,
      description: "매출 분석",
    },
  ];

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => onTabChange(value as TenantPortalTab)}
    >
      {/* Custom Tab List */}
      <div className="border-b bg-muted/30 rounded-t-lg">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className={`
                  relative flex items-center gap-3 px-6 py-4 font-medium whitespace-nowrap
                  transition-all duration-300 group
                  ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {/* Icon */}
                <Icon
                  className={`
                    h-5 w-5 transition-all duration-300
                    ${
                      isActive
                        ? "text-primary scale-110"
                        : "text-muted-foreground group-hover:text-foreground"
                    }
                  `}
                />

                {/* Label */}
                <span>{tab.label}</span>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary to-primary/70 rounded-t-full shadow-lg shadow-primary/50" />
                )}

                {/* Hover indicator (inactive) */}
                {!isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted-foreground/20 group-hover:bg-muted-foreground/40 transition-colors" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-0">
        <div
          className={
            isActive(activeTab, "basic-info")
              ? "animate-in fade-in-50 duration-300"
              : ""
          }
        >
          <TabsContent value="basic-info">
            <BasicInfoTab tenant={tenant} isLoading={isLoadingTenant} />
          </TabsContent>

          <TabsContent value="users">
            <UsersTab users={users} isLoading={isLoadingUsers} />
          </TabsContent>

          <TabsContent value="roles">
            <RolesTab roles={roles} isLoading={isLoadingRoles} />
          </TabsContent>

          <TabsContent value="onboarding">
            <OnboardingTab
              steps={onboardingSteps}
              isLoading={isLoadingOnboarding}
            />
          </TabsContent>

          <TabsContent value="subscriptions">
            <SubscriptionsTab
              subscriptions={subscriptions}
              isLoading={isLoadingSubscriptions}
            />
          </TabsContent>

          <TabsContent value="billing">
            <BillingTab
              invoices={invoices}
              transactions={transactions}
              isLoadingInvoices={isLoadingInvoices}
              isLoadingTransactions={isLoadingTransactions}
            />
          </TabsContent>

          <TabsContent value="revenue">
            <RevenueTab
              revenueData={revenueData}
              isLoading={isLoadingRevenue}
            />
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}

// Helper to check if tab is active (for animation purposes)
function isActive(currentTab: string, tabValue: string) {
  return currentTab === tabValue;
}
