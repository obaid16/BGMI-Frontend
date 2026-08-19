'use client';

import React, { useState } from 'react';
import { Shield, Mail, Phone, User, Upload, Image as ImageIcon, X } from 'lucide-react';
import Button from '../common/Button';

export default function Step1TeamDetails({ formData, updateFormData, onNext }) {
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.teamName?.trim()) newErrors.teamName = 'Squad name is required';
    if (!formData.captainName?.trim()) newErrors.captainName = 'Captain full name is required';
    if (!formData.captainPhone?.trim()) newErrors.captainPhone = 'WhatsApp phone number is required';
    if (!formData.captainEmail?.trim()) newErrors.captainEmail = 'Student email address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceed = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFormData({ teamLogo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <form onSubmit={handleProceed} className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-200 dark:border-bgmi-border/60 pb-4 mb-6">
        <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white uppercase flex items-center gap-2">
          <Shield className="w-5 h-5 text-bgmi-red" /> Step 1: Squad & Captain Overview
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Enter your team identity and captain contact details.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* TEAM NAME */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Squad / Team Name <span className="text-bgmi-red">*</span>
          </label>
          <div className="relative">
            <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="e.g. GODLIKE ESPORTS"
              value={formData.teamName}
              onChange={(e) => updateFormData({ teamName: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-bgmi-dark border rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none transition-colors ${
                errors.teamName ? 'border-bgmi-red' : 'border-slate-300 dark:border-bgmi-border focus:border-bgmi-red'
              }`}
            />
          </div>
          {errors.teamName && <p className="text-[11px] text-bgmi-red font-bold">{errors.teamName}</p>}
        </div>

        {/* SQUAD / TEAM LOGO WITH DRAG & DROP AND URL */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Squad / Team Logo (Drag & Drop, Upload or Paste URL)
          </label>
          
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all bg-slate-100 dark:bg-bgmi-dark/60 ${
              isDragging
                ? 'border-bgmi-red bg-bgmi-red/10 scale-[1.01]'
                : 'border-slate-300 dark:border-bgmi-border hover:border-bgmi-red/60'
            }`}
          >
            {formData.teamLogo ? (
              <div className="flex items-center justify-between gap-4 p-2 bg-white dark:bg-bgmi-dark rounded-lg border border-slate-200 dark:border-bgmi-border">
                <div className="flex items-center gap-3">
                  <img
                    src={formData.teamLogo}
                    alt="Logo Preview"
                    className="w-12 h-12 object-cover rounded-lg border border-bgmi-red/60 shadow-sm"
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-400" /> Logo Attached
                    </p>
                    <p className="text-[10px] text-slate-500 truncate max-w-xs">Ready for roster registration</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateFormData({ teamLogo: '' })}
                  className="p-1.5 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Remove Logo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3 py-1">
                {/* Full-box Clickable File Overlay */}
                <div className="relative group cursor-pointer p-4 rounded-lg hover:bg-bgmi-red/5 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Click to upload team logo"
                  />
                  <div className="w-10 h-10 mx-auto rounded-full bg-slate-200 dark:bg-bgmi-surface flex items-center justify-center text-bgmi-red group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Drag & Drop your team logo here, or <span className="text-bgmi-red underline">browse file</span>
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Supports PNG, JPG, WEBP or paste URL below</p>
                  </div>
                </div>

                <div className="relative z-20">
                  <input
                    type="text"
                    placeholder="Or paste image URL (e.g. https://domain.com/logo.png)"
                    value={formData.teamLogo || ''}
                    onChange={(e) => updateFormData({ teamLogo: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-lg text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-bgmi-red"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CAPTAIN NAME */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Captain Full Name <span className="text-bgmi-red">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Full Name"
              value={formData.captainName}
              onChange={(e) => updateFormData({ captainName: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-bgmi-dark border rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none transition-colors ${
                errors.captainName ? 'border-bgmi-red' : 'border-slate-300 dark:border-bgmi-border focus:border-bgmi-red'
              }`}
            />
          </div>
          {errors.captainName && <p className="text-[11px] text-bgmi-red font-bold">{errors.captainName}</p>}
        </div>

        {/* CAPTAIN PHONE */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            WhatsApp Phone Number <span className="text-bgmi-red">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={formData.captainPhone}
              onChange={(e) => updateFormData({ captainPhone: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-bgmi-dark border rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none transition-colors ${
                errors.captainPhone ? 'border-bgmi-red' : 'border-slate-300 dark:border-bgmi-border focus:border-bgmi-red'
              }`}
            />
          </div>
          {errors.captainPhone && <p className="text-[11px] text-bgmi-red font-bold">{errors.captainPhone}</p>}
        </div>

        {/* CAPTAIN EMAIL */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Student Email Address <span className="text-bgmi-red">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              placeholder="captain@student.nit.ac.in"
              value={formData.captainEmail}
              onChange={(e) => updateFormData({ captainEmail: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-bgmi-dark border rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none transition-colors ${
                errors.captainEmail ? 'border-bgmi-red' : 'border-slate-300 dark:border-bgmi-border focus:border-bgmi-red'
              }`}
            />
          </div>
          {errors.captainEmail && <p className="text-[11px] text-bgmi-red font-bold">{errors.captainEmail}</p>}
        </div>

      </div>

      <div className="pt-6 border-t border-slate-200 dark:border-bgmi-border/60 flex justify-end">
        <Button type="submit" variant="primary" size="lg">
          PROCEED TO ROSTER SETUP →
        </Button>
      </div>
    </form>
  );
}
