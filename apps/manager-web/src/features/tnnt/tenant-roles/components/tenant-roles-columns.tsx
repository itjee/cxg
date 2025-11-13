/**
 * @file tenant-roles-columns.tsx
 * @description 테넌트 역할 테이블 컬럼 정의
 */

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import type { TenantRole, TenantRoleStatus } from '../types';
import { format } from 'date-fns';
import { Edit, Trash2, Shield, ShieldOff } from 'lucide-react';

// 상태 색상 매핑
const statusColors: Record<TenantRoleStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  INACTIVE: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
};

// 상태 라벨 매핑
const statusLabels: Record<TenantRoleStatus, string> = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
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
  onEdit?: (role: TenantRole) => void;
  onDelete?: (role: TenantRole) => void;
}

export const getTenantRolesColumns = ({
  onEdit,
  onDelete,
}: GetColumnsParams = {}): ColumnDef<TenantRole>[] => [
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
  // 역할명
  {
    accessorKey: 'role_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="역할명" />
    ),
    cell: ({ row }) => {
      const isSystemRole = row.original.is_system_role;
      return (
        <div className="flex items-center gap-2">
          {isSystemRole ? (
            <Shield className="h-4 w-4 text-primary" />
          ) : (
            <ShieldOff className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="font-medium">{row.getValue('role_name')}</span>
        </div>
      );
    },
  },
  // 역할 코드
  {
    accessorKey: 'role_code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="역할 코드" />
    ),
    cell: ({ row }) => (
      <code className="text-xs bg-muted px-2 py-1 rounded">
        {row.getValue('role_code')}
      </code>
    ),
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
  // 설명
  {
    accessorKey: 'description',
    header: '설명',
    cell: ({ row }) => {
      const description = row.getValue('description') as string | undefined;
      return (
        <div className="text-sm text-muted-foreground max-w-[300px] truncate">
          {description || '-'}
        </div>
      );
    },
  },
  // 권한 수
  {
    id: 'permissions_count',
    header: '권한 수',
    cell: ({ row }) => {
      const permissions = row.original.permissions || [];
      return (
        <div className="text-center">
          <Badge variant="outline">{permissions.length}개</Badge>
        </div>
      );
    },
    size: 100,
  },
  // 상태
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as TenantRoleStatus;
      return (
        <Badge className={statusColors[status]}>
          {statusLabels[status]}
        </Badge>
      );
    },
    size: 100,
  },
  // 생성일
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="생성일" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{formatDate(row.getValue('created_at'))}</div>
    ),
  },
  // 액션
  {
    id: 'actions',
    header: () => <div className="text-right">작업</div>,
    cell: ({ row }) => {
      const isSystemRole = row.original.is_system_role;
      return (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit?.(row.original)}
            disabled={isSystemRole}
          >
            <Edit className="h-3 w-3 mr-1" />
            수정
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete?.(row.original)}
            disabled={isSystemRole}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            삭제
          </Button>
        </div>
      );
    },
    size: 150,
  },
];
