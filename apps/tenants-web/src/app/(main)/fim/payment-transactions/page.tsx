'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  PaymentTransactionsHeader,
  PaymentTransactionsStats,
  PaymentTransactionsFilters,
  PaymentTransactionsList,
  PaymentTransactionsPaging,
  PaymentTransactionsEdit,
} from '@/features/fim/payment-transactions';
import { usePaymentTransactionsStore } from '@/features/fim/payment-transactions/stores';

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

// PaymentTransaction 인터페이스 정의
interface PaymentTransaction {
  id: string;
  transaction_number: string;
  payer_name: string;
  amount: number;
  payment_method: '현금' | '카드' | '이체';
  status: '대기' | '완료' | '취소';
  created_at: string;
  updated_at: string;
}

// 더미 데이터
const dummyPaymentTransactions: PaymentTransaction[] = [
  {
    id: '1',
    transaction_number: 'PAY-2025-001',
    payer_name: '(주)삼성물산',
    amount: 50000000,
    payment_method: '이체',
    status: '완료',
    created_at: '2025-10-28T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
  {
    id: '2',
    transaction_number: 'PAY-2025-002',
    payer_name: '현대건설(주)',
    amount: 40000000,
    payment_method: '카드',
    status: '대기',
    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
  {
    id: '3',
    transaction_number: 'PAY-2025-003',
    payer_name: 'LG전자',
    amount: 30000000,
    payment_method: '현금',
    status: '취소',
    created_at: '2025-10-25T00:00:00Z',
    updated_at: '2025-10-26T15:20:00Z',
  },
];

// 금액 포맷 함수 (백만원 단위)
function formatAmount(amount: number): string {
  return `${(amount / 1000000).toFixed(1)}M`;
}

// 테이블 컬럼 정의
const createColumns = (
  onEditPaymentTransaction: (paymentTransaction: PaymentTransaction) => void,
  onDeletePaymentTransaction: (paymentTransaction: PaymentTransaction) => void
): ColumnDef<PaymentTransaction>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'transaction_number',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        거래번호
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('transaction_number')}</div>
    ),
  },
  {
    accessorKey: 'payer_name',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        결제자
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue('payer_name')}</div>
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
    accessorKey: 'payment_method',
    header: '결제방법',
    cell: ({ row }) => {
      const method = row.getValue('payment_method') as string;
      const colorMap: Record<string, string> = {
        '현금': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        '카드': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        '이체': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      };
      return (
        <div className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${colorMap[method]}`}>
          {method}
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
        '취소': 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300',
      };
      return (
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${status === '완료' ? 'bg-green-500' : status === '대기' ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
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
          onClick={() => onEditPaymentTransaction(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeletePaymentTransaction(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function PaymentTransactionsPage() {
  const {
    selectedMethod,
    selectedStatus,
  } = usePaymentTransactionsStore();

  // 필터링된 데이터
  const filteredPaymentTransactions = useMemo(() => {
    return dummyPaymentTransactions.filter((transaction) => {
      if (selectedMethod && transaction.payment_method !== selectedMethod) return false;
      if (selectedStatus && transaction.status !== selectedStatus) return false;
      return true;
    });
  }, [selectedMethod, selectedStatus]);

  const handleEditPaymentTransaction = (transaction: PaymentTransaction) => {
    const { openForm } = usePaymentTransactionsStore.getState();
    openForm(transaction.id);
  };

  const handleDeletePaymentTransaction = (transaction: PaymentTransaction) => {
    console.log('Delete payment transaction:', transaction);
  };

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    const { editingId } = usePaymentTransactionsStore.getState();
    if (editingId) {
      console.log('Update payment transaction:', editingId, formData);
    } else {
      console.log('Create payment transaction:', formData);
    }
  };

  const columns = createColumns(handleEditPaymentTransaction, handleDeletePaymentTransaction);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <PaymentTransactionsHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <PaymentTransactionsStats paymentTransactions={dummyPaymentTransactions} />

      {/* 필터 섹션 */}
      <PaymentTransactionsFilters paymentTransactions={dummyPaymentTransactions} />

      {/* 데이터 테이블 */}
      <PaymentTransactionsList columns={columns} data={filteredPaymentTransactions} />

      {/* 페이지네이션 */}
      <PaymentTransactionsPaging totalItems={filteredPaymentTransactions.length} itemsPerPage={10} />

      {/* 입력 폼 모달 */}
      <PaymentTransactionsEdit paymentTransactions={dummyPaymentTransactions} onSubmit={handleFormSubmit} />
    </div>
  );
}
