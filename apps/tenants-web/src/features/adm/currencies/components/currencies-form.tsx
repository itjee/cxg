"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EntityFormButtons } from "@/components/features";
import type { Currency } from "../types";

const currencyFormSchema = z.object({
  code: z.string().min(1, "통화 코드는 필수 항목입니다").max(3, "통화 코드는 3자리입니다"),
  name: z.string().min(1, "통화명은 필수 항목입니다"),
  symbol: z.string().min(1, "통화 기호는 필수 항목입니다"),
  decimal_places: z.number().int().min(0).max(10, "소수점 자리는 0~10 사이여야 합니다"),
  exchange_rate: z.number().positive("환율은 양수여야 합니다").optional(),
  is_active: z.boolean().optional(),
});

type CurrencyFormData = z.infer<typeof currencyFormSchema>;

interface CurrenciesFormProps {
  initialData?: Currency;
  onSubmit: (data: CurrencyFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CurrenciesForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: CurrenciesFormProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CurrencyFormData>({
    resolver: zodResolver(currencyFormSchema),
    defaultValues: {
      code: initialData?.code || "",
      name: initialData?.name || "",
      symbol: initialData?.symbol || "",
      decimal_places: initialData?.decimal_places || 2,
      exchange_rate: initialData?.exchange_rate || undefined,
      is_active: initialData?.is_active ?? true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        code: initialData.code,
        name: initialData.name,
        symbol: initialData.symbol,
        decimal_places: initialData.decimal_places,
        exchange_rate: initialData.exchange_rate,
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
            통화 코드 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="code"
            {...register("code")}
            placeholder="예: USD"
            disabled={isLoading}
            className="uppercase font-mono"
            maxLength={3}
          />
          {errors.code && (
            <p className="text-xs text-red-500">{errors.code.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            ISO 4217 통화 코드 (3자리)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">
            통화명 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="예: US Dollar"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            통화의 전체 이름을 입력하세요
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="symbol">
            통화 기호 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="symbol"
            {...register("symbol")}
            placeholder="예: $"
            disabled={isLoading}
          />
          {errors.symbol && (
            <p className="text-xs text-red-500">{errors.symbol.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            통화 기호를 입력하세요
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="decimal_places">
            소수점 자리 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="decimal_places"
            type="number"
            {...register("decimal_places", { valueAsNumber: true })}
            placeholder="2"
            disabled={isLoading}
            min="0"
            max="10"
          />
          {errors.decimal_places && (
            <p className="text-xs text-red-500">{errors.decimal_places.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            통화의 소수점 자리수 (보통 2)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="exchange_rate">환율 (선택)</Label>
          <Input
            id="exchange_rate"
            type="number"
            step="0.0001"
            {...register("exchange_rate", { valueAsNumber: true })}
            placeholder="예: 1.0"
            disabled={isLoading}
          />
          {errors.exchange_rate && (
            <p className="text-xs text-red-500">{errors.exchange_rate.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            기준 통화 대비 환율
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
