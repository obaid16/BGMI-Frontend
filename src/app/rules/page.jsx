'use client';

import React, { useState, useEffect } from 'react';
import { getRules } from '@/services/api';
import { BookOpen, ChevronDown, ShieldCheck, Scale, AlertTriangle } from 'lucide-react';

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
      <div className="border-b border-bgmi-border/60 pb-6 space-y-2 text-center sm:text-left">
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-wide flex items-center justify-center sm:justify-start gap-3">
          <BookOpen className="w-10 h-10 text-bgmi-gold" /> Official Tournament Rulebook
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Comprehensive competitive guidelines, roster eligibility, point system rules, anti-cheat mandates, and dispute procedures for Championship 2026.
        </p>
      </div>

      {/* ACCORDION CONTAINER */}
      <div className="space-y-4">
        {rules.map((rule, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={rule.id}
              className={`border rounded-xl clip-tactical overflow-hidden transition-all duration-300 ${
                isOpen
                  ? 'bg-bgmi-surface border-bgmi-gold/60 shadow-gold-glow'
                  : 'bg-bgmi-surface/60 border-bgmi-border/60 hover:border-bgmi-border'
              }`}
            >
              {/* ACCORDION HEADER TRIGGER */}
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-display font-bold text-base text-white uppercase tracking-wider focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-bgmi-gold shadow-gold-glow' : 'bg-slate-500'}`}></span>
                  <span>{rule.title}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-bgmi-gold' : ''}`} />
              </button>

              {/* ACCORDION BODY */}
              {isOpen && (
                <div className="px-6 pb-6 pt-2 text-xs text-slate-300 leading-relaxed border-t border-bgmi-border/40 whitespace-pre-line animate-in fade-in duration-200">
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
