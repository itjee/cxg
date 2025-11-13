'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  AssetDisposalsHeader,
  AssetDisposalsStats,
  AssetDisposalsFilters,
  AssetDisposalsList,
  AssetDisposalsPaging,
  AssetDisposalsEdit,
} from '@/features/fam/asset-disposals';
import { useAssetDisposalsStore } from '@/features/fam/asset-disposals/stores';

function formatDateTime(dateString?: string): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
}

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

const dummyDisposals: AssetDisposal[] = [
  {
    id: '1',
    asset_id: 'asset-1',
    asset_code: 'FA-2024-001',
    asset_name: '구형 사무용 컴퓨터',
    disposal_date: '2024-10-15',
    disposal_method: 'SALE',
    book_value: 800000,
    disposal_value: 500000,
    gain_loss: -300000,
    status: 'COMPLETED',
    remarks: '전자제품 판매업체에 판매',
    created_at: '2024-10-01T10:00:00Z',
    updated_at: '2024-10-15T14:00:00Z',
  },
  {
    id: '2',
    asset_id: 'asset-2',
    asset_code: 'FA-2024-002',
    asset_name: '폐기 의자',
    disposal_date: '2024-11-05',
    disposal_method: 'SCRAP',
    book_value: 100000,
    disposal_value: 0,
    gain_loss: -100000,
    status: 'COMPLETED',
    remarks: '폐기 처리',
    created_at: '2024-10-15T09:30:00Z',
    updated_at: '2024-11-05T11:00:00Z',
  },
  {
    id: '3',
    asset_id: 'asset-3',
    asset_code: 'FA-2024-003',
    asset_name: '중고 에어컨',
    disposal_date: '2024-11-10',
    disposal_method: 'DONATION',
    book_value: 1500000,
    disposal_value: 0,
    gain_loss: -1500000,
    status: 'PENDING',
    remarks: '자선단체 기증 예정',
    created_at: '2024-10-30T13:45:00Z',
    updated_at: '2024-10-30T13:45:00Z',
  },
];

const createColumns = (
  onEditDisposal: (disposal: AssetDisposal) => void,
  onDeleteDisposal: (disposal: AssetDisposal) => void
): ColumnDef<AssetDisposal>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'asset_code',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        자산코드
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue('asset_code')}</div>
        <div className="text-xs text-muted-foreground">{row.original.asset_name}</div>
      </div>
    ),
  },
  {
    accessorKey: 'disposal_date',
    header: '폐기일자',
    cell: ({ row }) => {
      const date = new Date(row.getValue('disposal_date') as string).toLocaleDateString('ko-KR');
      return <div className="text-sm">{date}</div>;
    },
  },
  {
    accessorKey: 'disposal_method',
    header: '폐기방법',
    cell: ({ row }) => {
      const method = row.getValue('disposal_method') as string;
      const methodMap: Record<string, string> = { SALE: '판매', SCRAP: '폐기', DONATION: '기증', WRITE_OFF: '상각', OTHER: '기타' };
      return <div className="text-sm">{methodMap[method] || method}</div>;
    },
  },
  {
    accessorKey: 'book_value',
    header: '장부가액',
    cell: ({ row }) => {
      const value = row.getValue('book_value') as number;
      return <div className="text-sm font-medium">{(value / 1000000).toFixed(1)}백만원</div>;
    },
  },
  {
    accessorKey: 'disposal_value',
    header: '처분가액',
    cell: ({ row }) => {
      const value = row.getValue('disposal_value') as number;
      return <div className="text-sm">{value === 0 ? '-' : `${(value / 1000000).toFixed(1)}백만원`}</div>;
    },
  },
  {
    accessorKey: 'gain_loss',
    header: '손익',
    cell: ({ row }) => {
      const gainLoss = row.getValue('gain_loss') as number;
      const color = gainLoss >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400';
      return <div className={`text-sm font-medium ${color}`}>{(gainLoss / 1000000).toFixed(1)}백만원</div>;
    },
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, string> = { PENDING: '대기중', APPROVED: '승인됨', COMPLETED: '완료', CANCELLED: '취소' };
      const statusColors: Record<string, string> = { PENDING: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400', APPROVED: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400', COMPLETED: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400', CANCELLED: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' };
      return (
        <div className={`text-sm px-2.5 py-1 rounded-md inline-block ${statusColors[status] || 'bg-gray-50'}`}>
          {statusMap[status] || status}
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: '생성일시',
    cell: ({ row }) => <div className="text-sm">{formatDateTime(row.getValue('created_at') as string)}</div>,
  },
  {
    id: 'actions',
    header: '작업',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEditDisposal(row.original)} title="편집">
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onDeleteDisposal(row.original)} title="삭제">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function AssetDisposalsPage() {
  const store = useAssetDisposalsStore();
  const filteredDisposals = useMemo(() => dummyDisposals.filter(() => true), []);
  const columns = createColumns((d) => store.openForm(d.id), () => {});

  return (
    <div className="space-y-6">
      <AssetDisposalsHeader onRefresh={() => {}} onExport={() => {}} />
      <AssetDisposalsStats disposals={dummyDisposals} />
      <AssetDisposalsFilters disposals={dummyDisposals} />
      <AssetDisposalsList columns={columns} data={filteredDisposals} />
      <AssetDisposalsPaging totalItems={filteredDisposals.length} itemsPerPage={10} />
      <AssetDisposalsEdit disposals={dummyDisposals} onSubmit={() => {}} />
    </div>
  );
}
