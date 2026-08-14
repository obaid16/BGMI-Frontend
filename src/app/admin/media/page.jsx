'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import MediaLightbox from '@/components/tournament/MediaLightbox';
import { getMedia, updateMediaStatus, deleteMedia, getMediaImageUrl, DEFAULT_GAMING_IMAGE } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Video, Globe, Check, X, Eye, Search, UserCheck, Trash2 } from 'lucide-react';

export default function AdminMediaPage() {
  const { showToast } = useToast();
  const [mediaList, setMediaList] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [playerSearch, setPlayerSearch] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('All Players');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      setLoading(true);
      const data = await getMedia('All', 'All');
      setMediaList(data);
    } catch (err) {
      console.error('Failed to fetch media proofs:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (item, status) => {
    const targetId = item.id || item._id;
    const res = await updateMediaStatus(targetId, status);
    if (res.success) {
      setMediaList((prev) =>
        prev.map((m) =>
          ((m.id || m._id) === targetId) ? { ...m, status, verified: status === 'Published' || status === 'Verified' || status === 'Approved' } : m
        )
      );
      showToast(
        status === 'Published'
          ? 'Media Published to Home Page!'
          : status === 'Approved' || status === 'Verified'
          ? 'Media Screenshot Approved!'
          : `Media status set to ${status}`,
        'success'
      );
    } else {
      showToast('Failed to update media status', 'error');
    }
  };

  const handleDelete = async (item) => {
    const targetId = item.id || item._id;
    if (window.confirm(`Are you sure you want to delete media "${item.title}" permanently?`)) {
      const res = await deleteMedia(targetId);
      if (res.success) {
        setMediaList((prev) => prev.filter((m) => (m.id || m._id) !== targetId));
        showToast('Media proof deleted permanently!', 'info');
      } else {
        showToast('Failed to delete media', 'error');
      }
    }
  };

  // Extract unique players from submitted media
  const uniquePlayers = useMemo(() => {
    const players = new Set();
    mediaList.forEach((m) => {
      if (m.player && m.player.trim()) {
        players.add(m.player.trim());
      }
    });
    return Array.from(players);
  }, [mediaList]);

  // Filter media items by status, player search, and player name selection
  const filteredMedia = useMemo(() => {
    return mediaList.filter((m) => {
      const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
      const searchLower = playerSearch.toLowerCase().trim();

      const matchesSearch = !searchLower || (
        (m.player && m.player.toLowerCase().includes(searchLower)) ||
        (m.team && m.team.toLowerCase().includes(searchLower)) ||
        (m.title && m.title.toLowerCase().includes(searchLower))
      );

      const matchesSelectedPlayer = selectedPlayer === 'All Players' || (
        m.player && m.player.toLowerCase().trim() === selectedPlayer.toLowerCase().trim()
      );

      return matchesStatus && matchesSearch && matchesSelectedPlayer;
    });
  }, [mediaList, statusFilter, playerSearch, selectedPlayer]);

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 dark:border-bgmi-border/60 pb-4">
        <h1 className="font-display font-black text-2xl text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
          <Video className="w-6 h-6 text-bgmi-cyan" /> Uploaded Proofs & Media Approvals Queue
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Verify player match screenshots, approve media entries, and publish highlights to the Home Page.</p>
      </div>

      {/* FILTER & PLAYER VERIFICATION TOOLBAR */}
      <div className="bg-white dark:bg-bgmi-surface/90 border border-slate-200 dark:border-bgmi-border p-4 rounded-xl space-y-4 shadow-sm">
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* STATUS TABS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 table-scroll-container">
            {['All', 'Pending Review', 'Published', 'Approved', 'Rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all whitespace-nowrap ${
                  statusFilter === tab
                    ? 'bg-bgmi-red text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* PLAYER NAME SEARCH & FILTER DROPDOWN */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            
            {/* Player Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by Player / IGN Name..."
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

            {/* Player Dropdown */}
            <select
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-50 dark:bg-bgmi-dark border border-slate-200 dark:border-bgmi-border rounded-lg text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-bgmi-gold"
            >
              <option value="All Players">All Players ({mediaList.length} Total Proofs)</option>
              {uniquePlayers.map((p) => (
                <option key={p} value={p}>
                  Player: {p}
                </option>
              ))}
            </select>

          </div>

        </div>

        {/* QUICK PLAYER SUBMISSION STATUS BADGES */}
        {uniquePlayers.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-bgmi-border/40 flex items-center gap-2 overflow-x-auto text-xs table-scroll-container">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 shrink-0">
              <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> Filter by Player Name:
            </span>
            <button
              onClick={() => { setSelectedPlayer('All Players'); setPlayerSearch(''); }}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all shrink-0 ${
                selectedPlayer === 'All Players' && !playerSearch
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-bgmi-dark text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Players
            </button>
            {uniquePlayers.map((player) => {
              const playerMedia = mediaList.filter((m) => m.player && m.player.toLowerCase() === player.toLowerCase());
              const hasVerified = playerMedia.some((m) => m.status === 'Published' || m.status === 'Approved' || m.verified);

              return (
                <button
                  key={player}
                  onClick={() => { setSelectedPlayer(player); setPlayerSearch(''); }}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    selectedPlayer === player
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-100 dark:bg-bgmi-dark/70 text-slate-700 dark:text-slate-300 hover:bg-amber-500/20'
                  }`}
                >
                  <span>{player}</span>
                  <span className={`w-2 h-2 rounded-full ${hasVerified ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </button>
              );
            })}
          </div>
        )}

      </div>

      {/* MEDIA TABLE CONTAINER WITH SIDEWAYS TOUCH SCROLL */}
      <div className="bg-white dark:bg-bgmi-surface border border-slate-200 dark:border-bgmi-border rounded-xl shadow-md dark:shadow-xl transition-colors duration-200 table-scroll-container">
        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-slate-400">Loading proof submissions...</div>
        ) : filteredMedia.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-slate-500 dark:text-slate-400">
            No media submissions found for "{playerSearch || selectedPlayer || statusFilter}".
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse min-w-[1050px]">
            <thead className="bg-slate-100 dark:bg-bgmi-dark text-slate-700 dark:text-slate-400 font-display font-bold uppercase text-[10px] border-b border-slate-200 dark:border-bgmi-border">
              <tr>
                <th className="p-4 whitespace-nowrap min-w-[200px]">Media Preview & Title</th>
                <th className="p-4 whitespace-nowrap min-w-[100px]">Type</th>
                <th className="p-4 whitespace-nowrap min-w-[150px]">Team / Player Name</th>
                <th className="p-4 whitespace-nowrap min-w-[90px]">Match</th>
                <th className="p-4 whitespace-nowrap min-w-[110px]">Status</th>
                <th className="p-4 whitespace-nowrap text-right min-w-[480px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-bgmi-border/40">
              {filteredMedia.map((m) => {
                const mId = m.id || m._id;
                const previewImg = getMediaImageUrl(m);

                return (
                  <tr key={mId} className="hover:bg-slate-50 dark:hover:bg-bgmi-dark/40 transition-colors">
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={previewImg}
                          alt={m.title || 'Proof'}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = DEFAULT_GAMING_IMAGE;
                          }}
                          className="w-12 h-9 object-cover rounded border border-slate-300 dark:border-bgmi-border shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block line-clamp-1">{m.title}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap"><Badge variant="default" size="sm">{m.type || 'Screenshot'}</Badge></td>
                    <td className="p-4 whitespace-nowrap text-slate-800 dark:text-slate-300">
                      <p className="font-bold text-slate-900 dark:text-white">{m.team || 'N/A'}</p>
                      <p className="text-[11px] text-amber-600 dark:text-bgmi-gold font-bold font-mono">PLAYER: {m.player || 'Unknown Player'}</p>
                    </td>
                    <td className="p-4 whitespace-nowrap text-amber-600 dark:text-bgmi-gold font-bold font-mono">{m.match || 'Match #01'}</td>
                    <td className="p-4 whitespace-nowrap">
                      <Badge variant={m.status === 'Published' || m.status === 'Approved' ? 'green' : m.status === 'Rejected' ? 'rejected' : 'pending'} size="sm">
                        {m.status || 'Pending Review'}
                      </Badge>
                    </td>
                    <td className="p-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="secondary" size="sm" icon={Eye} onClick={() => setSelectedItem(m)}>
                          Preview
                        </Button>
                        <Button
                          variant={m.status === 'Approved' || m.status === 'Verified' ? 'success' : 'primary'}
                          size="sm"
                          icon={Check}
                          onClick={() => handleUpdateStatus(m, 'Approved')}
                        >
                          {m.status === 'Approved' || m.status === 'Verified' ? 'Approved' : 'Approve'}
                        </Button>
                        <Button
                          variant={m.status === 'Published' ? 'success' : 'primary'}
                          size="sm"
                          icon={Globe}
                          onClick={() => handleUpdateStatus(m, 'Published')}
                        >
                          {m.status === 'Published' ? 'Published' : 'Publish to Home'}
                        </Button>
                        {m.status !== 'Rejected' && (
                          <Button variant="secondary" size="sm" icon={X} onClick={() => handleUpdateStatus(m, 'Rejected')}>
                            Reject
                          </Button>
                        )}
                        <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(m)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* LIGHTBOX MODAL */}
      <MediaLightbox item={selectedItem} isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
