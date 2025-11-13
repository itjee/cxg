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
import { useEmployeeStore } from '../stores';
import type { Employee } from '../types';

interface EmployeesEditProps {
  employees: Employee[];
  onSubmit: (formData: Record<string, any>) => void;
}

export function EmployeesEdit({ employees, onSubmit }: EmployeesEditProps) {
  const { formOpen, editingId, closeForm } = useEmployeeStore();

  const editingEmployee = useMemo(
    () => employees.find((e) => e.id === editingId),
    [editingId, employees]
  );

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
            {editingId ? '직원 수정' : '직원 등록'}
          </SheetTitle>
          <SheetDescription>
            {editingId
              ? '직원 정보를 수정하세요.'
              : '새로운 직원 정보를 입력하세요.'}
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
              {/* 사원번호 */}
              <div className="space-y-2">
                <Label htmlFor="employee_number">
                  사원번호 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="employee_number"
                  name="employee_number"
                  defaultValue={editingEmployee?.employee_number || ''}
                  placeholder="예: E001"
                  required
                />
              </div>

              {/* 사용자명 */}
              <div className="space-y-2">
                <Label htmlFor="username">
                  사용자명 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="username"
                  name="username"
                  defaultValue={editingEmployee?.username || ''}
                  placeholder="예: john.doe"
                  required
                />
              </div>

              {/* 이름 */}
              <div className="col-span-2 space-y-2">
                <Label htmlFor="full_name">
                  이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  defaultValue={editingEmployee?.full_name || ''}
                  placeholder="예: 홍길동"
                  required
                />
              </div>

              {/* 이메일 */}
              <div className="col-span-2 space-y-2">
                <Label htmlFor="email">
                  이메일 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={editingEmployee?.email || ''}
                  placeholder="예: hong@example.com"
                  required
                />
              </div>

              {/* 전화번호 */}
              <div className="space-y-2">
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={editingEmployee?.phone || ''}
                  placeholder="예: 010-1234-5678"
                />
              </div>

              {/* 직책 */}
              <div className="space-y-2">
                <Label htmlFor="position">직책</Label>
                <Input
                  id="position"
                  name="position"
                  defaultValue={editingEmployee?.position || ''}
                  placeholder="예: 선임 개발자"
                />
              </div>

              {/* 입사일 */}
              <div className="space-y-2">
                <Label htmlFor="hire_date">입사일</Label>
                <Input
                  id="hire_date"
                  name="hire_date"
                  type="date"
                  defaultValue={editingEmployee?.hire_date || ''}
                />
              </div>

              {/* 상태 */}
              <div className="space-y-2">
                <Label htmlFor="is_active">상태</Label>
                <Select
                  name="is_active"
                  defaultValue={editingEmployee?.is_active ? 'true' : 'false'}
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

