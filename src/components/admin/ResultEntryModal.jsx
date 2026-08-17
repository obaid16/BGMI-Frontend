'use client';

import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Trophy, Save, Send, Calculator, Shield, ArrowUpDown, UserCheck } from 'lucide-react';

export default function ResultEntryModal({
  isOpen,
  onClose,
  onSubmitResult,
  matches = [],
  teams = [],
  results = [],
  editingResult = null
}) {
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [teamScores, setTeamScores] = useState([]);
  const [mvpPlayerName, setMvpPlayerName] = useState('');
  const [mvpTeamName, setMvpTeamName] = useState('');
  const [mvpKills, setMvpKills] = useState('');

  // Official BGMI placement points formula
  const getPlacementPoints = (rank) => {
    const r = parseInt(rank, 10);
    if (r === 1) return 10;
    if (r === 2) return 8;
    if (r === 3) return 5;
    if (r === 4) return 3;
    if (r === 5) return 1;
    return 0;
  };

  // Synchronize state when modal opens, editingResult changes, or selectedMatchId changes
  useEffect(() => {
    if (!isOpen) return;

    let targetMatchId = selectedMatchId;
    if (editingResult) {
      targetMatchId = editingResult.matchId || editingResult.id || editingResult._id;
    } else if (!targetMatchId && matches.length > 0) {
      targetMatchId = matches[0].id || matches[0]._id;
    }

    if (!targetMatchId && matches.length > 0) {
      targetMatchId = matches[0].id || matches[0]._id;
    }

    if (targetMatchId !== selectedMatchId) {
      setSelectedMatchId(targetMatchId);
    }

    const targetMatch = matches.find((m) => String(m.id || m._id) === String(targetMatchId)) || matches[0];

    // Find existing match result from editingResult or results list
    const targetResult = editingResult || (results && results.find((r) =>
      String(r.matchId || r.id || r._id) === String(targetMatchId) ||
      String(r.matchId) === String(targetMatch?.id) ||
      Number(r.matchNumber) === Number(targetMatch?.matchNumber)
    ));

    if (targetResult) {
      setMvpPlayerName(targetResult.mvp?.ign || targetResult.mvp?.name || '');
      setMvpTeamName(targetResult.mvp?.team || targetResult.winner?.teamName || '');
      setMvpKills(targetResult.mvp?.kills !== undefined ? targetResult.mvp.kills : '');

      const existingMap = new Map();
      if (targetResult.leaderboard && Array.isArray(targetResult.leaderboard)) {
        targetResult.leaderboard.forEach((item) => {
          const key = item.teamId || item.team;
          existingMap.set(key, item);
        });
      }

      const initialScores = teams.map((t, idx) => {
        const tId = t.id || t._id;
        const existing = existingMap.get(tId) || existingMap.get(t.name) || existingMap.get(t.teamName);
        const rank = existing ? Number(existing.rank) : idx + 1;
        const kills = existing ? Number(existing.kills !== undefined ? existing.kills : existing.killPts || 0) : 0;
        const pPts = getPlacementPoints(rank);

        return {
          teamId: tId,
          teamName: t.name || t.teamName,
          college: t.college || t.collegeName || 'NIT',
          rank: rank,
          kills: kills,
          placementPts: pPts,
          total: pPts + kills
        };
      });

      initialScores.sort((a, b) => a.rank - b.rank);
      setTeamScores(initialScores);
    } else {
      setMvpPlayerName('');
      setMvpTeamName('');
      setMvpKills('');

      const defaultScores = teams.map((t, idx) => {
        const rank = idx + 1;
        const kills = 0;
        const pPts = getPlacementPoints(rank);
        return {
          teamId: t.id || t._id,
          teamName: t.name || t.teamName,
          college: t.college || t.collegeName || 'NIT',
          rank: rank,
          kills: kills,
          placementPts: pPts,
          total: pPts + kills
        };
      });

      defaultScores.sort((a, b) => a.rank - b.rank);
      setTeamScores(defaultScores);
    }
  }, [isOpen, selectedMatchId, editingResult, matches, teams, results]);

  // Handle live score change for a specific team
  const handleScoreChange = (teamId, field, value) => {
    setTeamScores((prev) =>
      prev.map((ts) => {
        if (ts.teamId !== teamId) return ts;

        const updatedRank = field === 'rank' ? Math.max(1, parseInt(value, 10) || 1) : ts.rank;
        const updatedKills = field === 'kills' ? Math.max(0, parseInt(value, 10) || 0) : ts.kills;
        const pPts = getPlacementPoints(updatedRank);

        return {
          ...ts,
          rank: updatedRank,
          kills: updatedKills,
          placementPts: pPts,
          total: pPts + updatedKills
        };
      })
    );
  };

  // Sort team scores by total points (highest to lowest) and auto-assign ranks 1..N
  const handleAutoRank = () => {
    setTeamScores((prev) => {
      const sorted = [...prev].sort((a, b) => b.total - a.total);
      return sorted.map((ts, idx) => {
        const newRank = idx + 1;
        const pPts = getPlacementPoints(newRank);
        return {
          ...ts,
          rank: newRank,
          placementPts: pPts,
          total: pPts + ts.kills
        };
      });
    });
  };

  // All registered players across teams for MVP selection
  const allRegisteredPlayers = teams.flatMap((t) =>
    (t.players || []).map((p) => ({
      ...p,
      teamName: t.name || t.teamName
    }))
  );

  const winnerTeamScore = teamScores.find((ts) => Number(ts.rank) === 1) || teamScores[0];
  const winnerTeamObj = teams.find((t) => (t.id || t._id) === winnerTeamScore?.teamId) || teams[0];

  const handleMvpDropdownSelect = (playerName) => {
    setMvpPlayerName(playerName);
    const foundPlayer = allRegisteredPlayers.find((p) => (p.ign || p.name) === playerName);
    if (foundPlayer) {
      setMvpTeamName(foundPlayer.teamName);
      if (foundPlayer.kills) setMvpKills(foundPlayer.kills);
    }
  };

  const handleSave = (publish = false) => {
    const selectedMatch = matches.find((m) => (m.id || m._id) === selectedMatchId) || matches[0];
    const winnerScore = teamScores.find((ts) => Number(ts.rank) === 1) || teamScores[0] || {
      teamId: teams[0]?.id || teams[0]?._id,
      teamName: teams[0]?.name || 'Winner Squad',
      kills: 10,
      placementPts: 10,
      total: 20
    };

    const finalMvpName = mvpPlayerName.trim()
      ? mvpPlayerName.trim()
      : (winnerTeamObj?.captainName || winnerScore.teamName || 'MVP Player');

    const finalMvpTeam = mvpTeamName.trim()
      ? mvpTeamName.trim()
      : (winnerScore.teamName || 'Winner Squad');

    const leaderboard = teamScores.map((ts) => ({
      rank: parseInt(ts.rank, 10) || 1,
      team: ts.teamName,
      teamId: ts.teamId,
      placementPts: ts.placementPts,
      placementPoints: ts.placementPts,
      kills: parseInt(ts.kills, 10) || 0,
      killPts: parseInt(ts.kills, 10) || 0,
      killPoints: parseInt(ts.kills, 10) || 0,
      total: ts.total,
      totalPoints: ts.total,
      bonus: 0,
      penalty: 0
    })).sort((a, b) => a.rank - b.rank);

    const resultPayload = {
      matchId: selectedMatchId,
      matchNumber: selectedMatch?.matchNumber || 1,
      round: selectedMatch?.round || 'Semifinal',
      map: selectedMatch?.map || 'Erangel',
      winner: {
        teamId: winnerScore.teamId,
        teamName: winnerScore.teamName,
        kills: winnerScore.kills,
        placementPoints: winnerScore.placementPts,
        totalPoints: winnerScore.total
      },
      mvp: {
        name: finalMvpName,
        ign: finalMvpName,
        team: finalMvpTeam,
        kills: parseInt(mvpKills, 10) || 0
      },
      leaderboard,
      publish
    };

    onSubmitResult(resultPayload);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Match Result Entry & Every Team Scorecard" maxWidth="max-w-4xl">
      <div className="space-y-5 text-xs max-h-[80vh] overflow-y-auto pr-1">

        {/* TOP CONTROLS: MATCH SELECTOR & WWCD HIGHLIGHT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-bgmi-dark/80 p-4 rounded-xl border border-bgmi-border">
          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase">1. Select Target Match</label>
            <select
              value={selectedMatchId}
              onChange={(e) => setSelectedMatchId(e.target.value)}
              className="w-full p-2.5 bg-bgmi-surface border border-bgmi-border rounded-lg text-white font-bold"
            >
              {matches.map((m) => (
                <option key={m.id || m._id} value={m.id || m._id}>
                  Match #{m.matchNumber} - {m.round} ({m.map})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1 bg-bgmi-surface p-2.5 rounded-lg border border-bgmi-gold/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-bgmi-gold uppercase block">WWCD Champion (Rank #1)</span>
              <p className="font-display font-black text-sm text-white">{winnerTeamScore?.teamName || 'N/A'}</p>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs font-bold text-bgmi-cyan">{winnerTeamScore?.kills || 0} Kills</span>
              <p className="text-sm font-black text-bgmi-gold">{winnerTeamScore?.total || 0} PTS</p>
            </div>
          </div>
        </div>

        {/* FULL MULTI-TEAM SCORECARD BREAKDOWN EDITOR */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display font-black text-sm text-white uppercase flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-bgmi-gold" /> All Teams Match Scorecard Table
              </h3>
              <p className="text-[11px] text-slate-400">Enter Rank and Kills for every team. Placement & Total Points update automatically.</p>
            </div>
            <Button variant="secondary" size="sm" icon={ArrowUpDown} onClick={handleAutoRank}>
              Auto-Rank by Total Pts
            </Button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-bgmi-border bg-bgmi-surface">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-bgmi-dark text-slate-400 font-display font-bold uppercase text-[10px] border-b border-bgmi-border">
                <tr>
                  <th className="p-3 text-center w-20">Rank</th>
                  <th className="p-3">Team / Squad Name</th>
                  <th className="p-3 text-center w-28">Kills</th>
                  <th className="p-3 text-center w-28">Placement Pts</th>
                  <th className="p-3 text-center w-28">Total Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bgmi-border/40 font-mono">
                {teamScores.map((ts) => {
                  const isWinner = Number(ts.rank) === 1;
                  return (
                    <tr key={ts.teamId} className={isWinner ? 'bg-bgmi-gold/10 font-bold' : 'hover:bg-bgmi-dark/40'}>
                      {/* RANK INPUT */}
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="1"
                          max="24"
                          value={ts.rank}
                          onChange={(e) => handleScoreChange(ts.teamId, 'rank', e.target.value)}
                          className={`w-14 p-1 text-center font-bold rounded border ${
                            isWinner
                              ? 'bg-bgmi-gold text-slate-900 border-bgmi-gold'
                              : 'bg-bgmi-dark text-white border-bgmi-border'
                          }`}
                        />
                      </td>

                      {/* TEAM NAME */}
                      <td className="p-3 font-sans font-bold text-white flex items-center gap-2">
                        {isWinner && <Trophy className="w-4 h-4 text-bgmi-gold shrink-0" />}
                        <span>{ts.teamName}</span>
                      </td>

                      {/* KILLS INPUT */}
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="0"
                          value={ts.kills}
                          onChange={(e) => handleScoreChange(ts.teamId, 'kills', e.target.value)}
                          className="w-16 p-1 text-center font-bold rounded bg-bgmi-dark text-bgmi-cyan border border-bgmi-border"
                        />
                      </td>

                      {/* PLACEMENT POINTS */}
                      <td className="p-3 text-center font-bold text-slate-300">
                        {ts.placementPts} PTS
                      </td>

                      {/* TOTAL POINTS */}
                      <td className="p-3 text-center font-black text-bgmi-gold text-sm">
                        {ts.total} PTS
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* SINGLE MATCH MVP SPOTLIGHT ENTRY */}
        <div className="p-4 bg-[#0a0b0e] rounded-xl border border-bgmi-gold/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-bgmi-gold uppercase text-xs flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-bgmi-gold" /> SINGLE MATCH MVP SPOTLIGHT
            </span>
            <span className="text-[10px] text-slate-400 font-mono">1 MVP PER MATCH</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1 sm:col-span-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Select Registered Player (Dropdown)</label>
              <select
                value={
                  allRegisteredPlayers.find(
                    (p) =>
                      (p.ign && mvpPlayerName.includes(p.ign)) ||
                      (p.name && mvpPlayerName.includes(p.name)) ||
                      p.ign === mvpPlayerName ||
                      p.name === mvpPlayerName
                  )?.ign ||
                  allRegisteredPlayers.find(
                    (p) =>
                      (p.ign && mvpPlayerName.includes(p.ign)) ||
                      (p.name && mvpPlayerName.includes(p.name)) ||
                      p.ign === mvpPlayerName ||
                      p.name === mvpPlayerName
                  )?.name ||
                  ''
                }
                onChange={(e) => handleMvpDropdownSelect(e.target.value)}
                className="w-full p-2 bg-bgmi-surface border border-bgmi-border rounded text-white font-bold text-xs"
              >
                <option value="">-- Choose Player from Any Team Roster --</option>
                {allRegisteredPlayers.map((p, idx) => {
                  const val = p.ign || p.name;
                  const labelText = p.ign ? `${p.ign} (${p.name})` : p.name;
                  return (
                    <option key={p.id || p._id || idx} value={val}>
                      {labelText} — [{p.teamName}]
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">MVP Player Name / IGN</label>
              <input
                type="text"
                placeholder="e.g. OBAID (IGL)"
                value={mvpPlayerName}
                onChange={(e) => setMvpPlayerName(e.target.value)}
                className="w-full p-2 bg-bgmi-surface border border-bgmi-border rounded text-white font-bold text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">MVP Team Name</label>
              <input
                type="text"
                placeholder="e.g. GodLike Esports"
                value={mvpTeamName}
                onChange={(e) => setMvpTeamName(e.target.value)}
                className="w-full p-2 bg-bgmi-surface border border-bgmi-border rounded text-white font-bold text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">MVP Match Kills</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 7"
                value={mvpKills}
                onChange={(e) => setMvpKills(e.target.value)}
                className="w-full p-2 bg-bgmi-surface border border-bgmi-border rounded text-bgmi-gold text-center font-bold font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* LIVE FORMULA PREVIEW */}
        <div className="p-4 bg-gradient-to-r from-bgmi-surface via-bgmi-card to-bgmi-surface border border-bgmi-gold/50 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 font-bold uppercase">
            <span className="flex items-center gap-1.5 text-bgmi-gold">
              <Calculator className="w-4 h-4" /> Live Score Formula
            </span>
            <span className="text-[10px] text-slate-500">Official BGMI Scoring Rules</span>
          </div>
          <p className="text-xs text-slate-300 font-mono">
            Rank #1 = 10 pts • Rank #2 = 8 pts • Rank #3 = 5 pts • Rank #4 = 3 pts • Rank #5 = 1 pt • 1 Kill = 1 pt
          </p>
        </div>

        {/* ACTION BUTTONS */}
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


