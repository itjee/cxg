"use client";

/**
 * @file subscriptions-form.tsx
 * @description 구독 생성/수정 폼 컴포넌트
 *
 * React Hook Form + Zod를 사용한 폼 구현
 * - 필드 정의 및 Validation
 * - 제출 핸들러
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type {
  Subscription,
  CreateSubscriptionRequest,
  BillingCycle,
} from "../types/subscriptions.types";

const subscriptionFormSchema = z.object({
  tenant_id: z.string().min(1, "테넌트를 선택하세요"),
  plan_id: z.string().min(1, "플랜을 선택하세요"),
  start_date: z.string().min(1, "시작일을 입력하세요"),
  close_date: z.string().default(""),
  billing_cycle: z.enum(["MONTHLY", "QUARTERLY", "YEARLY"]).default("MONTHLY"),
  max_users: z.string().default(""),
  max_storage: z.string().default(""),
  max_api_calls: z.string().default(""),
  base_amount: z.string().min(1, "기본 요금은 필수입니다"),
  user_amount: z.string().default(""),
  currency: z.string().default("KRW"),
  auto_renewal: z.boolean().default(true),
  noti_renewal: z.boolean().default(false),
});

type FormData = z.infer<typeof subscriptionFormSchema>;

interface SubscriptionsFormProps {
  initialData?: Subscription;
  onSubmit: (data: CreateSubscriptionRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function SubscriptionsForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: SubscriptionsFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(subscriptionFormSchema) as any,
    defaultValues: {
      tenant_id: initialData?.tenant_id || "",
      plan_id: initialData?.plan_id || "",
      start_date: initialData?.start_date || "",
      close_date: initialData?.close_date || "",
      billing_cycle: initialData?.billing_cycle || "MONTHLY",
      max_users: String(initialData?.max_users ?? ""),
      max_storage: String(initialData?.max_storage ?? ""),
      max_api_calls: String(initialData?.max_api_calls ?? ""),
      base_amount: String(initialData?.base_amount ?? ""),
      user_amount: String(initialData?.user_amount ?? ""),
      currency: initialData?.currency || "KRW",
      auto_renewal: initialData?.auto_renewal ?? true,
      noti_renewal: initialData?.noti_renewal ?? false,
    },
  });

  const handleFormSubmit = (data: FormData) => {
    const requestData: CreateSubscriptionRequest = {
      tenant_id: data.tenant_id,
      plan_id: data.plan_id,
      start_date: data.start_date,
      close_date: data.close_date,
      billing_cycle: data.billing_cycle as BillingCycle,
      max_users: data.max_users ? parseInt(data.max_users, 10) : undefined,
      max_storage: data.max_storage ? parseInt(data.max_storage, 10) : undefined,
      max_api_calls: data.max_api_calls ? parseInt(data.max_api_calls, 10) : undefined,
      base_amount: parseFloat(data.base_amount),
      user_amount: data.user_amount ? parseFloat(data.user_amount) : undefined,
      currency: data.currency || "KRW",
      auto_renewal: data.auto_renewal,
      noti_renewal: data.noti_renewal,
    };
    onSubmit(requestData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* 기본 정보 */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold">기본 정보</h3>

          <FormField
            control={form.control}
            name="tenant_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>테넌트 *</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="테넌트를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* API에서 테넌트 목록을 가져와야 함 */}
                      <SelectItem value="tenant-1">테넌트 1</SelectItem>
                      <SelectItem value="tenant-2">테넌트 2</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plan_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>플랜 *</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="플랜을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* API에서 플랜 목록을 가져와야 함 */}
                      <SelectItem value="plan-basic">Basic</SelectItem>
                      <SelectItem value="plan-pro">Pro</SelectItem>
                      <SelectItem value="plan-enterprise">
                        Enterprise
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 구독 기간 */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold">구독 기간</h3>

          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>시작일 *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="close_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>종료일</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="billing_cycle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>청구 주기</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MONTHLY">월별</SelectItem>
                      <SelectItem value="QUARTERLY">분기별</SelectItem>
                      <SelectItem value="YEARLY">연별</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 사용량 제한 */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold">사용량 제한</h3>

          <FormField
            control={form.control}
            name="max_users"
            render={({ field }) => (
              <FormItem>
                <FormLabel>최대 사용자 수</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    placeholder="최대 사용자 수"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="max_storage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>최대 스토리지 (GB)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    placeholder="최대 스토리지"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="max_api_calls"
            render={({ field }) => (
              <FormItem>
                <FormLabel>최대 API 호출 수</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    placeholder="최대 API 호출 수"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 요금 정보 */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold">요금 정보</h3>

          <FormField
            control={form.control}
            name="base_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>기본 요금 *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    placeholder="기본 요금"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="user_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>사용자당 추가 요금</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    placeholder="추가 요금"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>통화</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KRW">KRW (원)</SelectItem>
                      <SelectItem value="USD">USD (달러)</SelectItem>
                      <SelectItem value="EUR">EUR (유로)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 갱신 설정 */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold">갱신 설정</h3>

          <FormField
            control={form.control}
            name="auto_renewal"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel>자동 갱신</FormLabel>
                <FormControl>
                  <Select
                    value={field.value ? "true" : "false"}
                    onValueChange={(val) => field.onChange(val === "true")}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">활성</SelectItem>
                      <SelectItem value="false">비활성</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="noti_renewal"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel>갱신 알림</FormLabel>
                <FormControl>
                  <Select
                    value={field.value ? "true" : "false"}
                    onValueChange={(val) => field.onChange(val === "true")}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">활성</SelectItem>
                      <SelectItem value="false">비활성</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "저장 중..." : "저장"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
