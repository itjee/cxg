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
import { useTaxInvoiceLinesStore } from '../stores';

interface TaxInvoiceLinesEditProps {
  data: any[];
  onSubmit: (formData: Record<string, any>) => void;
}

export function TaxInvoiceLinesEdit({ data, onSubmit }: TaxInvoiceLinesEditProps) {
  const { formOpen, editingId, closeForm } = useTaxInvoiceLinesStore();

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
            {editingId ? '세금계산서 라인 수정' : '세금계산서 라인 등록'}
          </SheetTitle>
          <SheetDescription>
            {editingId
              ? '세금계산서 라인 정보를 수정하세요.'
              : '새로운 세금계산서 라인 정보를 입력하세요.'}
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
                <Label htmlFor="description">
                  내용 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="description"
                  name="description"
                  defaultValue={editingItem?.description || ''}
                  placeholder="내용을 입력하세요"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">금액</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  defaultValue={editingItem?.amount || ''}
                  placeholder="금액을 입력하세요"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transaction_date">거래일</Label>
                <Input
                  id="transaction_date"
                  name="transaction_date"
                  type="date"
                  defaultValue={editingItem?.transaction_date || ''}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="memo">메모</Label>
                <Textarea
                  id="memo"
                  name="memo"
                  defaultValue={editingItem?.memo || ''}
                  placeholder="메모를 입력하세요"
                  rows={3}
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
