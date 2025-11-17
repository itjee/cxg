"use client";

/**
 * @file roles-form.tsx
 * @description 역할 생성/수정 폼 컴포넌트 (Presentational)
 *
 * React Hook Form과 Zod를 사용한 폼 유효성 검증
 * - 역할 생성 모드: 모든 필드 입력
 * - 역할 수정 모드: 기존 데이터 로드, code 필드 비활성화
 */

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HelpCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EntityFormButtons } from "@/components/features";
import type { Role } from "../types/roles.types";

/**
 * 필드별 힌트 설명
 */
const fieldHints = {
  code: "역할의 고유한 코드를 입력하세요 (수정 후 변경 불가)",
  name: "역할의 표시 이름을 입력하세요",
  description: "역할의 목적과 권한을 설명하세요",
  category: "역할이 속한 카테고리를 선택하세요",
  level: "역할의 레벨을 설정하세요",
  scope: "역할의 범위를 선택하세요 (GLOBAL: 전체, TENANT: 테넌트)",
  status: "역할의 활성 여부를 선택하세요",
  isDefault: "기본 역할 여부를 설정하세요",
  priority: "역할의 우선순위를 설정하세요 (숫자가 클수록 높은 우선순위)",
};

/**
 * 힌트 아이콘 컴포넌트
 */
function HintIcon({ hint }: { hint: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center w-4 h-4 ml-1 text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => {
            e.preventDefault();
            setOpen(!open);
          }}
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 text-xs p-2">{hint}</PopoverContent>
    </Popover>
  );
}

/**
 * 폼 유효성 검증 스키마
 */
const roleFormSchema = z.object({
  code: z.string().min(1, "역할 코드를 입력해주세요"),
  name: z.string().min(1, "역할명을 입력해주세요"),
  description: z.string().optional(),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  level: z.number().min(0, "레벨은 0 이상이어야 합니다"),
  scope: z.string().min(1, "범위를 선택해주세요"),
  isDefault: z.boolean().optional(),
  priority: z.number().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"], {
    message: "상태를 선택해주세요",
  }),
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
    control,
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      code: initialData?.code || "",
      name: initialData?.name || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      level: initialData?.level || 0,
      scope: initialData?.scope || "GLOBAL",
      isDefault: initialData?.isDefault || false,
      priority: initialData?.priority || 0,
      status: (["ACTIVE", "INACTIVE"].includes(
        initialData?.status as string
      )
        ? initialData?.status
        : "ACTIVE") as "ACTIVE" | "INACTIVE",
    },
  });

  useEffect(() => {
    if (initialData) {
      // 수정 모드: 기존 데이터로 form 업데이트
      reset({
        code: initialData.code || "",
        name: initialData.name || "",
        description: initialData.description || "",
        category: initialData.category || "",
        level: initialData.level || 0,
        scope: initialData.scope || "GLOBAL",
        isDefault: initialData.isDefault || false,
        priority: initialData.priority || 0,
        status: (["ACTIVE", "INACTIVE"].includes(
          initialData?.status as string
        )
          ? initialData?.status
          : "ACTIVE") as "ACTIVE" | "INACTIVE",
      });
    } else {
      // 생성 모드: form 초기화
      reset({
        code: "",
        name: "",
        description: "",
        category: "",
        level: 0,
        scope: "GLOBAL",
        isDefault: false,
        priority: 0,
        status: "ACTIVE" as "ACTIVE" | "INACTIVE",
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 기본 정보 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold whitespace-nowrap">기본 정보</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* 역할 코드 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="code" className="text-sm">
                역할 코드 <span className="text-red-500">*</span>
              </Label>
              <HintIcon hint={fieldHints.code} />
            </div>
            <Input
              id="code"
              {...register("code")}
              placeholder="역할 코드를 입력하세요"
              disabled={isLoading || isEditing}
            />
            {errors.code && (
              <p className="text-xs text-red-500">{errors.code.message}</p>
            )}
          </div>

          {/* 역할명 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="name" className="text-sm">
                역할명 <span className="text-red-500">*</span>
              </Label>
              <HintIcon hint={fieldHints.name} />
            </div>
            <Input
              id="name"
              {...register("name")}
              placeholder="역할명을 입력하세요"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* 카테고리 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="category" className="text-sm">
                카테고리 <span className="text-red-500">*</span>
              </Label>
              <HintIcon hint={fieldHints.category} />
            </div>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MANAGER_ADMIN">관리자</SelectItem>
                    <SelectItem value="PLATFORM_SUPPORT">플랫폼 지원</SelectItem>
                    <SelectItem value="TENANT_ADMIN">테넌트 관리자</SelectItem>
                    <SelectItem value="TENANT_USER">테넌트 사용자</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-xs text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* 범위 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="scope" className="text-sm">
                범위 <span className="text-red-500">*</span>
              </Label>
              <HintIcon hint={fieldHints.scope} />
            </div>
            <Controller
              name="scope"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                  <SelectTrigger id="scope">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GLOBAL">전체</SelectItem>
                    <SelectItem value="TENANT">테넌트</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.scope && (
              <p className="text-xs text-red-500">{errors.scope.message}</p>
            )}
          </div>

          {/* 레벨 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="level" className="text-sm">
                레벨
              </Label>
              <HintIcon hint={fieldHints.level} />
            </div>
            <Input
              id="level"
              type="number"
              {...register("level", { valueAsNumber: true })}
              placeholder="0"
              disabled={isLoading}
            />
            {errors.level && (
              <p className="text-xs text-red-500">{errors.level.message}</p>
            )}
          </div>

          {/* 우선순위 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="priority" className="text-sm">
                우선순위
              </Label>
              <HintIcon hint={fieldHints.priority} />
            </div>
            <Input
              id="priority"
              type="number"
              {...register("priority", { valueAsNumber: true })}
              placeholder="0"
              disabled={isLoading}
            />
            {errors.priority && (
              <p className="text-xs text-red-500">{errors.priority.message}</p>
            )}
          </div>

          {/* 상태 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="status" className="text-sm">
                상태 <span className="text-red-500">*</span>
              </Label>
              <HintIcon hint={fieldHints.status} />
            </div>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">활성</SelectItem>
                    <SelectItem value="INACTIVE">비활성</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-xs text-red-500">{errors.status.message}</p>
            )}
          </div>
        </div>

        {/* 설명 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="description" className="text-sm">
              설명
            </Label>
            <HintIcon hint={fieldHints.description} />
          </div>
          <Input
            id="description"
            {...register("description")}
            placeholder="역할에 대한 설명을 입력하세요"
            disabled={isLoading}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
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
