/**
 * @file plans-table.tsx
 * @description 요금제 테이블 컴포넌트
 */

'use client';

import { useMemo } from 'react';
import { toast } from 'sonner';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash2, Edit2 } from 'lucide-react';
import { plansColumns } from './plans-columns';
import { usePlansStore } from '../stores';
import { useDeletePlan } from '../hooks';
import type { Plan } from '../types';

interface PlansTableProps {
  data: Plan[];
  isLoading: boolean;
  onEdit: (plan: Plan) => void;
}

export function PlansTable({
  data,
  isLoading,
  onEdit,
}: PlansTableProps) {
  const { pageState, setSorting } = usePlansStore();
  const deleteMutation = useDeletePlan();

  const handleDelete = (plan: Plan) => {
    if (confirm(`요금제 "${plan.name}"를 정말 삭제하시겠습니까?`)) {
      deleteMutation.mutate(plan.id, {
        onSuccess: () => {
          toast.success('요금제가 삭제되었습니다');
        },
        onError: (error) => {
          toast.error(error.message || '요금제 삭제에 실패했습니다');
        },
      });
    }
  };

  const columns = useMemo(() => {
    // 기존 컬럼에 액션 컬럼 추가
    const columns = [...plansColumns];
    columns.push({
      id: 'actions',
      header: '작업',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <Edit2 className="mr-2 h-4 w-4" />
                편집
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(row.original)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      size: 60,
    });
    return columns;
  }, [onEdit]);

  const sorting: SortingState = pageState.sorting;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: (updaterOrValue) => {
      const newSorting = typeof updaterOrValue === 'function'
        ? updaterOrValue(sorting)
        : updaterOrValue;
      setSorting(newSorting);
    },
    manualPagination: true,
    manualFiltering: true,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-sm text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-sm text-gray-500">데이터가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
