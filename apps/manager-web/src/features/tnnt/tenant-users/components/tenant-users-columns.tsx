/**
 * @file tenant-users-columns.tsx
 * @description 테넌트 사용자 테이블 컬럼 정의
 */

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/data-table';
import type { TenantUser, TenantUserStatus } from '../types';
import { format } from 'date-fns';
import { Edit, Trash2, Key, UserCircle, Crown } from 'lucide-react';

// 상태 색상 매핑
const statusColors: Record<TenantUserStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  INACTIVE: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  SUSPENDED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

// 상태 라벨 매핑
const statusLabels: Record<TenantUserStatus, string> = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
  PENDING: '대기',
  SUSPENDED: '정지',
};

// 날짜 포맷 함수
const formatDate = (date: string | undefined) => {
  if (!date) return '-';
  try {
    return format(new Date(date), 'yyyy-MM-dd HH:mm');
  } catch {
    return '-';
  }
};

// 컬럼 생성 함수 파라미터 타입
interface GetColumnsParams {
  onEdit?: (user: TenantUser) => void;
  onDelete?: (user: TenantUser) => void;
  onResetPassword?: (user: TenantUser) => void;
}

export const getTenantUsersColumns = ({
  onEdit,
  onDelete,
  onResetPassword,
}: GetColumnsParams = {}): ColumnDef<TenantUser>[] => [
  // NO 컬럼
  {
    id: 'rowNumber',
    header: () => <div className="text-center">NO</div>,
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      return (
        <div className="text-center text-sm text-muted-foreground">
          {pageIndex * pageSize + row.index + 1}
        </div>
      );
    },
    enableSorting: false,
    size: 60,
  },
  // 사용자명
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="사용자명" />
    ),
    cell: ({ row }) => {
      const isPrimary = row.original.is_primary;
      return (
        <div className="flex items-center gap-2">
          {isPrimary ? (
            <Crown className="h-4 w-4 text-amber-500" />
          ) : (
            <UserCircle className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="font-light">{row.getValue('username')}</span>
        </div>
      );
    },
  },
  // 이메일
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="이메일" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue('email')}</div>
    ),
  },
  // 이름
  {
    accessorKey: 'full_name',
    header: '이름',
    cell: ({ row }) => {
      const fullName = row.getValue('full_name') as string | undefined;
      return (
        <div className="text-sm">{fullName || '-'}</div>
      );
    },
  },
  // 테넌트 ID
  {
    accessorKey: 'tenant_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="테넌트 ID" />
    ),
    cell: ({ row }) => (
      <code className="text-xs bg-muted px-2 py-1 rounded">
        {row.getValue('tenant_id')}
      </code>
    ),
  },
  // 역할
  {
    accessorKey: 'role_name',
    header: '역할',
    cell: ({ row }) => {
      const roleName = row.getValue('role_name') as string | undefined;
      return roleName ? (
        <Badge variant="outline">{roleName}</Badge>
      ) : (
        <span className="text-sm text-muted-foreground">-</span>
      );
    },
    size: 120,
  },
  // 상태
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as TenantUserStatus;
      return (
        <Badge className={statusColors[status]}>
          {statusLabels[status]}
        </Badge>
      );
    },
    size: 100,
  },
  // 로그인 횟수
  {
    accessorKey: 'login_count',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="로그인" />
    ),
    cell: ({ row }) => (
      <div className="text-center text-sm">
        {row.getValue('login_count')}회
      </div>
    ),
    size: 80,
  },
  // 마지막 로그인
  {
    accessorKey: 'last_login_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="마지막 로그인" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{formatDate(row.getValue('last_login_at'))}</div>
    ),
  },
  // 액션
  {
    id: 'actions',
    header: () => <div className="text-right">작업</div>,
    cell: ({ row }) => {
      const isPrimary = row.original.is_primary;
      return (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit?.(row.original)}
          >
            <Edit className="h-3 w-3 mr-1" />
            수정
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onResetPassword?.(row.original)}
          >
            <Key className="h-3 w-3 mr-1" />
            초기화
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete?.(row.original)}
            disabled={isPrimary}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            삭제
          </Button>
        </div>
      );
    },
    size: 200,
  },
];
