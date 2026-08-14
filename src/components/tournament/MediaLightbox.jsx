'use client';

import React from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { getMediaImageUrl, DEFAULT_GAMING_IMAGE } from '@/services/api';

export default function MediaLightbox({ item, isOpen, onClose }) {
  if (!item) return null;

  const isVideo = item.type === 'POV' || !!item.videoUrl;
  const imageSrc = getMediaImageUrl(item);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item.title} maxWidth="max-w-4xl">
      <div className="space-y-4">
        {/* Media Content Display */}
        <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden border border-bgmi-border dark:border-bgmi-border light:border-slate-200">
          {isVideo ? (
            <iframe
              src={item.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
              title={item.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <img
              src={imageSrc}
              alt={item.title || 'Media Proof'}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_GAMING_IMAGE;
              }}
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Media Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-bgmi-dark/70 dark:bg-bgmi-dark/70 light:bg-slate-100 rounded-xl border border-bgmi-border/40 dark:border-bgmi-border/40 light:border-slate-200 text-xs">
          <div>
            <p className="text-slate-400 dark:text-slate-400 light:text-slate-600">Team: <span className="text-white dark:text-white light:text-slate-900 font-bold">{item.team || 'N/A'}</span></p>
            {item.player && <p className="text-slate-400 dark:text-slate-400 light:text-slate-600">Player: <span className="text-bgmi-gold dark:text-bgmi-gold light:text-amber-600 font-bold">{item.player}</span></p>}
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-400 light:text-slate-600">Match: <span className="text-bgmi-cyan dark:text-bgmi-cyan light:text-sky-600 font-bold">{item.match || 'Match #01'}</span></p>
            <p className="text-slate-400 dark:text-slate-400 light:text-slate-600">Date: <span className="text-white dark:text-white light:text-slate-900 font-bold">{item.date}</span></p>
          </div>
          <Badge variant="green" size="sm">
            Referee Verified Proof
          </Badge>
        </div>
      </div>
    </Modal>
  );
}
