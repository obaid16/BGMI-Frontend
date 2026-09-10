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
    <form onSubmit={handleProceed} className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-premium-border pb-6">
        <h3 className="text-2xl font-bold text-premium-text tracking-tight flex items-center gap-3">
          <Shield className="w-6 h-6 text-premium-text-secondary" /> Step 1: Squad & Captain Overview
        </h3>
        <p className="text-sm text-premium-text-secondary font-medium mt-2">Enter your team identity and captain contact details.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        
        {/* TEAM NAME */}
        <div className="space-y-2 sm:col-span-2">
          <label className="block text-[11px] font-bold uppercase tracking-widest text-premium-text-secondary">
            Squad / Team Name <span className="text-amber-600">*</span>
          </label>
          <div className="relative">
            <Shield className="w-4 h-4 text-premium-text-secondary absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. GODLIKE ESPORTS"
              value={formData.teamName}
              onChange={(e) => updateFormData({ teamName: e.target.value })}
              className={`w-full pl-12 pr-4 py-3.5 bg-premium-background border rounded-[16px] text-premium-text text-sm font-semibold focus:outline-none transition-colors shadow-sm ${
                errors.teamName ? 'border-amber-500' : 'border-premium-border focus:border-premium-text'
              }`}
            />
          </div>
          {errors.teamName && <p className="text-[11px] text-amber-600 font-semibold">{errors.teamName}</p>}
        </div>

        {/* SQUAD / TEAM LOGO WITH DRAG & DROP AND URL */}
        <div className="space-y-2 sm:col-span-2">
          <label className="block text-[11px] font-bold uppercase tracking-widest text-premium-text-secondary">
            Squad / Team Logo (Drag & Drop, Upload or Paste URL)
          </label>
          
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed rounded-[20px] p-6 text-center transition-all bg-premium-background ${
              isDragging
                ? 'border-premium-text bg-premium-surface-soft scale-[1.01]'
                : 'border-premium-border hover:border-premium-text/50'
            }`}
          >
            {formData.teamLogo ? (
              <div className="flex items-center justify-between gap-4 p-3 bg-premium-surface rounded-xl border border-premium-border">
                <div className="flex items-center gap-4">
                  <img
                    src={formData.teamLogo}
                    alt="Logo Preview"
                    className="w-14 h-14 object-cover rounded-[14px] border border-premium-border shadow-sm"
                  />
                  <div className="text-left">
                    <p className="text-sm font-bold text-premium-text flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-600" /> Logo Attached
                    </p>
                    <p className="text-[11px] text-premium-text-secondary truncate max-w-xs font-medium">Ready for roster registration</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateFormData({ teamLogo: '' })}
                  className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                  title="Remove Logo"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="space-y-4 py-2">
                {/* Full-box Clickable File Overlay */}
                <div className="relative group cursor-pointer p-4 rounded-xl hover:bg-premium-surface-soft transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Click to upload team logo"
                  />
                  <div className="w-12 h-12 mx-auto rounded-full bg-premium-surface-soft border border-premium-border flex items-center justify-center text-premium-text-secondary group-hover:text-black group-hover:scale-110 transition-all">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-premium-text">
                      Drag & Drop your team logo here, or <span className="underline decoration-premium-border underline-offset-4 hover:decoration-premium-text">browse file</span>
                    </p>
                    <p className="text-[11px] text-premium-text-secondary mt-1 font-medium">Supports PNG, JPG, WEBP or paste URL below</p>
                  </div>
                </div>

                <div className="relative z-20">
                  <input
                    type="text"
                    placeholder="Or paste image URL (e.g. https://domain.com/logo.png)"
                    value={formData.teamLogo || ''}
                    onChange={(e) => updateFormData({ teamLogo: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-premium-border rounded-[14px] text-premium-text text-sm font-medium focus:outline-none focus:border-premium-text transition-colors shadow-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CAPTAIN NAME */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold uppercase tracking-widest text-premium-text-secondary">
            Captain Full Name <span className="text-amber-600">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-premium-text-secondary absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Full Name"
              value={formData.captainName}
              onChange={(e) => updateFormData({ captainName: e.target.value })}
              className={`w-full pl-12 pr-4 py-3.5 bg-premium-background border rounded-[16px] text-premium-text text-sm font-semibold focus:outline-none transition-colors shadow-sm ${
                errors.captainName ? 'border-amber-500' : 'border-premium-border focus:border-premium-text'
              }`}
            />
          </div>
          {errors.captainName && <p className="text-[11px] text-amber-600 font-semibold">{errors.captainName}</p>}
        </div>

        {/* CAPTAIN PHONE */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold uppercase tracking-widest text-premium-text-secondary">
            WhatsApp Phone Number <span className="text-amber-600">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-premium-text-secondary absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={formData.captainPhone}
              onChange={(e) => updateFormData({ captainPhone: e.target.value })}
              className={`w-full pl-12 pr-4 py-3.5 bg-premium-background border rounded-[16px] text-premium-text text-sm font-semibold focus:outline-none transition-colors shadow-sm ${
                errors.captainPhone ? 'border-amber-500' : 'border-premium-border focus:border-premium-text'
              }`}
            />
          </div>
          {errors.captainPhone && <p className="text-[11px] text-amber-600 font-semibold">{errors.captainPhone}</p>}
        </div>

        {/* CAPTAIN EMAIL */}
        <div className="space-y-2 sm:col-span-2">
          <label className="block text-[11px] font-bold uppercase tracking-widest text-premium-text-secondary">
            Student Email Address <span className="text-amber-600">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-premium-text-secondary absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="captain@student.nit.ac.in"
              value={formData.captainEmail}
              onChange={(e) => updateFormData({ captainEmail: e.target.value })}
              className={`w-full pl-12 pr-4 py-3.5 bg-premium-background border rounded-[16px] text-premium-text text-sm font-semibold focus:outline-none transition-colors shadow-sm ${
                errors.captainEmail ? 'border-amber-500' : 'border-premium-border focus:border-premium-text'
              }`}
            />
          </div>
          {errors.captainEmail && <p className="text-[11px] text-amber-600 font-semibold">{errors.captainEmail}</p>}
        </div>

      </div>

      <div className="pt-8 border-t border-premium-border flex justify-end">
        <Button type="submit" variant="primary" size="lg">
          Proceed to Roster Setup
        </Button>
      </div>
    </form>
  );
}
