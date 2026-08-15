'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Radio, Clock, Swords, Shield, Copy, Check, X, Users, Key, MapPin, Trophy } from 'lucide-react';
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
      <div className="relative overflow-hidden bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-xl p-6 sm:p-8 clip-tactical shadow-lg dark:shadow-2xl space-y-6">
        <div className="absolute inset-0 bg-tactical-grid opacity-15 pointer-events-none" />

        {/* 1. MATCH SPOTLIGHT HEADER */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            {isLive ? (
              <Badge variant="live" size="md">
                <span className="flex items-center gap-1.5 font-broadcast font-bold">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-bgmi-red" /> ● LIVE BROADCAST
                </span>
              </Badge>
            ) : (
              <span className="px-3 py-1 bg-bgmi-gold/10 text-amber-600 dark:text-bgmi-gold border border-amber-500/30 dark:border-bgmi-gold/30 rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                LIVE MATCH RADAR SPOTLIGHT
              </span>
            )}
            <span className="font-broadcast font-bold text-base sm:text-lg text-slate-900 dark:text-white uppercase">
              MATCH #{match.matchNumber || 1} — <span className="text-bgmi-red">{match.map || 'Erangel'}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-bgmi-red" /> {match.time || '10:30 AM'}
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-bgmi-gold" /> {match.round || 'Grand Finals'}
            </span>
            <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400">
              <Users className="w-3.5 h-3.5" /> {totalSquadsCount} Squads ({totalPlayersCount} Players)
            </span>
          </div>
        </div>

        {/* 2. BATTLE ROYALE SHOWCASE: RADAR VISUAL, MAP SPECS & PARTICIPATING SQUADS */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* MAP & RADAR HUD DISPLAY BOX (5 COLS) */}
          <div className="lg:col-span-5 p-5 bg-slate-50 dark:bg-[#0B0E14] rounded-lg border border-slate-200 dark:border-white/10 flex flex-col justify-between space-y-4 relative overflow-hidden">
            
            {/* TACTICAL RADAR SWEEP GRAPHIC */}
            <div className="relative w-full h-36 bg-slate-900/90 rounded border border-bgmi-red/30 overflow-hidden flex items-center justify-center p-2 group">
              <div className="absolute inset-0 bg-tactical-grid opacity-30" />
              
              {/* Radar concentric circles */}
              <div className="absolute w-28 h-28 rounded-full border border-bgmi-red/20" />
              <div className="absolute w-20 h-20 rounded-full border border-bgmi-red/30" />
              <div className="absolute w-12 h-12 rounded-full border border-bgmi-red/40" />
              <div className="absolute w-full h-[1px] bg-bgmi-red/20" />
              <div className="absolute h-full w-[1px] bg-bgmi-red/20" />

              {/* Radar Sweeping Beam Animation */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-bgmi-red/20 to-transparent animate-spin origin-center duration-3000 pointer-events-none" />

              {/* Simulated Squad Radar Blips */}
              <span className="absolute top-8 left-12 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="absolute top-8 left-12 w-2 h-2 rounded-full bg-emerald-400" />
              <span className="absolute bottom-10 right-14 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="absolute bottom-10 right-14 w-2 h-2 rounded-full bg-amber-400" />
              <span className="absolute top-12 right-10 w-2 h-2 rounded-full bg-bgmi-red animate-ping" />
              <span className="absolute top-12 right-10 w-2 h-2 rounded-full bg-bgmi-red" />

              {/* Radar Center HUD Text */}
              <div className="relative z-10 text-center space-y-0.5 pointer-events-none">
                <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-emerald-400 uppercase block">
                  RADAR SCANNER ACTIVE
                </span>
                <span className="text-sm font-broadcast font-black text-white uppercase tracking-wider block">
                  {match.map || 'ERANGEL'} ZONE
                </span>
                <span className="text-[9px] font-mono text-slate-400 block">
                  34.12° N, 74.83° E • AIR DROP INCOMING
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-bgmi-gold uppercase tracking-widest flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> BATTLEGROUND MAP
                </span>
                <span className="text-xs font-broadcast font-bold text-slate-900 dark:text-white uppercase">{match.map || 'Erangel'}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className="p-2 bg-slate-100 dark:bg-slate-900/80 rounded border border-slate-200 dark:border-white/5">
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 block uppercase">MODE</span>
                  <span className="font-bold text-slate-900 dark:text-white">TPP SQUAD</span>
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-900/80 rounded border border-slate-200 dark:border-white/5">
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 block uppercase">MATCH TYPE</span>
                  <span className="font-bold text-bgmi-red">BATTLE ROYALE</span>
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-900/80 rounded border border-slate-200 dark:border-white/5">
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 block uppercase">CAPACITY</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">{totalSquadsCount} SQUADS</span>
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-900/80 rounded border border-slate-200 dark:border-white/5">
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 block uppercase">ROOM CODE</span>
                  <span className="font-bold text-amber-600 dark:text-bgmi-gold">DROP @ 10:15</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-white/10">
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                * All {totalSquadsCount} registered squads drop simultaneously into the arena custom lobby.
              </p>
            </div>
          </div>

          {/* ALL PARTICIPATING SQUADS GRID (7 COLS) */}
          <div className="lg:col-span-7 p-5 bg-slate-50 dark:bg-[#0B0E14] rounded-lg border border-slate-200 dark:border-white/10 space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
              <h4 className="font-broadcast font-bold text-xs uppercase text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Swords className="w-4 h-4 text-bgmi-red" /> LOBBY SQUAD MATRIX ({participatingSquads.length}/{totalSquadsCount} SEEDED)
              </h4>
              <span className="text-[10px] font-mono text-amber-600 dark:text-bgmi-gold font-bold uppercase">LIVE FEED</span>
            </div>

            {/* SQUAD CHIPS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {participatingSquads.map((sq, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-white hover:bg-slate-100 dark:bg-slate-900/80 dark:hover:bg-slate-800 rounded border border-slate-200 dark:border-white/10 flex items-center gap-2 transition-colors min-w-0"
                >
                  <div className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/15 flex items-center justify-center text-[10px] font-broadcast font-bold text-bgmi-red flex-shrink-0">
                    {sq.logo ? (
                      <img src={sq.logo} alt={sq.teamName || sq.name} className="w-full h-full object-cover rounded" />
                    ) : (
                      <span>{(sq.teamName || sq.name || 'T').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="truncate text-left">
                    <p className="font-broadcast font-bold text-xs text-slate-900 dark:text-white uppercase truncate">
                      {sq.teamName || sq.name}
                    </p>
                    <p className="text-[9px] font-mono text-slate-500 dark:text-slate-400">
                      Slot #{String(idx + 1).padStart(2, '0')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
              <span>Points System: WWCD = 10 PTS • Kill = 1 PT</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">ANTI-CHEAT MOSAC ENABLED</span>
            </div>
          </div>

        </div>

        {/* 3. FOOTER COUNTDOWN & ACTION STRIP */}
        <div className="relative z-10 pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Ticking Timer */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase">LOBBY LAUNCH IN:</span>
            <div className="flex items-center gap-1.5 font-mono font-bold text-base text-bgmi-red">
              <span className="bg-slate-100 dark:bg-[#0B0E14] px-2.5 py-1 rounded border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span>:</span>
              <span className="bg-slate-100 dark:bg-[#0B0E14] px-2.5 py-1 rounded border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span>:</span>
              <span className="bg-slate-100 dark:bg-[#0B0E14] px-2.5 py-1 rounded border border-slate-200 dark:border-white/10 text-bgmi-red">
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
            className="px-6 py-2.5 text-xs font-black w-full sm:w-auto"
          >
            LOBBY DETAILS & ROOM CODE →
          </Button>
        </div>

      </div>

      {/* LOBBY DETAILS & ROOM CREDENTIALS MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/15 rounded-lg max-w-2xl w-full p-6 sm:p-8 clip-tactical shadow-2xl space-y-6 relative text-slate-900 dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* MODAL HEADER */}
            <div className="space-y-1 border-b border-slate-200 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-bgmi-red/20 text-bgmi-red border border-bgmi-red/40 rounded text-[10px] font-mono font-bold uppercase tracking-widest">
                  OFFICIAL BATTLE ROYALE LOBBY
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{match.round || 'GRAND FINALS'}</span>
              </div>
              <h3 className="font-broadcast font-bold text-2xl uppercase">
                MATCH #{match.matchNumber || 1} — <span className="text-bgmi-red">{roomDetails.map}</span> CUSTOM ROOM
              </h3>
            </div>

            {/* ROOM CREDENTIALS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ROOM ID */}
              <div className="p-4 bg-slate-50 dark:bg-[#0B0E14] rounded border border-slate-200 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 font-bold uppercase">
                    <Key className="w-4 h-4 text-amber-600 dark:text-bgmi-gold" /> ROOM ID
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-2xl tracking-wider text-amber-600 dark:text-bgmi-gold">
                    {roomDetails.roomId}
                  </span>
                  <button
                    onClick={() => copyToClipboard(roomDetails.roomId, 'id')}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-white/15 rounded text-xs font-mono flex items-center gap-1 text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    {copiedId ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedId ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
              </div>

              {/* ROOM PASSWORD */}
              <div className="p-4 bg-slate-50 dark:bg-[#0B0E14] rounded border border-slate-200 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 font-bold uppercase">
                    <Shield className="w-4 h-4 text-sky-600 dark:text-sky-400" /> PASSWORD
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">VERIFIED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-2xl tracking-wider text-sky-600 dark:text-sky-400">
                    {roomDetails.password}
                  </span>
                  <button
                    onClick={() => copyToClipboard(roomDetails.password, 'pass')}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-white/15 rounded text-xs font-mono flex items-center gap-1 text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    {copiedPass ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedPass ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* LOBBY SPECIFICATIONS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
              <div className="p-2.5 bg-slate-50 dark:bg-[#0B0E14] rounded border border-slate-200 dark:border-white/10">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 block uppercase">MAP</span>
                <span className="font-bold text-slate-900 dark:text-white">{roomDetails.map}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-[#0B0E14] rounded border border-slate-200 dark:border-white/10">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 block uppercase">MODE</span>
                <span className="font-bold text-amber-600 dark:text-bgmi-gold">{roomDetails.mode}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-[#0B0E14] rounded border border-slate-200 dark:border-white/10">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 block uppercase">SERVER</span>
                <span className="font-bold text-sky-600 dark:text-sky-400">{roomDetails.server}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-[#0B0E14] rounded border border-slate-200 dark:border-white/10">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 block uppercase">ANTI-CHEAT</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">MOSAC ACTIVE</span>
              </div>
            </div>

            {/* ALL PARTICIPATING SQUAD SLOTS TABLE */}
            <div className="space-y-2">
              <h4 className="font-broadcast font-bold text-xs uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-bgmi-red" /> LOBBY SQUAD SLOT MATRIX ({roomDetails.slots.length}/24 SQUADS)
              </h4>
              <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-white/10 rounded bg-slate-50 dark:bg-[#0B0E14] p-2 text-xs font-mono space-y-1">
                {roomDetails.slots.map((s) => (
                  <div key={s.slot} className="flex items-center justify-between px-3 py-1.5 bg-white dark:bg-slate-900/60 rounded border border-slate-200 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400 font-bold">SLOT #{String(s.slot).padStart(2, '0')}</span>
                    <span className="text-slate-900 dark:text-white font-bold">{s.team}</span>
                    <span className="text-[10px] text-amber-600 dark:text-bgmi-gold font-bold">{s.seed}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                * All 24 squads enter custom room 10 minutes prior to launch.
              </span>
              <Link href={`/matches/${match.matchNumber || match.id}`} onClick={() => setShowModal(false)}>
                <Button variant="secondary" size="sm" className="w-full sm:w-auto text-xs">
                  GO TO FULL MATCH PAGE →
                </Button>
              </Link>
            </div>

          </div>
        </div>
      )}
    </>
  );
}



