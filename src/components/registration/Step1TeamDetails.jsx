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
    <form onSubmit={handleProceed} className="space-y-6 animate-in fade-in duration-300 font-sans">
      <div className="border-b border-[#E7E3DA] dark:border-[#1E2638] pb-4 mb-6">
        <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white uppercase flex items-center gap-2">
          <Shield className="w-5 h-5 text-bgmi-red" /> Step 1: Squad & Captain Overview
        </h3>
        <p className="text-xs text-slate-500 font-normal">Enter your squad identity and captain contact details.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* TEAM NAME */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Squad / Team Name <span className="text-bgmi-red">*</span>
          </label>
          <div className="relative">
            <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. GODLIKE ESPORTS"
              value={formData.teamName}
              onChange={(e) => updateFormData({ teamName: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-[#FAF8F5] dark:bg-[#0B0E14] border rounded-2xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none transition-colors shadow-editorial-sm ${
                errors.teamName ? 'border-red-500' : 'border-[#E7E3DA] dark:border-[#1E2638] focus:border-bgmi-red'
              }`}
            />
          </div>
          {errors.teamName && <p className="text-[11px] text-red-500 font-bold">{errors.teamName}</p>}
        </div>

        {/* SQUAD / TEAM LOGO */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Squad Logo (Upload or Drag & Drop)
          </label>
          
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed rounded-2xl p-4 text-center transition-all bg-[#FAF8F5] dark:bg-[#0B0E14] ${
              isDragging
                ? 'border-bgmi-red bg-red-500/5'
                : 'border-[#E7E3DA] dark:border-[#1E2638] hover:border-slate-400 dark:hover:border-white/20'
            }`}
          >
            {formData.teamLogo ? (
              <div className="flex items-center justify-center gap-4">
                <img
                  src={formData.teamLogo}
                  alt="Squad Logo"
                  className="w-16 h-16 rounded-xl object-cover border border-[#E7E3DA] dark:border-[#1E2638]"
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Squad Logo Loaded</p>
                  <button
                    type="button"
                    onClick={() => updateFormData({ teamLogo: '' })}
                    className="text-xs text-red-500 hover:underline flex items-center gap-1 mt-1 font-semibold"
                  >
                    <X className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-6 h-6 mx-auto text-slate-400" />
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Click to upload or drag squad logo</p>
                <p className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 5MB</p>
              </div>
            )}
          </div>
        </div>

        {/* CAPTAIN FULL NAME */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Captain Full Name <span className="text-bgmi-red">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. Ramzan Shaikh"
              value={formData.captainName}
              onChange={(e) => updateFormData({ captainName: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-[#FAF8F5] dark:bg-[#0B0E14] border rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none transition-colors shadow-editorial-sm ${
                errors.captainName ? 'border-red-500' : 'border-[#E7E3DA] dark:border-[#1E2638] focus:border-bgmi-red'
              }`}
            />
          </div>
          {errors.captainName && <p className="text-[11px] text-red-500 font-bold">{errors.captainName}</p>}
        </div>

        {/* CAPTAIN WHATSAPP */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Captain WhatsApp <span className="text-bgmi-red">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.captainPhone}
              onChange={(e) => updateFormData({ captainPhone: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-[#FAF8F5] dark:bg-[#0B0E14] border rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none transition-colors shadow-editorial-sm ${
                errors.captainPhone ? 'border-red-500' : 'border-[#E7E3DA] dark:border-[#1E2638] focus:border-bgmi-red'
              }`}
            />
          </div>
          {errors.captainPhone && <p className="text-[11px] text-red-500 font-bold">{errors.captainPhone}</p>}
        </div>

        {/* CAPTAIN EMAIL */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Student Email Address <span className="text-bgmi-red">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="captain@nexcore.edu.in"
              value={formData.captainEmail}
              onChange={(e) => updateFormData({ captainEmail: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-[#FAF8F5] dark:bg-[#0B0E14] border rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none transition-colors shadow-editorial-sm ${
                errors.captainEmail ? 'border-red-500' : 'border-[#E7E3DA] dark:border-[#1E2638] focus:border-bgmi-red'
              }`}
            />
          </div>
          {errors.captainEmail && <p className="text-[11px] text-red-500 font-bold">{errors.captainEmail}</p>}
        </div>

      </div>

      <div className="pt-6 border-t border-[#E7E3DA] dark:border-[#1E2638] flex justify-end">
        <Button type="submit" variant="primary" size="md">
          Continue to Player Rosters →
        </Button>
      </div>
    </form>
  );
}
