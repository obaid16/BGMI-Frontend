'use client';

import React, { useState, useEffect } from 'react';
import MediaCard from '@/components/tournament/MediaCard';
import MediaLightbox from '@/components/tournament/MediaLightbox';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonGrid } from '@/components/common/Skeleton';
import { getMedia } from '@/services/api';
import { Video } from 'lucide-react';

export default function MediaPage() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    async function fetchMedia() {
      setLoading(true);
      const data = await getMedia(filter);
      setMediaList(data);
      setLoading(false);
    }
    fetchMedia();
  }, [filter]);

  const categories = ['All', 'POV', 'Screenshots', 'Results'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* HEADER */}
      <div className="border-b border-bgmi-border/60 pb-6 space-y-2">
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-wide flex items-center gap-3">
          <Video className="w-10 h-10 text-bgmi-cyan" /> Esports Media Gallery
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          High-definition player POV recordings, in-game screenshot captures, and referee scorecards.
        </p>
      </div>

      {/* CATEGORY FILTERS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
              filter === cat
                ? 'bg-bgmi-gold text-slate-950 border-amber-300 shadow-gold-glow'
                : 'bg-bgmi-surface text-slate-400 border-bgmi-border hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MEDIA GRID */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : mediaList.length === 0 ? (
        <EmptyState title="No Media Found" message="No media highlights uploaded under this category." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaList.map((item) => (
            <MediaCard key={item.id} item={item} onClick={(selected) => setSelectedItem(selected)} />
          ))}
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      <MediaLightbox
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
