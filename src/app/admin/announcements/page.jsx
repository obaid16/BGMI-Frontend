'use client';

import React, { useState, useEffect } from 'react';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Bell, Plus, Trash2 } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const { showToast } = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Schedule');
  const [priority, setPriority] = useState('High');

  useEffect(() => {
    async function loadData() {
      const data = await getAnnouncements();
      setAnnouncements(data);
    }
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const created = await createAnnouncement({ title, content, category, priority });
    setAnnouncements([created, ...announcements]);
    showToast('Announcement Published Live!', 'success');
    setIsModalOpen(false);
    setTitle('');
    setContent('');
  };

  const handleDelete = async (id) => {
    const success = await deleteAnnouncement(id);
    if (success) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      showToast('Announcement Removed', 'info');
    } else {
      showToast('Failed to remove announcement', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-bgmi-border/60 pb-4">
        <div>
          <h1 className="font-display font-black text-2xl text-white uppercase tracking-wide flex items-center gap-2">
            <Bell className="w-6 h-6 text-bgmi-gold" /> Official Bulletins & News Manager
          </h1>
          <p className="text-xs text-slate-400">Post tournament updates, registration reminders, and lobby schedule bulletins.</p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add New Announcement
        </Button>
      </div>

      {/* ANNOUNCEMENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-bgmi-surface border border-bgmi-border rounded-xl p-5 clip-tactical space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="gold" size="sm">{ann.category}</Badge>
              <span className="text-[10px] text-slate-400 font-bold uppercase">{ann.date}</span>
            </div>

            <h3 className="font-display font-bold text-base text-white">{ann.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>

            <div className="pt-3 border-t border-bgmi-border/40 flex justify-end">
              <button
                onClick={() => handleDelete(ann.id)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-bold"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Official Bulletin" maxWidth="max-w-md">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase">Bulletin Headline Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Lobby credentials for Match #07 dispatched"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-bgmi-dark border border-bgmi-border rounded-lg text-white font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 bg-bgmi-dark border border-bgmi-border rounded-lg text-white font-bold"
            >
              <option value="Schedule">Schedule</option>
              <option value="Registration">Registration</option>
              <option value="Results">Results</option>
              <option value="Rules">Rules</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase">Bulletin Body Content</label>
            <textarea
              rows={4}
              required
              placeholder="Enter announcement details..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2.5 bg-bgmi-dark border border-bgmi-border rounded-lg text-white font-medium"
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="secondary" size="md" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Publish Live
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
