'use client';

import React, { useState, useEffect } from 'react';
import { getRules } from '@/services/api';
import { BookOpen, Printer, Download, FileText, ShieldCheck } from 'lucide-react';

export default function RulesPage() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRuleId, setActiveRuleId] = useState(null);

  useEffect(() => {
    async function fetchRules() {
      try {
        setLoading(true);
        const data = await getRules();
        setRules(data);
        if (data.length > 0) {
          setActiveRuleId(data[0].id || data[0]._id);
        }
      } catch (err) {
        console.error('Failed to load rules:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRules();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-8 h-8 rounded-full border-4 border-premium-border border-t-premium-text animate-spin mx-auto"></div>
        <p className="text-xs text-premium-text-secondary mt-4 font-semibold uppercase tracking-widest">Loading Tournament Guidelines...</p>
      </div>
    );
  }

  if (rules.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <BookOpen className="w-12 h-12 text-premium-text-secondary mx-auto opacity-50" />
        <h2 className="text-xl font-bold text-premium-text">No Rules Published Yet</h2>
        <p className="text-sm text-premium-text-secondary">Official tournament guidelines are being updated.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      
      {/* HEADER */}
      <div className="border-b border-premium-border pb-6 sm:pb-8 mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-premium-sage uppercase tracking-widest bg-premium-sage-soft px-3.5 py-1.5 rounded-full border border-premium-sage/30">
            <BookOpen className="w-4 h-4" /> Tournament Guidelines
          </div>
          <h1 className="font-bold text-3xl sm:text-5xl lg:text-6xl text-premium-text tracking-tight">
            Official Rulebook
          </h1>
          <p className="text-sm sm:text-base text-premium-text-secondary font-medium max-w-2xl leading-relaxed">
            Competitive guidelines, roster eligibility, scoring formulas, anti-cheat mandates, and tie-breaker policies for Championship 2026.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="/NIT_BGMI_Official_Rules.pdf"
            download="NIT_BGMI_Official_Rules.pdf"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Download PDF
          </a>

          <button 
            onClick={handlePrint}
            className="p-2.5 bg-premium-surface border border-premium-border rounded-xl text-premium-text hover:bg-premium-background transition-colors shadow-sm tooltip-trigger"
            aria-label="Print or Save PDF"
            title="Print Rulebook"
          >
            <Printer className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* DOWNLOAD HANDBOOK CALLOUT BANNER */}
      <div className="bg-gradient-to-r from-amber-50/70 via-white to-amber-50/30 border border-amber-200 rounded-[20px] p-5 sm:p-6 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 bg-amber-100 border border-amber-200 rounded-[14px] flex items-center justify-center text-amber-700 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-premium-text">NIT BGMI Official Rules & Regulations</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200">
                PDF
              </span>
            </div>
            <p className="text-xs text-premium-text-secondary mt-0.5 font-medium">
              Official 14-section tournament handbook (58 KB). Download and share with your team captains.
            </p>
          </div>
        </div>
        <a
          href="/NIT_BGMI_Official_Rules.pdf"
          download="NIT_BGMI_Official_Rules.pdf"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-premium-text hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm shrink-0"
        >
          <Download className="w-4 h-4" /> Download Rulebook
        </a>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start relative">
        {/* LEFT NAV (STICKY ON DESKTOP, SCROLLABLE ON MOBILE) */}
        <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-28">
          <div className="bg-premium-surface border border-premium-border rounded-[24px] p-6 shadow-sm overflow-x-auto lg:overflow-visible">
            <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0 pb-2 lg:pb-0 hide-scrollbar">
              {rules.map((rule) => {
                const id = rule.id || rule._id;
                const isActive = activeRuleId === id;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveRuleId(id);
                      document.getElementById(`rule-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`text-left px-5 py-3 rounded-[12px] font-bold text-sm transition-all whitespace-nowrap lg:whitespace-normal ${
                      isActive
                        ? 'bg-premium-text text-white shadow-premium-soft'
                        : 'text-premium-text hover:bg-premium-surface-soft hover:text-black'
                    }`}
                  >
                    {rule.title}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <div className="flex-1 space-y-16 pb-32">
          {rules.map((rule) => {
            const id = rule.id || rule._id;
            return (
              <section key={id} id={`rule-${id}`} className="scroll-mt-32">
                <h2 className="font-bold text-3xl text-premium-text tracking-tight mb-6 pb-4 border-b border-premium-border">
                  {rule.title}
                </h2>
                <div className="prose prose-sm sm:prose-base prose-neutral max-w-none text-premium-text-secondary leading-relaxed whitespace-pre-wrap">
                  {rule.content}
                </div>
              </section>
            );
          })}
        </div>
      </div>

    </div>
  );
}
