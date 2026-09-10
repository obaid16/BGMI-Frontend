'use client';

import React from 'react';
import { BellRing, Calendar, AlertTriangle } from 'lucide-react';
import Badge from '../common/Badge';

export default function AnnouncementCard({ announcement }) {
  if (!announcement) return null;

  const isUrgent = announcement.priority === 'Urgent' || announcement.priority === 'High';

  return (
    <div className={`p-6 rounded-[24px] border transition-all ${
      isUrgent
        ? 'bg-amber-50 border-amber-200 shadow-sm'
        : 'bg-white border-premium-border shadow-sm hover:shadow-md'
    }`}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Badge variant={isUrgent ? 'gold' : 'default'} size="sm">
            {announcement.category || 'Announcement'}
          </Badge>
          {isUrgent && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 flex items-center gap-1.5 bg-amber-100/50 px-2 py-1 rounded-[6px]">
              <AlertTriangle className="w-3.5 h-3.5" /> Priority
            </span>
          )}
        </div>
        <span className="text-xs font-bold text-premium-text-secondary uppercase tracking-widest flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" /> {announcement.date}
        </span>
      </div>

      <h4 className="font-bold text-lg text-premium-text mb-2 tracking-tight">
        {announcement.title}
      </h4>

      <p className="text-sm text-premium-text-secondary leading-relaxed font-medium">
        {announcement.content}
      </p>
    </div>
  );
}
