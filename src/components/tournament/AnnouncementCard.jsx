'use client';

import React from 'react';
import { BellRing, Calendar, AlertTriangle } from 'lucide-react';
import Badge from '../common/Badge';

export default function AnnouncementCard({ announcement }) {
  if (!announcement) return null;

  const isUrgent = announcement.priority === 'Urgent' || announcement.priority === 'High';

  return (
    <div className={`p-5 rounded-xl border transition-all clip-tactical ${
      isUrgent
        ? 'bg-bgmi-surface/90 border-bgmi-gold/50 shadow-gold-glow'
        : 'bg-bgmi-surface/60 border-bgmi-border/60'
    }`}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Badge variant={isUrgent ? 'gold' : 'cyan'} size="sm">
            {announcement.category || 'Announcement'}
          </Badge>
          {isUrgent && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-bgmi-gold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Priority
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" /> {announcement.date}
        </span>
      </div>

      <h4 className="font-display font-bold text-base text-white mb-2">
        {announcement.title}
      </h4>

      <p className="text-xs text-slate-300 leading-relaxed">
        {announcement.content}
      </p>
    </div>
  );
}
