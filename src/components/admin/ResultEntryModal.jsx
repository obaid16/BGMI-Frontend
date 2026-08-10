'use client';

import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Trophy, Save, Send, Calculator } from 'lucide-react';

export default function ResultEntryModal({ isOpen, onClose, onSubmitResult, matches = [], teams = [] }) {
  const [selectedMatchId, setSelectedMatchId] = useState('match-07');
  const [selectedTeamId, setSelectedTeamId] = useState('team-1');
  const [placementRank, setPlacementRank] = useState(1);
  const [kills, setKills] = useState(12);
  const [bonus, setBonus] = useState(1);
  const [penalty, setPenalty] = useState(0);

  // Sync state once data loads
  React.useEffect(() => {
    if (matches.length > 0 && (selectedMatchId === 'match-07' || !matches.some(m => m.id === selectedMatchId))) {
      setSelectedMatchId(matches[0].id);
    }
  }, [matches, selectedMatchId]);

  React.useEffect(() => {
    if (teams.length > 0 && (selectedTeamId === 'team-1' || !teams.some(t => t.id === selectedTeamId))) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId]);

  // Live points calculation preview
  const getPlacementPoints = (rank) => {
    const r = parseInt(rank, 10);
    if (r === 1) return 15;
    if (r === 2) return 12;
    if (r === 3) return 10;
    if (r === 4) return 8;
    if (r === 5) return 6;
    if (r === 6) return 4;
    if (r === 7) return 2;
    if (r === 8) return 1;
    return 0;
  };

  const placementPts = getPlacementPoints(placementRank);
  const killPts = parseInt(kills, 10) || 0;
  const bonusPts = parseInt(bonus, 10) || 0;
  const penaltyPts = parseInt(penalty, 10) || 0;

  const totalPoints = placementPts + killPts + bonusPts - penaltyPts;

  const handleSave = (publish = false) => {
    const selectedTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];
    const selectedMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];

    const resultPayload = {
      matchId: selectedMatchId,
      matchNumber: selectedMatch?.matchNumber || 7,
      round: selectedMatch?.round || 'Semifinal',
      map: selectedMatch?.map || 'Erangel',
      winner: {
        teamId: selectedTeam?.id,
        teamName: selectedTeam?.name || 'IIT Bombay Titans',
        kills: killPts,
        placementPoints: placementPts,
        totalPoints,
      },
      leaderboard: [
        {
          rank: parseInt(placementRank, 10),
          team: selectedTeam?.name || 'IIT Bombay Titans',
          teamId: selectedTeam?.id,
          placementPts,
          kills: killPts,
          killPts,
          total: totalPoints,
          bonus: bonusPts,
          penalty: penaltyPts,
        },
      ],
      publish,
    };

    onSubmitResult(resultPayload);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Match Result Entry & Live Score Calculator" maxWidth="max-w-xl">
      <div className="space-y-5 text-xs">
        
        {/* Match & Team Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase">Select Target Match</label>
            <select
              value={selectedMatchId}
              onChange={(e) => setSelectedMatchId(e.target.value)}
              className="w-full p-2.5 bg-bgmi-dark border border-bgmi-border rounded-lg text-white font-bold"
            >
              {matches.map((m) => (
                <option key={m.id} value={m.id}>
                  Match #{m.matchNumber} - {m.round} ({m.map})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase">Select Squad / Team</label>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full p-2.5 bg-bgmi-dark border border-bgmi-border rounded-lg text-white font-bold"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.college})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-bgmi-dark/70 rounded-xl border border-bgmi-border">
          <div className="space-y-1">
            <label className="font-bold text-slate-400 uppercase">Placement Rank</label>
            <input
              type="number"
              min="1"
              max="16"
              value={placementRank}
              onChange={(e) => setPlacementRank(e.target.value)}
              className="w-full p-2 bg-bgmi-surface border border-bgmi-border rounded text-white text-center font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-400 uppercase">Kill Count</label>
            <input
              type="number"
              min="0"
              value={kills}
              onChange={(e) => setKills(e.target.value)}
              className="w-full p-2 bg-bgmi-surface border border-bgmi-border rounded text-bgmi-cyan text-center font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-400 uppercase">WWCD Bonus</label>
            <input
              type="number"
              min="0"
              value={bonus}
              onChange={(e) => setBonus(e.target.value)}
              className="w-full p-2 bg-bgmi-surface border border-bgmi-border rounded text-bgmi-gold text-center font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-400 uppercase">Penalty Pts</label>
            <input
              type="number"
              min="0"
              value={penalty}
              onChange={(e) => setPenalty(e.target.value)}
              className="w-full p-2 bg-bgmi-surface border border-bgmi-border rounded text-rose-400 text-center font-bold"
            />
          </div>
        </div>

        {/* LIVE CALCULATION PREVIEW BOX */}
        <div className="p-4 bg-gradient-to-r from-bgmi-surface via-bgmi-card to-bgmi-surface border border-bgmi-gold/50 rounded-xl clip-tactical space-y-2">
          <div className="flex items-center justify-between text-slate-400 font-bold uppercase">
            <span className="flex items-center gap-1.5 text-bgmi-gold">
              <Calculator className="w-4 h-4" /> Live Score Preview Formula
            </span>
            <span className="text-[10px] text-slate-500">Official BGMI Rules</span>
          </div>

          <div className="flex items-center justify-between text-sm pt-2 border-t border-bgmi-border/40 font-mono">
            <span>Placement ({placementPts}) + Kills ({killPts}) + Bonus ({bonusPts}) - Penalty ({penaltyPts})</span>
            <span className="font-display font-black text-2xl text-bgmi-gold">{totalPoints} PTS</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-bgmi-border/60 flex items-center justify-end gap-3">
          <Button variant="secondary" size="md" icon={Save} onClick={() => handleSave(false)}>
            SAVE DRAFT RESULT
          </Button>
          <Button variant="primary" size="md" icon={Send} onClick={() => handleSave(true)}>
            PUBLISH RESULT LIVE
          </Button>
        </div>

      </div>
    </Modal>
  );
}
