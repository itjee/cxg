'use client';

/**
 * @file api-keys-form.tsx
 * @description API 키 생성/수정 폼 컴포넌트
 * 
 * React Hook Form과 Zod를 사용한 폼 유효성 검증
 * - API 키 생성 모드: 모든 필수 필드 입력
 * - API 키 수정 모드: 기존 데이터 로드
 * 
 * @component Presentational Component
 * - UI 렌더링에만 집중
 * - 비즈니스 로직은 상위 컴포넌트(api-keys-edit)에서 처리
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EntityFormButtons } from '@/components/features';
import type { ApiKey, CreateApiKeyRequest, UpdateApiKeyRequest } from '../types';

/**
 * 폼 유효성 검증 스키마
 */
const apiKeyFormSchema = z.object({
  key_name: z.string().min(1, 'API 키 이름을 입력하세요'),
  user_id: z.string().min(1, '사용자 ID를 입력하세요'),
  tenant_context: z.string().optional(),
  service_account: z.string().optional(),
  scopes: z.string().optional(), // 콤마로 구분된 문자열
  allowed_ips: z.string().optional(), // 콤마로 구분된 문자열
  rate_limit_per_minute: z.number().min(1).default(1000),
  rate_limit_per_hour: z.number().min(1).default(10000),
  rate_limit_per_day: z.number().min(1).default(100000),
  expires_at: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'REVOKED']).optional(),
});

/**
 * 폼 데이터 타입
 */
type ApiKeyFormData = z.infer<typeof apiKeyFormSchema>;

/**
 * ApiKeysForm Props 인터페이스
 */
interface ApiKeysFormProps {
  initialData?: ApiKey;
  onSubmit: (data: CreateApiKeyRequest | UpdateApiKeyRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * API 키 폼 컴포넌트
 */
export function ApiKeysForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ApiKeysFormProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ApiKeyFormData>({
    resolver: zodResolver(apiKeyFormSchema),
    defaultValues: {
      key_name: '',
      user_id: '',
      tenant_context: '',
      service_account: '',
      scopes: '',
      allowed_ips: '',
      rate_limit_per_minute: 1000,
      rate_limit_per_hour: 10000,
      rate_limit_per_day: 100000,
      expires_at: '',
      status: 'ACTIVE',
    },
  });

  const status = watch('status');

  // 초기 데이터 로드 (수정 모드)
  useEffect(() => {
    if (initialData) {
      reset({
        key_name: initialData.key_name,
        user_id: initialData.user_id,
        tenant_context: initialData.tenant_context || '',
        service_account: initialData.service_account || '',
        scopes: initialData.scopes?.join(', ') || '',
        allowed_ips: initialData.allowed_ips?.join(', ') || '',
        rate_limit_per_minute: initialData.rate_limit_per_minute,
        rate_limit_per_hour: initialData.rate_limit_per_hour,
        rate_limit_per_day: initialData.rate_limit_per_day,
        expires_at: initialData.expires_at || '',
        status: initialData.status,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (formData: ApiKeyFormData) => {
    const submitData: CreateApiKeyRequest | UpdateApiKeyRequest = {
      key_name: formData.key_name,
      user_id: formData.user_id,
      tenant_context: formData.tenant_context || undefined,
      service_account: formData.service_account || undefined,
      scopes: formData.scopes ? formData.scopes.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      allowed_ips: formData.allowed_ips ? formData.allowed_ips.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      rate_limit_per_minute: formData.rate_limit_per_minute,
      rate_limit_per_hour: formData.rate_limit_per_hour,
      rate_limit_per_day: formData.rate_limit_per_day,
      expires_at: formData.expires_at || undefined,
      ...(isEditing && { status: formData.status }),
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* 기본 정보 */}
      <div className="space-y-2">
        <Label htmlFor="key_name">
          API 키 이름 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="key_name"
          {...register('key_name')}
          placeholder="Production API Key"
          disabled={isLoading}
        />
        {errors.key_name && (
          <p className="text-sm text-destructive">{errors.key_name.message}</p>
        )}
      </div>

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
        <Label htmlFor="tenant_context">테넌트 컨텍스트</Label>
        <Input
          id="tenant_context"
          {...register('tenant_context')}
          placeholder="UUID (선택사항)"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="service_account">서비스 계정</Label>
        <Input
          id="service_account"
          {...register('service_account')}
          placeholder="서비스 계정명 (선택사항)"
          disabled={isLoading}
        />
      </div>

      {/* 권한 및 스코프 */}
      <div className="space-y-2">
        <Label htmlFor="scopes">스코프 (Scopes)</Label>
        <Textarea
          id="scopes"
          {...register('scopes')}
          placeholder="read:data, write:data, admin:all (콤마로 구분)"
          disabled={isLoading}
          rows={2}
        />
        <p className="text-xs text-muted-foreground">콤마(,)로 구분하여 여러 스코프를 입력하세요</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="allowed_ips">허용 IP 주소</Label>
        <Textarea
          id="allowed_ips"
          {...register('allowed_ips')}
          placeholder="192.168.1.1, 10.0.0.1 (콤마로 구분)"
          disabled={isLoading}
          rows={2}
        />
        <p className="text-xs text-muted-foreground">콤마(,)로 구분하여 여러 IP를 입력하세요</p>
      </div>

      {/* 사용 제한 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rate_limit_per_minute">분당 제한</Label>
          <Input
            id="rate_limit_per_minute"
            type="number"
            {...register('rate_limit_per_minute', { valueAsNumber: true })}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rate_limit_per_hour">시간당 제한</Label>
          <Input
            id="rate_limit_per_hour"
            type="number"
            {...register('rate_limit_per_hour', { valueAsNumber: true })}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rate_limit_per_day">일일 제한</Label>
          <Input
            id="rate_limit_per_day"
            type="number"
            {...register('rate_limit_per_day', { valueAsNumber: true })}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* 만료일 */}
      <div className="space-y-2">
        <Label htmlFor="expires_at">만료일</Label>
        <Input
          id="expires_at"
          type="datetime-local"
          {...register('expires_at')}
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">비워두면 만료되지 않습니다</p>
      </div>

      {/* 상태 (수정 모드만) */}
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
              <SelectItem value="INACTIVE">비활성</SelectItem>
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
