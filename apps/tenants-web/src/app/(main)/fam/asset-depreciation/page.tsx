'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  AssetDepreciationHeader,
  AssetDepreciationStats,
  AssetDepreciationFilters,
  AssetDepreciationList,
  AssetDepreciationPaging,
  AssetDepreciationEdit,
} from '@/features/fam/asset-depreciation';
import { useAssetDepreciationsStore } from '@/features/fam/asset-depreciation/stores';

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

interface AssetDepreciation {
  id: string;
  asset_id: string;
  asset_code: string;
  asset_name: string;
  depreciation_period: string;
  depreciation_amount: number;
  accumulated_depreciation: number;
  book_value: number;
  depreciation_rate: number;
  status: 'PENDING' | 'PROCESSED' | 'CANCELLED';
  created_at: string;
  updated_at: string;
}

const dummyDepreciations: AssetDepreciation[] = [
  {
    id: '1',
    asset_id: 'asset-1',
    asset_code: 'FA-2024-001',
    asset_name: '사무용 컴퓨터',
    depreciation_period: '2024-11',
    depreciation_amount: 40000,
    accumulated_depreciation: 800000,
    book_value: 1200000,
    depreciation_rate: 20.0,
    status: 'PROCESSED',
    created_at: '2024-11-01T10:00:00Z',
    updated_at: '2024-11-01T10:00:00Z',
  },
  {
    id: '2',
    asset_id: 'asset-2',
    asset_code: 'FA-2024-002',
    asset_name: '회의실 테이블',
    depreciation_period: '2024-11',
    depreciation_amount: 25000,
    accumulated_depreciation: 600000,
    book_value: 2400000,
    depreciation_rate: 10.0,
    status: 'PROCESSED',
    created_at: '2024-11-01T14:00:00Z',
    updated_at: '2024-11-01T14:00:00Z',
  },
  {
    id: '3',
    asset_id: 'asset-3',
    asset_code: 'FA-2024-003',
    asset_name: '건설장비',
    depreciation_period: '2024-11',
    depreciation_amount: 500000,
    accumulated_depreciation: 20000000,
    book_value: 30000000,
    depreciation_rate: 20.0,
    status: 'PENDING',
    created_at: '2024-11-02T09:30:00Z',
    updated_at: '2024-11-02T09:30:00Z',
  },
];

const createColumns = (
  onEditDepreciation: (depreciation: AssetDepreciation) => void,
  onDeleteDepreciation: (depreciation: AssetDepreciation) => void
): ColumnDef<AssetDepreciation>[] => [
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
    accessorKey: 'depreciation_period',
    header: '감가상각기간',
    cell: ({ row }) => <div className="text-sm">{row.getValue('depreciation_period')}</div>,
  },
  {
    accessorKey: 'depreciation_amount',
    header: '감가상각액',
    cell: ({ row }) => {
      const amount = row.getValue('depreciation_amount') as number;
      return <div className="text-sm font-medium">{(amount / 10000).toFixed(0)}만원</div>;
    },
  },
  {
    accessorKey: 'accumulated_depreciation',
    header: '누적감가상각',
    cell: ({ row }) => {
      const accumulated = row.getValue('accumulated_depreciation') as number;
      return <div className="text-sm font-medium">{(accumulated / 1000000).toFixed(1)}백만원</div>;
    },
  },
  {
    accessorKey: 'book_value',
    header: '장부가액',
    cell: ({ row }) => {
      const value = row.getValue('book_value') as number;
      return <div className="text-sm">{(value / 1000000).toFixed(1)}백만원</div>;
    },
  },
  {
    accessorKey: 'depreciation_rate',
    header: '상각률',
    cell: ({ row }) => {
      const rate = row.getValue('depreciation_rate') as number;
      return <div className="text-sm text-center">{rate}%</div>;
    },
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, string> = { PENDING: '대기중', PROCESSED: '처리완료', CANCELLED: '취소' };
      const statusColors: Record<string, string> = { PENDING: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400', PROCESSED: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400', CANCELLED: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' };
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
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEditDepreciation(row.original)} title="편집">
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onDeleteDepreciation(row.original)} title="삭제">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function AssetDepreciationPage() {
  const store = useAssetDepreciationsStore();
  const filteredDepreciations = useMemo(() => dummyDepreciations.filter(() => true), []);
  const columns = createColumns((d) => store.openForm(d.id), () => {});

  return (
    <div className="space-y-6">
      <AssetDepreciationHeader onRefresh={() => {}} onExport={() => {}} />
      <AssetDepreciationStats depreciations={dummyDepreciations} />
      <AssetDepreciationFilters depreciations={dummyDepreciations} />
      <AssetDepreciationList columns={columns} data={filteredDepreciations} />
      <AssetDepreciationPaging totalItems={filteredDepreciations.length} itemsPerPage={10} />
      <AssetDepreciationEdit depreciations={dummyDepreciations} onSubmit={() => {}} />
    </div>
  );
}
