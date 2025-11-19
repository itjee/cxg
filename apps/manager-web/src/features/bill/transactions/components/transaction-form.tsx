"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EntityFormButtons } from "@/components/features";
import type { UpdateTransactionRequest } from "../types";

/**
 * 거래 수정 폼 스키마
 * - 상태, 처리 시간, 실패 사유 등 수정 가능한 필드만 포함
 * - 거래 번호, 금액 등은 수정 불가
 */
const transactionFormSchema = z.object({
  status: z.enum(["PENDING", "SUCCESS", "FAILED", "CANCELED"], {
    errorMap: () => ({ message: "올바른 상태를 선택하세요" }),
  }),
  processed_at: z.string().optional().nullable(),
  failed_at: z.string().optional().nullable(),
  failure_reason: z.string().max(500, "실패 사유는 500자 이하여야 합니다").optional().nullable(),
  exchange_rate: z.coerce.number().positive("환율은 0보다 커야 합니다").optional().nullable(),
  card_digits: z.string().max(4, "카드 끝 4자리는 4자 이하여야 합니다").optional().nullable(),
});

type TransactionFormData = z.infer<typeof transactionFormSchema>;

interface TransactionFormProps {
  initialData?: any;
  onSubmit: (data: UpdateTransactionRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TransactionForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: TransactionFormProps) {
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      status: initialData?.status || "PENDING",
      processed_at: initialData?.processed_at || null,
      failed_at: initialData?.failed_at || null,
      failure_reason: initialData?.failure_reason || null,
      exchange_rate: initialData?.exchange_rate || undefined,
      card_digits: initialData?.card_digits || null,
    },
  });

  const handleFormSubmit = (data: TransactionFormData) => {
    // null 값들을 제거하여 API로 전달
    const submitData: UpdateTransactionRequest = {
      status: data.status as any,
      ...(data.processed_at && { processed_at: data.processed_at }),
      ...(data.failed_at && { failed_at: data.failed_at }),
      ...(data.failure_reason && { failure_reason: data.failure_reason }),
      ...(data.exchange_rate !== undefined && { exchange_rate: data.exchange_rate }),
      ...(data.card_digits && { card_digits: data.card_digits }),
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="status">상태 *</Label>
        <Select
          value={form.watch("status")}
          onValueChange={(value) => form.setValue("status", value as any)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="상태를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">대기 중</SelectItem>
            <SelectItem value="SUCCESS">성공</SelectItem>
            <SelectItem value="FAILED">실패</SelectItem>
            <SelectItem value="CANCELED">취소됨</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.status && (
          <p className="text-sm text-red-500">{form.formState.errors.status.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="processed_at">처리 시간</Label>
          <Input
            id="processed_at"
            type="datetime-local"
            {...form.register("processed_at")}
            disabled={isLoading}
          />
          {form.formState.errors.processed_at && (
            <p className="text-sm text-red-500">{form.formState.errors.processed_at.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="failed_at">실패 시간</Label>
          <Input
            id="failed_at"
            type="datetime-local"
            {...form.register("failed_at")}
            disabled={isLoading}
          />
          {form.formState.errors.failed_at && (
            <p className="text-sm text-red-500">{form.formState.errors.failed_at.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="failure_reason">실패 사유</Label>
        <Textarea
          id="failure_reason"
          {...form.register("failure_reason")}
          placeholder="거래 실패 사유를 입력하세요"
          disabled={isLoading}
          rows={3}
        />
        {form.formState.errors.failure_reason && (
          <p className="text-sm text-red-500">{form.formState.errors.failure_reason.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="exchange_rate">환율</Label>
          <Input
            id="exchange_rate"
            type="number"
            step="0.0001"
            {...form.register("exchange_rate")}
            placeholder="환율을 입력하세요"
            disabled={isLoading}
          />
          {form.formState.errors.exchange_rate && (
            <p className="text-sm text-red-500">{form.formState.errors.exchange_rate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="card_digits">카드 끝 4자리</Label>
          <Input
            id="card_digits"
            maxLength={4}
            {...form.register("card_digits")}
            placeholder="0000"
            disabled={isLoading}
          />
          {form.formState.errors.card_digits && (
            <p className="text-sm text-red-500">{form.formState.errors.card_digits.message}</p>
          )}
        </div>
      </div>

      <EntityFormButtons
        onCancel={onCancel}
        isLoading={isLoading}
        submitText={initialData ? "수정" : "생성"}
      />
    </form>
  );
}
