'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Button from '@/components/common/Button';
import MediaCard from '@/components/tournament/MediaCard';
import MediaLightbox from '@/components/tournament/MediaLightbox';
import SubmitMediaModal from '@/components/tournament/SubmitMediaModal';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonGrid } from '@/components/common/Skeleton';
import { getMedia } from '@/services/api';
import { Video, Upload, Search, UserCheck, Filter, X } from 'lucide-react';

export default function MediaPage() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [playerSearch, setPlayerSearch] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('All Players');
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

  const categories = ['All', 'Screenshots', 'POV'];

  // Extract unique player names from media list for quick filter options
  const uniquePlayers = useMemo(() => {
    const players = new Set();
    mediaList.forEach((m) => {
      if (m.player && m.player.trim()) {
        players.add(m.player.trim());
      }
    });
    return Array.from(players);
  }, [mediaList]);

  // Filter media list by category, search text, and selected player filter
  const filteredMedia = useMemo(() => {
    return mediaList.filter((item) => {
      const matchesCategory = filter === 'All' || item.type === filter;
      const searchLower = playerSearch.toLowerCase().trim();
      
      const matchesSearch = !searchLower || (
        (item.player && item.player.toLowerCase().includes(searchLower)) ||
        (item.team && item.team.toLowerCase().includes(searchLower)) ||
        (item.title && item.title.toLowerCase().includes(searchLower))
      );

      const matchesSelectedPlayer = selectedPlayer === 'All Players' || (
        item.player && item.player.toLowerCase().trim() === selectedPlayer.toLowerCase().trim()
      );

      return matchesCategory && matchesSearch && matchesSelectedPlayer;
    });
  }, [mediaList, filter, playerSearch, selectedPlayer]);

  return (
    <div className="max-w-[1500px] mx-auto px-6 lg:px-8 py-16 space-y-12">
      
      {/* HEADER */}
      <div className="border-b border-premium-border pb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-premium-sage uppercase tracking-widest bg-premium-sage-soft px-3.5 py-1.5 rounded-full border border-premium-sage/30">
            <Video className="w-4 h-4" /> Media Gallery
          </div>
          <h1 className="font-bold text-5xl sm:text-6xl text-premium-text tracking-tight">
            Match Highlights
          </h1>
          <p className="text-base text-premium-text-secondary max-w-2xl font-medium">
            Player POV recordings, victory screenshots, in-game match captures, and verified referee scorecards.
          </p>
        </div>

        <div className="flex items-center shrink-0">
          <Button
            variant="primary"
            size="md"
            icon={Upload}
            onClick={() => setIsSubmitModalOpen(true)}
          >
            Submit Media
          </Button>
        </div>
      </div>

      {/* SEARCH & PLAYER SS FILTER TRACKER TOOLBAR */}
      <div className="bg-premium-surface border border-premium-border rounded-[20px] p-5 space-y-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5">
          
          {/* CATEGORY FILTERS */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 text-[11px] font-bold uppercase tracking-widest rounded-xl border transition-all whitespace-nowrap ${
                  filter === cat
                    ? 'bg-black text-white border-black shadow-premium-soft'
                    : 'bg-premium-background text-premium-text-secondary border-premium-border hover:border-premium-text/30 hover:text-premium-text'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* PLAYER NAME SEARCH & SELECT DROPDOWN */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-premium-text-secondary" />
              <input
                type="text"
                placeholder="Filter by Player..."
                value={playerSearch}
                onChange={(e) => setPlayerSearch(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-premium-background border border-premium-border rounded-[14px] text-sm text-premium-text font-medium focus:outline-none focus:border-premium-text transition-colors placeholder:text-premium-text-secondary/70 shadow-sm"
              />
              {playerSearch && (
                <button
                  onClick={() => setPlayerSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-premium-text-secondary hover:text-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Player Selection Dropdown */}
            <div className="relative w-full sm:w-56">
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="w-full px-4 py-3 bg-premium-background border border-premium-border rounded-[14px] text-sm text-premium-text font-bold focus:outline-none focus:border-premium-text shadow-sm appearance-none cursor-pointer"
              >
                <option value="All Players">All Players ({mediaList.length})</option>
                {uniquePlayers.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* QUICK PLAYER PROOF TRACKER TAGS */}
        {uniquePlayers.length > 0 && (
          <div className="pt-4 border-t border-premium-border flex items-center gap-3 overflow-x-auto text-sm scrollbar-hide">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-premium-text-secondary flex items-center gap-1.5 shrink-0">
              <UserCheck className="w-4 h-4 text-emerald-600" /> Player Proofs:
            </span>
            <button
              onClick={() => { setSelectedPlayer('All Players'); setPlayerSearch(''); }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shrink-0 ${
                selectedPlayer === 'All Players' && !playerSearch
                  ? 'bg-premium-text text-white shadow-sm'
                  : 'bg-premium-background text-premium-text-secondary hover:text-black border border-premium-border'
              }`}
            >
              All Uploads
            </button>
            {uniquePlayers.slice(0, 10).map((player) => (
              <button
                key={player}
                onClick={() => { setSelectedPlayer(player); setPlayerSearch(''); }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shrink-0 ${
                  selectedPlayer === player
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-premium-background text-premium-text-secondary border border-premium-border hover:bg-premium-surface-soft hover:text-premium-text'
                }`}
              >
                {player}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MEDIA GRID */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : filteredMedia.length === 0 ? (
        <EmptyState
          title="No Media Found"
          message={
            playerSearch || selectedPlayer !== 'All Players'
              ? `No screenshots or POV recordings submitted yet for "${playerSearch || selectedPlayer}".`
              : "No media highlights uploaded under this category."
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMedia.map((item) => (
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
