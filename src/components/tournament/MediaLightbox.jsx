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
        <div className="relative aspect-video w-full bg-premium-background rounded-[16px] overflow-hidden border border-premium-border">
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
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-premium-surface-soft rounded-[16px] border border-premium-border text-sm">
          <div>
            <p className="text-premium-text-secondary">Squad: <span className="text-premium-text font-semibold">{item.team || 'N/A'}</span></p>
            {item.player && <p className="text-premium-text-secondary mt-1">Player: <span className="text-premium-text font-semibold">{item.player}</span></p>}
          </div>
          <div>
            <p className="text-premium-text-secondary">Match: <span className="text-premium-sage font-semibold">{item.match || 'Match #01'}</span></p>
            <p className="text-premium-text-secondary mt-1">Date: <span className="text-premium-text font-semibold">{item.date}</span></p>
          </div>
          <Badge variant="green" size="md">
            Verified
          </Badge>
        </div>
      </div>
    </Modal>
  );
}

