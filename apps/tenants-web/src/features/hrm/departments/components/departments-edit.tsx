'use client';

import { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDepartmentsStore } from '../stores';
import type { Department } from '../types';

interface DepartmentsEditProps {
  departments: Department[];
  onSubmit: (formData: Record<string, any>) => void;
}

export function DepartmentsEdit({ departments, onSubmit }: DepartmentsEditProps) {
  const { formOpen, editingId, closeForm } = useDepartmentsStore();

  const editingDepartment = useMemo(
    () => departments.find((d) => d.id === editingId),
    [editingId, departments]
  );

  // 상위 부서 목록 (자기 자신 제외)
  const parentDepartments = useMemo(() => {
    return departments.filter((d) => d.id !== editingId);
  }, [departments, editingId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const values = Object.fromEntries(formData.entries());
    onSubmit(values);
  };

  return (
    <Sheet open={formOpen} onOpenChange={(open) => !open && closeForm()}>
      <SheetContent className="overflow-y-auto w-[600px]">
        <SheetHeader>
          <SheetTitle>
            {editingId ? '부서 수정' : '부서 등록'}
          </SheetTitle>
          <SheetDescription>
            {editingId
              ? '부서 정보를 수정하세요.'
              : '새로운 부서 정보를 입력하세요.'}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 mt-6"
        >
          {/* 기본 정보 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold whitespace-nowrap">
                기본 정보
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 부서 코드 */}
              <div className="space-y-2">
                <Label htmlFor="code">
                  부서 코드 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  name="code"
                  defaultValue={editingDepartment?.code || ''}
                  placeholder="예: DEV, SALES"
                  required
                  className="uppercase font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  부서를 나타내는 고유한 코드입니다
                </p>
              </div>

              {/* 부서명 */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  부서명 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingDepartment?.name || ''}
                  placeholder="예: 개발팀, 영업팀"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  부서의 표시명을 입력하세요
                </p>
              </div>

              {/* 상위 부서 */}
              <div className="col-span-2 space-y-2">
                <Label htmlFor="parent_id">상위 부서</Label>
                <Select
                  name="parent_id"
                  defaultValue={editingDepartment?.parent_id || ''}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="상위 부서 선택 (선택사항)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">없음 (최상위)</SelectItem>
                    {parentDepartments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 설명 */}
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingDepartment?.description || ''}
                  placeholder="부서에 대한 설명을 입력하세요"
                  rows={3}
                />
              </div>

              {/* 정렬 순서 */}
              <div className="space-y-2">
                <Label htmlFor="sort_order">정렬 순서</Label>
                <Input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  defaultValue={editingDepartment?.sort_order || 0}
                  placeholder="0"
                />
              </div>

              {/* 상태 */}
              <div className="space-y-2">
                <Label htmlFor="is_active">상태</Label>
                <Select
                  name="is_active"
                  defaultValue={editingDepartment?.is_active ? 'true' : 'false'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">활성</SelectItem>
                    <SelectItem value="false">비활성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <SheetFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => closeForm()}
            >
              취소
            </Button>
            <Button type="submit">
              {editingId ? '수정' : '등록'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
