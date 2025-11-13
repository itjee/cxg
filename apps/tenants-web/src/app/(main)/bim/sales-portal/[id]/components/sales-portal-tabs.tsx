'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  badge?: number;
}

interface SalesPortalTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function SalesPortalTabs({
  tabs,
  activeTab,
  onTabChange,
}: SalesPortalTabsProps) {
  return (
    <div className="space-y-6">
      {/* 탭 네비게이션 */}
      <div className="border-b border-border">
        <div className="flex gap-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'px-1 py-3 text-sm font-medium border-b-2 transition-all duration-300',
                'whitespace-nowrap relative group',
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              <span className="relative flex items-center gap-2">
                {tab.label}
                {tab.badge !== undefined && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full ml-1">
                    {tab.badge}
                  </span>
                )}
              </span>

              {/* 호버 효과 */}
              {activeTab !== tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="min-h-[400px] animate-in fade-in duration-300">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              'transition-opacity duration-300',
              activeTab === tab.id ? 'block opacity-100' : 'hidden opacity-0',
            )}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
