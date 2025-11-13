import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Plus } from 'lucide-react';

interface AssetDisposalsHeaderProps {
  onRefresh: () => void;
  onExport: () => void;
}

export function AssetDisposalsHeader({ onRefresh, onExport }: AssetDisposalsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">자산 폐기/판매 관리</h1>
        <p className="text-sm text-muted-foreground mt-1">고정자산의 폐기 및 판매 내역을 관리합니다</p>
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
