'use client';

/**
 * RolesForm
 * 역할 생성/수정 폼
 */

import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { EntityFormButtons } from '@/components/features';
import type { Role, CreateRoleRequest, UpdateRoleRequest } from '../types';

interface RolesFormProps {
  /**
   * 수정 시 초기 데이터
   */
  initialData?: Role;

  /**
   * 폼 제출 핸들러
   */
  onSubmit: (data: CreateRoleRequest | UpdateRoleRequest) => void;

  /**
   * 취소 핸들러
   */
  onCancel: () => void;

  /**
   * 로딩 상태
   */
  isLoading?: boolean;
}

export function RolesForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: RolesFormProps) {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    active: initialData?.active ?? true,
    permissions: initialData?.permissionIds?.join(', ') || '',
  });

  // 초기 데이터 변경 시 폼 업데이트
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        active: initialData.active ?? true,
        permissions: initialData.permissionIds?.join(', ') || '',
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const permissionIds = formData.permissions
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    
    if (isEditing) {
      const submitData: UpdateRoleRequest = {
        name: formData.name,
        description: formData.description,
        active: formData.active,
        permissionIds,
      };
      onSubmit(submitData);
    } else {
      const submitData: CreateRoleRequest = {
        name: formData.name,
        description: formData.description,
        permissionIds,
      };
      onSubmit(submitData);
    }
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
          {/* 역할명 */}
          <div className="space-y-2">
            <Label htmlFor="name">
              역할명 <span className="text-red-500">*</span>
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
              placeholder="역할명을 입력하세요"
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              시스템에서 사용할 고유한 역할명입니다
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
              역할의 활성화 여부를 선택하세요
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
            placeholder="역할에 대한 설명을 입력하세요"
            className="w-full px-3 py-2 text-sm border rounded-md border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            rows={4}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            이 역할의 목적과 기능에 대해 설명하세요
          </p>
        </div>
      </div>

      {/* 권한 정보 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold whitespace-nowrap">권한 정보</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="permissions">
              권한 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="permissions"
              value={formData.permissions}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  permissions: e.target.value,
                }))
              }
              placeholder="권한을 쉼표로 구분하여 입력하세요"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              이 역할에 부여할 권한을 입력하세요
            </p>
          </div>
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
