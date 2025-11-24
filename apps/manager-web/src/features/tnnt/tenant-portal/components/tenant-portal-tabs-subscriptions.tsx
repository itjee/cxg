/**
 * @file subscriptions-tab.tsx
 * @description Tab for viewing subscription status and details
 */

"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TenantSubscription } from "../../types/tenant-portal.types";

interface SubscriptionsTabProps {
  subscriptions: TenantSubscription[] | undefined;
  isLoading?: boolean;
}

export function SubscriptionsTab({
  subscriptions,
  isLoading,
}: SubscriptionsTabProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-muted animate-pulse rounded"
            />
          ))}
        </div>
      </Card>
    );
  }

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center text-muted-foreground">
          구독 정보가 없습니다
        </div>
      </Card>
    );
  }

  const getStatusColor = (status: string | undefined) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      SUSPENDED:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      EXPIRED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      CANCELED:
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };
    return colors[status || "ACTIVE"] || colors.ACTIVE;
  };

  return (
    <div className="space-y-4">
      {subscriptions.map((subscription) => (
        <Card key={subscription.id} className="p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">
                  {subscription.plan?.name || "알 수 없는 요금제"}
                </h4>
                {subscription.plan?.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {subscription.plan.description}
                  </p>
                )}
              </div>
              <Badge className={getStatusColor(subscription.status)}>
                {subscription.status === "ACTIVE"
                  ? "활성"
                  : subscription.status === "SUSPENDED"
                    ? "일시중단"
                    : subscription.status === "EXPIRED"
                      ? "만료"
                      : "취소됨"}
              </Badge>
            </div>

            {/* Billing Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  청구 주기
                </div>
                <div className="mt-1">
                  {subscription.billingCycle === "MONTHLY"
                    ? "월간"
                    : subscription.billingCycle === "QUARTERLY"
                      ? "분기별"
                      : "연간"}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  금액
                </div>
                <div className="mt-1 font-semibold">
                  {subscription.baseAmount?.toLocaleString()} {subscription.currency || "KRW"}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  시작일
                </div>
                <div className="mt-1">{subscription.startDate || "-"}</div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  종료일
                </div>
                <div className="mt-1">
                  {subscription.closeDate || "무기한"}
                </div>
              </div>
            </div>

            {/* Usage Limits */}
            <div className="border-t pt-4 space-y-4">
              <h5 className="font-medium text-sm">이용 제한</h5>

              {subscription.maxUsers && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">최대 사용자</span>
                    <span className="font-medium">
                      {subscription.maxUsers}명
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }} />
                  </div>
                </div>
              )}

              {subscription.maxStorage && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">최대 스토리지</span>
                    <span className="font-medium">
                      {subscription.maxStorage}GB
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }} />
                  </div>
                </div>
              )}

              {subscription.maxApiCalls && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">API 호출 제한</span>
                    <span className="font-medium">
                      {subscription.maxApiCalls?.toLocaleString()}회/월
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Renewal Settings */}
            <div className="border-t pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">자동 갱신</span>
                <span className="font-medium">
                  {subscription.autoRenewal ? "활성화됨" : "비활성화됨"}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
