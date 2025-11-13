'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Contact {
  id: string;
  name: string;
  title: string;
  department?: string;
  email?: string;
  phone?: string;
}

interface PartnerPortalTabContactsProps {
  partnerId: string;
  contacts?: Contact[];
}

export function PartnerPortalTabContacts({
  partnerId,
  contacts = [
    {
      id: '1',
      name: '박소영',
      title: '구매담당자',
      department: '구매팀',
      email: 'park.soyoung@company.com',
      phone: '010-1234-5678',
    },
    {
      id: '2',
      name: '이지훈',
      title: '부장',
      department: '경영팀',
      email: 'lee.jihun@company.com',
      phone: '010-2345-6789',
    },
    {
      id: '3',
      name: '김미옥',
      title: '팀장',
      department: '구매팀',
      email: 'kim.mieok@company.com',
      phone: '010-3456-7890',
    },
  ],
}: PartnerPortalTabContactsProps) {
  const [contactsList, setContactsList] = useState(contacts);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState<Contact>({
    id: '',
    name: '',
    title: '',
    department: '',
    email: '',
    phone: '',
  });
  const [showAddContact, setShowAddContact] = useState(false);

  const handleAddContact = () => {
    if (newContact.name.trim()) {
      setContactsList([
        ...contactsList,
        { ...newContact, id: Date.now().toString() },
      ]);
      setNewContact({
        id: '',
        name: '',
        title: '',
        department: '',
        email: '',
        phone: '',
      });
      setShowAddContact(false);
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
  };

  const handleSaveContact = () => {
    if (editingContact) {
      setContactsList(
        contactsList.map((c) =>
          c.id === editingContact.id ? editingContact : c
        )
      );
      setEditingContact(null);
    }
  };

  const handleDeleteContact = (id: string) => {
    setContactsList(contactsList.filter((c) => c.id !== id));
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
            <h3 className="text-lg font-semibold text-foreground">거래처 담당자</h3>
            <Button size="sm" onClick={() => setShowAddContact(true)}>
              <Plus className="h-4 w-4 mr-2" />
              추가
            </Button>
          </div>

          {editingContact ? (
            <div className="space-y-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={editingContact.name}
                  onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })}
                  placeholder="성명"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <input
                  type="text"
                  value={editingContact.title}
                  onChange={(e) => setEditingContact({ ...editingContact, title: e.target.value })}
                  placeholder="직책"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <input
                  type="text"
                  value={editingContact.department || ''}
                  onChange={(e) => setEditingContact({ ...editingContact, department: e.target.value })}
                  placeholder="부서"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <input
                  type="email"
                  value={editingContact.email || ''}
                  onChange={(e) => setEditingContact({ ...editingContact, email: e.target.value })}
                  placeholder="이메일"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <input
                  type="tel"
                  value={editingContact.phone || ''}
                  onChange={(e) => setEditingContact({ ...editingContact, phone: e.target.value })}
                  placeholder="연락처"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none col-span-2"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveContact}>
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setEditingContact(null)}>
                  <X className="h-4 w-4 mr-2" />
                  취소
                </Button>
              </div>
            </div>
          ) : null}

          {showAddContact ? (
            <div className="space-y-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="성명"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <input
                  type="text"
                  value={newContact.title}
                  onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
                  placeholder="직책"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <input
                  type="text"
                  value={newContact.department}
                  onChange={(e) => setNewContact({ ...newContact, department: e.target.value })}
                  placeholder="부서"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  placeholder="이메일"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <input
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  placeholder="연락처"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none col-span-2"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddContact}>
                  <Plus className="h-4 w-4 mr-2" />
                  추가
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setShowAddContact(false)}>
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
                {contactsList.map((contact) => (
                  <tr key={contact.id} className="border-b border-border bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                    <td className="px-3 py-3 text-foreground">{contact.name}</td>
                    <td className="px-3 py-3 text-foreground">{contact.title}</td>
                    <td className="px-3 py-3 text-foreground">{contact.department || '-'}</td>
                    <td className="px-3 py-3 text-foreground">
                      {contact.email ? (
                        <a href={`mailto:${contact.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                          {contact.email}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-3 py-3 text-foreground">
                      {contact.phone ? (
                        <a href={`tel:${contact.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                          {contact.phone}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEditContact(contact)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteContact(contact.id)}>
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
    </div>
  );
}
