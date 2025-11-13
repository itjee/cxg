'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccountOwner {
  id: string;
  name: string;
  title: string;
  department?: string;
  email?: string;
  phone?: string;
}

interface AccountChangeHistory {
  date: string;
  previousOwner: string;
  newOwner: string;
  reason: string;
  changedBy: string;
}

interface PartnerPortalTabAccountOwnersProps {
  partnerId: string;
  accountOwners?: AccountOwner[];
  accountChanges?: AccountChangeHistory[];
}

export function PartnerPortalTabAccountOwners({
  partnerId,
  accountOwners = [
    {
      id: '1',
      name: '김영업',
      title: '과장',
      department: '영업3팀',
      email: 'kim.sales@ourcompany.com',
      phone: '02-1234-5678',
    },
    {
      id: '2',
      name: '이지원',
      title: '대리',
      department: '영업3팀',
      email: 'lee.support@ourcompany.com',
      phone: '02-2345-6789',
    },
  ],
  accountChanges = [],
}: PartnerPortalTabAccountOwnersProps) {
  const [accountOwnersList, setAccountOwnersList] = useState(accountOwners);
  const [editingAccountOwner, setEditingAccountOwner] = useState<AccountOwner | null>(null);
  const [newAccountOwner, setNewAccountOwner] = useState<AccountOwner>({
    id: '',
    name: '',
    title: '',
    department: '',
    email: '',
    phone: '',
  });
  const [showAddAccountOwner, setShowAddAccountOwner] = useState(false);

  // 모의 담당자 변경 이력
  const mockAccountChanges: AccountChangeHistory[] = accountChanges.length > 0 ? accountChanges : [
    {
      date: '2024-08-15',
      previousOwner: '박영업',
      newOwner: '김영업',
      reason: '조직개편',
      changedBy: '이주임',
    },
    {
      date: '2024-06-01',
      previousOwner: '이영업',
      newOwner: '박영업',
      reason: '담당자 이직',
      changedBy: '이주임',
    },
    {
      date: '2024-01-20',
      previousOwner: '김영업',
      newOwner: '이영업',
      reason: '퇴직',
      changedBy: '이주임',
    },
  ];

  const handleAddAccountOwner = () => {
    if (newAccountOwner.name.trim()) {
      setAccountOwnersList([
        ...accountOwnersList,
        { ...newAccountOwner, id: Date.now().toString() },
      ]);
      setNewAccountOwner({
        id: '',
        name: '',
        title: '',
        department: '',
        email: '',
        phone: '',
      });
      setShowAddAccountOwner(false);
    }
  };

  const handleEditAccountOwner = (accountOwner: AccountOwner) => {
    setEditingAccountOwner(accountOwner);
  };

  const handleSaveAccountOwner = () => {
    if (editingAccountOwner) {
      setAccountOwnersList(
        accountOwnersList.map((a) =>
          a.id === editingAccountOwner.id ? editingAccountOwner : a
        )
      );
      setEditingAccountOwner(null);
    }
  };

  const handleDeleteAccountOwner = (id: string) => {
    setAccountOwnersList(accountOwnersList.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card className={cn(
        "relative overflow-hidden",
        "border border-border",
        "bg-gradient-to-br from-neutral-100 dark:from-neutral-700/50 to-neutral-200 dark:to-neutral-800/50",
        "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10",
        "transition-all duration-300 group cursor-pointer"
      )}>
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
          "from-primary/5 via-primary/2 to-transparent"
        )} />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">당사 영업 담당자</h3>
            <Button size="sm" onClick={() => setShowAddAccountOwner(true)}>
              <Plus className="h-4 w-4 mr-2" />
              추가
            </Button>
          </div>

          {editingAccountOwner ? (
            <div className="space-y-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={editingAccountOwner.name}
                  onChange={(e) => setEditingAccountOwner({ ...editingAccountOwner, name: e.target.value })}
                  placeholder="성명"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <input
                  type="text"
                  value={editingAccountOwner.title}
                  onChange={(e) => setEditingAccountOwner({ ...editingAccountOwner, title: e.target.value })}
                  placeholder="직책"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <input
                  type="text"
                  value={editingAccountOwner.department || ''}
                  onChange={(e) => setEditingAccountOwner({ ...editingAccountOwner, department: e.target.value })}
                  placeholder="부서"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <input
                  type="email"
                  value={editingAccountOwner.email || ''}
                  onChange={(e) => setEditingAccountOwner({ ...editingAccountOwner, email: e.target.value })}
                  placeholder="이메일"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <input
                  type="tel"
                  value={editingAccountOwner.phone || ''}
                  onChange={(e) => setEditingAccountOwner({ ...editingAccountOwner, phone: e.target.value })}
                  placeholder="연락처"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none col-span-2"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveAccountOwner}>
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditingAccountOwner(null)}>
                  <X className="h-4 w-4 mr-2" />
                  취소
                </Button>
              </div>
            </div>
          ) : null}

          {showAddAccountOwner ? (
            <div className="space-y-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newAccountOwner.name}
                  onChange={(e) => setNewAccountOwner({ ...newAccountOwner, name: e.target.value })}
                  placeholder="성명"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <input
                  type="text"
                  value={newAccountOwner.title}
                  onChange={(e) => setNewAccountOwner({ ...newAccountOwner, title: e.target.value })}
                  placeholder="직책"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <input
                  type="text"
                  value={newAccountOwner.department}
                  onChange={(e) => setNewAccountOwner({ ...newAccountOwner, department: e.target.value })}
                  placeholder="부서"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <input
                  type="email"
                  value={newAccountOwner.email}
                  onChange={(e) => setNewAccountOwner({ ...newAccountOwner, email: e.target.value })}
                  placeholder="이메일"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <input
                  type="tel"
                  value={newAccountOwner.phone}
                  onChange={(e) => setNewAccountOwner({ ...newAccountOwner, phone: e.target.value })}
                  placeholder="연락처"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none col-span-2"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddAccountOwner}>
                  <Plus className="h-4 w-4 mr-2" />
                  추가
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddAccountOwner(false)}>
                  <X className="h-4 w-4 mr-2" />
                  취소
                </Button>
              </div>
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-3 py-2 font-medium text-foreground">성명</th>
                  <th className="text-left px-3 py-2 font-medium text-foreground">직책</th>
                  <th className="text-left px-3 py-2 font-medium text-foreground">부서</th>
                  <th className="text-left px-3 py-2 font-medium text-foreground">이메일</th>
                  <th className="text-left px-3 py-2 font-medium text-foreground">연락처</th>
                  <th className="text-center px-3 py-2 font-medium text-foreground">작업</th>
                </tr>
              </thead>
              <tbody>
                {accountOwnersList.map((accountOwner) => (
                  <tr key={accountOwner.id} className="border-b border-border bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                    <td className="px-3 py-3 text-foreground">{accountOwner.name}</td>
                    <td className="px-3 py-3 text-foreground">{accountOwner.title}</td>
                    <td className="px-3 py-3 text-foreground">{accountOwner.department || '-'}</td>
                    <td className="px-3 py-3 text-foreground">
                      {accountOwner.email ? (
                        <a href={`mailto:${accountOwner.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                          {accountOwner.email}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-3 py-3 text-foreground">
                      {accountOwner.phone ? (
                        <a href={`tel:${accountOwner.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                          {accountOwner.phone}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEditAccountOwner(accountOwner)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteAccountOwner(accountOwner.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 담당자 변경 이력 */}
      <Card className={cn(
        "relative overflow-hidden",
        "border border-border",
        "bg-gradient-to-br from-neutral-100 dark:from-neutral-700/50 to-neutral-200 dark:to-neutral-800/50",
        "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10",
        "transition-all duration-300 group cursor-pointer"
      )}>
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
          "from-primary/5 via-primary/2 to-transparent"
        )} />
        <CardContent className="p-6 relative z-10">
          <h3 className="text-lg font-semibold text-foreground mb-6">담당자 변경 이력</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-neutral-100 dark:bg-neutral-700/50">
                <TableRow>
                  <TableHead>변경일시</TableHead>
                  <TableHead>변경 전</TableHead>
                  <TableHead>변경 후</TableHead>
                  <TableHead>사유</TableHead>
                  <TableHead>변경자</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAccountChanges.map((change, idx) => (
                  <TableRow key={idx} className="bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                    <TableCell className="text-foreground">{change.date}</TableCell>
                    <TableCell className="text-foreground">{change.previousOwner}</TableCell>
                    <TableCell className="text-foreground">{change.newOwner}</TableCell>
                    <TableCell className="text-foreground">{change.reason}</TableCell>
                    <TableCell className="text-foreground">{change.changedBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
