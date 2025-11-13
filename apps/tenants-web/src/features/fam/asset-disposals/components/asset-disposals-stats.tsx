import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface AssetDisposalsStatsProps {
  disposals: AssetDisposal[];
}

export function AssetDisposalsStats({ disposals }: AssetDisposalsStatsProps) {
  const completedDisposals = disposals.filter((d) => d.status === 'COMPLETED').length;
  const pendingDisposals = disposals.filter((d) => d.status === 'PENDING').length;
  const totalBookValue = disposals.reduce((sum, d) => sum + d.book_value, 0);
  const totalGainLoss = disposals.reduce((sum, d) => sum + d.gain_loss, 0);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">총 폐기자산</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{disposals.length}</div>
          <p className="text-xs text-muted-foreground">자산 수</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">완료</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{completedDisposals}</div>
          <p className="text-xs text-muted-foreground">처리 완료</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">대기중</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{pendingDisposals}</div>
          <p className="text-xs text-muted-foreground">대기 중인 건</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">총 손익</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {(totalGainLoss / 1000000).toFixed(1)}백만원
          </div>
          <p className="text-xs text-muted-foreground">폐기손익 합계</p>
        </CardContent>
      </Card>
    </div>
  );
}
