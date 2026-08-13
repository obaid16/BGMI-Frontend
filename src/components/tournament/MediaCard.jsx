'use client';

import React from 'react';
import { Play, Image, Video, ShieldCheck } from 'lucide-react';
import Badge from '../common/Badge';

export default function MediaCard({ item, onClick }) {
  if (!item) return null;

  const isVideo = item.type === 'POV' || item.type === 'Highlight' || !!item.videoUrl;

  return (
    <div
      onClick={() => onClick && onClick(item)}
      className="group relative bg-white dark:bg-bgmi-surface/95 border border-slate-200 dark:border-bgmi-border hover:border-bgmi-red rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 shadow-md dark:shadow-xl clip-tactical flex flex-col justify-between"
    >
      <div>
        {/* Media Thumbnail Container */}
        <div className="relative aspect-video w-full bg-slate-900 dark:bg-bgmi-dark overflow-hidden">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-85 group-hover:opacity-100"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 dark:from-bgmi-dark via-transparent to-transparent opacity-90" />

          {/* Type Badge */}
          <div className="absolute top-3 left-3 z-10">
            <Badge variant={isVideo ? 'live' : 'cyan'} size="sm">
              {isVideo ? <Video className="w-3 h-3 mr-1 inline" /> : <Image className="w-3 h-3 mr-1 inline" />}
              {item.type}
            </Badge>
          </div>

          {/* Play Overlay Icon for Videos */}
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-bgmi-red text-white flex items-center justify-center shadow-red-glow group-hover:scale-115 transition-transform">
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </div>
            </div>
          )}
        </div>

        {/* Info Body */}
        <div className="p-4 space-y-3">
          <div>
            <h4 className="font-display font-black text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-bgmi-red transition-colors">
              {item.title}
            </h4>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{item.date}</span>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-bgmi-border/40 grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block">Squad</span>
              <span className="text-slate-900 dark:text-slate-200 font-bold line-clamp-1">{item.team}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block">Match</span>
              <span className="text-sky-600 dark:text-bgmi-cyan font-bold line-clamp-1">{item.match}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block">Player</span>
              <span className="text-slate-900 dark:text-slate-200 line-clamp-1">{item.player || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block">Referee Check</span>
              {item.verified ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 font-semibold">Pending</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
