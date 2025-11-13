'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  InteractionsHeader,
  InteractionsStats,
  InteractionsFilters,
  InteractionsTable,
  InteractionsPaging,
  InteractionsEdit,
} from '@/features/crm/interactions';
import { useInteractionsStore } from '@/features/crm/interactions/stores';

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

// 상호작용 타입 정의
interface Interaction {
  id: string;
  title: string;
  description?: string;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE' | 'SMS' | 'OTHER';
  partner_id: string;
  partner_name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// 더미 데이터
const dummyInteractions: Interaction[] = [
  {
    id: '1',
    title: '초기 접촉 통화',
    description: '신규 거래처 첫 접촉',
    type: 'CALL',
    partner_id: 'partner-1',
    partner_name: '(주)ABC',
    created_by: 'user1',
    created_at: '2024-11-01T10:00:00Z',
    updated_at: '2024-11-01T10:00:00Z',
  },
  {
    id: '2',
    title: '미팅 내용 정리',
    description: '계약 조건 논의 내용',
    type: 'MEETING',
    partner_id: 'partner-2',
    partner_name: 'XYZ Corp',
    created_by: 'user2',
    created_at: '2024-10-28T14:00:00Z',
    updated_at: '2024-10-28T14:00:00Z',
  },
  {
    id: '3',
    title: '제안서 발송 완료',
    description: '이메일로 제안서 전송',
    type: 'EMAIL',
    partner_id: 'partner-3',
    partner_name: 'DEF 솔루션',
    created_by: 'user3',
    created_at: '2024-10-25T11:30:00Z',
    updated_at: '2024-10-25T11:30:00Z',
  },
];

// 테이블 컬럼 정의
const createColumns = (
  onEditInteraction: (interaction: Interaction) => void,
  onDeleteInteraction: (interaction: Interaction) => void
): ColumnDef<Interaction>[] => [
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
        제목
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
    accessorKey: 'type',
    header: '유형',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      const typeMap: Record<string, string> = {
        CALL: '통화',
        EMAIL: '이메일',
        MEETING: '미팅',
        NOTE: '노트',
        SMS: 'SMS',
        OTHER: '기타',
      };
      return (
        <div className="text-sm px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 inline-block">
          {typeMap[type] || type}
        </div>
      );
    },
  },
  {
    accessorKey: 'partner_name',
    header: '거래처',
    cell: ({ row }) => <div className="text-sm">{row.getValue('partner_name')}</div>,
  },
  {
    accessorKey: 'created_by',
    header: '작성자',
    cell: ({ row }) => <div className="text-sm">{row.getValue('created_by')}</div>,
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
          onClick={() => onEditInteraction(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeleteInteraction(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function InteractionsPage() {
  const interactionStore = useInteractionsStore();

  // 필터링된 데이터
  const filteredInteractions = useMemo(() => {
    return dummyInteractions.filter(() => true);
  }, []);

  const handleEditInteraction = (interaction: Interaction) => {
    interactionStore.openForm(interaction.id);
  };

  const handleDeleteInteraction = (interaction: Interaction) => {
    console.log('Delete interaction:', interaction);
  };

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    if (interactionStore.editingId) {
      console.log('Update interaction:', interactionStore.editingId, formData);
    } else {
      console.log('Create interaction:', formData);
    }
  };

  const columns = createColumns(handleEditInteraction, handleDeleteInteraction);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <InteractionsHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <InteractionsStats interactions={dummyInteractions} />

      {/* 필터 섹션 */}
      <InteractionsFilters interactions={dummyInteractions} />

      {/* 데이터 테이블 */}
      <InteractionsTable columns={columns} data={filteredInteractions} />

      {/* 페이지네이션 */}
      <InteractionsPaging totalItems={filteredInteractions.length} itemsPerPage={10} />

      {/* 입력 폼 모달 */}
      <InteractionsEdit interactions={dummyInteractions} onSubmit={handleFormSubmit} />
    </div>
  );
}
