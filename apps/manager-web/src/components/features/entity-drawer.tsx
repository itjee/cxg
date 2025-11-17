/**
 * EntityDrawer
 * 재사용 가능한 공통 Drawer 컴포넌트
 */

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface EntityDrawerProps {
  /**
   * Drawer 열림/닫힘 상태
   */
  open: boolean;
  
  /**
   * Drawer 상태 변경 콜백
   */
  onOpenChange: (open: boolean) => void;
  
  /**
   * Drawer 제목
   */
  title: string;
  
  /**
   * Drawer 설명 (선택)
   */
  description?: string;
  
  /**
   * Drawer 내용
   */
  children: React.ReactNode;
  
  /**
   * Drawer 너비
   * @default 'md'
   */
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function EntityDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  width = 'md',
}: EntityDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          'overflow-y-auto p-6',
          {
            'max-w-md': width === 'sm',
            'max-w-2xl': width === 'md',
            'max-w-4xl': width === 'lg',
            'max-w-6xl': width === 'xl',
            'w-full': width === 'full',
          }
        )}
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && (
            <SheetDescription>{description}</SheetDescription>
          )}
        </SheetHeader>
        
        <div className="mt-6">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
