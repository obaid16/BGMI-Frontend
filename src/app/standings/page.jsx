'use client';

import React, { useState, useEffect } from 'react';
import StandingRow from '@/components/tournament/StandingRow';
import RankingCard from '@/components/tournament/RankingCard';
import { SkeletonTableRow } from '@/components/common/Skeleton';
import { getStandings, getScoringRules } from '@/services/api';
import { Trophy, Flame, ShieldAlert, Award, Calculator, Info } from 'lucide-react';

export default function StandingsPage() {
  const [standings, setStandings] = useState([]);
  const [rules, setRules] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStandingsData() {
      setLoading(true);
      const data = await getStandings();
      const ruleData = await getScoringRules();
      setStandings(data);
      setRules(ruleData);
      setLoading(false);
    }
    fetchStandingsData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* PAGE HEADER */}
      <div className="border-b border-bgmi-border/60 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-bgmi-gold/10 border border-bgmi-gold/40 text-bgmi-gold font-bold text-xs rounded-full">
          <Award className="w-3.5 h-3.5" /> OFFICIAL LEADERBOARD 2026
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-wide flex items-center gap-3">
          <Trophy className="w-10 h-10 text-bgmi-gold" /> Tournament Standings
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Live point standings based on Placement Points + Finish Kills across all completed custom lobby matches.
        </p>
      </div>

      {/* TOP 3 HIGHLIGHT CAROUSEL / PODIUM PREVIEW */}
      {standings.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rank 2 */}
          <div className="order-2 md:order-1 bg-bgmi-surface/90 border border-slate-400/50 rounded-2xl p-6 clip-tactical flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-slate-300 text-slate-950 font-black flex items-center justify-center text-base">
              #2
            </div>
            <img src={standings[1].logo} alt={standings[1].teamName} className="w-16 h-16 rounded-xl border border-slate-400 object-cover" />
            <div>
              <h3 className="font-display font-black text-lg text-white">{standings[1].teamName}</h3>
              <p className="text-xs text-slate-400">{standings[1].college}</p>
            </div>
            <div className="font-display font-black text-2xl text-slate-200">{standings[1].totalPoints} PTS</div>
          </div>

          {/* Rank 1 - GOLD PODIUM */}
          <div className="order-1 md:order-2 bg-gradient-to-b from-bgmi-gold/20 via-bgmi-surface to-bgmi-surface border-2 border-bgmi-gold rounded-2xl p-8 clip-tactical flex flex-col items-center text-center space-y-4 shadow-gold-glow transform md:-translate-y-4">
            <div className="w-12 h-12 rounded-full bg-bgmi-gold text-slate-950 font-black flex items-center justify-center text-xl shadow-gold-glow">
              #1
            </div>
            <img src={standings[0].logo} alt={standings[0].teamName} className="w-20 h-20 rounded-xl border-2 border-bgmi-gold object-cover shadow-lg" />
            <div>
              <span className="text-[10px] font-bold text-bgmi-gold uppercase tracking-widest">LEADERBOARD LEADERS</span>
              <h3 className="font-display font-black text-2xl text-white">{standings[0].teamName}</h3>
              <p className="text-xs text-slate-300 font-semibold">{standings[0].college}</p>
            </div>
            <div className="font-display font-black text-4xl text-bgmi-gold">{standings[0].totalPoints} PTS</div>
          </div>

          {/* Rank 3 */}
          <div className="order-3 bg-bgmi-surface/90 border border-amber-700/50 rounded-2xl p-6 clip-tactical flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-amber-700 text-white font-black flex items-center justify-center text-base">
              #3
            </div>
            <img src={standings[2].logo} alt={standings[2].teamName} className="w-16 h-16 rounded-xl border border-amber-700 object-cover" />
            <div>
              <h3 className="font-display font-black text-lg text-white">{standings[2].teamName}</h3>
              <p className="text-xs text-slate-400">{standings[2].college}</p>
            </div>
            <div className="font-display font-black text-2xl text-amber-500">{standings[2].totalPoints} PTS</div>
          </div>
        </div>
      )}

      {/* DESKTOP FULL TABLE VIEW */}
      <div className="hidden lg:block space-y-4">
        <div className="overflow-x-auto bg-bgmi-surface border border-bgmi-border rounded-2xl shadow-2xl clip-tactical">
          <table className="w-full text-left border-collapse">
            <thead className="bg-bgmi-dark/95 text-slate-400 font-display font-black text-xs uppercase tracking-wider border-b border-bgmi-border">
              <tr>
                <th className="py-4 px-4 text-center">Rank</th>
                <th className="py-4 px-4">Squad Name & College</th>
                <th className="py-4 px-4 text-center">Matches</th>
                <th className="py-4 px-4 text-center">WWCD</th>
                <th className="py-4 px-4 text-center">Placement Pts</th>
                <th className="py-4 px-4 text-center">Kill Pts</th>
                <th className="py-4 px-4 text-center">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonTableRow key={i} />)
              ) : standings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold text-xs tracking-wider uppercase">
                    No Standings Data Yet — Standings Will Update After Matches Are Completed
                  </td>
                </tr>
              ) : (
                standings.map((standing) => (
                  <StandingRow key={standing.teamId} standing={standing} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE COMPACT CARDS VIEW (PREVENTS BAD TABLE OVERFLOW) */}
      <div className="lg:hidden space-y-4">
        <h3 className="font-display font-bold text-sm text-slate-400 uppercase tracking-wider">
          Mobile Leaderboard Roster
        </h3>
        <div className="space-y-3">
          {standings.length === 0 ? (
            <p className="text-slate-400 text-xs py-4 text-center">No standings data recorded yet.</p>
          ) : (
            standings.map((standing) => (
              <RankingCard key={standing.teamId} standing={standing} />
            ))
          )}
        </div>
      </div>

      {/* INTERACTIVE SCORING BREAKDOWN EXPLANATION CARD */}
      <section className="bg-bgmi-surface border border-bgmi-border rounded-2xl p-6 sm:p-8 clip-tactical space-y-6">
        <div className="flex items-center gap-3 border-b border-bgmi-border/60 pb-4">
          <div className="w-10 h-10 rounded-xl bg-bgmi-gold/15 border border-bgmi-gold text-bgmi-gold flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-white uppercase tracking-wide">
              Official Scoring Formula System
            </h2>
            <p className="text-xs text-slate-400">How leaderboard points are computed after every match</p>
          </div>
        </div>

        <div className="p-4 bg-bgmi-dark rounded-xl border border-bgmi-gold/30 text-center font-display font-black text-sm sm:text-base text-bgmi-gold tracking-wide">
          TOTAL POINTS = PLACEMENT POINTS + KILL POINTS (1 PT PER KILL)
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 text-center text-xs">
          {rules?.placementPoints?.map((p, idx) => (
            <div key={idx} className="p-3 bg-bgmi-dark/70 rounded-lg border border-bgmi-border/40 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block uppercase"># {p.rank} Place</span>
              <span className="font-display font-black text-base text-white">{p.points} PTS</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
