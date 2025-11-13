'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  ActivitiesHeader,
  ActivitiesStats,
  ActivitiesFilters,
  ActivitiesTable,
  ActivitiesPaging,
  ActivitiesEdit,
} from '@/features/crm/activities';
import { useActivityStore } from '@/features/crm/activities/stores';
import type { Activity } from '@/features/crm/activities/types';

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
const dummyActivities: Activity[] = [
  {
    id: '1',
    title: '전화 통화',
    partner_id: 'partner-1',
    partner_name: '(주)협력업체1',
    activity_type: 'CALL',
    description: '신규 프로젝트 관련 협의',
    scheduled_date: '2024-11-01',
    completed_date: '2024-11-01',
    assigned_to: 'user1',
    created_by: 'user1',
    status: 'COMPLETED',
    created_at: '2024-11-01T09:00:00Z',
    updated_at: '2024-11-01T09:00:00Z',
  },
  {
    id: '2',
    title: '이메일 발송',
    partner_id: 'partner-2',
    partner_name: 'ABC고객사',
    activity_type: 'EMAIL',
    description: '제안서 발송',
    scheduled_date: '2024-11-02',
    completed_date: '2024-11-02',
    assigned_to: 'user2',
    created_by: 'user2',
    status: 'COMPLETED',
    created_at: '2024-11-02T10:00:00Z',
    updated_at: '2024-11-02T10:00:00Z',
  },
  {
    id: '3',
    title: '미팅',
    partner_id: 'partner-3',
    partner_name: '(주)협력고객',
    activity_type: 'MEETING',
    description: '계약 조건 협상',
    scheduled_date: '2024-11-05',
    assigned_to: 'user3',
    created_by: 'user3',
    status: 'PENDING',
    created_at: '2024-11-01T14:00:00Z',
    updated_at: '2024-11-01T14:00:00Z',
  },
];

// 테이블 컬럼 정의
const createColumns = (
  onEditActivity: (activity: Activity) => void,
  onDeleteActivity: (activity: Activity) => void
): ColumnDef<Activity>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        활동명
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue('title')}</div>
        <div className="text-xs text-muted-foreground">{row.original.description}</div>
      </div>
    ),
  },
  {
    accessorKey: 'activity_type',
    header: '활동 유형',
    cell: ({ row }) => {
      const type = row.getValue('activity_type') as string;
      const typeMap: Record<string, string> = {
        CALL: '전화',
        EMAIL: '이메일',
        MEETING: '미팅',
        NOTE: '노트',
        TASK: '작업',
        OTHER: '기타',
      };
      return (
        <div className="text-sm px-2.5 py-1 rounded-md bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 inline-block">
          {typeMap[type] || type}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, string> = {
        PENDING: '대기중',
        COMPLETED: '완료',
        CANCELLED: '취소',
      };
      const statusColors: Record<string, string> = {
        PENDING: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
        COMPLETED: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
        CANCELLED: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
      };
      return (
        <div className={`text-sm px-2.5 py-1 rounded-md inline-block ${statusColors[status] || 'bg-gray-50'}`}>
          {statusMap[status] || status}
        </div>
      );
    },
  },
  {
    accessorKey: 'scheduled_date',
    header: '예정일',
    cell: ({ row }) => {
      const date = row.getValue('scheduled_date') as string;
      if (!date) return <div className="text-sm">-</div>;
      return <div className="text-sm">{new Date(date).toLocaleDateString('ko-KR')}</div>;
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
          onClick={() => onEditActivity(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeleteActivity(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function ActivitiesPage() {
  const {
    selectedType,
    selectedStatus,
  } = useActivityStore();

  // 필터링된 데이터
  const filteredActivities = useMemo(() => {
    return dummyActivities.filter((activity) => {
      if (selectedType && activity.activity_type !== selectedType) return false;
      if (
        selectedStatus &&
        (selectedStatus === 'completed' ? activity.status !== 'COMPLETED' : activity.status === 'COMPLETED')
      )
        return false;
      return true;
    });
  }, [selectedType, selectedStatus]);

  const handleEditActivity = (activity: Activity) => {
    const { openForm } = useActivityStore.getState();
    openForm(activity.id);
  };

  const handleDeleteActivity = (activity: Activity) => {
    console.log('Delete activity:', activity);
  };

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    const { editingId } = useActivityStore.getState();
    if (editingId) {
      console.log('Update activity:', editingId, formData);
    } else {
      console.log('Create activity:', formData);
    }
  };

  const columns = createColumns(handleEditActivity, handleDeleteActivity);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <ActivitiesHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <ActivitiesStats activities={dummyActivities} />

      {/* 필터 섹션 */}
      <ActivitiesFilters activities={dummyActivities} />

      {/* 데이터 테이블 */}
      <ActivitiesTable columns={columns} data={filteredActivities} />

      {/* 페이지네이션 */}
      <ActivitiesPaging totalItems={filteredActivities.length} itemsPerPage={10} />

      {/* 입력 폼 모달 */}
      <ActivitiesEdit activities={dummyActivities} onSubmit={handleFormSubmit} />
    </div>
  );
}
