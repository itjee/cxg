"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EntityFormButtons } from "@/components/features";
import type { Code } from "../types";

const codeFormSchema = z.object({
  code_group_id: z.string().min(1, "코드그룹은 필수 항목입니다"),
  code: z
    .string()
    .min(1, "코드는 필수 항목입니다")
    .regex(/^[A-Z0-9_]+$/, "코드는 영문 대문자, 숫자, 언더스코어(_)만 사용 가능합니다"),
  name: z.string().min(1, "코드명은 필수 항목입니다"),
  value: z.string().min(1, "코드값은 필수 항목입니다"),
  description: z.string().optional(),
  display_order: z.number().int().min(0),
  is_active: z.boolean().optional(),
});

type CodeFormData = z.infer<typeof codeFormSchema>;

interface CodesFormProps {
  initialData?: Code;
  codeGroups?: Array<{ id: string; code: string; name: string }>;
  onSubmit: (data: CodeFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CodesForm({
  initialData,
  codeGroups = [],
  onSubmit,
  onCancel,
  isLoading = false,
}: CodesFormProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CodeFormData>({
    resolver: zodResolver(codeFormSchema),
    defaultValues: {
      code_group_id: initialData?.code_group_id || "",
      code: initialData?.code || "",
      name: initialData?.name || "",
      value: initialData?.value || "",
      description: initialData?.description || "",
      display_order: initialData?.display_order || 0,
      is_active: initialData?.is_active ?? true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        code_group_id: initialData.code_group_id,
        code: initialData.code,
        name: initialData.name,
        value: initialData.value,
        description: initialData.description || "",
        display_order: initialData.display_order,
        is_active: initialData.is_active,
      });
    }
  }, [initialData, reset]);

  const code = watch("code");
  const codeGroupId = watch("code_group_id");
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
          <Label htmlFor="code_group_id">
            코드그룹 <span className="text-red-500">*</span>
          </Label>
          <Select
            value={codeGroupId}
            onValueChange={(value) => setValue("code_group_id", value)}
            disabled={isLoading}
          >
            <SelectTrigger id="code_group_id">
              <SelectValue placeholder="코드그룹을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {codeGroups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name} ({group.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.code_group_id && (
            <p className="text-xs text-red-500">{errors.code_group_id.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            코드가 속할 그룹을 선택하세요
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">
            코드 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="code"
            placeholder="예: M"
            value={code}
            onChange={handleCodeChange}
            disabled={isLoading}
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
            placeholder="예: 남성"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            코드의 표시명을 입력하세요
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">
            코드값 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="value"
            {...register("value")}
            placeholder="예: MALE"
            disabled={isLoading}
            className="font-mono"
          />
          {errors.value && (
            <p className="text-xs text-red-500">{errors.value.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            코드의 실제 값을 입력하세요
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
            placeholder="예: 남성을 나타내는 코드"
            disabled={isLoading}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            코드에 대한 설명을 입력하세요
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="display_order">정렬순서</Label>
          <Input
            id="display_order"
            type="number"
            {...register("display_order", { valueAsNumber: true })}
            placeholder="0"
            disabled={isLoading}
          />
          {errors.display_order && (
            <p className="text-xs text-red-500">{errors.display_order.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            목록에서의 표시 순서를 입력하세요
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
