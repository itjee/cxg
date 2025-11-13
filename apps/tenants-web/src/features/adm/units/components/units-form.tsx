"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EntityFormButtons } from "@/components/features";
import type { Unit } from "../types";

const unitFormSchema = z.object({
  code: z.string().min(1, "단위 코드는 필수 항목입니다"),
  name: z.string().min(1, "단위명은 필수 항목입니다"),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
});

type UnitFormData = z.infer<typeof unitFormSchema>;

interface UnitsFormProps {
  initialData?: Unit;
  onSubmit: (data: UnitFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UnitsForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: UnitsFormProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UnitFormData>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: {
      code: initialData?.code || "",
      name: initialData?.name || "",
      description: initialData?.description || "",
      is_active: initialData?.is_active ?? true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        code: initialData.code,
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

        <div className="space-y-2">
          <Label htmlFor="code">
            단위 코드 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="code"
            {...register("code")}
            placeholder="예: EA"
            disabled={isLoading}
            className="uppercase font-mono"
          />
          {errors.code && (
            <p className="text-xs text-red-500">{errors.code.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            단위를 나타내는 고유 코드
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">
            단위명 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="예: 개"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            단위의 표시명을 입력하세요
          </p>
        </div>
      </div>

      {/* 추가 정보 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold whitespace-nowrap">추가 정보</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">설명</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="단위에 대한 설명을 입력하세요"
            disabled={isLoading}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            단위에 대한 추가 설명을 입력하세요
          </p>
        </div>
      </div>

      {/* 옵션 */}
      {isEditing && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={isActive}
              onChange={(e) => setValue("is_active", e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 rounded border-input"
            />
            <Label htmlFor="is_active" className="font-normal cursor-pointer">
              활성화
            </Label>
          </div>
        </div>
      )}

      <EntityFormButtons
        onCancel={onCancel}
        isLoading={isLoading}
        submitText={isEditing ? "수정" : "등록"}
      />
    </form>
  );
}
