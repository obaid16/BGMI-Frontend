'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Hero from '@/components/tournament/Hero';
import TournamentStats from '@/components/tournament/TournamentStats';
import Top3Leaderboard from '@/components/tournament/Top3Leaderboard';
import StandingRow from '@/components/tournament/StandingRow';
import RankingCard from '@/components/tournament/RankingCard';
import MatchCard from '@/components/tournament/MatchCard';
import MediaCard from '@/components/tournament/MediaCard';
import MediaLightbox from '@/components/tournament/MediaLightbox';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonGrid } from '@/components/common/Skeleton';
import { getMatches, getStandings, getResults, getMedia, getAnnouncements, getTeamById, getTeams } from '@/services/api';
import { Trophy, Swords, Video, ArrowRight, Crown } from 'lucide-react';

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
    registeredSquads: 0,
    verifiedPlayers: 0,
    totalMatches: 0,
    currentRound: 0
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

        const matches = Array.isArray(matchesRes) ? matchesRes : [];
        const standings = Array.isArray(standingsRes) ? standingsRes : [];
        const results = Array.isArray(resultsRes) ? resultsRes : [];
        const media = Array.isArray(mediaRes) ? mediaRes : [];
        const teams = Array.isArray(teamsRes) ? teamsRes : [];

        const registered = teams.length;
        const verified = teams.reduce((acc, t) => acc + (t.players ? t.players.length : 0), 0);
        const totMatches = matches.length;
        const currRound = matches.length > 0
          ? (matches.filter((m) => m && (m.status === 'Completed' || m.status === 'Live')).length || 1)
          : 0;

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
    <div className="space-y-12 sm:space-y-16 pb-20 overflow-x-hidden font-sans">
      
      {/* 1. ASYMMETRIC EDITORIAL HERO */}
      <Hero nextMatch={nextMatch} registeredSquads={teamsStats.registeredSquads} />

      {/* 2. BROADCAST TELEMETRY STATS CARD */}
      <TournamentStats
        registeredSquads={teamsStats.registeredSquads}
        verifiedPlayers={teamsStats.verifiedPlayers}
        totalMatches={teamsStats.totalMatches}
        currentRound={teamsStats.currentRound}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* 3. GRAND CHAMPION CROWN STAGE (IF COMPLETED) */}
        {isComplete && championTeam && (
          <motion.section 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 rounded-3xl p-6 sm:p-8 shadow-editorial-lg overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-950 text-amber-400 rounded-2xl flex items-center justify-center font-black text-2xl shadow-editorial">
                  <Crown className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-slate-950 text-amber-400 px-3 py-0.5 rounded-full">
                    OFFICIAL COLLEGE CHAMPION 2026
                  </span>
                  <h3 className="font-display font-black text-3xl uppercase tracking-tight mt-1">
                    {championTeam.teamName}
                  </h3>
                </div>
              </div>
              <div className="font-mono text-right">
                <span className="font-display font-black text-3xl text-slate-950 block">
                  {championTeam.totalPoints || championTeam.points || 0} PTS
                </span>
                <span className="text-xs font-bold text-slate-900">🍗 {championTeam.wwcd || 0} WWCD VICTORIES</span>
              </div>
            </div>
          </motion.section>
        )}

        {/* 4. MATCH SCOREBARS STACK */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E7E3DA] dark:border-[#1E2638] pb-4">
            <div>
              <span className="text-[10px] font-mono text-bgmi-red font-bold uppercase tracking-widest block">
                /// LIVE MATCH SCHEDULE & SCOREBOARDS
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-tight">
                Tournament Schedule
              </h2>
            </div>
            <Link
              href="/matches"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#121620] hover:bg-slate-50 dark:hover:bg-[#181E2C] text-slate-900 dark:text-white border border-[#E7E3DA] dark:border-[#1E2638] font-display font-bold text-xs uppercase tracking-wider rounded-xl shadow-editorial-sm transition-all"
            >
              <span>All Matches & Lobbies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {matchesList.length > 0 ? (
            <div className="space-y-3">
              {matchesList.slice(0, 4).map((m) => (
                <MatchCard key={m.id || m.matchNumber} match={{ ...m, registeredSquadsCount: teamsStats.registeredSquads }} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Matches Scheduled Yet"
              message="Official tournament matches and custom room lobbies will appear here once scheduled."
              icon={Swords}
            />
          )}
        </section>

        {/* 5. TOP 3 PODIUM & SCOREBOARD TABLE */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E7E3DA] dark:border-[#1E2638] pb-4">
            <div>
              <span className="text-[10px] font-mono text-amber-600 dark:text-bgmi-gold font-bold uppercase tracking-widest block">
                /// OFFICIAL TOURNAMENT RANKINGS
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-tight">
                Standings Leaderboard
              </h2>
            </div>
            <Link
              href="/standings"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#121620] hover:bg-slate-50 dark:hover:bg-[#181E2C] text-slate-900 dark:text-white border border-[#E7E3DA] dark:border-[#1E2638] font-display font-bold text-xs uppercase tracking-wider rounded-xl shadow-editorial-sm transition-all"
            >
              <span>Full Standings Table</span>
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
            </Link>
          </div>

          {topStandings.length > 0 ? (
            <>
              {/* PODIUM CARDS */}
              <Top3Leaderboard standings={topStandings} />

              {/* DESKTOP SCOREBOARD TABLE */}
              <div className="hidden md:block overflow-x-auto bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl shadow-editorial-sm overflow-hidden">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead className="bg-[#FAF8F5] dark:bg-[#0B0E14] text-slate-700 dark:text-slate-300 font-display font-bold uppercase text-xs border-b border-[#E7E3DA] dark:border-[#1E2638]">
                    <tr>
                      <th className="py-3.5 px-4 text-center">RANK</th>
                      <th className="py-3.5 px-4">SQUAD NAME</th>
                      <th className="py-3.5 px-4 text-center">PLAYED</th>
                      <th className="py-3.5 px-4 text-center">WWCD</th>
                      <th className="py-3.5 px-4 text-center">PLACEMENT</th>
                      <th className="py-3.5 px-4 text-center">KILLS</th>
                      <th className="py-3.5 px-4 text-center">TOTAL PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E3DA] dark:divide-[#1E2638]">
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
            </>
          ) : (
            <EmptyState
              title="No Standings Recorded Yet"
              message="Official rankings will populate automatically as match scorecards are submitted by referees."
              icon={Trophy}
            />
          )}
        </section>

        {/* 6. MEDIA GALLERY */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E7E3DA] dark:border-[#1E2638] pb-4">
            <div>
              <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-bold uppercase tracking-widest block">
                /// PLAYER POVs & REPLAY HIGHLIGHTS
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-tight">
                Tournament Media
              </h2>
            </div>
            <Link
              href="/media"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#121620] hover:bg-slate-50 dark:hover:bg-[#181E2C] text-slate-900 dark:text-white border border-[#E7E3DA] dark:border-[#1E2638] font-display font-bold text-xs uppercase tracking-wider rounded-xl shadow-editorial-sm transition-all"
            >
              <span>Explore Gallery</span>
              <Video className="w-3.5 h-3.5 text-sky-500" />
            </Link>
          </div>

          {mediaItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mediaItems.map((item) => (
                <MediaCard key={item.id} item={item} onClick={(selected) => setSelectedMedia(selected)} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Media Published Yet"
              message="Screenshots and player recordings uploaded during matches will appear here."
              icon={Video}
            />
          )}
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
