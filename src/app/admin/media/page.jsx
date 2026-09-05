'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import MediaLightbox from '@/components/tournament/MediaLightbox';
import { getMedia, updateMediaStatus, deleteMedia, bulkDeleteMedia, getMediaImageUrl, DEFAULT_GAMING_IMAGE } from '@/services/api';
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
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

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
          setSelectedMedia((prev) => prev.filter((id) => id !== targetId));
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

  const allFilteredSelected = filteredMedia.length > 0 && filteredMedia.every((m) => selectedMedia.includes(m.id || m._id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      const filteredIds = new Set(filteredMedia.map((m) => m.id || m._id));
      setSelectedMedia((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      const newIds = new Set([...selectedMedia, ...filteredMedia.map((m) => m.id || m._id)]);
      setSelectedMedia(Array.from(newIds));
    }
  };

  const toggleSelectMedia = (id) => {
    setSelectedMedia((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedMedia.length === 0) return;
    if (window.confirm(`Are you sure you want to permanently delete all ${selectedMedia.length} selected media proof(s)?`)) {
      try {
        setBulkDeleting(true);
        const res = await bulkDeleteMedia(selectedMedia);
        if (res && res.success) {
          setMediaList((prev) => prev.filter((m) => !selectedMedia.includes(m.id || m._id)));
          showToast(`Successfully deleted ${selectedMedia.length} media proof(s)`, 'success');
          setSelectedMedia([]);
        } else {
          showToast('Failed to bulk delete media proofs', 'error');
        }
      } catch (err) {
        showToast(err.message || 'Error bulk deleting media', 'error');
      } finally {
        setBulkDeleting(false);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E7E3DA] dark:border-[#1E2638] pb-5">
        <div>
          <span className="text-[10px] font-mono text-bgmi-red font-bold uppercase tracking-widest block">
            /// CONTENT MODERATION
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2.5 mt-1">
            <Video className="w-6 h-6 text-amber-600 dark:text-bgmi-gold" /> 
            Media &amp; POV Proof Moderation
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-normal mt-1">
            Review uploaded match score screenshots and kill proof clips submitted by teams.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] text-xs font-mono font-bold text-slate-700 dark:text-slate-300 shadow-editorial-sm">
          <span className="text-amber-600 dark:text-bgmi-gold">{mediaList.length}</span>
          <span className="text-slate-500 dark:text-slate-400 uppercase">Submissions</span>
        </div>
      </div>

      {/* FILTER & PLAYER VERIFICATION TOOLBAR */}
      <div className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] p-4 rounded-2xl space-y-4 shadow-editorial-sm">
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* STATUS TABS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {['All', 'Pending Review', 'Published', 'Approved', 'Rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all whitespace-nowrap shadow-editorial-sm ${
                  statusFilter === tab
                    ? 'bg-slate-950 text-white dark:bg-bgmi-red dark:text-white'
                    : 'bg-white text-slate-700 border border-[#E7E3DA] dark:bg-[#181E2C] dark:text-slate-400 dark:border-[#1E2638] hover:text-slate-900 dark:hover:text-white'
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
                placeholder="Filter by Player / IGN..."
                value={playerSearch}
                onChange={(e) => setPlayerSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-[#0B0E14] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-amber-500"
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
              className="w-full sm:w-auto px-3 py-2 bg-slate-50 dark:bg-[#0B0E14] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-amber-500"
            >
              <option value="All Players">All Players ({mediaList.length})</option>
              {uniquePlayers.map((p) => (
                <option key={p} value={p}>
                  Player: {p}
                </option>
              ))}
            </select>

          </div>

        </div>

      </div>

      {/* BULK ACTION BAR */}
      {selectedMedia.length > 0 && (
        <div className="bg-red-500/10 dark:bg-red-950/30 border border-red-500/30 rounded-2xl p-3.5 px-5 flex items-center justify-between gap-4 shadow-editorial-sm animate-fadeIn">
          <div className="flex items-center gap-3 text-xs font-mono font-bold text-red-700 dark:text-red-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span>{selectedMedia.length} of {mediaList.length} submission(s) selected</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedMedia([])}
              className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors underline underline-offset-2"
            >
              Deselect All
            </button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
            >
              {bulkDeleting ? 'Deleting...' : `Delete Selected (${selectedMedia.length})`}
            </Button>
          </div>
        </div>
      )}

      {/* MEDIA TABLE CONTAINER */}
      <div className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl shadow-editorial-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-slate-400">Loading proof submissions...</div>
        ) : filteredMedia.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-slate-500 dark:text-slate-400">
            No media submissions found for &quot;{playerSearch || selectedPlayer || statusFilter}&quot;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[1050px]">
              <thead className="bg-[#FAF8F5] dark:bg-[#0B0E14] text-slate-600 dark:text-slate-400 font-mono font-bold uppercase text-[10px] border-b border-[#E7E3DA] dark:border-[#1E2638]">
                <tr>
                  <th className="p-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded text-bgmi-red accent-bgmi-red cursor-pointer"
                      title="Select all filtered media"
                    />
                  </th>
                  <th className="p-4 whitespace-nowrap min-w-[200px]">Media Preview &amp; Title</th>
                  <th className="p-4 whitespace-nowrap min-w-[100px]">Type</th>
                  <th className="p-4 whitespace-nowrap min-w-[150px]">Team / Player</th>
                  <th className="p-4 whitespace-nowrap min-w-[90px]">Match</th>
                  <th className="p-4 whitespace-nowrap min-w-[110px]">Status</th>
                  <th className="p-4 whitespace-nowrap text-right min-w-[480px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E3DA] dark:divide-[#1E2638]">
              {filteredMedia.map((m) => {
                const mId = m.id || m._id;
                const previewImg = getMediaImageUrl(m);
                const isSelected = selectedMedia.includes(mId);

                return (
                  <tr
                    key={mId}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-red-50/60 dark:bg-red-950/20'
                        : 'hover:bg-slate-50 dark:hover:bg-[#1A2131]'
                    }`}
                  >
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectMedia(mId)}
                        className="w-4 h-4 rounded text-bgmi-red accent-bgmi-red cursor-pointer"
                      />
                    </td>
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
        </div>
        )}
      </div>

      {/* LIGHTBOX MODAL */}
      <MediaLightbox item={selectedItem} isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
