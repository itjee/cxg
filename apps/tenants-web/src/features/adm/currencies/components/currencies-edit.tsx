'use client';

/**
 * CurrenciesEdit
 * 통화 생성/수정 Drawer
 */

import { EntityDrawer } from '@/components/features';
import { CurrenciesForm } from './currencies-form';
import { useCurrencyStore } from '../stores';
import { useCurrency, useCreateCurrency, useUpdateCurrency } from '../hooks';
import type { CreateCurrencyRequest, UpdateCurrencyRequest } from '../types';
import type { Currency } from '../types';

interface CurrenciesEditProps {
  /**
   * 전체 통화 목록 (참고용)
   */
  currencies: Currency[];
}

export function CurrenciesEdit({ currencies }: CurrenciesEditProps) {
  const { formOpen, editingId, closeForm } = useCurrencyStore();
  
  // 수정 시 통화 데이터 조회
  const { data: currencyDetail } = useCurrency(editingId);
  const editingCurrency = currencyDetail?.data;

  // Mutations
  const createMutation = useCreateCurrency();
  const updateMutation = useUpdateCurrency(editingId || '');
  
  const isLoading = createMutation.isPending || updateMutation.isPending;

  // 폼 제출 핸들러
  const handleSubmit = (formData: CreateCurrencyRequest | UpdateCurrencyRequest) => {
    if (editingId) {
      updateMutation.mutate(formData as UpdateCurrencyRequest, {
        onSuccess: () => {
          closeForm();
        },
      });
    } else {
      createMutation.mutate(formData as CreateCurrencyRequest, {
        onSuccess: () => {
          closeForm();
        },
      });
    }
  };

  return (
    <EntityDrawer
      open={formOpen}
      onOpenChange={closeForm}
      title={editingId ? '통화 수정' : '통화 등록'}
      description={
        editingId
          ? '통화 정보를 수정하세요.'
          : '새로운 통화 정보를 입력하세요.'
      }
      width="md"
    >
      <CurrenciesForm
        initialData={editingCurrency}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isLoading={isLoading}
      />
    </EntityDrawer>
  );
}
