'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  BusinessDocumentsHeader,
  BusinessDocumentsStats,
  BusinessDocumentsFilters,
  BusinessDocumentsList,
  BusinessDocumentsPaging,
  BusinessDocumentsEdit,
} from '@/features/fim/business-documents';
import { useBusinessDocumentsStore } from '@/features/fim/business-documents/stores';

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

// BusinessDocument 인터페이스 정의
interface BusinessDocument {
  id: string;
  document_number: string;
  vendor_name: string;
  amount: number;
  document_type: '송장' | '영수증' | '청구서';
  status: '대기' | '완료';
  created_at: string;
  updated_at: string;
}

// 더미 데이터
const dummyBusinessDocuments: BusinessDocument[] = [
  {
    id: '1',
    document_number: 'DOC-2025-001',
    vendor_name: '(주)한국산업',
    amount: 45000000,
    document_type: '송장',
    status: '대기',
    created_at: '2025-10-25T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
  {
    id: '2',
    document_number: 'DOC-2025-002',
    vendor_name: '대한무역(주)',
    amount: 32000000,
    document_type: '영수증',
    status: '완료',
    created_at: '2025-10-20T00:00:00Z',
    updated_at: '2025-10-25T15:20:00Z',
  },
  {
    id: '3',
    document_number: 'DOC-2025-003',
    vendor_name: '글로벌상사',
    amount: 58000000,
    document_type: '청구서',
    status: '대기',
    created_at: '2025-10-15T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
];

// 금액 포맷 함수 (백만원 단위)
function formatAmount(amount: number): string {
  return `${(amount / 1000000).toFixed(1)}M`;
}

// 테이블 컬럼 정의
const createColumns = (
  onEditBusinessDocument: (businessDocument: BusinessDocument) => void,
  onDeleteBusinessDocument: (businessDocument: BusinessDocument) => void
): ColumnDef<BusinessDocument>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'document_number',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        문서번호
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('document_number')}</div>
    ),
  },
  {
    accessorKey: 'vendor_name',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        거래처
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue('vendor_name')}</div>
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        금액
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-right font-medium">
        {formatAmount(row.getValue('amount'))}
      </div>
    ),
  },
  {
    accessorKey: 'document_type',
    header: '문서유형',
    cell: ({ row }) => {
      const type = row.getValue('document_type') as string;
      const colorMap: Record<string, string> = {
        '송장': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        '영수증': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        '청구서': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      };
      return (
        <div className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${colorMap[type]}`}>
          {type}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const colorMap: Record<string, string> = {
        '대기': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
        '완료': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      };
      return (
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${status === '완료' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <div className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${colorMap[status]}`}>
            {status}
          </div>
        </div>
      );
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
    id: 'actions',
    header: '작업',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => onEditBusinessDocument(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeleteBusinessDocument(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function BusinessDocumentsPage() {
  const {
    selectedType,
    selectedStatus,
  } = useBusinessDocumentsStore();

  // 필터링된 데이터
  const filteredBusinessDocuments = useMemo(() => {
    return dummyBusinessDocuments.filter((doc) => {
      if (selectedType && doc.document_type !== selectedType) return false;
      if (selectedStatus && doc.status !== selectedStatus) return false;
      return true;
    });
  }, [selectedType, selectedStatus]);

  const handleEditBusinessDocument = (doc: BusinessDocument) => {
    const { openForm } = useBusinessDocumentsStore.getState();
    openForm(doc.id);
  };

  const handleDeleteBusinessDocument = (doc: BusinessDocument) => {
    console.log('Delete business document:', doc);
  };

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    const { editingId } = useBusinessDocumentsStore.getState();
    if (editingId) {
      console.log('Update business document:', editingId, formData);
    } else {
      console.log('Create business document:', formData);
    }
  };

  const columns = createColumns(handleEditBusinessDocument, handleDeleteBusinessDocument);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <BusinessDocumentsHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <BusinessDocumentsStats businessDocuments={dummyBusinessDocuments} />

      {/* 필터 섹션 */}
      <BusinessDocumentsFilters businessDocuments={dummyBusinessDocuments} />

      {/* 데이터 테이블 */}
      <BusinessDocumentsList columns={columns} data={filteredBusinessDocuments} />

      {/* 페이지네이션 */}
      <BusinessDocumentsPaging totalItems={filteredBusinessDocuments.length} itemsPerPage={10} />

      {/* 입력 폼 모달 */}
      <BusinessDocumentsEdit businessDocuments={dummyBusinessDocuments} onSubmit={handleFormSubmit} />
    </div>
  );
}
