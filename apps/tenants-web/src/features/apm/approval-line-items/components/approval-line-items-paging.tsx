import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ApprovalLineItemsPagingProps {
  totalItems: number;
  itemsPerPage: number;
}

export function ApprovalLineItemsPaging({ totalItems, itemsPerPage }: ApprovalLineItemsPagingProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = 1;

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        총 <span className="font-medium">{totalItems}</span>개의 권한 항목이 있습니다
      </p>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="px-3 py-1 text-sm">
          {currentPage} / {totalPages}
        </span>
        <Button variant="outline" size="sm" disabled={currentPage >= totalPages}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
