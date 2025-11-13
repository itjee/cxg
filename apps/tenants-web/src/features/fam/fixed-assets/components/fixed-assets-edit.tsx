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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFixedAssetsStore } from '../stores';

interface FixedAssetsEditProps {
  data: any[];
  onSubmit: (formData: Record<string, any>) => void;
}

export function FixedAssetsEdit({ data, onSubmit }: FixedAssetsEditProps) {
  const { formOpen, editingId, closeForm } = useFixedAssetsStore();

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
            {editingId ? '고정자산 수정' : '고정자산 등록'}
          </SheetTitle>
          <SheetDescription>
            {editingId
              ? '고정자산 정보를 수정하세요.'
              : '새로운 고정자산 정보를 입력하세요.'}
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
                <Label htmlFor="name">
                  자산명 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingItem?.name || ''}
                  placeholder="자산명을 입력하세요"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="asset_code">자산코드</Label>
                <Input
                  id="asset_code"
                  name="asset_code"
                  defaultValue={editingItem?.asset_code || ''}
                  placeholder="자산코드를 입력하세요"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="acquisition_cost">취득가액</Label>
                <Input
                  id="acquisition_cost"
                  name="acquisition_cost"
                  type="number"
                  defaultValue={editingItem?.acquisition_cost || ''}
                  placeholder="취득가액을 입력하세요"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="location">위치</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={editingItem?.location || ''}
                  placeholder="자산 위치를 입력하세요"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingItem?.description || ''}
                  placeholder="설명을 입력하세요"
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
