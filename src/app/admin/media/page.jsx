'use client';

import React, { useState, useEffect } from 'react';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import MediaLightbox from '@/components/tournament/MediaLightbox';
import { getMedia, updateMediaStatus } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Video, Check, X, Eye } from 'lucide-react';

export default function AdminMediaPage() {
  const { showToast } = useToast();
  const [mediaList, setMediaList] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
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
          ((m.id || m._id) === targetId) ? { ...m, status, verified: status === 'Published' || status === 'Verified' } : m
        )
      );
      showToast(`Media status updated to ${status}!`, 'success');
    } else {
      showToast('Failed to update media status', 'error');
    }
  };

  const filteredMedia = mediaList.filter((m) => {
    if (statusFilter === 'All') return true;
    return m.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 dark:border-bgmi-border/60 pb-4">
        <h1 className="font-display font-black text-2xl text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
          <Video className="w-6 h-6 text-bgmi-cyan" /> Uploaded Proofs & Media Approvals Queue
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Verify player match screenshots and POV recordings before publishing to the public gallery.</p>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 bg-white dark:bg-bgmi-surface/40 p-2 rounded-xl border border-slate-200 dark:border-bgmi-border/40 shadow-sm overflow-x-auto">
        {['All', 'Pending Review', 'Published', 'Rejected'].map((tab) => (
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

      {/* MEDIA TABLE */}
      <div className="bg-white dark:bg-bgmi-surface border border-slate-200 dark:border-bgmi-border rounded-xl overflow-hidden clip-tactical shadow-md dark:shadow-xl transition-colors duration-200">
        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-slate-400">Loading proof submissions...</div>
        ) : filteredMedia.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-slate-500 dark:text-slate-400">
            No media submissions found under "{statusFilter}".
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 dark:bg-bgmi-dark text-slate-700 dark:text-slate-400 font-display font-bold uppercase text-[10px] border-b border-slate-200 dark:border-bgmi-border">
              <tr>
                <th className="p-4">Media Preview & Title</th>
                <th className="p-4">Type</th>
                <th className="p-4">Team / Player</th>
                <th className="p-4">Match</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-bgmi-border/40">
              {filteredMedia.map((m) => {
                const mId = m.id || m._id;
                const previewImg = m.imageUrl || m.thumbnail || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80';

                return (
                  <tr key={mId} className="hover:bg-slate-50 dark:hover:bg-bgmi-dark/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={previewImg} alt={m.title} className="w-14 h-10 object-cover rounded border border-slate-300 dark:border-bgmi-border" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{m.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {mId?.substring(0, 8)}...</span>
                      </div>
                    </td>
                    <td className="p-4"><Badge variant="default" size="sm">{m.type || 'Screenshot'}</Badge></td>
                    <td className="p-4 text-slate-800 dark:text-slate-300">
                      <p className="font-bold text-slate-900 dark:text-white">{m.team}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{m.player}</p>
                    </td>
                    <td className="p-4 text-amber-600 dark:text-bgmi-gold font-bold font-mono">{m.match}</td>
                    <td className="p-4">
                      <Badge variant={m.status === 'Published' ? 'green' : m.status === 'Rejected' ? 'rejected' : 'pending'} size="sm">
                        {m.status || 'Pending Review'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <Button variant="secondary" size="sm" icon={Eye} onClick={() => setSelectedItem(m)}>
                        Preview
                      </Button>
                      {m.status !== 'Published' && (
                        <Button variant="primary" size="sm" icon={Check} onClick={() => handleUpdateStatus(m, 'Published')}>
                          Approve & Publish
                        </Button>
                      )}
                      {m.status !== 'Rejected' && (
                        <Button variant="danger" size="sm" icon={X} onClick={() => handleUpdateStatus(m, 'Rejected')}>
                          Reject
                        </Button>
                      )}
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

