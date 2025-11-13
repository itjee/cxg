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
import { useActivityStore } from '../stores';
import type { Activity } from '../types';

interface ActivitiesEditProps {
  activities: Activity[];
  onSubmit: (formData: Record<string, any>) => void;
}

export function ActivitiesEdit({ activities, onSubmit }: ActivitiesEditProps) {
  const { formOpen, editingId, closeForm } = useActivityStore();

  const editingActivity = useMemo(
    () => activities.find((a) => a.id === editingId),
    [editingId, activities]
  );

  const uniqueTypes = useMemo(() => {
    return Array.from(
      new Set(activities.map((a) => a.activity_type).filter(Boolean))
    ) as string[];
  }, [activities]);

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
            {editingId ? '활동 수정' : '활동 등록'}
          </SheetTitle>
          <SheetDescription>
            {editingId
              ? '활동 정보를 수정하세요.'
              : '새로운 활동 정보를 입력하세요.'}
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
              {/* 제목 */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="title">
                  제목 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingActivity?.title || ''}
                  placeholder="활동 제목을 입력하세요"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  활동을 식별할 수 있는 제목입니다
                </p>
              </div>

              {/* 거래처명 */}
              <div className="space-y-2">
                <Label htmlFor="partner_name">
                  거래처명 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="partner_name"
                  name="partner_name"
                  defaultValue={editingActivity?.partner_name || ''}
                  placeholder="거래처명을 입력하세요"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  활동과 연관된 거래처입니다
                </p>
              </div>

              {/* 활동 유형 */}
              <div className="space-y-2">
                <Label htmlFor="activity_type">
                  활동 유형 <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="activity_type"
                  defaultValue={editingActivity?.activity_type || ''}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="유형을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CALL">전화</SelectItem>
                    <SelectItem value="EMAIL">이메일</SelectItem>
                    <SelectItem value="MEETING">미팅</SelectItem>
                    <SelectItem value="NOTE">메모</SelectItem>
                    <SelectItem value="TASK">작업</SelectItem>
                    <SelectItem value="OTHER">기타</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  활동 유형을 선택하세요
                </p>
              </div>
            </div>

            {/* 설명 */}
            <div className="space-y-2">
              <Label htmlFor="description">
                설명 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={editingActivity?.description || ''}
                placeholder="활동 내용을 입력하세요"
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">
                활동의 상세 내용을 입력하세요
              </p>
            </div>
          </div>

          {/* 일정 정보 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold whitespace-nowrap">
                일정 정보
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 예정일 */}
              <div className="space-y-2">
                <Label htmlFor="scheduled_date">예정일</Label>
                <Input
                  id="scheduled_date"
                  name="scheduled_date"
                  type="datetime-local"
                  defaultValue={editingActivity?.scheduled_date || ''}
                />
                <p className="text-xs text-muted-foreground">
                  활동 예정 일시입니다
                </p>
              </div>

              {/* 상태 */}
              <div className="space-y-2">
                <Label htmlFor="status">상태</Label>
                <Select
                  name="status"
                  defaultValue={editingActivity?.status || 'PENDING'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="상태를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">대기</SelectItem>
                    <SelectItem value="COMPLETED">완료</SelectItem>
                    <SelectItem value="CANCELLED">취소</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  활동 상태를 선택하세요
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
