'use client';

/**
 * PermissionsForm
 * 권한 생성/수정 폼
 */

import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { EntityFormButtons } from '@/components/features';
import type { Permission } from '../types';

interface PermissionsFormProps {
  /**
   * 수정 시 초기 데이터
   */
  initialData?: Permission;

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

export function PermissionsForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: PermissionsFormProps) {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState({
    code: initialData?.code || '',
    name: initialData?.name || '',
    module: initialData?.module || '',
    resource: initialData?.resource || '',
    action: initialData?.action || '',
    description: initialData?.description || '',
    active: initialData?.active ?? true,
  });

  // 초기 데이터 변경 시 폼 업데이트
  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || '',
        name: initialData.name || '',
        module: initialData.module || '',
        resource: initialData.resource || '',
        action: initialData.action || '',
        description: initialData.description || '',
        active: initialData.active ?? true,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitData: Record<string, any> = {
      code: formData.code,
      name: formData.name,
      module: formData.module,
      resource: formData.resource,
      action: formData.action,
      description: formData.description,
      active: formData.active,
    };
    onSubmit(submitData);
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
          {/* 권한 코드 */}
          <div className="space-y-2">
            <Label htmlFor="code">
              권한 코드 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  code: e.target.value,
                }))
              }
              placeholder="READ, WRITE, DELETE"
              required
              disabled={isLoading || isEditing}
            />
            <p className="text-xs text-muted-foreground">
              영문 대문자로 입력하세요
            </p>
          </div>

          {/* 권한명 */}
          <div className="space-y-2">
            <Label htmlFor="name">
              권한명 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="읽기, 쓰기, 삭제"
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              권한의 표시명을 입력하세요
            </p>
          </div>

          {/* 모듈 */}
          <div className="space-y-2">
            <Label htmlFor="module">
              모듈 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="module"
              value={formData.module}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  module: e.target.value,
                }))
              }
              placeholder="users, roles, settings"
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              권한이 속한 모듈을 입력하세요
            </p>
          </div>

          {/* 리소스 */}
          <div className="space-y-2">
            <Label htmlFor="resource">
              리소스 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="resource"
              value={formData.resource}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  resource: e.target.value,
                }))
              }
              placeholder="user, role, setting"
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              리소스 이름을 입력하세요
            </p>
          </div>

          {/* 액션 */}
          <div className="space-y-2">
            <Label htmlFor="action">
              액션 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="action"
              value={formData.action}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  action: e.target.value,
                }))
              }
              placeholder="create, read, update, delete"
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              수행할 액션을 입력하세요
            </p>
          </div>

          {/* 상태 */}
          <div className="space-y-2">
            <Label htmlFor="active">
              상태 <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    active: e.target.checked,
                  }))
                }
                className="w-4 h-4"
                disabled={isLoading}
              />
              <Label htmlFor="active" className="font-normal cursor-pointer">
                활성
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              권한의 활성화 여부를 선택하세요
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
            placeholder="권한에 대한 설명을 입력하세요"
            className="w-full px-3 py-2 text-sm border rounded-md border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            rows={4}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            이 권한의 목적을 설명하세요
          </p>
        </div>
      </div>

      <EntityFormButtons
        onCancel={onCancel}
        isLoading={isLoading}
        submitText={isEditing ? '수정' : '등록'}
      />
    </form>
  );
}
