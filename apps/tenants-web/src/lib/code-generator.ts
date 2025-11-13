/**
 * 엔티티별 코드 자동 생성 유틸리티
 */

interface CodePrefixConfig {
  prefix: string;
  digitLength: number;
  currentNumber: number;
}

// 임시 저장소 (실제로는 API에서 가져와야 함)
const codePrefixStore: Map<string, CodePrefixConfig> = new Map([
  ['PARTNER', { prefix: 'MBP', digitLength: 4, currentNumber: 0 }],
  ['PRODUCT', { prefix: 'MPD', digitLength: 5, currentNumber: 0 }],
  ['WAREHOUSE', { prefix: 'MWH', digitLength: 2, currentNumber: 0 }],
  ['COMPANY', { prefix: 'MCO', digitLength: 3, currentNumber: 0 }],
  ['DEPARTMENT', { prefix: 'MDP', digitLength: 3, currentNumber: 0 }],
  ['EMPLOYEE', { prefix: 'MEM', digitLength: 4, currentNumber: 0 }],
]);

/**
 * 다음 코드 생성
 * @param entityCode 엔티티 코드 (예: 'PARTNER', 'PRODUCT')
 * @returns 생성된 코드 (예: 'MBP0001', 'MPD00025')
 */
export function generateNextCode(entityCode: string): string {
  const config = codePrefixStore.get(entityCode);
  
  if (!config) {
    throw new Error(`코드 Prefix 설정을 찾을 수 없습니다: ${entityCode}`);
  }

  // 현재 번호 증가
  config.currentNumber += 1;
  
  // 코드 생성 (Prefix + 0으로 패딩된 번호)
  const code = config.prefix + String(config.currentNumber).padStart(config.digitLength, '0');
  
  return code;
}

/**
 * 현재 번호 조회
 * @param entityCode 엔티티 코드
 * @returns 현재 번호
 */
export function getCurrentNumber(entityCode: string): number {
  const config = codePrefixStore.get(entityCode);
  return config?.currentNumber || 0;
}

/**
 * 다음 코드 미리보기 (번호 증가 없이)
 * @param entityCode 엔티티 코드
 * @returns 다음에 생성될 코드
 */
export function previewNextCode(entityCode: string): string {
  const config = codePrefixStore.get(entityCode);
  
  if (!config) {
    return '???';
  }

  const nextNumber = config.currentNumber + 1;
  return config.prefix + String(nextNumber).padStart(config.digitLength, '0');
}

/**
 * 코드 Prefix 설정 (관리자 페이지에서 사용)
 * @param entityCode 엔티티 코드
 * @param prefix Prefix (2자리 영문)
 * @param digitLength 숫자 자릿수
 * @param currentNumber 현재 번호
 */
export function setCodePrefix(
  entityCode: string,
  prefix: string,
  digitLength: number,
  currentNumber: number = 0
): void {
  if (!/^[A-Z]{2}$/.test(prefix)) {
    throw new Error('Prefix는 2자리 영문 대문자여야 합니다.');
  }

  if (digitLength < 2 || digitLength > 10) {
    throw new Error('숫자 자릿수는 2~10 사이여야 합니다.');
  }

  codePrefixStore.set(entityCode, { prefix, digitLength, currentNumber });
}

/**
 * 모든 코드 Prefix 설정 조회
 * @returns 모든 설정 목록
 */
export function getAllCodePrefixes(): Array<{ entityCode: string; config: CodePrefixConfig }> {
  return Array.from(codePrefixStore.entries()).map(([entityCode, config]) => ({
    entityCode,
    config: { ...config }
  }));
}
