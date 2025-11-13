import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface ApprovalLineItemsStatsProps {
  items: ApprovalLineItem[];
}

export function ApprovalLineItemsStats({ items }: ApprovalLineItemsStatsProps) {
  const activeItems = items.filter((i) => i.is_active).length;
  const inactiveItems = items.filter((i) => !i.is_active).length;
  const maxLevel = items.length > 0 ? Math.max(...items.map((i) => i.approval_level)) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">총 권한 항목</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{items.length}</div>
          <p className="text-xs text-muted-foreground">승인 권한 수</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">활성</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activeItems}</div>
          <p className="text-xs text-muted-foreground">활성 중인 권한</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">비활성</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-600">{inactiveItems}</div>
          <p className="text-xs text-muted-foreground">비활성 중인 권한</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">최대 레벨</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{maxLevel}</div>
          <p className="text-xs text-muted-foreground">최고 승인 레벨</p>
        </CardContent>
      </Card>
    </div>
  );
}
