'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Radio, Clock, Swords, Shield, Copy, Check, X, Users, MapPin } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function NextMatchCard({ match, topTeams = [], registeredSquadsCount }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!match) return null;

  const isLive = match.status === 'Live';

  // Extract participating teams or fallback to top contender list
  const participatingSquads = topTeams.length > 0
    ? topTeams
    : [
        { teamName: 'GODLIKE ESPORTS', rank: 1, department: 'CSE' },
        { teamName: 'TEAM APEX GAMING', rank: 2, department: 'ECE' },
        { teamName: 'SOUL WARRIORS', rank: 3, department: 'MECH' },
        { teamName: 'CYBER KNIGHTS', rank: 4, department: 'IT' },
        { teamName: 'VENOM ESPORTS', rank: 5, department: 'CIVIL' },
        { teamName: 'BLACK MAMBAS', rank: 6, department: 'EE' },
        { teamName: 'VALOR REAPERS', rank: 7, department: 'CSE' },
        { teamName: 'TITAN SQUAD', rank: 8, department: 'AI-DS' },
      ];

  const totalSquadsCount = registeredSquadsCount || participatingSquads.length || 24;
  const totalPlayersCount = totalSquadsCount * 4;

  const roomDetails = {
    roomId: match.roomId || '8492041',
    password: match.password || 'NIT2026',
    map: match.map || 'Erangel',
    mode: 'TPP SQUAD (4v4)',
    server: 'Asia (18ms Ping)',
    slots: participatingSquads.map((t, idx) => ({
      slot: idx + 1,
      team: t.teamName || t.name,
      seed: idx === 0 ? 'Top Seed' : idx === 1 ? 'Challenger' : `Rank #${idx + 1}`
    }))
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  return (
    <>
      <div className="relative overflow-hidden bg-white border border-premium-border rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 md:p-8 shadow-sm space-y-6 sm:space-y-8">
        
        {/* 1. MATCH SPOTLIGHT HEADER */}
        <div className="relative z-10 flex flex-col gap-3 border-b border-premium-border pb-4 sm:pb-6">
          <div className="flex items-center gap-3">
            {isLive ? (
              <Badge variant="live" size="md">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-widest">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" /> LIVE
                </span>
              </Badge>
            ) : (
              <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                UPCOMING MATCH
              </span>
            )}
            <span className="font-bold text-base sm:text-xl text-premium-text tracking-tight">
              Match #{match.matchNumber || 1} / <span className="text-amber-600">{match.map || 'Erangel'}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-premium-text-secondary">
            <span className="flex items-center gap-1.5 bg-premium-background px-2.5 py-1 rounded-[8px]">
              <Clock className="w-4 h-4 text-amber-600" /> {match.time || '10:30 AM'}
            </span>
            <span className="flex items-center gap-1.5 bg-premium-background px-2.5 py-1 rounded-[8px]">
              <Shield className="w-4 h-4" /> {match.round || 'Grand Finals'}
            </span>
            <span className="flex items-center gap-1.5 bg-premium-background px-2.5 py-1 rounded-[8px] text-sky-700">
              <Users className="w-4 h-4" /> {totalSquadsCount} Squads
            </span>
          </div>
        </div>

        {/* 2. BATTLE ROYALE SHOWCASE: MAP SPECS & PARTICIPATING SQUADS */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* MAP DISPLAY BOX (5 COLS) */}
          <div className="lg:col-span-5 p-5 bg-premium-background rounded-[16px] border border-premium-border flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-premium-border pb-3">
                <span className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Arena Details
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-white rounded-[12px] border border-premium-border shadow-sm">
                  <span className="text-[10px] text-premium-text-secondary block uppercase tracking-widest font-bold mb-1">Map</span>
                  <span className="font-bold text-premium-text">{match.map || 'Erangel'}</span>
                </div>
                <div className="p-3 bg-white rounded-[12px] border border-premium-border shadow-sm">
                  <span className="text-[10px] text-premium-text-secondary block uppercase tracking-widest font-bold mb-1">Mode</span>
                  <span className="font-bold text-premium-text">TPP Squad</span>
                </div>
                <div className="p-3 bg-white rounded-[12px] border border-premium-border shadow-sm">
                  <span className="text-[10px] text-premium-text-secondary block uppercase tracking-widest font-bold mb-1">Capacity</span>
                  <span className="font-bold text-sky-700">{totalSquadsCount} Squads</span>
                </div>
                <div className="p-3 bg-white rounded-[12px] border border-premium-border shadow-sm">
                  <span className="text-[10px] text-premium-text-secondary block uppercase tracking-widest font-bold mb-1">Status</span>
                  <span className="font-bold text-amber-600">Lobby Ready</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-premium-border">
              <p className="text-xs font-medium text-premium-text-secondary leading-relaxed">
                * All {totalSquadsCount} registered squads join the custom lobby 10 minutes prior to drop time.
              </p>
            </div>
          </div>

          {/* ALL PARTICIPATING SQUADS GRID (7 COLS) */}
          <div className="lg:col-span-7 p-5 bg-premium-background rounded-[16px] border border-premium-border space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-premium-border pb-3">
              <h4 className="font-bold text-sm uppercase text-premium-text flex items-center gap-2">
                <Swords className="w-4 h-4 text-amber-600" /> Participating Squads ({participatingSquads.length}/{totalSquadsCount})
              </h4>
            </div>

            {/* SQUAD CHIPS GRID */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 max-h-56 overflow-y-auto custom-scrollbar pr-1 sm:pr-2">
              {participatingSquads.map((sq, idx) => (
                <div
                  key={idx}
                  className="p-2 sm:p-3 bg-white rounded-[10px] sm:rounded-[12px] border border-premium-border flex items-center gap-2 sm:gap-3 transition-colors shadow-sm min-w-0"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[6px] sm:rounded-[8px] bg-premium-surface-soft border border-premium-border flex items-center justify-center text-xs font-bold text-amber-600 shrink-0">
                    {sq.logo ? (
                      <img src={sq.logo} alt={sq.teamName || sq.name} className="w-full h-full object-cover rounded-[6px]" />
                    ) : (
                      <span>{(sq.teamName || sq.name || 'T').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="truncate text-left">
                    <p className="font-bold text-xs sm:text-sm text-premium-text truncate">
                      {sq.teamName || sq.name}
                    </p>
                    <p className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest">
                      Slot #{String(idx + 1).padStart(2, '0')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-premium-border flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-premium-text-secondary">
              <span>Points: WWCD = 10 PTS • Kill = 1 PT</span>
              <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-[8px] border border-emerald-100 uppercase tracking-widest text-[10px]">Anti-Cheat Active</span>
            </div>
          </div>

        </div>

        {/* 3. FOOTER COUNTDOWN & ACTION STRIP */}
        <div className="relative z-10 pt-6 border-t border-premium-border flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Ticking Timer */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest">Launch In:</span>
            <div className="flex items-center gap-1.5 font-bold text-lg text-amber-600">
              <span className="bg-amber-50 px-3 py-1.5 rounded-[10px] border border-amber-200">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span className="text-amber-300">:</span>
              <span className="bg-amber-50 px-3 py-1.5 rounded-[10px] border border-amber-200">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span className="text-amber-300">:</span>
              <span className="bg-amber-50 px-3 py-1.5 rounded-[10px] border border-amber-200">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            variant="primary"
            size="md"
            icon={Swords}
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto"
          >
            Lobby Details & Code
          </Button>
        </div>

      </div>

      {/* LOBBY DETAILS & ROOM CREDENTIALS MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-premium-background/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white border border-premium-border rounded-[20px] sm:rounded-[24px] max-w-2xl w-full p-4 sm:p-6 md:p-8 shadow-2xl space-y-6 sm:space-y-8 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full text-premium-text-secondary hover:bg-premium-surface-soft hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* MODAL HEADER */}
            <div className="space-y-2 border-b border-premium-border pb-6">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-[8px] text-[10px] font-bold uppercase tracking-widest">
                  Official Lobby
                </span>
                <span className="text-xs font-bold text-premium-text-secondary uppercase tracking-widest">{match.round || 'GRAND FINALS'}</span>
              </div>
              <h3 className="font-bold text-2xl text-premium-text tracking-tight">
                Match #{match.matchNumber || 1} / <span className="text-amber-600">{roomDetails.map}</span>
              </h3>
            </div>

            {/* ROOM CREDENTIALS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ROOM ID CARD */}
              <div className="p-5 bg-premium-surface rounded-[16px] border border-premium-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest">
                    ROOM STATUS
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1.5 uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> READY
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-premium-text-secondary uppercase tracking-widest block font-bold">ROOM ID</span>
                  <span className="font-bold text-3xl tracking-tight text-amber-600 block">
                    {roomDetails.roomId}
                  </span>
                </div>

                <button
                  onClick={() => copyToClipboard(roomDetails.roomId, 'id')}
                  className="w-full py-2.5 bg-white hover:bg-premium-background border border-premium-border text-premium-text rounded-[10px] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  {copiedId ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedId ? 'COPIED' : 'COPY ID'}</span>
                </button>
              </div>

              {/* ROOM PASSWORD CARD */}
              <div className="p-5 bg-premium-surface rounded-[16px] border border-premium-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest">
                    SECURITY ACCESS
                  </span>
                  <span className="text-[10px] text-sky-600 font-bold flex items-center gap-1.5 uppercase tracking-widest">
                    <Shield className="w-3.5 h-3.5" /> VERIFIED
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-premium-text-secondary uppercase tracking-widest block font-bold">PASSWORD</span>
                  <span className="font-bold text-3xl tracking-tight text-sky-600 block">
                    {roomDetails.password}
                  </span>
                </div>

                <button
                  onClick={() => copyToClipboard(roomDetails.password, 'pass')}
                  className="w-full py-2.5 bg-white hover:bg-premium-background border border-premium-border text-premium-text rounded-[10px] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  {copiedPass ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedPass ? 'COPIED' : 'COPY PASSWORD'}</span>
                </button>
              </div>
            </div>

            {/* LOBBY SPECIFICATIONS GRID */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center text-xs sm:text-sm">
              <div className="p-3 bg-white rounded-[12px] border border-premium-border shadow-sm">
                <span className="text-[10px] text-premium-text-secondary block uppercase tracking-widest font-bold mb-1">MAP</span>
                <span className="font-bold text-premium-text">{roomDetails.map}</span>
              </div>
              <div className="p-3 bg-white rounded-[12px] border border-premium-border shadow-sm">
                <span className="text-[10px] text-premium-text-secondary block uppercase tracking-widest font-bold mb-1">MODE</span>
                <span className="font-bold text-amber-600">{roomDetails.mode}</span>
              </div>
              <div className="p-3 bg-white rounded-[12px] border border-premium-border shadow-sm">
                <span className="text-[10px] text-premium-text-secondary block uppercase tracking-widest font-bold mb-1">SERVER</span>
                <span className="font-bold text-sky-700">{roomDetails.server}</span>
              </div>
              <div className="p-3 bg-white rounded-[12px] border border-premium-border shadow-sm">
                <span className="text-[10px] text-premium-text-secondary block uppercase tracking-widest font-bold mb-1">ANTI-CHEAT</span>
                <span className="font-bold text-emerald-600">ACTIVE</span>
              </div>
            </div>

            {/* ALL PARTICIPATING SQUAD SLOTS TABLE */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm uppercase text-premium-text flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" /> LOBBY SQUAD SLOT MATRIX ({roomDetails.slots.length}/24)
              </h4>
              <div className="max-h-48 overflow-y-auto border border-premium-border rounded-[16px] bg-premium-surface p-3 space-y-2 custom-scrollbar">
                {roomDetails.slots.map((s) => (
                  <div key={s.slot} className="flex items-center justify-between px-4 py-2.5 bg-white rounded-[10px] border border-premium-border shadow-sm">
                    <span className="text-premium-text-secondary font-bold text-xs uppercase tracking-widest">SLOT #{String(s.slot).padStart(2, '0')}</span>
                    <span className="text-premium-text font-bold text-sm">{s.team}</span>
                    <span className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">{s.seed}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-premium-border">
              <span className="text-[10px] font-medium text-premium-text-secondary">
                * All 24 squads enter custom room 10 minutes prior to launch.
              </span>
              <Link href={`/matches/${match.matchNumber || match.id}`} onClick={() => setShowModal(false)}>
                <Button variant="secondary" size="md" className="w-full sm:w-auto">
                  Go to Match Page
                </Button>
              </Link>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
