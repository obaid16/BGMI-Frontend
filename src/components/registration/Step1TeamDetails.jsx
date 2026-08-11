'use client';

import React from 'react';
import { Shield, User, Phone, Mail, Upload, Image as ImageIcon } from 'lucide-react';
import Button from '../common/Button';

export default function Step1TeamDetails({ formData, updateFormData, onNext }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFormData({ teamLogo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-bgmi-border/60 pb-4 mb-6">
        <h3 className="text-xl font-bold font-display text-white uppercase flex items-center gap-2">
          <Shield className="w-5 h-5 text-bgmi-gold" /> Step 1: Team Details
        </h3>
        <p className="text-xs text-slate-400">Form your team and compete against the best squads in our championship.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            Team Name <span className="text-bgmi-gold">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Team Alpha"
            value={formData.teamName}
            onChange={(e) => updateFormData({ teamName: e.target.value })}
            className="w-full px-4 py-3 bg-bgmi-dark border border-bgmi-border rounded-xl text-white text-sm focus:outline-none focus:border-bgmi-gold transition-colors"
          />
        </div>

        {/* Team Logo Image Upload Area */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            Team Logo Image
          </label>
          <div className="relative">
            {formData.teamLogo ? (
              <div className="flex items-center gap-4 p-2.5 bg-bgmi-dark border border-bgmi-gold/50 rounded-xl">
                <img src={formData.teamLogo} alt="Team Logo" className="w-12 h-12 rounded-lg object-cover border border-bgmi-gold flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">Logo Uploaded</p>
                  <p className="text-[10px] text-emerald-400 font-semibold">Ready for submission</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateFormData({ teamLogo: '' })}
                  className="px-3 py-1.5 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 font-semibold transition-colors"
                >
                  Change
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-bgmi-border hover:border-bgmi-gold/60 rounded-xl p-3.5 cursor-pointer bg-bgmi-dark/40 hover:bg-bgmi-dark/80 transition-all text-center group">
                <div className="flex items-center gap-2 text-bgmi-gold mb-1">
                  <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200">Upload Team Logo Image</span>
                </div>
                <span className="text-[10px] text-slate-400">Click to select PNG, JPG, WEBP image file</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </label>
            )}
          </div>
        </div>

        {/* Captain Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            Captain Name <span className="text-bgmi-gold">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Rohan Sharma"
            value={formData.captainName}
            onChange={(e) => updateFormData({ captainName: e.target.value })}
            className="w-full px-4 py-3 bg-bgmi-dark border border-bgmi-border rounded-xl text-white text-sm focus:outline-none focus:border-bgmi-gold transition-colors"
          />
        </div>

        {/* Contact Phone */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            Contact Number (WhatsApp) <span className="text-bgmi-gold">*</span>
          </label>
          <input
            type="tel"
            required
            placeholder="+91 98765 43210"
            value={formData.captainPhone}
            onChange={(e) => updateFormData({ captainPhone: e.target.value })}
            className="w-full px-4 py-3 bg-bgmi-dark border border-bgmi-border rounded-xl text-white text-sm focus:outline-none focus:border-bgmi-gold transition-colors"
          />
        </div>

        {/* Contact Email */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            Official Student Email <span className="text-bgmi-gold">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="rohan.sharma@college.ac.in"
            value={formData.captainEmail}
            onChange={(e) => updateFormData({ captainEmail: e.target.value })}
            className="w-full px-4 py-3 bg-bgmi-dark border border-bgmi-border rounded-xl text-white text-sm focus:outline-none focus:border-bgmi-gold transition-colors"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-bgmi-border/60 flex justify-end">
        <Button type="submit" variant="primary" size="md">
          Proceed to Players →
        </Button>
      </div>
    </form>
  );
}
