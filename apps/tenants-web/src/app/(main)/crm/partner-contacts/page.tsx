'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  RefreshCw,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Users,
  UserCheck,
  UserX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { StatsCards } from '@/components/stats/stats-cards';
import {
  PartnerContactsTable,
  PartnerContactForm,
  usePartnerContacts,
  useCreatePartnerContact,
  useUpdatePartnerContact,
  useDeletePartnerContact,
} from '@/features/crm/partner-contacts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SortingState } from '@tanstack/react-table';
import type { PartnerContact } from '@/features/crm/partner-contacts';

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

export default function PartnerContactsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filterExpanded, setFilterExpanded] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<PartnerContact | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // API 호출 (실제 데이터: 파트너 ID가 필요하지만, 여기서는 목 데이터 사용)
  // 실제 구현에서는 URL 파라미터 또는 전역 상태에서 파트너 ID를 가져와야 함
  const mockContacts: PartnerContact[] = [
    {
      id: '1',
      partner_id: 'partner-1',
      contact_name: '김영업',
      position: '과장',
      department: '영업팀',
      phone: '02-1234-5678',
      mobile: '010-1234-5678',
      email: 'kim.sales@example.com',
      contact_type: 'SALES',
      is_primary: true,
      status: 'ACTIVE',
      notes: '주담당 영업담당자',
      is_deleted: false,
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      partner_id: 'partner-1',
      contact_name: '이구매',
      position: '대리',
      department: '구매팀',
      phone: '02-1234-5679',
      mobile: '010-1234-5679',
      email: 'lee.purchasing@example.com',
      contact_type: 'PURCHASING',
      is_primary: false,
      status: 'ACTIVE',
      notes: '구매 담당',
      is_deleted: false,
      created_at: '2024-01-02T00:00:00Z',
    },
    {
      id: '3',
      partner_id: 'partner-1',
      contact_name: '박회계',
      position: '부장',
      department: '회계팀',
      phone: '02-1234-5680',
      mobile: '010-1234-5680',
      email: 'park.accounting@example.com',
      contact_type: 'ACCOUNTING',
      is_primary: false,
      status: 'ACTIVE',
      notes: '결산 담당',
      is_deleted: false,
      created_at: '2024-01-03T00:00:00Z',
    },
  ];

  // 필터링된 데이터
  const filteredContacts = useMemo(() => {
    return mockContacts.filter((contact) => {
      if (selectedStatus && contact.status !== selectedStatus) return false;
      if (selectedType && contact.contact_type !== selectedType) return false;
      if (globalFilter) {
        const query = globalFilter.toLowerCase();
        return (
          contact.contact_name.toLowerCase().includes(query) ||
          contact.email?.toLowerCase().includes(query) ||
          contact.phone?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [selectedStatus, selectedType, globalFilter]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredContacts.length / pageSize);
  const paginatedContacts = filteredContacts.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  // 통계 계산
  const stats = useMemo(() => {
    const total = mockContacts.length;
    const active = mockContacts.filter((c) => c.status === 'ACTIVE').length;
    const inactive = mockContacts.filter((c) => c.status === 'INACTIVE').length;
    const primary = mockContacts.filter((c) => c.is_primary).length;

    return [
      {
        title: '전체 담당자',
        value: total,
        description: '총 등록된 담당자',
        icon: <Users className="h-5 w-5" />,
        color: 'primary' as const,
      },
      {
        title: '활성 담당자',
        value: active,
        description: '활동 중인 담당자',
        icon: <UserCheck className="h-5 w-5" />,
        color: 'success' as const,
      },
      {
        title: '비활성 담당자',
        value: inactive,
        description: '비활동 중인 담당자',
        icon: <UserX className="h-5 w-5" />,
        color: 'default' as const,
      },
      {
        title: '주담당자',
        value: primary,
        description: '주 담당자',
        icon: <UserCheck className="h-5 w-5" />,
        color: 'warning' as const,
      },
    ];
  }, []);

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleCreateContact = async (data: any) => {
    console.log('Creating contact:', data);
    setIsFormOpen(false);
  };

  const handleUpdateContact = async (data: any) => {
    console.log('Updating contact:', data);
    setIsFormOpen(false);
  };

  const handleDeleteContact = (contact: PartnerContact) => {
    if (confirm(`${contact.contact_name} 담당자를 삭제하시겠습니까?`)) {
      console.log('Deleting contact:', contact.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">거래처 연락처</h1>
          <p className="text-muted-foreground mt-2">거래처 담당자 정보를 관리합니다</p>
        </div>
        <ButtonGroup>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            새로고침
          </Button>
          <Button onClick={() => {
            setSelectedContact(null);
            setIsFormOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            담당자 추가
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
            <ChevronRight
              className={`h-5 w-5 text-muted-foreground transition-transform ${
                filterExpanded ? 'rotate-90' : ''
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
                    placeholder="담당자명, 이메일, 전화..."
                    value={globalFilter}
                    onChange={(e) => {
                      setGlobalFilter(e.target.value);
                      setCurrentPage(0);
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
              </div>

              {/* 담당자 유형 필터 */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  담당자 유형
                </label>
                <Select
                  value={selectedType || 'all'}
                  onValueChange={(value) => {
                    setSelectedType(value === 'all' ? '' : value);
                    setCurrentPage(0);
                  }}
                >
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="전체 유형" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 유형</SelectItem>
                    <SelectItem value="SALES">영업담당</SelectItem>
                    <SelectItem value="PURCHASING">구매담당</SelectItem>
                    <SelectItem value="ACCOUNTING">회계담당</SelectItem>
                    <SelectItem value="TECHNICAL">기술담당</SelectItem>
                    <SelectItem value="MANAGEMENT">경영진</SelectItem>
                    <SelectItem value="OTHER">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 상태 필터 */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  상태
                </label>
                <Select
                  value={selectedStatus || 'all'}
                  onValueChange={(value) => {
                    setSelectedStatus(value === 'all' ? '' : value);
                    setCurrentPage(0);
                  }}
                >
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="전체 상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 상태</SelectItem>
                    <SelectItem value="ACTIVE">활성</SelectItem>
                    <SelectItem value="INACTIVE">비활성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 데이터 테이블 */}
      <PartnerContactsTable
        data={paginatedContacts}
        isLoading={false}
        onEdit={(contact) => {
          setSelectedContact(contact);
          setIsFormOpen(true);
        }}
        onDelete={handleDeleteContact}
        sorting={sorting}
        setSorting={setSorting}
      />

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          전체{' '}
          <span className="font-medium text-foreground">
            {filteredContacts.length}
          </span>
          개
        </div>
        <div className="flex items-center gap-6">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">페이지당 행 수</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(0);
              }}
            >
              <SelectTrigger className="h-8 w-[70px] bg-background border-input">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
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
              onClick={() => setCurrentPage(0)}
              disabled={currentPage === 0}
            >
              <span className="sr-only">첫 페이지로</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              <span className="sr-only">이전 페이지</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page Number Buttons */}
            {getPageNumbers(currentPage, totalPages).map((pageNum, idx) =>
              pageNum === '...' ? (
                <div
                  key={`ellipsis-${idx}`}
                  className="h-9 w-9 flex items-center justify-center border-y border-r border-input bg-background"
                >
                  <span className="text-muted-foreground text-sm">⋯</span>
                </div>
              ) : (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size="icon"
                  className="h-9 w-9 text-sm font-medium"
                  onClick={() => setCurrentPage(pageNum as number)}
                >
                  {(pageNum as number) + 1}
                </Button>
              )
            )}

            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
            >
              <span className="sr-only">다음 페이지</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setCurrentPage(totalPages - 1)}
              disabled={currentPage >= totalPages - 1}
            >
              <span className="sr-only">마지막 페이지로</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* 담당자 폼 */}
      <PartnerContactForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        contact={selectedContact}
        mode={selectedContact ? 'edit' : 'create'}
        onSave={selectedContact ? handleUpdateContact : handleCreateContact}
      />
    </div>
  );
}
