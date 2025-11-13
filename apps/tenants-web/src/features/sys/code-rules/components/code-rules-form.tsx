'use client';

/**
 * CodeRulesForm
 * 코드 규칙 생성/수정 폼
 */

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EntityFormButtons } from '@/components/features';
import type { CodeRule } from '../types';

interface CodeRulesFormProps {
  /**
   * 수정 시 초기 데이터
   */
  initialData?: CodeRule;

  /**
   * 폼 제출 핸들러
   */
  onSubmit: (data: Record<string, any>) => void;

  /**
   * 취소 핸들러
   */
  onCancel: () => void;

  /**
   * 로딩 상태
   */
  isLoading?: boolean;
}

export function CodeRulesForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: CodeRulesFormProps) {
  const isEditing = !!initialData;
  const [exampleCode, setExampleCode] = useState('');
  const [formData, setFormData] = useState({
    entity_name: initialData?.entity_name || '',
    entity_code: initialData?.entity_code || '',
    prefix: initialData?.prefix || '',
    digit_length: String(initialData?.digit_length || 4),
    description: initialData?.description || '',
    is_active: initialData?.is_active ? 'true' : 'false',
  });

  // 예시 코드 생성
  useEffect(() => {
    const { prefix, digit_length } = formData;
    if (prefix) {
      const paddedNumber = String(1).padStart(parseInt(digit_length), '0');
      setExampleCode(`${prefix}${paddedNumber}`);
    }
  }, [formData.prefix, formData.digit_length]);

  // 초기 데이터 변경 시 폼 업데이트
  useEffect(() => {
    if (initialData) {
      setFormData({
        entity_name: initialData.entity_name || '',
        entity_code: initialData.entity_code || '',
        prefix: initialData.prefix || '',
        digit_length: String(initialData.digit_length || 4),
        description: initialData.description || '',
        is_active: initialData.is_active ? 'true' : 'false',
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitData: Record<string, any> = {
      entity_name: formData.entity_name,
      entity_code: formData.entity_code,
      prefix: formData.prefix,
      digit_length: parseInt(formData.digit_length),
      description: formData.description,
      is_active: formData.is_active === 'true',
    };
    onSubmit(submitData);
  };

  const handlePrefixChange = (value: string) => {
    const upperValue = value.toUpperCase().slice(0, 3);
    setFormData((prev) => ({ ...prev, prefix: upperValue }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 기본 정보 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold whitespace-nowrap">기본 정보</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* 엔티티명 */}
          <div className="space-y-2">
            <Label htmlFor="entity_name">
              엔티티명 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="entity_name"
              value={formData.entity_name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  entity_name: e.target.value,
                }))
              }
              placeholder="거래처"
              required
              disabled={isLoading || isEditing}
            />
            <p className="text-xs text-muted-foreground">
              한글 엔티티명을 입력하세요
            </p>
          </div>

          {/* 엔티티 코드 */}
          <div className="space-y-2">
            <Label htmlFor="entity_code">
              엔티티 코드 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="entity_code"
              value={formData.entity_code}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  entity_code: e.target.value,
                }))
              }
              placeholder="PARTNER"
              required
              disabled={isLoading || isEditing}
            />
            <p className="text-xs text-muted-foreground">
              영문 대문자 (예: PARTNER, PRODUCT)
            </p>
          </div>

          {/* 프리픽스 */}
          <div className="space-y-2">
            <Label htmlFor="prefix">
              코드 프리픽스 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="prefix"
              value={formData.prefix}
              onChange={(e) => handlePrefixChange(e.target.value)}
              placeholder="MBP"
              maxLength={3}
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              3자리 영문 대문자 (예: MBP, MPD)
            </p>
          </div>

          {/* 일련번호 자릿수 */}
          <div className="space-y-2">
            <Label htmlFor="digit_length">
              일련번호 자릿수 <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.digit_length}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, digit_length: value }))
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="자릿수를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2자리</SelectItem>
                <SelectItem value="3">3자리</SelectItem>
                <SelectItem value="4">4자리</SelectItem>
                <SelectItem value="5">5자리</SelectItem>
                <SelectItem value="6">6자리</SelectItem>
                <SelectItem value="7">7자리</SelectItem>
                <SelectItem value="8">8자리</SelectItem>
                <SelectItem value="9">9자리</SelectItem>
                <SelectItem value="10">10자리</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              일련번호의 자릿수를 선택하세요
            </p>
          </div>

          {/* 예시 코드 */}
          <div className="space-y-2">
            <Label htmlFor="example_code">예시 코드</Label>
            <Input id="example_code" value={exampleCode} disabled />
            <p className="text-xs text-muted-foreground">
              자동 생성되는 코드 형식입니다
            </p>
          </div>

          {/* 상태 */}
          <div className="space-y-2">
            <Label htmlFor="is_active">
              상태 <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.is_active}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, is_active: value }))
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="상태를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">활성</SelectItem>
                <SelectItem value="false">비활성</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              규칙의 활성화 여부를 선택하세요
            </p>
          </div>
        </div>

        {/* 설명 */}
        <div className="space-y-2">
          <Label htmlFor="description">설명</Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="코드 규칙에 대한 설명을 입력하세요"
            className="w-full px-3 py-2 text-sm border rounded-md border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            rows={3}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            이 규칙의 목적을 설명하세요
          </p>
        </div>
      </div>

      {/* 현재 상태 */}
      {isEditing && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold whitespace-nowrap">
              현재 상태
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_number">현재 일련번호</Label>
            <Input
              id="current_number"
              type="number"
              value={initialData?.current_number || 0}
              disabled
            />
            <p className="text-xs text-muted-foreground">
              다음에 발급될 번호입니다
            </p>
          </div>
        </div>
      )}

      <EntityFormButtons
        onCancel={onCancel}
        isLoading={isLoading}
        submitText={isEditing ? '수정' : '등록'}
      />
    </form>
  );
}
