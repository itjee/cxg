'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  UsersHeader,
  UsersStats,
  UsersFilters,
  UsersTable,
  UsersEdit,
} from '@/features/sys/users';
import { useUserStore } from '@/features/sys/users/stores';
import type { User } from '@/shared/types';

// 날짜 포맷 함수
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

// 더미 데이터
const dummyUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    full_name: '관리자',
    email: 'admin@example.com',
    phone: '010-1234-5678',
    role_name: '관리자',
    is_active: true,
    is_system_user: true,
    failed_login_attempts: 0,
    last_login_at: '2025-10-28T10:30:00Z',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
  {
    id: '2',
    username: 'manager',
    full_name: '김매니저',
    email: 'manager@example.com',
    phone: '010-2345-6789',
    role_name: '매니저',
    is_active: true,
    is_system_user: false,
    failed_login_attempts: 0,
    last_login_at: '2025-10-27T15:20:00Z',
    created_at: '2025-02-15T00:00:00Z',
    updated_at: '2025-10-27T15:20:00Z',
  },
  {
    id: '3',
    username: 'user1',
    full_name: '이사원',
    email: 'user1@example.com',
    phone: '010-3456-7890',
    role_name: '사용자',
    is_active: true,
    is_system_user: false,
    failed_login_attempts: 0,
    last_login_at: '2025-10-25T09:15:00Z',
    created_at: '2025-03-20T00:00:00Z',
    updated_at: '2025-10-25T09:15:00Z',
  },
  {
    id: '4',
    username: 'user2',
    full_name: '박직원',
    email: 'user2@example.com',
    phone: '010-4567-8901',
    role_name: '사용자',
    is_active: false,
    is_system_user: false,
    failed_login_attempts: 3,
    locked_until: '2025-10-29T14:00:00Z',
    created_at: '2025-04-10T00:00:00Z',
    updated_at: '2025-10-20T08:00:00Z',
  },
  {
    id: '5',
    username: 'user3',
    full_name: '최팀장',
    email: 'user3@example.com',
    phone: '010-5678-9012',
    role_name: '매니저',
    is_active: true,
    is_system_user: false,
    failed_login_attempts: 0,
    last_login_at: '2025-10-28T11:45:00Z',
    created_at: '2025-05-05T00:00:00Z',
    updated_at: '2025-10-28T11:45:00Z',
  },
];

// 테이블 컬럼 정의
const createColumns = (
  onEditUser: (user: User) => void,
  onDeleteUser: (user: User) => void
): ColumnDef<User>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        사용자명
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue('username')}</div>
        <div className="text-xs text-muted-foreground">{row.original.full_name}</div>
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        이메일
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => <div className="text-sm">{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'role_name',
    header: '역할',
    cell: ({ row }) => (
      <div className="inline-block px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
        {row.getValue('role_name')}
      </div>
    ),
  },
  {
    accessorKey: 'is_active',
    header: '상태',
    cell: ({ row }) => {
      const isActive = row.getValue('is_active');
      return (
        <div className="flex items-center gap-2">
          {isActive ? (
            <>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm">활성</span>
            </>
          ) : (
            <>
              <div className="h-2 w-2 rounded-full bg-gray-400"></div>
              <span className="text-sm">비활성</span>
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'last_login_at',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        마지막 로그인
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const loginAt = row.getValue('last_login_at') as string | undefined;
      return <div className="text-sm">{formatDateTime(loginAt)}</div>;
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        생성일시
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue('created_at') as string;
      return <div className="text-sm">{formatDateTime(createdAt)}</div>;
    },
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        수정일시
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const updatedAt = row.getValue('updated_at') as string;
      return <div className="text-sm">{formatDateTime(updatedAt)}</div>;
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
          onClick={() => onEditUser(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeleteUser(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function UsersPage() {
  const {
    selectedRole,
    selectedStatus,
  } = useUserStore();

  // 필터링된 데이터
  const filteredUsers = useMemo(() => {
    return dummyUsers.filter((user) => {
      if (selectedRole && user.role_name !== selectedRole) return false;
      if (
        selectedStatus &&
        (selectedStatus === 'active' ? !user.is_active : user.is_active)
      )
        return false;
      return true;
    });
  }, [selectedRole, selectedStatus]);

  const handleEditUser = (user: User) => {
    const { openForm } = useUserStore.getState();
    openForm(user.id);
  };

  const handleDeleteUser = (user: User) => {
    console.log('Delete user:', user);
  };

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const columns = createColumns(handleEditUser, handleDeleteUser);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <UsersHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <UsersStats users={dummyUsers} />

      {/* 필터 섹션 */}
      <UsersFilters users={dummyUsers} />

      {/* 데이터 테이블 + 페이지네이션 */}
      <UsersTable data={filteredUsers} totalItems={filteredUsers.length} onEdit={() => {}} onDelete={() => {}} />

      {/* 입력 폼 모달 */}
      <UsersEdit users={dummyUsers} />
    </div>
  );
}
