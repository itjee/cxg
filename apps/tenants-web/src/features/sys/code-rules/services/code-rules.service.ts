/**
 * Code Rule Service
 * API를 통한 코드 규칙 데이터 관리
 */

import { api } from "@/lib/api";
import type {
  CodeRule,
  CreateCodeRuleRequest,
  UpdateCodeRuleRequest,
  CodeRuleListResponse,
  CodeRuleDetailResponse,
  CodeRuleQueryParams,
} from "../types";

/**
 * 테스트용 Mock 데이터
 */
export const mockCodeRules: CodeRule[] = [
  {
    id: 'code-rule-001',
    entity_code: 'PARTNER',
    entity_name: '거래처',
    entity_name_en: 'Partner',
    prefix: 'PTN',
    current_number: 125,
    digit_length: 4,
    separator: '-',
    use_date: false,
    date_format: 'YYYYMMDD',
    reset_cycle: 'NONE',
    description: '거래처 코드 자동 생성 규칙',
    example_code: 'PTN-0125',
    is_active: true,
    is_deleted: false,
    created_at: '2025-01-01T00:00:00Z',
    created_by: undefined,
    updated_at: '2025-10-28T10:30:00Z',
    updated_by: undefined,
  },
  {
    id: 'code-rule-002',
    entity_code: 'PRODUCT',
    entity_name: '제품',
    entity_name_en: 'Product',
    prefix: 'PRD',
    current_number: 532,
    digit_length: 5,
    separator: '-',
    use_date: true,
    date_format: 'YYYYMMDD',
    reset_cycle: 'DAILY',
    description: '제품 코드 자동 생성 규칙 (일별 리셋)',
    example_code: 'PRD-20250104-00532',
    is_active: true,
    is_deleted: false,
    created_at: '2025-01-01T00:00:00Z',
    created_by: undefined,
    updated_at: '2025-10-28T10:30:00Z',
    updated_by: undefined,
  },
  {
    id: 'code-rule-003',
    entity_code: 'ORDER',
    entity_name: '주문',
    entity_name_en: 'Order',
    prefix: 'ORD',
    current_number: 1043,
    digit_length: 4,
    separator: '',
    use_date: true,
    date_format: 'YYYYMM',
    reset_cycle: 'MONTHLY',
    description: '주문 코드 자동 생성 규칙 (월별 리셋)',
    example_code: 'ORD2501041043',
    is_active: true,
    is_deleted: false,
    created_at: '2025-01-15T00:00:00Z',
    created_by: undefined,
    updated_at: '2025-10-28T10:30:00Z',
    updated_by: undefined,
  },
];

/**
 * 코드 규칙 목록 조회
 */
export async function getCodeRules(params?: CodeRuleQueryParams): Promise<CodeRuleListResponse> {
  const response = await api.get<CodeRuleListResponse>('/api/v1/tenants/sys/code-rules', { params });
  return response.data;
}

/**
 * 코드 규칙 상세 조회
 */
export async function getCodeRule(id: string): Promise<CodeRuleDetailResponse> {
  const response = await api.get<CodeRuleDetailResponse>(`/api/v1/tenants/sys/code-rules/${id}`);
  return response.data;
}

/**
 * 코드 규칙 생성
 */
export async function createCodeRule(data: CreateCodeRuleRequest): Promise<CodeRuleDetailResponse> {
  const response = await api.post<CodeRuleDetailResponse>('/api/v1/tenants/sys/code-rules', data);
  return response.data;
}

/**
 * 코드 규칙 수정
 */
export async function updateCodeRule(id: string, data: UpdateCodeRuleRequest): Promise<CodeRuleDetailResponse> {
  const response = await api.put<CodeRuleDetailResponse>(`/api/v1/tenants/sys/code-rules/${id}`, data);
  return response.data;
}

/**
 * 코드 규칙 삭제
 */
export async function deleteCodeRule(id: string): Promise<void> {
  await api.delete(`/api/v1/tenants/sys/code-rules/${id}`);
}
