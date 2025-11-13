"use client";

/**
 * @file tasks-form.tsx
 * @description 스케줄된 작업 생성/수정 폼
 */

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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Task, CreateTaskRequest } from "../types";

const taskSchema = z.object({
  task_name: z.string().min(1, "작업명을 입력하세요").max(200),
  task_type: z.enum([
    "SYSTEM_CLEANUP",
    "DATA_SYNC",
    "REPORT_GENERATION",
    "BACKUP",
    "MAINTENANCE",
    "MONITORING",
  ]),
  description: z.string().optional(),
  schedule_expression: z.string().min(1, "스케줄 표현식을 입력하세요"),
  timezone: z.string().default("Asia/Seoul"),
  command: z.string().optional(),
  max_execution_time: z.number().min(1).default(60),
  max_instances: z.number().min(1).default(1),
  notify_success: z.boolean().default(false),
  notify_failure: z.boolean().default(true),
  enabled: z.boolean().default(true),
});

type FormData = z.infer<typeof taskSchema>;

interface TasksFormProps {
  initialData?: Task;
  onSubmit: (data: CreateTaskRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TasksForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: TasksFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData || {
      task_name: "",
      task_type: "SYSTEM_CLEANUP",
      description: "",
      schedule_expression: "0 0 * * *",
      timezone: "Asia/Seoul",
      command: "",
      max_execution_time: 60,
      max_instances: 1,
      notify_success: false,
      notify_failure: true,
      enabled: true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="task_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>작업명</FormLabel>
              <FormControl>
                <Input {...field} placeholder="작업명을 입력하세요" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="task_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>작업 유형</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="작업 유형 선택" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SYSTEM_CLEANUP">시스템 정리</SelectItem>
                  <SelectItem value="DATA_SYNC">데이터 동기화</SelectItem>
                  <SelectItem value="REPORT_GENERATION">리포트 생성</SelectItem>
                  <SelectItem value="BACKUP">백업</SelectItem>
                  <SelectItem value="MAINTENANCE">유지보수</SelectItem>
                  <SelectItem value="MONITORING">모니터링</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="작업 설명을 입력하세요" rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="schedule_expression"
          render={({ field }) => (
            <FormItem>
              <FormLabel>스케줄 (CRON 표현식)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="0 0 * * *" />
              </FormControl>
              <FormDescription>
                예: 0 0 * * * = 매일 자정, 0 */6 * * * = 6시간마다
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="max_execution_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>최대 실행 시간 (분)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="max_instances"
            render={({ field }) => (
              <FormItem>
                <FormLabel>최대 동시 실행</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="command"
          render={({ field }) => (
            <FormItem>
              <FormLabel>실행 명령어</FormLabel>
              <FormControl>
                <Input {...field} placeholder="실행할 명령어 또는 스크립트" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3 border-t pt-4">
          <FormField
            control={form.control}
            name="notify_failure"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>실패 시 알림</FormLabel>
                  <FormDescription>
                    작업 실행 실패 시 알림을 전송합니다
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notify_success"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>성공 시 알림</FormLabel>
                  <FormDescription>
                    작업 실행 성공 시 알림을 전송합니다
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>활성화</FormLabel>
                  <FormDescription>
                    작업을 활성화하여 스케줄에 따라 실행합니다
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

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
