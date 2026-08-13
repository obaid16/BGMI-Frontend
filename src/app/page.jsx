'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Hero from '@/components/tournament/Hero';
import TournamentStats from '@/components/tournament/TournamentStats';
import NextMatchCard from '@/components/tournament/NextMatchCard';
import Top3Leaderboard from '@/components/tournament/Top3Leaderboard';
import StandingRow from '@/components/tournament/StandingRow';
import RankingCard from '@/components/tournament/RankingCard';
import ResultCard from '@/components/tournament/ResultCard';
import MediaCard from '@/components/tournament/MediaCard';
import MediaLightbox from '@/components/tournament/MediaLightbox';
import Button from '@/components/common/Button';
import { SkeletonGrid } from '@/components/common/Skeleton';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { getMatches, getStandings, getResults, getMedia, getAnnouncements, getTeamById, getTeams } from '@/services/api';
import { Trophy, Swords, Flame, Video, ArrowRight, Crown } from 'lucide-react';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [nextMatch, setNextMatch] = useState(null);
  const [topStandings, setTopStandings] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [championTeam, setChampionTeam] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [teamsStats, setTeamsStats] = useState({ registeredSquads: 0, verifiedPlayers: 0 });

  // Scroll reveal refs for GSAP animations
  const resultsGridRef = useRef(null);
  const mediaGridRef = useRef(null);
  useScrollReveal(resultsGridRef);
  useScrollReveal(mediaGridRef, ':scope > *', { stagger: 0.08 });

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [matches, standings, results, media, anns, teams] = await Promise.all([
          getMatches(),
          getStandings(),
          getResults(),
          getMedia(),
          getAnnouncements(),
          getTeams()
        ]);

        const registered = teams ? teams.length : 0;
        const verified = teams ? teams.reduce((acc, t) => acc + (t.players ? t.players.length : 0), 0) : 0;
        setTeamsStats({ registeredSquads: registered, verifiedPlayers: verified });

        setNextMatch(matches.find((m) => m.status === 'Live' || m.status === 'Upcoming') || matches[0]);
        setTopStandings(standings.slice(0, 5));
        setRecentResults(results.slice(0, 3));
        setMediaItems(media.slice(0, 4));

        const isTournamentComplete = matches.length > 0 && !matches.some((m) => m.status === 'Live' || m.status === 'Upcoming');
        setIsComplete(isTournamentComplete);

        if (isTournamentComplete && standings.length > 0) {
          const topTeam = standings[0];
          const fullTeamDetails = await getTeamById(topTeam.teamId);
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
    <div className="space-y-20 pb-20 overflow-x-hidden">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        {/* 2. ANIMATED TOURNAMENT STATS COUNTERS */}
        <TournamentStats
          registeredSquads={teamsStats.registeredSquads}
          verifiedPlayers={teamsStats.verifiedPlayers}
          totalMatches={4}
          currentRound={4}
        />

        {/* 3. GRAND CHAMPION SECTION */}
        <section className="space-y-6">
          {!isComplete ? (
            <div className="relative bg-white border border-slate-200 dark:bg-gradient-to-r dark:from-bgmi-surface dark:via-bgmi-dark dark:to-bgmi-surface dark:border-bgmi-red/40 rounded-2xl p-8 sm:p-12 text-center clip-tactical shadow-md dark:shadow-red-glow overflow-hidden">
              <div className="absolute inset-0 bg-tactical-grid opacity-15 pointer-events-none" />
              <div className="relative z-10 max-w-xl mx-auto space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-bgmi-dark border-2 border-amber-500 dark:border-bgmi-gold shadow-md dark:shadow-gold-glow flex items-center justify-center text-amber-600 dark:text-bgmi-gold">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-wider">
                  CHAMPION WILL BE CROWNED
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  The battle is raging across our college battlegrounds. Dominate the leaderboard, verify your roster, and survive the final circles to claim the ultimate championship glory.
                </p>
                <div className="pt-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-bgmi-red bg-bgmi-red/10 px-4 py-1.5 rounded-full border border-bgmi-red/40 shadow-red-glow">
                    GRAND FINALS UPCOMING
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative bg-white border-2 border-amber-500 dark:bg-gradient-to-b dark:from-bgmi-gold/20 dark:via-bgmi-surface dark:to-bgmi-dark dark:border-bgmi-gold rounded-2xl p-6 sm:p-10 clip-tactical shadow-md dark:shadow-gold-glow overflow-hidden">
              <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-bgmi-dark border-2 border-amber-500 dark:border-bgmi-gold shadow-md dark:shadow-gold-glow p-2 flex items-center justify-center flex-shrink-0 relative group">
                    <div className="absolute -top-2.5 -left-2.5 w-7 h-7 bg-amber-500 dark:bg-bgmi-gold rounded-lg flex items-center justify-center text-slate-950 font-black shadow-md rotate-[-12deg]">
                      <Crown className="w-4 h-4" />
                    </div>
                    {championTeam?.logo ? (
                      <img src={championTeam.logo} alt={championTeam.teamName} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className="font-display font-black text-2xl text-amber-600 dark:text-bgmi-gold">{championTeam?.teamName?.charAt(0)}</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-amber-600 dark:text-bgmi-gold uppercase tracking-[0.25em] block">
                      NIT BGMI COLLEGE CHAMPIONS 2026
                    </span>
                    <h3 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white uppercase tracking-tight">
                      {championTeam?.teamName}
                    </h3>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Total Points: <strong className="text-slate-900 dark:text-white text-sm font-black">{(championTeam?.totalPoints !== undefined ? championTeam.totalPoints : championTeam?.points) || 0} PTS</strong>
                      </span>
                      <span className="text-slate-400 dark:text-slate-600">|</span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        WWCD: <strong className="text-amber-600 dark:text-bgmi-gold text-sm font-black">{championTeam?.wwcd || 0} Matches</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 4. NEXT / LIVE MATCH SPOTLIGHT */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-bgmi-border/60 pb-4">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
              <Swords className="w-6 h-6 text-bgmi-red" /> Spotlight Match
            </h2>
            <Link href="/matches" className="text-xs font-bold text-bgmi-red hover:underline flex items-center gap-1">
              Full Schedule <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <NextMatchCard match={nextMatch} />
        </section>

        {/* 5. TOP 3 PODIUM & LEADERBOARD SPOTLIGHT */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-bgmi-border/60 pb-4">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-600 dark:text-bgmi-gold" /> Tournament Leaderboard
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Current top contender standings in College Championship 2026</p>
            </div>
            <Link href="/standings">
              <Button variant="outline-gold" size="sm" icon={Trophy}>
                FULL STANDINGS
              </Button>
            </Link>
          </div>

          {/* TOP 3 PODIUM HIGHLIGHT */}
          <Top3Leaderboard standings={topStandings} />

          {/* DESKTOP LEADERBOARD TABLE */}
          <div className="hidden md:block overflow-x-auto bg-white border border-slate-200 dark:bg-bgmi-surface/90 dark:border-bgmi-border rounded-xl shadow-lg dark:shadow-2xl clip-tactical">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 dark:bg-bgmi-dark/95 dark:border-bgmi-border dark:text-slate-400 font-display font-black text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-4 text-center">Rank</th>
                  <th className="py-4 px-4">Squad</th>
                  <th className="py-4 px-4 text-center">Played</th>
                  <th className="py-4 px-4 text-center">WWCD</th>
                  <th className="py-4 px-4 text-center">Placement</th>
                  <th className="py-4 px-4 text-center">Kill Pts</th>
                  <th className="py-4 px-4 text-center">Total Points</th>
                </tr>
              </thead>
              <tbody>
                {topStandings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 font-semibold text-xs tracking-wider uppercase">
                      No Standings Data Available
                    </td>
                  </tr>
                ) : (
                  topStandings.map((standing) => (
                    <StandingRow key={standing.teamId || standing.rank} standing={standing} />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE RANKING CARDS STACK */}
          <div className="md:hidden space-y-3">
            {topStandings.map((standing) => (
              <RankingCard key={standing.teamId || standing.rank} standing={standing} />
            ))}
          </div>
        </section>

        {/* 6. RECENT MATCH RESULTS */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-bgmi-border/60 pb-4">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                <Flame className="w-6 h-6 text-bgmi-red" /> Recent Match Winners
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Verified scorecards and top fraggers from completed rounds</p>
            </div>
            <Link href="/results">
              <Button variant="secondary" size="sm">
                View All Results
              </Button>
            </Link>
          </div>

          {loading ? (
            <SkeletonGrid count={3} />
          ) : (
            <div ref={resultsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentResults.map((result) => (
                <ResultCard key={result.id || result.matchNumber} result={result} />
              ))}
            </div>
          )}
        </section>

        {/* 7. MEDIA GALLERY PREVIEW */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-bgmi-border/60 pb-4">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                <Video className="w-6 h-6 text-sky-600 dark:text-bgmi-cyan" /> Media Highlights & POVs
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Player POV recordings, match screenshots, and victory photos</p>
            </div>
            <Link href="/media">
              <Button variant="outline" size="sm">
                VIEW ALL MEDIA
              </Button>
            </Link>
          </div>

          <div ref={mediaGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
