'use client';

import { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { useContractsStore } from '../stores';

interface ContractsEditProps {
  data: any[];
  onSubmit: (formData: Record<string, any>) => void;
}

export function ContractsEdit({ data, onSubmit }: ContractsEditProps) {
  const { formOpen, editingId, closeForm } = useContractsStore();

  const editingItem = useMemo(
    () => data.find((item) => item.id === editingId),
    [editingId, data]
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
            {editingId ? '계약 수정' : '계약 등록'}
          </SheetTitle>
          <SheetDescription>
            {editingId ? '계약 정보를 수정하세요.' : '새로운 계약 정보를 입력하세요.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold whitespace-nowrap">기본 정보</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">
                  이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingItem?.name || ''}
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>
            </div>
          </div>

          <SheetFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => closeForm()}>
              취소
            </Button>
            <Button type="submit">{editingId ? '수정' : '등록'}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
