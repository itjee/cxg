'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PartnerPortalTabDetailsProps {
  partnerId: string;
  data?: {
    code: string;
    name: string;
    englishName?: string;
    bizNo: string;
    type: 'supplier' | 'customer' | 'both';
    status: 'active' | 'inactive';
    tier?: string;
    industry?: string;
    address: string;
    tel: string;
    fax?: string;
    email: string;
    website?: string;
    accountOwner: string;
    accountOwnerDept?: string;
    annualRevenue?: number;
    establishedYear?: number;
    employees?: number;
    paymentTerms?: string;
    creditLimit?: number;
    taxId?: string;
    notes?: string;
    bankName?: string;
    bankAccountNo?: string;
  };
}

export function PartnerPortalTabDetails({
  partnerId,
  data = {
    code: 'CUST_001',
    name: 'ABC고객사',
    englishName: 'ABC Customer Inc.',
    bizNo: '234-56-78901',
    type: 'customer' as const,
    status: 'active' as const,
    tier: '우수',
    industry: '제조업',
    address: '서울시 강남구 테헤란로 123',
    tel: '02-2345-6789',
    fax: '02-2345-6790',
    email: 'contact@customer1.com',
    website: 'www.abccustomer.com',
    accountOwner: '김영업',
    accountOwnerDept: '영업3팀',
    annualRevenue: 50000000000,
    establishedYear: 2015,
    employees: 250,
    paymentTerms: '30일',
    creditLimit: 100000000,
    taxId: '234-56-78901',
    notes: '우수한 거래처, 정기적인 재주문 고객',
    bankName: '국민은행',
    bankAccountNo: '123-456-789012',
  },
}: PartnerPortalTabDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data);

  const handleInputChange = (field: string, value: string | number | undefined) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSave = () => {
    // API 호출 로직
    console.log('저장:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
  };

  const FormField = ({
    label,
    value,
    field,
    type = 'text',
  }: {
    label: string;
    value: string | number | undefined;
    field: string;
    type?: string;
  }) => (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-border last:border-b-0">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {isEditing ? (
        <input
          type={type}
          value={value || ''}
          onChange={(e) =>
            handleInputChange(
              field,
              type === 'number' ? (e.target.value ? parseInt(e.target.value) : undefined) : e.target.value
            )
          }
          className="col-span-2 px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
        />
      ) : (
        <div className="col-span-2 text-sm text-foreground">{value || '-'}</div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 컨트롤 버튼 */}
      <div className="flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button onClick={handleSave} size="sm">
              <Save className="h-4 w-4 mr-2" />
              저장
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              취소
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)} size="sm">
            <Edit2 className="h-4 w-4 mr-2" />
            편집
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 기본정보 */}
        <Card className={cn(
          "relative overflow-hidden",
          "border border-border",
          "bg-gradient-to-br from-neutral-100 dark:from-neutral-700/50 to-neutral-200 dark:to-neutral-800/50",
          "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10",
          "transition-all duration-300 group cursor-pointer"
        )}>
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
            "from-primary/5 via-primary/2 to-transparent"
          )} />
          <CardContent className="p-6 relative z-10">
            <h3 className="text-lg font-semibold text-foreground mb-6">기본 정보</h3>
            <div className="divide-y divide-border">
            <FormField label="거래처 코드" value={formData.code} field="code" />
            <FormField label="거래처명" value={formData.name} field="name" />
            <FormField label="영문명" value={formData.englishName} field="englishName" />
            <FormField label="사업자번호" value={formData.bizNo} field="bizNo" />
            <div className="grid grid-cols-3 gap-4 py-3 border-b border-border">
              <label className="text-sm font-medium text-foreground">거래처 구분</label>
              {isEditing ? (
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="col-span-2 px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                >
                  <option value="supplier">공급사</option>
                  <option value="customer">고객사</option>
                  <option value="both">공급사/고객사</option>
                </select>
              ) : (
                <div className="col-span-2 text-sm text-foreground">
                  {formData.type === 'supplier'
                    ? '공급사'
                    : formData.type === 'customer'
                      ? '고객사'
                      : '공급사/고객사'}
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4 py-3 border-b border-border">
              <label className="text-sm font-medium text-foreground">상태</label>
              {isEditing ? (
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="col-span-2 px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                >
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                </select>
              ) : (
                <div className="col-span-2 text-sm text-foreground">
                  {formData.status === 'active' ? '활성' : '비활성'}
                </div>
              )}
            </div>
              <FormField label="등급" value={formData.tier} field="tier" />
              <FormField label="업종" value={formData.industry} field="industry" />
            </div>
          </CardContent>
        </Card>

        {/* 연락처정보 */}
        <Card className={cn(
          "relative overflow-hidden",
          "border border-border",
          "bg-gradient-to-br from-neutral-100 dark:from-neutral-700/50 to-neutral-200 dark:to-neutral-800/50",
          "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10",
          "transition-all duration-300 group cursor-pointer"
        )}>
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
            "from-primary/5 via-primary/2 to-transparent"
          )} />
          <CardContent className="p-6 relative z-10">
            <h3 className="text-lg font-semibold text-foreground mb-6">연락처 정보</h3>
            <div className="divide-y divide-border">
            <FormField label="주소" value={formData.address} field="address" />
            <FormField label="전화" value={formData.tel} field="tel" />
            <FormField label="팩스" value={formData.fax} field="fax" />
            <FormField label="이메일" value={formData.email} field="email" type="email" />
              <FormField label="웹사이트" value={formData.website} field="website" />
            </div>
          </CardContent>
        </Card>

        {/* 재무정보 */}
        <Card className={cn(
          "relative overflow-hidden",
          "border border-border",
          "bg-gradient-to-br from-neutral-100 dark:from-neutral-700/50 to-neutral-200 dark:to-neutral-800/50",
          "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10",
          "transition-all duration-300 group cursor-pointer"
        )}>
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
            "from-primary/5 via-primary/2 to-transparent"
          )} />
          <CardContent className="p-6 relative z-10">
            <h3 className="text-lg font-semibold text-foreground mb-6">재무 정보</h3>
            <div className="divide-y divide-border">
            <FormField
              label="연간 매출액"
              value={formData.annualRevenue ? `₩${(formData.annualRevenue / 1000000000).toFixed(1)}B` : undefined}
              field="annualRevenue"
              type="number"
            />
            <FormField label="설립 연도" value={formData.establishedYear} field="establishedYear" type="number" />
            <FormField label="임직원 수" value={formData.employees} field="employees" type="number" />
            <FormField label="결제조건" value={formData.paymentTerms} field="paymentTerms" />
              <FormField
                label="신용한도"
                value={formData.creditLimit ? `₩${(formData.creditLimit / 1000000).toFixed(0)}M` : undefined}
                field="creditLimit"
                type="number"
              />
            </div>
          </CardContent>
        </Card>

        {/* 은행정보 */}
        <Card className={cn(
          "relative overflow-hidden",
          "border border-border",
          "bg-gradient-to-br from-neutral-100 dark:from-neutral-700/50 to-neutral-200 dark:to-neutral-800/50",
          "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10",
          "transition-all duration-300 group cursor-pointer"
        )}>
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
            "from-primary/5 via-primary/2 to-transparent"
          )} />
          <CardContent className="p-6 relative z-10">
            <h3 className="text-lg font-semibold text-foreground mb-6">은행 정보</h3>
            <div className="divide-y divide-border">
              <FormField label="은행명" value={formData.bankName} field="bankName" />
              <FormField label="계좌번호" value={formData.bankAccountNo} field="bankAccountNo" />
              <FormField label="세금ID" value={formData.taxId} field="taxId" />
            </div>
          </CardContent>
        </Card>

        {/* 비고 */}
        <div className="lg:col-span-2">
          <Card className={cn(
            "relative overflow-hidden",
            "border border-border",
            "bg-gradient-to-br from-neutral-100 dark:from-neutral-700/50 to-neutral-200 dark:to-neutral-800/50",
            "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10",
            "transition-all duration-300 group cursor-pointer"
          )}>
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
              "from-primary/5 via-primary/2 to-transparent"
            )} />
            <CardContent className="p-6 relative z-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">비고</h3>
              {isEditing ? (
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none min-h-24"
                  placeholder="특기사항을 입력하세요"
                />
              ) : (
                <div className="text-sm text-foreground whitespace-pre-wrap">{formData.notes || '-'}</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
