'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AssetDisposal {
  id: string;
  asset_id: string;
  asset_code: string;
  asset_name: string;
  disposal_date: string;
  disposal_method: 'SALE' | 'SCRAP' | 'DONATION' | 'WRITE_OFF' | 'OTHER';
  book_value: number;
  disposal_value: number;
  gain_loss: number;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  remarks?: string;
  created_at: string;
  updated_at: string;
}

interface AssetDisposalsEditProps {
  disposals: AssetDisposal[];
  onSubmit: (disposal: AssetDisposal) => void;
}

export function AssetDisposalsEdit({ disposals, onSubmit }: AssetDisposalsEditProps) {
  return (
    <Dialog>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>자산 폐기/판매 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="asset-code">자산코드</Label>
            <Input id="asset-code" placeholder="자산코드를 입력하세요" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="disposal-date">폐기일자</Label>
            <Input id="disposal-date" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="disposal-method">폐기방법</Label>
            <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
              <option>판매</option>
              <option>폐기</option>
              <option>기증</option>
              <option>상각</option>
              <option>기타</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="remarks">비고</Label>
            <textarea id="remarks" placeholder="비고를 입력하세요" className="w-full px-3 py-2 border border-input rounded-md" />
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
