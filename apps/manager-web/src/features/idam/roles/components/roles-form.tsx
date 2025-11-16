"use client";

/**
 * @file roles-form.tsx
 * @description 역할 생성/수정 폼 컴포넌트 (Presentational)
 *
 * React Hook Form과 Zod를 사용한 폼 유효성 검증
 * - 역할 생성 모드: 모든 필드 입력
 * - 역할 수정 모드: 기존 데이터 로드
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { EntityFormButtons } from "@/components/features";
import type { Role } from "../types/roles.types";

/**
 * 폼 유효성 검증 스키마
 */
const roleFormSchema = z.object({
  name: z.string().min(1, "역할명을 입력해주세요"),
  description: z.string().optional(),
  status: z.string().min(1, "상태를 선택해주세요"),
  permissions: z.array(z.string()).optional(),
});

type RoleFormData = z.infer<typeof roleFormSchema>;

interface RolesFormProps {
  initialData?: Role;
  onSubmit: (data: RoleFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function RolesForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: RolesFormProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      status: initialData?.status || "ACTIVE",
      permissions: initialData?.permissions || [],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || "",
        status: initialData.status || "ACTIVE",
        permissions: initialData.permissions || [],
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

        <div className="space-y-4">
          {/* 역할명 */}
          <div className="space-y-2">
            <Label htmlFor="name">
              역할명 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="역할명을 입력하세요 (예: Admin, Manager)"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* 설명 */}
          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="역할에 대한 설명을 입력하세요"
              rows={3}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* 상태 */}
          <div className="space-y-2">
            <Label htmlFor="status">
              상태 <span className="text-red-500">*</span>
            </Label>
            <select
              id="status"
              {...register("status")}
              className="w-full px-3 py-2 border rounded-md bg-background"
              disabled={isLoading}
            >
              <option value="ACTIVE">활성</option>
              <option value="INACTIVE">비활성</option>
            </select>
            {errors.status && (
              <p className="text-xs text-red-500">{errors.status.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {status === "ACTIVE" ? "활성 상태" : "비활성 상태"}
            </p>
          </div>
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
