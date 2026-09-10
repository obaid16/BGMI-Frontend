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
    try {
      const res = await updateMediaStatus(targetId, status);
      if (res && res.success) {
        setMediaList((prev) =>
          prev.map((m) =>
            ((m.id || m._id) === targetId) ? { ...m, status, verified: status === 'Published' || status === 'Verified' || status === 'Approved' || m.verified } : m
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
    } catch (err) {
      showToast(err.message || 'Error updating media status', 'error');
    }
  };

  const handleDelete = async (item) => {
    const targetId = item.id || item._id;
    if (window.confirm(`Are you sure you want to delete media "${item.title}" permanently?`)) {
      try {
        const res = await deleteMedia(targetId);
        if (res && res.success) {
          setMediaList((prev) => prev.filter((m) => (m.id || m._id) !== targetId));
          showToast('Media proof deleted permanently!', 'info');
        } else {
          showToast('Failed to delete media', 'error');
        }
      } catch (err) {
        showToast(err.message || 'Error deleting media', 'error');
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
    <div className="space-y-8 max-w-full overflow-hidden">
      
      {/* HEADER */}
      <div className="border-b border-premium-border pb-6">
        <h1 className="font-bold text-3xl text-premium-text tracking-tight flex items-center gap-3">
          <Video className="w-8 h-8 text-amber-600" /> Media Approvals
        </h1>
        <p className="text-sm text-premium-text-secondary font-medium mt-2">Verify player match screenshots, approve media entries, and publish highlights to the Home Page.</p>
      </div>

      {/* FILTER & PLAYER VERIFICATION TOOLBAR */}
      <div className="bg-premium-surface border border-premium-border p-6 rounded-[24px] space-y-6 shadow-sm">
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
          
          {/* STATUS TABS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {['All', 'Pending Review', 'Published', 'Approved', 'Rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-2 rounded-[12px] text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                  statusFilter === tab
                    ? 'bg-black text-white border-black shadow-premium-soft'
                    : 'bg-premium-background text-premium-text-secondary border-premium-border hover:border-premium-text/30 hover:text-premium-text'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* PLAYER NAME SEARCH & FILTER DROPDOWN */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            
            {/* Player Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-premium-text-secondary" />
              <input
                type="text"
                placeholder="Search Player or Title..."
                value={playerSearch}
                onChange={(e) => setPlayerSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-premium-border rounded-[12px] text-sm text-premium-text font-bold focus:outline-none focus:border-premium-text shadow-sm transition-all"
              />
              {playerSearch && (
                <button
                  onClick={() => setPlayerSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-premium-text-secondary hover:text-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Player Dropdown */}
            <select
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 bg-white border border-premium-border rounded-[12px] text-sm text-premium-text font-bold focus:outline-none focus:border-premium-text shadow-sm appearance-none cursor-pointer"
            >
              <option value="All Players">All Players ({mediaList.length} Proofs)</option>
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
          <div className="pt-4 border-t border-premium-border flex items-center gap-3 overflow-x-auto hide-scrollbar">
            <span className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary flex items-center gap-1.5 shrink-0">
              <UserCheck className="w-4 h-4 text-emerald-500" /> Filter by Player:
            </span>
            <button
              onClick={() => { setSelectedPlayer('All Players'); setPlayerSearch(''); }}
              className={`px-3 py-1.5 rounded-[10px] text-[11px] font-bold transition-all shrink-0 border ${
                selectedPlayer === 'All Players' && !playerSearch
                  ? 'bg-black text-white border-black'
                  : 'bg-premium-background text-premium-text-secondary border-premium-border hover:border-premium-text/30 hover:text-black'
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
                  className={`px-3 py-1.5 rounded-[10px] text-[11px] font-bold transition-all shrink-0 flex items-center gap-2 border ${
                    selectedPlayer === player
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-premium-background text-premium-text-secondary border-premium-border hover:border-premium-text/30 hover:text-black'
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
      <div className="bg-premium-surface border border-premium-border rounded-[24px] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm font-bold text-premium-text-secondary">Loading proof submissions...</div>
        ) : filteredMedia.length === 0 ? (
          <div className="py-16 text-center text-sm font-bold text-premium-text-secondary">
            No media submissions found for "{playerSearch || selectedPlayer || statusFilter}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap min-w-[1100px]">
              <thead className="bg-premium-background text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest border-b border-premium-border">
                <tr>
                  <th className="px-6 py-4">Media Preview & Title</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Team / Player Name</th>
                  <th className="px-6 py-4">Match</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-premium-border bg-white">
                {filteredMedia.map((m) => {
                  const mId = m.id || m._id;
                  const previewImg = getMediaImageUrl(m);

                  return (
                    <tr key={mId} className="hover:bg-premium-surface-soft transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <img
                            src={previewImg}
                            alt={m.title || 'Proof'}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = DEFAULT_GAMING_IMAGE;
                            }}
                            className="w-16 h-12 object-cover rounded-[10px] border border-premium-border shrink-0 shadow-sm"
                          />
                          <div>
                            <span className="font-bold text-base text-premium-text tracking-tight block max-w-[200px] truncate">{m.title}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5"><Badge variant="default" size="sm">{m.type || 'Screenshot'}</Badge></td>
                      <td className="px-6 py-5">
                        <p className="font-bold text-premium-text">{m.team || 'N/A'}</p>
                        <p className="text-[11px] text-premium-text-secondary font-bold mt-0.5">PLAYER: {m.player || 'Unknown Player'}</p>
                      </td>
                      <td className="px-6 py-5 font-bold text-amber-700">{m.match || 'Match #01'}</td>
                      <td className="px-6 py-5">
                        <Badge variant={m.status === 'Published' || m.status === 'Approved' ? 'green' : m.status === 'Rejected' ? 'rejected' : 'pending'} size="sm">
                          {m.status || 'Pending Review'}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="secondary" size="sm" icon={Eye} onClick={() => setSelectedItem(m)}>
                            Preview
                          </Button>
                          <Button
                            variant={m.status === 'Approved' || m.status === 'Verified' || m.status === 'Published' || m.verified ? 'success' : 'primary'}
                            size="sm"
                            icon={Check}
                            onClick={() => handleUpdateStatus(m, 'Approved')}
                          >
                            {m.status === 'Approved' || m.status === 'Verified' || m.status === 'Published' || m.verified ? 'Approved' : 'Approve'}
                          </Button>
                          <Button
                            variant={m.status === 'Published' ? 'success' : 'primary'}
                            size="sm"
                            icon={Globe}
                            onClick={() => handleUpdateStatus(m, 'Published')}
                          >
                            {m.status === 'Published' ? 'Published' : 'Publish'}
                          </Button>
                          {m.status !== 'Rejected' && (
                            <Button variant="secondary" size="sm" icon={X} onClick={() => handleUpdateStatus(m, 'Rejected')}>
                              Reject
                            </Button>
                          )}
                          <button
                            onClick={() => handleDelete(m)}
                            className="w-9 h-9 flex items-center justify-center rounded-[10px] text-rose-500 bg-white border border-premium-border hover:border-rose-300 hover:bg-rose-50 transition-colors shadow-sm"
                            title="Delete Media"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL */}
      <MediaLightbox item={selectedItem} isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
