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
    <div className="space-y-8 max-w-full overflow-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-premium-border pb-6">
        <div>
          <h1 className="font-bold text-3xl text-premium-text tracking-tight flex items-center gap-3">
            <Bell className="w-8 h-8 text-amber-600" /> Announcements & News
          </h1>
          <p className="text-sm text-premium-text-secondary font-medium mt-2">Post tournament updates, registration reminders, and lobby schedule bulletins.</p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setIsModalOpen(true)}>
          New Announcement
        </Button>
      </div>

      {/* ANNOUNCEMENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-premium-surface border border-premium-border rounded-[24px] p-6 space-y-4 shadow-sm hover:shadow-md transition-all hover:border-premium-text/20 flex flex-col">
            <div className="flex items-center justify-between">
              <Badge variant="gold" size="sm">{ann.category}</Badge>
              <span className="text-[10px] text-premium-text-secondary font-bold uppercase tracking-widest">{ann.date}</span>
            </div>

            <h3 className="font-bold text-lg text-premium-text leading-tight">{ann.title}</h3>
            <p className="text-sm text-premium-text-secondary leading-relaxed font-medium flex-grow whitespace-pre-line">{ann.content}</p>

            <div className="pt-4 border-t border-premium-border flex justify-end">
              <button
                onClick={() => handleDelete(ann.id)}
                className="w-9 h-9 flex items-center justify-center rounded-[10px] text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors shadow-sm"
                title="Remove Announcement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 bg-premium-surface border border-premium-border rounded-[24px]">
            <p className="text-sm font-bold text-premium-text-secondary">No announcements published yet.</p>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Official Bulletin" maxWidth="max-w-md">
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">Bulletin Headline</label>
            <input
              type="text"
              required
              placeholder="e.g. Match #07 Lobby details updated"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-white border border-premium-border rounded-[12px] text-premium-text font-bold text-sm focus:outline-none focus:border-premium-text shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 bg-white border border-premium-border rounded-[12px] text-premium-text font-bold text-sm focus:outline-none focus:border-premium-text shadow-sm appearance-none cursor-pointer"
            >
              <option value="Schedule">Schedule</option>
              <option value="Registration">Registration</option>
              <option value="Results">Results</option>
              <option value="Rules">Rules</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">Bulletin Content</label>
            <textarea
              rows={5}
              required
              placeholder="Enter announcement details..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 bg-white border border-premium-border rounded-[12px] text-premium-text font-medium text-sm focus:outline-none focus:border-premium-text shadow-sm resize-y custom-scrollbar"
            ></textarea>
          </div>

          <div className="pt-6 border-t border-premium-border flex justify-end gap-3">
            <Button variant="outline" size="md" onClick={() => setIsModalOpen(false)}>
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
