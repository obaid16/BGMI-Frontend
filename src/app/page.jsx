'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Hero from '@/components/tournament/Hero';
import TournamentStats from '@/components/tournament/TournamentStats';
import NextMatchCard from '@/components/tournament/NextMatchCard';
import TeamCard from '@/components/tournament/TeamCard';
import StandingRow from '@/components/tournament/StandingRow';
import ResultCard from '@/components/tournament/ResultCard';
import MediaCard from '@/components/tournament/MediaCard';
import AnnouncementCard from '@/components/tournament/AnnouncementCard';
import MediaLightbox from '@/components/tournament/MediaLightbox';
import TrophyCanvas from '@/components/tournament/TrophyCanvas';
import Button from '@/components/common/Button';
import { SkeletonGrid } from '@/components/common/Skeleton';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { getMatches, getStandings, getResults, getMedia, getAnnouncements, getTeamById } from '@/services/api';
import { Trophy, Swords, Flame, Video, Bell, ArrowRight, Award, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [nextMatch, setNextMatch] = useState(null);
  const [topStandings, setTopStandings] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [championTeam, setChampionTeam] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  // Scroll reveal refs for GSAP animations
  const resultsGridRef = useRef(null);
  const mediaGridRef = useRef(null);
  const announcementsGridRef = useRef(null);
  useScrollReveal(resultsGridRef);
  useScrollReveal(mediaGridRef, ':scope > *', { stagger: 0.08 });
  useScrollReveal(announcementsGridRef, ':scope > *', { stagger: 0.1 });

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const matches = await getMatches();
        const standings = await getStandings();
        const results = await getResults();
        const media = await getMedia();
        const anns = await getAnnouncements();

        setNextMatch(matches.find((m) => m.status === 'Live' || m.status === 'Upcoming') || matches[0]);
        setTopStandings(standings.slice(0, 5));
        setRecentResults(results.slice(0, 3));
        setMediaItems(media.slice(0, 4));
        setAnnouncements(anns.slice(0, 3));

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
    <div className="space-y-20 pb-20">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* 2. ANIMATED TOURNAMENT STATS COUNTERS */}
        <TournamentStats />

        {/* CHAMPION SECTION */}
        <section className="space-y-6">
          {!isComplete ? (
            <div className="relative bg-gradient-to-r from-bgmi-surface via-bgmi-dark to-bgmi-surface border border-bgmi-gold/40 rounded-2xl p-8 sm:p-12 text-center clip-tactical shadow-gold-glow overflow-hidden">
              <div className="absolute inset-0 bg-tactical-grid opacity-15 pointer-events-none" />
              <div className="relative z-10 max-w-lg mx-auto space-y-4">
                <div className="w-full max-w-[140px] mx-auto mb-2">
                  <TrophyCanvas variant="wireframe" height={130} />
                </div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wider">
                  CHAMPION WILL BE CROWNED
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The battle is raging across our college battlegrounds. Dominate the leaderboard, verify your roster, and survive the final circles to claim the ultimate championship glory.
                </p>
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-bgmi-gold bg-bgmi-gold/10 px-3 py-1 rounded border border-bgmi-gold/30">
                    Grand Finals Upcoming
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative bg-gradient-to-b from-bgmi-gold/15 to-bgmi-surface border-2 border-bgmi-gold rounded-2xl p-6 sm:p-10 clip-tactical shadow-gold-glow overflow-hidden">
              <div className="absolute inset-0 bg-tactical-grid opacity-25 pointer-events-none" />
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-bgmi-gold/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute -left-10 -top-10 w-64 h-64 bg-bgmi-cyan/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  <div className="w-28 h-28 flex-shrink-0 bg-bgmi-dark/30 rounded-xl border border-bgmi-gold/20 p-1 flex items-center justify-center">
                    <TrophyCanvas variant="golden" height={110} />
                  </div>
                  
                  <div className="w-20 h-20 rounded-2xl bg-bgmi-dark border-2 border-bgmi-gold shadow-gold-glow p-2 flex items-center justify-center flex-shrink-0 relative group">
                    <div className="absolute -top-2.5 -left-2.5 w-6 h-6 bg-bgmi-gold rounded-lg flex items-center justify-center text-slate-950 font-black shadow-gold-glow rotate-[-12deg]">
                      <Trophy className="w-3.5 h-3.5" />
                    </div>
                    {championTeam?.logo ? (
                      <img src={championTeam.logo} alt={championTeam.teamName} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className="font-display font-black text-2xl text-bgmi-gold">{championTeam?.teamName?.charAt(0)}</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-bgmi-gold uppercase tracking-[0.22em] block">
                      BGMI COLLEGE CHAMPIONS 2026
                    </span>
                    <h3 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                      {championTeam?.teamName}
                    </h3>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                      <span className="text-xs font-semibold text-slate-300">
                        Total Points: <strong className="text-white text-sm">{(championTeam?.totalPoints !== undefined ? championTeam.totalPoints : championTeam?.points) || 0} PTS</strong>
                      </span>
                      <span className="text-slate-600">|</span>
                      <span className="text-xs font-semibold text-slate-300">
                        WWCD: <strong className="text-bgmi-gold text-sm">{championTeam?.wwcd || 0} Matches</strong>
                      </span>
                      <span className="text-slate-600">|</span>
                      <span className="text-xs font-semibold text-slate-300">
                        Total Kills: <strong className="text-bgmi-cyan text-sm">{championTeam?.kills || 0} Kills</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:max-w-md bg-bgmi-dark/60 rounded-xl p-4 sm:p-5 border border-bgmi-border/60">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-bgmi-border/40 pb-2">
                    Championship Roster
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {championTeam?.players?.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-bgmi-surface overflow-hidden border border-bgmi-border">
                          <img src={p.avatar} alt={p.ign} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-[11px] leading-tight line-clamp-1">{p.ign}</p>
                          <p className="text-slate-500 text-[10px] leading-tight line-clamp-1">{p.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 3. NEXT / LIVE MATCH SPOTLIGHT */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-wide flex items-center gap-2">
              <Swords className="w-6 h-6 text-bgmi-gold" /> Spotlight Match
            </h2>
            <Link href="/matches" className="text-xs font-bold text-bgmi-gold hover:underline flex items-center gap-1">
              Full Schedule <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <NextMatchCard match={nextMatch} />
        </section>

        {/* 3. TOP TEAMS LEADERBOARD PREVIEW */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-bgmi-border/60 pb-4">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-wide flex items-center gap-2">
                <Trophy className="w-6 h-6 text-bgmi-gold" /> Top 5 Leaderboard
              </h2>
              <p className="text-xs text-slate-400">Current overall standings in College Championship 2026</p>
            </div>
            <Link href="/standings">
              <Button variant="outline" size="sm" icon={Trophy}>
                VIEW FULL STANDINGS
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto bg-bgmi-surface border border-bgmi-border rounded-xl shadow-2xl clip-tactical">
            <table className="w-full text-left border-collapse">
              <thead className="bg-bgmi-dark/90 text-slate-400 font-display font-black text-xs uppercase tracking-wider border-b border-bgmi-border">
                <tr>
                  <th className="py-4 px-4 text-center">Rank</th>
                  <th className="py-4 px-4">Squad</th>
                  <th className="py-4 px-4 text-center">Played</th>
                  <th className="py-4 px-4 text-center">WWCD</th>
                  <th className="py-4 px-4 text-center">Placement</th>
                  <th className="py-4 px-4 text-center">Kills</th>
                  <th className="py-4 px-4 text-center">Kill Pts</th>
                  <th className="py-4 px-4 text-center">Penalty</th>
                  <th className="py-4 px-4 text-center">Total Points</th>
                </tr>
              </thead>
              <tbody>
                {topStandings.map((standing) => (
                  <StandingRow key={standing.teamId} standing={standing} />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. RECENT MATCH RESULTS */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-bgmi-border/60 pb-4">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-wide flex items-center gap-2">
                <Flame className="w-6 h-6 text-bgmi-gold" /> Recent Match Winners
              </h2>
              <p className="text-xs text-slate-400">Verified scorecards and top fraggers from completed rounds</p>
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
                <ResultCard key={result.id} result={result} />
              ))}
            </div>
          )}
        </section>

        {/* 5. MEDIA GALLERY PREVIEW */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-bgmi-border/60 pb-4">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-wide flex items-center gap-2">
                <Video className="w-6 h-6 text-bgmi-cyan" /> Esports Media Highlights
              </h2>
              <p className="text-xs text-slate-400">Player POV recordings, match screenshots, and victory photos</p>
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

        {/* 6. TOURNAMENT ANNOUNCEMENTS */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-bgmi-border/60 pb-4">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-wide flex items-center gap-2">
              <Bell className="w-6 h-6 text-bgmi-gold" /> Official Bulletins & News
            </h2>
          </div>

          <div ref={announcementsGridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {announcements.map((ann) => (
              <AnnouncementCard key={ann.id} announcement={ann} />
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
