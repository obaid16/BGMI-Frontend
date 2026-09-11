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

    if (!formData.team || !formData.player) {
      setError('Please fill in Team Name and Player/IGL Name.');
      return;
    }

    if (!selectedFile && !formData.videoUrl) {
      setError('Please select a screenshot file to upload or provide a video URL.');
      return;
    }

    try {
      setSubmitting(true);

      const generatedTitle = `${formData.team} - ${formData.player} (${formData.type === 'POV' ? 'POV Video' : 'Screenshot'}) - ${formData.match}`;

      const submissionData = new FormData();
      submissionData.append('title', formData.title || generatedTitle);
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

  const modalContent = (
    <div className="fixed inset-0 w-screen h-screen z-[100] flex items-center justify-center p-4 overflow-y-auto">
      {/* Viewport Backdrop */}
      <div 
        className="fixed inset-0 w-full h-full bg-premium-background/80 backdrop-blur-md transition-opacity duration-300 z-[100]" 
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div 
        className="relative w-full max-w-lg bg-white border border-premium-border rounded-[24px] overflow-hidden shadow-2xl z-[101] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* MODAL HEADER */}
        <div className="px-6 py-5 border-b border-premium-border flex items-center justify-between bg-premium-surface">
          <div className="flex items-center gap-3">
            <Upload className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-lg text-premium-text">
              Submit Media
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center rounded-full text-premium-text-secondary hover:text-black hover:bg-premium-surface-soft transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {submittedSuccess ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="font-bold text-xl text-premium-text">
                Submitted Successfully!
              </h3>
              <p className="text-sm text-premium-text-secondary max-w-xs mx-auto font-medium">
                Your post-match screenshot/POV clip has been submitted for admin verification. It will appear live in the gallery once approved.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="p-4 rounded-[12px] bg-red-50 border border-red-200 flex items-center gap-3 text-sm text-red-600 font-medium">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* MEDIA TYPE & MATCH */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">
                    Category Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-white border border-premium-border rounded-[12px] px-3 py-3 text-sm font-bold text-premium-text focus:border-premium-text focus:outline-none shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="Screenshots">In-Game Screenshot</option>
                    <option value="POV">Player POV Video</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">
                    Match Context
                  </label>
                  <select
                    value={formData.match}
                    onChange={(e) => setFormData({ ...formData, match: e.target.value })}
                    className="w-full bg-white border border-premium-border rounded-[12px] px-3 py-3 text-sm font-bold text-premium-text focus:border-premium-text focus:outline-none shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="Match #01">Match #01 / Erangel</option>
                    <option value="Match #02">Match #02 / Livik</option>
                    <option value="Match #03">Match #03 / Livik</option>
                    <option value="Match #04">Match #04 / Erangel</option>
                    <option value="Match #05">Match #05 / Rondo</option>
                    <option value="Match #06">Match #06 / Miramar</option>
                    <option value="Media Day">Media Day / General</option>
                  </select>
                </div>
              </div>

              {/* TEAM & PLAYER */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">
                    Squad / Team Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BITS Apex Esports"
                    value={formData.team}
                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                    className="w-full bg-white border border-premium-border rounded-[12px] px-3 py-3 text-sm font-bold text-premium-text placeholder:text-premium-text-secondary/50 focus:border-premium-text focus:outline-none shadow-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">
                    Player / IGL Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Yash (IGL)"
                    value={formData.player}
                    onChange={(e) => setFormData({ ...formData, player: e.target.value })}
                    className="w-full bg-white border border-premium-border rounded-[12px] px-3 py-3 text-sm font-bold text-premium-text placeholder:text-premium-text-secondary/50 focus:border-premium-text focus:outline-none shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* FILE UPLOAD DRAG & DROP */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">
                  {formData.type === 'POV' ? 'Upload POV Media / Thumbnail File *' : 'Upload Screenshot Image *'}
                </label>
                <div className="relative border-2 border-dashed border-premium-border hover:border-black rounded-[16px] p-6 text-center bg-premium-surface transition-colors group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {filePreview ? (
                    <div className="space-y-3">
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="max-h-40 mx-auto rounded-[8px] border border-premium-border object-contain shadow-sm"
                      />
                      <p className="text-xs text-emerald-600 font-bold flex items-center justify-center gap-1.5">
                        <ImageIcon className="w-4 h-4" /> File Selected: {selectedFile?.name}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 py-4">
                      <Upload className="w-8 h-8 text-premium-text-secondary mx-auto group-hover:text-black transition-colors" />
                      <p className="text-sm text-premium-text font-bold">
                        {formData.type === 'POV' ? 'Click to select or drag & drop POV file/screenshot' : 'Click to select or drag & drop post-match screenshot'}
                      </p>
                      <p className="text-xs text-premium-text-secondary font-medium">Supports PNG, JPG, WEBP (Max 10MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* OPTIONAL YOUTUBE / VIDEO POV URL */}
              {formData.type === 'POV' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block flex items-center gap-1">
                    <Video className="w-3.5 h-3.5" /> YouTube / Drive POV Video URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/embed/..."
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full bg-white border border-premium-border rounded-[12px] px-3 py-3 text-sm font-bold text-premium-text placeholder:text-premium-text-secondary/50 focus:border-premium-text focus:outline-none shadow-sm"
                  />
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <div className="pt-6 border-t border-premium-border flex items-center justify-end gap-3">
                <Button variant="outline" size="md" type="button" onClick={onClose} disabled={submitting}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="submit" disabled={submitting}>
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Upload className="w-4 h-4" /> {formData.type === 'POV' ? 'Submit POV Video' : 'Submit Screenshot'}
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

  return createPortal(modalContent, document.body);
}
