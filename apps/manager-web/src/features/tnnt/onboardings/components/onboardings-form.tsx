/**
 * @file onboardings-form.tsx
 * @description 온보딩 프로세스 생성/수정 폼
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Onboarding, CreateOnboardingRequest } from "../types";

const onboardingSchema = z.object({
  tenant_id: z.string().min(1, "테넌트 ID를 입력하세요"),
  step_name: z.enum([
    "REGISTRATION",
    "EMAIL_VERIFICATION",
    "SCHEMA_CREATION",
    "INITIAL_SETUP",
    "DATA_MIGRATION",
    "CONFIGURATION",
    "COMPLETED",
  ]),
  step_order: z.number().int().min(1, "순서는 1 이상이어야 합니다"),
  step_status: z
    .enum(["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED", "SKIPPED"])
    .optional(),
});

type FormData = z.infer<typeof onboardingSchema>;

interface OnboardingsFormProps {
  initialData?: Onboarding;
  onSubmit: (data: CreateOnboardingRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function OnboardingsForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: OnboardingsFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: initialData
      ? {
          tenant_id: initialData.tenant_id,
          step_name: initialData.step_name,
          step_order: initialData.step_order,
          step_status: initialData.step_status,
        }
      : {
          tenant_id: "",
          step_name: "REGISTRATION",
          step_order: 1,
          step_status: "PENDING",
        },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tenant_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>테넌트 ID</FormLabel>
              <FormControl>
                <Input {...field} placeholder="테넌트 ID 입력" />
              </FormControl>
              <FormDescription>온보딩을 진행할 테넌트 ID</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="step_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>단계명</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="단계 선택" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="REGISTRATION">등록</SelectItem>
                  <SelectItem value="EMAIL_VERIFICATION">
                    이메일 인증
                  </SelectItem>
                  <SelectItem value="SCHEMA_CREATION">스키마 생성</SelectItem>
                  <SelectItem value="INITIAL_SETUP">초기 설정</SelectItem>
                  <SelectItem value="DATA_MIGRATION">
                    데이터 마이그레이션
                  </SelectItem>
                  <SelectItem value="CONFIGURATION">환경 설정</SelectItem>
                  <SelectItem value="COMPLETED">완료</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="step_order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>순서</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormDescription>온보딩 단계의 실행 순서</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="step_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>상태</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PENDING">대기</SelectItem>
                  <SelectItem value="IN_PROGRESS">진행 중</SelectItem>
                  <SelectItem value="COMPLETED">완료</SelectItem>
                  <SelectItem value="FAILED">실패</SelectItem>
                  <SelectItem value="SKIPPED">건너뜀</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "처리 중..." : "저장"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
