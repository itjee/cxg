/**
 * EntityFormButtons
 * 폼 하단 버튼 (취소, 저장)
 */

import { Button } from '@/components/ui/button';

interface EntityFormButtonsProps {
  /**
   * 취소 버튼 클릭 핸들러
   */
  onCancel: () => void;
  
  /**
   * 로딩 상태
   */
  isLoading?: boolean;
  
  /**
   * 제출 버튼 텍스트
   * @default '저장'
   */
  submitText?: string;
  
  /**
   * 취소 버튼 텍스트
   * @default '취소'
   */
  cancelText?: string;
  
  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

export function EntityFormButtons({
  onCancel,
  isLoading = false,
  submitText = '저장',
  cancelText = '취소',
  className,
}: EntityFormButtonsProps) {
  return (
    <div className={`flex justify-end gap-2 mt-6 ${className || ''}`}>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isLoading}
      >
        {cancelText}
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? '저장 중...' : submitText}
      </Button>
    </div>
  );
}
