'use client';

import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Trophy, Save, Send, Calculator } from 'lucide-react';

export default function ResultEntryModal({ isOpen, onClose, onSubmitResult, matches = [], teams = [], editingResult = null }) {
  const [selectedMatchId, setSelectedMatchId] = useState('match-07');
  const [selectedTeamId, setSelectedTeamId] = useState('team-1');
  const [placementRank, setPlacementRank] = useState(1);
  const [kills, setKills] = useState(12);
  const [mvpPlayerName, setMvpPlayerName] = useState('');
  const [mvpKills, setMvpKills] = useState('');

  // Sync state when modal opens or editingResult changes
  React.useEffect(() => {
    if (editingResult) {
      const matchIdToSet = editingResult.matchId || editingResult.id || editingResult._id;
      if (matchIdToSet) setSelectedMatchId(matchIdToSet);

      const targetWinnerName =
        typeof editingResult.winner === 'string'
          ? editingResult.winner
          : editingResult.winner?.teamName || editingResult.winner?.name;

      const targetTeam = teams.find(
        (t) =>
          (t.id || t._id) === editingResult.winner?.teamId ||
          t.name === targetWinnerName ||
          t.teamName === targetWinnerName
      );

      if (targetTeam) {
        setSelectedTeamId(targetTeam.id || targetTeam._id);
      } else if (editingResult.winner?.teamId) {
        setSelectedTeamId(editingResult.winner.teamId);
      }

      if (editingResult.leaderboard?.[0]?.rank) setPlacementRank(editingResult.leaderboard[0].rank);
      if (editingResult.winner?.kills !== undefined) setKills(editingResult.winner.kills);
      setMvpPlayerName(editingResult.mvp?.ign || editingResult.mvp?.name || '');
      setMvpKills(editingResult.mvp?.kills !== undefined ? editingResult.mvp.kills : '');
    } else if (isOpen) {
      setMvpPlayerName('');
      setMvpKills('');
      setPlacementRank(1);
      setKills(12);
      if (matches.length > 0) {
        setSelectedMatchId(matches[0].id || matches[0]._id);
      }
      if (teams.length > 0) {
        setSelectedTeamId(teams[0].id || teams[0]._id);
      }
    }
  }, [editingResult, isOpen, matches, teams]);

  // Live points calculation preview
  const getPlacementPoints = (rank) => {
    const r = parseInt(rank, 10);
    if (r === 1) return 10;
    if (r === 2) return 8;
    if (r === 3) return 5;
    return 0;
  };

  const placementPts = getPlacementPoints(placementRank);
  const killPts = parseInt(kills, 10) || 0;

  const totalPoints = placementPts + killPts;

  const selectedTeam = teams.find((t) => (t.id || t._id) === selectedTeamId) || teams[0];
  const squadPlayers = selectedTeam?.players || [];
  const allRegisteredPlayers = teams.flatMap((t) =>
    (t.players || []).map((p) => ({
      ...p,
      teamName: t.name,
    }))
  );
  const displayPlayersList = squadPlayers.length > 0 ? squadPlayers : allRegisteredPlayers;

  const handleSave = (publish = false) => {
    const selectedMatch = matches.find((m) => (m.id || m._id) === selectedMatchId) || matches[0];
    const finalMvpName = mvpPlayerName.trim() ? mvpPlayerName.trim() : (selectedTeam?.captainName || selectedTeam?.name || 'MVP Player');

    const resultPayload = {
      matchId: selectedMatchId,
      matchNumber: selectedMatch?.matchNumber || 7,
      round: selectedMatch?.round || 'Semifinal',
      map: selectedMatch?.map || 'Erangel',
      winner: {
        teamId: selectedTeam?.id || selectedTeam?._id,
        teamName: selectedTeam?.name || 'Team Winner',
        kills: killPts,
        placementPoints: placementPts,
        totalPoints,
      },
      mvp: {
        name: finalMvpName,
        ign: finalMvpName,
        team: selectedTeam?.name || 'Team Winner',
        kills: parseInt(mvpKills, 10) || 0,
      },
      leaderboard: [
        {
          rank: parseInt(placementRank, 10),
          team: selectedTeam?.name || 'Team Winner',
          teamId: selectedTeam?.id || selectedTeam?._id,
          placementPts,
          kills: killPts,
          killPts,
          total: totalPoints,
          bonus: 0,
          penalty: 0,
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
                <option key={m.id || m._id} value={m.id || m._id}>
                  Match #{m.matchNumber} - {m.round} ({m.map})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase">Select Squad / Team</label>
            <select
              value={selectedTeamId}
              onChange={(e) => {
                const newTeamId = e.target.value;
                setSelectedTeamId(newTeamId);
                const targetTeam = teams.find((t) => (t.id || t._id) === newTeamId);
                if (targetTeam && targetTeam.players && targetTeam.players.length > 0) {
                  setMvpPlayerName(targetTeam.players[0].ign || targetTeam.players[0].name || '');
                } else if (targetTeam) {
                  setMvpPlayerName(targetTeam.captainIgn || targetTeam.captainName || '');
                } else {
                  setMvpPlayerName('');
                }
              }}
              className="w-full p-2.5 bg-bgmi-dark border border-bgmi-border rounded-lg text-white font-bold"
            >
              {teams.map((t) => (
                <option key={t.id || t._id} value={t.id || t._id}>
                  {t.name} ({t.college || t.collegeName || 'NIT'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-bgmi-dark/70 rounded-xl border border-bgmi-border">
          <div className="space-y-1">
            <label className="font-bold text-slate-400 uppercase">Placement Rank</label>
            <input
              type="number"
              min="1"
              max="24"
              value={placementRank}
              onChange={(e) => setPlacementRank(e.target.value)}
              className="w-full p-2 bg-bgmi-surface border border-bgmi-border rounded text-white text-center font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-400 uppercase">Team Total Kills</label>
            <input
              type="number"
              min="0"
              value={kills}
              onChange={(e) => setKills(e.target.value)}
              className="w-full p-2 bg-bgmi-surface border border-bgmi-border rounded text-bgmi-cyan text-center font-bold"
            />
          </div>
        </div>

        {/* MVP / TOP FRAGGER ENTRY */}
        <div className="p-4 bg-[#0a0b0e] rounded-xl border border-bgmi-gold/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-bgmi-gold uppercase text-xs flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-bgmi-gold" /> MATCH MVP & TOP FRAGGER SPOTLIGHT
            </span>
            <span className="text-[10px] text-slate-400 font-mono">PLAYER STATS</span>
          </div>

          <div className="space-y-3">
            {/* Player Selection Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-between">
                <span>Select Registered Player (Dropdown)</span>
                {selectedTeam?.name && (
                  <span className="text-bgmi-gold font-mono text-[9px]">{selectedTeam.name} Roster</span>
                )}
              </label>
              <select
                value={
                  displayPlayersList.find(
                    (p) =>
                      (p.ign && mvpPlayerName.includes(p.ign)) ||
                      (p.name && mvpPlayerName.includes(p.name)) ||
                      p.ign === mvpPlayerName ||
                      p.name === mvpPlayerName
                  )?.ign ||
                  displayPlayersList.find(
                    (p) =>
                      (p.ign && mvpPlayerName.includes(p.ign)) ||
                      (p.name && mvpPlayerName.includes(p.name)) ||
                      p.ign === mvpPlayerName ||
                      p.name === mvpPlayerName
                  )?.name ||
                  ''
                }
                onChange={(e) => {
                  const selectedVal = e.target.value;
                  setMvpPlayerName(selectedVal);
                }}
                className="w-full p-2 bg-bgmi-surface border border-bgmi-border rounded text-white font-bold text-xs focus:outline-none focus:border-bgmi-gold"
              >
                <option value="">-- Choose Player from Roster --</option>
                {displayPlayersList.map((p, idx) => {
                  const val = p.ign || p.name;
                  const labelText = p.ign ? `${p.ign} (${p.name})` : p.name;
                  return (
                    <option key={p.id || p._id || idx} value={val}>
                      {labelText} {p.teamName ? `— ${p.teamName}` : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Custom Input & Kills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">MVP Player IGN / Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jonathan_OP / Tamanna Ansari"
                  value={mvpPlayerName}
                  onChange={(e) => setMvpPlayerName(e.target.value)}
                  className="w-full p-2 bg-bgmi-surface border border-bgmi-border rounded text-white font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">MVP Kills</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 7"
                  value={mvpKills}
                  onChange={(e) => setMvpKills(e.target.value)}
                  className="w-full p-2 bg-bgmi-surface border border-bgmi-border rounded text-bgmi-gold text-center font-bold font-mono"
                />
              </div>
            </div>
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
            <span>Placement ({placementPts}) + Kills ({killPts})</span>
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
