'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  RefreshCw,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit2,
  Trash2,
  ArrowUpDown,
  ChevronDown,
  Building,
  CheckCircle,
  Circle,
  Briefcase,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { StatsCards } from '@/components/stats/stats-cards';
import { PartnerForm } from '@/features/crm/partners/components/partner-form-legacy';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// 페이지 번호 생성 함수
function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const pages: (number | string)[] = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible + 2) {
    for (let i = 0; i < totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(0);

    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages - 2, currentPage + 1);

    if (currentPage <= 2) {
      start = 1;
      end = Math.min(totalPages - 2, maxVisible - 1);
    }

    if (currentPage >= totalPages - 3) {
      start = Math.max(1, totalPages - maxVisible);
      end = totalPages - 2;
    }

    if (start > 1) {
      pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 2) {
      pages.push('...');
    }

    pages.push(totalPages - 1);
  }

  return pages;
}

interface Partner {
  id: string;
  code: string;
  name: string;
  type: 'supplier' | 'customer' | 'both';
  bizNo: string;
  tel: string;
  email: string;
  status: 'active' | 'inactive';
}

// 임시 모의 데이터
const mockPartners: Partner[] = [
  {
    id: '1',
    code: 'SUPP_001',
    name: '(주)협력업체1',
    type: 'supplier' as const,
    bizNo: '123-45-67890',
    tel: '02-1234-5678',
    email: 'contact@supplier1.com',
    status: 'active' as const,
  },
  {
    id: '2',
    code: 'CUST_001',
    name: 'ABC고객사',
    type: 'customer' as const,
    bizNo: '234-56-78901',
    tel: '02-2345-6789',
    email: 'contact@customer1.com',
    status: 'active' as const,
  },
  {
    id: '3',
    code: 'BOTH_001',
    name: '(주)협력고객',
    type: 'both' as const,
    bizNo: '345-67-89012',
    tel: '02-3456-7890',
    email: 'contact@both.com',
    status: 'inactive' as const,
  },
  {
    id: '4',
    code: 'SUPP_002',
    name: '(주)협력업체2',
    type: 'supplier' as const,
    bizNo: '456-78-90123',
    tel: '02-4567-8901',
    email: 'contact@supplier2.com',
    status: 'active' as const,
  },
  {
    id: '5',
    code: 'CUST_002',
    name: 'XYZ고객사',
    type: 'customer' as const,
    bizNo: '567-89-01234',
    tel: '02-5678-9012',
    email: 'contact@customer2.com',
    status: 'active' as const,
  },
];

function handleRefresh() {
  console.log('Refresh data');
}

function handleExport() {
  console.log('Export data');
}

export default function PartnersPage() {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filterExpanded, setFilterExpanded] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  // 컬럼 정의
  const columns: ColumnDef<Partner>[] = [
    {
      id: 'rowNumber',
      header: 'NO',
      cell: ({ row }) => (
        <div className="font-medium text-muted-foreground">{row.index + 1}</div>
      ),
      size: 50,
    },
    {
      accessorKey: 'code',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground"
          onClick={() => column.toggleSorting()}
        >
          거래처 코드
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue('code')}</div>
          <button
            onClick={() => router.push(`/crm/partners-portal/${row.original.id}`)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            {row.original.name}
          </button>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: '거래처 구분',
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        const typeMap: Record<string, { label: string; bg: string }> = {
          supplier: { label: '공급사', bg: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' },
          customer: { label: '고객사', bg: 'bg-indigo-100/60 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' },
          both: { label: '공급사/고객사', bg: 'bg-indigo-50 dark:bg-indigo-900/10 text-indigo-500 dark:text-indigo-300' },
        };
        const display = typeMap[type] || typeMap.supplier;
        return (
          <div className={`inline-block px-2.5 py-1 rounded-md ${display.bg} text-xs font-medium`}>
            {display.label}
          </div>
        );
      },
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
      accessorKey: 'tel',
      header: '전화번호',
      cell: ({ row }) => <div className="text-sm">{row.getValue('tel')}</div>,
    },
    {
      accessorKey: 'status',
      header: '상태',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <div className="flex items-center gap-2">
            {status === 'active' ? (
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
            onClick={() => router.push(`/crm/partners-portal/${row.original.id}`)}
            title="포탈 보기"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => router.push(`/crm/partners/${row.original.id}`)}
            title="편집"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => {
              setPartners(partners.filter((p) => p.id !== row.original.id));
            }}
            title="삭제"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // 필터링된 데이터
  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      if (selectedType && partner.type !== selectedType) return false;
      if (selectedStatus && (selectedStatus === 'active' ? !partner.status : partner.status === 'active')) return false;
      if (globalFilter) {
        const query = globalFilter.toLowerCase();
        return (
          partner.name.toLowerCase().includes(query) ||
          partner.code.toLowerCase().includes(query) ||
          partner.email.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [partners, selectedType, selectedStatus, globalFilter]);

  const table = useReactTable({
    data: filteredPartners,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // 통계 계산
  const stats = useMemo(() => {
    const total = partners.length;
    const active = partners.filter((p) => p.status === 'active').length;
    const inactive = partners.filter((p) => p.status === 'inactive').length;
    const suppliers = partners.filter((p) => p.type === 'supplier').length;

    return [
      {
        title: '전체 거래처',
        value: total,
        description: '총 등록된 거래처',
        icon: <Building className="h-5 w-5" />,
        color: 'primary' as const,
      },
      {
        title: '활성 거래처',
        value: active,
        description: '거래 진행 중',
        icon: <CheckCircle className="h-5 w-5" />,
        color: 'success' as const,
      },
      {
        title: '비활성 거래처',
        value: inactive,
        description: '거래 중단',
        icon: <Circle className="h-5 w-5" />,
        color: 'default' as const,
      },
      {
        title: '공급사',
        value: suppliers,
        description: '공급처',
        icon: <Briefcase className="h-5 w-5" />,
        color: 'warning' as const,
      },
    ];
  }, [partners]);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">거래처 관리</h1>
          <p className="text-muted-foreground mt-2">거래처 정보를 관리합니다</p>
        </div>
        <ButtonGroup>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            새로고침
          </Button>
          <Button onClick={() => {
            const router = require('next/navigation').useRouter;
            const pushRouter = router();
            pushRouter.push('/crm/partners/new');
          }}>
            <Plus className="mr-2 h-4 w-4" />
            거래처 추가
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            내보내기
          </Button>
        </ButtonGroup>
      </div>

      {/* 통계 카드 */}
      <StatsCards cards={stats} columns={4} />

      {/* 필터 섹션 */}
      <div>
        {/* 필터 헤더 */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-sm font-medium text-foreground">검색필터</span>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
          </div>
          <button
            onClick={() => setFilterExpanded(!filterExpanded)}
            className="ml-4 p-1 hover:bg-accent rounded-md transition-colors"
            title={filterExpanded ? '필터 숨기기' : '필터 보이기'}
          >
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground transition-transform ${
                filterExpanded ? '' : '-rotate-90'
              }`}
            />
          </button>
        </div>

        {/* 필터 컨텐츠 */}
        {filterExpanded && (
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 검색 */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  검색
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="거래처명, 코드, 이메일..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
              </div>

              {/* 거래처 구분 필터 */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  거래처 구분
                </label>
                <Select value={selectedType || 'all'} onValueChange={(value) => setSelectedType(value === 'all' ? '' : value)}>
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="전체 구분" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 구분</SelectItem>
                    <SelectItem value="supplier">공급사</SelectItem>
                    <SelectItem value="customer">고객사</SelectItem>
                    <SelectItem value="both">공급사/고객사</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 상태 필터 */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  상태
                </label>
                <Select value={selectedStatus || 'all'} onValueChange={(value) => setSelectedStatus(value === 'all' ? '' : value)}>
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="전체 상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 상태</SelectItem>
                    <SelectItem value="active">활성</SelectItem>
                    <SelectItem value="inactive">비활성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 데이터 테이블 */}
      <div className="rounded-lg border border-border overflow-hidden bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 border-b border-border">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider h-12">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                      <TableCell key={cell.id} className="px-6 py-4 h-16 font-light">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={table.getAllColumns().length} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="text-4xl opacity-20">📊</div>
                      <p>데이터가 없습니다.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          전체{' '}
          <span className="font-medium text-foreground">
            {table.getFilteredRowModel().rows.length}
          </span>
          개
        </div>
        <div className="flex items-center gap-6">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">페이지당 행 수</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px] bg-background border-input">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pagination Buttons */}
          <ButtonGroup>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">첫 페이지로</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">이전 페이지</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page Number Buttons */}
            {getPageNumbers(table.getState().pagination.pageIndex, table.getPageCount()).map((pageNum, idx) =>
              pageNum === '...' ? (
                <div key={`ellipsis-${idx}`} className="h-9 w-9 flex items-center justify-center border-y border-r border-input bg-background">
                  <span className="text-muted-foreground text-sm">⋯</span>
                </div>
              ) : (
                <Button
                  key={pageNum}
                  variant={table.getState().pagination.pageIndex === pageNum ? 'default' : 'outline'}
                  size="icon"
                  className="h-9 w-9 text-sm font-medium"
                  onClick={() => table.setPageIndex(pageNum as number)}
                >
                  {(pageNum as number) + 1}
                </Button>
              )
            )}

            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">다음 페이지</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">마지막 페이지로</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* 거래처 폼 */}
      <PartnerForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={selectedPartner ? 'edit' : 'create'}
        data={selectedPartner}
        onSave={(data) => {
          if (selectedPartner) {
            setPartners(
              partners.map((p) =>
                p.id === selectedPartner.id ? { ...selectedPartner, ...data } : p
              )
            );
          } else {
            const newPartner: Partner = {
              id: String(partners.length + 1),
              ...data,
            };
            setPartners([...partners, newPartner]);
          }
          setIsFormOpen(false);
          setSelectedPartner(null);
        }}
      />
    </div>
  );
}
