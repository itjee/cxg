/**
 * @file tenant-info-section.tsx
 * @description Displays detailed tenant business information
 */

"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Tenant } from "@/features/tnnt/tenants";

interface TenantInfoSectionProps {
  tenant: Tenant | null | undefined;
  isLoading?: boolean;
}

export function TenantInfoSection({
  tenant,
  isLoading,
}: TenantInfoSectionProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-6 bg-muted animate-pulse rounded w-40" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-5 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!tenant) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          테넌트를 선택해주세요
        </div>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      TRIAL: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      SUSPENDED:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      TERMINATED:
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[status] || colors.ACTIVE;
  };

  const bizType =
    (tenant.bizType || tenant.biz_type) === "C" ? "법인" : "개인";

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header with status */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">{tenant.name}</h2>
            <p className="text-sm text-muted-foreground">
              코드: {tenant.code}
            </p>
          </div>
          <Badge className={getStatusColor(tenant.status || "ACTIVE")}>
            {tenant.status === "TRIAL"
              ? "평가판"
              : tenant.status === "ACTIVE"
                ? "활성"
                : tenant.status === "SUSPENDED"
                  ? "일시중단"
                  : "종료"}
          </Badge>
        </div>

        {/* Business Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 상호 */}
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              상호
            </div>
            <div className="mt-1">{(tenant.bizName || tenant.biz_name) || "-"}</div>
          </div>

          {/* 사업자번호 */}
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              사업자번호
            </div>
            <div className="mt-1 font-mono">
              {(tenant.bizNo || tenant.biz_no) || "-"}
            </div>
          </div>

          {/* 대표자 */}
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              대표자
            </div>
            <div className="mt-1">{(tenant.ceoName || tenant.ceo_name) || "-"}</div>
          </div>

          {/* 사업자 구분 */}
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              구분
            </div>
            <div className="mt-1">{bizType}</div>
          </div>

          {/* 업태 (업종) - if available */}
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              업태
            </div>
            <div className="mt-1">-</div>
          </div>

          {/* 종목 - if available */}
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              종목
            </div>
            <div className="mt-1">-</div>
          </div>

          {/* 주소 */}
          <div className="lg:col-span-2">
            <div className="text-sm font-medium text-muted-foreground">
              주소
            </div>
            <div className="mt-1 text-sm">
              {tenant.address1 || "-"}
              {tenant.address2 && ` ${tenant.address2}`}
            </div>
          </div>

          {/* 연락처 */}
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              연락처
            </div>
            <div className="mt-1">{(tenant.phoneNo || tenant.phone_no) || "-"}</div>
          </div>
        </div>

        {/* Contract Period and Employee Count */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                계약시작일
              </div>
              <div className="mt-1">
                {tenant.startDate || tenant.start_date || "-"}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground">
                계약종료일
              </div>
              <div className="mt-1">
                {(tenant.closeDate || tenant.close_date) === null ? (
                  <Badge variant="outline">무기한</Badge>
                ) : (
                  tenant.closeDate || tenant.close_date || "-"
                )}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground">
                직원수
              </div>
              <div className="mt-1">
                {tenant.employeeCount || tenant.employee_count
                  ? `${tenant.employeeCount || tenant.employee_count}명`
                  : "-"}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground">
                테넌트 유형
              </div>
              <div className="mt-1">{tenant.type}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
