"use client";

/**
 * @file workflows-form.tsx
 * @description 워크플로우 폼 컴포넌트
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const workflowFormSchema = z.object({
  name: z.string().min(1, "워크플로우명을 입력해주세요"),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type WorkflowFormData = z.infer<typeof workflowFormSchema>;

interface WorkflowsFormProps {
  initialData?: WorkflowFormData;
  onSubmit: (data: WorkflowFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * 워크플로우 폼 컴포넌트
 */
export function WorkflowsForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: WorkflowsFormProps) {
  const form = useForm<WorkflowFormData>({
    resolver: zodResolver(workflowFormSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      is_active: true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* 워크플로우명 */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>워크플로우명 *</FormLabel>
              <FormControl>
                <Input
                  placeholder="워크플로우명 입력"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 설명 */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="워크플로우 설명 입력"
                  rows={3}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 활성 상태 */}
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">활성 상태</FormLabel>
                <FormDescription>워크플로우 활성화 여부</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "저장 중..." : initialData ? "수정" : "생성"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
