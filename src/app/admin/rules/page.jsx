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
    <div className="space-y-6 max-w-full overflow-hidden font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E7E3DA] dark:border-[#1E2638] pb-5">
        <div>
          <span className="text-[10px] font-mono text-bgmi-red font-bold uppercase tracking-widest block">
            /// RULEBOOK & POLICIES
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2.5 mt-1">
            <BookOpen className="w-6 h-6 text-amber-600 dark:text-bgmi-gold" /> 
            Official Rulebook Manager
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-normal mt-1">
            Edit, publish, or remove official tournament handbook sections and competitive guidelines.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add Rule Section
        </Button>
      </div>

      {/* RULES LIST */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl p-5 sm:p-6 space-y-3 shadow-editorial-sm transition-all">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">{rule.title}</h3>
              <button
                onClick={() => handleDeleteRule(rule.id)}
                className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1 font-display font-bold uppercase tracking-wider"
              >
                <Trash2 className="w-3.5 h-3.5" /> 
                <span>Remove</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line font-normal">{rule.content}</p>
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
