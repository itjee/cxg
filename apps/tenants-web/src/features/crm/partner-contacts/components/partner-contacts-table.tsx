'use client';

import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getFilteredRowModel,
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
import { Edit2, Trash2, ArrowUpDown, Phone, Mail } from 'lucide-react';
import type { PartnerContact } from '../';

interface PartnerContactsTableProps {
  data: PartnerContact[];
  isLoading?: boolean;
  onEdit: (contact: PartnerContact) => void;
  onDelete: (contact: PartnerContact) => void;
  sorting: SortingState;
  setSorting: (sorting: SortingState) => void;
}

export function PartnerContactsTable({
  data,
  isLoading = false,
  onEdit,
  onDelete,
  sorting,
  setSorting,
}: PartnerContactsTableProps) {
  const columns: ColumnDef<PartnerContact>[] = [
    {
      id: 'rowNumber',
      header: 'NO',
      cell: ({ row }) => (
        <div className="font-medium text-muted-foreground">{row.index + 1}</div>
      ),
      size: 50,
    },
    {
      accessorKey: 'contact_name',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground"
          onClick={() => column.toggleSorting()}
        >
          담당자명
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('contact_name')}</div>
      ),
    },
    {
      accessorKey: 'position',
      header: '직책',
      cell: ({ row }) => <div className="text-sm">{row.getValue('position') || '-'}</div>,
    },
    {
      accessorKey: 'department',
      header: '부서',
      cell: ({ row }) => <div className="text-sm">{row.getValue('department') || '-'}</div>,
    },
    {
      accessorKey: 'contact_type',
      header: '담당자 유형',
      cell: ({ row }) => {
        const type = row.getValue('contact_type') as string | undefined;
        const typeMap: Record<string, string> = {
          SALES: '영업담당',
          PURCHASING: '구매담당',
          ACCOUNTING: '회계담당',
          TECHNICAL: '기술담당',
          MANAGEMENT: '경영진',
          OTHER: '기타',
        };
        return (
          <div className="text-sm px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 inline-block">
            {typeMap[type || 'OTHER']}
          </div>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: '전화',
      cell: ({ row }) => {
        const phone = row.getValue('phone') as string | undefined;
        return phone ? (
          <div className="flex items-center gap-1 text-sm">
            <Phone className="h-4 w-4 text-gray-400" />
            {phone}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: 'mobile',
      header: '휴대폰',
      cell: ({ row }) => <div className="text-sm">{row.getValue('mobile') || '-'}</div>,
    },
    {
      accessorKey: 'email',
      header: '이메일',
      cell: ({ row }) => {
        const email = row.getValue('email') as string | undefined;
        return email ? (
          <div className="flex items-center gap-1 text-sm">
            <Mail className="h-4 w-4 text-gray-400" />
            <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
              {email}
            </a>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: 'is_primary',
      header: '주담당자',
      cell: ({ row }) => {
        const isPrimary = row.getValue('is_primary');
        return (
          <div className="text-sm">
            {isPrimary ? (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md inline-block">
                주담당자
              </span>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
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
            {status === 'ACTIVE' ? (
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
            onClick={() => onDelete(row.original)}
            title="삭제"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border overflow-hidden bg-card shadow-sm">
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-border border-t-primary rounded-full mb-2"></div>
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden bg-card shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50 border-b border-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider h-12"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-accent/50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-6 py-4 h-16 font-light"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="text-4xl opacity-20">👥</div>
                    <p>담당자가 없습니다.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
