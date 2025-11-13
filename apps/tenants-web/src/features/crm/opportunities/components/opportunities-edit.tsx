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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOpportunityStore } from '../stores';
import type { Opportunity } from '../types';

interface OpportunitiesEditProps {
  opportunities: Opportunity[];
  onSubmit: (formData: Record<string, any>) => void;
}

export function OpportunitiesEdit({ opportunities, onSubmit }: OpportunitiesEditProps) {
  const { formOpen, editingId, closeForm } = useOpportunityStore();

  const editingOpportunity = useMemo(
    () => opportunities.find((o) => o.id === editingId),
    [editingId, opportunities]
  );

  const uniqueStages = useMemo(() => {
    return Array.from(
      new Set(opportunities.map((o) => o.stage).filter(Boolean))
    ) as string[];
  }, [opportunities]);

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
            {editingId ? '영업기회 수정' : '영업기회 등록'}
          </SheetTitle>
          <SheetDescription>
            {editingId
              ? '영업기회 정보를 수정하세요.'
              : '새로운 영업기회 정보를 입력하세요.'}
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
              {/* 영업기회명 */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">
                  영업기회명 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingOpportunity?.name || ''}
                  placeholder="영업기회명을 입력하세요"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  영업기회를 식별할 수 있는 명칭입니다
                </p>
              </div>

              {/* 예상 매출 */}
              <div className="space-y-2">
                <Label htmlFor="expected_revenue">예상 매출</Label>
                <Input
                  id="expected_revenue"
                  name="expected_revenue"
                  type="number"
                  defaultValue={editingOpportunity?.expected_revenue || ''}
                  placeholder="예상 매출을 입력하세요"
                />
                <p className="text-xs text-muted-foreground">
                  예상되는 매출 금액입니다
                </p>
              </div>

              {/* 예상 종료일 */}
              <div className="space-y-2">
                <Label htmlFor="expected_close_date">예상 종료일</Label>
                <Input
                  id="expected_close_date"
                  name="expected_close_date"
                  type="date"
                  defaultValue={editingOpportunity?.expected_close_date || ''}
                />
                <p className="text-xs text-muted-foreground">
                  거래 성사 예상일입니다
                </p>
              </div>
            </div>
          </div>

          {/* 영업 단계 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold whitespace-nowrap">
                영업 단계
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 단계 */}
              <div className="space-y-2">
                <Label htmlFor="stage">
                  단계 <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="stage"
                  defaultValue={editingOpportunity?.stage || ''}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="단계를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LEAD">잠재고객</SelectItem>
                    <SelectItem value="QUALIFIED">검증</SelectItem>
                    <SelectItem value="PROPOSAL">제안</SelectItem>
                    <SelectItem value="NEGOTIATION">협상</SelectItem>
                    <SelectItem value="CLOSED_WON">성공</SelectItem>
                    <SelectItem value="CLOSED_LOST">실패</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  현재 영업 단계를 선택하세요
                </p>
              </div>

              {/* 확률 */}
              <div className="space-y-2">
                <Label htmlFor="probability">성공 확률 (%)</Label>
                <Input
                  id="probability"
                  name="probability"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={editingOpportunity?.probability || ''}
                  placeholder="0-100"
                />
                <p className="text-xs text-muted-foreground">
                  성공 가능성을 %로 입력하세요
                </p>
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
