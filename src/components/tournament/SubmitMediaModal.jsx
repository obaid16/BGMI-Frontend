'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Upload, 
  Video, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Film, 
  Trash2, 
  RefreshCw 
} from 'lucide-react';
import { submitMedia, getTeams, getMatches } from '@/services/api';

export default function SubmitMediaModal({ isOpen, onClose, onSuccess, initialMatch, initialTeam }) {
  const [mounted, setMounted] = useState(false);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const [formData, setFormData] = useState({
    type: 'Screenshots', // 'Screenshots' | 'POV'
    team: '',
    player: '',
    match: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch live teams and matches whenever modal opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function loadData() {
      try {
        setLoadingData(true);
        const [teamsData, matchesData] = await Promise.all([
          getTeams('All'),
          getMatches('All'),
        ]);

        if (!isMounted) return;

        const loadedTeams = Array.isArray(teamsData) ? teamsData : [];
        const loadedMatches = Array.isArray(matchesData) ? matchesData : [];

        setTeams(loadedTeams);
        setMatches(loadedMatches);

        // Pre-fill team if initialTeam or first team available
        setFormData((prev) => {
          let chosenTeam = prev.team;
          if (!chosenTeam) {
            if (initialTeam) {
              chosenTeam = initialTeam;
            } else if (loadedTeams.length > 0) {
              chosenTeam = loadedTeams[0].name || loadedTeams[0].teamName || '';
            }
          }

          // Pre-fill match
          let chosenMatch = prev.match;
          if (!chosenMatch) {
            if (initialMatch) {
              chosenMatch = initialMatch;
            } else if (loadedMatches.length > 0) {
              const liveMatch = loadedMatches.find((m) => m.status === 'Live') || loadedMatches[0];
              chosenMatch = `Match #${liveMatch.matchNumber} - ${liveMatch.map || liveMatch.title || 'Erangel'}`;
            } else {
              chosenMatch = 'Match #01 - Erangel';
            }
          }

          return {
            ...prev,
            team: chosenTeam,
            match: chosenMatch,
          };
        });
      } catch (err) {
        console.error('Failed to load dropdown data:', err);
      } finally {
        if (isMounted) setLoadingData(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, initialMatch, initialTeam]);

  // Derive roster for the currently selected squad
  const currentRoster = useMemo(() => {
    if (!formData.team) return [];
    const teamObj = teams.find(
      (t) => (t.name || t.teamName) === formData.team
    );
    if (!teamObj || !Array.isArray(teamObj.players)) return [];
    return teamObj.players;
  }, [teams, formData.team]);

  // Auto-select first player whenever team changes, if current player not in roster
  useEffect(() => {
    if (currentRoster.length > 0) {
      const playerExists = currentRoster.some(
        (p) => (p.ign || p.name) === formData.player
      );
      if (!playerExists) {
        const firstPlayer = currentRoster[0].ign || currentRoster[0].name || '';
        setFormData((prev) => ({ ...prev, player: firstPlayer }));
      }
    } else {
      setFormData((prev) => ({ ...prev, player: '' }));
    }
  }, [currentRoster]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  // File validation & selection helper
  const validateAndSetFile = (file) => {
    if (!file) return;
    setError('');

    if (formData.type === 'Screenshots') {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid screenshot image (PNG, JPG, WEBP).');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Screenshot size exceeds 10MB limit.');
        return;
      }

      setSelectedFile(file);
      setFileInfo({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: 'image',
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // POV Video file validation
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mkv|mov)$/i.test(file.name);
      if (!isVideo) {
        setError('Please upload a valid video file (MP4, WEBM, MKV, MOV).');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setError('Video file size exceeds 50MB limit.');
        return;
      }

      setSelectedFile(file);
      setFileInfo({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: 'video',
      });

      const videoUrl = URL.createObjectURL(file);
      setFilePreview(videoUrl);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  // Drag & Drop event handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const clearSelectedFile = (e) => {
    if (e) e.stopPropagation();
    setSelectedFile(null);
    setFilePreview(null);
    setFileInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTypeChange = (newType) => {
    setFormData((prev) => ({ ...prev, type: newType }));
    clearSelectedFile();
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.team) {
      setError('Please select a Squad.');
      return;
    }

    if (!formData.player) {
      setError('Please select a Player IGN.');
      return;
    }

    if (!formData.match) {
      setError('Please select a Tournament Match.');
      return;
    }

    if (!selectedFile) {
      setError(formData.type === 'Screenshots' 
        ? 'Please upload or drop a screenshot file.' 
        : 'Please upload or drop a POV video recording.');
      return;
    }

    try {
      setSubmitting(true);

      // Auto-generate title cleanly from squad, player, match, and type
      const autoTitle = `${formData.team} - ${formData.player} (${formData.type === 'POV' ? 'POV' : 'Screenshot'}) - ${formData.match}`;

      const submitData = new FormData();
      submitData.append('title', autoTitle);
      submitData.append('type', formData.type);
      submitData.append('team', formData.team);
      submitData.append('player', formData.player);
      submitData.append('match', formData.match);

      // Append file using both keys for seamless backend & multer compatibility
      submitData.append('file', selectedFile);
      submitData.append('mediaFile', selectedFile);

      const res = await submitMedia(submitData);

      if (res && (res.success || res.data)) {
        setSubmittedSuccess(true);
        setTimeout(() => {
          setSubmittedSuccess(false);
          onClose();
          if (onSuccess) onSuccess();
        }, 1800);
      } else {
        setError(res?.message || 'Failed to submit match proof. Please try again.');
      }
    } catch (err) {
      console.error('Submit media error:', err);
      setError(err.message || 'An error occurred while uploading. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Viewport Backdrop */}
      <div 
        className="fixed inset-0 w-full h-full bg-black/80 dark:bg-black/85 backdrop-blur-md transition-opacity duration-200 z-[9999]" 
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div 
        className="relative w-full max-w-lg bg-[#FAF8F5] dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl overflow-hidden shadow-2xl z-[10000] my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-between bg-white dark:bg-[#181E2C]">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-bgmi-gold" />
            <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white uppercase tracking-wider">
              Submit Match Media / Proof
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          
          {submittedSuccess ? (
            <div className="py-10 text-center space-y-3">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white uppercase">
                Media Submitted Successfully!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Referees will review and publish your submission shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* MEDIA TYPE TOGGLE */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleTypeChange('Screenshots')}
                  className={`p-3 rounded-xl border text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    formData.type === 'Screenshots'
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-bgmi-red dark:border-bgmi-red shadow-editorial'
                      : 'bg-white dark:bg-[#181E2C] text-slate-700 dark:text-slate-300 border-[#E7E3DA] dark:border-[#1E2638] hover:border-bgmi-gold'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Screenshot</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange('POV')}
                  className={`p-3 rounded-xl border text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    formData.type === 'POV'
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-bgmi-red dark:border-bgmi-red shadow-editorial'
                      : 'bg-white dark:bg-[#181E2C] text-slate-700 dark:text-slate-300 border-[#E7E3DA] dark:border-[#1E2638] hover:border-bgmi-gold'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>POV / Replay</span>
                </button>
              </div>

              {/* SQUAD & PLAYER ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* SQUAD NAME DROPDOWN */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-300">
                      Squad Name
                    </label>
                    {loadingData && (
                      <span className="text-[10px] text-bgmi-gold flex items-center gap-1">
                        <Loader2 className="w-2.5 h-2.5 animate-spin" /> Loading...
                      </span>
                    )}
                  </div>
                  <select
                    name="team"
                    value={formData.team}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-bgmi-red shadow-editorial-sm transition-colors cursor-pointer"
                  >
                    <option value="">-- Select Squad / Team --</option>
                    {teams.map((t) => {
                      const teamName = t.name || t.teamName;
                      return (
                        <option key={t.id || t._id || teamName} value={teamName}>
                          {teamName} {t.shortName ? `(${t.shortName})` : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* PLAYER IGN DROPDOWN */}
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-300">
                    Player IGN
                  </label>
                  <select
                    name="player"
                    value={formData.player}
                    onChange={handleInputChange}
                    disabled={!formData.team}
                    required
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-bgmi-red shadow-editorial-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {!formData.team ? (
                      <option value="">-- Select Squad first --</option>
                    ) : currentRoster.length === 0 ? (
                      <option value="">No players in squad roster</option>
                    ) : (
                      <>
                        <option value="">-- Select Player IGN --</option>
                        {currentRoster.map((p, idx) => {
                          const ignVal = p.ign || p.name || `Player ${idx + 1}`;
                          return (
                            <option key={p.id || p.bgmiId || idx} value={ignVal}>
                              {p.ign ? `${p.ign} (${p.name || p.role || 'Player'})` : p.name}
                            </option>
                          );
                        })}
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* TOURNAMENT MATCH SELECTION (LIVE DATA) */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-300">
                  Tournament Match
                </label>
                <select
                  name="match"
                  value={formData.match}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-bgmi-red shadow-editorial-sm transition-colors cursor-pointer"
                >
                  {matches.length === 0 ? (
                    <>
                      <option value="Match #01 - Erangel">Match #01 - Erangel</option>
                      <option value="Match #02 - Miramar">Match #02 - Miramar</option>
                      <option value="Match #03 - Sanhok">Match #03 - Sanhok</option>
                      <option value="Match #04 - Erangel Finals">Match #04 - Erangel Finals</option>
                    </>
                  ) : (
                    matches.map((m) => {
                      const matchVal = `Match #${m.matchNumber} - ${m.map || m.title || 'Erangel'}`;
                      return (
                        <option key={m.id || m._id || m.matchNumber} value={matchVal}>
                          Match #{m.matchNumber} - {m.map || m.title || 'Erangel'} {m.status ? `(${m.status})` : ''}
                        </option>
                      );
                    })
                  )}
                  <option value="Campus Scrims / Friendly">Campus Scrims / Friendly</option>
                </select>
              </div>

              {/* DRAG & DROP UPLOAD ZONE (FOR SCREENSHOT & POV) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-300">
                    {formData.type === 'Screenshots' 
                      ? 'Upload Screenshot (Max 10MB)' 
                      : 'Upload POV Video (Max 50MB)'}
                  </label>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={clearSelectedFile}
                      className="text-[10px] font-mono text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Remove File
                    </button>
                  )}
                </div>

                <div 
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer relative transition-all duration-200 ${
                    isDragging 
                      ? 'border-bgmi-red bg-red-500/10 scale-[1.01] shadow-lg' 
                      : 'border-[#E7E3DA] dark:border-[#1E2638] hover:border-bgmi-gold bg-white dark:bg-[#181E2C]/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={formData.type === 'Screenshots' ? 'image/*' : 'video/*,.mp4,.webm,.mkv,.mov'}
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {filePreview ? (
                    <div className="space-y-3 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                      {formData.type === 'Screenshots' ? (
                        <img
                          src={filePreview}
                          alt="Screenshot Preview"
                          className="h-36 max-w-full mx-auto rounded-xl object-contain border border-[#E7E3DA] dark:border-[#1E2638] bg-black/5 dark:bg-black/40 shadow-sm"
                        />
                      ) : (
                        <div className="relative mx-auto max-w-xs">
                          <video
                            src={filePreview}
                            controls
                            className="h-36 w-full rounded-xl object-cover border border-[#E7E3DA] dark:border-[#1E2638] bg-black/60 shadow-sm"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                          {fileInfo?.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {fileInfo?.size}
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 rounded-lg flex items-center gap-1.5 transition-colors"
                        >
                          <RefreshCw className="w-3 h-3" /> Change
                        </button>
                        <button
                          type="button"
                          onClick={clearSelectedFile}
                          className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-[11px] font-semibold text-red-600 dark:text-red-400 rounded-lg flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5 py-3 pointer-events-none">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 dark:bg-red-500/10 flex items-center justify-center text-bgmi-gold dark:text-bgmi-red">
                        {formData.type === 'Screenshots' ? (
                          <Upload className={`w-6 h-6 ${isDragging ? 'animate-bounce' : ''}`} />
                        ) : (
                          <Film className={`w-6 h-6 ${isDragging ? 'animate-bounce' : ''}`} />
                        )}
                      </div>

                      <div>
                        <span className="text-xs font-semibold block text-slate-800 dark:text-slate-200">
                          {isDragging 
                            ? 'Drop your file here now' 
                            : formData.type === 'Screenshots'
                              ? 'Click to browse or drop screenshot here'
                              : 'Click to browse or drop POV video here'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mt-0.5">
                          {formData.type === 'Screenshots' 
                            ? 'PNG, JPG, WEBP accepted (Max 10MB)' 
                            : 'MP4, WEBM, MKV, MOV accepted (Max 50MB)'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E7E3DA] dark:border-[#1E2638]">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-4 py-2.5 text-xs font-display font-bold uppercase text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !selectedFile}
                  className="px-6 py-2.5 bg-slate-950 hover:bg-slate-800 dark:bg-bgmi-red dark:hover:bg-bgmi-red-hover text-white text-xs font-display font-bold uppercase tracking-wider rounded-xl shadow-editorial transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{submitting ? 'Uploading...' : 'Submit for Review'}</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
