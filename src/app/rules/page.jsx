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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* HEADER */}
      <div className="border-b border-bgmi-border/60 dark:border-bgmi-border/60 light:border-slate-200 pb-6 space-y-2 text-center sm:text-left">
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white dark:text-white light:text-slate-900 uppercase tracking-wide flex items-center justify-center sm:justify-start gap-3">
          <BookOpen className="w-9 h-9 sm:w-11 sm:h-11 text-bgmi-red" /> Official Rulebook
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-2xl font-medium">
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
              className={`border rounded-xl clip-tactical overflow-hidden transition-all duration-300 ${
                isOpen
                  ? 'bg-bgmi-surface/90 dark:bg-bgmi-surface/90 light:bg-white border-bgmi-red/60 shadow-red-glow'
                  : 'bg-bgmi-surface/70 dark:bg-bgmi-surface/70 light:bg-white border-bgmi-border/80 dark:border-bgmi-border/80 light:border-slate-200 hover:border-bgmi-border'
              }`}
            >
              {/* ACCORDION HEADER TRIGGER */}
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-display font-bold text-base text-white dark:text-white light:text-slate-900 uppercase tracking-wider focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${isOpen ? 'bg-bgmi-red shadow-red-glow' : 'bg-slate-500'}`}></span>
                  <span>{rule.title}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-bgmi-red' : ''}`} />
              </button>

              {/* ACCORDION BODY */}
              {isOpen && (
                <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed border-t border-bgmi-border/60 dark:border-bgmi-border/60 light:border-slate-200 whitespace-pre-line animate-in fade-in duration-200">
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
