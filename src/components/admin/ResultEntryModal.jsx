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
    if (r === 2) return 7;
    return 0; // 3rd, 4th, and all others don't have any points
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
    <Modal isOpen={isOpen} onClose={onClose} title="Scorecard & Leaderboard Editor" maxWidth="max-w-5xl">
      <div className="space-y-6 max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">

        {/* TOP CONTROLS: MATCH SELECTOR & WWCD HIGHLIGHT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-premium-surface-soft p-5 rounded-[20px] border border-premium-border">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">1. Select Target Match</label>
            <select
              value={selectedMatchId}
              onChange={(e) => setSelectedMatchId(e.target.value)}
              className="w-full p-3.5 bg-white border border-premium-border rounded-[12px] text-premium-text font-bold text-sm focus:outline-none focus:border-premium-text shadow-sm appearance-none cursor-pointer"
            >
              {matches.map((m) => (
                <option key={m.id || m._id} value={m.id || m._id}>
                  Match #{m.matchNumber} - {m.round} ({m.map})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-amber-50 p-4 rounded-[16px] border border-amber-200 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block">WWCD Champion (Rank #1)</span>
              <p className="font-bold text-lg text-amber-900 mt-0.5">{winnerTeamScore?.teamName || 'N/A'}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-700">{winnerTeamScore?.kills || 0} Kills</span>
              <p className="text-xl font-bold text-amber-800">{winnerTeamScore?.total || 0} PTS</p>
            </div>
          </div>
        </div>

        {/* FULL MULTI-TEAM SCORECARD BREAKDOWN EDITOR */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-premium-text flex items-center gap-2">
                <Calculator className="w-5 h-5 text-premium-text-secondary" /> Every Team Scorecard
              </h3>
              <p className="text-[11px] font-medium text-premium-text-secondary mt-1">Enter Rank and Kills. Placement & Total Points update automatically.</p>
            </div>
            <Button variant="secondary" size="sm" icon={ArrowUpDown} onClick={handleAutoRank}>
              Auto-Rank by Total Pts
            </Button>
          </div>

          <div className="overflow-x-auto rounded-[16px] border border-premium-border shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-premium-background text-premium-text-secondary font-bold uppercase text-[10px] tracking-widest border-b border-premium-border">
                <tr>
                  <th className="px-4 py-3.5 text-center w-24">Rank</th>
                  <th className="px-4 py-3.5">Team / Squad Name</th>
                  <th className="px-4 py-3.5 text-center w-32">Kills</th>
                  <th className="px-4 py-3.5 text-center w-32">Placement Pts</th>
                  <th className="px-4 py-3.5 text-center w-32">Total Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-premium-border bg-white">
                {teamScores.map((ts) => {
                  const isWinner = Number(ts.rank) === 1;
                  return (
                    <tr key={ts.teamId} className={isWinner ? 'bg-amber-50/30' : 'hover:bg-premium-surface-soft transition-colors'}>
                      {/* RANK INPUT */}
                      <td className="px-4 py-2.5 text-center">
                        <input
                          type="number"
                          min="1"
                          max="24"
                          value={ts.rank}
                          onChange={(e) => handleScoreChange(ts.teamId, 'rank', e.target.value)}
                          className={`w-16 p-2 text-center font-bold rounded-[8px] border outline-none ${
                            isWinner
                              ? 'bg-amber-100 text-amber-900 border-amber-300 focus:border-amber-500'
                              : 'bg-white text-premium-text border-premium-border focus:border-premium-text'
                          }`}
                        />
                      </td>

                      {/* TEAM NAME */}
                      <td className="px-4 py-2.5 font-bold text-premium-text flex items-center gap-2">
                        {isWinner && <Trophy className="w-4 h-4 text-amber-600 shrink-0" />}
                        <span>{ts.teamName}</span>
                      </td>

                      {/* KILLS INPUT */}
                      <td className="px-4 py-2.5 text-center">
                        <input
                          type="number"
                          min="0"
                          value={ts.kills}
                          onChange={(e) => handleScoreChange(ts.teamId, 'kills', e.target.value)}
                          className="w-20 p-2 text-center font-bold rounded-[8px] bg-white text-emerald-700 border border-premium-border focus:border-emerald-500 outline-none"
                        />
                      </td>

                      {/* PLACEMENT POINTS */}
                      <td className="px-4 py-2.5 text-center font-bold text-premium-text-secondary">
                        {ts.placementPts} PTS
                      </td>

                      {/* TOTAL POINTS */}
                      <td className="px-4 py-2.5 text-center font-bold text-base text-premium-text">
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
        <div className="p-6 bg-premium-surface border border-premium-border rounded-[20px] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-premium-border pb-3">
            <span className="font-bold text-sm text-premium-text flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-premium-text-secondary" /> Match MVP Spotlight
            </span>
            <span className="text-[10px] text-premium-text-secondary font-bold uppercase tracking-widest bg-premium-background px-2 py-1 rounded">1 MVP PER MATCH</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-1">
            <div className="space-y-1.5 sm:col-span-3">
              <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">Select Registered Player</label>
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
                className="w-full p-3 bg-white border border-premium-border rounded-[12px] text-premium-text font-bold text-sm focus:outline-none focus:border-premium-text shadow-sm appearance-none cursor-pointer"
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

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">MVP Player Name / IGN</label>
              <input
                type="text"
                placeholder="e.g. OBAID (IGL)"
                value={mvpPlayerName}
                onChange={(e) => setMvpPlayerName(e.target.value)}
                className="w-full p-3 bg-white border border-premium-border rounded-[12px] text-premium-text font-bold text-sm focus:outline-none focus:border-premium-text shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">MVP Team Name</label>
              <input
                type="text"
                placeholder="e.g. GodLike Esports"
                value={mvpTeamName}
                onChange={(e) => setMvpTeamName(e.target.value)}
                className="w-full p-3 bg-white border border-premium-border rounded-[12px] text-premium-text font-bold text-sm focus:outline-none focus:border-premium-text shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">MVP Match Kills</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 7"
                value={mvpKills}
                onChange={(e) => setMvpKills(e.target.value)}
                className="w-full p-3 bg-white border border-premium-border rounded-[12px] text-emerald-700 text-center font-bold text-sm focus:outline-none focus:border-emerald-500 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* LIVE FORMULA PREVIEW */}
        <div className="p-4 bg-premium-background rounded-[16px] border border-premium-border flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span className="flex items-center justify-center sm:justify-start gap-2 text-premium-text font-bold text-xs">
            <Calculator className="w-4 h-4 text-premium-text-secondary" /> Official Scoring Formula
          </span>
          <p className="text-[11px] text-premium-text-secondary font-medium">
            Rank #1 = 10 pts • Rank #2 = 8 pts • Rank #3 = 5 pts • Rank #4 = 3 pts • Rank #5 = 1 pt • 1 Kill = 1 pt
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="pt-6 border-t border-premium-border flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <Button variant="outline" size="md" icon={Save} onClick={() => handleSave(false)} className="w-full sm:w-auto">
            Save Draft Result
          </Button>
          <Button variant="primary" size="md" icon={Send} onClick={() => handleSave(true)} className="w-full sm:w-auto">
            Publish Live Scorecard
          </Button>
        </div>

      </div>
    </Modal>
  );
}
