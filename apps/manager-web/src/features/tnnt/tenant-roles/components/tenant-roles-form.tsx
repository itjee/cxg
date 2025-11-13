/**
 * @file tenant-roles-form.tsx
 * @description 테넌트 역할 생성/수정 폼
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TenantRole, CreateTenantRoleRequest } from '../types';

const tenantRoleSchema = z.object({
  tenant_id: z.string().min(1, '테넌트 ID를 입력하세요'),
  role_name: z
    .string()
    .min(2, '역할명은 2자 이상이어야 합니다')
    .max(100, '역할명은 100자 이하여야 합니다'),
  role_code: z
    .string()
    .min(2, '역할 코드는 2자 이상이어야 합니다')
    .max(50, '역할 코드는 50자 이하여야 합니다')
    .regex(/^[A-Z_]+$/, '역할 코드는 대문자와 언더스코어만 사용 가능합니다'),
  description: z.string().max(500, '설명은 500자 이하여야 합니다').optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

type FormData = z.infer<typeof tenantRoleSchema>;

interface TenantRolesFormProps {
  initialData?: TenantRole;
  onSubmit: (data: CreateTenantRoleRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TenantRolesForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: TenantRolesFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(tenantRoleSchema),
    defaultValues: initialData
      ? {
          tenant_id: initialData.tenant_id,
          role_name: initialData.role_name,
          role_code: initialData.role_code,
          description: initialData.description || '',
          status: initialData.status,
        }
      : {
          tenant_id: '',
          role_name: '',
          role_code: '',
          description: '',
          status: 'ACTIVE',
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
                <Input
                  {...field}
                  placeholder="테넌트 ID 입력"
                  disabled={!!initialData}
                />
              </FormControl>
              <FormDescription>역할이 속한 테넌트 ID</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>역할명</FormLabel>
              <FormControl>
                <Input {...field} placeholder="예: 관리자, 사용자" />
              </FormControl>
              <FormDescription>사용자에게 표시될 역할명</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>역할 코드</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="예: ADMIN, USER"
                  disabled={!!initialData}
                />
              </FormControl>
              <FormDescription>
                대문자와 언더스코어만 사용 가능 (수정 불가)
              </FormDescription>
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
                <Textarea
                  {...field}
                  placeholder="역할에 대한 설명을 입력하세요"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
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
                  <SelectItem value="ACTIVE">활성</SelectItem>
                  <SelectItem value="INACTIVE">비활성</SelectItem>
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
            {isSubmitting ? '처리 중...' : '저장'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
