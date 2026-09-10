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
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      
      {/* BACK NAVIGATION */}
      <Link href="/media" className="inline-flex items-center gap-2 text-[10px] font-bold text-premium-text-secondary hover:text-black uppercase tracking-widest transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Media
      </Link>

      {/* HEADER */}
      <div className="border-b border-premium-border pb-6 space-y-3">
        <h1 className="font-bold text-3xl sm:text-4xl text-premium-text tracking-tight flex items-center gap-3">
          <Camera className="w-8 h-8 text-amber-600" /> Submit Media
        </h1>
        <p className="text-sm text-premium-text-secondary font-medium leading-relaxed">
          Upload match scoreboards, win results, or highlight screenshots for verified scoreboard compilation.
        </p>
      </div>

      {loadingLists ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <p className="font-bold text-[10px] uppercase tracking-widest text-premium-text-secondary">Loading form data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-premium-border rounded-[24px] p-6 sm:p-10 shadow-sm space-y-6">
          
          {/* TYPE SELECT */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary">Media Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-premium-border rounded-[12px] text-sm text-premium-text font-bold focus:outline-none focus:border-premium-text transition-colors cursor-pointer appearance-none shadow-sm"
            >
              <option value="Screenshots">In-Game Screenshot</option>
              <option value="POV">Player POV Video</option>
            </select>
          </div>

          {/* SQUAD SELECT */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Select Squad / Team
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => {
                setSelectedTeam(e.target.value);
                setSelectedPlayer('');
              }}
              className="w-full px-4 py-3 bg-white border border-premium-border rounded-[12px] text-sm text-premium-text font-bold focus:outline-none focus:border-premium-text transition-colors cursor-pointer appearance-none shadow-sm"
            >
              {teams.map((t) => (
                <option key={t.id || t._id} value={t.name}>
                  {t.name} ({t.college})
                </option>
              ))}
            </select>
          </div>

          {/* PLAYER SELECT/INPUT */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Submitting Player (IGN)
            </label>
            {teamPlayers.length > 0 ? (
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-premium-border rounded-[12px] text-sm text-premium-text font-bold focus:outline-none focus:border-premium-text transition-colors cursor-pointer appearance-none shadow-sm"
              >
                <option value="">-- Select Your Name --</option>
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
                className="w-full px-4 py-3 bg-white border border-premium-border rounded-[12px] text-sm text-premium-text font-bold placeholder:text-premium-text-secondary/50 focus:outline-none focus:border-premium-text transition-colors shadow-sm"
              />
            )}
          </div>

          {/* MATCH SELECT */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" /> Select Match
            </label>
            <select
              value={selectedMatch}
              onChange={(e) => setSelectedMatch(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-premium-border rounded-[12px] text-sm text-premium-text font-bold focus:outline-none focus:border-premium-text transition-colors cursor-pointer appearance-none shadow-sm"
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
            <label className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary">Upload Screenshot File (PNG/JPG)</label>
            <div className="relative border-2 border-dashed border-premium-border hover:border-black rounded-[16px] p-8 transition-colors flex flex-col items-center justify-center gap-3 bg-premium-surface cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-10 h-10 text-premium-text-secondary group-hover:text-black transition-colors" />
              <div className="text-center">
                <p className="font-bold text-premium-text text-sm">
                  {fileName ? `Selected: ${fileName}` : 'Click or drag screenshot here'}
                </p>
                <p className="text-[10px] font-medium text-premium-text-secondary mt-1">Maximum file size: 10MB</p>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-6 border-t border-premium-border">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={Send}
              className="w-full"
              disabled={submitting}
            >
              {submitting ? 'Uploading...' : 'Submit for Review'}
            </Button>
          </div>

        </form>
      )}

    </div>
  );
}
