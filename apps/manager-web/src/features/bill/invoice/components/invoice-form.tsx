"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EntityFormButtons } from "@/components/features";

const invoiceFormSchema = z.object({
  tenantId: z.string().min(1, "테넌트를 선택하세요"),
  issueDate: z.string().min(1, "발행일을 입력하세요"),
  dueDate: z.string().min(1, "마감일을 입력하세요"),
  amount: z.coerce.number().min(0, "금액은 0보다 커야 합니다"),
  description: z.string().optional(),
});

interface InvoiceFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function InvoiceForm({ initialData, onSubmit, onCancel, isLoading }: InvoiceFormProps) {
  const form = useForm({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: initialData || {
      tenantId: '',
      issueDate: '',
      dueDate: '',
      amount: 0,
      description: '',
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tenantId">테넌트 *</Label>
        <Select
          value={form.watch('tenantId')}
          onValueChange={(value) => form.setValue('tenantId', value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="테넌트를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Acme Corporation</SelectItem>
            <SelectItem value="2">Tech Solutions Inc.</SelectItem>
            <SelectItem value="3">Global Enterprises</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.tenantId && (
          <p className="text-xs text-red-500">{form.formState.errors.tenantId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="issueDate">발행일 *</Label>
        <Input
          id="issueDate"
          type="date"
          {...form.register('issueDate')}
          disabled={isLoading}
        />
        {form.formState.errors.issueDate && (
          <p className="text-xs text-red-500">{form.formState.errors.issueDate.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">마감일 *</Label>
        <Input
          id="dueDate"
          type="date"
          {...form.register('dueDate')}
          disabled={isLoading}
        />
        {form.formState.errors.dueDate && (
          <p className="text-xs text-red-500">{form.formState.errors.dueDate.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">금액 *</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          {...form.register('amount')}
          placeholder="금액을 입력하세요"
          disabled={isLoading}
        />
        {form.formState.errors.amount && (
          <p className="text-xs text-red-500">{form.formState.errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          {...form.register('description')}
          placeholder="청구서 설명을 입력하세요"
          disabled={isLoading}
          rows={4}
        />
      </div>

      <EntityFormButtons
        onCancel={onCancel}
        isLoading={isLoading}
        submitText={initialData ? '수정' : '생성'}
      />
    </form>
  );
}
