/**
 * @file plans-form.tsx
 * @description 요금제 생성/수정 폼
 */

'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { BillingCycle, PlanStatus, PlanType } from '../types';
import type { Plan, CreatePlanRequest, UpdatePlanRequest } from '../types';

/**
 * 요금제 폼 스키마
 */
const plansFormSchema = z.object({
  code: z
    .string()
    .min(3, '최소 3자 이상이어야 합니다')
    .max(50, '최대 50자 이하여야 합니다'),
  name: z
    .string()
    .min(1, '필수 입력 항목입니다')
    .max(100, '최대 100자 이하여야 합니다'),
  type: z.enum([PlanType.TRIAL, PlanType.STANDARD, PlanType.PREMIUM, PlanType.ENTERPRISE]),
  description: z.string().optional(),
  base_price: z.coerce.number().min(0, '0 이상이어야 합니다'),
  user_price: z.coerce.number().min(0, '0 이상이어야 합니다'),
  currency: z.string().max(3),
  billing_cycle: z.enum([BillingCycle.MONTHLY, BillingCycle.QUARTERLY, BillingCycle.YEARLY]),
  max_users: z.coerce.number().positive().optional(),
  max_storage: z.coerce.number().positive().optional(),
  max_api_calls: z.coerce.number().positive().optional(),
  features: z.record(z.any()).optional(),
  start_time: z.string().refine((date) => !isNaN(Date.parse(date)), '유효한 날짜여야 합니다'),
  close_time: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), '유효한 날짜여야 합니다'),
  status: z.enum([PlanStatus.ACTIVE, PlanStatus.INACTIVE, PlanStatus.ARCHIVED]),
});

type PlansFormValues = z.infer<typeof plansFormSchema>;

interface PlansFormProps {
  initialData?: Plan;
  onSubmit: (data: CreatePlanRequest | UpdatePlanRequest) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function PlansForm({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}: PlansFormProps) {
  const form = useForm<PlansFormValues>({
    resolver: zodResolver(plansFormSchema),
    defaultValues: initialData
      ? {
          code: initialData.code,
          name: initialData.name,
          type: initialData.type,
          description: initialData.description || '',
          base_price: initialData.base_price,
          user_price: initialData.user_price,
          currency: initialData.currency,
          billing_cycle: initialData.billing_cycle,
          max_users: initialData.max_users || undefined,
          max_storage: initialData.max_storage || undefined,
          max_api_calls: initialData.max_api_calls || undefined,
          features: initialData.features || {},
          start_time: initialData.start_time,
          close_time: initialData.close_time || '',
          status: initialData.status,
        }
      : {
          code: '',
          name: '',
          type: PlanType.STANDARD,
          description: '',
          base_price: 0,
          user_price: 0,
          currency: 'KRW',
          billing_cycle: BillingCycle.MONTHLY,
          max_users: undefined,
          max_storage: undefined,
          max_api_calls: undefined,
          features: {},
          start_time: new Date().toISOString().split('T')[0],
          close_time: '',
          status: PlanStatus.ACTIVE,
        },
  });

  async function handleSubmit(values: PlansFormValues) {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* 기본 정보 섹션 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">기본 정보</h3>

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>코드 *</FormLabel>
                <FormControl>
                  <Input placeholder="PLAN_STD" {...field} disabled={!!initialData} />
                </FormControl>
                <FormDescription>요금제 고유 식별 코드 (생성 후 수정 불가)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름 *</FormLabel>
                <FormControl>
                  <Input placeholder="스탠다드" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>유형 *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={PlanType.TRIAL}>체험판</SelectItem>
                      <SelectItem value={PlanType.STANDARD}>표준</SelectItem>
                      <SelectItem value={PlanType.PREMIUM}>프리미엄</SelectItem>
                      <SelectItem value={PlanType.ENTERPRISE}>엔터프라이즈</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상태 *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={PlanStatus.ACTIVE}>활성</SelectItem>
                      <SelectItem value={PlanStatus.INACTIVE}>비활성</SelectItem>
                      <SelectItem value={PlanStatus.ARCHIVED}>보관</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>설명</FormLabel>
                <FormControl>
                  <Textarea placeholder="요금제의 특징 및 대상 고객..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 가격 정보 섹션 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">가격 정보</h3>

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="base_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>기본 요금 *</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>사용자당 추가 요금</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>추가 사용자 당 금액</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>통화 *</FormLabel>
                  <FormControl>
                    <Input placeholder="KRW" {...field} maxLength={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="billing_cycle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>청구 주기 *</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={BillingCycle.MONTHLY}>월간</SelectItem>
                    <SelectItem value={BillingCycle.QUARTERLY}>분기</SelectItem>
                    <SelectItem value={BillingCycle.YEARLY}>연간</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 사용량 제한 섹션 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">사용량 제한</h3>

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="max_users"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>최대 사용자</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="50" {...field} />
                  </FormControl>
                  <FormDescription>활성 사용자 수 제한</FormDescription>
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
                    <Input type="number" placeholder="100" {...field} />
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
                  <FormLabel>최대 API 호출</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="10000" {...field} />
                  </FormControl>
                  <FormDescription>월간 호출 수 제한</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 유효 기간 섹션 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">유효 기간</h3>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>시작일 *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="close_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>종료일</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>미지정 시 무기한 유효</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[100px]"
          >
            {isLoading ? '저장 중...' : '저장'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
        </div>
      </form>
    </Form>
  );
}
