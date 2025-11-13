'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Address {
  id: string;
  type: 'main' | 'sub';
  address: string;
  tel?: string;
  fax?: string;
}

interface PartnerPortalTabAddressesProps {
  partnerId: string;
  addresses?: Address[];
}

export function PartnerPortalTabAddresses({
  partnerId,
  addresses = [
    {
      id: '1',
      type: 'main',
      address: '서울시 강남구 테헤란로 123',
      tel: '02-2345-6789',
      fax: '02-2345-6790',
    },
    {
      id: '2',
      type: 'sub',
      address: '부산시 해운대구 중앙로 456',
      tel: '051-1234-5678',
    },
  ],
}: PartnerPortalTabAddressesProps) {
  const [addressesList, setAddressesList] = useState(addresses);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState<Address>({
    id: '',
    type: 'sub',
    address: '',
    tel: '',
    fax: '',
  });
  const [showAddAddress, setShowAddAddress] = useState(false);

  const handleAddAddress = () => {
    if (newAddress.address.trim()) {
      setAddressesList([
        ...addressesList,
        { ...newAddress, id: Date.now().toString() },
      ]);
      setNewAddress({
        id: '',
        type: 'sub',
        address: '',
        tel: '',
        fax: '',
      });
      setShowAddAddress(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
  };

  const handleSaveAddress = () => {
    if (editingAddress) {
      setAddressesList(
        addressesList.map((a) =>
          a.id === editingAddress.id ? editingAddress : a
        )
      );
      setEditingAddress(null);
    }
  };

  const handleDeleteAddress = (id: string) => {
    setAddressesList(addressesList.filter((a) => a.id !== id));
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
            <h3 className="text-lg font-semibold text-foreground">주소</h3>
            <Button size="sm" onClick={() => setShowAddAddress(true)}>
              <Plus className="h-4 w-4 mr-2" />
              추가
            </Button>
          </div>

          {editingAddress ? (
            <div className="space-y-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={editingAddress.type}
                  onChange={(e) => setEditingAddress({ ...editingAddress, type: e.target.value as 'main' | 'sub' })}
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                >
                  <option value="main">본사</option>
                  <option value="sub">지사</option>
                </select>
                <input
                  type="text"
                  value={editingAddress.address}
                  onChange={(e) => setEditingAddress({ ...editingAddress, address: e.target.value })}
                  placeholder="주소"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <input
                  type="tel"
                  value={editingAddress.tel || ''}
                  onChange={(e) => setEditingAddress({ ...editingAddress, tel: e.target.value })}
                  placeholder="전화"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <input
                  type="tel"
                  value={editingAddress.fax || ''}
                  onChange={(e) => setEditingAddress({ ...editingAddress, fax: e.target.value })}
                  placeholder="팩스"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveAddress}>
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setEditingAddress(null)}>
                  <X className="h-4 w-4 mr-2" />
                  취소
                </Button>
              </div>
            </div>
          ) : null}

          {showAddAddress ? (
            <div className="space-y-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={newAddress.type}
                  onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value as 'main' | 'sub' })}
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                >
                  <option value="main">본사</option>
                  <option value="sub">지사</option>
                </select>
                <input
                  type="text"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  placeholder="주소"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <input
                  type="tel"
                  value={newAddress.tel}
                  onChange={(e) => setNewAddress({ ...newAddress, tel: e.target.value })}
                  placeholder="전화"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <input
                  type="tel"
                  value={newAddress.fax}
                  onChange={(e) => setNewAddress({ ...newAddress, fax: e.target.value })}
                  placeholder="팩스"
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddAddress}>
                  <Plus className="h-4 w-4 mr-2" />
                  추가
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setShowAddAddress(false)}>
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
                  <th className="text-left px-3 py-2 font-medium text-foreground">유형</th>
                  <th className="text-left px-3 py-2 font-medium text-foreground">주소</th>
                  <th className="text-left px-3 py-2 font-medium text-foreground">전화</th>
                  <th className="text-left px-3 py-2 font-medium text-foreground">팩스</th>
                  <th className="text-center px-3 py-2 font-medium text-foreground">작업</th>
                </tr>
              </thead>
              <tbody>
                {addressesList.map((address) => (
                  <tr key={address.id} className="border-b border-border bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                    <td className="px-3 py-3 text-foreground">{address.type === 'main' ? '본사' : '지사'}</td>
                    <td className="px-3 py-3 text-foreground">{address.address}</td>
                    <td className="px-3 py-3 text-foreground">
                      {address.tel ? (
                        <a href={`tel:${address.tel}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                          {address.tel}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-3 py-3 text-foreground">
                      {address.fax ? (
                        <a href={`tel:${address.fax}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                          {address.fax}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEditAddress(address)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteAddress(address.id)}>
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
