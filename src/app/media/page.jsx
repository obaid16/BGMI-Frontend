'use client';

import React, { useState, useEffect, useMemo } from 'react';
import MediaCard from '@/components/tournament/MediaCard';
import MediaLightbox from '@/components/tournament/MediaLightbox';
import SubmitMediaModal from '@/components/tournament/SubmitMediaModal';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonGrid } from '@/components/common/Skeleton';
import { getMedia } from '@/services/api';
import { Video, Upload, Search, UserCheck } from 'lucide-react';

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

  const uniquePlayers = useMemo(() => {
    const players = new Set();
    mediaList.forEach((m) => {
      if (m.player && m.player.trim()) {
        players.add(m.player.trim());
      }
    });
    return Array.from(players);
  }, [mediaList]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-sans">
      
      {/* HEADER */}
      <div className="border-b border-[#E7E3DA] dark:border-[#1E2638] pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <Video className="w-8 h-8 sm:w-10 sm:h-10 text-sky-500" /> Esports Media Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl font-normal">
            Player POV recordings, victory screenshots, in-game match captures, and verified referee scorecards.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 dark:bg-bgmi-red dark:hover:bg-bgmi-red-hover text-white font-display font-bold text-xs uppercase tracking-wider rounded-xl shadow-editorial transition-all flex items-center gap-2 active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Submit Screenshot</span>
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="space-y-4 p-4 sm:p-6 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl shadow-editorial-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* CATEGORY TABS */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
                  filter === cat
                    ? 'bg-slate-950 text-white border-slate-950 dark:bg-bgmi-red dark:border-bgmi-red shadow-editorial'
                    : 'bg-[#FAF8F5] dark:bg-[#0B0E14] text-slate-700 dark:text-slate-400 border-[#E7E3DA] dark:border-[#1E2638] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* SEARCH INPUT */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, squad, or player..."
              value={playerSearch}
              onChange={(e) => setPlayerSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] dark:bg-[#0B0E14] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-bgmi-red shadow-editorial-sm"
            />
          </div>

        </div>

        {/* QUICK PLAYER PROOF TRACKER TAGS */}
        {uniquePlayers.length > 0 && (
          <div className="pt-3 border-t border-[#E7E3DA] dark:border-[#1E2638] flex items-center gap-2 overflow-x-auto text-xs table-scroll-container">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 shrink-0">
              <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> Player Proofs:
            </span>
            <button
              onClick={() => { setSelectedPlayer('All Players'); setPlayerSearch(''); }}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 border ${
                selectedPlayer === 'All Players' && !playerSearch
                  ? 'bg-slate-950 text-white border-slate-950 dark:bg-white dark:text-slate-950'
                  : 'bg-[#FAF8F5] dark:bg-[#0B0E14] text-slate-600 dark:text-slate-400 border-[#E7E3DA] dark:border-[#1E2638]'
              }`}
            >
              All Roster Submissions
            </button>
            {uniquePlayers.slice(0, 10).map((player) => (
              <button
                key={player}
                onClick={() => { setSelectedPlayer(player); setPlayerSearch(''); }}
                className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 border ${
                  selectedPlayer === player
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                    : 'bg-[#FAF8F5] dark:bg-[#0B0E14] text-slate-600 dark:text-slate-400 border-[#E7E3DA] dark:border-[#1E2638] hover:border-amber-500/50'
                }`}
              >
                {player}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CLEAN RESPONSIVE CSS GRID: 4 columns desktop, 2 tablet, 1 mobile */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : filteredMedia.length === 0 ? (
        <EmptyState
          title="No Media Found"
          message={
            playerSearch || selectedPlayer !== 'All Players'
              ? `No screenshots or POV recordings found for "${playerSearch || selectedPlayer}".`
              : "No media highlights published under this category."
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
