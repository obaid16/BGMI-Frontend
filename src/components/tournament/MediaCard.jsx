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
      className="group relative bg-premium-surface border border-premium-border hover:border-premium-text rounded-[24px] overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1 shadow-sm flex flex-col justify-between"
    >
      <div>
        {/* Media Thumbnail Container */}
        <div className="relative aspect-[4/3] w-full bg-premium-surface-soft overflow-hidden">
          <img
            src={imageSrc}
            alt={item.title || 'Media Highlight'}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_GAMING_IMAGE;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

          {/* Type Badge */}
          <div className="absolute top-4 left-4 z-10">
            <Badge variant={isVideo ? 'live' : 'default'} size="sm" className="bg-white/90 backdrop-blur-sm border-none shadow-sm text-premium-text">
              {isVideo ? <Video className="w-3 h-3 mr-1.5 inline text-red-500" /> : <Image className="w-3 h-3 mr-1.5 inline text-premium-sage" />}
              <span className="font-semibold">{item.type || 'Screenshot'}</span>
            </Badge>
          </div>

          {/* Play Overlay Icon for Videos */}
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/40 group-hover:bg-white group-hover:text-black transition-all">
                <Play className="w-6 h-6 fill-current ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* Info Body */}
        <div className="p-5 space-y-4">
          <div>
            <h4 className="font-semibold text-lg text-premium-text line-clamp-1 group-hover:text-black transition-colors leading-tight">
              {item.title}
            </h4>
            <span className="text-xs text-premium-text-secondary font-medium mt-1 inline-block">{item.date}</span>
          </div>

          <div className="pt-4 border-t border-premium-border grid grid-cols-2 gap-x-3 gap-y-3 text-xs text-premium-text-secondary font-medium">
            <div>
              <span className="text-[10px] uppercase font-semibold text-premium-text-secondary block mb-0.5">Squad</span>
              <span className="text-premium-text font-semibold line-clamp-1">{item.team || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-premium-text-secondary block mb-0.5">Match</span>
              <span className="text-premium-sage font-semibold line-clamp-1">{item.match || 'Match #01'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-premium-text-secondary block mb-0.5">Player</span>
              <span className="text-premium-text line-clamp-1">{item.player || 'Player'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-premium-text-secondary block mb-0.5">Status</span>
              {item.verified ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              ) : (
                <span className="text-amber-600 font-semibold">Pending</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
