"use client";

/**
 * @file api-keys-form.tsx
 * @description API 키 생성/수정 폼 컴포넌트 (Presentational)
 *
 * React Hook Form과 Zod를 사용한 폼 유효성 검증
 * - API 키 생성 모드: 모든 필드 입력
 * - API 키 수정 모드: 기존 데이터 로드
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EntityFormButtons } from "@/components/features";
import type { ApiKey } from "../types/api-keys.types";

/**
 * 폼 유효성 검증 스키마
 */
const apiKeyFormSchema = z.object({
  keyName: z.string().min(1, "API 키 이름을 입력하세요"),
  userId: z.string().min(1, "사용자 ID를 입력하세요"),
  tenantContext: z.string().optional(),
  serviceAccount: z.string().optional(),
  scopes: z.string().optional(), // 콤마로 구분된 문자열
  allowedIps: z.string().optional(), // 콤마로 구분된 문자열
  rateLimitPerMinute: z.number().min(1),
  rateLimitPerHour: z.number().min(1),
  rateLimitPerDay: z.number().min(1),
  expiresAt: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "REVOKED"]).optional(),
});

type ApiKeyFormData = z.infer<typeof apiKeyFormSchema>;

interface ApiKeysFormProps {
  initialData?: ApiKey;
  onSubmit: (data: ApiKeyFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * API 키 폼 컴포넌트
 */
export function ApiKeysForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ApiKeysFormProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ApiKeyFormData>({
    resolver: zodResolver(apiKeyFormSchema),
    defaultValues: {
      keyName: "",
      userId: "",
      tenantContext: "",
      serviceAccount: "",
      scopes: "",
      allowedIps: "",
      rateLimitPerMinute: 1000,
      rateLimitPerHour: 10000,
      rateLimitPerDay: 100000,
      expiresAt: "",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        keyName: initialData.keyName || "",
        userId: initialData.userId || "",
        tenantContext: initialData.tenantContext || "",
        serviceAccount: initialData.serviceAccount || "",
        scopes: initialData.scopes?.join(", ") || "",
        allowedIps: initialData.allowedIps?.join(", ") || "",
        rateLimitPerMinute: initialData.rateLimitPerMinute,
        rateLimitPerHour: initialData.rateLimitPerHour,
        rateLimitPerDay: initialData.rateLimitPerDay,
        expiresAt: initialData.expiresAt || "",
        status: initialData.status,
      });
    }
  }, [initialData, reset]);

  const status = watch("status");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 기본 정보 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold whitespace-nowrap">기본 정보</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="keyName">
            API 키 이름 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="keyName"
            {...register("keyName")}
            placeholder="Production API Key"
            disabled={isLoading}
          />
          {errors.keyName && (
            <p className="text-sm text-destructive">{errors.keyName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="userId">
            사용자 ID <span className="text-destructive">*</span>
          </Label>
          <Input
            id="userId"
            {...register("userId")}
            placeholder="UUID"
            disabled={isLoading || isEditing}
          />
          {errors.userId && (
            <p className="text-sm text-destructive">{errors.userId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tenantContext">테넌트 컨텍스트</Label>
          <Input
            id="tenantContext"
            {...register("tenantContext")}
            placeholder="UUID (선택사항)"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="serviceAccount">서비스 계정</Label>
          <Input
            id="serviceAccount"
            {...register("serviceAccount")}
            placeholder="서비스 계정명 (선택사항)"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* 권한 및 스코프 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold whitespace-nowrap">
            권한 및 스코프
          </h3>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="scopes">스코프 (Scopes)</Label>
          <Textarea
            id="scopes"
            {...register("scopes")}
            placeholder="read:data, write:data, admin:all (콤마로 구분)"
            disabled={isLoading}
            rows={2}
          />
          <p className="text-xs text-muted-foreground">
            콤마(,)로 구분하여 여러 스코프를 입력하세요
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="allowedIps">허용 IP 주소</Label>
          <Textarea
            id="allowedIps"
            {...register("allowedIps")}
            placeholder="192.168.1.1, 10.0.0.1 (콤마로 구분)"
            disabled={isLoading}
            rows={2}
          />
          <p className="text-xs text-muted-foreground">
            콤마(,)로 구분하여 여러 IP를 입력하세요
          </p>
        </div>
      </div>

      {/* 사용 제한 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold whitespace-nowrap">사용 제한</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rateLimitPerMinute">분당 제한</Label>
            <Input
              id="rateLimitPerMinute"
              type="number"
              {...register("rateLimitPerMinute", { valueAsNumber: true })}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rateLimitPerHour">시간당 제한</Label>
            <Input
              id="rateLimitPerHour"
              type="number"
              {...register("rateLimitPerHour", { valueAsNumber: true })}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rateLimitPerDay">일일 제한</Label>
            <Input
              id="rateLimitPerDay"
              type="number"
              {...register("rateLimitPerDay", { valueAsNumber: true })}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* 만료 및 상태 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold whitespace-nowrap">
            만료 및 상태
          </h3>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiresAt">만료일</Label>
          <Input
            id="expiresAt"
            type="datetime-local"
            {...register("expiresAt")}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            비워두면 만료되지 않습니다
          </p>
        </div>

        {isEditing && (
          <div className="space-y-2">
            <Label htmlFor="status">상태</Label>
            <Select
              value={status}
              onValueChange={(value) => setValue("status", value as any)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">활성</SelectItem>
                <SelectItem value="INACTIVE">비활성</SelectItem>
                <SelectItem value="REVOKED">취소됨</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <EntityFormButtons isLoading={isLoading} onCancel={onCancel} />
    </form>
  );
}
