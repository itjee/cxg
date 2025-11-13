'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  CustomerSurveysHeader,
  CustomerSurveysStats,
  CustomerSurveysFilters,
  CustomerSurveysTable,
  CustomerSurveysPaging,
  CustomerSurveysEdit,
} from '@/features/crm/customer-surveys';
import { useCustomerSurveysStore } from '@/features/crm/customer-surveys/stores';

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

interface CustomerSurvey {
  id: string;
  title: string;
  description?: string;
  survey_type: 'SATISFACTION' | 'NPS' | 'FEEDBACK' | 'OTHER';
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
  response_count: number;
  total_distributed: number;
  created_at: string;
  updated_at: string;
}

const dummySurveys: CustomerSurvey[] = [
  {
    id: '1',
    title: '고객 만족도 조사 (Q4 2024)',
    description: '4분기 서비스 만족도 평가',
    survey_type: 'SATISFACTION',
    status: 'ACTIVE',
    response_count: 145,
    total_distributed: 500,
    created_at: '2024-10-01T10:00:00Z',
    updated_at: '2024-11-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'NPS 조사',
    description: '순추천 고객지수 측정',
    survey_type: 'NPS',
    status: 'ACTIVE',
    response_count: 87,
    total_distributed: 300,
    created_at: '2024-10-15T14:00:00Z',
    updated_at: '2024-10-28T14:00:00Z',
  },
  {
    id: '3',
    title: '신제품 피드백',
    description: '신제품 출시 전 피드백 수집',
    survey_type: 'FEEDBACK',
    status: 'CLOSED',
    response_count: 243,
    total_distributed: 400,
    created_at: '2024-09-01T09:30:00Z',
    updated_at: '2024-10-15T09:30:00Z',
  },
];

const createColumns = (
  onEditSurvey: (survey: CustomerSurvey) => void,
  onDeleteSurvey: (survey: CustomerSurvey) => void
): ColumnDef<CustomerSurvey>[] => [
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
    accessorKey: 'survey_type',
    header: '유형',
    cell: ({ row }) => {
      const type = row.getValue('survey_type') as string;
      const typeMap: Record<string, string> = { SATISFACTION: '만족도', NPS: 'NPS', FEEDBACK: '피드백', OTHER: '기타' };
      return <div className="text-sm">{typeMap[type] || type}</div>;
    },
  },
  {
    accessorKey: 'response_count',
    header: '응답현황',
    cell: ({ row }) => {
      const response = row.getValue('response_count') as number;
      const total = row.original.total_distributed as number;
      const rate = total > 0 ? ((response / total) * 100).toFixed(1) : '0';
      return <div className="text-sm">{response} / {total} ({rate}%)</div>;
    },
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, string> = { DRAFT: '초안', ACTIVE: '진행중', CLOSED: '종료됨', ARCHIVED: '보관됨' };
      const statusColors: Record<string, string> = { DRAFT: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400', ACTIVE: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400', CLOSED: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400', ARCHIVED: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400' };
      return (
        <div className={`text-sm px-2.5 py-1 rounded-md inline-block ${statusColors[status] || 'bg-gray-50'}`}>
          {statusMap[status] || status}
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: '생성일시',
    cell: ({ row }) => <div className="text-sm">{formatDateTime(row.getValue('created_at') as string)}</div>,
  },
  {
    id: 'actions',
    header: '작업',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEditSurvey(row.original)} title="편집">
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onDeleteSurvey(row.original)} title="삭제">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function CustomerSurveysPage() {
  const store = useCustomerSurveysStore();
  const filteredSurveys = useMemo(() => dummySurveys.filter(() => true), []);
  const columns = createColumns((s) => store.openForm(s.id), () => {});

  return (
    <div className="space-y-6">
      <CustomerSurveysHeader onRefresh={() => {}} onExport={() => {}} />
      <CustomerSurveysStats surveys={dummySurveys} />
      <CustomerSurveysFilters surveys={dummySurveys} />
      <CustomerSurveysTable columns={columns} data={filteredSurveys} />
      <CustomerSurveysPaging totalItems={filteredSurveys.length} itemsPerPage={10} />
      <CustomerSurveysEdit surveys={dummySurveys} onSubmit={() => {}} />
    </div>
  );
}
