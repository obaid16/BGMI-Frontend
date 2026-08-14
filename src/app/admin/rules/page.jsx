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
    <div className="space-y-6 max-w-full overflow-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-bgmi-border/60 pb-4">
        <div>
          <h1 className="font-display font-black text-2xl text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-600 dark:text-bgmi-gold" /> Official Rulebook Manager
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Edit, add, or reorder tournament rules and anti-cheat policies.</p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add New Rule Section
        </Button>
      </div>

      {/* RULES LIST */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-white dark:bg-bgmi-surface border border-slate-200 dark:border-bgmi-border rounded-xl p-5 clip-tactical space-y-2 shadow-md dark:shadow-xl transition-colors duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">{rule.title}</h3>
              <button
                onClick={() => handleDeleteRule(rule.id)}
                className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1 font-bold"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium">{rule.content}</p>
          </div>
        ))}
      </div>

      {/* CREATE RULE MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Tournament Rule" maxWidth="max-w-md">
        <form onSubmit={handleAddRule} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 uppercase">Rule Heading</label>
            <input
              type="text"
              required
              placeholder="e.g. Device Restrictions & Emulator Bans"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-lg text-slate-900 dark:text-white font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 uppercase">Rule Body Text</label>
            <textarea
              rows={4}
              required
              placeholder="Enter rule guidelines..."
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
              Save Rule
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
