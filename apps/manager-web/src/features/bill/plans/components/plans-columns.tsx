/**
 * @file plans-columns.tsx
 * @description 요금제 테이블 컬럼 정의
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import type { Plan } from '../types';
import { PlanStatus, PlanType, BillingCycle } from '../types';

/**
 * 요금제 타입 배지 색상
 */
const typeColors: Record<string, string> = {
  TRIAL: 'bg-blue-100 text-blue-800',
  STANDARD: 'bg-green-100 text-green-800',
  PREMIUM: 'bg-purple-100 text-purple-800',
  ENTERPRISE: 'bg-red-100 text-red-800',
};

/**
 * 상태 배지 색상
 */
const statusColors: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  ARCHIVED: 'bg-amber-100 text-amber-800',
};

/**
 * 요금제 테이블 컬럼 정의
 */
export const plansColumns: ColumnDef<Plan>[] = [
  {
    id: 'code',
    accessorKey: 'code',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-8 px-2"
      >
        코드
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-mono text-base font-light">{row.getValue('code')}</div>
    ),
    size: 150,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-8 px-2"
      >
        이름
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-light">{row.getValue('name')}</div>
    ),
    size: 200,
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: '유형',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return (
        <Badge variant="outline" className={typeColors[type] || 'bg-gray-100 text-gray-800'}>
          {type}
        </Badge>
      );
    },
    size: 120,
  },
  {
    id: 'billing_cycle',
    accessorKey: 'billing_cycle',
    header: '청구 주기',
    cell: ({ row }) => {
      const cycle = row.getValue('billing_cycle') as string;
      const cycleLabel: Record<string, string> = {
        MONTHLY: '월간',
        QUARTERLY: '분기',
        YEARLY: '연간',
      };
      return <span>{cycleLabel[cycle] || cycle}</span>;
    },
    size: 100,
  },
  {
    id: 'base_price',
    accessorKey: 'base_price',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-8 px-2"
      >
        기본 요금
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const price = row.getValue('base_price') as number;
      const currency = row.original.currency;
      return (
        <div className="text-right font-light">
          {currency} {price.toLocaleString()}
        </div>
      );
    },
    size: 130,
  },
  {
    id: 'max_users',
    accessorKey: 'max_users',
    header: '최대 사용자',
    cell: ({ row }) => {
      const maxUsers = row.getValue('max_users') as number | null;
      return <div className="text-center">{maxUsers ? maxUsers.toLocaleString() : '무제한'}</div>;
    },
    size: 120,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge variant="outline" className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
          {status}
        </Badge>
      );
    },
    size: 100,
  },
  {
    id: 'start_time',
    accessorKey: 'start_time',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-8 px-2"
      >
        시작일
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('start_time') as string);
      return <div>{date.toLocaleDateString('ko-KR')}</div>;
    },
    size: 120,
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-8 px-2"
      >
        생성일
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at') as string);
      return <div className="text-base">{date.toLocaleDateString('ko-KR')}</div>;
    },
    size: 120,
  },
];
