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
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    async function loadData() {
      const data = await getMedia();
      setMediaList(data);
    }
    loadData();
  }, []);

  const handleUpdateStatus = async (mediaId, status) => {
    await updateMediaStatus(mediaId, status);
    setMediaList((prev) =>
      prev.map((m) =>
        m.id === mediaId ? { ...m, status, verified: status === 'Published' || status === 'Verified' } : m
      )
    );
    showToast(`Media ${status} successfully!`, 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="border-b border-bgmi-border/60 pb-4">
        <h1 className="font-display font-black text-2xl text-white uppercase tracking-wide flex items-center gap-2">
          <Video className="w-6 h-6 text-bgmi-cyan" /> Uploaded Media Verification Queue
        </h1>
        <p className="text-xs text-slate-400">Verify player POV clips and match screenshots before publishing to public gallery.</p>
      </div>

      {/* MEDIA TABLE */}
      <div className="bg-bgmi-surface border border-bgmi-border rounded-xl overflow-hidden clip-tactical shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-bgmi-dark text-slate-400 font-display font-bold uppercase text-[10px] border-b border-bgmi-border">
            <tr>
              <th className="p-4">Media Preview & Title</th>
              <th className="p-4">Type</th>
              <th className="p-4">Team / Player</th>
              <th className="p-4">Match</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bgmi-border/40">
            {mediaList.map((m) => (
              <tr key={m.id} className="hover:bg-bgmi-dark/40 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <img src={m.thumbnail} alt={m.title} className="w-12 h-8 object-cover rounded border border-bgmi-border" />
                  <span className="font-bold text-white line-clamp-1">{m.title}</span>
                </td>
                <td className="p-4"><Badge variant="default" size="sm">{m.type}</Badge></td>
                <td className="p-4 text-slate-300">
                  <p className="font-bold">{m.team}</p>
                  <p className="text-[10px] text-slate-400">{m.player}</p>
                </td>
                <td className="p-4 text-bgmi-gold font-bold">{m.match}</td>
                <td className="p-4">
                  <Badge variant={m.status === 'Published' ? 'green' : m.status === 'Rejected' ? 'rejected' : 'pending'} size="sm">
                    {m.status}
                  </Badge>
                </td>
                <td className="p-4 text-right space-x-1">
                  <Button variant="secondary" size="sm" icon={Eye} onClick={() => setSelectedItem(m)}>
                    Preview
                  </Button>
                  <Button variant="primary" size="sm" icon={Check} onClick={() => handleUpdateStatus(m.id, 'Published')}>
                    Verify
                  </Button>
                  <Button variant="danger" size="sm" icon={X} onClick={() => handleUpdateStatus(m.id, 'Rejected')}>
                    Reject
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LIGHTBOX MODAL */}
      <MediaLightbox item={selectedItem} isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
