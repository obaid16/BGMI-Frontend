'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Radio, Clock, Swords, Shield, Copy, Check, X, Users, MapPin } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

// Robust helper to parse scheduled match date & time into Date object
function parseMatchDateTime(dateStr, timeStr) {
  if (!dateStr) return null;
  if (dateStr.includes('T')) {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  }

  const cleanTime = (timeStr || '10:00 AM').trim();
  const match = cleanTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridian = match[3]?.toUpperCase();
    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;
    
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      d.setHours(hours, minutes, 0, 0);
      return d;
    }
  }

  const fallback = new Date(`${dateStr} ${cleanTime}`);
  return isNaN(fallback.getTime()) ? null : fallback;
}

export default function NextMatchCard({ match, topTeams = [], registeredSquadsCount }) {
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0, isPast: false });
  const [liveTime, setLiveTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const isLive = match?.status === 'Live';

  // Live countdown / elapsed timer (ticking every second dynamically)
  useEffect(() => {
    if (!match) return;

    function updateTimer() {
      const now = Date.now();
      if (isLive) {
        // Calculate elapsed live time from match.updatedAt or start of live event
        const liveStart = match.updatedAt ? new Date(match.updatedAt).getTime() : now;
        const elapsed = Math.max(0, Math.floor((now - liveStart) / 1000));
        setLiveTime({
          hours: Math.floor(elapsed / 3600),
          minutes: Math.floor((elapsed % 3600) / 60),
          seconds: elapsed % 60,
        });
      } else {
        const target = parseMatchDateTime(match.date, match.time);
        if (target) {
          const diff = target.getTime() - now;
          if (diff <= 0) {
            setCountdown({ hours: 0, minutes: 0, seconds: 0, isPast: true });
          } else {
            const totalSec = Math.floor(diff / 1000);
            setCountdown({
              hours: Math.floor(totalSec / 3600),
              minutes: Math.floor((totalSec % 3600) / 60),
              seconds: totalSec % 60,
              isPast: false,
            });
          }
        }
      }
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [match?.id, match?.status, match?.date, match?.time, match?.updatedAt, isLive]);

  // Lock background scroll on mobile when modal is active
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  // When no match is active or scheduled by admin, show an informative live standby banner
  if (!match) {
    return (
      <div className="relative overflow-hidden bg-white border border-premium-border rounded-[20px] sm:rounded-[24px] p-8 sm:p-12 shadow-sm text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto shadow-sm">
          <Radio className="w-7 h-7 text-amber-600 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-2xl text-premium-text tracking-tight">No Live Match Currently Running</h3>
          <p className="text-sm text-premium-text-secondary max-w-md mx-auto leading-relaxed">
            When tournament administrators schedule or turn on a match live, it will appear here in real time with squad logos, live clocks, and room credentials.
          </p>
        </div>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Custom Lobby Standby
          </span>
          <Link href="/matches">
            <Button variant="outline" size="sm">
              View Schedule
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Extract participating teams dynamically: priority is match.participatingTeams, then real approved teams
  const participatingSquads = (match.participatingTeams && match.participatingTeams.length > 0)
    ? match.participatingTeams
    : (topTeams && topTeams.length > 0)
      ? topTeams
      : [];

  const totalSquadsCount = Math.max(registeredSquadsCount || 0, participatingSquads.length, 24);

  const roomDetails = {
    roomId: match.roomId || '8492041',
    password: match.password || 'NIT2026',
    map: match.map || 'Erangel',
    mode: 'TPP SQUAD (4v4)',
    server: 'Asia (18ms Ping)',
    slots: participatingSquads.map((t, idx) => ({
      slot: idx + 1,
      team: t.name || t.teamName || `Squad #${idx + 1}`,
      seed: idx === 0 ? 'Top Seed' : idx === 1 ? 'Challenger' : `Rank #${idx + 1}`,
    })),
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
                  <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" /> LIVE MATCH
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
                  <span className={`font-bold ${isLive ? 'text-red-600' : 'text-amber-600'}`}>
                    {isLive ? 'Live In Battle' : 'Lobby Ready'}
                  </span>
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
                <Swords className="w-4 h-4 text-amber-600" /> Participating Squads ({participatingSquads.length} / {totalSquadsCount} Slots)
              </h4>
            </div>

            {/* SQUAD CHIPS GRID WITH REAL LOGOS & NAMES */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 max-h-56 overflow-y-auto custom-scrollbar pr-1 sm:pr-2">
              {participatingSquads.map((sq, idx) => {
                const teamName = sq.name || sq.teamName || `Squad #${idx + 1}`;
                const teamLogo = sq.logo || sq.logoUrl || '';

                return (
                  <div
                    key={sq.id || sq._id || idx}
                    className="p-2 sm:p-3 bg-white rounded-[10px] sm:rounded-[12px] border border-premium-border flex items-center gap-2 sm:gap-3 transition-colors shadow-sm min-w-0"
                  >
                    <div className="w-8 h-8 rounded-[8px] bg-premium-surface-soft border border-premium-border flex items-center justify-center text-xs font-bold text-amber-600 shrink-0 overflow-hidden relative">
                      {teamLogo ? (
                        <img
                          src={teamLogo}
                          alt={teamName}
                          className="w-full h-full object-cover rounded-[6px]"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <span className={teamLogo ? 'hidden' : 'flex'}>
                        {teamName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="truncate text-left flex-1 min-w-0">
                      <p className="font-bold text-xs sm:text-sm text-premium-text truncate" title={teamName}>
                        {teamName}
                      </p>
                      <p className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest">
                        Slot #{String(idx + 1).padStart(2, '0')}
                      </p>
                    </div>
                  </div>
                );
              })}

              {participatingSquads.length === 0 && (
                <div className="col-span-2 py-8 text-center bg-white rounded-[12px] border border-premium-border p-4">
                  <p className="text-xs font-bold text-premium-text-secondary">
                    No approved squads assigned yet. Tournament squads will populate upon registration approval.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-premium-border flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-premium-text-secondary">
              <span>Points: WWCD = 10 PTS • Kill = 1 PT</span>
              <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-[8px] border border-emerald-100 uppercase tracking-widest text-[10px]">Anti-Cheat Active</span>
            </div>
          </div>

        </div>

        {/* 3. FOOTER COUNTDOWN & ACTION STRIP */}
        <div className="relative z-10 pt-6 border-t border-premium-border flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Dynamic Live Ticking Timer */}
          {isLive ? (
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" /> Live Clock:
              </span>
              <div className="flex items-center gap-1.5 font-bold text-lg text-red-600">
                <span className="bg-red-50 px-3 py-1.5 rounded-[10px] border border-red-200">
                  {String(liveTime.hours).padStart(2, '0')}h
                </span>
                <span className="text-red-300">:</span>
                <span className="bg-red-50 px-3 py-1.5 rounded-[10px] border border-red-200">
                  {String(liveTime.minutes).padStart(2, '0')}m
                </span>
                <span className="text-red-300">:</span>
                <span className="bg-red-50 px-3 py-1.5 rounded-[10px] border border-red-200">
                  {String(liveTime.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          ) : countdown.isPast ? (
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Status:
              </span>
              <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-[10px] border border-emerald-200 text-sm uppercase tracking-widest">
                Lobby Open / Drop Imminent
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest">Launch In:</span>
              <div className="flex items-center gap-1.5 font-bold text-lg text-amber-600">
                <span className="bg-amber-50 px-3 py-1.5 rounded-[10px] border border-amber-200">
                  {String(countdown.hours).padStart(2, '0')}h
                </span>
                <span className="text-amber-300">:</span>
                <span className="bg-amber-50 px-3 py-1.5 rounded-[10px] border border-amber-200">
                  {String(countdown.minutes).padStart(2, '0')}m
                </span>
                <span className="text-amber-300">:</span>
                <span className="bg-amber-50 px-3 py-1.5 rounded-[10px] border border-amber-200">
                  {String(countdown.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          )}

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

      {/* LOBBY DETAILS & ROOM CREDENTIALS MODAL - 100% RESPONSIVE PHONE VIEW */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 overflow-hidden"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white border border-premium-border rounded-[20px] sm:rounded-[24px] max-w-2xl w-full max-h-[92dvh] sm:max-h-[88vh] shadow-2xl flex flex-col relative overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. STICKY MODAL HEADER */}
            <div className="p-4 sm:p-6 border-b border-premium-border flex-shrink-0 flex items-start justify-between gap-3 bg-white">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-[6px] text-[10px] font-bold uppercase tracking-widest">
                    Official Lobby
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-premium-text-secondary uppercase tracking-widest truncate">
                    {match.round || 'GRAND FINALS'}
                  </span>
                </div>
                <h3 className="font-bold text-lg sm:text-2xl text-premium-text tracking-tight truncate">
                  Match #{match.matchNumber || 1} / <span className="text-amber-600">{roomDetails.map}</span>
                </h3>
              </div>

              {/* CLOSE BUTTON */}
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-premium-text-secondary hover:bg-premium-surface-soft hover:text-black transition-colors shrink-0 -mr-1 -mt-1"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. SCROLLABLE MODAL BODY */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1 custom-scrollbar overscroll-contain">
              
              {/* ROOM CREDENTIALS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* ROOM ID CARD */}
                <div className="p-3.5 sm:p-5 bg-premium-surface rounded-[14px] sm:rounded-[16px] border border-premium-border space-y-2.5 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] sm:text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest">
                      ROOM STATUS
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-emerald-600 font-bold flex items-center gap-1.5 uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" /> READY
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[9px] sm:text-[10px] text-premium-text-secondary uppercase tracking-widest block font-bold">ROOM ID</span>
                    <span className="font-bold text-2xl sm:text-3xl tracking-tight text-amber-600 block truncate">
                      {roomDetails.roomId}
                    </span>
                  </div>

                  <button
                    onClick={() => copyToClipboard(roomDetails.roomId, 'id')}
                    className="w-full py-2 sm:py-2.5 bg-white hover:bg-premium-background border border-premium-border text-premium-text rounded-[10px] text-[11px] sm:text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId ? 'COPIED' : 'COPY ID'}</span>
                  </button>
                </div>

                {/* ROOM PASSWORD CARD */}
                <div className="p-3.5 sm:p-5 bg-premium-surface rounded-[14px] sm:rounded-[16px] border border-premium-border space-y-2.5 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] sm:text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest">
                      SECURITY ACCESS
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-sky-600 font-bold flex items-center gap-1.5 uppercase tracking-widest">
                      <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> VERIFIED
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[9px] sm:text-[10px] text-premium-text-secondary uppercase tracking-widest block font-bold">PASSWORD</span>
                    <span className="font-bold text-2xl sm:text-3xl tracking-tight text-sky-600 block truncate">
                      {roomDetails.password}
                    </span>
                  </div>

                  <button
                    onClick={() => copyToClipboard(roomDetails.password, 'pass')}
                    className="w-full py-2 sm:py-2.5 bg-white hover:bg-premium-background border border-premium-border text-premium-text rounded-[10px] text-[11px] sm:text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95"
                  >
                    {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPass ? 'COPIED' : 'COPY PASSWORD'}</span>
                  </button>
                </div>
              </div>

              {/* LOBBY SPECIFICATIONS GRID */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center text-xs sm:text-sm">
                <div className="p-2.5 sm:p-3 bg-white rounded-[12px] border border-premium-border shadow-sm">
                  <span className="text-[9px] sm:text-[10px] text-premium-text-secondary block uppercase tracking-widest font-bold mb-0.5 sm:mb-1">MAP</span>
                  <span className="font-bold text-xs sm:text-sm text-premium-text truncate block">{roomDetails.map}</span>
                </div>
                <div className="p-2.5 sm:p-3 bg-white rounded-[12px] border border-premium-border shadow-sm">
                  <span className="text-[9px] sm:text-[10px] text-premium-text-secondary block uppercase tracking-widest font-bold mb-0.5 sm:mb-1">MODE</span>
                  <span className="font-bold text-xs sm:text-sm text-amber-600 truncate block">{roomDetails.mode}</span>
                </div>
                <div className="p-2.5 sm:p-3 bg-white rounded-[12px] border border-premium-border shadow-sm">
                  <span className="text-[9px] sm:text-[10px] text-premium-text-secondary block uppercase tracking-widest font-bold mb-0.5 sm:mb-1">SERVER</span>
                  <span className="font-bold text-xs sm:text-sm text-sky-700 truncate block">{roomDetails.server}</span>
                </div>
                <div className="p-2.5 sm:p-3 bg-white rounded-[12px] border border-premium-border shadow-sm">
                  <span className="text-[9px] sm:text-[10px] text-premium-text-secondary block uppercase tracking-widest font-bold mb-0.5 sm:mb-1">ANTI-CHEAT</span>
                  <span className="font-bold text-xs sm:text-sm text-emerald-600 truncate block">ACTIVE</span>
                </div>
              </div>

              {/* ALL PARTICIPATING SQUAD SLOTS TABLE */}
              <div className="space-y-2.5 sm:space-y-3">
                <h4 className="font-bold text-xs sm:text-sm uppercase text-premium-text flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-600 shrink-0" /> LOBBY SQUAD SLOT MATRIX ({roomDetails.slots.length}/24)
                </h4>

                {roomDetails.slots.length > 0 ? (
                  <div className="max-h-40 sm:max-h-48 overflow-y-auto border border-premium-border rounded-[14px] bg-premium-surface p-2 sm:p-3 space-y-1.5 sm:space-y-2 custom-scrollbar">
                    {roomDetails.slots.map((s) => (
                      <div key={s.slot} className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 bg-white rounded-[10px] border border-premium-border shadow-sm text-xs sm:text-sm gap-2">
                        <span className="text-premium-text-secondary font-bold text-[10px] sm:text-xs uppercase tracking-widest shrink-0">
                          SLOT #{String(s.slot).padStart(2, '0')}
                        </span>
                        <span className="text-premium-text font-bold truncate flex-1 text-center sm:text-left">
                          {s.team}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-amber-600 font-bold uppercase tracking-widest shrink-0">
                          {s.seed}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 sm:p-5 bg-premium-surface rounded-[14px] border border-premium-border text-center space-y-1">
                    <p className="text-xs font-bold text-premium-text">No squads assigned to lobby yet</p>
                    <p className="text-[10px] sm:text-[11px] text-premium-text-secondary font-medium">
                      Squads will be assigned to slot matrices once teams are registered and verified.
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* 3. STICKY MODAL FOOTER */}
            <div className="p-3 sm:p-4 border-t border-premium-border flex-shrink-0 bg-white flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
              <span className="text-[10px] font-medium text-premium-text-secondary text-center sm:text-left">
                * All 24 squads enter custom room 10 minutes prior to launch.
              </span>
              <Link href={`/matches/${match.matchNumber || match.id}`} onClick={() => setShowModal(false)} className="w-full sm:w-auto">
                <Button variant="secondary" size="md" className="w-full sm:w-auto justify-center text-xs sm:text-sm">
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
