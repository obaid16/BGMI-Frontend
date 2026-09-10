'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { getRules, createRule, deleteRule } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { BookOpen, Plus, Trash2 } from 'lucide-react';

export default function AdminRulesPage() {
  const { showToast } = useToast();
  const [rules, setRules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');

  useEffect(() => {
    async function loadData() {
      const data = await getRules();
      setRules(data);
    }
    loadData();
  }, []);

  const handleAddRule = async (e) => {
    e.preventDefault();
    const rulePayload = {
      title: `${rules.length + 1}. ${title}`,
      category,
      content,
      order: rules.length + 1,
      published: true
    };
    const created = await createRule(rulePayload);
    if (created) {
      setRules([...rules, created]);
      showToast('Rule Added to Official Rulebook', 'success');
    } else {
      showToast('Failed to add rule to backend', 'error');
    }
    setIsModalOpen(false);
    setTitle('');
    setContent('');
  };

  const handleDeleteRule = async (id) => {
    const success = await deleteRule(id);
    if (success) {
      setRules((prev) => prev.filter((r) => r.id !== id));
      showToast('Rule Removed', 'info');
    } else {
      showToast('Failed to remove rule from backend', 'error');
    }
  };

  return (
    <div className="space-y-8 max-w-full overflow-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-premium-border pb-6">
        <div>
          <h1 className="font-bold text-3xl text-premium-text tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-amber-600" /> Rulebook Manager
          </h1>
          <p className="text-sm text-premium-text-secondary font-medium mt-2">Edit, add, or reorder tournament rules and anti-cheat policies.</p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add New Rule
        </Button>
      </div>

      {/* RULES LIST */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-premium-surface border border-premium-border rounded-[20px] p-6 space-y-3 shadow-sm hover:border-premium-text/20 transition-all">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-bold text-lg text-premium-text">{rule.title}</h3>
              <button
                onClick={() => handleDeleteRule(rule.id)}
                className="w-9 h-9 flex items-center justify-center shrink-0 rounded-[10px] text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors shadow-sm"
                title="Remove Rule"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-premium-text-secondary leading-relaxed whitespace-pre-line font-medium pr-12">{rule.content}</p>
          </div>
        ))}
        {rules.length === 0 && (
          <div className="text-center py-16 bg-premium-surface border border-premium-border rounded-[24px]">
            <p className="text-sm font-bold text-premium-text-secondary">No rules established yet.</p>
          </div>
        )}
      </div>

      {/* CREATE RULE MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Tournament Rule" maxWidth="max-w-xl">
        <form onSubmit={handleAddRule} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">Rule Heading</label>
            <input
              type="text"
              required
              placeholder="e.g. Device Restrictions & Emulator Bans"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-white border border-premium-border rounded-[12px] text-premium-text font-bold text-sm focus:outline-none focus:border-premium-text shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">Rule Body Text</label>
            <textarea
              rows={5}
              required
              placeholder="Enter rule guidelines..."
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
              Save Rule
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
