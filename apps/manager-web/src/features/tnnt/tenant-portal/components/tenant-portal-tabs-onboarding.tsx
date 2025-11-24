/**
 * @file onboarding-tab.tsx
 * @description Tab for viewing onboarding process status
 */

"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  SkipForward,
} from "lucide-react";
import type { OnboardingStep } from "../../types/tenant-portal.types";

interface OnboardingTabProps {
  steps: OnboardingStep[] | undefined;
  isLoading?: boolean;
}

export function OnboardingTab({ steps, isLoading }: OnboardingTabProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-muted animate-pulse rounded"
            />
          ))}
        </div>
      </Card>
    );
  }

  if (!steps || steps.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center text-muted-foreground">
          온보딩 정보가 없습니다
        </div>
      </Card>
    );
  }

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "IN_PROGRESS":
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "FAILED":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "SKIPPED":
        return <SkipForward className="h-5 w-5 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string | undefined) => {
    const colors: Record<string, string> = {
      COMPLETED:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      IN_PROGRESS:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      PENDING:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      FAILED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      SKIPPED:
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };
    return colors[status || "PENDING"] || colors.PENDING;
  };

  const sortedSteps = [...steps].sort(
    (a, b) => (a.stepOrder || 0) - (b.stepOrder || 0)
  );

  const stepNameMap: Record<string, string> = {
    REGISTRATION: "회원 가입",
    EMAIL_VERIFICATION: "이메일 인증",
    SCHEMA_CREATION: "스키마 생성",
    INITIAL_SETUP: "초기 설정",
    DATA_MIGRATION: "데이터 마이그레이션",
    CONFIGURATION: "설정",
    COMPLETED: "완료",
  };

  return (
    <div className="space-y-4">
      {sortedSteps.map((step) => (
        <Card key={step.id} className="p-4">
          <div className="flex items-start gap-4">
            <div className="pt-1">{getStatusIcon(step.stepStatus)}</div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">
                  {stepNameMap[step.stepName || ""] || step.stepName || "-"}
                </h4>
                <Badge className={getStatusColor(step.stepStatus)}>
                  {step.stepStatus === "COMPLETED"
                    ? "완료"
                    : step.stepStatus === "IN_PROGRESS"
                      ? "진행중"
                      : step.stepStatus === "PENDING"
                        ? "대기중"
                        : step.stepStatus === "FAILED"
                          ? "실패"
                          : "건너뜀"}
                </Badge>
              </div>

              {step.startedAt && (
                <div className="text-sm text-muted-foreground">
                  시작: {new Date(step.startedAt).toLocaleString("ko-KR")}
                </div>
              )}

              {step.completedAt && (
                <div className="text-sm text-muted-foreground">
                  완료: {new Date(step.completedAt).toLocaleString("ko-KR")}
                </div>
              )}

              {step.retryCount && step.retryCount > 0 && (
                <div className="text-sm text-muted-foreground">
                  재시도: {step.retryCount}회
                </div>
              )}

              {step.errorMessage && (
                <div className="text-sm text-red-600 dark:text-red-400 font-mono">
                  오류: {step.errorMessage}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
