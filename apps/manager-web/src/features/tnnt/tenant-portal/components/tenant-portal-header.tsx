/**
 * @file tenant-header-section.tsx
 * @description Enhanced tenant header with company info and change button
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Building2 } from "lucide-react";
import { TenantSearchModal } from "@/components/filters/tenant-search-modal";
import { TenantPortalStats } from "./tenant-portal-stats";
import type { Tenant } from "@/features/tnnt/tenants";

interface TenantHeaderSectionProps {
  tenant: Tenant | null | undefined;
  isLoading?: boolean;
  onTenantChange?: (tenantId: string) => void;
}

export function TenantHeaderSection({
  tenant,
  isLoading,
  onTenantChange,
}: TenantHeaderSectionProps) {
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-8 border-l-4 border-l-primary bg-gradient-to-br from-card to-muted/30">
          <div className="space-y-8">
            {/* Header Skeleton */}
            <div className="flex items-start justify-between gap-6 mb-8">
              <div className="flex items-start gap-6 flex-1">
                <div className="h-20 w-20 bg-muted animate-pulse rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-10 bg-muted animate-pulse rounded w-1/3" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
                  <div className="h-6 bg-muted animate-pulse rounded w-1/6" />
                </div>
              </div>
              <div className="h-9 w-20 bg-muted animate-pulse rounded flex-shrink-0" />
            </div>

            {/* Divider */}
            <div className="border-b" />

            {/* Stats Skeleton */}
            <TenantPortalStats tenant={null} isLoading={true} />
          </div>
        </Card>
      </div>
    );
  }

  if (!tenant) {
    return null;
  }

  const bizName = tenant.bizName || tenant.biz_name;
  const bizNo = tenant.bizNo || tenant.biz_no;
  const ceoName = tenant.ceoName || tenant.ceo_name;

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "TRIAL":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "SUSPENDED":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return "활성";
      case "TRIAL":
        return "평가판";
      case "SUSPENDED":
        return "일시중단";
      default:
        return "비활성";
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="space-y-6">
        <Card className="p-8 border-l-4 border-l-primary bg-gradient-to-br from-card to-muted/30">
          {/* Top Row: Logo, Name, Status, Change Button */}
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-6 flex-1">
              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 shadow-sm">
                  <Building2 className="h-10 w-10 text-primary" />
                </div>
              </div>

              {/* Tenant Name, Code, and Business Info */}
              <div className="flex items-start gap-4 flex-1">
                {/* Name, Code, and Status Badge Column */}
                <div className="space-y-1">
                  <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    {tenant.name}
                  </h1>
                  <div className="text-base text-muted-foreground mb-1">
                    {tenant.code}
                  </div>
                  <Badge
                    className={`${getStatusBadgeColor(
                      tenant.status
                    )} rounded-full`}
                  >
                    {getStatusLabel(tenant.status)}
                  </Badge>
                </div>

                {/* Business Info Row */}
                <div className="ml-12 flex gap-16">
                  {/* Business Info */}
                  <div className="space-y-1">
                    {bizName && (
                      <div>
                        <div className="text-base text-muted-foreground">
                          상호
                        </div>
                        <div className="text-base font-bold text-foreground">
                          {bizName}
                        </div>
                      </div>
                    )}
                    {bizNo && (
                      <div>
                        <div className="text-base text-muted-foreground">
                          사업자번호
                        </div>
                        <div className="text-base font-bold font-mono text-foreground">
                          {bizNo}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CEO Info */}
                  <div className="space-y-1">
                    {ceoName && (
                      <div>
                        <div className="text-base text-muted-foreground">
                          대표자명
                        </div>
                        <div className="text-base font-bold text-foreground">
                          {ceoName}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-base text-muted-foreground">
                        담당자명
                      </div>
                      <div className="text-base font-bold text-foreground">
                        미지정
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Button */}
            <Button
              onClick={() => setSearchModalOpen(true)}
              variant="outline"
              size="sm"
              className="gap-2 mt-2 flex-shrink-0"
            >
              <ChevronRight className="h-4 w-4" />
              변경
            </Button>
          </div>

          {/* Divider */}
          {/* <div className="mb-8 border-b" /> */}

          {/* Stats Cards */}
          {/* <TenantPortalStats tenant={tenant} isLoading={isLoading} /> */}
        </Card>
      </div>

      {/* Tenant Search Modal */}
      <TenantSearchModal
        open={searchModalOpen}
        onOpenChange={setSearchModalOpen}
        onTenantSelect={(tenantId) => {
          onTenantChange?.(tenantId);
          setSearchModalOpen(false);
        }}
      />
    </>
  );
}
