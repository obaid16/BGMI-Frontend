'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Video, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Button from '@/components/common/Button';
import { submitMedia } from '@/services/api';

export default function SubmitMediaModal({ isOpen, onClose, onSuccess }) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Screenshots',
    team: '',
    player: '',
    match: 'Match #01',
    videoUrl: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid screenshot image file (PNG, JPG, WEBP).');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size exceeds 10MB limit.');
        return;
      }
      setSelectedFile(file);
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please provide a title or description.');
      return;
    }

    if (formData.type === 'Screenshots' && !selectedFile && !filePreview) {
      setError('Please select a screenshot file to upload.');
      return;
    }

    if (formData.type === 'POV' && !formData.videoUrl.trim()) {
      setError('Please provide a YouTube, Twitch, or Google Drive link for POV recording.');
      return;
    }

    try {
      setSubmitting(true);

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('type', formData.type);
      submitData.append('team', formData.team || 'Independent Roster');
      submitData.append('player', formData.player || 'Player POV');
      submitData.append('match', formData.match);

      if (formData.type === 'Screenshots' && selectedFile) {
        submitData.append('mediaFile', selectedFile);
      } else if (formData.type === 'POV') {
        submitData.append('videoUrl', formData.videoUrl);
      }

      const res = await submitMedia(submitData);

      if (res && (res.success || res.data)) {
        setSubmittedSuccess(true);
        setTimeout(() => {
          setSubmittedSuccess(false);
          onClose();
          if (onSuccess) onSuccess();
        }, 1800);
      } else {
        setError(res?.message || 'Failed to submit screenshot. Please try again.');
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
        className="relative w-full max-w-lg bg-[#FAF8F5] dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl overflow-hidden shadow-2xl z-[10000] my-auto"
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
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
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
                  onClick={() => setFormData((prev) => ({ ...prev, type: 'Screenshots' }))}
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
                  onClick={() => setFormData((prev) => ({ ...prev, type: 'POV' }))}
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

              {/* TITLE */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-300">
                  Title / Match Highlight
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g., Erangel Final Circle 1v3 Clutch"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-bgmi-red shadow-editorial-sm"
                />
              </div>

              {/* SQUAD & PLAYER ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-300">
                    Squad Name
                  </label>
                  <input
                    type="text"
                    name="team"
                    placeholder="e.g., Soul Reapers"
                    value={formData.team}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-bgmi-red shadow-editorial-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-300">
                    Player IGN
                  </label>
                  <input
                    type="text"
                    name="player"
                    placeholder="e.g., JonathanOP"
                    value={formData.player}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-bgmi-red shadow-editorial-sm"
                  />
                </div>
              </div>

              {/* MATCH SELECTION */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-300">
                  Tournament Match
                </label>
                <select
                  name="match"
                  value={formData.match}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-bgmi-red shadow-editorial-sm"
                >
                  <option value="Match #01">Match #01 - Erangel</option>
                  <option value="Match #02">Match #02 - Miramar</option>
                  <option value="Match #03">Match #03 - Sanhok</option>
                  <option value="Match #04">Match #04 - Erangel Finals</option>
                  <option value="Scrims / Friendly">Campus Scrims / Friendly</option>
                </select>
              </div>

              {/* FILE OR VIDEO INPUT */}
              {formData.type === 'Screenshots' ? (
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-300">
                    Upload Screenshot (Max 10MB)
                  </label>
                  <div className="border-2 border-dashed border-[#E7E3DA] dark:border-[#1E2638] hover:border-bgmi-gold rounded-2xl p-6 text-center cursor-pointer relative bg-white dark:bg-[#181E2C]/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {filePreview ? (
                      <div className="space-y-2">
                        <img
                          src={filePreview}
                          alt="Screenshot Preview"
                          className="h-32 mx-auto rounded-xl object-contain border border-[#E7E3DA] dark:border-[#1E2638]"
                        />
                        <span className="text-[10px] font-mono text-slate-500 block">Click or drag to change image</span>
                      </div>
                    ) : (
                      <div className="space-y-2 text-slate-500">
                        <Upload className="w-8 h-8 mx-auto text-slate-400" />
                        <span className="text-xs font-medium block text-slate-700 dark:text-slate-300">
                          Click to browse or drop victory screenshot here
                        </span>
                        <span className="text-[10px] font-mono block">PNG, JPG, WEBP accepted</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-300">
                    POV Stream / Video Link
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    placeholder="https://youtube.com/watch?v=... or Google Drive link"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-bgmi-red shadow-editorial-sm"
                  />
                  <p className="text-[10px] text-slate-500 font-mono">
                    Ensure link permissions are set to public view for verification.
                  </p>
                </div>
              )}

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
                  disabled={submitting}
                  className="px-6 py-2.5 bg-slate-950 hover:bg-slate-800 dark:bg-bgmi-red dark:hover:bg-bgmi-red-hover text-white text-xs font-display font-bold uppercase tracking-wider rounded-xl shadow-editorial transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
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
