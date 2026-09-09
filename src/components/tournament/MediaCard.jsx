'use client';

import React from 'react';
import { Play, Image, Video, ShieldCheck } from 'lucide-react';
import Badge from '../common/Badge';
import { getMediaImageUrl, DEFAULT_GAMING_IMAGE } from '@/services/api';

export default function MediaCard({ item, onClick }) {
  if (!item) return null;

  const isVideo = item.type === 'POV' || item.type === 'Highlight' || !!item.videoUrl;
  const imageSrc = getMediaImageUrl(item);

  return (
    <div
      onClick={() => onClick && onClick(item)}
      className="group relative bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] hover:border-slate-400 dark:hover:border-slate-600 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1 shadow-editorial-sm hover:shadow-editorial flex flex-col justify-between"
    >
      <div>
        {/* Media Thumbnail Container */}
        <div className="relative aspect-video w-full bg-slate-900 dark:bg-[#0B0E14] overflow-hidden">
          <img
            src={imageSrc}
            alt={item.title || 'Media Highlight'}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_GAMING_IMAGE;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Type Badge */}
          <div className="absolute top-3 left-3 z-10">
            <Badge variant={isVideo ? 'live' : 'gold'} size="sm">
              {isVideo ? <Video className="w-3 h-3 mr-1 inline" /> : <Image className="w-3 h-3 mr-1 inline" />}
              {item.type || 'Screenshot'}
            </Badge>
          </div>

          {/* Play Overlay Icon for Videos */}
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-11 h-11 rounded-full bg-bgmi-red text-white flex items-center justify-center shadow-editorial group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
            </div>
          )}
        </div>

        {/* Info Body */}
        <div className="p-4 sm:p-5 space-y-3">
          <div>
            <h4 className="font-display font-black text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-bgmi-red transition-colors">
              {item.title}
            </h4>
            <span className="text-[10px] font-mono text-slate-500 font-medium">{item.date}</span>
          </div>

          <div className="pt-2 border-t border-[#E7E3DA] dark:border-[#1E2638] grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Squad</span>
              <span className="text-slate-900 dark:text-slate-200 font-bold line-clamp-1">{item.team || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Match</span>
              <span className="text-bgmi-red font-bold line-clamp-1">{item.match || 'Match #01'}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">
                {item.player ? 'Player' : 'Proof Type'}
              </span>
              <span className="text-slate-900 dark:text-slate-200 line-clamp-1">
                {item.player || item.type || 'Screenshot'}
              </span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Referee Check</span>
              {item.verified ? (
                <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              ) : (
                <span className="text-amber-700 dark:text-amber-400 font-semibold">Pending</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
