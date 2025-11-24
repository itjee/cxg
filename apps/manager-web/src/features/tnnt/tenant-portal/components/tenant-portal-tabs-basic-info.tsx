/**
 * @file basic-info-tab.tsx
 * @description Tab for viewing basic tenant information (tenants table content)
 */

"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Tenant } from "@/features/tnnt/tenants";

interface BasicInfoTabProps {
  tenant: Tenant | undefined;
  isLoading?: boolean;
}

export function BasicInfoTab({ tenant, isLoading }: BasicInfoTabProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-6 bg-muted animate-pulse rounded"
            />
          ))}
        </div>
      </Card>
    );
  }

  if (!tenant) {
    return (
      <Card className="p-12">
        <div className="text-center text-muted-foreground">
          테넌트 정보가 없습니다
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

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      TRIAL: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      STANDARD: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      PREMIUM:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      ENTERPRISE:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    };
    return colors[type] || colors.STANDARD;
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">기본 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              테넌트명
            </div>
            <div className="font-medium">{tenant.name}</div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              코드
            </div>
            <code className="font-mono">{tenant.code}</code>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              상태
            </div>
            <Badge className={getStatusColor(tenant.status)}>
              {tenant.status === "TRIAL"
                ? "평가판"
                : tenant.status === "ACTIVE"
                  ? "활성"
                  : tenant.status === "SUSPENDED"
                    ? "일시중단"
                    : "종료"}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Business Info */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">사업자 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              상호
            </div>
            <div className="font-medium">
              {(tenant.bizName || tenant.biz_name) || "-"}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              사업자번호
            </div>
            <code className="font-mono">
              {(tenant.bizNo || tenant.biz_no) || "-"}
            </code>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              사업자 구분
            </div>
            <div className="font-medium">
              {(tenant.bizType || tenant.biz_type) === "C"
                ? "법인"
                : "개인"}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              대표자명
            </div>
            <div className="font-medium">
              {(tenant.ceoName || tenant.ceo_name) || "-"}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              주소
            </div>
            <div className="font-medium">
              {tenant.address1 || "-"}
              {tenant.address2 && ` ${tenant.address2}`}
            </div>
          </div>
        </div>
      </Card>

      {/* Contact & Organizational Info */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">연락처 및 조직 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              전화번호
            </div>
            <div className="font-medium">
              {(tenant.phoneNo || tenant.phone_no) || "-"}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              직원수
            </div>
            <div className="font-medium">
              {tenant.employeeCount || tenant.employee_count
                ? `${tenant.employeeCount || tenant.employee_count}명`
                : "-"}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              우편번호
            </div>
            <div className="font-medium">{tenant.postcode || "-"}</div>
          </div>
        </div>
      </Card>

      {/* Subscription & Contract Info */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">구독 및 계약 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              요금제
            </div>
            <Badge className={getTypeColor(tenant.type)}>
              {tenant.type === "TRIAL"
                ? "평가판"
                : tenant.type === "STANDARD"
                  ? "표준"
                  : tenant.type === "PREMIUM"
                    ? "프리미엄"
                    : "엔터프라이즈"}
            </Badge>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              계약 시작일
            </div>
            <div className="font-medium">
              {tenant.startDate || tenant.start_date || "-"}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              계약 종료일
            </div>
            <div className="font-medium">
              {(tenant.closeDate || tenant.close_date) === null ? (
                <Badge variant="outline">무기한</Badge>
              ) : (
                tenant.closeDate || tenant.close_date || "-"
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Status & Suspension */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">상태 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              일시중단 여부
            </div>
            <Badge
              variant={
                tenant.isSuspended || tenant.is_suspended
                  ? "destructive"
                  : "outline"
              }
            >
              {tenant.isSuspended || tenant.is_suspended
                ? "중단됨"
                : "정상"}
            </Badge>
          </div>

          {(tenant.isSuspended || tenant.is_suspended) &&
            (tenant.suspendedReason || tenant.suspended_reason) && (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  중단 사유
                </div>
                <div className="text-sm text-red-600 dark:text-red-400">
                  {tenant.suspendedReason || tenant.suspended_reason}
                </div>
              </div>
            )}
        </div>
      </Card>

      {/* Audit Info */}
      <Card className="p-6 bg-muted/30">
        <h3 className="font-semibold mb-4">감사 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <div className="font-medium text-muted-foreground mb-1">
              등록일
            </div>
            <div>
              {tenant.createdAt || tenant.created_at
                ? new Date(
                    tenant.createdAt || tenant.created_at
                  ).toLocaleString("ko-KR")
                : "-"}
            </div>
          </div>

          <div>
            <div className="font-medium text-muted-foreground mb-1">
              수정일
            </div>
            <div>
              {tenant.updatedAt || tenant.updated_at
                ? new Date(
                    tenant.updatedAt || tenant.updated_at
                  ).toLocaleString("ko-KR")
                : "-"}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
