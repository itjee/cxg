'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Edit2, Trash2, ArrowUpDown, Globe, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableWithPagination } from '@/components/data-table';

export interface Brand {
  id: string;
  code: string;
  name: string;
  country?: string;
  description?: string;
  is_active: boolean;
  product_count: number;
}

interface BrandsTableProps {
  data: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (brandId: string) => void;
  pageSize?: number;
}

export function BrandsTable({
  data,
  onEdit,
  onDelete,
  pageSize = 10,
}: BrandsTableProps) {
  const columns: ColumnDef<Brand>[] = [
    {
      id: 'rowNumber',
      header: 'NO',
      cell: ({ row }) => (
        <div className="font-medium text-muted-foreground">{row.index + 1}</div>
      ),
      size: 50,
    },
    {
      accessorKey: 'code',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground"
          onClick={() => column.toggleSorting()}
        >
          브랜드 코드
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue('code')}</div>
          <div className="text-xs text-muted-foreground">{row.original.name}</div>
        </div>
      ),
    },
    {
      accessorKey: 'country',
      header: '국가',
      cell: ({ row }) => (
        <div className="text-sm flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          {row.getValue('country') || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: '설명',
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">{row.getValue('description') || '-'}</div>
      ),
    },
    {
      accessorKey: 'product_count',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground"
          onClick={() => column.toggleSorting()}
        >
          상품 수
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="font-medium flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          {row.getValue('product_count')}
        </div>
      ),
    },
    {
      accessorKey: 'is_active',
      header: '활성화',
      cell: ({ row }) => {
        const isActive = row.getValue('is_active') as boolean;
        return (
          <div className="flex items-center gap-2">
            {isActive ? (
              <>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">활성</span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
                <span className="text-sm">비활성</span>
              </>
            )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: '작업',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onEdit(row.original)}
            title="편집"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => onDelete(row.original.id)}
            title="삭제"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTableWithPagination
      columns={columns}
      data={data}
      pageSize={pageSize}
      emptyMessage="데이터가 없습니다."
    />
  );
}
