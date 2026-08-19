'use client';

import React, { useState, useEffect } from 'react';
import { getTeams, getMatches, uploadMedia } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import { Camera, ArrowLeft, Send, UploadCloud, Users, Trophy, User } from 'lucide-react';
import Button from '@/components/common/Button';
import Link from 'next/link';

export default function SubmitScreenshotPage() {
  const { showToast } = useToast();
  const router = useRouter();

  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Screenshots'); // default to Screenshots
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedMatch, setSelectedMatch] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingLists(true);
        const [teamsData, matchesData] = await Promise.all([
          getTeams(),
          getMatches()
        ]);
        setTeams(teamsData);
        setMatches(matchesData);
        
        if (teamsData.length > 0) setSelectedTeam(teamsData[0].name);
        if (matchesData.length > 0) setSelectedMatch(`Match #${matchesData[0].matchNumber} - ${matchesData[0].map}`);
      } catch (err) {
        console.error('Failed to load form dropdown data:', err);
        showToast('Failed to load team and match selections', 'error');
      } finally {
        setLoadingLists(false);
      }
    }
    loadData();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        showToast('File size must be less than 10MB', 'error');
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      showToast('Please upload a screenshot file', 'error');
      return;
    }
    if (!selectedTeam || !selectedPlayer || !selectedMatch) {
      showToast('Please fill in all details', 'error');
      return;
    }

    try {
      setSubmitting(true);
      
      const autoTitle = `${selectedTeam} - ${selectedPlayer} (${type === 'POV' ? 'POV' : 'Screenshot'}) - ${selectedMatch}`;

      const formData = new FormData();
      formData.append('title', autoTitle);
      formData.append('type', type);
      formData.append('team', selectedTeam);
      formData.append('player', selectedPlayer);
      formData.append('match', selectedMatch);
      formData.append('file', file);

      const res = await uploadMedia(formData);
      if (res && res.success) {
        showToast('Screenshot submitted successfully! Under review.', 'success');
        router.push('/media');
      } else {
        showToast(res?.message || 'Failed to submit screenshot', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error uploading file', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Get selected team's players to populate player IGN suggestions
  const currentTeamObj = teams.find(t => t.name === selectedTeam);
  const teamPlayers = currentTeamObj?.players || [];

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* BACK NAVIGATION */}
      <Link href="/media" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors">
        <ArrowLeft className="w-4 h-4 text-bgmi-cyan" /> Back to Media Gallery
      </Link>

      {/* HEADER */}
      <div className="border-b border-bgmi-border/60 pb-4 space-y-2">
        <h1 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-wide flex items-center gap-2">
          <Camera className="w-6 h-6 text-bgmi-cyan" /> Submit Match Screenshot / POV
        </h1>
        <p className="text-xs text-slate-400">
          Upload match scoreboards, win results, or highlight screenshots for verified scoreboard compilation.
        </p>
      </div>

      {loadingLists ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="w-8 h-8 border-4 border-bgmi-cyan border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Loading form selections...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-bgmi-surface border border-bgmi-border rounded-2xl p-6 sm:p-8 clip-tactical shadow-2xl space-y-5 text-xs">
          
          {/* TYPE SELECT */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Media Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2.5 bg-bgmi-dark border border-bgmi-border rounded-xl text-white focus:outline-none focus:border-bgmi-cyan transition-colors cursor-pointer font-bold"
            >
              <option value="Screenshots">In-Game Screenshot</option>
              <option value="POV">Player POV Video</option>
            </select>
          </div>

          {/* SQUAD SELECT */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" /> Select Your Squad / Team
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => {
                setSelectedTeam(e.target.value);
                setSelectedPlayer('');
              }}
              className="w-full px-4 py-2.5 bg-bgmi-dark border border-bgmi-border rounded-xl text-white focus:outline-none focus:border-bgmi-cyan transition-colors cursor-pointer"
            >
              {teams.map((t) => (
                <option key={t.id || t._id} value={t.name}>
                  {t.name} ({t.college})
                </option>
              ))}
            </select>
          </div>

          {/* PLAYER SELECT/INPUT */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" /> Player Submitting (IGN)
            </label>
            {teamPlayers.length > 0 ? (
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-bgmi-dark border border-bgmi-border rounded-xl text-white focus:outline-none focus:border-bgmi-cyan transition-colors cursor-pointer"
              >
                <option value="">-- Select Your Player Name --</option>
                {teamPlayers.map((p, idx) => (
                  <option key={p.id || p._id || idx} value={p.ign}>
                    {p.ign} ({p.name})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                required
                placeholder="Enter your In-Game Name (IGN)"
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="w-full px-4 py-2.5 bg-bgmi-dark border border-bgmi-border rounded-xl text-white focus:outline-none focus:border-bgmi-cyan transition-colors"
              />
            )}
          </div>

          {/* MATCH SELECT */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-slate-400" /> Select Match Played
            </label>
            <select
              value={selectedMatch}
              onChange={(e) => setSelectedMatch(e.target.value)}
              className="w-full px-4 py-2.5 bg-bgmi-dark border border-bgmi-border rounded-xl text-white focus:outline-none focus:border-bgmi-cyan transition-colors cursor-pointer"
            >
              {matches.map((m) => (
                <option key={m.id || m._id} value={`Match #${m.matchNumber} - ${m.map}`}>
                  Match #{m.matchNumber} - {m.round} ({m.map})
                </option>
              ))}
            </select>
          </div>

          {/* SCREENSHOT FILE UPLOAD */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Upload Screenshot File (PNG/JPG)</label>
            <div className="relative border-2 border-dashed border-bgmi-border hover:border-bgmi-cyan/50 rounded-2xl p-6 transition-colors flex flex-col items-center justify-center gap-2 bg-bgmi-dark/30 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-10 h-10 text-slate-500" />
              <div className="text-center">
                <p className="font-bold text-white text-xs">
                  {fileName ? `Selected: ${fileName}` : 'Click or Drag screenshot here'}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">Image files up to 10MB</p>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 border-t border-bgmi-border/40">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={Send}
              className="w-full"
              disabled={submitting}
            >
              {submitting ? 'Uploading Proof...' : 'Submit Screenshot Under Review'}
            </Button>
          </div>

        </form>
      )}

    </div>
  );
}
