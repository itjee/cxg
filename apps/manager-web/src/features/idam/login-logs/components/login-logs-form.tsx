'use client';

/**
 * @file login-logs-form.tsx
 * @description 로그인 이력 생성 폼 컴포넌트
 * 
 * 로그인 이력은 일반적으로 시스템에서 자동 생성되므로
 * 이 폼은 주로 테스트나 수동 관리 목적으로 사용됩니다.
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import type { LoginLog, CreateLoginLogRequest } from '../types';

const loginLogFormSchema = z.object({
  attempt_type: z.enum(['LOGIN', 'LOGOUT', 'FAILED_LOGIN', 'LOCKED', 'PASSWORD_RESET']),
  success: z.boolean(),
  ip_address: z.string().min(1, 'IP 주소를 입력하세요'),
  mfa_used: z.boolean().default(false),
  user_id: z.string().optional(),
  user_type: z.enum(['MASTER', 'TENANT', 'SYSTEM']).optional(),
  tenant_context: z.string().optional(),
  username: z.string().optional(),
  failure_reason: z.string().optional(),
  session_id: z.string().optional(),
  user_agent: z.string().optional(),
  country_code: z.string().max(2).optional(),
  city: z.string().optional(),
  mfa_method: z.enum(['TOTP', 'SMS', 'EMAIL']).optional(),
});

type LoginLogFormData = z.infer<typeof loginLogFormSchema>;

interface LoginLogsFormProps {
  initialData?: LoginLog;
  onSubmit: (data: CreateLoginLogRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function LoginLogsForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: LoginLogsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<LoginLogFormData>({
    resolver: zodResolver(loginLogFormSchema),
    defaultValues: {
      attempt_type: 'LOGIN',
      success: true,
      ip_address: '',
      mfa_used: false,
      user_id: '',
      user_type: undefined,
      tenant_context: '',
      username: '',
      failure_reason: '',
      session_id: '',
      user_agent: '',
      country_code: '',
      city: '',
      mfa_method: undefined,
    },
  });

  const attemptType = watch('attempt_type');
  const success = watch('success');
  const mfaUsed = watch('mfa_used');
  const userType = watch('user_type');
  const mfaMethod = watch('mfa_method');

  useEffect(() => {
    if (initialData) {
      reset({
        attempt_type: initialData.attempt_type,
        success: initialData.success,
        ip_address: initialData.ip_address,
        mfa_used: initialData.mfa_used,
        user_id: initialData.user_id || '',
        user_type: initialData.user_type,
        tenant_context: initialData.tenant_context || '',
        username: initialData.username || '',
        failure_reason: initialData.failure_reason || '',
        session_id: initialData.session_id || '',
        user_agent: initialData.user_agent || '',
        country_code: initialData.country_code || '',
        city: initialData.city || '',
        mfa_method: initialData.mfa_method,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (formData: LoginLogFormData) => {
    const submitData: CreateLoginLogRequest = {
      attempt_type: formData.attempt_type,
      success: formData.success,
      ip_address: formData.ip_address,
      mfa_used: formData.mfa_used,
      user_id: formData.user_id || undefined,
      user_type: formData.user_type,
      tenant_context: formData.tenant_context || undefined,
      username: formData.username || undefined,
      failure_reason: formData.failure_reason || undefined,
      session_id: formData.session_id || undefined,
      user_agent: formData.user_agent || undefined,
      country_code: formData.country_code || undefined,
      city: formData.city || undefined,
      mfa_method: formData.mfa_method,
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="attempt_type">
            시도 타입 <span className="text-destructive">*</span>
          </Label>
          <Select
            value={attemptType}
            onValueChange={(value) => setValue('attempt_type', value as any)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOGIN">로그인</SelectItem>
              <SelectItem value="LOGOUT">로그아웃</SelectItem>
              <SelectItem value="FAILED_LOGIN">로그인 실패</SelectItem>
              <SelectItem value="LOCKED">계정 잠김</SelectItem>
              <SelectItem value="PASSWORD_RESET">비밀번호 재설정</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>성공 여부</Label>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="success"
              checked={success}
              onCheckedChange={(checked) => setValue('success', checked as boolean)}
              disabled={isLoading}
            />
            <label htmlFor="success" className="text-sm">성공</label>
          </div>
        </div>
      </div>

      {!success && (
        <div className="space-y-2">
          <Label htmlFor="failure_reason">실패 사유</Label>
          <Input
            id="failure_reason"
            {...register('failure_reason')}
            placeholder="INVALID_PASSWORD, ACCOUNT_LOCKED, MFA_FAILED"
            disabled={isLoading}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username">사용자명</Label>
          <Input
            id="username"
            {...register('username')}
            placeholder="사용자명"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="user_type">사용자 타입</Label>
          <Select
            value={userType || ''}
            onValueChange={(value) => setValue('user_type', value as any || undefined)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">선택 안함</SelectItem>
              <SelectItem value="MASTER">마스터</SelectItem>
              <SelectItem value="TENANT">테넌트</SelectItem>
              <SelectItem value="SYSTEM">시스템</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
        <div className="flex items-center space-x-2">
          <Checkbox
            id="mfa_used"
            checked={mfaUsed}
            onCheckedChange={(checked) => setValue('mfa_used', checked as boolean)}
            disabled={isLoading}
          />
          <Label htmlFor="mfa_used">MFA 사용</Label>
        </div>
      </div>

      {mfaUsed && (
        <div className="space-y-2">
          <Label htmlFor="mfa_method">MFA 방법</Label>
          <Select
            value={mfaMethod || ''}
            onValueChange={(value) => setValue('mfa_method', value as any || undefined)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">선택 안함</SelectItem>
              <SelectItem value="TOTP">TOTP</SelectItem>
              <SelectItem value="SMS">SMS</SelectItem>
              <SelectItem value="EMAIL">이메일</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          취소
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '처리 중...' : '저장'}
        </Button>
      </div>
    </form>
  );
}
