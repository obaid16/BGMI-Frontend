'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Hero from '@/components/tournament/Hero';
import TournamentStats from '@/components/tournament/TournamentStats';
import NextMatchCard from '@/components/tournament/NextMatchCard';
import Top3Leaderboard from '@/components/tournament/Top3Leaderboard';
import StandingRow from '@/components/tournament/StandingRow';
import RankingCard from '@/components/tournament/RankingCard';
import MatchCard from '@/components/tournament/MatchCard';
import MediaCard from '@/components/tournament/MediaCard';
import MediaLightbox from '@/components/tournament/MediaLightbox';
import { SkeletonGrid } from '@/components/common/Skeleton';
import { getMatches, getStandings, getResults, getMedia, getAnnouncements, getTeamById, getTeams } from '@/services/api';
import { Trophy, Swords, Flame, Video, ArrowRight, Crown, ShieldAlert } from 'lucide-react';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [nextMatch, setNextMatch] = useState(null);
  const [matchesList, setMatchesList] = useState([]);
  const [topStandings, setTopStandings] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [championTeam, setChampionTeam] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [teamsStats, setTeamsStats] = useState({
    registeredSquads: 24,
    verifiedPlayers: 96,
    totalMatches: 12,
    currentRound: 4
  });

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [matchesRes, standingsRes, resultsRes, mediaRes, annsRes, teamsRes] = await Promise.all([
          getMatches().catch(() => []),
          getStandings().catch(() => []),
          getResults().catch(() => []),
          getMedia('All', 'Published').catch(() => []),
          getAnnouncements ? getAnnouncements().catch(() => []) : Promise.resolve([]),
          getTeams().catch(() => [])
        ]);

        const matches = Array.isArray(matchesRes) && matchesRes.length > 0 ? matchesRes : [];
        const standings = Array.isArray(standingsRes) && standingsRes.length > 0 ? standingsRes : [];
        const results = Array.isArray(resultsRes) && resultsRes.length > 0 ? resultsRes : [];
        const media = Array.isArray(mediaRes) ? mediaRes : [];
        const teams = Array.isArray(teamsRes) ? teamsRes : [];

        const registered = teams.length > 0 ? teams.length : 24;
        const verified = teams.length > 0
          ? teams.reduce((acc, t) => acc + (t.players ? t.players.length : 0), 0)
          : 96;
        const totMatches = matches.length > 0 ? matches.length : 12;
        const currRound = matches.length > 0
          ? (matches.filter((m) => m && (m.status === 'Completed' || m.status === 'Live')).length || 1)
          : 4;

        setTeamsStats({
          registeredSquads: registered,
          verifiedPlayers: verified,
          totalMatches: totMatches,
          currentRound: currRound
        });

        setMatchesList(matches);
        setNextMatch(matches.find((m) => m && (m.status === 'Live' || m.status === 'Upcoming')) || matches[0] || null);
        setTopStandings(standings.slice(0, 5));
        setRecentResults(results.slice(0, 3));

        const publishedMediaOnly = media.filter((item) => item && (item.status === 'Published' || item.verified === true));
        setMediaItems(publishedMediaOnly.slice(0, 4));

        const isTournamentComplete = matches.length > 0 && !matches.some((m) => m && (m.status === 'Live' || m.status === 'Upcoming'));
        setIsComplete(isTournamentComplete);

        if (isTournamentComplete && standings.length > 0) {
          const topTeam = standings[0];
          const fullTeamDetails = await getTeamById(topTeam.teamId).catch(() => null);
          if (fullTeamDetails) {
            setChampionTeam({
              ...topTeam,
              players: fullTeamDetails.players
            });
          } else {
            setChampionTeam(topTeam);
          }
        }
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-20 overflow-x-hidden font-sans">
      
      {/* 1. ASYMMETRIC HERO SECTION */}
      <Hero />

      {/* 2. BROADCAST TELEMETRY TICKER STRIP (EDGE TO EDGE) */}
      <TournamentStats
        registeredSquads={teamsStats.registeredSquads}
        verifiedPlayers={teamsStats.verifiedPlayers}
        totalMatches={teamsStats.totalMatches}
        currentRound={teamsStats.currentRound}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* 3. GRAND CHAMPION CROWN STAGE */}
        {isComplete && championTeam && (
          <section className="relative bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 rounded-2xl p-8 clip-tactical shadow-2xl overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-950 text-amber-400 rounded-xl flex items-center justify-center font-black text-2xl shadow-xl">
                  <Crown className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-slate-950 text-amber-400 px-2.5 py-0.5 rounded">
                    OFFICIAL COLLEGE CHAMPION 2026
                  </span>
                  <h3 className="font-broadcast font-black text-3xl uppercase tracking-tight">
                    {championTeam.teamName}
                  </h3>
                </div>
              </div>
              <div className="font-mono text-right">
                <span className="font-broadcast font-black text-3xl text-slate-950 block">
                  {championTeam.totalPoints || championTeam.points || 0} PTS
                </span>
                <span className="text-xs font-bold text-slate-900">🍗 {championTeam.wwcd || 0} WWCD VICTORIES</span>
              </div>
            </div>
          </section>
        )}

        {/* 4. BROADCAST MATCH SCOREBARS STACK */}
        <section className="space-y-6">
          <div className="border-b-2 border-bgmi-red pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-bgmi-red font-bold uppercase tracking-widest block">
                /// LIVE MATCH SCHEDULE & SCOREBOARDS
              </span>
              <h2 className="font-broadcast font-black text-2xl sm:text-4xl text-slate-900 dark:text-white uppercase tracking-tight">
                MATCH SCOREBARS
              </h2>
            </div>
            <Link
              href="/matches"
              className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-broadcast font-bold text-xs uppercase tracking-wider clip-technical-btn hover:bg-bgmi-red transition-colors flex items-center gap-1"
            >
              <span>SCHEDULE & LOBBIES</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* HORIZONTAL MATCH STRIPIFIED SCHEDULE */}
          <div className="space-y-3">
            {matchesList.slice(0, 3).map((m) => (
              <MatchCard key={m.id || m.matchNumber} match={{ ...m, registeredSquadsCount: teamsStats.registeredSquads }} />
            ))}
          </div>
        </section>

        {/* 5. TOP 3 PODIUM & SCOREBOARD TABLE */}
        <section className="space-y-6">
          <div className="border-b-2 border-amber-500 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-widest block">
                /// OFFICIAL TOURNAMENT RANKINGS
              </span>
              <h2 className="font-broadcast font-black text-2xl sm:text-4xl text-slate-900 dark:text-white uppercase tracking-tight">
                STANDINGS SCOREBOARD
              </h2>
            </div>
            <Link
              href="/standings"
              className="px-4 py-2 bg-amber-500 text-slate-950 font-broadcast font-black text-xs uppercase tracking-wider clip-technical-btn hover:bg-amber-400 transition-colors flex items-center gap-1"
            >
              <span>FULL STANDINGS MATRIX</span>
              <Trophy className="w-4 h-4" />
            </Link>
          </div>

          {/* PODIUM ARENA */}
          <Top3Leaderboard standings={topStandings} />

          {/* DESKTOP SCOREBOARD TABLE */}
          <div className="hidden md:block overflow-x-auto bg-white dark:bg-[#121620] border-2 border-slate-200 dark:border-white/10 rounded-2xl shadow-xl clip-tactical">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead className="bg-slate-900 text-white font-broadcast font-black uppercase text-xs">
                <tr>
                  <th className="py-3 px-4 text-center">RANK</th>
                  <th className="py-3 px-4">SQUAD NAME</th>
                  <th className="py-3 px-4 text-center">PLAYED</th>
                  <th className="py-3 px-4 text-center">WWCD</th>
                  <th className="py-3 px-4 text-center">PLACEMENT</th>
                  <th className="py-3 px-4 text-center">KILLS</th>
                  <th className="py-3 px-4 text-center">TOTAL PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {topStandings.map((standing) => (
                  <StandingRow key={standing.teamId || standing.rank} standing={standing} />
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE RANKING CARDS */}
          <div className="md:hidden space-y-3">
            {topStandings.map((standing) => (
              <RankingCard key={standing.teamId || standing.rank} standing={standing} />
            ))}
          </div>
        </section>

        {/* 6. MASONRY MEDIA GALLERY */}
        <section className="space-y-6">
          <div className="border-b-2 border-sky-500 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-sky-400 font-bold uppercase tracking-widest block">
                /// PLAYER POVs & REPLAY HIGHLIGHTS
              </span>
              <h2 className="font-broadcast font-black text-2xl sm:text-4xl text-slate-900 dark:text-white uppercase tracking-tight">
                MEDIA GALLERY
              </h2>
            </div>
            <Link
              href="/media"
              className="px-4 py-2 bg-sky-500 text-slate-950 font-broadcast font-black text-xs uppercase tracking-wider clip-technical-btn hover:bg-sky-400 transition-colors flex items-center gap-1"
            >
              <span>ALL MEDIA POVS</span>
              <Video className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaItems.map((item) => (
              <MediaCard key={item.id} item={item} onClick={(selected) => setSelectedMedia(selected)} />
            ))}
          </div>
        </section>

      </div>

      {/* MEDIA LIGHTBOX MODAL */}
      <MediaLightbox
        item={selectedMedia}
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
      />
    </div>
  );
}
