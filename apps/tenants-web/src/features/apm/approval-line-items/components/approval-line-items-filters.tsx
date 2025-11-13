import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

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

interface ApprovalLineItemsFiltersProps {
  items: ApprovalLineItem[];
}

export function ApprovalLineItemsFilters({ items }: ApprovalLineItemsFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <Input placeholder="결재자명 또는 결재라인으로 검색..." className="h-9" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            필터
          </Button>
          <Button variant="ghost" size="sm">
            <X className="h-4 w-4" />
            초기화
          </Button>
        </div>
      </div>
    </div>
  );
}
