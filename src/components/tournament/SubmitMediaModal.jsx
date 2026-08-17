'use client';

import React, { useState } from 'react';
import { X, Upload, Video, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Button from '@/components/common/Button';
import { submitMedia } from '@/services/api';

export default function SubmitMediaModal({ isOpen, onClose, onSuccess }) {
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

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid screenshot image file (PNG, JPG, WEBP).');
        return;
      }
      setError('');
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.team || !formData.player) {
      setError('Please fill in Title, Team Name, and Player/IGL Name.');
      return;
    }

    if (!selectedFile && !formData.videoUrl) {
      setError('Please select a screenshot file to upload or provide a video URL.');
      return;
    }

    try {
      setSubmitting(true);

      const submissionData = new FormData();
      submissionData.append('title', formData.title);
      submissionData.append('type', formData.type);
      submissionData.append('team', formData.team);
      submissionData.append('player', formData.player);
      submissionData.append('match', formData.match);

      if (formData.videoUrl) {
        submissionData.append('videoUrl', formData.videoUrl);
      }

      if (selectedFile) {
        submissionData.append('file', selectedFile);
      }

      if (filePreview) {
        submissionData.append('imageUrl', filePreview);
      }

      const res = await submitMedia(submissionData);

      if (res && res.success) {
        setSubmittedSuccess(true);
        setTimeout(() => {
          setSubmittedSuccess(false);
          onSuccess && onSuccess();
          onClose();
          // Reset form
          setFormData({
            title: '',
            type: 'Screenshots',
            team: '',
            player: '',
            match: 'Match #01',
            videoUrl: '',
          });
          setSelectedFile(null);
          setFilePreview(null);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-bgmi-dark border border-bgmi-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl clip-tactical relative">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-bgmi-border flex items-center justify-between bg-bgmi-surface/60">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-bgmi-gold" />
            <h2 className="font-display font-bold text-lg text-white uppercase tracking-wider">
              Submit Match Media / Screenshot
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-bgmi-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {submittedSuccess ? (
            <div className="py-10 text-center space-y-3">
              <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="font-display font-bold text-xl text-white uppercase">
                Screenshot Submitted Successfully!
              </h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Your post-match screenshot/POV clip has been submitted for admin verification. It will appear live in the gallery once approved.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* MEDIA TYPE & MATCH */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Category Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-bgmi-surface border border-bgmi-border rounded-lg px-3 py-2 text-xs text-white focus:border-bgmi-gold focus:outline-none"
                  >
                    <option value="Screenshots">In-Game Screenshot</option>
                    <option value="Results">Referee Scorecard</option>
                    <option value="POV">Player POV Video</option>
                    <option value="Team Photos">Team Photo</option>
                    <option value="Player Photos">Player Photo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Match Context
                  </label>
                  <select
                    value={formData.match}
                    onChange={(e) => setFormData({ ...formData, match: e.target.value })}
                    className="w-full bg-bgmi-surface border border-bgmi-border rounded-lg px-3 py-2 text-xs text-white focus:border-bgmi-gold focus:outline-none"
                  >
                    <option value="Match #01">Match #01 / Erangel</option>
                    <option value="Match #02">Match #02 / Livik</option>
                    <option value="Match #03">Match #03 / Livik</option>
                    <option value="Match #04">Match #04 / Erangel</option>
                    <option value="Match #05">Match #05 / Miramar</option>
                    <option value="Match #06">Match #06 / Erangel</option>
                    <option value="Media Day">Media Day / General</option>
                  </select>
                </div>
              </div>

              {/* TITLE */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Title / Description *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Match #06 Final Circle 1v3 Clutch Scorecard"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-bgmi-surface border border-bgmi-border rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-bgmi-gold focus:outline-none"
                  required
                />
              </div>

              {/* TEAM & PLAYER */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Squad / Team Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BITS Apex Esports"
                    value={formData.team}
                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                    className="w-full bg-bgmi-surface border border-bgmi-border rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-bgmi-gold focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Player / IGL Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Yash (IGL)"
                    value={formData.player}
                    onChange={(e) => setFormData({ ...formData, player: e.target.value })}
                    className="w-full bg-bgmi-surface border border-bgmi-border rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-bgmi-gold focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* FILE UPLOAD DRAG & DROP */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Upload Screenshot Image *
                </label>
                <div className="relative border-2 border-dashed border-bgmi-border hover:border-bgmi-gold/50 rounded-xl p-4 text-center bg-bgmi-surface/30 transition-colors">
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
                        alt="Preview"
                        className="max-h-36 mx-auto rounded border border-bgmi-border object-contain"
                      />
                      <p className="text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5" /> File Selected: {selectedFile?.name}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1 py-2">
                      <Upload className="w-8 h-8 text-bgmi-cyan mx-auto opacity-80" />
                      <p className="text-xs text-slate-300 font-medium">
                        Click to select or drag & drop post-match screenshot
                      </p>
                      <p className="text-[10px] text-slate-500">Supports PNG, JPG, WEBP (Max 10MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* OPTIONAL YOUTUBE / VIDEO POV URL */}
              {formData.type === 'POV' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Video className="w-3.5 h-3.5 text-bgmi-cyan" /> YouTube / Drive POV Video URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/embed/..."
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full bg-bgmi-surface border border-bgmi-border rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-bgmi-gold focus:outline-none"
                  />
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <div className="pt-3 border-t border-bgmi-border flex items-center justify-end gap-3">
                <Button variant="secondary" size="sm" type="button" onClick={onClose} disabled={submitting}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={submitting}>
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Upload className="w-4 h-4" /> Submit Screenshot
                    </span>
                  )}
                </Button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
