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
import type { Resource, CreateResourceRequest } from "../types";

const resourceSchema = z.object({
  resource: z.enum([
    "DATABASE",
    "STORAGE",
    "COMPUTE",
    "NETWORK",
    "CACHE",
    "LOAD_BALANCER",
    "CDN",
  ]),
  resource_name: z.string().min(1, "리소스명을 입력하세요"),
  resource_id: z.string().min(1, "리소스 ID를 입력하세요"),
  region: z.string().optional(),
  instance_type: z.string().optional(),
  cpu_cores: z.number().optional(),
  memory_size: z.number().optional(),
  storage_size: z.number().optional(),
  monthly_cost: z.number().optional(),
  status: z
    .enum([
      "PROVISIONING",
      "RUNNING",
      "STOPPED",
      "TERMINATED",
      "ERROR",
      "MAINTENANCE",
    ])
    .optional(),
});

type FormData = z.infer<typeof resourceSchema>;

interface ResourcesFormProps {
  initialData?: Resource;
  onSubmit: (data: CreateResourceRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ResourcesForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: ResourcesFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: initialData || {
      resource: "COMPUTE",
      resource_name: "",
      resource_id: "",
      region: "ap-northeast-2",
      status: "PROVISIONING",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="resource_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>리소스명 *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="예: my-database-server"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resource"
          render={({ field }) => (
            <FormItem>
              <FormLabel>리소스 유형 *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="리소스 유형 선택" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="DATABASE">데이터베이스</SelectItem>
                  <SelectItem value="STORAGE">스토리지</SelectItem>
                  <SelectItem value="COMPUTE">컴퓨팅</SelectItem>
                  <SelectItem value="NETWORK">네트워크</SelectItem>
                  <SelectItem value="CACHE">캐시</SelectItem>
                  <SelectItem value="LOAD_BALANCER">로드밸런서</SelectItem>
                  <SelectItem value="CDN">CDN</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resource_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>리소스 ID *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="예: i-1234567890abcdef0"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>리전</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="ap-northeast-2"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instance_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>인스턴스 타입</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="예: t3.medium"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="cpu_cores"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPU 코어</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="memory_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>메모리 (MB)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="storage_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>스토리지 (GB)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
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
