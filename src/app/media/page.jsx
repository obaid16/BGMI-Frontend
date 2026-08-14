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

  const categories = ['All', 'POV', 'Screenshots', 'Results'];

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 dark:border-bgmi-border/60 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-3">
            <Video className="w-9 h-9 sm:w-11 sm:h-11 text-sky-600 dark:text-bgmi-cyan" /> Esports Media Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl font-medium">
            Player POV recordings, victory screenshots, in-game match captures, and verified referee scorecards.
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

      {/* SEARCH & PLAYER SS FILTER TRACKER TOOLBAR */}
      <div className="bg-white dark:bg-bgmi-surface border border-slate-200 dark:border-bgmi-border rounded-xl p-4 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* CATEGORY FILTERS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 table-scroll-container">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all whitespace-nowrap ${
                  filter === cat
                    ? 'bg-bgmi-red text-white border-rose-400 shadow-red-glow'
                    : 'bg-slate-50 dark:bg-bgmi-dark text-slate-700 dark:text-slate-400 border-slate-200 dark:border-bgmi-border hover:text-bgmi-red'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* PLAYER NAME SEARCH & SELECT DROPDOWN */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by Player Name..."
                value={playerSearch}
                onChange={(e) => setPlayerSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-bgmi-dark border border-slate-200 dark:border-bgmi-border rounded-lg text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-bgmi-cyan"
              />
              {playerSearch && (
                <button
                  onClick={() => setPlayerSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Player Selection Dropdown */}
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-slate-50 dark:bg-bgmi-dark border border-slate-200 dark:border-bgmi-border rounded-lg text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-bgmi-gold"
              >
                <option value="All Players">All Players ({mediaList.length} Uploads)</option>
                {uniquePlayers.map((p) => (
                  <option key={p} value={p}>
                    Player: {p}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* QUICK PLAYER PROOF TRACKER TAGS */}
        {uniquePlayers.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-bgmi-border/40 flex items-center gap-2 overflow-x-auto text-xs table-scroll-container">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 shrink-0">
              <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> Player Proofs:
            </span>
            <button
              onClick={() => { setSelectedPlayer('All Players'); setPlayerSearch(''); }}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all shrink-0 ${
                selectedPlayer === 'All Players' && !playerSearch
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-bgmi-dark text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Roster Submissions
            </button>
            {uniquePlayers.slice(0, 10).map((player) => (
              <button
                key={player}
                onClick={() => { setSelectedPlayer(player); setPlayerSearch(''); }}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all shrink-0 ${
                  selectedPlayer === player
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-100 dark:bg-bgmi-dark/70 text-slate-700 dark:text-slate-300 hover:bg-amber-500/20'
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
          title="No Media Found for Player"
          message={
            playerSearch || selectedPlayer !== 'All Players'
              ? `No screenshots or POV recordings submitted yet for "${playerSearch || selectedPlayer}".`
              : "No media highlights uploaded under this category."
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
