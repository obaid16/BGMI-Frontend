'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import MediaCard from '@/components/tournament/MediaCard';
import MediaLightbox from '@/components/tournament/MediaLightbox';
import SubmitMediaModal from '@/components/tournament/SubmitMediaModal';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonGrid } from '@/components/common/Skeleton';
import { getMedia } from '@/services/api';
import { Video, Upload } from 'lucide-react';

export default function MediaPage() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    const data = await getMedia(filter);
    setMediaList(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, [filter]);

  const categories = ['All', 'POV', 'Screenshots', 'Results'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* HEADER */}
      <div className="border-b border-bgmi-border/60 dark:border-bgmi-border/60 light:border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white dark:text-white light:text-slate-900 uppercase tracking-wide flex items-center gap-3">
            <Video className="w-9 h-9 sm:w-11 sm:h-11 text-bgmi-cyan dark:text-bgmi-cyan light:text-sky-600" /> Esports Media Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-2xl font-medium">
            Player POV recordings, squad victory photos, in-game screenshot captures, and verified match scorecards.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="primary"
            size="md"
            icon={Upload}
            onClick={() => setIsSubmitModalOpen(true)}
          >
            Submit Screenshot / POV
          </Button>
        </div>
      </div>

      {/* CATEGORY FILTERS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg border transition-all whitespace-nowrap ${
              filter === cat
                ? 'bg-bgmi-red text-white border-rose-400 shadow-red-glow'
                : 'bg-bgmi-surface/90 dark:bg-bgmi-surface/90 light:bg-white text-slate-400 dark:text-slate-400 light:text-slate-700 border-bgmi-border dark:border-bgmi-border light:border-slate-200 hover:text-bgmi-red'
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
            <MediaCard key={item.id || item._id} item={item} onClick={(selected) => setSelectedItem(selected)} />
          ))}
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      <MediaLightbox
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      {/* SUBMIT SCREENSHOT MODAL */}
      <SubmitMediaModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSuccess={fetchMedia}
      />
    </div>
  );
}
