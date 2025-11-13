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
import type { ExchangeRate } from "../types";

const exchangeRateFormSchema = z.object({
  from_currency: z.string().min(1, "출발 통화는 필수 항목입니다"),
  to_currency: z.string().min(1, "도착 통화는 필수 항목입니다"),
  rate: z.number().positive("환율은 양수여야 합니다"),
  effective_date: z.string().min(1, "적용일자는 필수 항목입니다"),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
});

type ExchangeRateFormData = z.infer<typeof exchangeRateFormSchema>;

interface ExchangeRatesFormProps {
  initialData?: ExchangeRate;
  currencies?: string[];
  onSubmit: (data: ExchangeRateFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ExchangeRatesForm({
  initialData,
  currencies = [],
  onSubmit,
  onCancel,
  isLoading = false,
}: ExchangeRatesFormProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ExchangeRateFormData>({
    resolver: zodResolver(exchangeRateFormSchema),
    defaultValues: {
      from_currency: initialData?.from_currency || "",
      to_currency: initialData?.to_currency || "",
      rate: initialData?.rate || 1.0,
      effective_date: initialData?.effective_date || new Date().toISOString().split("T")[0],
      description: initialData?.description || "",
      is_active: initialData?.is_active ?? true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        from_currency: initialData.from_currency,
        to_currency: initialData.to_currency,
        rate: initialData.rate,
        effective_date: initialData.effective_date,
        description: initialData.description || "",
        is_active: initialData.is_active,
      });
    }
  }, [initialData, reset]);

  const fromCurrency = watch("from_currency");
  const toCurrency = watch("to_currency");
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
          <Label htmlFor="from_currency">
            출발 통화 <span className="text-red-500">*</span>
          </Label>
          <Select
            value={fromCurrency}
            onValueChange={(value) => setValue("from_currency", value)}
            disabled={isLoading}
          >
            <SelectTrigger id="from_currency">
              <SelectValue placeholder="통화를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.from_currency && (
            <p className="text-xs text-red-500">{errors.from_currency.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            기준이 되는 통화를 선택하세요
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="to_currency">
            도착 통화 <span className="text-red-500">*</span>
          </Label>
          <Select
            value={toCurrency}
            onValueChange={(value) => setValue("to_currency", value)}
            disabled={isLoading}
          >
            <SelectTrigger id="to_currency">
              <SelectValue placeholder="통화를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.to_currency && (
            <p className="text-xs text-red-500">{errors.to_currency.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            변환될 통화를 선택하세요
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rate">
            환율 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="rate"
            type="number"
            step="0.0001"
            {...register("rate", { valueAsNumber: true })}
            placeholder="예: 1.2345"
            disabled={isLoading}
          />
          {errors.rate && (
            <p className="text-xs text-red-500">{errors.rate.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            1 출발 통화당 도착 통화 비율
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="effective_date">
            적용일자 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="effective_date"
            type="date"
            {...register("effective_date")}
            disabled={isLoading}
          />
          {errors.effective_date && (
            <p className="text-xs text-red-500">{errors.effective_date.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            환율이 적용되는 날짜
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
            placeholder="환율에 대한 설명을 입력하세요"
            disabled={isLoading}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            환율에 대한 추가 설명을 입력하세요
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
