'use client';

import React from 'react';
import { Crown } from 'lucide-react';

export default function Top3Leaderboard({ standings = [] }) {
  const top3 = standings.slice(0, 3);
  if (top3.length === 0) return null;

  const [first, second, third] = [
    top3[0] || null,
    top3[1] || null,
    top3[2] || null
  ];

  return (
    <div className="w-full space-y-6 my-6">
      
      {/* #1 GOLD CHAMPION FULL-WIDTH FEATURE BANNER */}
      {first && (
        <div className="relative bg-premium-champagne/10 text-premium-text border border-premium-champagne/30 rounded-[24px] p-6 sm:p-10 shadow-sm overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left w-full md:w-auto">
            
            <div className="w-24 h-24 rounded-2xl bg-white border border-premium-champagne/50 shadow-premium-soft flex items-center justify-center flex-shrink-0 relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-premium-champagne text-premium-text rounded-xl flex items-center justify-center font-bold shadow-sm">
                <Crown className="w-4 h-4 text-white" />
              </div>
              {first.logo ? (
                <img src={first.logo} alt={first.teamName} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span className="font-bold text-3xl text-premium-text-secondary">{first.teamName?.charAt(0)}</span>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block mb-1">
                Current Leader
              </span>
              <h3 className="font-bold text-3xl sm:text-4xl tracking-tight text-premium-text">
                {first.teamName}
              </h3>
              <p className="text-sm font-medium text-premium-text-secondary">{first.collegeName || 'NEXCORE BGMI ROSTER'}</p>
            </div>
          </div>

          {/* STATS BREAKDOWN */}
          <div className="flex items-center gap-6 bg-white p-5 rounded-2xl border border-premium-border shadow-sm text-center w-full md:w-auto justify-center">
            <div className="px-2">
              <span className="text-[10px] text-premium-text-secondary block font-semibold uppercase tracking-widest">WWCD</span>
              <span className="font-bold text-premium-text text-xl"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1 text-amber-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg> {first.wwcd || 0}</span>
            </div>
            <div className="w-[1px] h-10 bg-premium-border" />
            <div className="px-2">
              <span className="text-[10px] text-premium-text-secondary block font-semibold uppercase tracking-widest">Kills</span>
              <span className="font-bold text-premium-text text-xl">{first.kills || first.killPoints || 0}</span>
            </div>
            <div className="w-[1px] h-10 bg-premium-border" />
            <div className="px-2">
              <span className="text-[10px] text-premium-text-secondary block font-semibold uppercase tracking-widest">Total Pts</span>
              <span className="font-bold text-premium-sage text-2xl">{first.totalPoints !== undefined ? first.totalPoints : first.points || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* #2 SILVER & #3 BRONZE SPLIT CONTENDER CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* #2 SILVER */}
        {second && (
          <div className="bg-premium-surface border border-premium-border rounded-[20px] p-6 shadow-sm flex items-center justify-between gap-4 transition-transform hover:-translate-y-0.5">
            <div className="flex items-center gap-5">
              <span className="font-bold text-2xl text-slate-400">
                #2
              </span>
              <div>
                <span className="text-[10px] font-semibold text-premium-text-secondary uppercase tracking-widest block">Runner Up</span>
                <h4 className="font-bold text-lg text-premium-text">
                  {second.teamName}
                </h4>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-xl text-premium-text block">
                {second.totalPoints !== undefined ? second.totalPoints : second.points || 0} pts
              </span>
              <span className="text-[11px] text-premium-text-secondary font-medium"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1 text-amber-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg> {second.wwcd || 0} WWCD</span>
            </div>
          </div>
        )}

        {/* #3 BRONZE */}
        {third && (
          <div className="bg-premium-surface border border-premium-border rounded-[20px] p-6 shadow-sm flex items-center justify-between gap-4 transition-transform hover:-translate-y-0.5">
            <div className="flex items-center gap-5">
              <span className="font-bold text-2xl text-amber-700/60">
                #3
              </span>
              <div>
                <span className="text-[10px] font-semibold text-premium-text-secondary uppercase tracking-widest block">Third Place</span>
                <h4 className="font-bold text-lg text-premium-text">
                  {third.teamName}
                </h4>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-xl text-premium-text block">
                {third.totalPoints !== undefined ? third.totalPoints : third.points || 0} pts
              </span>
              <span className="text-[11px] text-premium-text-secondary font-medium"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1 text-amber-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg> {third.wwcd || 0} WWCD</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
