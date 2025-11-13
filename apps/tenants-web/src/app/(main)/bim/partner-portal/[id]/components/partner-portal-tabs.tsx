'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  badge?: number;
}

interface PartnerPortalTabsProps {
  tabs: Tab[];
}

export function PartnerPortalTabs({ tabs }: PartnerPortalTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  return (
    <div className="space-y-6">
      {/* 탭 버튼 */}
      <div className="border-b border-border">
        <div className="flex gap-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {tab.badge !== undefined && (
                <span className="ml-2 inline-block px-2 py-0.5 bg-muted rounded-full text-xs font-semibold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="pt-2">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? 'block' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
