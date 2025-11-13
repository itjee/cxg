'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { partnerService } from '../services/partners.service';
import type { Partner, CreatePartnerRequest, UpdatePartnerRequest } from '../';

interface PartnerFormProps {
  partner?: Partner;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PartnerForm({ partner, onSuccess, onCancel }: PartnerFormProps) {
  const isEditMode = !!partner;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CreatePartnerRequest>({
    code: partner?.code || '',
    name: partner?.name || '',
    name_en: partner?.name_en || '',
    type: (partner?.type as 'CUSTOMER' | 'SUPPLIER' | 'BOTH' | 'OTHER') || 'CUSTOMER',
    tax_no: partner?.tax_no || '',
    biz_no: partner?.biz_no || '',
    biz_name: partner?.biz_name || '',
    biz_type: partner?.biz_type || 'C',
    biz_kind: partner?.biz_kind || '',
    biz_item: partner?.biz_item || '',
    ceo_name: partner?.ceo_name || '',
    postcode: partner?.postcode || '',
    address1: partner?.address1 || '',
    address2: partner?.address2 || '',
    phone: partner?.phone || '',
    fax: partner?.fax || '',
    email: partner?.email || '',
    website: partner?.website || '',
    payment_terms: partner?.payment_terms || '',
    credit_limit: partner?.credit_limit || 0,
    currency_code: partner?.currency_code || 'KRW',
    industry: partner?.industry || '',
    employee_count: partner?.employee_count,
    annual_revenue: partner?.annual_revenue,
    established_date: partner?.established_date || '',
    status: partner?.status || 'ACTIVE',
  });

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.code.trim()) {
      errors.code = '거래처 코드는 필수입니다';
    } else if (!/^[A-Z0-9_]{2,50}$/.test(formData.code)) {
      errors.code = '거래처 코드는 영문 대문자, 숫자, 언더스코어(_)만 사용 가능합니다';
    }

    if (!formData.name.trim()) {
      errors.name = '거래처명은 필수입니다';
    }

    if (!formData.type) {
      errors.type = '거래처 유형은 필수입니다';
    }

    if (formData.email && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)) {
      errors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (formData.phone && !/^[0-9\-\+\(\)\s]{8,20}$/.test(formData.phone)) {
      errors.phone = '올바른 전화번호 형식이 아닙니다';
    }

    if (formData.fax && !/^[0-9\-\+\(\)\s]{8,20}$/.test(formData.fax)) {
      errors.fax = '올바른 팩스번호 형식이 아닙니다';
    }

    if (formData.biz_no) {
      const bizNoClean = formData.biz_no.replace(/[^0-9]/g, '');
      if (bizNoClean.length !== 10) {
        errors.biz_no = '사업자등록번호는 10자리입니다';
      }
    }

    if (formData.credit_limit && formData.credit_limit < 0) {
      errors.credit_limit = '신용한도는 0 이상이어야 합니다';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'credit_limit' || name === 'employee_count' || name === 'annual_revenue'
        ? value === '' ? undefined : (isNaN(Number(value)) ? value : Number(value))
        : value,
    }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && partner) {
        await partnerService.update(partner.id, formData as UpdatePartnerRequest);
      } else {
        await partnerService.create(formData);
      }
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || '처리 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {/* 기본 정보 */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">기본 정보</legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">거래처 코드 *</Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="예: CUST_001"
              disabled={isEditMode}
              className={validationErrors.code ? 'border-red-500' : ''}
            />
            {validationErrors.code && (
              <p className="text-sm text-red-600">{validationErrors.code}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">거래처 유형 *</Label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-background [&>option]:text-foreground ${validationErrors.type ? 'border-red-500' : ''}`}
            >
              <option value="">선택하세요</option>
              <option value="CUSTOMER">고객</option>
              <option value="SUPPLIER">공급업체</option>
              <option value="BOTH">겸업</option>
              <option value="OTHER">기타</option>
            </select>
            {validationErrors.type && (
              <p className="text-sm text-red-600">{validationErrors.type}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">거래처명 (한글) *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="거래처명을 입력하세요"
              className={validationErrors.name ? 'border-red-500' : ''}
            />
            {validationErrors.name && (
              <p className="text-sm text-red-600">{validationErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name_en">거래처명 (영문)</Label>
            <Input
              id="name_en"
              name="name_en"
              value={formData.name_en || ''}
              onChange={handleChange}
              placeholder="Company name (English)"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">상태</Label>
            <select
              id="status"
              name="status"
              value={formData.status || 'ACTIVE'}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-background [&>option]:text-foreground"
            >
              <option value="ACTIVE">활성</option>
              <option value="INACTIVE">비활성</option>
              <option value="SUSPENDED">정지</option>
              <option value="CLOSED">폐쇄</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">산업/업종</Label>
            <Input
              id="industry"
              name="industry"
              value={formData.industry || ''}
              onChange={handleChange}
              placeholder="산업/업종"
            />
          </div>
        </div>
      </fieldset>

      {/* 사업자 정보 */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">사업자 정보</legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="biz_type">사업자 구분</Label>
            <select
              id="biz_type"
              name="biz_type"
              value={formData.biz_type || 'C'}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-background [&>option]:text-foreground"
            >
              <option value="C">법인</option>
              <option value="S">개인</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="biz_no">사업자등록번호</Label>
            <Input
              id="biz_no"
              name="biz_no"
              value={formData.biz_no || ''}
              onChange={handleChange}
              placeholder="예: 123-45-67890"
              className={validationErrors.biz_no ? 'border-red-500' : ''}
            />
            {validationErrors.biz_no && (
              <p className="text-sm text-red-600">{validationErrors.biz_no}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="biz_name">상호(법인명)</Label>
            <Input
              id="biz_name"
              name="biz_name"
              value={formData.biz_name || ''}
              onChange={handleChange}
              placeholder="상호(법인명)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tax_no">법인등록번호/세무번호</Label>
            <Input
              id="tax_no"
              name="tax_no"
              value={formData.tax_no || ''}
              onChange={handleChange}
              placeholder="법인등록번호"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="biz_kind">업태</Label>
            <Input
              id="biz_kind"
              name="biz_kind"
              value={formData.biz_kind || ''}
              onChange={handleChange}
              placeholder="업태"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="biz_item">종목</Label>
            <Input
              id="biz_item"
              name="biz_item"
              value={formData.biz_item || ''}
              onChange={handleChange}
              placeholder="종목"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ceo_name">대표자명</Label>
          <Input
            id="ceo_name"
            name="ceo_name"
            value={formData.ceo_name || ''}
            onChange={handleChange}
            placeholder="대표자명"
          />
        </div>
      </fieldset>

      {/* 주소 및 연락처 */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">주소 및 연락처</legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postcode">우편번호</Label>
            <Input
              id="postcode"
              name="postcode"
              value={formData.postcode || ''}
              onChange={handleChange}
              placeholder="우편번호"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address1">주소1 (기본주소)</Label>
          <Input
            id="address1"
            name="address1"
            value={formData.address1 || ''}
            onChange={handleChange}
            placeholder="기본 주소"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address2">주소2 (상세주소)</Label>
          <Input
            id="address2"
            name="address2"
            value={formData.address2 || ''}
            onChange={handleChange}
            placeholder="상세 주소"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">전화번호</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="예: 02-1234-5678"
              className={validationErrors.phone ? 'border-red-500' : ''}
            />
            {validationErrors.phone && (
              <p className="text-sm text-red-600">{validationErrors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fax">팩스번호</Label>
            <Input
              id="fax"
              name="fax"
              value={formData.fax || ''}
              onChange={handleChange}
              placeholder="예: 02-1234-5678"
              className={validationErrors.fax ? 'border-red-500' : ''}
            />
            {validationErrors.fax && (
              <p className="text-sm text-red-600">{validationErrors.fax}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              placeholder="이메일주소"
              className={validationErrors.email ? 'border-red-500' : ''}
            />
            {validationErrors.email && (
              <p className="text-sm text-red-600">{validationErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">웹사이트</Label>
            <Input
              id="website"
              name="website"
              value={formData.website || ''}
              onChange={handleChange}
              placeholder="웹사이트 URL"
            />
          </div>
        </div>
      </fieldset>

      {/* 거래 조건 */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">거래 조건</legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="payment_terms">결제 조건</Label>
            <select
              id="payment_terms"
              name="payment_terms"
              value={formData.payment_terms || ''}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-background [&>option]:text-foreground"
            >
              <option value="">선택하세요</option>
              <option value="COD">착불</option>
              <option value="NET7">NET 7일</option>
              <option value="NET15">NET 15일</option>
              <option value="NET30">NET 30일</option>
              <option value="NET45">NET 45일</option>
              <option value="NET60">NET 60일</option>
              <option value="NET90">NET 90일</option>
              <option value="PREPAID">선불</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency_code">거래 통화</Label>
            <Input
              id="currency_code"
              name="currency_code"
              value={formData.currency_code || 'KRW'}
              onChange={handleChange}
              placeholder="KRW"
              maxLength={3}
              className="uppercase"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="credit_limit">신용 한도</Label>
          <Input
            id="credit_limit"
            name="credit_limit"
            type="number"
            value={formData.credit_limit || 0}
            onChange={handleChange}
            placeholder="0"
            className={validationErrors.credit_limit ? 'border-red-500' : ''}
          />
          {validationErrors.credit_limit && (
            <p className="text-sm text-red-600">{validationErrors.credit_limit}</p>
          )}
        </div>
      </fieldset>

      {/* 추가 정보 */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">추가 정보</legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employee_count">직원 수</Label>
            <Input
              id="employee_count"
              name="employee_count"
              type="number"
              value={formData.employee_count || ''}
              onChange={handleChange}
              placeholder="직원 수"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="annual_revenue">연 매출액</Label>
            <Input
              id="annual_revenue"
              name="annual_revenue"
              type="number"
              value={formData.annual_revenue || ''}
              onChange={handleChange}
              placeholder="연 매출액"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="established_date">설립일</Label>
          <Input
            id="established_date"
            name="established_date"
            type="date"
            value={formData.established_date || ''}
            onChange={handleChange}
          />
        </div>
      </fieldset>

      {/* 버튼 */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          취소
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? '처리 중...' : isEditMode ? '수정' : '등록'}
        </Button>
      </div>
    </form>
  );
}
