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
import type { Permission } from "../types/permissions.types";

/**
 * 폼 유효성 검증 스키마
 */
const permissionFormSchema = z.object({
  name: z.string().min(1, "권한명을 입력해주세요"),
  description: z.string().optional(),
  status: z.string().min(1, "상태를 선택해주세요"),
});

type FormData = z.infer<typeof permissionFormSchema>;

interface FormProps {
  initialData?: Permission;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PermissionForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: FormProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      status: initialData?.status || "ACTIVE",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || "",
        status: initialData.status as "ACTIVE" | "INACTIVE",
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
              checked={status === "ACTIVE"}
              onCheckedChange={(checked) =>
                setValue("status", checked ? "ACTIVE" : "INACTIVE")
              }
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
