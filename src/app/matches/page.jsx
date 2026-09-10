'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ScheduleTab from '@/components/tournament/tabs/ScheduleTab';
import ResultsTab from '@/components/tournament/tabs/ResultsTab';
import StandingsTab from '@/components/tournament/tabs/StandingsTab';
import MVPTab from '@/components/tournament/tabs/MVPTab';

function MatchesHubContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('schedule');

  // Read initial tab from URL or set default
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['schedule', 'results', 'standings', 'mvp'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    router.push(`/matches?tab=${tabId}`, { scroll: false });
  };

  const tabs = [
    { id: 'schedule', label: 'Schedule' },
    { id: 'results', label: 'Results' },
    { id: 'standings', label: 'Standings' },
    { id: 'mvp', label: 'MVP' }
  ];

  return (
    <div className="w-full">
      {/* GLOBAL TOURNAMENT TABS */}
      <div className="sticky top-20 z-20 bg-premium-background/95 backdrop-blur-md border-b border-premium-border pt-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1500px] mx-auto">
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto hide-scrollbar -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-premium-text text-premium-text'
                    : 'border-transparent text-premium-text-secondary hover:text-premium-text hover:border-premium-border'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="w-full animate-in fade-in duration-300">
        {activeTab === 'schedule' && <ScheduleTab />}
        {activeTab === 'results' && <ResultsTab />}
        {activeTab === 'standings' && <StandingsTab />}
        {activeTab === 'mvp' && <MVPTab />}
      </div>
    </div>
  );
}

export default function MatchesHub() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-premium-background p-16 flex justify-center"><div className="w-8 h-8 rounded-full border-4 border-premium-border border-t-premium-text animate-spin"></div></div>}>
      <MatchesHubContent />
    </Suspense>
  );
}
