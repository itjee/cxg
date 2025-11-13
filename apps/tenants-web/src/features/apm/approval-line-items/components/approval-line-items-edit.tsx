'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ApprovalLineItem {
  id: string;
  approval_line_id: string;
  line_number: string;
  approver_id: string;
  approver_name: string;
  approval_amount_from: number;
  approval_amount_to: number;
  approval_level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ApprovalLineItemsEditProps {
  items: ApprovalLineItem[];
  onSubmit: (item: ApprovalLineItem) => void;
}

export function ApprovalLineItemsEdit({ items, onSubmit }: ApprovalLineItemsEditProps) {
  return (
    <Dialog>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>결재 금액별 권한 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="line-number">결재라인</Label>
            <Input id="line-number" placeholder="결재라인을 선택하세요" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="approver-name">결재자</Label>
            <Input id="approver-name" placeholder="결재자를 선택하세요" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="approval-level">승인레벨</Label>
            <Input id="approval-level" type="number" placeholder="승인레벨을 입력하세요" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount-from">승인범위 시작</Label>
              <Input id="amount-from" type="number" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount-to">승인범위 종료</Label>
              <Input id="amount-to" type="number" placeholder="0" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="is-active">상태</Label>
            <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
              <option>활성</option>
              <option>비활성</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline">취소</Button>
          <Button>저장</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
