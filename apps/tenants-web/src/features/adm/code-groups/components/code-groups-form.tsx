"use client";

/**
 * CodeGroupsForm
 * 코드그룹 생성/수정 폼
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EntityFormButtons } from "@/components/features";
import type { CodeGroup, CreateCodeGroupRequest, UpdateCodeGroupRequest } from "../types";

// 폼 스키마 정의
const codeGroupFormSchema = z.object({
  code: z
    .string()
    .min(1, "코드는 필수 항목입니다")
    .regex(/^[A-Z0-9_]+$/, "코드는 영문 대문자, 숫자, 언더스코어(_)만 사용 가능합니다"),
  name: z.string().min(1, "코드명은 필수 항목입니다"),
  description: z.string().optional(),
  is_system: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

type CodeGroupFormData = z.infer<typeof codeGroupFormSchema>;

interface CodeGroupsFormProps {
  /**
   * 수정 시 초기 데이터
   */
  initialData?: CodeGroup;

  /**
   * 폼 제출 핸들러
   */
  onSubmit: (data: CodeGroupFormData) => void;

  /**
   * 취소 핸들러
   */
  onCancel: () => void;

  /**
   * 로딩 상태
   */
  isLoading?: boolean;
}

export function CodeGroupsForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: CodeGroupsFormProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CodeGroupFormData>({
    resolver: zodResolver(codeGroupFormSchema),
    defaultValues: {
      code: initialData?.code || "",
      name: initialData?.name || "",
      description: initialData?.description || "",
      is_system: initialData?.is_system || false,
      is_active: initialData?.is_active ?? true,
    },
  });

  // initialData 변경 시 폼 리셋
  useEffect(() => {
    if (initialData) {
      reset({
        code: initialData.code,
        name: initialData.name,
        description: initialData.description || "",
        is_system: initialData.is_system,
        is_active: initialData.is_active,
      });
    }
  }, [initialData, reset]);

  const code = watch("code");
  const isSystem = watch("is_system");
  const isActive = watch("is_active");

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, "_");
    setValue("code", formatted);
  };

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
            코드 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="code"
            placeholder="예: GENDER"
            value={code}
            onChange={handleCodeChange}
            disabled={isLoading || (isEditing && initialData?.is_system)}
            className="uppercase font-mono"
          />
          {errors.code && (
            <p className="text-xs text-red-500">{errors.code.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            영문 대문자, 숫자, 언더스코어(_)만 사용 가능합니다
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">
            코드명 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="예: 성별"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            코드그룹의 표시명을 입력하세요
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
            placeholder="예: 성별 구분 코드"
            disabled={isLoading}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            코드그룹에 대한 설명을 입력하세요
          </p>
        </div>
      </div>

      {/* 옵션 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold whitespace-nowrap">옵션</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>

        <div className="space-y-3">
          {!isEditing && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_system"
                checked={isSystem}
                onChange={(e) => setValue("is_system", e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 rounded border-input"
              />
              <Label htmlFor="is_system" className="font-normal cursor-pointer">
                시스템 코드그룹으로 설정 (삭제 불가)
              </Label>
            </div>
          )}

          {isEditing && initialData && !initialData.is_system && (
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
          )}

          {isEditing && initialData?.is_system && (
            <div className="flex items-center gap-2 opacity-50">
              <input
                type="checkbox"
                id="is_system_readonly"
                checked={true}
                disabled={true}
                className="w-4 h-4 rounded border-input"
              />
              <Label htmlFor="is_system_readonly" className="font-normal">
                시스템 코드그룹 (수정 불가)
              </Label>
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
