import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

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

interface AssetDisposalsFiltersProps {
  disposals: AssetDisposal[];
}

export function AssetDisposalsFilters({ disposals }: AssetDisposalsFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <Input placeholder="자산코드 또는 자산명으로 검색..." className="h-9" />
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
