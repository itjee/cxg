'use client';

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, FileText, Plus, Mail, Phone, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Partner {
  id: string;
  code: string;
  name: string;
  type: 'supplier' | 'customer' | 'both';
  tier?: string;
}

interface Contact {
  id: string;
  name: string;
  title: string;
  email?: string;
  phone?: string;
  isPrimary?: boolean;
}

interface ChatterFeed {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  likes: number;
  attachments?: string[];
}

interface RelatedFile {
  id: string;
  name: string;
  type: string; // contract, agreement, proposal, etc
  uploadedDate: string;
  uploadedBy: string;
  size: string;
}

interface PartnerPortalSidebarProps {
  partnerId: string;
  contacts?: Contact[];
  feeds?: ChatterFeed[];
  files?: RelatedFile[];
  onAddContact?: () => void;
  onAddFeed?: () => void;
  onAddFile?: () => void;
  recentPartners?: Partner[];
}

export function PartnerPortalSidebar({
  partnerId,
  contacts = [],
  feeds = [],
  files = [],
  onAddContact,
  onAddFeed,
  onAddFile,
  recentPartners = [],
}: PartnerPortalSidebarProps) {
  const router = useRouter();

  // Mock 모든 거래처 (partner-selector와 동일한 데이터)
  const mockPartners: Partner[] = [
    {
      id: '1',
      code: 'CUST_001',
      name: 'ABC고객사',
      type: 'customer',
      tier: '우수',
    },
    {
      id: '2',
      code: 'CUST_002',
      name: '삼성전자',
      type: 'customer',
      tier: '우수',
    },
    {
      id: '3',
      code: 'CUST_003',
      name: 'LG전자',
      type: 'customer',
      tier: '일반',
    },
    {
      id: '4',
      code: 'SUPP_001',
      name: '(주)부품공급사',
      type: 'supplier',
      tier: '협력사',
    },
    {
      id: '5',
      code: 'SUPP_002',
      name: 'CJ제일제당',
      type: 'customer',
      tier: '우수',
    },
    {
      id: '6',
      code: 'SUPP_003',
      name: '현대자동차',
      type: 'customer',
      tier: '우수',
    },
    {
      id: '7',
      code: 'SUPP_004',
      name: 'SK하이닉스',
      type: 'customer',
      tier: '일반',
    },
    {
      id: '8',
      code: 'SUPP_005',
      name: '넥슨',
      type: 'customer',
      tier: '일반',
    },
  ];

  // 최근 거래처 가져오기
  const recentPartnerIds = useMemo(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('recentPartners');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  // 최근 거래처 목록 (현재 거래처 제외, 최대 5개)
  const recentList = useMemo(() => {
    return mockPartners
      .filter((p) => recentPartnerIds.includes(p.id) && p.id !== partnerId)
      .slice(0, 5);
  }, [recentPartnerIds, partnerId]);

  const handleSelectPartner = (id: string) => {
    router.push(`/bim/partner-portal/${id}`);
  };

  // 모의 연락처 데이터
  const mockContacts: Contact[] = contacts.length > 0 ? contacts : [
    {
      id: '1',
      name: '박소영',
      title: '구매담당자',
      email: 'park.soyoung@company.com',
      phone: '010-1234-5678',
      isPrimary: true,
    },
    {
      id: '2',
      name: '이지훈',
      title: '부장',
      email: 'lee.jihun@company.com',
      phone: '010-2345-6789',
    },
    {
      id: '3',
      name: '김미옥',
      title: '팀장',
      email: 'kim.mieok@company.com',
      phone: '010-3456-7890',
    },
  ];

  // 모의 협업 피드 데이터
  const mockFeeds: ChatterFeed[] = feeds.length > 0 ? feeds : [
    {
      id: '1',
      author: '김영업',
      message: '오늘 거래처 방문하여 신제품 설명했습니다. 긍정적 반응입니다. 다음 주에 샘플 제공 예정입니다.',
      timestamp: '2024-10-28 14:30',
      likes: 3,
      attachments: ['meeting_notes.pdf'],
    },
    {
      id: '2',
      author: '박지원',
      message: '@김영업 제품 샘플이 도착했는지 확인 부탁드립니다.',
      timestamp: '2024-10-26 09:15',
      likes: 1,
    },
    {
      id: '3',
      author: '이주임',
      message: '이번 분기 거래처 매출 목표를 120% 달성했습니다! 훌륭한 성과입니다.',
      timestamp: '2024-10-25 16:45',
      likes: 5,
    },
  ];

  // 모의 참조 파일
  const mockFiles: RelatedFile[] = files.length > 0 ? files : [
    {
      id: '1',
      name: '2024년 공급계약서.pdf',
      type: 'contract',
      uploadedDate: '2024-01-15',
      uploadedBy: '이주임',
      size: '2.4 MB',
    },
    {
      id: '2',
      name: 'MSA_ABC고객사.docx',
      type: 'agreement',
      uploadedDate: '2024-01-10',
      uploadedBy: '이주임',
      size: '1.2 MB',
    },
    {
      id: '3',
      name: '2025년 기획안.pptx',
      type: 'proposal',
      uploadedDate: '2024-10-20',
      uploadedBy: '김영업',
      size: '5.6 MB',
    },
    {
      id: '4',
      name: 'NDA_확인서.pdf',
      type: 'agreement',
      uploadedDate: '2023-12-01',
      uploadedBy: '이주임',
      size: '0.8 MB',
    },
  ];

  const getFileTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      contract: '📜',
      agreement: '📋',
      proposal: '💼',
      report: '📊',
      other: '📄',
    };
    return icons[type] || icons.other;
  };

  const getFileTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      contract: '계약서',
      agreement: '협약',
      proposal: '제안서',
      report: '보고서',
      other: '기타',
    };
    return labels[type] || labels.other;
  };

  return (
    <div className="space-y-6">
      {/* 최근 거래처 */}
      {recentList.length > 0 && (
        <Card className={cn(
          "relative overflow-hidden",
          "border border-border",
          "bg-gradient-to-br from-neutral-100 dark:from-neutral-700/50 to-neutral-200 dark:to-neutral-800/50",
          "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10",
          "transition-all duration-300 group cursor-pointer"
        )}>
          {/* 배경 그라디언트 */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
            "from-primary/5 via-primary/2 to-transparent"
          )} />

          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-foreground" />
              <h3 className="text-lg font-semibold text-foreground">최근 거래처</h3>
            </div>

            <div className="space-y-2">
              {recentList.map((partner) => (
                <button
                  key={partner.id}
                  onClick={() => handleSelectPartner(partner.id)}
                  className={cn(
                    "w-full text-left p-3 border border-border rounded-lg transition-colors",
                    "bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700",
                    partner.id === partnerId && "bg-primary/10 border-primary/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "font-medium truncate",
                      partner.id === partnerId ? "text-primary" : "text-foreground"
                    )}>
                      {partner.name}
                    </p>
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{partner.code}</span>
                  </div>
                  {partner.tier && (
                    <p className="text-xs text-muted-foreground mt-1">{partner.tier}</p>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 연락처 */}
      <Card className={cn(
        "relative overflow-hidden",
        "border border-border",
        "bg-gradient-to-br from-neutral-100 dark:from-neutral-700/50 to-neutral-200 dark:to-neutral-800/50",
        "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10",
        "transition-all duration-300 group cursor-pointer"
      )}>
        {/* 배경 그라디언트 */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
          "from-primary/5 via-primary/2 to-transparent"
        )} />

        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-foreground" />
              <h3 className="text-lg font-semibold text-foreground">연락처</h3>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onAddContact}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {mockContacts.map((contact) => (
              <div
                key={contact.id}
                className={cn(
                  "p-4 border border-border rounded-lg transition-colors",
                  "bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                )}
              >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{contact.name}</p>
                    {contact.isPrimary && (
                      <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                        주담당
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{contact.title}</p>

                  {contact.email && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <a href={`mailto:${contact.email}`} className="hover:text-foreground">
                        {contact.email}
                      </a>
                    </div>
                  )}

                  {contact.phone && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <a href={`tel:${contact.phone}`} className="hover:text-foreground">
                        {contact.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        </CardContent>
      </Card>

      {/* 협업 피드 */}
      <Card className={cn(
        "relative overflow-hidden",
        "border border-border",
        "bg-gradient-to-br from-neutral-100 dark:from-neutral-700/50 to-neutral-200 dark:to-neutral-800/50",
        "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10",
        "transition-all duration-300 group cursor-pointer"
      )}>
        {/* 배경 그라디언트 */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
          "from-primary/5 via-primary/2 to-transparent"
        )} />

        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-foreground" />
              <h3 className="text-lg font-semibold text-foreground">협업 피드</h3>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onAddFeed}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4 max-h-80 overflow-y-auto">
            {mockFeeds.map((feed) => (
              <div key={feed.id} className="pb-4 border-b border-border last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{feed.author}</p>
                    <p className="text-xs text-muted-foreground">{feed.timestamp}</p>
                  </div>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{feed.message}</p>

                {feed.attachments && feed.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {feed.attachments.map((att, idx) => (
                      <div key={idx} className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                        📎 {att}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-2">
                  <button className="text-xs text-muted-foreground hover:text-foreground">
                    👍 {feed.likes}
                  </button>
                  <button className="text-xs text-muted-foreground hover:text-foreground">댓글</button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 참조 파일 */}
      <Card className={cn(
        "relative overflow-hidden",
        "border border-border",
        "bg-gradient-to-br from-neutral-100 dark:from-neutral-700/50 to-neutral-200 dark:to-neutral-800/50",
        "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10",
        "transition-all duration-300 group cursor-pointer"
      )}>
        {/* 배경 그라디언트 */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
          "from-primary/5 via-primary/2 to-transparent"
        )} />

        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-foreground" />
              <h3 className="text-lg font-semibold text-foreground">참조 파일</h3>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onAddFile}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {mockFiles.map((file) => (
              <div
                key={file.id}
                className={cn(
                  "p-3 border border-border rounded-lg transition-colors",
                  "bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getFileTypeIcon(file.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate hover:text-blue-600 cursor-pointer">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getFileTypeLabel(file.type)} • {file.size}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {file.uploadedDate} by {file.uploadedBy}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
