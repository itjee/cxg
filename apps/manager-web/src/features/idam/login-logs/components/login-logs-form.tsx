"use client";

/**
 * @file login-logs-form.tsx
 * @description 로그인 이력 생성 폼 컴포넌트 (Presentational)
 *
 * React Hook Form과 Zod를 사용한 폼 유효성 검증
 * 로그인 이력은 일반적으로 시스템에서 자동 생성되므로
 * 이 폼은 주로 테스트나 수동 관리 목적으로 사용됩니다.
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EntityFormButtons } from "@/components/features";
import type { LoginLog } from "../types/login-logs.types";

/**
 * 폼 유효성 검증 스키마
 */
const loginLogFormSchema = z.object({
  attemptType: z.enum(["LOGIN", "LOGOUT", "FAILED_LOGIN", "LOCKED", "PASSWORD_RESET"]),
  success: z.boolean(),
  ipAddress: z.string().min(1, "IP 주소를 입력하세요"),
  mfaUsed: z.boolean(),
  userId: z.string().optional(),
  userType: z.enum(["MASTER", "TENANT", "SYSTEM"]).optional(),
  tenantContext: z.string().optional(),
  username: z.string().optional(),
  failureReason: z.string().optional(),
  sessionId: z.string().optional(),
  userAgent: z.string().optional(),
  countryCode: z.string().max(2).optional(),
  city: z.string().optional(),
  mfaMethod: z.enum(["TOTP", "SMS", "EMAIL"]).optional(),
});

type LoginLogFormData = z.infer<typeof loginLogFormSchema>;

interface LoginLogsFormProps {
  initialData?: LoginLog;
  onSubmit: (data: LoginLogFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function LoginLogsForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: LoginLogsFormProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<LoginLogFormData>({
    resolver: zodResolver(loginLogFormSchema),
    defaultValues: {
      attemptType: initialData?.attemptType || "LOGIN",
      success: initialData?.success ?? true,
      ipAddress: initialData?.ipAddress || "",
      mfaUsed: initialData?.mfaUsed ?? false,
      userId: initialData?.userId || "",
      userType: initialData?.userType,
      tenantContext: initialData?.tenantContext || "",
      username: initialData?.username || "",
      failureReason: initialData?.failureReason || "",
      sessionId: initialData?.sessionId || "",
      userAgent: initialData?.userAgent || "",
      countryCode: initialData?.countryCode || "",
      city: initialData?.city || "",
      mfaMethod: initialData?.mfaMethod,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        attemptType: initialData.attemptType || "LOGIN",
        success: initialData.success ?? true,
        ipAddress: initialData.ipAddress || "",
        mfaUsed: initialData.mfaUsed ?? false,
        userId: initialData.userId || "",
        userType: initialData.userType,
        tenantContext: initialData.tenantContext || "",
        username: initialData.username || "",
        failureReason: initialData.failureReason || "",
        sessionId: initialData.sessionId || "",
        userAgent: initialData.userAgent || "",
        countryCode: initialData.countryCode || "",
        city: initialData.city || "",
        mfaMethod: initialData.mfaMethod,
      });
    }
  }, [initialData, reset]);

  const success = watch("success");
  const mfaUsed = watch("mfaUsed");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 시도 정보 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold whitespace-nowrap">시도 정보</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>

        <div className="space-y-4">
          {/* 시도 유형 */}
          <div className="space-y-2">
            <Label htmlFor="attemptType">
              시도 유형 <span className="text-red-500">*</span>
            </Label>
            <select
              id="attemptType"
              {...register("attemptType")}
              className="w-full px-3 py-2 border rounded-md bg-background"
              disabled={isLoading || isEditing}
            >
              <option value="LOGIN">로그인</option>
              <option value="LOGOUT">로그아웃</option>
              <option value="FAILED_LOGIN">로그인 실패</option>
              <option value="LOCKED">계정 잠김</option>
              <option value="PASSWORD_RESET">비밀번호 재설정</option>
            </select>
            {errors.attemptType && (
              <p className="text-sm text-red-500">{errors.attemptType.message}</p>
            )}
          </div>

          {/* 성공 여부 */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-lg">성공 여부</Label>
              <p className="text-base text-muted-foreground">
                {success ? "성공" : "실패"}
              </p>
            </div>
            <select
              {...register("success")}
              className="px-3 py-2 border rounded-md bg-background"
              disabled={isLoading}
            >
              <option value="true">성공</option>
              <option value="false">실패</option>
            </select>
          </div>

          {/* 실패 사유 */}
          {!success && (
            <div className="space-y-2">
              <Label htmlFor="failureReason">실패 사유</Label>
              <Input
                id="failureReason"
                {...register("failureReason")}
                placeholder="INVALID_PASSWORD, ACCOUNT_LOCKED, MFA_FAILED"
                disabled={isLoading}
              />
              {errors.failureReason && (
                <p className="text-sm text-red-500">
                  {errors.failureReason.message}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 사용자 정보 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold whitespace-nowrap">사용자 정보</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>

        <div className="space-y-4">
          {/* 사용자명 */}
          <div className="space-y-2">
            <Label htmlFor="username">사용자명</Label>
            <Input
              id="username"
              {...register("username")}
              placeholder="사용자명을 입력하세요"
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          {/* 사용자 유형 */}
          <div className="space-y-2">
            <Label htmlFor="userType">사용자 유형</Label>
            <select
              id="userType"
              {...register("userType")}
              className="w-full px-3 py-2 border rounded-md bg-background"
              disabled={isLoading}
            >
              <option value="">선택</option>
              <option value="MASTER">마스터</option>
              <option value="TENANT">테넌트</option>
              <option value="SYSTEM">시스템</option>
            </select>
            {errors.userType && (
              <p className="text-sm text-red-500">{errors.userType.message}</p>
            )}
          </div>

          {/* 사용자 ID */}
          <div className="space-y-2">
            <Label htmlFor="userId">사용자 ID</Label>
            <Input
              id="userId"
              {...register("userId")}
              placeholder="사용자 ID를 입력하세요"
              disabled={isLoading}
            />
            {errors.userId && (
              <p className="text-sm text-red-500">{errors.userId.message}</p>
            )}
          </div>

          {/* 테넌트 컨텍스트 */}
          <div className="space-y-2">
            <Label htmlFor="tenantContext">테넌트 컨텍스트</Label>
            <Input
              id="tenantContext"
              {...register("tenantContext")}
              placeholder="테넌트 ID를 입력하세요"
              disabled={isLoading}
            />
            {errors.tenantContext && (
              <p className="text-sm text-red-500">
                {errors.tenantContext.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 세션 정보 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold whitespace-nowrap">세션 정보</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>

        <div className="space-y-4">
          {/* IP 주소 */}
          <div className="space-y-2">
            <Label htmlFor="ipAddress">
              IP 주소 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ipAddress"
              {...register("ipAddress")}
              placeholder="192.168.1.1"
              disabled={isLoading}
            />
            {errors.ipAddress && (
              <p className="text-sm text-red-500">{errors.ipAddress.message}</p>
            )}
          </div>

          {/* 국가 코드 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="countryCode">국가 코드</Label>
              <Input
                id="countryCode"
                {...register("countryCode")}
                placeholder="KR"
                maxLength={2}
                disabled={isLoading}
              />
              {errors.countryCode && (
                <p className="text-sm text-red-500">
                  {errors.countryCode.message}
                </p>
              )}
            </div>

            {/* 도시 */}
            <div className="space-y-2">
              <Label htmlFor="city">도시</Label>
              <Input
                id="city"
                {...register("city")}
                placeholder="Seoul"
                disabled={isLoading}
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>
          </div>

          {/* User Agent */}
          <div className="space-y-2">
            <Label htmlFor="userAgent">User Agent</Label>
            <Input
              id="userAgent"
              {...register("userAgent")}
              placeholder="Mozilla/5.0..."
              disabled={isLoading}
            />
            {errors.userAgent && (
              <p className="text-sm text-red-500">{errors.userAgent.message}</p>
            )}
          </div>

          {/* 세션 ID */}
          <div className="space-y-2">
            <Label htmlFor="sessionId">세션 ID</Label>
            <Input
              id="sessionId"
              {...register("sessionId")}
              placeholder="세션 ID를 입력하세요"
              disabled={isLoading}
            />
            {errors.sessionId && (
              <p className="text-sm text-red-500">{errors.sessionId.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* MFA 정보 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold whitespace-nowrap">MFA 정보</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>

        <div className="space-y-4">
          {/* MFA 사용 */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-lg">MFA 사용</Label>
              <p className="text-base text-muted-foreground">
                {mfaUsed ? "사용" : "미사용"}
              </p>
            </div>
            <select
              {...register("mfaUsed")}
              className="px-3 py-2 border rounded-md bg-background"
              disabled={isLoading}
            >
              <option value="true">사용</option>
              <option value="false">미사용</option>
            </select>
          </div>

          {/* MFA 방법 */}
          {mfaUsed && (
            <div className="space-y-2">
              <Label htmlFor="mfaMethod">MFA 방법</Label>
              <select
                id="mfaMethod"
                {...register("mfaMethod")}
                className="w-full px-3 py-2 border rounded-md bg-background"
                disabled={isLoading}
              >
                <option value="">선택</option>
                <option value="TOTP">TOTP</option>
                <option value="SMS">SMS</option>
                <option value="EMAIL">이메일</option>
              </select>
              {errors.mfaMethod && (
                <p className="text-sm text-red-500">{errors.mfaMethod.message}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <EntityFormButtons
        onCancel={onCancel}
        isLoading={isLoading}
        submitText={isEditing ? "수정" : "등록"}
      />
    </form>
  );
}
