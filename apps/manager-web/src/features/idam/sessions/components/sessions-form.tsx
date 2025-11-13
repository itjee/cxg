'use client';

/**
 * @file sessions-form.tsx
 * @description 세션 생성/수정 폼 컴포넌트
 * 
 * 세션은 보통 시스템에서 자동 생성되므로 
 * 이 폼은 주로 테스트나 수동 관리 목적으로 사용됩니다.
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EntityFormButtons } from '@/components/features';
import type { Session, CreateSessionRequest, UpdateSessionRequest } from '../types';

const sessionFormSchema = z.object({
  user_id: z.string().min(1, '사용자 ID를 입력하세요'),
  ip_address: z.string().min(1, 'IP 주소를 입력하세요'),
  expires_at: z.string().min(1, '만료일시를 선택하세요'),
  tenant_context: z.string().optional(),
  session_type: z.enum(['WEB', 'API', 'MOBILE']).default('WEB'),
  fingerprint: z.string().optional(),
  user_agent: z.string().optional(),
  country_code: z.string().optional(),
  city: z.string().optional(),
  status: z.enum(['ACTIVE', 'EXPIRED', 'REVOKED']).optional(),
});

type SessionFormData = z.infer<typeof sessionFormSchema>;

interface SessionsFormProps {
  initialData?: Session;
  onSubmit: (data: CreateSessionRequest | UpdateSessionRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SessionsForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: SessionsFormProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      user_id: '',
      ip_address: '',
      expires_at: '',
      tenant_context: '',
      session_type: 'WEB',
      fingerprint: '',
      user_agent: '',
      country_code: '',
      city: '',
      status: 'ACTIVE',
    },
  });

  const sessionType = watch('session_type');
  const status = watch('status');

  useEffect(() => {
    if (initialData) {
      reset({
        user_id: initialData.user_id,
        ip_address: initialData.ip_address,
        expires_at: initialData.expires_at,
        tenant_context: initialData.tenant_context || '',
        session_type: initialData.session_type,
        fingerprint: initialData.fingerprint || '',
        user_agent: initialData.user_agent || '',
        country_code: initialData.country_code || '',
        city: initialData.city || '',
        status: initialData.status,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (formData: SessionFormData) => {
    const submitData: CreateSessionRequest | UpdateSessionRequest = {
      user_id: formData.user_id,
      ip_address: formData.ip_address,
      expires_at: formData.expires_at,
      tenant_context: formData.tenant_context || undefined,
      session_type: formData.session_type,
      fingerprint: formData.fingerprint || undefined,
      user_agent: formData.user_agent || undefined,
      country_code: formData.country_code || undefined,
      city: formData.city || undefined,
      ...(isEditing && { status: formData.status }),
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="user_id">
          사용자 ID <span className="text-destructive">*</span>
        </Label>
        <Input
          id="user_id"
          {...register('user_id')}
          placeholder="UUID"
          disabled={isLoading || isEditing}
        />
        {errors.user_id && (
          <p className="text-sm text-destructive">{errors.user_id.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ip_address">
          IP 주소 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="ip_address"
          {...register('ip_address')}
          placeholder="192.168.1.1"
          disabled={isLoading}
        />
        {errors.ip_address && (
          <p className="text-sm text-destructive">{errors.ip_address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="session_type">세션 타입</Label>
          <Select
            value={sessionType}
            onValueChange={(value) => setValue('session_type', value as any)}
            disabled={isLoading || isEditing}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WEB">웹</SelectItem>
              <SelectItem value="API">API</SelectItem>
              <SelectItem value="MOBILE">모바일</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expires_at">
            만료일시 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="expires_at"
            type="datetime-local"
            {...register('expires_at')}
            disabled={isLoading}
          />
          {errors.expires_at && (
            <p className="text-sm text-destructive">{errors.expires_at.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tenant_context">테넌트 컨텍스트</Label>
        <Input
          id="tenant_context"
          {...register('tenant_context')}
          placeholder="UUID (선택사항)"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country_code">국가 코드</Label>
          <Input
            id="country_code"
            {...register('country_code')}
            placeholder="KR"
            maxLength={2}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">도시</Label>
          <Input
            id="city"
            {...register('city')}
            placeholder="Seoul"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="user_agent">User Agent</Label>
        <Input
          id="user_agent"
          {...register('user_agent')}
          placeholder="Mozilla/5.0..."
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fingerprint">디바이스 핑거프린트</Label>
        <Input
          id="fingerprint"
          {...register('fingerprint')}
          placeholder="디바이스 고유 식별자"
          disabled={isLoading}
        />
      </div>

      {isEditing && (
        <div className="space-y-2">
          <Label htmlFor="status">상태</Label>
          <Select
            value={status}
            onValueChange={(value) => setValue('status', value as any)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">활성</SelectItem>
              <SelectItem value="EXPIRED">만료됨</SelectItem>
              <SelectItem value="REVOKED">취소됨</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <EntityFormButtons
        isEditing={isEditing}
        isLoading={isLoading}
        onCancel={onCancel}
      />
    </form>
  );
}
