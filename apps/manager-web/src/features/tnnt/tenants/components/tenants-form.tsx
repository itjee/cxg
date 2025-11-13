'use client';

/**
 * @file tenants-form.tsx
 * @description 테넌트 생성/수정 폼 컴포넌트
 *
 * React Hook Form과 Zod를 사용한 폼 유효성 검증
 * - 테넌트 생성 모드: 모든 필수 필드 입력
 * - 테넌트 수정 모드: 기존 데이터 로드
 *
 * @component Presentational Component
 * - UI 렌더링에만 집중
 * - 비즈니스 로직은 상위 컴포넌트(tenants-edit)에서 처리
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { Tenant, CreateTenantRequest, TenantStatus, TenantType, BizType } from '../types';

/**
 * 폼 유효성 검증 스키마
 *
 * @description Zod를 사용한 폼 데이터 유효성 검증 규칙
 * - 필수 필드: code, name, type, start_date
 * - 선택적 필드: 나머지 모든 필드
 */
const tenantFormSchema = z.object({
  // 기본 정보 (필수)
  code: z.string().min(1, '테넌트 코드를 입력하세요'),
  name: z.string().min(1, '테넌트명을 입력하세요'),
  type: z.enum(['TRIAL', 'STANDARD', 'PREMIUM', 'ENTERPRISE']).default('STANDARD'),
  start_date: z.string().min(1, '계약 시작일을 입력하세요'),

  // 사업자 정보 (선택)
  biz_no: z.string().optional().or(z.literal('')),
  biz_name: z.string().optional().or(z.literal('')),
  biz_type: z.enum(['C', 'S']).optional(),
  ceo_name: z.string().optional().or(z.literal('')),
  biz_kind: z.string().optional().or(z.literal('')),
  biz_item: z.string().optional().or(z.literal('')),

  // 주소 정보 (선택)
  postcode: z.string().optional().or(z.literal('')),
  address1: z.string().optional().or(z.literal('')),
  address2: z.string().optional().or(z.literal('')),
  phone_no: z.string().optional().or(z.literal('')),
  employee_count: z.string().optional().or(z.literal('')),

  // 계약 정보 (선택)
  close_date: z.string().optional().or(z.literal('')),

  // 지역화 설정 (선택)
  timezone: z.string().optional().or(z.literal('')),
  locale: z.string().optional().or(z.literal('')),
  currency: z.string().default('KRW'),

  // 상태 관리 (선택)
  status: z.enum(['TRIAL', 'ACTIVE', 'SUSPENDED', 'TERMINATED']).optional(),
  is_suspended: z.boolean().default(false),
  suspended_reason: z.string().optional().or(z.literal('')),
});

/**
 * 폼 데이터 타입
 */
type TenantFormData = z.infer<typeof tenantFormSchema>;

/**
 * TenantsForm Props 인터페이스
 */
interface TenantsFormProps {
  /**
   * 수정 모드 시 초기 데이터
   * - 값이 있으면 수정 모드
   * - 값이 없으면 생성 모드
   */
  initialData?: Tenant;

  /**
   * 폼 제출 핸들러
   */
  onSubmit: (data: CreateTenantRequest) => void;

  /**
   * 취소 핸들러
   */
  onCancel: () => void;

  /**
   * 로딩 상태
   */
  isLoading?: boolean;
}

/**
 * 테넌트 폼 컴포넌트
 *
 * @description
 * 테넌트 생성/수정을 위한 폼 UI
 * - React Hook Form으로 폼 상태 관리
 * - Zod로 유효성 검증
 * - 초기 데이터 로드 (수정 모드)
 */
export function TenantsForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: TenantsFormProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantFormSchema) as any,
    defaultValues: {
      code: '',
      name: '',
      type: 'STANDARD',
      start_date: '',
      biz_no: '',
      biz_name: '',
      biz_type: undefined,
      ceo_name: '',
      biz_kind: '',
      biz_item: '',
      postcode: '',
      address1: '',
      address2: '',
      phone_no: '',
      employee_count: '',
      close_date: '',
      timezone: '',
      locale: '',
      currency: 'KRW',
      status: undefined,
      is_suspended: false,
      suspended_reason: '',
    },
  });

  const type = watch('type');
  const isSuspended = watch('is_suspended');

  // 초기 데이터 로드 (수정 모드)
  useEffect(() => {
    if (initialData) {
      reset({
        code: initialData.code,
        name: initialData.name,
        type: initialData.type,
        start_date: initialData.start_date,
        biz_no: initialData.biz_no || '',
        biz_name: initialData.biz_name || '',
        biz_type: initialData.biz_type,
        ceo_name: initialData.ceo_name || '',
        biz_kind: initialData.biz_kind || '',
        biz_item: initialData.biz_item || '',
        postcode: initialData.postcode || '',
        address1: initialData.address1 || '',
        address2: initialData.address2 || '',
        phone_no: initialData.phone_no || '',
        employee_count: initialData.employee_count ? String(initialData.employee_count) : '',
        close_date: initialData.close_date || '',
        timezone: initialData.timezone || '',
        locale: initialData.locale || '',
        currency: initialData.currency || 'KRW',
        status: initialData.status,
        is_suspended: initialData.is_suspended,
        suspended_reason: initialData.suspended_reason || '',
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: TenantFormData) => {
    const requestData: CreateTenantRequest = {
      code: data.code,
      name: data.name,
      type: data.type as TenantType,
      start_date: data.start_date,
      biz_no: data.biz_no || undefined,
      biz_name: data.biz_name || undefined,
      biz_type: data.biz_type as BizType | undefined,
      ceo_name: data.ceo_name || undefined,
      biz_kind: data.biz_kind || undefined,
      biz_item: data.biz_item || undefined,
      postcode: data.postcode || undefined,
      address1: data.address1 || undefined,
      address2: data.address2 || undefined,
      phone_no: data.phone_no || undefined,
      employee_count: data.employee_count ? parseInt(data.employee_count, 10) : undefined,
      close_date: data.close_date || undefined,
      timezone: data.timezone || undefined,
      locale: data.locale || undefined,
      currency: data.currency,
      ...(isEditing && {
        status: data.status,
        is_suspended: data.is_suspended,
        suspended_reason: data.suspended_reason || undefined,
      }),
    };
    onSubmit(requestData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* 기본 정보 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">기본 정보</h3>

        {/* 테넌트 코드 */}
        <div className="space-y-2">
          <Label htmlFor="code">코드 *</Label>
          <Input
            id="code"
            {...register('code')}
            placeholder="영문+숫자 조합"
            disabled={isLoading || isEditing}
          />
          {errors.code && (
            <p className="text-xs text-red-500">{errors.code.message}</p>
          )}
        </div>

        {/* 테넌트명 */}
        <div className="space-y-2">
          <Label htmlFor="name">테넌트명 *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="테넌트명을 입력하세요"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* 테넌트 유형 */}
        <div className="space-y-2">
          <Label htmlFor="type">유형 *</Label>
          <Select value={type} onValueChange={(val) => setValue('type', val as TenantType)}>
            <SelectTrigger disabled={isLoading}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TRIAL">평가판</SelectItem>
              <SelectItem value="STANDARD">표준</SelectItem>
              <SelectItem value="PREMIUM">프리미엄</SelectItem>
              <SelectItem value="ENTERPRISE">엔터프라이즈</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-xs text-red-500">{errors.type.message}</p>
          )}
        </div>
      </div>

      {/* 계약 정보 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">계약 정보</h3>

        {/* 계약 시작일 */}
        <div className="space-y-2">
          <Label htmlFor="start_date">시작일 *</Label>
          <Input
            id="start_date"
            type="date"
            {...register('start_date')}
            disabled={isLoading}
          />
          {errors.start_date && (
            <p className="text-xs text-red-500">{errors.start_date.message}</p>
          )}
        </div>

        {/* 계약 종료일 */}
        <div className="space-y-2">
          <Label htmlFor="close_date">종료일</Label>
          <Input
            id="close_date"
            type="date"
            {...register('close_date')}
            placeholder="무기한일 경우 비워둡니다"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* 사업자 정보 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">사업자 정보</h3>

        <div className="grid grid-cols-2 gap-4">
          {/* 사업자등록번호 */}
          <div className="space-y-2">
            <Label htmlFor="biz_no">사업자등록번호</Label>
            <Input
              id="biz_no"
              {...register('biz_no')}
              placeholder="000-00-00000"
              disabled={isLoading}
            />
          </div>

          {/* 상호 */}
          <div className="space-y-2">
            <Label htmlFor="biz_name">상호(법인명)</Label>
            <Input
              id="biz_name"
              {...register('biz_name')}
              disabled={isLoading}
            />
          </div>

          {/* 사업자 구분 */}
          <div className="space-y-2">
            <Label>사업자 구분</Label>
            <Select value={watch('biz_type') || ''} onValueChange={(val) => setValue('biz_type', val as BizType)}>
              <SelectTrigger disabled={isLoading}>
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="C">법인</SelectItem>
                <SelectItem value="S">개인</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 대표자명 */}
          <div className="space-y-2">
            <Label htmlFor="ceo_name">대표자명</Label>
            <Input
              id="ceo_name"
              {...register('ceo_name')}
              disabled={isLoading}
            />
          </div>

          {/* 업태 */}
          <div className="space-y-2">
            <Label htmlFor="biz_kind">업태</Label>
            <Input
              id="biz_kind"
              {...register('biz_kind')}
              disabled={isLoading}
            />
          </div>

          {/* 종목 */}
          <div className="space-y-2">
            <Label htmlFor="biz_item">종목</Label>
            <Input
              id="biz_item"
              {...register('biz_item')}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* 주소 정보 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">주소 정보</h3>

        <div className="space-y-2">
          {/* 우편번호 */}
          <div className="grid grid-cols-3 gap-2 items-end">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="address1">주소</Label>
              <Input
                id="address1"
                {...register('address1')}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode">우편번호</Label>
              <Input
                id="postcode"
                {...register('postcode')}
                placeholder="00000"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 상세주소 */}
          <div className="space-y-2">
            <Label htmlFor="address2">상세주소</Label>
            <Input
              id="address2"
              {...register('address2')}
              disabled={isLoading}
            />
          </div>

          {/* 전화번호 */}
          <div className="space-y-2">
            <Label htmlFor="phone_no">대표 전화번호</Label>
            <Input
              id="phone_no"
              {...register('phone_no')}
              type="tel"
              disabled={isLoading}
            />
          </div>

          {/* 직원 수 */}
          <div className="space-y-2">
            <Label htmlFor="employee_count">직원 수</Label>
            <Input
              id="employee_count"
              {...register('employee_count')}
              type="number"
              min="0"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* 지역화 설정 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">지역화 설정</h3>

        <div className="grid grid-cols-3 gap-4">
          {/* 시간대 */}
          <div className="space-y-2">
            <Label htmlFor="timezone">시간대</Label>
            <Input
              id="timezone"
              {...register('timezone')}
              placeholder="Asia/Seoul"
              disabled={isLoading}
            />
          </div>

          {/* 로케일 */}
          <div className="space-y-2">
            <Label htmlFor="locale">로케일</Label>
            <Input
              id="locale"
              {...register('locale')}
              placeholder="ko-KR"
              disabled={isLoading}
            />
          </div>

          {/* 통화 */}
          <div className="space-y-2">
            <Label htmlFor="currency">통화</Label>
            <Select value={watch('currency')} onValueChange={(val) => setValue('currency', val)}>
              <SelectTrigger disabled={isLoading}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KRW">KRW (원)</SelectItem>
                <SelectItem value="USD">USD (달러)</SelectItem>
                <SelectItem value="EUR">EUR (유로)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 상태 관리 */}
      {isEditing && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">상태 관리</h3>

          {/* 테넌트 상태 */}
          <div className="space-y-2">
            <Label>상태</Label>
            <Select value={watch('status') || ''} onValueChange={(val) => setValue('status', val as TenantStatus)}>
              <SelectTrigger disabled={isLoading}>
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TRIAL">평가판</SelectItem>
                <SelectItem value="ACTIVE">활성</SelectItem>
                <SelectItem value="SUSPENDED">일시중단</SelectItem>
                <SelectItem value="TERMINATED">종료</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 일시중단 토글 */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">일시중단</Label>
              <p className="text-sm text-muted-foreground">
                테넌트를 일시적으로 중단합니다
              </p>
            </div>
            <Select
              value={isSuspended ? 'true' : 'false'}
              onValueChange={(val) => setValue('is_suspended', val === 'true')}
            >
              <SelectTrigger className="w-[120px]" disabled={isLoading}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">활성</SelectItem>
                <SelectItem value="false">비활성</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 중단 사유 */}
          {isSuspended && (
            <div className="space-y-2">
              <Label htmlFor="suspended_reason">중단 사유</Label>
              <Textarea
                id="suspended_reason"
                {...register('suspended_reason')}
                placeholder="중단 사유를 입력하세요"
                rows={2}
                disabled={isLoading}
              />
            </div>
          )}
        </div>
      )}

      {/* 폼 버튼 */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          취소
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '저장 중...' : isEditing ? '수정' : '생성'}
        </Button>
      </div>
    </form>
  );
}
