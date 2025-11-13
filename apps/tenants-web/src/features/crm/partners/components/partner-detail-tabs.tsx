'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';
import { partnerService } from '../services/partners.service';
import type {
  Partner,
  PartnerContact,
  PartnerAddress,
  PartnerManager,
  CreatePartnerContactRequest,
  CreatePartnerAddressRequest,
  CreatePartnerManagerRequest,
} from '../';

interface PartnerDetailTabsProps {
  partner: Partner;
  onUpdate?: () => void;
}

export function PartnerDetailTabs({ partner, onUpdate }: PartnerDetailTabsProps) {
  const [contacts, setContacts] = useState<PartnerContact[]>([]);
  const [addresses, setAddresses] = useState<PartnerAddress[]>([]);
  const [managers, setManagers] = useState<PartnerManager[]>([]);

  const [contactsLoading, setContactsLoading] = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [managersLoading, setManagersLoading] = useState(false);

  const [showContactForm, setShowContactForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showManagerForm, setShowManagerForm] = useState(false);

  // 담당자 폼
  const [contactForm, setContactForm] = useState<CreatePartnerContactRequest>({
    contact_name: '',
    position: '',
    department: '',
    phone: '',
    mobile: '',
    email: '',
    contact_type: 'SALES',
    is_primary: false,
    notes: '',
    status: 'ACTIVE',
  });

  // 주소 폼
  const [addressForm, setAddressForm] = useState<CreatePartnerAddressRequest>({
    address_type: 'HEADQUARTER',
    address_name: '',
    postcode: '',
    address1: '',
    address2: '',
    building: '',
    city: '',
    state_province: '',
    country_code: 'KOR',
    contact_name: '',
    phone: '',
    mobile: '',
    fax: '',
    email: '',
    is_default: false,
    is_billing: false,
    is_shipping: false,
  });

  // 당사 담당자 폼
  const [managerForm, setManagerForm] = useState<CreatePartnerManagerRequest>({
    employee_id: '',
    start_date: '',
    manager_type: 'PRIMARY',
    status: 'ACTIVE',
  });

  // 데이터 로드
  useEffect(() => {
    loadContacts();
    loadAddresses();
    loadManagers();
  }, [partner.id]);

  const loadContacts = async () => {
    setContactsLoading(true);
    try {
      const response = await partnerService.listContacts(partner.id);
      setContacts(response.items || response.data || []);
    } catch (error) {
      console.error('담당자 조회 실패:', error);
    } finally {
      setContactsLoading(false);
    }
  };

  const loadAddresses = async () => {
    setAddressesLoading(true);
    try {
      const response = await partnerService.listAddresses(partner.id);
      setAddresses(response.items || response.data || []);
    } catch (error) {
      console.error('주소 조회 실패:', error);
    } finally {
      setAddressesLoading(false);
    }
  };

  const loadManagers = async () => {
    setManagersLoading(true);
    try {
      const response = await partnerService.listManagers(partner.id);
      setManagers(response.items || response.data || []);
    } catch (error) {
      console.error('당사 담당자 조회 실패:', error);
    } finally {
      setManagersLoading(false);
    }
  };

  // 담당자 추가
  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await partnerService.createContact(partner.id, contactForm);
      setContactForm({
        contact_name: '',
        position: '',
        department: '',
        phone: '',
        mobile: '',
        email: '',
        contact_type: 'SALES',
        is_primary: false,
        notes: '',
        status: 'ACTIVE',
      });
      setShowContactForm(false);
      await loadContacts();
      onUpdate?.();
    } catch (error) {
      console.error('담당자 추가 실패:', error);
    }
  };

  // 주소 추가
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await partnerService.createAddress(partner.id, addressForm);
      setAddressForm({
        address_type: 'HEADQUARTER',
        address_name: '',
        postcode: '',
        address1: '',
        address2: '',
        building: '',
        city: '',
        state_province: '',
        country_code: 'KOR',
        contact_name: '',
        phone: '',
        mobile: '',
        fax: '',
        email: '',
        is_default: false,
        is_billing: false,
        is_shipping: false,
      });
      setShowAddressForm(false);
      await loadAddresses();
      onUpdate?.();
    } catch (error) {
      console.error('주소 추가 실패:', error);
    }
  };

  // 당사 담당자 추가
  const handleAddManager = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await partnerService.createManager(partner.id, managerForm);
      setManagerForm({
        employee_id: '',
        start_date: '',
        manager_type: 'PRIMARY',
        status: 'ACTIVE',
      });
      setShowManagerForm(false);
      await loadManagers();
      onUpdate?.();
    } catch (error) {
      console.error('당사 담당자 추가 실패:', error);
    }
  };

  // 담당자 삭제
  const handleDeleteContact = async (contactId: string) => {
    if (confirm('담당자를 삭제하시겠습니까?')) {
      try {
        await partnerService.deleteContact(partner.id, contactId);
        await loadContacts();
        onUpdate?.();
      } catch (error) {
        console.error('담당자 삭제 실패:', error);
      }
    }
  };

  // 주소 삭제
  const handleDeleteAddress = async (addressId: string) => {
    if (confirm('주소를 삭제하시겠습니까?')) {
      try {
        await partnerService.deleteAddress(partner.id, addressId);
        await loadAddresses();
        onUpdate?.();
      } catch (error) {
        console.error('주소 삭제 실패:', error);
      }
    }
  };

  // 당사 담당자 삭제
  const handleDeleteManager = async (managerId: string) => {
    if (confirm('담당자를 삭제하시겠습니까?')) {
      try {
        await partnerService.deleteManager(partner.id, managerId);
        await loadManagers();
        onUpdate?.();
      } catch (error) {
        console.error('담당자 삭제 실패:', error);
      }
    }
  };

  return (
    <Tabs defaultValue="contacts" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="contacts">거래처 담당자</TabsTrigger>
        <TabsTrigger value="addresses">거래처 주소</TabsTrigger>
        <TabsTrigger value="managers">당사 담당자</TabsTrigger>
      </TabsList>

      {/* 거래처 담당자 탭 */}
      <TabsContent value="contacts" className="space-y-4">
        {contactsLoading ? (
          <div className="text-center py-8 text-gray-500">로딩 중...</div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            담당자가 등록되지 않았습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map(contact => (
              <Card key={contact.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">담당자명</p>
                      <p className="font-medium">{contact.contact_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">직책</p>
                      <p className="font-medium">{contact.position || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">부서</p>
                      <p className="font-medium">{contact.department || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">업무 유형</p>
                      <p className="font-medium">{contact.contact_type || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">전화</p>
                      <p className="font-medium">{contact.phone || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">휴대폰</p>
                      <p className="font-medium">{contact.mobile || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">이메일</p>
                      <p className="font-medium text-sm">{contact.email || '-'}</p>
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteContact(contact.id)}
                        className="gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        삭제
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          {!showContactForm ? (
            <Button
              onClick={() => setShowContactForm(true)}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              담당자 추가
            </Button>
          ) : null}
        </div>

        {showContactForm && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">담당자 추가</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddContact} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_name">담당자명 *</Label>
                    <Input
                      id="contact_name"
                      required
                      value={contactForm.contact_name}
                      onChange={e =>
                        setContactForm({ ...contactForm, contact_name: e.target.value })
                      }
                      placeholder="담당자명"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">직책</Label>
                    <Input
                      id="position"
                      value={contactForm.position || ''}
                      onChange={e =>
                        setContactForm({ ...contactForm, position: e.target.value })
                      }
                      placeholder="직책"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">부서</Label>
                    <Input
                      id="department"
                      value={contactForm.department || ''}
                      onChange={e =>
                        setContactForm({ ...contactForm, department: e.target.value })
                      }
                      placeholder="부서"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_type">업무 유형</Label>
                    <select
                      id="contact_type"
                      value={contactForm.contact_type || 'SALES'}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          contact_type: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="SALES">영업</option>
                      <option value="PURCHASING">구매</option>
                      <option value="ACCOUNTING">회계</option>
                      <option value="TECHNICAL">기술</option>
                      <option value="MANAGEMENT">경영진</option>
                      <option value="OTHER">기타</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">전화</Label>
                    <Input
                      id="phone"
                      value={contactForm.phone || ''}
                      onChange={e =>
                        setContactForm({ ...contactForm, phone: e.target.value })
                      }
                      placeholder="전화번호"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">휴대폰</Label>
                    <Input
                      id="mobile"
                      value={contactForm.mobile || ''}
                      onChange={e =>
                        setContactForm({ ...contactForm, mobile: e.target.value })
                      }
                      placeholder="휴대폰번호"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email || ''}
                    onChange={e =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    placeholder="이메일주소"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowContactForm(false)}
                  >
                    취소
                  </Button>
                  <Button type="submit">추가</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* 거래처 주소 탭 */}
      <TabsContent value="addresses" className="space-y-4">
        {addressesLoading ? (
          <div className="text-center py-8 text-gray-500">로딩 중...</div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            주소가 등록되지 않았습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map(address => (
              <Card key={address.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">주소 유형</p>
                      <p className="font-medium">{address.address_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">별칭</p>
                      <p className="font-medium">{address.address_name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">기본 주소</p>
                      <p className="font-medium text-sm">
                        {address.address1 || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">상세 주소</p>
                      <p className="font-medium text-sm">
                        {address.address2 || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">도시</p>
                      <p className="font-medium">{address.city || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">연락처 담당자</p>
                      <p className="font-medium">{address.contact_name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">전화</p>
                      <p className="font-medium">{address.phone || '-'}</p>
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        삭제
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          {!showAddressForm ? (
            <Button
              onClick={() => setShowAddressForm(true)}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              주소 추가
            </Button>
          ) : null}
        </div>

        {showAddressForm && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">주소 추가</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAddress} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address_type">주소 유형 *</Label>
                    <select
                      id="address_type"
                      value={addressForm.address_type}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          address_type: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="HEADQUARTER">본사</option>
                      <option value="BRANCH">지사</option>
                      <option value="WAREHOUSE">창고</option>
                      <option value="FACTORY">공장</option>
                      <option value="BILLING">청구지</option>
                      <option value="SHIPPING">배송지</option>
                      <option value="OTHER">기타</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address_name">별칭</Label>
                    <Input
                      id="address_name"
                      value={addressForm.address_name || ''}
                      onChange={e =>
                        setAddressForm({ ...addressForm, address_name: e.target.value })
                      }
                      placeholder="주소 별칭"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address1">기본 주소 *</Label>
                  <Input
                    id="address1"
                    required
                    value={addressForm.address1 || ''}
                    onChange={e =>
                      setAddressForm({ ...addressForm, address1: e.target.value })
                    }
                    placeholder="기본 주소"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address2">상세 주소</Label>
                  <Input
                    id="address2"
                    value={addressForm.address2 || ''}
                    onChange={e =>
                      setAddressForm({ ...addressForm, address2: e.target.value })
                    }
                    placeholder="상세 주소"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">도시</Label>
                    <Input
                      id="city"
                      value={addressForm.city || ''}
                      onChange={e =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                      placeholder="도시"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state_province">주/도</Label>
                    <Input
                      id="state_province"
                      value={addressForm.state_province || ''}
                      onChange={e =>
                        setAddressForm({
                          ...addressForm,
                          state_province: e.target.value,
                        })
                      }
                      placeholder="주/도"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddressForm(false)}
                  >
                    취소
                  </Button>
                  <Button type="submit">추가</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* 당사 담당자 탭 */}
      <TabsContent value="managers" className="space-y-4">
        {managersLoading ? (
          <div className="text-center py-8 text-gray-500">로딩 중...</div>
        ) : managers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            당사 담당자가 배정되지 않았습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {managers.map(manager => (
              <Card key={manager.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">담당자</p>
                      <p className="font-medium">{manager.employee_name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">담당자 유형</p>
                      <p className="font-medium">{manager.manager_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">담당 시작일</p>
                      <p className="font-medium">
                        {new Date(manager.start_date).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">담당 종료일</p>
                      <p className="font-medium">
                        {manager.end_date
                          ? new Date(manager.end_date).toLocaleDateString('ko-KR')
                          : '진행 중'}
                      </p>
                    </div>
                    <div className="md:col-span-3">
                      <p className="text-sm text-gray-600">설명</p>
                      <p className="font-medium text-sm">{manager.description || '-'}</p>
                    </div>
                    <div className="flex items-end justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteManager(manager.id)}
                        className="gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        삭제
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          {!showManagerForm ? (
            <Button
              onClick={() => setShowManagerForm(true)}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              담당자 배정
            </Button>
          ) : null}
        </div>

        {showManagerForm && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">담당자 배정</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddManager} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee_id">담당자 *</Label>
                    <Input
                      id="employee_id"
                      required
                      value={managerForm.employee_id}
                      onChange={e =>
                        setManagerForm({ ...managerForm, employee_id: e.target.value })
                      }
                      placeholder="담당 사원 ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager_type">담당자 유형</Label>
                    <select
                      name="manager_type"
                      value={managerForm.manager_type}
                      onChange={e =>
                        setManagerForm({
                          ...managerForm,
                          manager_type: e.target.value as any,
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-background [&>option]:text-foreground"
                    >
                      <option value="PRIMARY">주담당</option>
                      <option value="SECONDARY">부담당</option>
                      <option value="BACKUP">백업</option>
                      <option value="TECHNICAL">기술</option>
                      <option value="SALES">영업</option>
                      <option value="SUPPORT">지원</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">담당 시작일 *</Label>
                    <Input
                      id="start_date"
                      type="date"
                      required
                      value={managerForm.start_date}
                      onChange={e =>
                        setManagerForm({ ...managerForm, start_date: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">담당 종료일</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={managerForm.end_date || ''}
                      onChange={e =>
                        setManagerForm({ ...managerForm, end_date: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowManagerForm(false)}
                  >
                    취소
                  </Button>
                  <Button type="submit">배정</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}
