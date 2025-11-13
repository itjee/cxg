"use client";

/**
 * @file permissions-form.tsx
 * @description 권한 생성/수정 폼 컴포넌트 (Presentational)
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
import type { Permissions } from "../types/permissions.types";

const permissionFormSchema = z.object({
  name: z.string().min(1, "권한명을 입력해주세요"),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type PermissionFormData = z.infer<typeof permissionFormSchema>;

interface PermissionsFormProps {
  initialData?: Permissions;
  onSubmit: (data: PermissionFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PermissionsForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: PermissionsFormProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PermissionFormData>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      is_active: initialData?.is_active ?? true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || "",
        is_active: initialData.is_active,
      });
    }
  }, [initialData, reset]);

  const isActive = watch("is_active");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 기본 정보 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold whitespace-nowrap">기본 정보</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>

        <div className="space-y-4">
          {/* 권한명 */}
          <div className="space-y-2">
            <Label htmlFor="name">
              권한명 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="권한명을 입력하세요"
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
              placeholder="설명을 입력하세요"
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* 활성 상태 */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">활성 상태</Label>
              <p className="text-sm text-muted-foreground">
                권한 활성화 여부를 설정합니다
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => setValue("is_active", checked)}
              disabled={isLoading}
            />
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
