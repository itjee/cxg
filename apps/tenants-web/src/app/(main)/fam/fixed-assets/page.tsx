'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  FixedAssetsHeader,
  FixedAssetsStats,
  FixedAssetsFilters,
  FixedAssetsList,
  FixedAssetsPaging,
  FixedAssetsEdit,
} from '@/features/fam/fixed-assets';
import { useFixedAssetsStore } from '@/features/fam/fixed-assets/stores';

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

interface FixedAsset {
  id: string;
  asset_code: string;
  asset_name: string;
  asset_category: string;
  acquisition_date: string;
  acquisition_cost: number;
  book_value: number;
  accumulated_depreciation: number;
  useful_life_years: number;
  depreciation_method: 'STRAIGHT_LINE' | 'DECLINING_BALANCE' | 'UNITS_OF_PRODUCTION';
  status: 'IN_USE' | 'IDLE' | 'RETIRED' | 'SOLD';
  location: string;
  created_at: string;
  updated_at: string;
}

const dummyAssets: FixedAsset[] = [
  {
    id: '1',
    asset_code: 'FA-2024-001',
    asset_name: '사무용 컴퓨터',
    asset_category: '전산장비',
    acquisition_date: '2022-01-15',
    acquisition_cost: 2000000,
    book_value: 1200000,
    accumulated_depreciation: 800000,
    useful_life_years: 5,
    depreciation_method: 'STRAIGHT_LINE',
    status: 'IN_USE',
    location: '3층 개발팀',
    created_at: '2022-01-15T10:00:00Z',
    updated_at: '2024-11-01T10:00:00Z',
  },
  {
    id: '2',
    asset_code: 'FA-2024-002',
    asset_name: '회의실 테이블',
    asset_category: '가구',
    acquisition_date: '2021-06-10',
    acquisition_cost: 3000000,
    book_value: 2400000,
    accumulated_depreciation: 600000,
    useful_life_years: 10,
    depreciation_method: 'STRAIGHT_LINE',
    status: 'IN_USE',
    location: '2층 회의실',
    created_at: '2021-06-10T14:00:00Z',
    updated_at: '2024-10-28T14:00:00Z',
  },
  {
    id: '3',
    asset_code: 'FA-2024-003',
    asset_name: '건설장비',
    asset_category: '기계장비',
    acquisition_date: '2020-03-20',
    acquisition_cost: 50000000,
    book_value: 30000000,
    accumulated_depreciation: 20000000,
    useful_life_years: 10,
    depreciation_method: 'DECLINING_BALANCE',
    status: 'IDLE',
    location: '창고',
    created_at: '2020-03-20T09:30:00Z',
    updated_at: '2024-11-01T09:30:00Z',
  },
];

const createColumns = (
  onEditAsset: (asset: FixedAsset) => void,
  onDeleteAsset: (asset: FixedAsset) => void
): ColumnDef<FixedAsset>[] => [
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
    accessorKey: 'asset_category',
    header: '카테고리',
    cell: ({ row }) => <div className="text-sm">{row.getValue('asset_category')}</div>,
  },
  {
    accessorKey: 'acquisition_cost',
    header: '취득가액',
    cell: ({ row }) => {
      const cost = row.getValue('acquisition_cost') as number;
      return <div className="text-sm font-medium">{(cost / 1000000).toFixed(1)}백만원</div>;
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
    accessorKey: 'accumulated_depreciation',
    header: '누적감가상각',
    cell: ({ row }) => {
      const depreciation = row.getValue('accumulated_depreciation') as number;
      return <div className="text-sm">{(depreciation / 1000000).toFixed(1)}백만원</div>;
    },
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, string> = { IN_USE: '사용중', IDLE: '유휴', RETIRED: '폐기', SOLD: '판매' };
      const statusColors: Record<string, string> = { IN_USE: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400', IDLE: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400', RETIRED: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400', SOLD: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400' };
      return (
        <div className={`text-sm px-2.5 py-1 rounded-md inline-block ${statusColors[status] || 'bg-gray-50'}`}>
          {statusMap[status] || status}
        </div>
      );
    },
  },
  {
    accessorKey: 'location',
    header: '위치',
    cell: ({ row }) => <div className="text-sm">{row.getValue('location')}</div>,
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
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEditAsset(row.original)} title="편집">
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onDeleteAsset(row.original)} title="삭제">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function FixedAssetsPage() {
  const store = useFixedAssetsStore();
  const filteredAssets = useMemo(() => dummyAssets.filter(() => true), []);
  const columns = createColumns((a) => store.openForm(a.id), () => {});

  return (
    <div className="space-y-6">
      <FixedAssetsHeader onRefresh={() => {}} onExport={() => {}} />
      <FixedAssetsStats assets={dummyAssets} />
      <FixedAssetsFilters assets={dummyAssets} />
      <FixedAssetsList columns={columns} data={filteredAssets} />
      <FixedAssetsPaging totalItems={filteredAssets.length} itemsPerPage={10} />
      <FixedAssetsEdit assets={dummyAssets} onSubmit={() => {}} />
    </div>
  );
}
