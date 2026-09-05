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
    <div className="space-y-6 max-w-full overflow-hidden font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E7E3DA] dark:border-[#1E2638] pb-5">
        <div>
          <span className="text-[10px] font-mono text-bgmi-red font-bold uppercase tracking-widest block">
            /// OFFICIAL COMMUNICATIONS
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2.5 mt-1">
            <Bell className="w-6 h-6 text-amber-600 dark:text-bgmi-gold" /> 
            Bulletins &amp; News Manager
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-normal mt-1">
            Publish broadcast bulletins, schedule advisories, and tournament status updates.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add Announcement
        </Button>
      </div>

      {/* ANNOUNCEMENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl p-5 sm:p-6 space-y-3 shadow-editorial-sm transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="gold" size="sm">{ann.category}</Badge>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold uppercase">{ann.date}</span>
              </div>

              <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">{ann.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">{ann.content}</p>
            </div>

            <div className="pt-3 border-t border-[#E7E3DA] dark:border-[#1E2638] flex justify-end">
              <button
                onClick={() => handleDelete(ann.id)}
                className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1 font-display font-bold uppercase tracking-wider"
              >
                <Trash2 className="w-3.5 h-3.5" /> 
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Official Bulletin" maxWidth="max-w-md">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 uppercase">Bulletin Headline Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Lobby credentials for Match #07 dispatched"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-lg text-slate-900 dark:text-white font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 uppercase">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-lg text-slate-900 dark:text-white font-bold"
            >
              <option value="Schedule">Schedule</option>
              <option value="Registration">Registration</option>
              <option value="Results">Results</option>
              <option value="Rules">Rules</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 uppercase">Bulletin Body Content</label>
            <textarea
              rows={4}
              required
              placeholder="Enter announcement details..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-lg text-slate-900 dark:text-white font-medium"
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
