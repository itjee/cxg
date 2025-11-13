'use client';

import { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { useApprovalLinesStore } from '../stores';

interface ApprovalLinesEditProps {
  data: any[];
  onSubmit: (formData: Record<string, any>) => void;
}

export function ApprovalLinesEdit({ data, onSubmit }: ApprovalLinesEditProps) {
  const { formOpen, editingId, closeForm } = useApprovalLinesStore();

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
            {editingId ? '결재 라인 수정' : '결재 라인 등록'}
          </SheetTitle>
          <SheetDescription>
            {editingId
              ? '결재 라인 정보를 수정하세요.'
              : '새로운 결재 라인 정보를 입력하세요.'}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 mt-6"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold whitespace-nowrap">
                기본 정보
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="title">
                  제목 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingItem?.title || ''}
                  placeholder="제목을 입력하세요"
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingItem?.description || ''}
                  placeholder="설명을 입력하세요"
                  rows={4}
                />
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
