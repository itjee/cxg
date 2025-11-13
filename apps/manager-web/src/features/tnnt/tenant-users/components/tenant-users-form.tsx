/**
 * @file tenant-users-form.tsx
 * @description 테넌트 사용자 생성/수정 폼
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
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { TenantUser, CreateTenantUserRequest } from '../types';

const tenantUserSchema = z.object({
  tenant_id: z.string().min(1, '테넌트 ID를 입력하세요'),
  username: z
    .string()
    .min(3, '사용자명은 3자 이상이어야 합니다')
    .max(50, '사용자명은 50자 이하여야 합니다')
    .regex(/^[a-zA-Z0-9_-]+$/, '사용자명은 영문, 숫자, _, -만 사용 가능합니다'),
  email: z.string().email('올바른 이메일 주소를 입력하세요'),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .optional()
    .or(z.literal('')),
  full_name: z.string().max(100, '이름은 100자 이하여야 합니다').optional(),
  phone_number: z
    .string()
    .regex(/^[\d-+() ]*$/, '올바른 전화번호 형식이 아닙니다')
    .optional()
    .or(z.literal('')),
  role_id: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED']).optional(),
  is_primary: z.boolean().optional(),
});

type FormData = z.infer<typeof tenantUserSchema>;

interface TenantUsersFormProps {
  initialData?: TenantUser;
  onSubmit: (data: CreateTenantUserRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TenantUsersForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: TenantUsersFormProps) {
  const isEditMode = !!initialData;

  const form = useForm<FormData>({
    resolver: zodResolver(tenantUserSchema),
    defaultValues: initialData
      ? {
          tenant_id: initialData.tenant_id,
          username: initialData.username,
          email: initialData.email,
          password: '',
          full_name: initialData.full_name || '',
          phone_number: initialData.phone_number || '',
          role_id: initialData.role_id || '',
          status: initialData.status,
          is_primary: initialData.is_primary,
        }
      : {
          tenant_id: '',
          username: '',
          email: '',
          password: '',
          full_name: '',
          phone_number: '',
          role_id: '',
          status: 'ACTIVE',
          is_primary: false,
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
                  disabled={isEditMode}
                />
              </FormControl>
              <FormDescription>사용자가 속한 테넌트 ID</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>사용자명</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="예: john_doe"
                  disabled={isEditMode}
                />
              </FormControl>
              <FormDescription>
                영문, 숫자, _, -만 사용 가능 (수정 불가)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="user@example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isEditMode && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="8자 이상 입력" />
                </FormControl>
                <FormDescription>최소 8자 이상</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input {...field} placeholder="홍길동" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>전화번호</FormLabel>
              <FormControl>
                <Input {...field} placeholder="010-1234-5678" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>역할</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="역할 선택 (선택사항)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">역할 없음</SelectItem>
                  {/* TODO: 실제 역할 목록으로 교체 */}
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
                  <SelectItem value="PENDING">대기</SelectItem>
                  <SelectItem value="SUSPENDED">정지</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_primary"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>주 사용자</FormLabel>
                <FormDescription>
                  테넌트의 주 사용자로 설정 (삭제 불가)
                </FormDescription>
              </div>
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
