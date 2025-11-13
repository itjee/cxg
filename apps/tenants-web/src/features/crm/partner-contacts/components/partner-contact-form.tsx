'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import type {
  PartnerContact,
  CreatePartnerContactRequest,
  UpdatePartnerContactRequest,
} from '../';

interface PartnerContactFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact?: PartnerContact | null;
  mode: 'create' | 'edit';
  onSave: (data: CreatePartnerContactRequest | UpdatePartnerContactRequest) => Promise<void>;
}

export function PartnerContactForm({
  open,
  onOpenChange,
  contact,
  mode,
  onSave,
}: PartnerContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CreatePartnerContactRequest>({
    contact_name: contact?.contact_name || '',
    position: contact?.position || '',
    department: contact?.department || '',
    phone: contact?.phone || '',
    mobile: contact?.mobile || '',
    email: contact?.email || '',
    contact_type: contact?.contact_type || 'OTHER',
    is_primary: contact?.is_primary || false,
    notes: contact?.notes || '',
    status: contact?.status || 'ACTIVE',
  });

  useEffect(() => {
    if (contact && mode === 'edit') {
      setFormData({
        contact_name: contact.contact_name || '',
        position: contact.position || '',
        department: contact.department || '',
        phone: contact.phone || '',
        mobile: contact.mobile || '',
        email: contact.email || '',
        contact_type: contact.contact_type || 'OTHER',
        is_primary: contact.is_primary || false,
        notes: contact.notes || '',
        status: contact.status || 'ACTIVE',
      });
    } else {
      resetForm();
    }
    setError('');
    setValidationErrors({});
  }, [contact, mode, open]);

  const resetForm = () => {
    setFormData({
      contact_name: '',
      position: '',
      department: '',
      phone: '',
      mobile: '',
      email: '',
      contact_type: 'OTHER',
      is_primary: false,
      notes: '',
      status: 'ACTIVE',
    });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.contact_name?.trim()) {
      errors.contact_name = '담당자명은 필수입니다';
    }

    if (formData.email && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)) {
      errors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (formData.phone && !/^[0-9\-\+\(\)\s]{8,20}$/.test(formData.phone)) {
      errors.phone = '올바른 전화번호 형식이 아닙니다';
    }

    if (formData.mobile && !/^[0-9\-\+\(\)\s]{10,20}$/.test(formData.mobile)) {
      errors.mobile = '올바른 휴대폰 형식이 아닙니다';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSave(formData);
      onOpenChange(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="text-lg font-semibold">
            {mode === 'create' ? '새 담당자 추가' : '담당자 수정'}
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-md text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 담당자명 */}
            <div>
              <Label htmlFor="contact_name" className="mb-2">
                담당자명 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contact_name"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleChange}
                placeholder="담당자명을 입력하세요"
                className={
                  validationErrors.contact_name ? 'border-red-500' : ''
                }
              />
              {validationErrors.contact_name && (
                <p className="text-sm text-red-500 mt-1">
                  {validationErrors.contact_name}
                </p>
              )}
            </div>

            {/* 직책 */}
            <div>
              <Label htmlFor="position" className="mb-2">
                직책
              </Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="예: 과장, 부장"
              />
            </div>

            {/* 부서 */}
            <div>
              <Label htmlFor="department" className="mb-2">
                부서
              </Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="예: 영업팀, 구매팀"
              />
            </div>

            {/* 담당자 유형 */}
            <div>
              <Label htmlFor="contact_type" className="mb-2">
                담당자 유형
              </Label>
              <Select
                value={formData.contact_type}
                onValueChange={(value) =>
                  handleSelectChange('contact_type', value)
                }
              >
                <SelectTrigger className="bg-background border-input">
                  <SelectValue placeholder="담당자 유형 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SALES">영업담당</SelectItem>
                  <SelectItem value="PURCHASING">구매담당</SelectItem>
                  <SelectItem value="ACCOUNTING">회계담당</SelectItem>
                  <SelectItem value="TECHNICAL">기술담당</SelectItem>
                  <SelectItem value="MANAGEMENT">경영진</SelectItem>
                  <SelectItem value="OTHER">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 전화번호 */}
            <div>
              <Label htmlFor="phone" className="mb-2">
                전화번호
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="예: 02-1234-5678"
              />
              {validationErrors.phone && (
                <p className="text-sm text-red-500 mt-1">
                  {validationErrors.phone}
                </p>
              )}
            </div>

            {/* 휴대폰 */}
            <div>
              <Label htmlFor="mobile" className="mb-2">
                휴대폰
              </Label>
              <Input
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="예: 010-1234-5678"
              />
              {validationErrors.mobile && (
                <p className="text-sm text-red-500 mt-1">
                  {validationErrors.mobile}
                </p>
              )}
            </div>

            {/* 이메일 */}
            <div className="md:col-span-2">
              <Label htmlFor="email" className="mb-2">
                이메일
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="예: contact@example.com"
              />
              {validationErrors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* 주담당자 */}
            <div className="flex items-center">
              <input
                id="is_primary"
                name="is_primary"
                type="checkbox"
                checked={formData.is_primary}
                onChange={handleChange}
                className="h-4 w-4 rounded border-input cursor-pointer"
              />
              <Label htmlFor="is_primary" className="ml-2 cursor-pointer">
                주담당자로 지정
              </Label>
            </div>

            {/* 상태 */}
            <div>
              <Label htmlFor="status" className="mb-2">
                상태
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger className="bg-background border-input">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">활성</SelectItem>
                  <SelectItem value="INACTIVE">비활성</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 비고 */}
          <div>
            <Label htmlFor="notes" className="mb-2">
              비고
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="추가 정보를 입력하세요"
              rows={4}
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end border-t border-border pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '저장 중...' : '저장'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
