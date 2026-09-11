'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MatchCard from '@/components/tournament/MatchCard';
import NextMatchCard from '@/components/tournament/NextMatchCard';
import MediaCard from '@/components/tournament/MediaCard';
import MediaLightbox from '@/components/tournament/MediaLightbox';
import { SkeletonGrid } from '@/components/common/Skeleton';
import { getMatches, getMedia, getAnnouncements, getTeams } from '@/services/api';
import { Trophy, Swords, Users, ShieldAlert, ArrowRight, Video, Calendar, ShieldCheck, MapPin, Gamepad2, Mic, Crown } from 'lucide-react';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [nextMatch, setNextMatch] = useState(null);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [teamsCount, setTeamsCount] = useState(24);
  const [approvedTeams, setApprovedTeams] = useState([]);

  const loadHomeData = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const [matchesRes, mediaRes, annsRes, teamsRes] = await Promise.all([
        getMatches('All', true).catch(() => []),
        getMedia('All', 'Published').catch(() => []),
        getAnnouncements().catch(() => []),
        getTeams('All', '', true).catch(() => [])
      ]);

      const matches = Array.isArray(matchesRes) ? matchesRes : [];
      const media = Array.isArray(mediaRes) ? mediaRes : [];
      const anns = Array.isArray(annsRes) ? annsRes : [];
      const teams = Array.isArray(teamsRes) ? teamsRes : [];

      const approved = teams.filter((t) => t.status === 'Approved' || t.verified);
      setApprovedTeams(approved.length > 0 ? approved : teams);
      setTeamsCount(approved.length > 0 ? approved.length : teams.length > 0 ? teams.length : 24);

      // Find match spotlight: Priority 1 is Live match, Priority 2 is Upcoming match
      const liveMatch = matches.find((m) => m && m.status === 'Live');
      const upcomingMatch = matches.find((m) => m && m.status === 'Upcoming');
      const liveOrNext = liveMatch || upcomingMatch || null;
      setNextMatch(liveOrNext);

      // Upcoming matches excluding the spotlight one
      const upMatches = matches
        .filter((m) => m && m.status === 'Upcoming' && (m.id || m._id) !== (liveOrNext?.id || liveOrNext?._id))
        .slice(0, 4);
      setUpcomingMatches(upMatches.length > 0 ? upMatches : matches.filter(m => (m.id || m._id) !== (liveOrNext?.id || liveOrNext?._id)).slice(0, 3));

      const publishedMediaOnly = media.filter((item) => item && (item.status === 'Published' || item.verified === true));
      setMediaItems(publishedMediaOnly.slice(0, 4));

      // Published announcements
      const publishedAnns = anns.filter((a) => a.status === 'Published');
      setAnnouncements(publishedAnns.slice(0, 3));
    } catch (err) {
      console.error('Failed to load homepage data', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData(true);

    // Live polling every 6 seconds to capture live match activations instantly
    const interval = setInterval(() => {
      loadHomeData(false);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 sm:pb-24 overflow-x-hidden font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold text-premium-sage uppercase tracking-widest bg-premium-sage-soft px-3 py-1.5 rounded-full border border-premium-sage/30">
              <Trophy className="w-3.5 h-3.5" /> Official BGMI Tournament Platform
            </div>
            <h1 className="font-bold text-3xl sm:text-5xl lg:text-7xl xl:text-[80px] text-premium-text tracking-tight leading-[1.1] sm:leading-[1.05]">
              MORE THAN A GAME.{' '}
              <span className="text-premium-sage block sm:inline">A STRONGER COMMUNITY.</span>
            </h1>
            <p className="text-base sm:text-xl text-premium-text-secondary max-w-2xl mx-auto lg:mx-0 font-medium">
              Join the ultimate college esports experience. Register your squad, track live matches, and dominate the leaderboards.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 bg-premium-text hover:bg-black text-white text-base font-bold rounded-2xl shadow-premium-float transition-all hover:-translate-y-1 text-center"
              >
                Register Your Squad
              </Link>
              <Link
                href="/matches"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-premium-surface-soft border border-premium-border text-premium-text text-base font-bold rounded-2xl shadow-sm transition-all hover:-translate-y-1 text-center"
              >
                View Matches
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full relative z-0 mt-8 lg:mt-0">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-square max-h-[600px] rounded-[32px] overflow-hidden shadow-premium-float bg-premium-surface border-[8px] border-white">
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&auto=format&fit=crop&q=80" 
                alt="BGMI Cinematic Tournament"
                className="w-full h-full object-cover object-center scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE MATCH SPOTLIGHT */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[11px] font-bold text-premium-text-secondary uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> MATCH SPOTLIGHT
          </h2>
        </div>
        {loading ? (
          <SkeletonGrid count={1} />
        ) : (
          <NextMatchCard match={nextMatch} topTeams={approvedTeams} registeredSquadsCount={teamsCount} />
        )}
      </section>


      {/* 4. UPCOMING MATCHES */}
      {upcomingMatches.length > 0 && (
        <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-premium-border pb-4 mb-8">
            <h2 className="font-bold text-2xl sm:text-3xl text-premium-text tracking-tight">Upcoming Matches</h2>
            <Link href="/matches?tab=schedule" className="text-sm font-bold text-premium-text hover:text-premium-sage uppercase tracking-widest transition-colors flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {upcomingMatches.map((m) => (
              <MatchCard key={m.id || m.matchNumber} match={{ ...m, registeredSquadsCount: teamsCount }} />
            ))}
          </div>
        </section>
      )}

      {/* 5. QUICK ACCESS */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-bold text-2xl sm:text-3xl text-premium-text tracking-tight mb-6 sm:mb-8">Tournament Portal</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Link href="/matches" className="group p-5 sm:p-8 bg-premium-surface border border-premium-border rounded-[20px] sm:rounded-[24px] shadow-sm hover:shadow-premium-float transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-premium-surface-soft text-premium-text rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-bold text-base sm:text-xl text-premium-text mb-1 sm:mb-2">Matches</h3>
            <p className="text-xs sm:text-sm text-premium-text-secondary font-medium">Live schedules, results, standings, and MVP leaderboards.</p>
          </Link>
          <Link href="/teams" className="group p-5 sm:p-8 bg-premium-surface border border-premium-border rounded-[20px] sm:rounded-[24px] shadow-sm hover:shadow-premium-float transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-premium-surface-soft text-premium-text rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-bold text-base sm:text-xl text-premium-text mb-1 sm:mb-2">Teams</h3>
            <p className="text-xs sm:text-sm text-premium-text-secondary font-medium">Explore the verified college squads and rosters competing.</p>
          </Link>
          <Link href="/rules" className="group p-5 sm:p-8 bg-premium-surface border border-premium-border rounded-[20px] sm:rounded-[24px] shadow-sm hover:shadow-premium-float transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-premium-surface-soft text-premium-text rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-bold text-base sm:text-xl text-premium-text mb-1 sm:mb-2">Rules</h3>
            <p className="text-xs sm:text-sm text-premium-text-secondary font-medium">Official tournament directives, scoring, and anti-cheat policies.</p>
          </Link>
          <Link href="/register" className="group p-5 sm:p-8 bg-premium-sage-soft border border-premium-sage/30 rounded-[20px] sm:rounded-[24px] shadow-sm hover:shadow-premium-float transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-white text-premium-sage rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-bold text-base sm:text-xl text-premium-text mb-1 sm:mb-2">Register</h3>
            <p className="text-xs sm:text-sm text-premium-text-secondary font-medium">Secure your squad's slot in the upcoming championship.</p>
          </Link>
        </div>
      </section>

      {/* 6. MEDIA HIGHLIGHT */}
      {mediaItems.length > 0 && (
        <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-premium-border pb-4 mb-8">
            <h2 className="font-bold text-2xl sm:text-3xl text-premium-text tracking-tight">Media Highlights</h2>
            <Link href="/media" className="text-sm font-bold text-premium-text hover:text-premium-sage uppercase tracking-widest transition-colors flex items-center gap-1">
              View Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaItems.map((item) => (
              <MediaCard key={item.id} item={item} onClick={(selected) => setSelectedMedia(selected)} />
            ))}
          </div>
        </section>
      )}

      {/* 7. LATEST ANNOUNCEMENTS */}
      {announcements.length > 0 && (
        <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-premium-border pb-4 mb-8">
            <h2 className="font-bold text-2xl sm:text-3xl text-premium-text tracking-tight">Latest Announcements</h2>
            <Link href="/announcements" className="text-sm font-bold text-premium-text hover:text-premium-sage uppercase tracking-widest transition-colors flex items-center gap-1">
              All News <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {announcements.map((ann, idx) => (
              <div key={idx} className="bg-premium-surface border border-premium-border rounded-[24px] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-premium-sage uppercase tracking-widest bg-premium-sage-soft px-2.5 py-1 rounded-md">
                      {ann.type || 'Update'}
                    </span>
                    <span className="text-xs font-semibold text-premium-text-secondary">{ann.date || 'Recent'}</span>
                  </div>
                  <h3 className="font-bold text-xl text-premium-text leading-tight">{ann.title}</h3>
                  <p className="text-sm text-premium-text-secondary line-clamp-3 leading-relaxed">{ann.content}</p>
                </div>
                <div className="pt-6 mt-6 border-t border-premium-border">
                  <span className="text-[11px] font-bold text-premium-text-secondary uppercase tracking-widest flex items-center gap-2">
                    <Mic className="w-3.5 h-3.5" /> Official Broadcast
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. COMMUNITY / FINAL CTA */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="bg-premium-text text-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-12 lg:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-8">
            <h2 className="font-bold text-3xl sm:text-5xl lg:text-[80px] tracking-tight leading-tight sm:leading-none">
              Play. Compete. Connect.
            </h2>
            <p className="text-lg text-white/70 max-w-xl mx-auto font-medium">
              The battlefield awaits. Register your squad and become part of the most prestigious college tournament of the year.
            </p>
            <Link
              href="/register"
              className="inline-block px-10 py-5 bg-white text-premium-text hover:bg-premium-surface-soft text-lg font-bold rounded-2xl shadow-xl transition-all hover:-translate-y-1"
            >
              Register Now
            </Link>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white rounded-full blur-[100px]"></div>
          </div>
        </div>
      </section>

      {/* MEDIA LIGHTBOX MODAL */}
      <MediaLightbox
        item={selectedMedia}
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
      />
    </div>
  );
}
