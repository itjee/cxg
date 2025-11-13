import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Plus } from 'lucide-react';

interface ApprovalLineItemsHeaderProps {
  onRefresh: () => void;
  onExport: () => void;
}

export function ApprovalLineItemsHeader({ onRefresh, onExport }: ApprovalLineItemsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">결재 금액별 권한</h1>
        <p className="text-sm text-muted-foreground mt-1">결재자별 금액 범위의 승인 권한을 설정합니다</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          새로고침
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          내보내기
        </Button>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          추가
        </Button>
      </div>
    </div>
  );
}
