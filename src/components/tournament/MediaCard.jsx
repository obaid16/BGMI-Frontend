'use client';

import React from 'react';
import { Play, Image, Video, ShieldCheck } from 'lucide-react';
import Badge from '../common/Badge';

export default function MediaCard({ item, onClick }) {
  if (!item) return null;

  const isVideo = item.type === 'POV' || !!item.videoUrl;

  return (
    <div
      onClick={() => onClick && onClick(item)}
      className="group relative bg-bgmi-surface border border-bgmi-border hover:border-bgmi-gold/60 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1 shadow-lg clip-tactical"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full bg-bgmi-dark overflow-hidden">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-bgmi-dark via-transparent to-transparent opacity-80"></div>

        {/* Media Type Icon Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant={isVideo ? 'red' : 'cyan'} size="sm">
            {isVideo ? <Video className="w-3 h-3 mr-1 inline" /> : <Image className="w-3 h-3 mr-1 inline" />}
            {item.type}
          </Badge>
        </div>

        {/* Play Overlay Icon for Videos */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-bgmi-gold/90 text-slate-950 flex items-center justify-center shadow-gold-glow group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Info Body */}
      <div className="p-4 space-y-3">
        <div>
          <h4 className="font-display font-bold text-sm text-white line-clamp-1 group-hover:text-bgmi-gold transition-colors">
            {item.title}
          </h4>
          <span className="text-[10px] text-slate-500 font-semibold">{item.date}</span>
        </div>

        <div className="pt-2 border-t border-bgmi-border/40 grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] text-slate-400 font-medium">
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Squad</span>
            <span className="text-slate-200 font-bold">{item.team}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Match</span>
            <span className="text-bgmi-cyan font-bold">{item.match}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Player</span>
            <span className="text-slate-200">{item.player || 'N/A'}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Status</span>
            {item.verified ? (
              <span className="text-emerald-400 font-bold">✓ Verified</span>
            ) : (
              <span className="text-amber-400">Pending Review</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
