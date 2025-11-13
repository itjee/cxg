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
import type { Setting, SettingValueType } from "../types";

const settingFormSchema = z.object({
  key: z.string().min(1, "설정 키는 필수 항목입니다"),
  value: z.string().min(1, "설정 값은 필수 항목입니다"),
  value_type: z.enum(["STRING", "NUMBER", "BOOLEAN", "JSON"]),
  default_value: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  is_active: z.boolean().optional(),
  is_system: z.boolean().optional(),
  is_encrypted: z.boolean().optional(),
});

type SettingFormData = z.infer<typeof settingFormSchema>;

interface SettingsFormProps {
  initialData?: Setting;
  onSubmit: (data: SettingFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SettingsForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: SettingsFormProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SettingFormData>({
    resolver: zodResolver(settingFormSchema),
    defaultValues: {
      key: initialData?.key || "",
      value: initialData?.value || "",
      value_type: initialData?.value_type || "STRING",
      default_value: initialData?.default_value || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      is_active: initialData?.is_active ?? true,
      is_system: initialData?.is_system || false,
      is_encrypted: initialData?.is_encrypted || false,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        key: initialData.key,
        value: initialData.value,
        value_type: initialData.value_type,
        default_value: initialData.default_value || "",
        description: initialData.description || "",
        category: initialData.category || "",
        is_active: initialData.is_active,
        is_system: initialData.is_system,
        is_encrypted: initialData.is_encrypted,
      });
    }
  }, [initialData, reset]);

  const valueType = watch("value_type");
  const isActive = watch("is_active");
  const isSystem = watch("is_system");
  const isEncrypted = watch("is_encrypted");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 기본 정보 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold whitespace-nowrap">기본 정보</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="key">
            설정 키 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="key"
            {...register("key")}
            placeholder="예: app.name"
            disabled={isLoading || (isEditing && initialData?.is_system)}
            className="font-mono"
          />
          {errors.key && (
            <p className="text-xs text-red-500">{errors.key.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            설정을 식별하는 고유 키
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="value_type">
            값 타입 <span className="text-red-500">*</span>
          </Label>
          <Select
            value={valueType}
            onValueChange={(value) => setValue("value_type", value as SettingValueType)}
            disabled={isLoading}
          >
            <SelectTrigger id="value_type">
              <SelectValue placeholder="타입을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STRING">문자열</SelectItem>
              <SelectItem value="NUMBER">숫자</SelectItem>
              <SelectItem value="BOOLEAN">불린</SelectItem>
              <SelectItem value="JSON">JSON</SelectItem>
            </SelectContent>
          </Select>
          {errors.value_type && (
            <p className="text-xs text-red-500">{errors.value_type.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            설정 값의 데이터 타입
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">
            설정 값 <span className="text-red-500">*</span>
          </Label>
          {valueType === "JSON" ? (
            <Textarea
              id="value"
              {...register("value")}
              placeholder='{"key": "value"}'
              disabled={isLoading}
              rows={5}
              className="font-mono"
            />
          ) : (
            <Input
              id="value"
              {...register("value")}
              placeholder="예: My Application"
              disabled={isLoading}
              type={valueType === "NUMBER" ? "number" : "text"}
            />
          )}
          {errors.value && (
            <p className="text-xs text-red-500">{errors.value.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            설정의 현재 값
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="default_value">기본 값</Label>
          <Input
            id="default_value"
            {...register("default_value")}
            placeholder="기본 값 (선택)"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            설정의 기본 값 (리셋 시 사용)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">카테고리</Label>
          <Input
            id="category"
            {...register("category")}
            placeholder="예: application"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            설정을 그룹화할 카테고리
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
            placeholder="설정에 대한 설명을 입력하세요"
            disabled={isLoading}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            설정에 대한 상세 설명
          </p>
        </div>
      </div>

      {/* 옵션 */}
      <div className="space-y-3">
        {!isEditing && (
          <>
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
                시스템 설정으로 등록 (삭제 불가)
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_encrypted"
                checked={isEncrypted}
                onChange={(e) => setValue("is_encrypted", e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 rounded border-input"
              />
              <Label htmlFor="is_encrypted" className="font-normal cursor-pointer">
                암호화 저장
              </Label>
            </div>
          </>
        )}

        {isEditing && (
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
              시스템 설정 (수정 제한)
            </Label>
          </div>
        )}

        {isEditing && initialData?.is_encrypted && (
          <div className="flex items-center gap-2 opacity-50">
            <input
              type="checkbox"
              id="is_encrypted_readonly"
              checked={true}
              disabled={true}
              className="w-4 h-4 rounded border-input"
            />
            <Label htmlFor="is_encrypted_readonly" className="font-normal">
              암호화 적용됨
            </Label>
          </div>
        )}
      </div>

      <EntityFormButtons
        onCancel={onCancel}
        isLoading={isLoading}
        submitText={isEditing ? "수정" : "등록"}
      />
    </form>
  );
}
