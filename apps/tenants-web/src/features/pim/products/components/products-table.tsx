'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Edit2, Trash2, ArrowUpDown, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableWithPagination } from '@/components/data-table';

export interface Product {
  id: string;
  code: string;
  name: string;
  category?: string;
  brand?: string;
  price?: number;
  stock?: number;
  status: 'active' | 'inactive';
}

interface ProductsTableProps {
  data: Product[];
  categoryMap: Record<string, string>;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  pageSize?: number;
}

export function ProductsTable({
  data,
  categoryMap,
  onEdit,
  onDelete,
  pageSize = 10,
}: ProductsTableProps) {
  const columns: ColumnDef<Product>[] = [
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
          제품 코드
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
      accessorKey: 'category',
      header: '카테고리',
      cell: ({ row }) => {
        const category = row.getValue('category') as string;
        return <div className="text-sm">{categoryMap[category] || category}</div>;
      },
    },
    {
      accessorKey: 'brand',
      header: '브랜드',
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">{row.getValue('brand') || '-'}</div>
      ),
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground"
          onClick={() => column.toggleSorting()}
        >
          가격
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => {
        const price = row.getValue('price') as number;
        return (
          <div className="font-medium">
            {price?.toLocaleString('ko-KR')} 원
          </div>
        );
      },
    },
    {
      accessorKey: 'stock',
      header: '재고',
      cell: ({ row }) => {
        const stock = row.getValue('stock') as number;
        let stockColor = 'text-muted-foreground';
        let icon = <CheckCircle className="h-4 w-4 inline mr-1" />;

        if (stock === 0) {
          stockColor = 'text-red-600 dark:text-red-400';
          icon = <AlertCircle className="h-4 w-4 inline mr-1" />;
        } else if (stock < 20) {
          stockColor = 'text-orange-600 dark:text-orange-400';
          icon = <AlertCircle className="h-4 w-4 inline mr-1" />;
        } else {
          stockColor = 'text-green-600 dark:text-green-400';
          icon = <CheckCircle className="h-4 w-4 inline mr-1" />;
        }

        return (
          <div className={`font-medium ${stockColor}`}>
            {icon}
            {stock}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: '상태',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <div className="flex items-center gap-2">
            {status === 'active' ? (
              <>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">판매중</span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
                <span className="text-sm">중단</span>
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
