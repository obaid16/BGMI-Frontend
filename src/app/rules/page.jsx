'use client';

import React, { useState, useEffect } from 'react';
import { getRules } from '@/services/api';
import { BookOpen, ChevronDown } from 'lucide-react';

export default function RulesPage() {
  const [rules, setRules] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    async function fetchRules() {
      const data = await getRules();
      setRules(data);
    }
    fetchRules();
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-sans">
      
      {/* HEADER */}
      <div className="border-b border-[#E7E3DA] dark:border-[#1E2638] pb-6 space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 text-bgmi-red font-mono font-bold text-xs rounded-full">
          TOURNAMENT DIRECTIVE
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 dark:text-white uppercase tracking-tight flex items-center justify-center sm:justify-start gap-3">
          <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-bgmi-red" /> Official Rulebook
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl font-normal">
          Competitive guidelines, roster eligibility, scoring formulas, anti-cheat mandates, and tie-breaker policies for Championship 2026.
        </p>
      </div>

      {/* ACCORDION CONTAINER */}
      <div className="space-y-4">
        {rules.map((rule, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={rule.id || rule._id || idx}
              className={`border rounded-3xl overflow-hidden transition-all duration-200 ${
                isOpen
                  ? 'bg-white dark:bg-[#121620] border-slate-400 dark:border-white/20 shadow-editorial'
                  : 'bg-white dark:bg-[#121620] border-[#E7E3DA] dark:border-[#1E2638] hover:border-slate-300 dark:hover:border-white/10 shadow-editorial-sm'
              }`}
            >
              {/* ACCORDION HEADER TRIGGER */}
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-display font-bold text-base text-slate-900 dark:text-white uppercase tracking-wide focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${isOpen ? 'bg-bgmi-red' : 'bg-slate-300 dark:bg-slate-600'}`} />
                  <span>{rule.title}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-bgmi-red' : ''}`} />
              </button>

              {/* ACCORDION BODY */}
              {isOpen && (
                <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-[#E7E3DA] dark:border-[#1E2638] whitespace-pre-line font-normal">
                  {rule.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
